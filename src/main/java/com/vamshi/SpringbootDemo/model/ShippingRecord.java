package com.vamshi.SpringbootDemo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "shipping_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingRecord {

    @Id
    private String shipmentId;

    @Column(nullable = false)
    private String orderId;

    @Column(nullable = false)
    private String carrier;

    @Column(nullable = false)
    private String trackingNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShippingStatus status;

    @Column(nullable = false)
    private LocalDate shipDate;

    @Column(nullable = false)
    private LocalDate estimatedDeliveryDate;

    @Column(nullable = false)
    private String destination;
}
