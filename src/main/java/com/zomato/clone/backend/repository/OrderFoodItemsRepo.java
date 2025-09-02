package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.OrderFoodItems;
import org.springframework.data.repository.CrudRepository;

public interface OrderFoodItemsRepo extends CrudRepository<OrderFoodItems, Integer> {
}
