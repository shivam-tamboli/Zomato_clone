package com.zomato.clone.backend.service;

import com.zomato.clone.backend.models.RestaurantDetails;
import com.zomato.clone.backend.models.RestaurantInfo;
import com.zomato.clone.backend.repository.RestaurantInfoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;

@Service
public class RestaurantService {


    private final RestaurantInfoRepo restaurantInfoRepo;

    public RestaurantService(RestaurantInfoRepo restaurantInfoRepo) {

        this.restaurantInfoRepo = restaurantInfoRepo;
    }

    public ResponseEntity<ArrayList<RestaurantDetails>> getRestaurants(){

        Iterable<RestaurantInfo> restaurants = restaurantInfoRepo.findAll();
        Iterator<RestaurantInfo> i = restaurants.iterator();

        ArrayList<RestaurantDetails> restInf = new ArrayList<RestaurantDetails>();

        while (i.hasNext()){
            RestaurantInfo r = i.next();
            RestaurantDetails ra = new RestaurantDetails(r.getRestaurantName(), r.getRestaurantId(), r.getRestaurantAddress(), r.getRestaurantimages(), r.getRestaurantRating());
            restInf.add(ra);
        }

        return ResponseEntity.ok().body(restInf);
    }
}
