
package com.zomato.clone.backend.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantDetails {

    private String restaurantName;
    private Integer restaurantId;
    private String restaurantAddress;
    private List<RestaurantImages> restaurantImages;
    private float restaurantRating;



}
