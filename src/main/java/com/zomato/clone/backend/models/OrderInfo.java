package com.zomato.clone.backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "order_info")
public class OrderInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "restaurant_id", nullable = false)
    private Integer restaurantId;

    @Column(name = "restaurant_name", nullable = false)
    private String restaurantName;

    @Column(name = "total_amount", nullable = false)
    private Integer totalAmount;

    @Column(name = "order_flag", nullable = false)
    private Integer orderFlag = 0;

    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;

    @JsonManagedReference
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "orderInfo")
    private List<OrderFoodItems> orderFoodItems = new ArrayList<>();
}
