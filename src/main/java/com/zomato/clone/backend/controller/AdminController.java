package com.zomato.clone.backend.controller;


import com.zomato.clone.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(value = "/zomato/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping(value = "/add-restaurant")
    public ResponseEntity<String> addRestaurant(@RequestBody Map entity){
        return adminService.addRestaurant(entity);
    }

    @PostMapping(value = "/edit-restaurant")
    public ResponseEntity<String> editRestaurant(@RequestBody Map entity){
        return adminService.editRestaurant(entity);
    }
}
