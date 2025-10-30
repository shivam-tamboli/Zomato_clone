package com.zomato.clone.backend.controller;

import com.zomato.clone.backend.models.FoodItem;
import com.zomato.clone.backend.models.RestaurantDetails;
import com.zomato.clone.backend.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    @GetMapping(value = "get-fooditems")
    public ResponseEntity<List<FoodItem>> getFoodItems(@RequestParam("restaurantId") Integer restaurantId) {
        return restaurantService.getFoodItems(restaurantId);
    }



}
