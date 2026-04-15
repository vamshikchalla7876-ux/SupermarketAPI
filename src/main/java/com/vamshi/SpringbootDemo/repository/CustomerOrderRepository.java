package com.vamshi.SpringbootDemo.repository;

import com.vamshi.SpringbootDemo.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, String> {
}
