package com.zomato.clone.backend.service;

import com.zomato.clone.backend.models.*;
import com.zomato.clone.backend.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.util.*;

@Service
public class UserService {

    private final UserInfoRepo userInfoRepo;
    private final RestaurantInfoRepo restaurantInfoRepo;
    private final FoodItemRepo foodItemRepo;
    private final OrderFoodItemsRepo orderFoodItemsRepo;
    private final OrderInfoRepo orderInfoRepo;
    private final RestaurantRatingRepo restaurantRatingRepo;
    private final FoodItemRatingRepo foodItemRatingRepo;


    public UserService(UserInfoRepo userInfoRepo, RestaurantInfoRepo restaurantInfoRepo, FoodItemRepo foodItemRepo,
                       OrderFoodItemsRepo orderFoodItemsRepo, OrderInfoRepo orderInfoRepo, RestaurantRatingRepo restaurantRatingRepo,
                       FoodItemRatingRepo foodItemRatingRepo) {
        this.userInfoRepo = userInfoRepo;
        this.restaurantInfoRepo = restaurantInfoRepo;
        this.foodItemRepo = foodItemRepo;
        this.orderFoodItemsRepo = orderFoodItemsRepo;
        this.orderInfoRepo = orderInfoRepo;
        this.restaurantRatingRepo = restaurantRatingRepo;
        this.foodItemRatingRepo = foodItemRatingRepo;
    }

    public ResponseEntity<String> signUp(Map<String, String> signup) {

        UserInfo userInfo = new UserInfo();
        userInfo.setName(signup.get("name"));
        userInfo.setPhoneNumber(signup.get("phonenumber"));
        userInfo.setSecretQuestion(signup.get("secretquestion"));
        userInfo.setEmail(signup.get("email"));
        userInfo.setAddress(signup.get("address"));
        userInfo.setAnswer(signup.get("answer"));
        userInfo.setPassword(signup.get("password"));
        userInfo.setLoginStatus(Boolean.FALSE);

        userInfo = userInfoRepo.save(userInfo);

        return new ResponseEntity<>("success", HttpStatus.OK);
    }

    public ResponseEntity<String> login(Map<String, String> login) {

        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(login.get("phonenumber"));
        UserInfo userInfo1 = userInfo.get();
        if (userInfo1.getRole() == 0) {
            userInfo1.setLoginStatus(Boolean.TRUE);
            userInfo1 = userInfoRepo.save(userInfo1);

            return new ResponseEntity<>("Success_admin", HttpStatus.OK);
        } else {
            userInfo1.setLoginStatus(Boolean.TRUE);
            userInfo1 = userInfoRepo.save(userInfo1);
            return new ResponseEntity<>("Success_user", HttpStatus.OK);
        }
    }


    public ResponseEntity<String> logout(Map entity) {
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber((String) entity.get("phonenumber"));
        UserInfo userInfo1 = userInfo.get();
        userInfo1.setLoginStatus(Boolean.FALSE);
        userInfo1 = userInfoRepo.save(userInfo1);
        return ResponseEntity.ok().body("success");
    }


    public ResponseEntity<String> forgotPassword(Map<String, String> forgot) {
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(forgot.get("phonenumber"));
        UserInfo userInfo1 = userInfo.get();
        return new ResponseEntity<>(userInfo1.getSecretQuestion(), HttpStatus.OK);
    }


    public ResponseEntity<String> resetPassword(Map<String, String> forgotPassword) {
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(forgotPassword.get("phonenumber"));

        if (userInfo.isEmpty()) {
            return new ResponseEntity<>("user_not_found", HttpStatus.OK);
        }

        UserInfo userInfo1 = userInfo.get();

        if (!userInfo1.getSecretQuestion().equals(forgotPassword.get("secretquestion"))) {
            return new ResponseEntity<>("invalid_question", HttpStatus.OK);
        }

        if (!userInfo1.getAnswer().equals(forgotPassword.get("answer"))) {
            return new ResponseEntity<>("invalid_answer", HttpStatus.OK);
        }

        // update password
        userInfo1.setPassword(forgotPassword.get("password"));
        userInfoRepo.save(userInfo1);

        return new ResponseEntity<>("success", HttpStatus.OK);
    }


    public ResponseEntity<List<RestaurantInfo>> searchByName(Map<String, String> entity) {
        String search = entity.get("search");
        String[] words = search.split(" ");

        ArrayList<RestaurantInfo> common = new ArrayList<>();
        for (int i = 0; i < words.length; i++) {
            if (words[i].isEmpty()) {
                continue;
            }
            common.addAll(restaurantInfoRepo.findByRestaurantNameContaining(words[i],
                    Sort.by(Sort.Direction.DESC, "restaurantRating")));
        }

        Set<RestaurantInfo> set = new LinkedHashSet<>(common);
        List<RestaurantInfo> restaurant = new ArrayList<>(set);

        return ResponseEntity.ok().body(restaurant);
    }


    public ResponseEntity<List<SearchFoodItem>> searchByFoodItem(Map<String, String> entity) {

        String search = entity.get("search");
        String[] words = search.split(" ");

        List<FoodItem> common = new ArrayList<FoodItem>();
        for (int i = 0; i < words.length; i++) {
            if (words[i] == "") {
                continue;
            }
            common.addAll(foodItemRepo.findByFoodNameContaining(words[i],
                    Sort.by(Sort.Direction.DESC, "foodItemRating")));
        }
        List<FoodItem> foodItems = common;
        ListIterator<FoodItem> itr = foodItems.listIterator();
        List<SearchFoodItem> sfooditem = new ArrayList<>();
        while (itr.hasNext()) {
            FoodItem food = itr.next();
            RestaurantInfo rest = food.getRestaurantInfo();
            SearchFoodItem searchFood = new SearchFoodItem(rest.getRestaurantId(), rest.getRestaurantName(),
                    rest.getRestaurantAddress(), rest.getRestaurantRating(), food);
            sfooditem.add(searchFood);
        }
        Set<SearchFoodItem> set = new LinkedHashSet<>(sfooditem);
        List<SearchFoodItem> food = new ArrayList<>(set);

        return ResponseEntity.ok().body(food);

    }


    public ResponseEntity<String> placeOrder(Map entity) {
        Optional<RestaurantInfo> restaurantInfo = restaurantInfoRepo.findById((Integer) entity.get("restaurantId"));
        RestaurantInfo rest = restaurantInfo.get();
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setRestaurantId((Integer) entity.get("restaurantId"));
        orderInfo.setRestaurantName((String) entity.get("restaurantName"));
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber((String) entity.get("phonenumber"));
        UserInfo user = userInfo.get();
        orderInfo.setUserId(user.getUserId());
        orderInfo.setDeliveryAddress((String) entity.get("deliveryAddress"));
        orderInfo.setTotalAmount((Integer) entity.get("totalAmount"));
        orderInfoRepo.save(orderInfo);

        ArrayList<String> fooditemid = (ArrayList) entity.get("foodItemId");
        ListIterator<String> ll = fooditemid.listIterator();

        ArrayList<String> foodname = (ArrayList) entity.get("foodName");
        ListIterator<String> name = foodname.listIterator();

        ArrayList<String> amount = (ArrayList) entity.get("amount");
        ListIterator<String> famount = amount.listIterator();

        ArrayList<String> quantity = (ArrayList) entity.get("quantity");
        ListIterator<String> fquantity = quantity.listIterator();

        while (ll.hasNext()) {

            OrderFoodItems orderFoodItems = new OrderFoodItems();
            String s = ll.next();
            orderFoodItems.setFoodItemId(Integer.parseInt(s));

            s = name.next();
            orderFoodItems.setFoodName(s);

            s = famount.next();
            orderFoodItems.setAmount(Integer.parseInt(s));

            s = fquantity.next();
            orderFoodItems.setQuantity(Integer.parseInt(s));

            orderFoodItems.setOrderInfo(orderInfo);
            orderInfo.getOrderFoodItems().add(orderFoodItems);
            orderInfoRepo.save(orderInfo);
        }

        System.out.println("*******************************" + orderInfo);

        return ResponseEntity.ok().body("success");

    }

    public ResponseEntity<String> rateOrder(Map entity) {
        Optional<RestaurantInfo> restaurantInfo = restaurantInfoRepo.findById((Integer) entity.get("restaurantId"));
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber((String) entity.get("phonenumber"));
        Optional<OrderInfo> order = orderInfoRepo.findByUserIdAndOrderId(userInfo.get().getUserId(), (Integer) entity.get("orderId"));
        OrderInfo orderInfo = order.get();
        orderInfo.setOrderFlag(1);
        orderInfoRepo.save(orderInfo);
        RestaurantInfo rest = restaurantInfo.get();
        int id = (Integer) entity.get("restaurantId");
        Float f = Float.valueOf(id);   // recommended
        Float f1 = f.floatValue();
        Float rating = 0f;
        if (rest.getRestaurantRating() == 0.0) {
            rating = f1;
            rest.setRestaurantRating(rating);
            rest.setNumOfRating(rest.getNumOfRating() + 1);
            restaurantInfoRepo.save(rest);
        } else {
            rating = (float) (((rest.getRestaurantRating() * rest.getNumOfRating()) + f1) / (rest.getNumOfRating() + 1));
            rest.setRestaurantRating(rating);
            rest.setNumOfRating(rest.getNumOfRating() + 1);
            restaurantInfoRepo.save(rest);
        }
        RestaurantRating restaurantRating = new RestaurantRating();

        restaurantRating.setName(userInfo.get().getName());
        restaurantRating.setRestaurantId((Integer) entity.get("restaurantid"));
        restaurantRating.setRestaurantName(rest.getRestaurantName());
        restaurantRating.setRestaurantRating(rest.getRestaurantRating());
        restaurantRating.setRestaurantReview((String) entity.get("restaurantreview"));
        restaurantRatingRepo.save(restaurantRating);

        ArrayList<String> fooditemid = (ArrayList) entity.get("fooditemid");

        if (fooditemid.isEmpty()) {
            return ResponseEntity.ok().body("success");
        } else {
            ListIterator<String> ll = fooditemid.listIterator();

            ArrayList<String> fooditemrating = (ArrayList) entity.get("fooditemrating");
            ListIterator<String> ratingitr = fooditemrating.listIterator();

            ArrayList<String> fooditemreview = (ArrayList) entity.get("fooditemreview");
            ListIterator<String> review = fooditemreview.listIterator();

            while (ll.hasNext()) {

                FoodItemRating foodrating = new FoodItemRating();
                foodrating.setName(userInfo.get().getName());
                foodrating.setRestaurantId((Integer) entity.get("restaurantid"));
                foodrating.setRestaurantName(rest.getRestaurantName());

                String s = ll.next();
                Optional<FoodItem> food = foodItemRepo.findById(Integer.parseInt(s));
                FoodItem foodItem = food.get();
                foodrating.setFoodItemId(Integer.parseInt(s));
                foodrating.setFoodName(foodItem.getFoodName());

                String rate = ratingitr.next();
                System.out.println("########################" + rate);
                System.out.println("***************************" + Double.parseDouble(rate));

                foodrating.setFoodItemRating(Double.parseDouble(rate));
                String fReview = review.next();
                foodrating.setFoodItemReview(fReview);
                foodItemRatingRepo.save(foodrating);
                Double foodRating = 0.0;

                if (foodItem.getFoodItemRating() == 0.0) {

                    foodItem.setFoodItemRating(Double.parseDouble(rate));
                    foodItem.setNumOfRating(foodItem.getNumOfRating() + 1);
                    foodItemRepo.save(foodItem);

                } else {
                    foodRating = ((foodItem.getFoodItemRating() * foodItem.getNumOfRating())
                            + Double.parseDouble(rate)) / (foodItem.getNumOfRating() + 1);

                    foodItem.setFoodItemRating(foodRating);
                    foodItem.setNumOfRating(foodItem.getNumOfRating() + 1);
                    foodItemRepo.save(foodItem);
                }
            }

        }
        return ResponseEntity.ok().body("success");
    }
}