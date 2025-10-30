package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.FoodItem;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
@Repository
public interface FoodItemRepo extends CrudRepository<FoodItem, Integer> {
    @Query(value = "SELECT* FROM food_items s WHERE s.restaurant_id = :rId AND s.food_name =:name", nativeQuery = true)
    public Optional<FoodItem> findByRestaurantIdAndFoodName(Integer rId, String name);

    public List<FoodItem> findByFoodNameContaining(String name);

    public Collection<? extends FoodItem> findByFoodNameContaining(String string, Sort by);

    public List<FoodItem> findAll();

}



