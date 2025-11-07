package com.zomato.clone.backend.controller;

import com.zomato.clone.backend.models.*;
import com.zomato.clone.backend.service.UserService;
import com.zomato.clone.backend.service.ValidUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController// Marks this class as a REST controller (can handle HTTP requests & return JSON/XML)
@RequestMapping(value = "/zomato/user")// Base URL for all user-related endpoints
public class UserController {

    private final ValidUser validUser;
    private final UserService userService;

    // Constructor-based dependency injection.
    public UserController(ValidUser validUser, UserService userService) {
        this.validUser = validUser;
        this.userService = userService;
    }


    /*
        Signup API -> creates a new user.
        Flow ->
        1. Check if phone number already exists; if yes, return "phone".
        2. If not, delegate to service to save the user in DB.
    */
    @PostMapping("/signup")
    ResponseEntity<String> signup(@RequestBody Map<String, String> signupDetails){
     if(!validUser.isPhoneNumberUnique(signupDetails.get("phonenumber"))){
         return new ResponseEntity<>("phone", HttpStatus.OK);
     }
     return userService.signUp(signupDetails);
    }


    /*
         Login API -> authenticates an existing user.
         Flow ->
         1. Check if phone exists; if not, return "phone".
         2. Check password; if wrong, return "password".
         3. If valid, delegate to service (update login status, return success).
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> loginDetails){
        if(validUser.isPhoneNumberUnique(loginDetails.get("phonenumber"))){
            return new ResponseEntity<>("phone", HttpStatus.OK);
        }
        if(!validUser.isPasswordValid(loginDetails.get("phonenumber"), loginDetails.get("password"))){
            return new ResponseEntity<>("password", HttpStatus.OK);
        }
        return userService.login(loginDetails);
    }



    /*
        Logout API -> flips login status for a given phone number.
        Flow -> delegate to service to update login status and return success.
    */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody Map entity){
        return userService.logout(entity);
    }


    /*
        Forgot Password API -> returns the secret question for password recovery.
        Flow ->
        1. Accept phone number from request body.
        2. If number not found, return "phone".
        3. If found, delegate to service to fetch secret question.
    */
    @PostMapping(value = "/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> entity){
        if(validUser.isPhoneNumberUnique(entity.get("phonenumber"))) {
            return new ResponseEntity<>("phone", HttpStatus.OK);
        }
        return userService.forgotPassword(entity);
    }

    /*
        Reset Password API -> updates user's password after verifying secret question & answer.
        Flow ->
        1. Accept phone number, secret question, answer, and new password from request body.
        2. Delegate to service to validate and update password.
        3. Return "answer" if validation fails, else "success".
    */
    @PostMapping(value = "/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> entity){
        return userService.resetPassword(entity);
    }


    /*
    Search By Name API -> returns restaurants matching the search string.
    Flow ->
    1. Accepts a search string from the request body.
    2. Delegates the search to UserService.
    3. Returns a list of matching RestaurantInfo objects in the response.
    */
    @PostMapping(value = "/search-by-name")
    public ResponseEntity<List<RestaurantInfo>> searchByName(@RequestBody Map<String, String> entity){
        return userService.searchByName(entity);
    }

    /*
    Search Food Items API -> returns food items with restaurant details that match the search string.
    Flow ->
     1) Read 'search' from request and split into words
     2) for each non-empty word find FoodItem(s) (sorted by rating) and collect results
     3) map each FoodItem to SearchFoodItem DTO, remove duplicates, return list.
    */
    @PostMapping(value = "/search-by-fooditem")
    public ResponseEntity<List<SearchFoodItem>> searchByFoodItem(@RequestBody Map<String, String> entity){
        return userService.searchByFoodItem(entity);
    }

    /*
    Place Order API -> creates an order with its food items.
    Flow ->
    1) Read order and food item details from request body;
    2) Fetch restaurant and user info;
    3) Create OrderInfo entity and save;
    4) Iterate over food items, create OrderFoodItems, attach to OrderInfo;
    5) Save order with all items and return success.
    */
    @PostMapping(value = "/place-order")
    public ResponseEntity<String> placeOrder(@RequestBody Map entity){

        return userService.placeOrder(entity);
    }

    @PostMapping(value = "/rate-order")
    public ResponseEntity<String> rateOrder(@RequestBody Map entity) {
        return userService.rateOrder(entity);

    }

    @GetMapping(value = "/get-all-food-items")
    public ResponseEntity<List<FoodItemDetails>> getAllFoodItems() {
        return userService.getAllFoodItems();
    }

    // This method already exists in your controller, use it instead
    @PostMapping("/get-all-order-details")
    public ResponseEntity<List<OrderInfo>> getAllOrderDetails(@RequestBody Map<String, String> entity) {
        return userService.getAllOrderDetails(entity);
    }

    @GetMapping(value = "/get-all-restaurants")
    public ResponseEntity<List<RestaurantInfo>> getAllRestaurants() {
        return userService.getAllRestaurants();
    }

    @PostMapping(value = "/get-fooditems")
    public ResponseEntity<List<FoodItem>> getFoodItems(@RequestBody Map<String, Integer> entity) {
        return userService.getFoodItemsByRestaurant(entity);
    }



}
