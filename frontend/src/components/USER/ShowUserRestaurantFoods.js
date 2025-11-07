import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/Showusrrf.css'

export default class ShowUserRestaurantFoods extends Component {
    constructor(props) {
        super(props);

        console.log("=== SHOW USER RESTAURANT FOODS CONSTRUCTOR ===");
        console.log("All props:", props);
        console.log("Location state:", props.location?.state);

        // 🛠 FIX: Safely extract data with comprehensive fallbacks
        const locationState = props.location?.state || {};
        const orddata = locationState.orddata || {};

        this.restaurantname = orddata.restaurantname || "Unknown Restaurant";

        // 🛠 FIX: Comprehensive phone number extraction
        this.userPhoneNumber = locationState.phonenum ||
            orddata.phonenumber ||
            localStorage.getItem('userPhoneNumber') ||
            '';

        this.obj = { restaurantid: orddata.restaurantid || "" };

        console.log("CHECK - Extracted Data:", {
            restaurantname: this.restaurantname,
            userPhoneNumber: this.userPhoneNumber,
            restaurantid: this.obj.restaurantid,
            phonenumFromState: locationState.phonenum,
            phonenumFromOrddata: orddata.phonenumber
        });

        this.state = {
            listOfFoods: null,
            error: null,
            loading: true
        };

        this.order = {
            restaurantid: this.obj.restaurantid,
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
        if (!this.obj.restaurantid) {
            this.setState({
                error: "No restaurant ID provided",
                loading: false
            });
            return;
        }

        axios.post("http://localhost:8080/zomato/user/get-fooditems", this.obj)
            .then((resp) => {
                console.log("Raw food items response:", resp.data);

                // 🛠 FIX: Transform backend camelCase to frontend lowercase
                const transformedFoods = resp.data.map(food => ({
                    fooditemid: food.foodItemId,
                    foodname: food.foodName,
                    description: food.description,
                    price: food.price,
                    image: food.image,
                    fooditemrating: food.foodItemRating,
                    // Keep original for debugging
                    _original: food
                }));

                console.log("Transformed food items:", transformedFoods);

                this.setState({
                    listOfFoods: transformedFoods && transformedFoods.length > 0 ? transformedFoods : [],
                    loading: false
                });
            })
            .catch((err) => {
                console.error("Error fetching food items:", err);
                this.setState({
                    error: "Failed to load food items",
                    loading: false
                });
            });
    }

    // 🛠 FIX: Better image error handling with data URL fallback
    handleImageError = (e) => {
        console.log("Image failed to load, using fallback");
        // Create a simple colored placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 300, 200);
        ctx.fillStyle = '#ccc';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Image Not Available', 150, 100);
        e.target.src = canvas.toDataURL();
    };

    orderFoods = (e) => {
        if (!this.state.listOfFoods || this.state.listOfFoods.length === 0) {
            console.log("No food items available to order");
            alert("No food items available to order");
            return;
        }

        this.order.fooditemid = [];
        this.order.foodname = [];
        this.order.amount = [];
        this.order.quantity = [];

        this.state.listOfFoods.forEach((value, index) => {
            const checkbox = document.getElementById('select' + index);
            if (checkbox && checkbox.checked === true) {
                // 🛠 FIX: Now using transformed lowercase field names
                const foodId = value.fooditemid;

                if (foodId === undefined || foodId === null) {
                    console.error("Invalid fooditemid for item:", value);
                    return;
                }

                this.order.fooditemid.push(String(foodId));
                this.order.foodname.push(String(value.foodname || "Unknown Food"));
                this.order.amount.push(String(value.price));
                this.order.quantity.push("1");
            }
        });

        if (this.order.fooditemid.length === 0) {
            alert("Please select at least one food item to order");
            return;
        }

        console.log("Final order data:", this.order);

        // 🛠 FIX: Ensure phone number is included
        if (!this.order.phonenumber) {
            this.order.phonenumber = this.userPhoneNumber;
        }

        // 🛠 FIX: Use this.props.history.push for navigation
        this.props.history.push({
            pathname: "/Placeorder",
            state: {
                orddata: this.order,
                phonenum: this.userPhoneNumber
            }
        });
    }

    back = () => {
        this.props.history.push({
            pathname: "/Userrestaurant",
            state: {
                phonenum: this.userPhoneNumber
            }
        });
    }

    render() {
        const { error, loading, listOfFoods } = this.state;

        // 🛠 FIX: Better error handling for missing data
        if (!this.props.location.state || !this.props.location.state.orddata) {
            return (
                <div className='AdminCheckFood'>
                    <h2>Error: No restaurant data provided</h2>
                    <button onClick={this.back}>Go Back to Restaurants</button>
                </div>
            );
        }

        if (error) {
            return (
                <div className='AdminCheckFood'>
                    <h1>{this.restaurantname}</h1>
                    <p>Error: {error}</p>
                    <button onClick={this.back}>Go Back</button>
                </div>
            );
        }

        if (loading) {
            return (
                <div className='AdminCheckFood'>
                    <h1>{this.restaurantname}</h1>
                    <p>Loading food items...</p>
                </div>
            );
        }

        if (!listOfFoods || listOfFoods.length === 0) {
            return (
                <div className='AdminCheckFood'>
                    <h1>{this.restaurantname}</h1>
                    <p>No Foods Available for this restaurant</p>
                    <button onClick={this.back}>Go Back to Restaurants</button>
                </div>
            );
        }

        return (
            <>
                <div id="Adlogback"></div>
                <div id="Admintag">
                    <img
                        src='../IMAGES/Userpic.png'
                        alt='User profile'
                        onError={this.handleImageError}
                    />
                    <p>USER</p>
                </div>
                <img
                    src="../IMAGES/Home.png"
                    alt="Home"
                    className='Home'
                    onClick={this.back}
                    onError={this.handleImageError}
                />
                <div className='Addmorewindow'>
                    <h1 id="artext6">Restaurant : {this.restaurantname}</h1>
                    <div className='SMFlist'>
                        {listOfFoods.map((value, index) => (
                            <div className="restaurant1" key={value.fooditemid || index} id={value.fooditemid}>
                                <div id="fooddata">
                                    <p>Dish : {value.foodname}</p>
                                    <p>Price : Rs.{value.price}/-</p>
                                    <p className='Description'>Description : {value.description}</p>
                                    <p>Rating : {value.fooditemrating ? value.fooditemrating.toPrecision(2) + " / 5" : "No ratings"}</p>
                                </div>
                                <img
                                    src={value.image || '../IMAGES/placeholder-food.jpg'}
                                    alt={value.foodname}
                                    className='Checkfood'
                                    onError={this.handleImageError}
                                />
                                <label htmlFor={'select' + index} id="selectfood">Select</label>
                                <input type="checkbox" id={'select' + index} className='selectedfoodc'/>
                            </div>
                        ))}
                        <button id='orderFoods' onClick={this.orderFoods}>Order Foods</button>
                    </div>
                </div>
            </>
        );
    }
}