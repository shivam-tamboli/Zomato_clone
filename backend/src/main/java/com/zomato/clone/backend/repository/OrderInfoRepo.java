package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.OrderInfo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderInfoRepo extends CrudRepository<OrderInfo, Integer> {
    @Query(value = "SELECT* FROM order_info s WHERE s.user_id = :solve ", nativeQuery = true)
    public List<OrderInfo> findAllByUserid(Integer solve);

    public Optional<OrderInfo> findByUserIdAndOrderId(Integer userId,Integer orderId);

}
