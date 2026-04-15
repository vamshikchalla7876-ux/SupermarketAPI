package com.vamshi.SpringbootDemo.controller;

import com.vamshi.SpringbootDemo.model.ShippingRecord;
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
@RequestMapping("/shipping")
public class ShippingController {

    private final SupermarketService supermarketService;

    public ShippingController(SupermarketService supermarketService) {
        this.supermarketService = supermarketService;
    }

    @GetMapping
    public ResponseEntity<List<ShippingRecord>> getShippingRecords() {
        return ResponseEntity.ok(supermarketService.getShippingRecords());
    }

    @GetMapping("/{shipmentId}")
    public ResponseEntity<ShippingRecord> getShippingRecord(@PathVariable String shipmentId) {
        return ResponseEntity.ok(supermarketService.getShippingRecordByShipmentId(shipmentId));
    }

    @PostMapping
    public ResponseEntity<ShippingRecord> createShippingRecord(@RequestBody ShippingRecord record) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supermarketService.createShippingRecord(record));
    }

    @PutMapping("/{shipmentId}")
    public ResponseEntity<ShippingRecord> updateShippingRecord(@PathVariable String shipmentId, @RequestBody ShippingRecord record) {
        return ResponseEntity.ok(supermarketService.updateShippingRecord(shipmentId, record));
    }

    @DeleteMapping("/{shipmentId}")
    public ResponseEntity<Void> deleteShippingRecord(@PathVariable String shipmentId) {
        supermarketService.deleteShippingRecord(shipmentId);
        return ResponseEntity.noContent().build();
    }
}
