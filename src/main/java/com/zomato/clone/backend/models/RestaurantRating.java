
package com.zomato.clone.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "restaurant_rating")
public class RestaurantRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restaurant_rating_id", nullable = false)
    private Integer restaurantRatingId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "restaurant_id", nullable = false)
    private Integer restaurantId;

    @Column(name = "restaurant_name")
    private String restaurantName;

    @Column(name = "restaurant_rating", nullable = false)
    private Float restaurantRating;

    @Column(name = "restaurant_review", nullable = false)
    private String restaurantReview;


}
