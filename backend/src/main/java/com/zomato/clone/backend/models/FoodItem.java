package com.zomato.clone.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "food_items")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_item_id", nullable = false)
    private Integer foodItemId;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "price")
    private Integer price;

    @Column(name = "image", nullable = false)
    private String image;

    @Column(name = "food_item_rating", nullable = false)
    private Double foodItemRating = 0.0;

    @Column(name = "number_of_rating")
    private Integer numOfRating = 0;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private RestaurantInfo restaurantInfo;
}
