package com.vamshi.SpringbootDemo.service;

import com.vamshi.SpringbootDemo.model.BillingRecord;
import com.vamshi.SpringbootDemo.model.Customer;
import com.vamshi.SpringbootDemo.model.CustomerOrder;
import com.vamshi.SpringbootDemo.model.InventoryItem;
import com.vamshi.SpringbootDemo.model.ShippingRecord;
import com.vamshi.SpringbootDemo.model.SupermarketOverview;
import com.vamshi.SpringbootDemo.repository.BillingRecordRepository;
import com.vamshi.SpringbootDemo.repository.CustomerOrderRepository;
import com.vamshi.SpringbootDemo.repository.CustomerRepository;
import com.vamshi.SpringbootDemo.repository.InventoryItemRepository;
import com.vamshi.SpringbootDemo.repository.ShippingRecordRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupermarketService {

    private static final Sort CUSTOMER_SORT = Sort.by("id");
    private static final Sort INVENTORY_SORT = Sort.by("sku");
    private static final Sort ORDER_SORT = Sort.by("orderId");
    private static final Sort BILLING_SORT = Sort.by("invoiceId");
    private static final Sort SHIPPING_SORT = Sort.by("shipmentId");

    private final CustomerRepository customerRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final BillingRecordRepository billingRecordRepository;
    private final ShippingRecordRepository shippingRecordRepository;

    public SupermarketService(
            CustomerRepository customerRepository,
            InventoryItemRepository inventoryItemRepository,
            CustomerOrderRepository customerOrderRepository,
            BillingRecordRepository billingRecordRepository,
            ShippingRecordRepository shippingRecordRepository
    ) {
        this.customerRepository = customerRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.billingRecordRepository = billingRecordRepository;
        this.shippingRecordRepository = shippingRecordRepository;
    }

    public List<Customer> getCustomers() {
        return customerRepository.findAll(CUSTOMER_SORT);
    }

    public Customer getCustomerById(String customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + customerId));
    }

    public Customer createCustomer(Customer customer) {
        if (customerRepository.existsById(customer.getId())) {
            throw new IllegalStateException("Customer already exists: " + customer.getId());
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(String customerId, Customer customer) {
        Customer existingCustomer = getCustomerById(customerId);
        existingCustomer.setName(customer.getName());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setPhone(customer.getPhone());
        existingCustomer.setMembershipTier(customer.getMembershipTier());
        existingCustomer.setAddress(customer.getAddress());
        return customerRepository.save(existingCustomer);
    }

    public void deleteCustomer(String customerId) {
        Customer existingCustomer = getCustomerById(customerId);
        customerRepository.delete(existingCustomer);
    }

    public List<InventoryItem> getInventory() {
        return inventoryItemRepository.findAll(INVENTORY_SORT);
    }

    public InventoryItem getInventoryItemBySku(String sku) {
        return inventoryItemRepository.findById(sku)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found: " + sku));
    }

    public InventoryItem createInventoryItem(InventoryItem item) {
        if (inventoryItemRepository.existsById(item.getSku())) {
            throw new IllegalStateException("Inventory item already exists: " + item.getSku());
        }
        return inventoryItemRepository.save(item);
    }

    public InventoryItem updateInventoryItem(String sku, InventoryItem item) {
        InventoryItem existingItem = getInventoryItemBySku(sku);
        existingItem.setName(item.getName());
        existingItem.setCategory(item.getCategory());
        existingItem.setQuantityInStock(item.getQuantityInStock());
        existingItem.setUnitPrice(item.getUnitPrice());
        existingItem.setReorderRequired(item.isReorderRequired());
        return inventoryItemRepository.save(existingItem);
    }

    public void deleteInventoryItem(String sku) {
        InventoryItem existingItem = getInventoryItemBySku(sku);
        inventoryItemRepository.delete(existingItem);
    }

    public List<CustomerOrder> getOrders() {
        return customerOrderRepository.findAll(ORDER_SORT);
    }

    public CustomerOrder getOrderById(String orderId) {
        return customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
    }

    public CustomerOrder createOrder(CustomerOrder order) {
        if (customerOrderRepository.existsById(order.getOrderId())) {
            throw new IllegalStateException("Order already exists: " + order.getOrderId());
        }
        return customerOrderRepository.save(order);
    }

    public CustomerOrder updateOrder(String orderId, CustomerOrder order) {
        CustomerOrder existingOrder = getOrderById(orderId);
        existingOrder.setCustomerId(order.getCustomerId());
        existingOrder.setItems(order.getItems());
        existingOrder.setSubtotal(order.getSubtotal());
        existingOrder.setTax(order.getTax());
        existingOrder.setTotal(order.getTotal());
        existingOrder.setStatus(order.getStatus());
        existingOrder.setOrderDate(order.getOrderDate());
        return customerOrderRepository.save(existingOrder);
    }

    public void deleteOrder(String orderId) {
        CustomerOrder existingOrder = getOrderById(orderId);
        customerOrderRepository.delete(existingOrder);
    }

    public List<BillingRecord> getBillingRecords() {
        return billingRecordRepository.findAll(BILLING_SORT);
    }

    public BillingRecord getBillingRecordByInvoiceId(String invoiceId) {
        return billingRecordRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + invoiceId));
    }

    public BillingRecord createBillingRecord(BillingRecord record) {
        if (billingRecordRepository.existsById(record.getInvoiceId())) {
            throw new IllegalStateException("Invoice already exists: " + record.getInvoiceId());
        }
        return billingRecordRepository.save(record);
    }

    public BillingRecord updateBillingRecord(String invoiceId, BillingRecord record) {
        BillingRecord existingRecord = getBillingRecordByInvoiceId(invoiceId);
        existingRecord.setOrderId(record.getOrderId());
        existingRecord.setCustomerId(record.getCustomerId());
        existingRecord.setAmount(record.getAmount());
        existingRecord.setPaymentMethod(record.getPaymentMethod());
        existingRecord.setPaymentStatus(record.getPaymentStatus());
        existingRecord.setBillingDate(record.getBillingDate());
        return billingRecordRepository.save(existingRecord);
    }

    public void deleteBillingRecord(String invoiceId) {
        BillingRecord existingRecord = getBillingRecordByInvoiceId(invoiceId);
        billingRecordRepository.delete(existingRecord);
    }

    public List<ShippingRecord> getShippingRecords() {
        return shippingRecordRepository.findAll(SHIPPING_SORT);
    }

    public ShippingRecord getShippingRecordByShipmentId(String shipmentId) {
        return shippingRecordRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found: " + shipmentId));
    }

    public ShippingRecord createShippingRecord(ShippingRecord record) {
        if (shippingRecordRepository.existsById(record.getShipmentId())) {
            throw new IllegalStateException("Shipment already exists: " + record.getShipmentId());
        }
        return shippingRecordRepository.save(record);
    }

    public ShippingRecord updateShippingRecord(String shipmentId, ShippingRecord record) {
        ShippingRecord existingRecord = getShippingRecordByShipmentId(shipmentId);
        existingRecord.setOrderId(record.getOrderId());
        existingRecord.setCarrier(record.getCarrier());
        existingRecord.setTrackingNumber(record.getTrackingNumber());
        existingRecord.setStatus(record.getStatus());
        existingRecord.setShipDate(record.getShipDate());
        existingRecord.setEstimatedDeliveryDate(record.getEstimatedDeliveryDate());
        existingRecord.setDestination(record.getDestination());
        return shippingRecordRepository.save(existingRecord);
    }

    public void deleteShippingRecord(String shipmentId) {
        ShippingRecord existingRecord = getShippingRecordByShipmentId(shipmentId);
        shippingRecordRepository.delete(existingRecord);
    }

    public SupermarketOverview getOverview() {
        return new SupermarketOverview(
                getCustomers(),
                getInventory(),
                getOrders(),
                getBillingRecords(),
                getShippingRecords()
        );
    }
}
