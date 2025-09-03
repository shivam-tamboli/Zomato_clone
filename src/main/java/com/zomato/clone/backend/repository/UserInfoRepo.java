package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.UserInfo;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserInfoRepo extends CrudRepository<UserInfo, Integer> {

    public Optional<UserInfo> findByPhoneNumber(String phoneNumber);
}
