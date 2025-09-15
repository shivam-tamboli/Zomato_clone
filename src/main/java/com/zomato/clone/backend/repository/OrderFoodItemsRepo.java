package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.OrderFoodItems;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderFoodItemsRepo extends CrudRepository<OrderFoodItems, Integer> {
}
