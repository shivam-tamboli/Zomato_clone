package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.FoodItem;
import com.zomato.clone.backend.models.OrderInfo;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface OrderInfoRepo extends CrudRepository<OrderInfo, Integer> {

    public List<OrderInfo> findAllByUserId(Integer userID);

    public Optional<OrderInfo> findByUserIdAndOrderId(Integer userID, Integer orderID);
}
