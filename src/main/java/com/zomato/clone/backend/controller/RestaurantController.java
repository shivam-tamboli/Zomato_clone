package com.zomato.clone.backend.controller;

import com.zomato.clone.backend.service.RestaurantService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService){
        this.restaurantService = restaurantService;
    }


}
