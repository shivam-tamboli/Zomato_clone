
package com.zomato.clone.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_info")
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id",  updatable = false, nullable = false)
    private Integer userId;

    @Column(name = "name",  nullable = false)
    private String name;

    @Column(name = "phone_number", unique = true,  nullable = false)
    private String phoneNumber;

    @Column(name = "secret_question", nullable = false)
    private String secretQuestion;

    @Column(name = "address",  nullable = false)
    private String address;

    @Column(name = "answer", nullable = false)
    private String answer;

    @Column(name = "password",  nullable = false)
    private String password;

    @Column(name = "login_status", nullable = false)
    private boolean loginStatus;

    @Column(name = "role", unique = false, updatable = true, nullable = false)
    private Integer role = 1;

}
