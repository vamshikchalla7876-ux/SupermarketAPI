package com.vamshi.SpringbootDemo.controller;

import com.vamshi.SpringbootDemo.model.CustomerOrder;
import com.vamshi.SpringbootDemo.service.SupermarketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final SupermarketService supermarketService;

    public OrderController(SupermarketService supermarketService) {
        this.supermarketService = supermarketService;
    }

    @GetMapping
    public ResponseEntity<List<CustomerOrder>> getOrders() {
        return ResponseEntity.ok(supermarketService.getOrders());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<CustomerOrder> getOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(supermarketService.getOrderById(orderId));
    }

    @PostMapping
    public ResponseEntity<CustomerOrder> createOrder(@RequestBody CustomerOrder order) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supermarketService.createOrder(order));
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<CustomerOrder> updateOrder(@PathVariable String orderId, @RequestBody CustomerOrder order) {
        return ResponseEntity.ok(supermarketService.updateOrder(orderId, order));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String orderId) {
        supermarketService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
