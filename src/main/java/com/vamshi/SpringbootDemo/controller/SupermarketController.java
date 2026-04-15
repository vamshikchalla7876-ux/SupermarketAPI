package com.vamshi.SpringbootDemo.controller;

import com.vamshi.SpringbootDemo.model.SupermarketOverview;
import com.vamshi.SpringbootDemo.service.SupermarketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/supermarket")
public class SupermarketController {

    private final SupermarketService supermarketService;

    public SupermarketController(SupermarketService supermarketService) {
        this.supermarketService = supermarketService;
    }

    @GetMapping("/overview")
    public ResponseEntity<SupermarketOverview> getOverview() {
        return ResponseEntity.ok(supermarketService.getOverview());
    }
}
