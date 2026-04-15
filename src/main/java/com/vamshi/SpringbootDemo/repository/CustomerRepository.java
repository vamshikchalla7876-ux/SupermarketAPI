package com.vamshi.SpringbootDemo.repository;

import com.vamshi.SpringbootDemo.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String> {
}
