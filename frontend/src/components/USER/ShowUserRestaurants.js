import React, { Component } from 'react';
import axios from 'axios';
import UserLogin from './UserLogin';
import '../CSS/Showuserres.css'

export default class ShowUserRestaurants extends Component {
    constructor(props){
        super(props);

        console.log("=== SHOW USER RESTAURANTS CONSTRUCTOR ===");
        console.log("All props:", props);
        console.log("Location state:", props.location?.state);

        // 🛠 FIX: Comprehensive phone number extraction with validation
        let extractedPhone = '';

        if (props.location?.state?.phonenum) {
            extractedPhone = props.location.state.phonenum;
        } else if (localStorage.getItem('userPhoneNumber')) {
            extractedPhone = localStorage.getItem('userPhoneNumber');
        } else {
            console.warn("No phone number found in props or localStorage");
        }

        this.userPhoneNumber = extractedPhone;

        console.log("Extracted phone number:", this.userPhoneNumber);

        // 🛠 FIX: Save to localStorage for recovery
        if (this.userPhoneNumber && this.userPhoneNumber.trim() !== "") {
            localStorage.setItem('userPhoneNumber', this.userPhoneNumber);
        } else {
            console.error("🚨 CRITICAL: Phone number is empty!");
        }

        this.state = {
            listOfRest: [],
            allRestaurants: [],
            loading: true,
            error: null
        };
    }

    componentDidMount(){
        console.log("Fetching restaurants from backend...");

        axios.get("http://localhost:8080/zomato/user/get-all-restaurants")
            .then((resp)=>{
                console.log("API Response:", resp);

                const transformedRestaurants = resp.data.map(restaurant => ({
                    restaurantid: restaurant.restaurantId,
                    restaurantname: restaurant.restaurantName,
                    restaurantaddress: restaurant.restaurantAddress,
                    restaurantrating: restaurant.restaurantRating,
                    restaurantimages: restaurant.restaurantImages || []
                }));

                console.log("Transformed restaurants:", transformedRestaurants);

                this.setState({
                    listOfRest: transformedRestaurants && transformedRestaurants.length > 0 ? transformedRestaurants : [],
                    allRestaurants: transformedRestaurants && transformedRestaurants.length > 0 ? transformedRestaurants : [],
                    loading: false
                });
            })
            .catch((err)=>{
                console.log("Error fetching restaurants:", err);
                this.setState({
                    error: "Failed to load restaurants",
                    loading: false
                });
            })
    }

    // 🛠 FIX: Better image error handling with data URL fallback
    handleImageError = (e) => {
        console.log("Restaurant image failed to load, using fallback");
        // Create a simple colored placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, 200, 150);
        ctx.fillStyle = '#999';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Restaurant Image', 100, 75);
        e.target.src = canvas.toDataURL();
    };

    checkFoods = (restaurant) => {
        console.log("🔄 Navigating to menu for restaurant:", restaurant);
        console.log("📤 Current phone number:", this.userPhoneNumber);

        // 🛠 FIX: Validate phone number before navigation
        if (!this.userPhoneNumber || this.userPhoneNumber.trim() === "") {
            console.error("Cannot navigate: Phone number is empty");
            alert("Error: User information missing. Please login again.");
            return;
        }

        let obj = {
            restaurantname: restaurant.restaurantname,
            phonenumber: this.userPhoneNumber,
            restaurantid: restaurant.restaurantid
        }

        console.log("📤 Navigation object:", obj);
        console.log("📤 Phone number being passed:", this.userPhoneNumber);

        this.props.history.push({
            pathname: "/Addmore",
            state: {
                orddata: obj,
                phonenum: this.userPhoneNumber  // 🛠 FIX: Explicitly pass
            }
        })
    }

    searchRestaurants = (e) => {
        const searchValue = document.getElementById('searchRestaurants').value;
        console.log("Searching for:", searchValue);

        if (searchValue.trim() === "") {
            this.setState({ listOfRest: this.state.allRestaurants });
            return;
        }

        axios.post("http://localhost:8080/zomato/user/search-by-name", {"search": searchValue})
            .then((resp)=>{
                const transformedResults = resp.data.map(restaurant => ({
                    restaurantid: restaurant.restaurantId,
                    restaurantname: restaurant.restaurantName,
                    restaurantaddress: restaurant.restaurantAddress,
                    restaurantrating: restaurant.restaurantRating,
                    restaurantimages: restaurant.restaurantImages || []
                }));

                this.setState({ listOfRest: transformedResults });
            })
            .catch((err)=>{
                console.log("Search error:", err);
                // 🛠 FIX: Don't clear results on search error
                this.setState({ listOfRest: this.state.allRestaurants });
            })
    }

    render() {
        const { listOfRest, loading, error } = this.state;
        console.log("Current restaurants in state:", listOfRest);

        if (loading) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber}/>
                    <div className='ShowUserRestuarants'>
                        <p>Loading restaurants...</p>
                    </div>
                </>
            );
        }

        if (error) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber}/>
                    <div className='ShowUserRestuarants'>
                        <p>Error: {error}</p>
                    </div>
                </>
            );
        }

        if(listOfRest.length === 0){
            return(
                <>
                    <UserLogin phh={this.userPhoneNumber}/>
                    <div className='ShowUserRestuarants'>
                        <input
                            type="search"
                            onChange={this.searchRestaurants}
                            placeholder='Search Restaurant'
                            id='searchRestaurants'
                        />
                        <p id="nra">No Available Restaurants</p>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber}/>
                    <div className='ShowUserRestuarants'>
                        <input
                            type="search"
                            onChange={this.searchRestaurants}
                            placeholder='Search Restaurant'
                            id='searchRestaurants'
                        />
                        <div className='restlistuser'>
                            {
                                listOfRest.map((restaurant) => {
                                    return(
                                        <div className="restaurantsr" key={restaurant.restaurantid} id={restaurant.restaurantid}>
                                            <div className='resname1'>{restaurant.restaurantname}</div>
                                            <p className='resnamerating'>{"Rating : " + (restaurant.restaurantrating ? restaurant.restaurantrating.toPrecision(2) : "0") + " / 5"}</p>
                                            <button
                                                className='usrvmenub'
                                                onClick={() => this.checkFoods(restaurant)}
                                                name={restaurant.restaurantname}
                                                id={'v' + restaurant.restaurantid}
                                            >
                                                View menu
                                            </button>
                                            <div id="imggrp1">
                                                {
                                                    restaurant.restaurantimages && restaurant.restaurantimages.length > 0 ? (
                                                        restaurant.restaurantimages.map((image) => (
                                                            <img
                                                                src={image.link}
                                                                key={image.imageId || image.imageid}
                                                                alt={restaurant.restaurantname}
                                                                className='Checkfood1'
                                                                onError={this.handleImageError}
                                                            />
                                                        ))
                                                    ) : (
                                                        // 🛠 FIX: Show placeholder when no images
                                                        <img
                                                            src="../IMAGES/placeholder-restaurant.jpg"
                                                            alt={restaurant.restaurantname}
                                                            className='Checkfood1'
                                                            onError={this.handleImageError}
                                                        />
                                                    )
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </>
            );
        }
    }
}