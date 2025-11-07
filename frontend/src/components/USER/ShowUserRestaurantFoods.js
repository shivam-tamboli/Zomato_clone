import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/Showusrrf.css'

export default class ShowUserRestaurantFoods extends Component {
    constructor(props){
        super(props);

        console.log("=== SHOW USER RESTAURANT FOODS CONSTRUCTOR ===");
        console.log("Location state:", props.location?.state);

        // 🛠 FIX: Safe data extraction
        const state = props.location?.state || {};
        const orddata = state.orddata || {};

        this.restaurantname = orddata.restaurantname || "Unknown Restaurant";
        this.userPhoneNumber = state.phonenum || orddata.phonenumber || '';

        // 🛠 FIX: Set restaurantId directly, not as obj
        this.restaurantId = orddata.restaurantid;

        console.log("📥 Extracted data:", {
            restaurantId: this.restaurantId,
            restaurantname: this.restaurantname,
            userPhoneNumber: this.userPhoneNumber
        });

        // Initialize state based on whether we have data
        if (!this.restaurantId) {
            console.error("❌ No restaurant ID found");
            this.state = {
                error: "No restaurant data provided. Please go back and select a restaurant.",
                loading: false,
                listOfFoods: []
            };
        } else {
            this.state = {
                loading: true,
                listOfFoods: null,
                error: null
            };
        }

        // 🛠 FIX: Initialize order object safely
        this.order = {
            restaurantid: this.restaurantId,
            restaurantname: this.restaurantname,
            phonenumber: this.userPhoneNumber,
            deliveryaddress: null,
            totalamount: 0,
            fooditemid: [],
            foodname: [],
            amount: [],
            quantity: []
        };
    }

    componentDidMount() {
        console.log("🍽️ COMPONENT DID MOUNT");

        // 🛠 FIX: Check if we have restaurantId before making API call
        if (!this.restaurantId) {
            console.error("Cannot fetch foods: No restaurant ID");
            this.setState({
                error: "Cannot load menu. Restaurant information is missing.",
                loading: false
            });
            return;
        }

        // 🛠 FIX: Use the correct request format
        const requestData = {
            restaurantid: this.restaurantId
        };

        console.log("📤 Fetching foods for restaurant:", requestData);

        axios.post("http://localhost:8080/zomato/user/get-fooditems", requestData)
            .then((resp)=>{
                console.log("✅ Food items response:", resp.data);

                if(resp.data && resp.data.length > 0){
                    this.setState({
                        listOfFoods: resp.data,
                        loading: false
                    });
                } else {
                    this.setState({
                        listOfFoods: [],
                        loading: false,
                        error: "No food items available for this restaurant."
                    });
                }
            })
            .catch((err)=>{
                console.error("❌ Error fetching food items:", err);
                this.setState({
                    error: "Failed to load food items. Please try again.",
                    loading: false
                });
            });
    }

    orderFoods = (e) => {
        if (!this.state.listOfFoods || this.state.listOfFoods.length === 0) {
            alert("No food items available to order");
            return;
        }

        // Reset order arrays
        this.order.fooditemid = [];
        this.order.foodname = [];
        this.order.amount = [];
        this.order.quantity = [];

        // Collect selected items
        this.state.listOfFoods.forEach((value, index) => {
            const checkbox = document.getElementById('select' + index);
            if (checkbox && checkbox.checked === true) {
                this.order.fooditemid.push(String(value.fooditemid || value.foodItemId));
                this.order.foodname.push(String(value.foodname || value.foodName));
                this.order.amount.push(String(value.price));
                this.order.quantity.push("1");
            }
        });

        if (this.order.fooditemid.length === 0) {
            alert("Please select at least one food item to order");
            return;
        }

        console.log("📦 Final order data:", this.order);

        // Navigate to place order
        this.props.history.push({
            pathname: "/Placeorder",
            state: {
                orddata: this.order,
                phonenum: this.userPhoneNumber
            }
        });
    };

    back = () => {
        this.props.history.push({
            pathname: "/Userrestaurant",
            state: {
                phonenum: this.userPhoneNumber
            }
        });
    };

    render() {
        const { listOfFoods, loading, error } = this.state;

        // Show error state
        if (error) {
            return (
                <div className='AdminCheckFood'>
                    <h1>Menu</h1>
                    <p>{error}</p>
                    <button onClick={this.back}>← Go Back to Restaurants</button>
                </div>
            );
        }

        // Show loading state
        if (loading) {
            return (
                <div className='AdminCheckFood'>
                    <h1>{this.restaurantname}</h1>
                    <p>Loading food items...</p>
                </div>
            );
        }

        // Show no foods state
        if (!listOfFoods || listOfFoods.length === 0) {
            return (
                <div className='AdminCheckFood'>
                    <h1>{this.restaurantname}</h1>
                    <p>No food items available</p>
                    <button onClick={this.back}>← Go Back to Restaurants</button>
                </div>
            );
        }

        // Show foods list
        return (
            <>
                <div id="Adlogback"></div>
                <div id="Admintag">
                    <img src='../IMAGES/Userpic.png' alt='User profile' onClick={this.back}></img>
                    <p>USER</p>
                </div>
                <img src="../IMAGES/Home.png" alt="Home" className='Home' onClick={this.back}></img>
                <div className='Addmorewindow'>
                    <h1 id="artext6">Restaurant : {this.restaurantname}</h1>
                    <div className='SMFlist'>
                        {listOfFoods.map((value, index) => (
                            <div className="restaurant1" key={value.fooditemid || value.foodItemId || index}
                                 id={value.fooditemid || value.foodItemId}>
                                <div id="fooddata">
                                    <p>Dish : {value.foodname || value.foodName}</p>
                                    <p>Price : Rs.{value.price}/-</p>
                                    <p className='Description'>Description : {value.description}</p>
                                    <p>Rating : {value.fooditemrating ? value.fooditemrating.toPrecision(2) + " / 5" : "No ratings"}</p>
                                </div>
                                <img src={value.image} alt={value.foodname || value.foodName} className='Checkfood'></img>
                                <label htmlFor={'select' + index} id="selectfood">Select</label>
                                <input type="checkbox" id={'select' + index} className='selectedfoodc'></input>
                            </div>
                        ))}
                        <button id='orderFoods' onClick={this.orderFoods}>Order Foods</button>
                    </div>
                </div>
            </>
        );
    }
}