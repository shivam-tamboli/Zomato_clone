package com.zomato.clone.backend.service;

import com.zomato.clone.backend.models.FoodItem;
import com.zomato.clone.backend.models.RestaurantInfo;
import com.zomato.clone.backend.models.SearchFoodItem;
import com.zomato.clone.backend.models.UserInfo;
import com.zomato.clone.backend.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserInfoRepo userInfoRepo;
    private final RestaurantInfoRepo restaurantInfoRepo;
    private final FoodItemRepo foodItemRepo;
    private final OrderFoodItemsRepo orderFoodItemsRepo;
    private final OrderInfoRepo orderInfoRepo;
    private final RestaurantRatingRepo restaurantRatingRepo;
    private final FoodItemRatingRepo foodItemRatingRepo;


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

    public ResponseEntity<String> signUp(Map<String, String> signup) {

        UserInfo userInfo = new UserInfo();
        userInfo.setName(signup.get("name"));
        userInfo.setPhoneNumber(signup.get("phonenumber"));
        userInfo.setSecretQuestion(signup.get("secretquestion"));
        userInfo.setEmail(signup.get("email"));
        userInfo.setAddress(signup.get("address"));
        userInfo.setAnswer(signup.get("answer"));
        userInfo.setPassword(signup.get("password"));
        userInfo.setLoginStatus(Boolean.FALSE);

        userInfo = userInfoRepo.save(userInfo);

        return new ResponseEntity<>("success", HttpStatus.OK);
    }

    public ResponseEntity<String> login(Map<String, String> login) {

        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(login.get("phonenumber"));
        UserInfo userInfo1 = userInfo.get();
        if (userInfo1.getRole() == 0) {
            userInfo1.setLoginStatus(Boolean.TRUE);
            userInfo1 = userInfoRepo.save(userInfo1);

            return new ResponseEntity<>("Success_admin", HttpStatus.OK);
        } else {
            userInfo1.setLoginStatus(Boolean.TRUE);
            userInfo1 = userInfoRepo.save(userInfo1);
            return new ResponseEntity<>("Success_user", HttpStatus.OK);
        }
    }


    public ResponseEntity<String> logout(Map entity) {
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber((String) entity.get("phonenumber"));
        UserInfo userInfo1 = userInfo.get();
        userInfo1.setLoginStatus(Boolean.FALSE);
        userInfo1 = userInfoRepo.save(userInfo1);
        return ResponseEntity.ok().body("success");
    }


    public ResponseEntity<String> forgotPassword(Map<String, String> forgot) {
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(forgot.get("phonenumber"));
        UserInfo userInfo1 = userInfo.get();
        return new ResponseEntity<>(userInfo1.getSecretQuestion(), HttpStatus.OK);
    }


    public ResponseEntity<String> resetPassword(Map<String, String> forgotPassword) {
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(forgotPassword.get("phonenumber"));

        if (userInfo.isEmpty()) {
            return new ResponseEntity<>("user_not_found", HttpStatus.OK);
        }

        UserInfo userInfo1 = userInfo.get();

        if (!userInfo1.getSecretQuestion().equals(forgotPassword.get("secretquestion"))) {
            return new ResponseEntity<>("invalid_question", HttpStatus.OK);
        }

        if (!userInfo1.getAnswer().equals(forgotPassword.get("answer"))) {
            return new ResponseEntity<>("invalid_answer", HttpStatus.OK);
        }

        // update password
        userInfo1.setPassword(forgotPassword.get("password"));
        userInfoRepo.save(userInfo1);

        return new ResponseEntity<>("success", HttpStatus.OK);
    }


    public ResponseEntity<List<RestaurantInfo>> searchByName(Map<String, String> entity) {
        String search = entity.get("search");
        String[] words = search.split(" ");

        ArrayList<RestaurantInfo> common = new ArrayList<>();
        for (int i = 0; i < words.length; i++) {
            if (words[i].isEmpty()) {
                continue;
            }
            common.addAll(restaurantInfoRepo.findByRestaurantNameContaining(words[i],
                    Sort.by(Sort.Direction.DESC, "restaurantRating")));
        }

        Set<RestaurantInfo> set = new LinkedHashSet<>(common);
        List<RestaurantInfo> restaurant = new ArrayList<>(set);

        return ResponseEntity.ok().body(restaurant);
    }


    public ResponseEntity<List<SearchFoodItem>> searchByFoodItem(Map<String, String> entity) {

        String search = entity.get("search");
        String[] words = search.split(" ");

        List<FoodItem> common = new ArrayList<FoodItem>();
        for (int i = 0; i < words.length; i++) {
            if (words[i] == "") {
                continue;
            }
            common.addAll(foodItemRepo.findByFoodNameContaining(words[i],
                    Sort.by(Sort.Direction.DESC, "foodItemRating")));
        }
        List<FoodItem> foodItems = common;
        ListIterator<FoodItem> itr = foodItems.listIterator();
        List<SearchFoodItem> sfooditem = new ArrayList<>();
        while (itr.hasNext()) {
            FoodItem food = itr.next();
            RestaurantInfo rest = food.getRestaurantInfo();
            SearchFoodItem searchFood = new SearchFoodItem(rest.getRestaurantId(), rest.getRestaurantName(),
                    rest.getRestaurantAddress(), rest.getRestaurantRating(), food);
            sfooditem.add(searchFood);
        }
        Set<SearchFoodItem> set = new LinkedHashSet<>(sfooditem);
        List<SearchFoodItem> food = new ArrayList<>(set);

        return ResponseEntity.ok().body(food);

    }
}
