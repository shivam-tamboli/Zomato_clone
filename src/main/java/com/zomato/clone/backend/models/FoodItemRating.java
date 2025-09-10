
package com.zomato.clone.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "food_item_rating")
public class FoodItemRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_item_rating_id", nullable = false)
    private Integer foodItemRatingId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "restaurant_id", nullable = false)
    private Integer restaurantId;

    @Column(name = "restaurant_name", nullable = false)
    private String restaurantName;

    @Column(name = "food_item_id", nullable = false)
    private Integer foodItemId;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(name = "food_item_rating", nullable = false)
    private Double foodItemRating;

    @Column(name = "food_item_review", nullable = false)
    private  String foodItemReview;

}
