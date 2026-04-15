package com.vamshi.SpringbootDemo.config;

import com.vamshi.SpringbootDemo.model.BillingRecord;
import com.vamshi.SpringbootDemo.model.Customer;
import com.vamshi.SpringbootDemo.model.CustomerOrder;
import com.vamshi.SpringbootDemo.model.InventoryItem;
import com.vamshi.SpringbootDemo.model.OrderItem;
import com.vamshi.SpringbootDemo.model.OrderStatus;
import com.vamshi.SpringbootDemo.model.PaymentMethod;
import com.vamshi.SpringbootDemo.model.PaymentStatus;
import com.vamshi.SpringbootDemo.model.ShippingRecord;
import com.vamshi.SpringbootDemo.model.ShippingStatus;
import com.vamshi.SpringbootDemo.repository.BillingRecordRepository;
import com.vamshi.SpringbootDemo.repository.CustomerOrderRepository;
import com.vamshi.SpringbootDemo.repository.CustomerRepository;
import com.vamshi.SpringbootDemo.repository.InventoryItemRepository;
import com.vamshi.SpringbootDemo.repository.ShippingRecordRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class SampleDataInitializer {

    @Bean
    public CommandLineRunner seedSampleData(
            CustomerRepository customerRepository,
            InventoryItemRepository inventoryItemRepository,
            CustomerOrderRepository customerOrderRepository,
            BillingRecordRepository billingRecordRepository,
            ShippingRecordRepository shippingRecordRepository
    ) {
        return args -> {
            if (customerRepository.count() > 0
                    || inventoryItemRepository.count() > 0
                    || customerOrderRepository.count() > 0
                    || billingRecordRepository.count() > 0
                    || shippingRecordRepository.count() > 0) {
                return;
            }

            customerRepository.saveAll(List.of(
                    new Customer("CUST-1001", "Asha Rao", "asha.rao@example.com", "+91-9876543210", "GOLD", "12 Lake View, Hyderabad"),
                    new Customer("CUST-1002", "Rohan Mehta", "rohan.mehta@example.com", "+91-9988776655", "SILVER", "44 Market Road, Bengaluru"),
                    new Customer("CUST-1003", "Neha Sharma", "neha.sharma@example.com", "+91-9123456780", "PLATINUM", "88 Palm Street, Pune")
            ));

            inventoryItemRepository.saveAll(List.of(
                    new InventoryItem("SKU-APPLE-001", "Fresh Apples", "Produce", 120, new BigDecimal("2.49"), false),
                    new InventoryItem("SKU-MILK-002", "Whole Milk 1L", "Dairy", 24, new BigDecimal("1.89"), true),
                    new InventoryItem("SKU-RICE-003", "Basmati Rice 5kg", "Groceries", 60, new BigDecimal("12.99"), false),
                    new InventoryItem("SKU-SOAP-004", "Dish Soap", "Home Care", 18, new BigDecimal("3.99"), true)
            ));

            customerOrderRepository.saveAll(List.of(
                    new CustomerOrder(
                            "ORD-5001",
                            "CUST-1001",
                            List.of(
                                    new OrderItem("SKU-APPLE-001", "Fresh Apples", 4, new BigDecimal("2.49"), new BigDecimal("9.96")),
                                    new OrderItem("SKU-MILK-002", "Whole Milk 1L", 2, new BigDecimal("1.89"), new BigDecimal("3.78"))
                            ),
                            new BigDecimal("13.74"),
                            new BigDecimal("1.37"),
                            new BigDecimal("15.11"),
                            OrderStatus.CONFIRMED,
                            LocalDate.now().minusDays(1)
                    ),
                    new CustomerOrder(
                            "ORD-5002",
                            "CUST-1002",
                            List.of(
                                    new OrderItem("SKU-RICE-003", "Basmati Rice 5kg", 1, new BigDecimal("12.99"), new BigDecimal("12.99")),
                                    new OrderItem("SKU-SOAP-004", "Dish Soap", 3, new BigDecimal("3.99"), new BigDecimal("11.97"))
                            ),
                            new BigDecimal("24.96"),
                            new BigDecimal("2.50"),
                            new BigDecimal("27.46"),
                            OrderStatus.FULFILLED,
                            LocalDate.now().minusDays(2)
                    ),
                    new CustomerOrder(
                            "ORD-5003",
                            "CUST-1003",
                            List.of(new OrderItem("SKU-APPLE-001", "Fresh Apples", 6, new BigDecimal("2.49"), new BigDecimal("14.94"))),
                            new BigDecimal("14.94"),
                            new BigDecimal("1.49"),
                            new BigDecimal("16.43"),
                            OrderStatus.CREATED,
                            LocalDate.now()
                    )
            ));

            billingRecordRepository.saveAll(List.of(
                    new BillingRecord("INV-7001", "ORD-5001", "CUST-1001", new BigDecimal("15.11"), PaymentMethod.CARD, PaymentStatus.PAID, LocalDate.now().minusDays(1)),
                    new BillingRecord("INV-7002", "ORD-5002", "CUST-1002", new BigDecimal("27.46"), PaymentMethod.UPI, PaymentStatus.PAID, LocalDate.now().minusDays(2)),
                    new BillingRecord("INV-7003", "ORD-5003", "CUST-1003", new BigDecimal("16.43"), PaymentMethod.WALLET, PaymentStatus.PENDING, LocalDate.now())
            ));

            shippingRecordRepository.saveAll(List.of(
                    new ShippingRecord("SHIP-9001", "ORD-5001", "BlueDart", "BD123456789", ShippingStatus.IN_TRANSIT, LocalDate.now().minusDays(1), LocalDate.now().plusDays(1), "12 Lake View, Hyderabad"),
                    new ShippingRecord("SHIP-9002", "ORD-5002", "Delhivery", "DL987654321", ShippingStatus.DELIVERED, LocalDate.now().minusDays(2), LocalDate.now(), "44 Market Road, Bengaluru"),
                    new ShippingRecord("SHIP-9003", "ORD-5003", "Ecom Express", "EE456789123", ShippingStatus.READY_TO_SHIP, LocalDate.now(), LocalDate.now().plusDays(2), "88 Palm Street, Pune")
            ));
        };
    }
}
