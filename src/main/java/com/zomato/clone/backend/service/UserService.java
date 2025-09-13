package com.zomato.clone.backend.service;

import com.zomato.clone.backend.models.UserInfo;
import com.zomato.clone.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserInfoRepo userInfoRepo;
    private final RestaurantInfoRepo restaurantInfoRepo;
    private final FoodItemRepo foodItemRepo;
    private final OrderFoodItemsRepo orderFoodItemsRepo;
    private final OrderInfoRepo orderInfoRepo;
    private final RestaurantRatingRepo restaurantRatingRepo;
    private final FoodItemRatingRepo foodItemRatingRepo;

    //public UserService(UserInfoRepo userInfoRepo, Re){}


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

    public ResponseEntity<String> signUp (Map<String, String> signup){

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

    public ResponseEntity<String> login (Map<String, String> login){

        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(login.get("phonenumber"));
        UserInfo userInfo1 = userInfo.get();
        if(userInfo1.getRole() == 0){
            userInfo1.setLoginStatus(Boolean.TRUE);
            userInfo1 = userInfoRepo.save(userInfo1);

            return new ResponseEntity<>("Success_admin", HttpStatus.OK);
        }else {
            userInfo1.setLoginStatus(Boolean.TRUE);
            userInfo1 = userInfoRepo.save(userInfo1);
            return  new ResponseEntity<>("Success_user", HttpStatus.OK);
        }
    }
}
