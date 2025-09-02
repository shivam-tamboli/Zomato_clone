package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.RestaurantImages;
import org.springframework.data.repository.CrudRepository;

public interface RestaurantImagesRepo extends CrudRepository<RestaurantImages, Integer> {

    public void deleteByRestaurantId(Integer restaurantId);
}
