package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.RestaurantInfo;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RestaurantInfoRepo extends JpaRepository<RestaurantInfo, Integer> {

    public Optional<RestaurantInfo> findByRestaurantNameAndRestaurantAddress(String restaurantName,  String restaurantAddress);

    public Optional<RestaurantInfo> findByRestaurantId(Integer restaurantId);

    public List<RestaurantInfo> findByRestaurantNameContaining(String restaurantName);

    public Collection<? extends RestaurantInfo> findByRestaurantNameContaining(String string , Sort by );

}
