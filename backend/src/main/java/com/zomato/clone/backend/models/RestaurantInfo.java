package com.zomato.clone.backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "restaurant_info")
public class RestaurantInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restaurant_id", nullable = false)
    private Integer restaurantId;

    @Column(name = "restaurant_name", nullable = false)
    private String restaurantName;

    @Column(name = "restaurant_address", nullable = false)
    private String restaurantAddress;

    @Column(name = "restaurant_rating", nullable = false)
    private Float restaurantRating = 0f;

    @Column(name = "num_of_rating", nullable = false)
    private Integer numOfRating = 0;

    @JsonManagedReference
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "restaurantInfo")
    private List<RestaurantImages> restaurantImages = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "restaurantInfo")
    private List<FoodItem> foodItems = new ArrayList<>();
}
