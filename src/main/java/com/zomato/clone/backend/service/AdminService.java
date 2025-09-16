package com.zomato.clone.backend.service;

import com.zomato.clone.backend.models.RestaurantImages;
import com.zomato.clone.backend.models.RestaurantInfo;
import com.zomato.clone.backend.repository.FoodItemRepo;
import com.zomato.clone.backend.repository.RestaurantImagesRepo;
import com.zomato.clone.backend.repository.RestaurantInfoRepo;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final RestaurantInfoRepo restaurantInfoRepo;
    private final RestaurantImagesRepo restaurantImagesRepo;
    private final FoodItemRepo foodItemRepo;

    public AdminService(RestaurantInfoRepo restaurantInfoRepo, RestaurantImagesRepo restaurantImagesRepo, FoodItemRepo foodItemRepo) {
        this.restaurantInfoRepo = restaurantInfoRepo;
        this.restaurantImagesRepo = restaurantImagesRepo;
        this.foodItemRepo = foodItemRepo;
    }
}
