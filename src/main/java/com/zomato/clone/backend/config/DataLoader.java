package com.zomato.clone.backend.config;

import com.zomato.clone.backend.models.FoodItem;
import com.zomato.clone.backend.models.RestaurantInfo;
import com.zomato.clone.backend.repository.RestaurantInfoRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final RestaurantInfoRepo restaurantInfoRepo;

    public DataLoader(RestaurantInfoRepo restaurantInfoRepo) {
        this.restaurantInfoRepo = restaurantInfoRepo;
    }

    @Override
    public void run(String... args) throws Exception {

        // Insert Pizza Palace
        insertRestaurantIfNotExists(
                "Pizza Palace",
                "MG Road, City",
                4.5f,
                10,
                new String[]{"Margherita Pizza", "Veggie Delight"},
                new String[]{"Classic cheese pizza with tomato base", "Loaded with capsicum, onion, and sweet corn"},
                new String[]{"margherita.jpg", "veggie.jpg"},
                new double[]{4.2, 4.4},
                new int[]{5, 8}
        );

        // Insert Burger Hub
        insertRestaurantIfNotExists(
                "Burger Hub",
                "Main Street, City",
                4.2f,
                15,
                new String[]{"Cheeseburger", "Veggie Burger"},
                new String[]{"Juicy beef burger with cheese", "Loaded with fresh veggies"},
                new String[]{"cheese.jpg", "veggie_burger.jpg"},
                new double[]{4.1, 4.3},
                new int[]{10, 7}
        );

        // Insert Tandoori House
        insertRestaurantIfNotExists(
                "Tandoori House",
                "Old Market, City",
                4.6f,
                20,
                new String[]{"Chicken Tikka", "Paneer Tandoori"},
                new String[]{"Grilled chicken with spices", "Smoky paneer with tandoori masala"},
                new String[]{"tikka.jpg", "paneer.jpg"},
                new double[]{4.5, 4.4},
                new int[]{12, 9}
        );

        // Insert Cafe Mocha
        insertRestaurantIfNotExists(
                "Cafe Mocha",
                "Park Street, City",
                4.3f,
                18,
                new String[]{"Cappuccino", "Chocolate Brownie"},
                new String[]{"Freshly brewed cappuccino", "Rich chocolate brownie with nuts"},
                new String[]{"cappuccino.jpg", "brownie.jpg"},
                new double[]{4.6, 4.7},
                new int[]{14, 11}
        );
    }

    private void insertRestaurantIfNotExists(String name, String address, float rating, int numOfRatings,
                                             String[] foodNames, String[] descriptions, String[] images,
                                             double[] foodRatings, int[] foodNumRatings) {

        if (restaurantInfoRepo.existsByRestaurantName(name)) {
            System.out.println("ℹ️ Restaurant " + name + " already exists, skipping...");
            return;
        }

        RestaurantInfo r = new RestaurantInfo();
        r.setRestaurantName(name);
        r.setRestaurantAddress(address);
        r.setRestaurantRating(rating);
        r.setNumOfRating(numOfRatings);

        for (int i = 0; i < foodNames.length; i++) {
            FoodItem f = new FoodItem();
            f.setFoodName(foodNames[i]);
            f.setDescription(descriptions[i]);
            f.setImage(images[i]);
            f.setFoodItemRating(foodRatings[i]);
            f.setNumOfRating(foodNumRatings[i]);
            f.setRestaurantInfo(r);
            r.getFoodItems().add(f);
        }

        restaurantInfoRepo.save(r);
        System.out.println("✅ Restaurant " + name + " + food items inserted");
    }
}
