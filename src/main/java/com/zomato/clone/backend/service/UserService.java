package com.zomato.clone.backend.service;

import com.zomato.clone.backend.repository.*;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserInfoRepo userInfoRepo;
    private final RestaurantInfoRepo restaurantInfoRepo;
    private final FoodItemRepo foodItemRepo;
    private final OrderFoodItemsRepo orderFoodItemsRepo;
    private final OrderInfoRepo orderInfoRepo;
    private final RestaurantRatingRepo restaurantRatingRepo;
    private final FoodItemRatingRepo foodItemRatingRepo;

    //public UserService(UserInfoRepo userInfoRepo, Re){}


    public UserService(UserInfoRepo userInfoRepo, RestaurantInfoRepo restaurantInfoRepo, FoodItemRepo foodItemRepo,
                       OrderFoodItemsRepo orderFoodItemsRepo, OrderInfoRepo orderInfoRepo, RestaurantRatingRepo restaurantRatingRepo,
                       FoodItemRatingRepo foodItemRatingRepo) {
        this.userInfoRepo = userInfoRepo;
        this.restaurantInfoRepo = restaurantInfoRepo;
        this.foodItemRepo = foodItemRepo;
        this.orderFoodItemsRepo = orderFoodItemsRepo;
        this.orderInfoRepo = orderInfoRepo;
        this.restaurantRatingRepo = restaurantRatingRepo;
        this.foodItemRatingRepo = foodItemRatingRepo;
    }
}
