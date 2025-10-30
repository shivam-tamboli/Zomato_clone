package com.zomato.clone.backend.service;

import com.zomato.clone.backend.models.FoodItem;
import com.zomato.clone.backend.models.RestaurantImages;
import com.zomato.clone.backend.models.RestaurantInfo;
import com.zomato.clone.backend.repository.FoodItemRepo;
import com.zomato.clone.backend.repository.RestaurantImagesRepo;
import com.zomato.clone.backend.repository.RestaurantInfoRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
        System.out.println("*********************************************************" + "success");
        Optional<RestaurantInfo> restaurant = restaurantInfoRepo.findByRestaurantNameAndRestaurantAddress((String) entity.get("restaurantName")
                , (String) entity.get("restaurantAddress"));

        if(restaurant.isPresent()){
            return ResponseEntity.ok().body("address");
        }

        RestaurantInfo restaurantInfo = new RestaurantInfo();
        restaurantInfo.setRestaurantName((String) entity.get("restaurantName"));
        restaurantInfo.setRestaurantAddress((String) entity.get("restaurantAddress"));

        // FIX: Added null check for images
        ArrayList<String> imagesLink = (ArrayList) entity.get("restaurantimages");
        if (imagesLink == null) {
            imagesLink = new ArrayList<>(); // Create empty list if null
        }

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

    public ResponseEntity<String> editRestaurant(Map entity){
        try {
            // FIX: Add validation for restaurantId
            if (entity.get("restaurantId") == null) {
                return ResponseEntity.badRequest().body("Restaurant ID is required");
            }

            Integer restaurantId = (Integer) entity.get("restaurantId");
            Optional<RestaurantInfo> restaurantInfo = restaurantInfoRepo.findById(restaurantId);

            // FIX: Check if restaurant exists
            if (!restaurantInfo.isPresent()) {
                return ResponseEntity.badRequest().body("Restaurant not found");
            }

            RestaurantInfo rest = restaurantInfo.get();

            Optional<RestaurantInfo> info = restaurantInfoRepo.findByRestaurantNameAndRestaurantAddress(
                    (String) entity.get("restaurantName"), (String) entity.get("restaurantAddress"));

            rest.setRestaurantName((String) entity.get("restaurantName"));
            rest.setRestaurantAddress((String) entity.get("restaurantAddress"));
            restaurantInfoRepo.save(rest);
            restaurantImagesRepo.deleteByRestaurantid(restaurantId);

            // FIX: Correct field name and add null check
            ArrayList<String> imagesLink = (ArrayList) entity.get("restaurantImages"); // Changed from restaurantimages
            if (imagesLink == null) {
                imagesLink = new ArrayList<>(); // Create empty list if null
            }

            System.out.println("Processing " + imagesLink.size() + " images");

            // FIX: Use enhanced for loop instead of iterator to avoid issues
            for (String link : imagesLink) {
                if (link != null && !link.trim().isEmpty()) {
                    System.out.println("Adding image: " + link);
                    RestaurantImages img = new RestaurantImages();
                    img.setLink(link);
                    img.setRestaurantInfo(rest);
                    rest.getRestaurantImages().add(img);
                }
            }

            restaurantInfoRepo.save(rest);
            return ResponseEntity.ok().body("success");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

    public ResponseEntity<String> deleteRestaurant(Map entity){
        try {
            if (entity.get("restaurantId") == null) {
                return ResponseEntity.badRequest().body("Restaurant ID is required");
            }
            restaurantInfoRepo.deleteById((Integer) entity.get("restaurantId"));
            return ResponseEntity.ok().body("success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting restaurant");
        }
    }

    public ResponseEntity<String> addFoodItems(Map entity){
        try {
            Optional<RestaurantInfo> restInfo = restaurantInfoRepo.findById((Integer) entity.get("restaurantId"));
            Optional<FoodItem> foodItem = foodItemRepo.findByRestaurantIdAndFoodName((Integer) entity.get("restaurantId"), (String) entity.get("foodName"));

            if(foodItem.isPresent()){
                return ResponseEntity.ok().body("success");
            }

            FoodItem foodItemInfo = new FoodItem();
            foodItemInfo.setFoodName((String) entity.get("foodName"));
            foodItemInfo.setDescription((String) entity.get("description"));
            foodItemInfo.setImage((String) entity.get("image"));

            // FIX: Handle price conversion safely
            Object priceObj = entity.get("price");
            Integer price = null;
            if (priceObj instanceof Integer) {
                price = (Integer) priceObj;
            } else if (priceObj instanceof String) {
                price = Integer.parseInt((String) priceObj);
            }
            foodItemInfo.setPrice(price);

            foodItemRepo.save(foodItemInfo);
            foodItemInfo.setRestaurantInfo(restInfo.get());
            restInfo.get().getFoodItems().add(foodItemInfo);
            restaurantInfoRepo.save(restInfo.get());
            return ResponseEntity.ok().body("success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error adding food item");
        }
    }

    public ResponseEntity<String> editFoodItems(Map entity){
        try {
            Integer restaurantId = (Integer) entity.get("restaurantId");
            Optional<RestaurantInfo> restaurantInfo = restaurantInfoRepo.findById(restaurantId);
            RestaurantInfo rest = restaurantInfo.get();
            Integer fooditemid = (Integer) entity.get("fooditemid");
            Optional<FoodItem> foodItem = foodItemRepo.findByRestaurantIdAndFoodName((Integer) entity.get("restaurantId"), (String) entity.get("foodName"));

            if(foodItem.isPresent() && foodItem.get().getFoodItemId() != fooditemid){
                return ResponseEntity.ok().body("name");
            }
            Optional<FoodItem> foodItem1 = foodItemRepo.findById(fooditemid);
            FoodItem f = foodItem1.get();
            f.setFoodName((String) entity.get("foodName"));
            f.setDescription((String) entity.get("description"));
            f.setImage((String) entity.get("image"));

            // FIX: Handle price conversion safely
            Object priceObj = entity.get("price");
            Integer price = null;
            if (priceObj instanceof Integer) {
                price = (Integer) priceObj;
            } else if (priceObj instanceof String) {
                price = Integer.parseInt((String) priceObj);
            }
            f.setPrice(price);

            foodItemRepo.save(f);
            f.setRestaurantInfo(rest);
            restaurantInfoRepo.save(rest);
            return ResponseEntity.ok().body("success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error editing food item");
        }
    }

    public ResponseEntity<String> deleteFoodItem(Map<String, String> entity){
        try {
            foodItemRepo.deleteById(Integer.parseInt(entity.get("foodItemId")));
            return ResponseEntity.ok().body("success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting food item");
        }
    }
}