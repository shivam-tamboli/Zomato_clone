package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.RestaurantImages;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RestaurantImagesRepo extends CrudRepository<RestaurantImages, Integer> {
    @Query(value = "DELETE FROM restaurant_images where restaurant_id = :rId", nativeQuery = true)
    @Modifying
    @Transactional
    public void deleteByRestaurantid(Integer rId);
}
