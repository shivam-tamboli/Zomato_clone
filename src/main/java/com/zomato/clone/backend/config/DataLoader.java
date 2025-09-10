package com.zomato.clone.backend.config;

import com.zomato.clone.backend.models.FoodItem;
import com.zomato.clone.backend.models.RestaurantInfo;
import com.zomato.clone.backend.repository.RestaurantInfoRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;



@Component
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    private final RestaurantInfoRepo restaurantInfoRepo;

    public DataLoader(RestaurantInfoRepo restaurantInfoRepo) {
        this.restaurantInfoRepo = restaurantInfoRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        RestaurantInfo r1 = new RestaurantInfo();
        r1.setRestaurantName("Pizza Palace");
        r1.setRestaurantAddress("MG Road, City");
        r1.setRestaurantRating(4.5f);
        r1.setNumOfRating(10);

        // Food items
        FoodItem f1 = new FoodItem();
        f1.setFoodName("Margherita Pizza");
        f1.setDescription("Classic cheese pizza with tomato base");
        f1.setImage("margherita.jpg");
        f1.setFoodItemRating(4.2);
        f1.setNumOfRating(5);

        FoodItem f2 = new FoodItem();
        f2.setFoodName("Veggie Delight");
        f2.setDescription("Loaded with capsicum, onion, and sweet corn");
        f2.setImage("veggie.jpg");
        f2.setFoodItemRating(4.4);
        f2.setNumOfRating(8);

        // link both sides
        f1.setRestaurantInfo(r1);
        f2.setRestaurantInfo(r1);
        r1.getFoodItems().add(f1);
        r1.getFoodItems().add(f2);

        restaurantInfoRepo.save(r1);

        System.out.println("✅ Sample restaurant + food items inserted");
    }
}