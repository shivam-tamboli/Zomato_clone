package com.zomato.clone.backend.controller;

import com.zomato.clone.backend.service.UserService;
import com.zomato.clone.backend.service.ValidUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController// Marks this class as a REST controller (can handle HTTP requests & return JSON/XML)
@RequestMapping(value = "/zomato/user")// Base URL for all user-related endpoints
public class UserController {

    private final ValidUser validUser;
    private final UserService userService;

    // Constructor-based dependency injection for ValidUser and UserService.
    public UserController(ValidUser validUser, UserService userService) {
        this.validUser = validUser;
        this.userService = userService;
    }


    /*
    Endpoint: POST /zomato/user/signup
    signup API → creates a new user
    checks if phone number already exists, if yes → return "phone"
    else → forward data to service to save in DB
    */
    @PostMapping("/signup")
    ResponseEntity<String> signup(@RequestBody Map<String, String> signupDetails){
     if(!validUser.isPhoneNumberUnique(signupDetails.get("phonenumber"))){
         return new ResponseEntity<>("phone", HttpStatus.OK);
     }
     return userService.signUp(signupDetails);
    }


   /*
   Endpoint: POST /zomato/user/login
   login API → authenticates existing user
    flow:
    1. check if phone exists, if not → "phone"
    2. check password, if wrong → "password"
    3. if all good → delegate to service (updates login status, returns success)
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
    Endpoint: POST /zomato/user/login
    Logout API -> Flips login status for given phone number.
    */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody Map entity){
        return userService.logout(entity);
    }


}
