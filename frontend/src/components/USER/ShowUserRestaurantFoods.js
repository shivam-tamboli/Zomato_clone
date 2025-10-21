import React, { Component } from 'react';
import axios from 'axios';
import History from '../History';
import '../CSS/Showusrrf.css'

export default class ShowUserRestaurantFoods extends Component {
    constructor(props){
        super(props);

        // FIXED: Add null checks and proper data handling
        if (!this.props.location.state || !this.props.location.state.orddata) {
            console.error("No state or orddata passed to ShowUserRestaurantFoods");
            console.log("Received props:", this.props);
            // Set default values to prevent crashes
            this.restaurantname = "Unknown Restaurant";
            this.userPhoneNumber = "";
            this.obj = { restaurantid: "" };
        } else {
            this.restaurantname = this.props.location.state.orddata.restaurantname;
            this.userPhoneNumber = this.props.location.state.orddata.phonenumber || this.props.location.state.phonenum;
            this.obj = { restaurantid: this.props.location.state.orddata.restaurantid };
        }

        console.log("CHECK - Restaurant Data:", {
            restaurantname: this.restaurantname,
            userPhoneNumber: this.userPhoneNumber,
            restaurantid: this.obj.restaurantid
        });

        this.state = {
            listOfFoods: null,
            error: null
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

    componentDidMount(){
        // Only make API call if we have a valid restaurant ID
        if (!this.obj.restaurantid) {
            this.setState({ error: "No restaurant ID provided" });
            return;
        }

        axios.post("http://localhost:8080/zomato/get-fooditems", this.obj)
            .then((resp)=>{
                console.log("Food items response:", resp.data);
                if(resp.data && resp.data.length > 0){
                    this.setState({ listOfFoods: resp.data });
                } else {
                    this.setState({ listOfFoods: [] });
                }
            })
            .catch((err)=>{
                console.error("Error fetching food items:", err);
                this.setState({ error: "Failed to load food items" });
            });
    }

    orderFoods = (e) => {
        if (!this.state.listOfFoods || this.state.listOfFoods.length === 0) {
            console.log("No food items available to order");
            return;
        }

        // Reset order arrays
        this.order.fooditemid = [];
        this.order.foodname = [];
        this.order.amount = [];
        this.order.quantity = [];

        this.state.listOfFoods.forEach((value, index) => {
            const checkbox = document.getElementById('select'+index);
            if(checkbox && checkbox.checked === true){
                this.order.fooditemid.push(value.fooditemid);
                this.order.foodname.push(value.foodname);
                this.order.amount.push(value.price);
                this.order.quantity.push("1");
            }
        });

        if (this.order.fooditemid.length === 0) {
            alert("Please select at least one food item to order");
            return;
        }

        console.log("Redirecting to Place Order with data:", this.order);
        History.push({
            pathname: "/Placeorder",
            state: {
                orddata: this.order,
                phonenum: this.userPhoneNumber
            }
        });
    }

    back = () => {
        History.push({
            pathname: "/Userrestaurant",
            state: {
                phonenum: this.userPhoneNumber
            }
        });
    }

    render() {
        // FIXED: Error handling for missing state
        if (!this.props.location.state || !this.props.location.state.orddata) {
            return (
                <div className='AdminCheckFood'>
                    <h2>Error: No restaurant data provided</h2>
                    <p>Please go back and select a restaurant</p>
                    <button onClick={this.back} style={{padding: '10px', margin: '10px'}}>
                        Go Back to Restaurants
                    </button>
                </div>
            );
        }

        if (this.state.error) {
            return (
                <div className='AdminCheckFood'>
                    <h1>{this.restaurantname}</h1>
                    <p>Error: {this.state.error}</p>
                    <button onClick={this.back} style={{padding: '10px', margin: '10px'}}>
                        Go Back
                    </button>
                </div>
            );
        }

        if (this.state.listOfFoods === null) {
            return (
                <div className='AdminCheckFood'>
                    <h1>{this.restaurantname}</h1>
                    <p>Loading food items...</p>
                </div>
            );
        }

        if (this.state.listOfFoods.length === 0) {
            return (
                <div className='AdminCheckFood'>
                    <h1>{this.restaurantname}</h1>
                    <p>No Foods Available for this restaurant</p>
                    <button onClick={this.back} style={{padding: '10px', margin: '10px'}}>
                        Go Back to Restaurants
                    </button>
                </div>
            );
        }

        return (
            <>
                <div id="Adlogback"></div>
                <div id="Admintag">
                    <img src='../IMAGES/Userpic.png' alt='Not found' onClick={this.back}></img>
                    <p>USER</p>
                </div>
                <img src="../IMAGES/Home.png" alt="Not found" className='Home' onClick={this.back}></img>
                <div className='Addmorewindow'>
                    <h1 id="artext6">Restaurant : {this.restaurantname}</h1>
                    <div className='SMFlist'>
                        {this.state.listOfFoods.map((value, index) => (
                            <div className="restaurant1" key={value.fooditemid} id={value.fooditemid}>
                                <div id="fooddata">
                                    <p>Dish : {value.foodname}</p>
                                    <p>Price : Rs.{value.price}/-</p>
                                    <p className='Description'>Description : {value.description}</p>
                                    <p>Rating : {value.fooditemrating ? value.fooditemrating.toPrecision(2) + " / 5" : "No ratings"}</p>
                                </div>
                                <img src={value.image} alt={value.foodname + value.fooditemid} className='Checkfood' />
                                <label htmlFor={'select'+index} id="selectfood">Select</label>
                                <input type="checkbox" id={'select'+index} className='selectedfoodc' />
                            </div>
                        ))}
                        <button id='orderFoods' onClick={this.orderFoods}>Order Foods</button>
                    </div>
                </div>
            </>
        );
    }
}