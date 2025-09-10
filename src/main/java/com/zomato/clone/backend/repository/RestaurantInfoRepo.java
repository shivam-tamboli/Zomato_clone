package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.RestaurantInfo;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RestaurantInfoRepo extends JpaRepository<RestaurantInfo, Integer> {
    public Optional<RestaurantInfo> findByRestaurantNameAndRestaurantAddress(String restaurantname, String address);

    public Optional<RestaurantInfo> findByRestaurantId(Integer id);

    public List<RestaurantInfo> findByRestaurantNameContaining(String name);

    // @Query("SELECT p FROM RestaurantInfo p WHERE " +
    // "p.restaurantname LIKE CONCAT('%',:query, '%')")
    // List<RestaurantInfo> searchRestaurantName(String query);

    public Collection<? extends RestaurantInfo> findByRestaurantNameContaining(String string, Sort by);

}