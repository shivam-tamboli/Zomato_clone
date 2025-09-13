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

}
