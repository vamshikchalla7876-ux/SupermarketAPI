package com.vamshi.SpringbootDemo.controller;

import com.vamshi.SpringbootDemo.model.BillingRecord;
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
@RequestMapping("/billing")
public class BillingController {

    private final SupermarketService supermarketService;

    public BillingController(SupermarketService supermarketService) {
        this.supermarketService = supermarketService;
    }

    @GetMapping
    public ResponseEntity<List<BillingRecord>> getBillingRecords() {
        return ResponseEntity.ok(supermarketService.getBillingRecords());
    }

    @GetMapping("/{invoiceId}")
    public ResponseEntity<BillingRecord> getBillingRecord(@PathVariable String invoiceId) {
        return ResponseEntity.ok(supermarketService.getBillingRecordByInvoiceId(invoiceId));
    }

    @PostMapping
    public ResponseEntity<BillingRecord> createBillingRecord(@RequestBody BillingRecord record) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supermarketService.createBillingRecord(record));
    }

    @PutMapping("/{invoiceId}")
    public ResponseEntity<BillingRecord> updateBillingRecord(@PathVariable String invoiceId, @RequestBody BillingRecord record) {
        return ResponseEntity.ok(supermarketService.updateBillingRecord(invoiceId, record));
    }

    @DeleteMapping("/{invoiceId}")
    public ResponseEntity<Void> deleteBillingRecord(@PathVariable String invoiceId) {
        supermarketService.deleteBillingRecord(invoiceId);
        return ResponseEntity.noContent().build();
    }
}
