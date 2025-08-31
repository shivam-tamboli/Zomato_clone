package com.zomato.clone.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "order_food_items")
public class OrderFoodItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_food_items_id", nullable = false)
    private Integer orderFoodItemsId;

    @Column(name = "food_item_id", nullable = false)
    private Integer foodItemId;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "amount", nullable = false)
    private Integer amount;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrderInfo orderInfo;
}
