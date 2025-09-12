package com.zomato.clone.backend.controller;

import com.zomato.clone.backend.service.UserService;
import com.zomato.clone.backend.service.ValidUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/zomato/user")
public class UserController {

    private final ValidUser validUser;
    private final UserService userService;

    public UserController(ValidUser validUser, UserService userService) {
        this.validUser = validUser;
        this.userService = userService;
    }
}
