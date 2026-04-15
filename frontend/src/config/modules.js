const today = "2026-04-15";

export const authPresets = [
  { key: "admin", label: "Admin", username: "admin", password: "admin123" },
  {
    key: "customer_manager",
    label: "Customer Manager",
    username: "customer_manager",
    password: "cust123"
  },
  {
    key: "inventory_manager",
    label: "Inventory Manager",
    username: "inventory_manager",
    password: "inv123"
  },
  {
    key: "order_manager",
    label: "Order Manager",
    username: "order_manager",
    password: "order123"
  },
  {
    key: "billing_manager",
    label: "Billing Manager",
    username: "billing_manager",
    password: "bill123"
  },
  {
    key: "shipping_manager",
    label: "Shipping Manager",
    username: "shipping_manager",
    password: "ship123"
  }
];

export const moduleConfigs = [
  {
    key: "customers",
    title: "Customers",
    accent: "var(--accent-leaf)",
    idLabel: "Customer ID",
    exampleId: "CUST-1001",
    basePath: "/customers",
    requiredRole: "ADMIN or CUSTOMER_EDITOR for create and update",
    samplePayload: {
      id: "CUST-2001",
      name: "Priya Nair",
      email: "priya.nair@example.com",
      phone: "+91-9000000001",
      membershipTier: "GOLD",
      address: "21 Residency Road, Chennai"
    },
    updatePayload: {
      id: "IGNORED-ID",
      name: "Priya Nair",
      email: "priya.nair@example.com",
      phone: "+91-9000000002",
      membershipTier: "PLATINUM",
      address: "99 Anna Salai, Chennai"
    }
  },
  {
    key: "inventory",
    title: "Inventory",
    accent: "var(--accent-coral)",
    idLabel: "SKU",
    exampleId: "SKU-MILK-002",
    basePath: "/inventory",
    requiredRole: "ADMIN or INVENTORY_EDITOR for create and update",
    samplePayload: {
      sku: "SKU-TEA-005",
      name: "Masala Tea",
      category: "Beverages",
      quantityInStock: 40,
      unitPrice: 4.25,
      reorderRequired: false
    },
    updatePayload: {
      sku: "IGNORED-SKU",
      name: "Masala Tea Premium",
      category: "Beverages",
      quantityInStock: 15,
      unitPrice: 4.75,
      reorderRequired: true
    }
  },
  {
    key: "orders",
    title: "Orders",
    accent: "var(--accent-sun)",
    idLabel: "Order ID",
    exampleId: "ORD-5001",
    basePath: "/orders",
    requiredRole: "ADMIN or ORDER_EDITOR for create and update",
    samplePayload: {
      orderId: "ORD-6001",
      customerId: "CUST-1001",
      items: [
        {
          sku: "SKU-RICE-003",
          productName: "Basmati Rice 5kg",
          quantity: 2,
          unitPrice: 12.99,
          lineTotal: 25.98
        }
      ],
      subtotal: 25.98,
      tax: 2.6,
      total: 28.58,
      status: "CREATED",
      orderDate: today
    },
    updatePayload: {
      orderId: "IGNORED-ORDER",
      customerId: "CUST-1001",
      items: [
        {
          sku: "SKU-RICE-003",
          productName: "Basmati Rice 5kg",
          quantity: 3,
          unitPrice: 12.99,
          lineTotal: 38.97
        }
      ],
      subtotal: 38.97,
      tax: 3.9,
      total: 42.87,
      status: "CONFIRMED",
      orderDate: today
    }
  },
  {
    key: "billing",
    title: "Billing",
    accent: "var(--accent-berry)",
    idLabel: "Invoice ID",
    exampleId: "INV-7001",
    basePath: "/billing",
    requiredRole: "ADMIN or BILLING_EDITOR for create and update",
    samplePayload: {
      invoiceId: "INV-8001",
      orderId: "ORD-5001",
      customerId: "CUST-1001",
      amount: 18.25,
      paymentMethod: "CARD",
      paymentStatus: "PENDING",
      billingDate: today
    },
    updatePayload: {
      invoiceId: "IGNORED-INVOICE",
      orderId: "ORD-5001",
      customerId: "CUST-1001",
      amount: 18.25,
      paymentMethod: "UPI",
      paymentStatus: "PAID",
      billingDate: today
    }
  },
  {
    key: "shipping",
    title: "Shipping",
    accent: "var(--accent-azure)",
    idLabel: "Shipment ID",
    exampleId: "SHIP-9001",
    basePath: "/shipping",
    requiredRole: "ADMIN or SHIPPING_EDITOR for create and update",
    samplePayload: {
      shipmentId: "SHIP-9100",
      orderId: "ORD-5003",
      carrier: "DTDC",
      trackingNumber: "DTDC123456",
      status: "READY_TO_SHIP",
      shipDate: today,
      estimatedDeliveryDate: "2026-04-18",
      destination: "88 Palm Street, Pune"
    },
    updatePayload: {
      shipmentId: "IGNORED-SHIPMENT",
      orderId: "ORD-5003",
      carrier: "DTDC",
      trackingNumber: "DTDC123456",
      status: "IN_TRANSIT",
      shipDate: today,
      estimatedDeliveryDate: "2026-04-17",
      destination: "88 Palm Street, Pune"
    }
  }
];
