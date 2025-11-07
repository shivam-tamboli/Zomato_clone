import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/RateOrder.css';

export default class RateOrder extends Component {
    constructor(props) {
        super(props);

        console.log("📝 RateOrder - Received props:", props);
        console.log("📝 Location state:", props.location?.state);

        const locationState = props.location?.state || {};
        this.userPhoneNumber = locationState.phonenum;
        this.obj = locationState.obj || {};

        console.log("📝 Order object received:", this.obj);
        console.log("📝 Food items in order:", this.obj.orderFoodItems);

        const orderId = this.obj.orderid || this.obj.orderId;
        const restaurantId = this.obj.restaurantid || this.obj.restaurantId;
        const restaurantName = this.obj.restaurantname || this.obj.restaurantName;

        console.log("🔍 Extracted orderId:", orderId);
        console.log("🔍 Extracted restaurantId:", restaurantId);
        console.log("🔍 Extracted restaurantName:", restaurantName);

        if (this.obj.orderFoodItems) {
            console.log("🔍 Total food items:", this.obj.orderFoodItems.length);
            this.obj.orderFoodItems.forEach((item, index) => {
                console.log(`🍕 Food item ${index}:`, item);
                console.log(`   - All keys:`, Object.keys(item));
                console.log(`   - foodItemId:`, item.foodItemId);
                console.log(`   - fooditemid:`, item.fooditemid);
                console.log(`   - food_item_id:`, item.food_item_id);
                console.log(`   - id:`, item.id);
            });
        } else {
            console.warn("⚠️ No orderFoodItems found in order object");
        }

        const foodRatings = this.obj.orderFoodItems ? this.obj.orderFoodItems.map((item, index) => {
            const foodItemId = item.foodItemId || item.fooditemid || item.food_item_id || item.id;

            console.log(`🔍 Processing food item ${index}:`, {
                originalItem: item,
                extractedId: foodItemId,
                foodName: item.foodName || item.foodname
            });

            if (!foodItemId) {
                console.warn(`❌ No ID found for food item ${index}:`, item);
            }

            return {
                foodItemId: foodItemId,
                foodName: item.foodName || item.foodname || `Food Item ${index + 1}`,
                rating: 0,
                review: ""
            };
        }) : [];

        console.log("✅ Final food ratings:", foodRatings);

        this.state = {
            orderId: orderId,
            restaurantId: restaurantId,
            restaurantName: restaurantName,
            restaurantRating: 0,
            restaurantReview: "",
            foodRatings: foodRatings
        };

        console.log("✅ Final state:", this.state);
    }

    handleRestaurantRatingChange = (e) => {
        this.setState({ restaurantRating: parseInt(e.target.value) });
    }

    handleRestaurantReviewChange = (e) => {
        this.setState({ restaurantReview: e.target.value });
    }

    handleFoodRatingChange = (index, value) => {
        const updatedFoodRatings = [...this.state.foodRatings];
        updatedFoodRatings[index].rating = parseInt(value);
        this.setState({ foodRatings: updatedFoodRatings });
    }

    handleFoodReviewChange = (index, value) => {
        const updatedFoodRatings = [...this.state.foodRatings];
        updatedFoodRatings[index].review = value;
        this.setState({ foodRatings: updatedFoodRatings });
    }

    submitRating = (e) => {
        e.preventDefault();

        console.log("📤 Submitting ratings...");
        console.log("📤 Current state:", this.state);

        const ratingData = {
            orderId: this.state.orderId,
            restaurantId: this.state.restaurantId,
            restaurantName: this.state.restaurantName,
            restaurantRating: this.state.restaurantRating,
            restaurantReview: this.state.restaurantReview,
            phonenumber: this.userPhoneNumber,
            foodItemIds: this.state.foodRatings
                .filter(item => item.foodItemId && item.foodItemId !== "undefined")
                .map(item => String(item.foodItemId)),
            foodItemRatings: this.state.foodRatings
                .filter(item => item.foodItemId && item.foodItemId !== "undefined")
                .map(item => String(item.rating)),
            foodItemReviews: this.state.foodRatings
                .filter(item => item.foodItemId && item.foodItemId !== "undefined")
                .map(item => item.review)
        };

        console.log("📤 Final rating data being sent:", ratingData);
        console.log("📤 Food item IDs:", ratingData.foodItemIds);

        if (ratingData.foodItemIds.length === 0) {
            console.log("⚠️ No valid food item IDs found, submitting restaurant rating only");
            delete ratingData.foodItemIds;
            delete ratingData.foodItemRatings;
            delete ratingData.foodItemReviews;
        }

        if (this.state.restaurantRating === 0) {
            alert("Please rate the restaurant before submitting.");
            return;
        }

        axios.post("http://localhost:8080/zomato/user/rate-order", ratingData)
            .then((resp) => {
                console.log("✅ Rating submitted successfully:", resp.data);
                alert("Thank you for your rating!");

                this.props.history.push({
                    pathname: "/Orders",
                    state: {
                        phonenum: this.userPhoneNumber
                    }
                });
            })
            .catch((err) => {
                console.error("❌ Rating submission error:", err);
                console.error("❌ Error response:", err.response);
                alert("Failed to submit rating. Please try again.");
            });
    }

    back = () => {
        this.props.history.push({
            pathname: "/Orders",
            state: {
                phonenum: this.userPhoneNumber
            }
        });
    }

    render() {
        return (
            <div className="rate-order-container">
                <div className="rate-order-header">
                    <button onClick={this.back} className="back-button">
                        ← Back to Orders
                    </button>
                    <h1>Rate Your Order</h1>
                </div>

                <div className="rate-order-form">
                    <form onSubmit={this.submitRating}>
                        {/* Restaurant Rating Section */}
                        <div className="rating-section">
                            <h3>Rate Restaurant: {this.state.restaurantName}</h3>
                            <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <label key={star} className="star-label">
                                        <input
                                            type="radio"
                                            name="restaurantRating"
                                            value={star}
                                            onChange={this.handleRestaurantRatingChange}
                                            className="star-input"
                                        />
                                        {this.state.restaurantRating >= star ? '⭐' : '☆'}
                                    </label>
                                ))}
                            </div>
                            <p className="current-rating">Current rating: {this.state.restaurantRating}/5</p>
                            <textarea
                                placeholder="Share your experience with the restaurant..."
                                value={this.state.restaurantReview}
                                onChange={this.handleRestaurantReviewChange}
                                rows="3"
                                className="review-textarea"
                            ></textarea>
                        </div>

                        {/* Food Items Rating Section */}
                        <div className="rating-section">
                            <h3>Rate Food Items</h3>
                            {this.state.foodRatings.length > 0 ? (
                                this.state.foodRatings.map((food, index) => (
                                    <div key={index} className="food-item-rating">
                                        <h4>Dish: {food.foodName}</h4>
                                        {!food.foodItemId && (
                                            <div className="id-warning">
                                                ⚠️ This food item cannot be rated (missing ID)
                                            </div>
                                        )}
                                        <div className="rating-stars">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <label key={star} className="star-label">
                                                    <input
                                                        type="radio"
                                                        name={`foodRating-${index}`}
                                                        value={star}
                                                        onChange={(e) => this.handleFoodRatingChange(index, e.target.value)}
                                                        className="star-input"
                                                        disabled={!food.foodItemId}
                                                    />
                                                    {food.rating >= star ? '⭐' : '☆'}
                                                </label>
                                            ))}
                                        </div>
                                        <p className="current-rating">Current rating: {food.rating}/5</p>
                                        <textarea
                                            placeholder={`Review for ${food.foodName}...`}
                                            value={food.review}
                                            onChange={(e) => this.handleFoodReviewChange(index, e.target.value)}
                                            rows="2"
                                            className="review-textarea"
                                            disabled={!food.foodItemId}
                                        ></textarea>
                                    </div>
                                ))
                            ) : (
                                <div className="no-items-message">
                                    <p>❌ No food items found in this order.</p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="submit-rating-btn"
                            disabled={this.state.restaurantRating === 0}
                        >
                            Submit Rating
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}