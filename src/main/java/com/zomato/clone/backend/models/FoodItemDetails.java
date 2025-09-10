
package com.zomato.clone.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FoodItemDetails {

    private Integer restaurantId;
    private FoodItem foodItem;
    private String restaurantName;
}
