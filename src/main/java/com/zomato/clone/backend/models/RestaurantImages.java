package com.zomato.clone.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "restaurant_images")
public class RestaurantImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id", nullable = false)
    private Integer imageId;

    @Column(name = "link", nullable = false)
    private String link;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private RestaurantInfo restaurantInfo;
}
