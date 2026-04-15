package com.vamshi.SpringbootDemo.repository;

import com.vamshi.SpringbootDemo.model.ShippingRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShippingRecordRepository extends JpaRepository<ShippingRecord, String> {
}
