package com.vamshi.SpringbootDemo.repository;

import com.vamshi.SpringbootDemo.model.BillingRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillingRecordRepository extends JpaRepository<BillingRecord, String> {
}
