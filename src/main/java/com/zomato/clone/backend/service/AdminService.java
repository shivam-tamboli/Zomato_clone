package com.zomato.clone.backend.service;

import com.zomato.clone.backend.models.RestaurantImages;
import com.zomato.clone.backend.models.RestaurantInfo;
import com.zomato.clone.backend.repository.FoodItemRepo;
import com.zomato.clone.backend.repository.RestaurantImagesRepo;
import com.zomato.clone.backend.repository.RestaurantInfoRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.SQLOutput;
import java.util.*;

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

    public ResponseEntity<String> addRestaurant(Map entity){
        System.out.println("********************************************************" + "success");
        Optional<RestaurantInfo> restaurant = restaurantInfoRepo.findByRestaurantNameAndRestaurantAddress((String) entity.get("restaurantName")
        , (String) entity.get("restaurantAddress"));

        if(restaurant.isPresent()){
            return ResponseEntity.ok().body("address");
        }

        RestaurantInfo restaurantInfo = new RestaurantInfo();
        restaurantInfo.setRestaurantName((String) entity.get("restaurantName"));
        restaurantInfo.setRestaurantAddress((String) entity.get("restaurantAddress"));

        ArrayList<String> imagesLink = (ArrayList) entity.get("restaurantimages");
        ListIterator<String> ll = imagesLink.listIterator();

        while(ll.hasNext()){
            RestaurantImages images = new RestaurantImages();
            String link = ll.next();
            images.setLink(link);
            images.setRestaurantInfo(restaurantInfo);
            restaurantInfo.getRestaurantImages().add(images);
            restaurantInfoRepo.save(restaurantInfo);
        }
        return ResponseEntity.ok().body("success");
    }

    ResponseEntity<String> editRestaurant(Map entity){
        Integer restaurantId = (Integer) entity.get("restaurantId");
        Optional<RestaurantInfo> restaurantInfo = restaurantInfoRepo.findById(restaurantId);
        RestaurantInfo rest = restaurantInfo.get();

        Optional<RestaurantInfo> info = restaurantInfoRepo.findByRestaurantNameAndRestaurantAddress(
                (String) entity.get("restaurantName"), (String) entity.get("restaurantAddress"));

        rest.setRestaurantName((String) entity.get("restaurantName"));
        rest.setRestaurantAddress((String) entity.get("restaurantAddress"));
        restaurantInfoRepo.save(rest);
        restaurantImagesRepo.deleteByRestaurantid(restaurantId);

        ArrayList<String> imagesLink = (ArrayList) entity.get("restaurantimages");
        ListIterator<String> ll = imagesLink.listIterator();
        rest = restaurantInfo.get();
        for(int i = 0; i < imagesLink.size(); i++){
            System.out.println("****************************************************" + imagesLink.get(i));
        }
        while (ll.hasNext()) {

            RestaurantImages img = new RestaurantImages();
            String link = ll.next();
            img.setLink(link);
            img.setRestaurantInfo(rest);
            rest.getRestaurantImages().add(img);
            restaurantInfoRepo.save(rest);
        }
        return ResponseEntity.ok().body("success");

    }
}
