package com.zomato.clone.backend.controller;

import com.zomato.clone.backend.service.UserService;
import com.zomato.clone.backend.service.ValidUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "/zomato/user")
public class UserController {

    private final ValidUser validUser;
    private final UserService userService;

    public UserController(ValidUser validUser, UserService userService) {
        this.validUser = validUser;
        this.userService = userService;
    }

    @PostMapping("/signup")
    ResponseEntity<String> signup(@RequestBody Map<String, String> signupDetails){
     if(!validUser.isPhoneNumberUnique(signupDetails.get("phonenumber"))){
         return new ResponseEntity<>("phone", HttpStatus.OK);
     }
     return userService.signUp(signupDetails);
    }

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
}
