
package com.zomato.clone.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SearchFoodItem {
    private Integer restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private Float restaurantRating;
    private FoodItem foodItem;
}
