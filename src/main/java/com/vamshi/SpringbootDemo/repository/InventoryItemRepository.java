package com.vamshi.SpringbootDemo.repository;

import com.vamshi.SpringbootDemo.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {
}
