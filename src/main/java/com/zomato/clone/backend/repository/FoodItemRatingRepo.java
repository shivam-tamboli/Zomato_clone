package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.FoodItemRating;
import org.springframework.data.repository.CrudRepository;

public interface FoodItemRatingRepo extends CrudRepository<FoodItemRating, Integer> {
}
