package com.vamshi.SpringbootDemo.controller;

import com.vamshi.SpringbootDemo.model.InventoryItem;
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
@RequestMapping("/inventory")
public class InventoryController {

    private final SupermarketService supermarketService;

    public InventoryController(SupermarketService supermarketService) {
        this.supermarketService = supermarketService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getInventory() {
        return ResponseEntity.ok(supermarketService.getInventory());
    }

    @GetMapping("/{sku}")
    public ResponseEntity<InventoryItem> getInventoryItem(@PathVariable String sku) {
        return ResponseEntity.ok(supermarketService.getInventoryItemBySku(sku));
    }

    @PostMapping
    public ResponseEntity<InventoryItem> createInventoryItem(@RequestBody InventoryItem item) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supermarketService.createInventoryItem(item));
    }

    @PutMapping("/{sku}")
    public ResponseEntity<InventoryItem> updateInventoryItem(@PathVariable String sku, @RequestBody InventoryItem item) {
        return ResponseEntity.ok(supermarketService.updateInventoryItem(sku, item));
    }

    @DeleteMapping("/{sku}")
    public ResponseEntity<Void> deleteInventoryItem(@PathVariable String sku) {
        supermarketService.deleteInventoryItem(sku);
        return ResponseEntity.noContent().build();
    }
}
