package com.zomato.clone.backend.service;

import com.zomato.clone.backend.models.UserInfo;
import com.zomato.clone.backend.repository.UserInfoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;

@Service
public class ValidUser {


    private final  UserInfoRepo userInfoRepo;

    public ValidUser(UserInfoRepo userInfoRepo) {
        this.userInfoRepo = userInfoRepo;
    }

    public boolean isPhoneNumberUnique(String phoneNumber){

        Iterable<UserInfo> itr = userInfoRepo.findAll();

        Iterator<UserInfo> i = itr.iterator();

        while (i.hasNext()){

            UserInfo userInfo = i.next();
            if(phoneNumber.equals(userInfo.getPhoneNumber())){
                return false;
            }
        }
        return true;
    }
}
