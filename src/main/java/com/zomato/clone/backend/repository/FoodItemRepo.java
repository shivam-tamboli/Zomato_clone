package com.zomato.clone.backend.repository;

import com.zomato.clone.backend.models.FoodItem;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface FoodItemRepo extends CrudRepository<FoodItem, Integer> {

    public Optional<FoodItem> findByRestaurantidAndFoodname(Integer rId, String name);

    public List<FoodItem> findByFoodnameContaining(String name);

    public Collection<? extends FoodItem> findByFoodnameContaining(String string, Sort by);

    public List<FoodItem> findAll();

}
