package com.zomato.clone.backend.controller;

import com.zomato.clone.backend.models.RestaurantDetails;
import com.zomato.clone.backend.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping(value = "/zomato")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService){
        this.restaurantService = restaurantService;
    }

    @GetMapping(value = "get-restaurants")
    public ResponseEntity<ArrayList<RestaurantDetails>> getRestaurants(){
        return restaurantService.getRestaurants();
    }


}
