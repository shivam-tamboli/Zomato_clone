package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.RestaurantInfo;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
@Repository
public interface RestaurantInfoRepo extends JpaRepository<RestaurantInfo, Integer> {

    Optional<RestaurantInfo> findByRestaurantNameAndRestaurantAddress(String restaurantName, String address);

    Optional<RestaurantInfo> findByRestaurantId(Integer id);

    List<RestaurantInfo> findByRestaurantNameContaining(String name, Sort sort);

    boolean existsByRestaurantName(String name);

    List<RestaurantInfo> findByRestaurantNameContaining(String restaurantName);
}
