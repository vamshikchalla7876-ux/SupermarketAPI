package com.vamshi.SpringbootDemo;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;

@AutoConfigureMockMvc
@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class SpringbootDemoApplicationTests {

	@Autowired
	private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void contextLoads() {
    }

    @Test
    void shouldReturnOverviewData() throws Exception {
        mockMvc.perform(get("/supermarket/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customers.length()").value(3))
                .andExpect(jsonPath("$.inventory.length()").value(4))
                .andExpect(jsonPath("$.orders.length()").value(3))
                .andExpect(jsonPath("$.billing.length()").value(3))
                .andExpect(jsonPath("$.shipping.length()").value(3));
    }

    @Test
    void shouldReturnInventoryItemBySku() throws Exception {
        mockMvc.perform(get("/inventory/SKU-MILK-002"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Whole Milk 1L"))
                .andExpect(jsonPath("$.reorderRequired").value(true));
    }

    @Test
    void shouldReturnNotFoundForMissingCustomer() throws Exception {
        mockMvc.perform(get("/customers/CUST-9999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Customer not found: CUST-9999"));
    }

    @Test
    void shouldCreateUpdateAndDeleteCustomer() throws Exception {
        Customer customer = new Customer(
                "CUST-2001",
                "Priya Nair",
                "priya.nair@example.com",
                "+91-9000000001",
                "GOLD",
                "21 Residency Road, Chennai"
        );

        mockMvc.perform(post("/customers")
                        .with(httpBasic("customer_manager", "cust123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("CUST-2001"));

        Customer updatedCustomer = new Customer(
                "IGNORED-ID",
                "Priya Nair",
                "priya.nair@example.com",
                "+91-9000000002",
                "PLATINUM",
                "99 Anna Salai, Chennai"
        );

        mockMvc.perform(put("/customers/CUST-2001")
                        .with(httpBasic("customer_manager", "cust123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedCustomer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phone").value("+91-9000000002"))
                .andExpect(jsonPath("$.membershipTier").value("PLATINUM"));

        mockMvc.perform(delete("/customers/CUST-2001"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/customers/CUST-2001"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateUpdateAndDeleteInventoryItem() throws Exception {
        InventoryItem item = new InventoryItem(
                "SKU-TEA-005",
                "Masala Tea",
                "Beverages",
                40,
                new BigDecimal("4.25"),
                false
        );

        mockMvc.perform(post("/inventory")
                        .with(httpBasic("inventory_manager", "inv123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(item)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sku").value("SKU-TEA-005"));

        InventoryItem updatedItem = new InventoryItem(
                "IGNORED-SKU",
                "Masala Tea Premium",
                "Beverages",
                15,
                new BigDecimal("4.75"),
                true
        );

        mockMvc.perform(put("/inventory/SKU-TEA-005")
                        .with(httpBasic("inventory_manager", "inv123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedItem)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Masala Tea Premium"))
                .andExpect(jsonPath("$.reorderRequired").value(true));

        mockMvc.perform(delete("/inventory/SKU-TEA-005"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/inventory/SKU-TEA-005"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateUpdateAndDeleteOrder() throws Exception {
        CustomerOrder order = new CustomerOrder(
                "ORD-6001",
                "CUST-1001",
                List.of(new OrderItem("SKU-RICE-003", "Basmati Rice 5kg", 2, new BigDecimal("12.99"), new BigDecimal("25.98"))),
                new BigDecimal("25.98"),
                new BigDecimal("2.60"),
                new BigDecimal("28.58"),
                OrderStatus.CREATED,
                LocalDate.now()
        );

        mockMvc.perform(post("/orders")
                        .with(httpBasic("order_manager", "order123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(order)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderId").value("ORD-6001"));

        CustomerOrder updatedOrder = new CustomerOrder(
                "IGNORED-ORDER",
                "CUST-1001",
                List.of(new OrderItem("SKU-RICE-003", "Basmati Rice 5kg", 3, new BigDecimal("12.99"), new BigDecimal("38.97"))),
                new BigDecimal("38.97"),
                new BigDecimal("3.90"),
                new BigDecimal("42.87"),
                OrderStatus.CONFIRMED,
                LocalDate.now()
        );

        mockMvc.perform(put("/orders/ORD-6001")
                        .with(httpBasic("order_manager", "order123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedOrder)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"))
                .andExpect(jsonPath("$.items[0].quantity").value(3));

        mockMvc.perform(delete("/orders/ORD-6001"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/orders/ORD-6001"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateUpdateAndDeleteBillingRecord() throws Exception {
        BillingRecord billingRecord = new BillingRecord(
                "INV-8001",
                "ORD-5001",
                "CUST-1001",
                new BigDecimal("18.25"),
                PaymentMethod.CARD,
                PaymentStatus.PENDING,
                LocalDate.now()
        );

        mockMvc.perform(post("/billing")
                        .with(httpBasic("billing_manager", "bill123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(billingRecord)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.invoiceId").value("INV-8001"));

        BillingRecord updatedBillingRecord = new BillingRecord(
                "IGNORED-INVOICE",
                "ORD-5001",
                "CUST-1001",
                new BigDecimal("18.25"),
                PaymentMethod.UPI,
                PaymentStatus.PAID,
                LocalDate.now()
        );

        mockMvc.perform(put("/billing/INV-8001")
                        .with(httpBasic("billing_manager", "bill123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedBillingRecord)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentMethod").value("UPI"))
                .andExpect(jsonPath("$.paymentStatus").value("PAID"));

        mockMvc.perform(delete("/billing/INV-8001"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/billing/INV-8001"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateUpdateAndDeleteShippingRecord() throws Exception {
        ShippingRecord shippingRecord = new ShippingRecord(
                "SHIP-9100",
                "ORD-5003",
                "DTDC",
                "DTDC123456",
                ShippingStatus.READY_TO_SHIP,
                LocalDate.now(),
                LocalDate.now().plusDays(3),
                "88 Palm Street, Pune"
        );

        mockMvc.perform(post("/shipping")
                        .with(httpBasic("shipping_manager", "ship123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(shippingRecord)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.shipmentId").value("SHIP-9100"));

        ShippingRecord updatedShippingRecord = new ShippingRecord(
                "IGNORED-SHIPMENT",
                "ORD-5003",
                "DTDC",
                "DTDC123456",
                ShippingStatus.IN_TRANSIT,
                LocalDate.now(),
                LocalDate.now().plusDays(2),
                "88 Palm Street, Pune"
        );

        mockMvc.perform(put("/shipping/SHIP-9100")
                        .with(httpBasic("shipping_manager", "ship123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedShippingRecord)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_TRANSIT"));

        mockMvc.perform(delete("/shipping/SHIP-9100"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/shipping/SHIP-9100"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldRejectDuplicateCustomerCreate() throws Exception {
        Customer duplicateCustomer = new Customer(
                "CUST-1001",
                "Duplicate",
                "duplicate@example.com",
                "+91-9000000099",
                "SILVER",
                "Duplicate Address"
        );

        mockMvc.perform(post("/customers")
                        .with(httpBasic("customer_manager", "cust123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateCustomer)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Customer already exists: CUST-1001"));
    }

    @Test
    void shouldRejectCreateWhenUnauthenticated() throws Exception {
        Customer customer = new Customer(
                "CUST-3001",
                "Unauth User",
                "unauth@example.com",
                "+91-9000000098",
                "SILVER",
                "No Access Street"
        );

        mockMvc.perform(post("/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectCreateWhenUserHasWrongRole() throws Exception {
        InventoryItem item = new InventoryItem(
                "SKU-COFFEE-010",
                "Filter Coffee",
                "Beverages",
                22,
                new BigDecimal("5.25"),
                false
        );

        mockMvc.perform(post("/inventory")
                        .with(httpBasic("shipping_manager", "ship123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(item)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowAdminToCreateAcrossModules() throws Exception {
        BillingRecord billingRecord = new BillingRecord(
                "INV-8100",
                "ORD-5002",
                "CUST-1002",
                new BigDecimal("30.00"),
                PaymentMethod.CARD,
                PaymentStatus.PAID,
                LocalDate.now()
        );

        mockMvc.perform(post("/billing")
                        .with(httpBasic("admin", "admin123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(billingRecord)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.invoiceId").value("INV-8100"));
    }

}
