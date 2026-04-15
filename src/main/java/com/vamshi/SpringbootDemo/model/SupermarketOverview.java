package com.vamshi.SpringbootDemo.model;

import java.util.List;

public record SupermarketOverview(
        List<Customer> customers,
        List<InventoryItem> inventory,
        List<CustomerOrder> orders,
        List<BillingRecord> billing,
        List<ShippingRecord> shipping
) {
}
