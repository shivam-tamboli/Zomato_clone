import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/UserOrders.css';

export default class UserOrders extends Component {
    constructor(props) {
        super(props);

        console.log("📦 USER ORDERS CONSTRUCTOR");
        console.log("Props:", props);
        console.log("Location state:", props.location?.state);

        const locationState = props.location?.state || {};
        this.userPhoneNumber = locationState.phonenum ||
            localStorage.getItem('userPhoneNumber') ||
            '';

        console.log("📱 User phone number:", this.userPhoneNumber);

        this.state = {
            orders: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchUserOrders();
    }

    fetchUserOrders = async () => {
        if (!this.userPhoneNumber) {
            console.error("❌ No phone number available");
            this.setState({
                error: "User information not found. Please login again.",
                loading: false
            });
            return;
        }

        try {
            console.log("📥 Fetching orders for phone:", this.userPhoneNumber);

            const response = await axios.post(
                "http://localhost:8080/zomato/user/get-all-order-details",
                { phonenumber: this.userPhoneNumber },
                {
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("📥 Full API Response:", response);
            console.log("📥 Response status:", response.status);
            console.log("📥 Response data:", response.data);

            if (!response.data) {
                console.warn("⚠️ Response data is empty or null");
                this.setState({
                    orders: [],
                    loading: false
                });
                return;
            }

            let ordersData = response.data;
            if (typeof ordersData === 'object' && !Array.isArray(ordersData)) {
                console.warn("⚠️ Response is object, converting to array");
                ordersData = [ordersData];
            }

            const transformedOrders = ordersData.map((order, index) => {
                console.log(`🔍 Processing order ${index}:`, order);

                return {
                    orderId: order.orderId || order.orderid || `ORD-${index + 1}`,
                    restaurantId: order.restaurantId || order.restaurantid,
                    restaurantName: order.restaurantName || order.restaurantname || "Unknown Restaurant",
                    totalAmount: order.totalAmount || order.totalamount || 0,
                    deliveryAddress: order.deliveryAddress || order.deliveryaddress || "Not specified",
                    foodItems: order.orderFoodItems || order.foodItems || order.fooditems || []
                };
            });

            console.log("📥 Transformed orders:", transformedOrders);

            this.setState({
                orders: transformedOrders,
                loading: false,
                error: null
            });

        } catch (error) {
            console.error("❌ Error fetching orders:", error);

            let errorMessage = "Failed to load orders. Please try again.";

            if (error.code === 'ECONNABORTED') {
                errorMessage = "Request timeout. Please check your connection.";
            } else if (error.response) {
                console.error("❌ Server error response:", error.response);
                errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;

                if (error.response.status === 404) {
                    errorMessage = "Orders endpoint not found. Please check backend.";
                } else if (error.response.status === 500) {
                    errorMessage = "Server error. Please try again later.";
                }
            } else if (error.request) {
                console.error("❌ No response received:", error.request);
                errorMessage = "No response from server. Please check if backend is running.";
            }

            this.setState({
                error: errorMessage,
                loading: false,
                orders: []
            });
        }
    }

    rateOrder = (order) => {
        console.log("⭐ Rating order:", order);

        const orderForRating = {
            orderid: order.orderId,
            orderId: order.orderId,
            restaurantid: order.restaurantId,
            restaurantId: order.restaurantId,
            restaurantname: order.restaurantName,
            restaurantName: order.restaurantName,
            orderFoodItems: order.foodItems ? order.foodItems.map(item => ({
                foodItemId: item.foodItemId || item.fooditemid || item.id,
                fooditemid: item.foodItemId || item.fooditemid || item.id,
                foodName: item.foodName || item.foodname || "Unknown Food",
                foodname: item.foodName || item.foodname || "Unknown Food",
                quantity: item.quantity || 1,
                amount: item.amount || 0
            })) : []
        };

        console.log("📤 Transformed order for rating:", orderForRating);

        this.props.history.push({
            pathname: "/Rate",
            state: {
                obj: orderForRating,
                phonenum: this.userPhoneNumber
            }
        });
    }

    retryFetchOrders = () => {
        this.setState({ loading: true, error: null });
        this.fetchUserOrders();
    }

    navigateToRestaurants = () => {
        this.props.history.push({
            pathname: "/Userrestaurant",
            state: {
                phonenum: this.userPhoneNumber
            }
        });
    }

    navigateToHome = () => {
        this.props.history.push("/");
    }

    render() {
        const { orders, loading, error } = this.state;

        if (loading) {
            return (
                <div className="user-orders-container">
                    <div className="loading-message">
                        <h2>Loading your orders...</h2>
                        <p>Please wait while we fetch your order history.</p>
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="user-orders-container">
                    <div className="error-message">
                        <h2>Error</h2>
                        <p>{error}</p>
                        <div className="error-actions">
                            <button onClick={this.retryFetchOrders} className="retry-btn">
                                🔄 Try Again
                            </button>
                            <button onClick={this.navigateToHome} className="home-btn">
                                🏠 Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (orders.length === 0) {
            return (
                <div className="user-orders-container">
                    <div className="no-orders-message">
                        <h2>No Orders Found</h2>
                        <p>You haven't placed any orders yet.</p>
                        <button onClick={this.navigateToRestaurants} className="order-now-btn">
                            🍕 Order Now
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="user-orders-container">
                {/* Header Section */}
                <header className="orders-header">
                    <h1>Your Orders</h1>
                </header>

                {/* Orders List */}
                <div className="orders-list">
                    {orders.map((order, index) => {
                        console.log(`Order ${index} data:`, order);
                        return (
                            <div key={order.orderId || index} className="order-card">
                                <h2>Order #{order.orderId}</h2>

                                <div className="order-details">
                                    <p className="restaurant-name">
                                        <strong>Restaurant: {order.restaurantName}</strong>
                                    </p>
                                    <p className="delivery-address">
                                        Delivery to: {order.deliveryAddress}
                                    </p>
                                    <p className="total-amount">
                                        Total: ₹{order.totalAmount}
                                    </p>

                                    <div className="food-items">
                                        <strong>Items:</strong>
                                        <ul>
                                            {order.foodItems && order.foodItems.length > 0 ? (
                                                order.foodItems.map((item, itemIndex) => (
                                                    <li key={itemIndex}>
                                                        {item.foodName || "Unknown Item"}
                                                        (Qty: {item.quantity || 1})
                                                        - ₹{item.amount || 0}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No items details available</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                <hr className="order-divider" />

                                {/* Rating button for EVERY order */}
                                <div className="order-actions">
                                    <button
                                        onClick={() => this.rateOrder(order)}
                                        className="rate-btn"
                                    >
                                        * Rate This Order *
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}