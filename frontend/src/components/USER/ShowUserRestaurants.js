import React, { Component } from 'react';
import axios from 'axios';
import UserLogin from './UserLogin';
import '../CSS/Showuserres.css'

export default class ShowUserRestaurants extends Component {
    constructor(props){
        super(props);

        console.log("=== SHOW USER RESTAURANTS CONSTRUCTOR ===");
        console.log("Props:", props);
        console.log("Location state:", props.location?.state);

        this.userPhoneNumber = props.location?.state?.phonenum || '';

        console.log("User phone number:", this.userPhoneNumber);

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
                console.log("API Response:", resp.data);

                const transformedRestaurants = resp.data.map(restaurant => ({
                    restaurantid: restaurant.restaurantId,
                    restaurantname: restaurant.restaurantName,
                    restaurantaddress: restaurant.restaurantAddress,
                    restaurantrating: restaurant.restaurantRating,
                    restaurantimages: restaurant.restaurantImages || []
                }));

                console.log("Transformed restaurants:", transformedRestaurants);

                if(transformedRestaurants.length > 0){
                    this.setState({
                        listOfRest: transformedRestaurants,
                        allRestaurants: transformedRestaurants,
                        loading: false
                    });
                } else {
                    this.setState({
                        loading: false,
                        error: "No restaurants found"
                    });
                }
            })
            .catch((err)=>{
                console.log("Error fetching restaurants:", err);
                this.setState({
                    error: "Failed to load restaurants",
                    loading: false
                });
            });
    }

    checkFoods = (restaurant) => {
        console.log("🎯 Simple navigation test");

        // Simple data object
        const navigationData = {
            restaurantname: restaurant.restaurantname,
            phonenumber: this.userPhoneNumber,
            restaurantid: restaurant.restaurantid
        };

        console.log("📤 Sending:", navigationData);

        // Simple navigation
        this.props.history.push({
            pathname: "/Userfoods",
            state: {
                orddata: navigationData,
                phonenum: this.userPhoneNumber
            }
        });
    };

    searchRestaurants = (e) => {
        const searchValue = e.target.value;
        console.log("Searching for:", searchValue);

        if(searchValue.trim() === ""){
            this.setState({listOfRest: this.state.allRestaurants});
            return;
        }

        axios.post("http://localhost:8080/zomato/user/search-by-name", {"search": searchValue})
            .then((resp)=>{
                console.log("Search results:", resp.data);

                const transformedResults = resp.data.map(restaurant => ({
                    restaurantid: restaurant.restaurantId,
                    restaurantname: restaurant.restaurantName,
                    restaurantaddress: restaurant.restaurantAddress,
                    restaurantrating: restaurant.restaurantRating,
                    restaurantimages: restaurant.restaurantImages || []
                }));

                this.setState({listOfRest: transformedResults});
            })
            .catch((err)=>{
                console.log("Search error:", err);
                this.setState({listOfRest: this.state.allRestaurants});
            });
    };

    render() {
        const { listOfRest, loading, error } = this.state;

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
                                            >
                                                View menu
                                            </button>
                                            <div id="imggrp1">
                                                {
                                                    restaurant.restaurantimages && restaurant.restaurantimages.map((image) => {
                                                        return(
                                                            <img
                                                                src={image.link}
                                                                key={image.imageId || image.imageid}
                                                                alt={restaurant.restaurantname}
                                                                className='Checkfood1'
                                                            />
                                                        );
                                                    })
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