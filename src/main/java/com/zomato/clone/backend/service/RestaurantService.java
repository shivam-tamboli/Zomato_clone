package com.zomato.clone.backend.service;

import com.zomato.clone.backend.repository.RestaurantInfoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RestaurantService {


    private final RestaurantInfoRepo restaurantInfoRepo;

    public RestaurantService(RestaurantInfoRepo restaurantInfoRepo) {

        this.restaurantInfoRepo = restaurantInfoRepo;
    }
}
