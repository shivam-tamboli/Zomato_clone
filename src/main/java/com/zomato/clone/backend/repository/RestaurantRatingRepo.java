package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.RestaurantRating;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRatingRepo extends CrudRepository<RestaurantRating, Integer> {
}
