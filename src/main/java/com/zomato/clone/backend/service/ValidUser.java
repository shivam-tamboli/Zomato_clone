package com.zomato.clone.backend.service;

import com.zomato.clone.backend.repository.UserInfoRepo;
import org.springframework.stereotype.Service;

@Service
public class ValidUser {

    private final UserInfoRepo userInfoRepo;

    public ValidUser(UserInfoRepo userInfoRepo) {
        this.userInfoRepo = userInfoRepo;
    }

}
