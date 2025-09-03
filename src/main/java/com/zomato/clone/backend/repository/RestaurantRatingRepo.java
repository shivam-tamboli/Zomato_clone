package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.RestaurantRating;
import org.springframework.data.repository.CrudRepository;

public interface RestaurantRatingRepo extends CrudRepository<RestaurantRating, Integer> {
}
