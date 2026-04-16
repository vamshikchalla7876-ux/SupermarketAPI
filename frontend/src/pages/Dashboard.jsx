import { useEffect, useState } from "react";
import { executeRequest } from "../api/client";
import { authPresets } from "../config/modules";

const emptyOverview = { customers: [], inventory: [], orders: [], billing: [], shipping: [] };
const defaultCredentials = { username: "admin", password: "admin123" };
const membershipOptions = ["SILVER", "GOLD", "PLATINUM"];
const categoryOptions = ["Produce", "Dairy", "Groceries", "Beverages", "Home Care", "Bakery", "Frozen"];

const normalizeList = (value) => (Array.isArray(value) ? value : []);
const toNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
const roundMoney = (value) => Math.round(toNumber(value) * 100) / 100;
const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(toNumber(value));
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(toNumber(value));
const formatLabel = (value) =>
  value
    ? String(value)
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Unknown";
const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`))
    : "--";
const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value))
    : "--";

function normalizeOverview(data) {
  return {
    customers: normalizeList(data?.customers),
    inventory: normalizeList(data?.inventory),
    orders: normalizeList(data?.orders),
    billing: normalizeList(data?.billing),
    shipping: normalizeList(data?.shipping)
  };
}

function sortByDateDescending(items, key) {
  return [...items].sort((left, right) => {
    const leftValue = left?.[key] ? new Date(`${left[key]}T00:00:00`).getTime() : 0;
    const rightValue = right?.[key] ? new Date(`${right[key]}T00:00:00`).getTime() : 0;
    return rightValue - leftValue;
  });
}

function buildNextId(values, prefix, start, padding) {
  const highest = values.reduce((maxValue, currentValue) => {
    const match = String(currentValue ?? "").match(/(\d+)$/);
    return match ? Math.max(maxValue, Number(match[1])) : maxValue;
  }, start - 1);
  return `${prefix}-${String(highest + 1).padStart(padding, "0")}`;
}

function getErrorMessage(error) {
  const responseData = error?.response?.data;
  if (typeof responseData === "string" && responseData.trim()) return responseData;
  if (responseData?.message) return responseData.message;
  if (error?.response?.status) return `Request failed with status ${error.response.status}.`;
  return error?.message || "Request failed.";
}

function deriveOrderDraft(orderForm, inventory) {
  const inventoryBySku = Object.fromEntries(normalizeList(inventory).map((item) => [item.sku, item]));
  const items = normalizeList(orderForm.items)
    .map((row, index) => {
      const product = inventoryBySku[row.sku];
      const quantity = Math.max(1, Math.floor(toNumber(row.quantity)));
      if (!product) return { key: `${index}`, valid: false, sku: row.sku, quantity, lineTotal: 0 };
      const unitPrice = roundMoney(product.unitPrice);
      return {
        key: `${product.sku}-${index}`,
        valid: true,
        sku: product.sku,
        productName: product.name,
        quantity,
        unitPrice,
        available: toNumber(product.quantityInStock),
        lineTotal: roundMoney(unitPrice * quantity)
      };
    })
    .filter((item) => item.sku);
  const validItems = items.filter((item) => item.valid);
  const subtotal = roundMoney(validItems.reduce((sum, item) => sum + item.lineTotal, 0));
  const tax = roundMoney(subtotal * 0.1);
  return { items, validItems, subtotal, tax, total: roundMoney(subtotal + tax) };
}

function StatCard({ label, value, helper, tone }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{helper}</p>
    </article>
  );
}

function SectionCard({ title, subtitle, className = "", action, children }) {
  return (
    <section className={`surface-card section-card ${className}`.trim()}>
      <div className="section-head">
        <div>
          <p className="section-kicker">{subtitle}</p>
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Dashboard() {
  const [baseUrl, setBaseUrl] = useState("");
  const [credentials, setCredentials] = useState(defaultCredentials);
  const [activePreset, setActivePreset] = useState("admin");
  const [overview, setOverview] = useState(emptyOverview);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState("order");
  const [formsPrimed, setFormsPrimed] = useState(false);
  const [submittingKey, setSubmittingKey] = useState("");
  const [customerForm, setCustomerForm] = useState({ id: "CUST-1001", name: "", email: "", phone: "", membershipTier: "GOLD", address: "" });
  const [inventoryForm, setInventoryForm] = useState({ sku: "SKU-ITEM-001", name: "", category: "Groceries", quantityInStock: 25, unitPrice: 0, reorderRequired: false });
  const [orderForm, setOrderForm] = useState({ orderId: "ORD-5001", customerId: "", status: "CREATED", items: [{ sku: "", quantity: 1 }] });

  const customers = normalizeList(overview.customers);
  const inventory = normalizeList(overview.inventory);
  const orders = normalizeList(overview.orders);
  const billing = normalizeList(overview.billing);
  const shipping = normalizeList(overview.shipping);
  const customerNameById = Object.fromEntries(customers.map((customer) => [customer.id, customer.name]));
  const selectedPreset = authPresets.find((preset) => preset.key === activePreset) ?? authPresets[0];
  const lowStockItems = [...inventory].filter((item) => item.reorderRequired || toNumber(item.quantityInStock) <= 20).sort((a, b) => toNumber(a.quantityInStock) - toNumber(b.quantityInStock));
  const orderDraft = deriveOrderDraft(orderForm, inventory);
  const inventoryBoard = [...inventory].sort((a, b) => toNumber(a.quantityInStock) - toNumber(b.quantityInStock)).slice(0, 8);
  const recentOrders = sortByDateDescending(orders, "orderDate").slice(0, 6);
  const pendingBills = sortByDateDescending(billing.filter((record) => record.paymentStatus !== "PAID"), "billingDate").slice(0, 5);
  const shipmentBoard = [...shipping].sort((a, b) => {
    const priority = { READY_TO_SHIP: 0, IN_TRANSIT: 1, DELIVERED: 2 };
    return (priority[a.status] ?? 99) - (priority[b.status] ?? 99);
  }).slice(0, 5);
  const totalRevenue = billing.reduce((sum, record) => sum + toNumber(record.amount), 0);
  const pendingRevenue = pendingBills.reduce((sum, record) => sum + toNumber(record.amount), 0);
  const averageBasket = orders.length ? orders.reduce((sum, order) => sum + toNumber(order.total), 0) / orders.length : 0;

  function nextCustomerId(data) { return buildNextId(normalizeList(data.customers).map((item) => item.id), "CUST", 1001, 4); }
  function nextInventorySku(data) { return buildNextId(normalizeList(data.inventory).map((item) => item.sku), "SKU-ITEM", 1, 3); }
  function nextOrderId(data) { return buildNextId(normalizeList(data.orders).map((item) => item.orderId), "ORD", 5001, 4); }
  function resetCustomerForm(data) { setCustomerForm({ id: nextCustomerId(data), name: "", email: "", phone: "", membershipTier: "GOLD", address: "" }); }
  function resetInventoryForm(data) { setInventoryForm({ sku: nextInventorySku(data), name: "", category: "Groceries", quantityInStock: 25, unitPrice: 0, reorderRequired: false }); }
  function resetOrderForm(data) { setOrderForm({ orderId: nextOrderId(data), customerId: normalizeList(data.customers)[0]?.id ?? "", status: "CREATED", items: [{ sku: normalizeList(data.inventory)[0]?.sku ?? "", quantity: 1 }] }); }
  function primeForms(data) { resetCustomerForm(data); resetInventoryForm(data); resetOrderForm(data); setFormsPrimed(true); }

  async function loadOverview(options = {}) {
    setIsRefreshing(true);
    setErrorMessage("");
    try {
      const result = await executeRequest(baseUrl, credentials, { method: "get", url: "/supermarket/overview" });
      const normalized = normalizeOverview(result.data);
      setOverview(normalized);
      setLastUpdated(new Date().toISOString());
      if (options.primeForms) primeForms(normalized);
      return normalized;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadOverview({ primeForms: true });
  }, []);

  async function submitRequest(key, request, successMessage, resetForm) {
    setSubmittingKey(key);
    setActionMessage(null);
    try {
      await executeRequest(baseUrl, credentials, request);
      const latest = await loadOverview({ primeForms: !formsPrimed });
      if (latest) resetForm(latest);
      setActionMessage({ tone: "success", text: successMessage });
    } catch (error) {
      setActionMessage({ tone: "error", text: getErrorMessage(error) });
    } finally {
      setSubmittingKey("");
    }
  }

  function handleCustomerSubmit(event) {
    event.preventDefault();
    submitRequest("customer", { method: "post", url: "/customers", body: { ...customerForm } }, `Customer ${customerForm.name} added.`, resetCustomerForm);
  }

  function handleInventorySubmit(event) {
    event.preventDefault();
    submitRequest(
      "inventory",
      { method: "post", url: "/inventory", body: { ...inventoryForm, quantityInStock: Math.max(0, Math.floor(toNumber(inventoryForm.quantityInStock))), unitPrice: roundMoney(inventoryForm.unitPrice), reorderRequired: Boolean(inventoryForm.reorderRequired) } },
      `${inventoryForm.name} added to inventory.`,
      resetInventoryForm
    );
  }

  function handleOrderSubmit(event) {
    event.preventDefault();
    if (!orderForm.customerId) return setActionMessage({ tone: "error", text: "Choose a customer before creating an order." });
    if (orderDraft.validItems.length === 0) return setActionMessage({ tone: "error", text: "Add at least one valid inventory item." });
    submitRequest(
      "order",
      {
        method: "post",
        url: "/orders",
        body: {
          orderId: orderForm.orderId,
          customerId: orderForm.customerId,
          items: orderDraft.validItems.map((item) => ({ sku: item.sku, productName: item.productName, quantity: item.quantity, unitPrice: item.unitPrice, lineTotal: item.lineTotal })),
          subtotal: orderDraft.subtotal,
          tax: orderDraft.tax,
          total: orderDraft.total,
          status: orderForm.status,
          orderDate: new Date().toISOString().slice(0, 10)
        }
      },
      `Order ${orderForm.orderId} created.`,
      resetOrderForm
    );
  }

  function addOrderItemRow() {
    setOrderForm((current) => ({ ...current, items: [...current.items, { sku: inventory[0]?.sku ?? "", quantity: 1 }] }));
  }

  function updateOrderItem(index, field, value) {
    setOrderForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: field === "quantity" ? Math.max(1, Math.floor(toNumber(value))) : value } : item)
    }));
  }

  function removeOrderItem(index) {
    setOrderForm((current) => ({ ...current, items: current.items.length === 1 ? current.items : current.items.filter((_, itemIndex) => itemIndex !== index) }));
  }

  return (
    <div className="app-shell">
      <header className="hero-layout">
        <section className="surface-card masthead-card">
          <div className="section-tag">Storefront Control</div>
          <h1>Retail operations, not a developer console.</h1>
          <p>Add inventory, register customers, raise live orders, and watch payments and dispatch from one supermarket workspace.</p>
          <div className="hero-inline-stats">
            <div><span>Open orders</span><strong>{formatNumber(orders.filter((order) => order.status !== "FULFILLED").length)}</strong></div>
            <div><span>Pending cashflow</span><strong>{formatCurrency(pendingRevenue)}</strong></div>
            <div><span>Shelf attention</span><strong>{formatNumber(lowStockItems.length)} SKUs</strong></div>
          </div>
        </section>

        <aside className="surface-card control-card">
          <div className="section-head">
            <div><p className="section-kicker">Connection</p><h2>Manager Access</h2></div>
            <button className="secondary-button" onClick={() => loadOverview({ primeForms: !formsPrimed })} disabled={isRefreshing}>{isRefreshing ? "Refreshing..." : "Refresh"}</button>
          </div>
          <label className="field"><span>Base URL</span><input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="Leave empty to use the Vite proxy" /></label>
          <label className="field"><span>Role preset</span><select value={activePreset} onChange={(event) => { const preset = authPresets.find((item) => item.key === event.target.value); setActivePreset(event.target.value); if (preset) setCredentials({ username: preset.username, password: preset.password }); }}>{authPresets.map((preset) => <option key={preset.key} value={preset.key}>{preset.label}</option>)}</select></label>
          <div className="credentials-grid">
            <label className="field"><span>Username</span><input value={credentials.username} onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))} /></label>
            <label className="field"><span>Password</span><input type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} /></label>
          </div>
          <div className="notice-strip"><div className={errorMessage ? "notice notice-error" : "notice"}><span className="notice-label">{errorMessage ? "Issue" : "Live status"}</span><strong>{errorMessage ? errorMessage : `Connected as ${selectedPreset.label}. Last sync ${formatDateTime(lastUpdated)}.`}</strong></div></div>
        </aside>
      </header>

      <section className="kpi-grid">
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} helper={`${formatNumber(billing.length)} invoices`} tone="leaf" />
        <StatCard label="Average Basket" value={formatCurrency(averageBasket)} helper={`${formatNumber(orders.length)} orders`} tone="sun" />
        <StatCard label="Inventory" value={formatNumber(inventory.length)} helper={`${formatNumber(lowStockItems.length)} low stock`} tone="coral" />
        <StatCard label="Customers" value={formatNumber(customers.length)} helper={`${formatNumber(customers.filter((customer) => customer.membershipTier === "PLATINUM").length)} platinum`} tone="berry" />
        <StatCard label="Shipments" value={formatNumber(shipping.filter((item) => item.status !== "DELIVERED").length)} helper={`${formatNumber(shipping.length)} total`} tone="azure" />
      </section>

      <main className="workspace-layout">
        <aside className="sidebar-stack">
          <SectionCard title="Action Studio" subtitle="Run Store Workflows">
            <div className="workspace-tabs">
              <button className={activeWorkspace === "order" ? "tab-button active" : "tab-button"} onClick={() => setActiveWorkspace("order")}>Create Order</button>
              <button className={activeWorkspace === "inventory" ? "tab-button active" : "tab-button"} onClick={() => setActiveWorkspace("inventory")}>Add Inventory</button>
              <button className={activeWorkspace === "customer" ? "tab-button active" : "tab-button"} onClick={() => setActiveWorkspace("customer")}>Add Customer</button>
            </div>
            {actionMessage ? <div className={actionMessage.tone === "error" ? "action-banner action-banner-error" : "action-banner action-banner-success"}>{actionMessage.text}</div> : null}
            {activeWorkspace === "order" ? (
              <form className="workspace-form" onSubmit={handleOrderSubmit}>
                <div className="form-grid">
                  <label className="field"><span>Order ID</span><input value={orderForm.orderId} onChange={(event) => setOrderForm((current) => ({ ...current, orderId: event.target.value }))} /></label>
                  <label className="field"><span>Customer</span><select value={orderForm.customerId} onChange={(event) => setOrderForm((current) => ({ ...current, customerId: event.target.value }))}><option value="">Select a customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} ({customer.id})</option>)}</select></label>
                </div>
                <div className="line-item-list">
                  {orderForm.items.map((row, index) => {
                    const product = inventory.find((item) => item.sku === row.sku);
                    return (
                      <div key={`${index}-${row.sku}`} className="line-item-card">
                        <div className="line-item-row">
                          <label className="field"><span>Product</span><select value={row.sku} onChange={(event) => updateOrderItem(index, "sku", event.target.value)}><option value="">Choose inventory item</option>{inventory.map((item) => <option key={item.sku} value={item.sku}>{item.name} ({item.sku})</option>)}</select></label>
                          <label className="field qty-field"><span>Qty</span><input type="number" min="1" value={row.quantity} onChange={(event) => updateOrderItem(index, "quantity", event.target.value)} /></label>
                          <button type="button" className="ghost-button danger-button" onClick={() => removeOrderItem(index)} disabled={orderForm.items.length === 1}>Remove</button>
                        </div>
                        <div className="line-item-meta">{product ? <><span>{formatCurrency(product.unitPrice)} each</span><span>{product.quantityInStock} in stock</span><strong>{formatCurrency(toNumber(product.unitPrice) * toNumber(row.quantity))}</strong></> : <span>Select a valid inventory item.</span>}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="form-actions"><button type="button" className="ghost-button" onClick={addOrderItemRow}>Add Another Item</button></div>
                <div className="preview-card"><div className="preview-head"><strong>Order Preview</strong><span>{orderDraft.validItems.length} valid line items</span></div><div className="preview-list"><div><span>Subtotal</span><strong>{formatCurrency(orderDraft.subtotal)}</strong></div><div><span>Tax</span><strong>{formatCurrency(orderDraft.tax)}</strong></div><div><span>Total</span><strong>{formatCurrency(orderDraft.total)}</strong></div></div></div>
                <div className="form-actions"><button type="submit" className="primary-button" disabled={submittingKey === "order"}>{submittingKey === "order" ? "Creating..." : "Create Order"}</button><button type="button" className="ghost-button" onClick={() => resetOrderForm(overview)}>Reset</button></div>
              </form>
            ) : null}
            {activeWorkspace === "inventory" ? (
              <form className="workspace-form" onSubmit={handleInventorySubmit}>
                <div className="form-grid">
                  <label className="field"><span>SKU</span><input value={inventoryForm.sku} onChange={(event) => setInventoryForm((current) => ({ ...current, sku: event.target.value }))} /></label>
                  <label className="field"><span>Item Name</span><input value={inventoryForm.name} onChange={(event) => setInventoryForm((current) => ({ ...current, name: event.target.value }))} /></label>
                  <label className="field"><span>Category</span><select value={inventoryForm.category} onChange={(event) => setInventoryForm((current) => ({ ...current, category: event.target.value }))}>{categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                  <label className="field"><span>Opening Stock</span><input type="number" min="0" value={inventoryForm.quantityInStock} onChange={(event) => setInventoryForm((current) => ({ ...current, quantityInStock: event.target.value }))} /></label>
                  <label className="field"><span>Unit Price</span><input type="number" min="0" step="0.01" value={inventoryForm.unitPrice} onChange={(event) => setInventoryForm((current) => ({ ...current, unitPrice: event.target.value }))} /></label>
                  <label className="field"><span>Reorder Flag</span><select value={inventoryForm.reorderRequired ? "yes" : "no"} onChange={(event) => setInventoryForm((current) => ({ ...current, reorderRequired: event.target.value === "yes" }))}><option value="no">No</option><option value="yes">Yes</option></select></label>
                </div>
                <div className="form-actions"><button type="submit" className="primary-button" disabled={submittingKey === "inventory"}>{submittingKey === "inventory" ? "Saving..." : "Add Inventory"}</button><button type="button" className="ghost-button" onClick={() => resetInventoryForm(overview)}>Reset</button></div>
              </form>
            ) : null}
            {activeWorkspace === "customer" ? (
              <form className="workspace-form" onSubmit={handleCustomerSubmit}>
                <div className="form-grid">
                  <label className="field"><span>Customer ID</span><input value={customerForm.id} onChange={(event) => setCustomerForm((current) => ({ ...current, id: event.target.value }))} /></label>
                  <label className="field"><span>Full Name</span><input value={customerForm.name} onChange={(event) => setCustomerForm((current) => ({ ...current, name: event.target.value }))} /></label>
                  <label className="field"><span>Email</span><input type="email" value={customerForm.email} onChange={(event) => setCustomerForm((current) => ({ ...current, email: event.target.value }))} /></label>
                  <label className="field"><span>Phone</span><input value={customerForm.phone} onChange={(event) => setCustomerForm((current) => ({ ...current, phone: event.target.value }))} /></label>
                  <label className="field"><span>Membership</span><select value={customerForm.membershipTier} onChange={(event) => setCustomerForm((current) => ({ ...current, membershipTier: event.target.value }))}>{membershipOptions.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}</select></label>
                  <label className="field field-span-two"><span>Address</span><input value={customerForm.address} onChange={(event) => setCustomerForm((current) => ({ ...current, address: event.target.value }))} /></label>
                </div>
                <div className="form-actions"><button type="submit" className="primary-button" disabled={submittingKey === "customer"}>{submittingKey === "customer" ? "Saving..." : "Add Customer"}</button><button type="button" className="ghost-button" onClick={() => resetCustomerForm(overview)}>Reset</button></div>
              </form>
            ) : null}
          </SectionCard>

          <SectionCard title="Store Alerts" subtitle="Act First">
            {lowStockItems.length > 0 || pendingBills.length > 0 ? (
              <div className="alert-stack">
                {lowStockItems.slice(0, 3).map((item) => <article key={item.sku} className="alert-card alert-danger"><strong>{item.name} needs replenishment</strong><p>{item.quantityInStock} units left in {item.category}</p></article>)}
                {pendingBills.slice(0, 2).map((bill) => <article key={bill.invoiceId} className="alert-card alert-warning"><strong>{bill.invoiceId} still pending</strong><p>{formatCurrency(bill.amount)} via {formatLabel(bill.paymentMethod)}</p></article>)}
              </div>
            ) : <div className="empty-state">No immediate alerts on floor or billing.</div>}
          </SectionCard>
        </aside>

        <section className="board-grid">
          <SectionCard title="Inventory Board" subtitle="Live Shelf Position">{inventoryBoard.length > 0 ? <div className="table-list">{inventoryBoard.map((item) => <article key={item.sku} className="table-row"><div><strong>{item.name}</strong><p>{item.sku} | {item.category}</p></div><div className="table-meta"><span>{formatCurrency(item.unitPrice)}</span><span className={item.reorderRequired || toNumber(item.quantityInStock) <= 20 ? "pill pill-alert" : "pill"}>{item.quantityInStock} in stock</span></div></article>)}</div> : <div className="empty-state">Inventory items will show here.</div>}</SectionCard>
          <SectionCard title="Order Queue" subtitle="Checkout and Packing">{recentOrders.length > 0 ? <div className="table-list">{recentOrders.map((order) => <article key={order.orderId} className="table-row"><div><div className="row-title"><strong>{order.orderId}</strong><span className={`status-badge status-${order.status?.toLowerCase()}`}>{formatLabel(order.status)}</span></div><p>{customerNameById[order.customerId] ?? order.customerId}</p></div><div className="table-meta"><span>{formatDate(order.orderDate)}</span><strong>{formatCurrency(order.total)}</strong></div></article>)}</div> : <div className="empty-state">Orders will show here after creation.</div>}</SectionCard>
          <SectionCard title="Customer Desk" subtitle="Membership and Contact">{customers.length > 0 ? <div className="table-list">{customers.slice(0, 6).map((customer) => <article key={customer.id} className="table-row"><div><div className="row-title"><strong>{customer.name}</strong><span className="pill">{formatLabel(customer.membershipTier)}</span></div><p>{customer.email}</p></div><div className="table-meta"><span>{customer.phone}</span></div></article>)}</div> : <div className="empty-state">Customer records will show here.</div>}</SectionCard>
          <SectionCard title="Payment Watch" subtitle="Billing Follow-up">{billing.length > 0 ? <div className="table-list">{sortByDateDescending(billing, "billingDate").slice(0, 5).map((record) => <article key={record.invoiceId} className="table-row"><div><div className="row-title"><strong>{record.invoiceId}</strong><span className={record.paymentStatus === "PAID" ? "pill pill-success" : "pill pill-alert"}>{formatLabel(record.paymentStatus)}</span></div><p>{record.orderId}</p></div><div className="table-meta"><span>{formatLabel(record.paymentMethod)}</span><strong>{formatCurrency(record.amount)}</strong></div></article>)}</div> : <div className="empty-state">Billing records will show here.</div>}</SectionCard>
          <SectionCard title="Dispatch Board" subtitle="Carrier Movement">{shipmentBoard.length > 0 ? <div className="table-list">{shipmentBoard.map((record) => <article key={record.shipmentId} className="table-row"><div><div className="row-title"><strong>{record.shipmentId}</strong><span className={`status-badge status-${record.status?.toLowerCase()}`}>{formatLabel(record.status)}</span></div><p>{record.carrier}</p></div><div className="table-meta"><span>{formatDate(record.estimatedDeliveryDate)}</span><span>{record.destination}</span></div></article>)}</div> : <div className="empty-state">Shipment records will show here.</div>}</SectionCard>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
