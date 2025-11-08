import React, { Component } from 'react';
import axios from 'axios';
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
            error: null,
            searchQuery: ''
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
        console.log("🎯 Navigation to foods page");

        const navigationData = {
            restaurantname: restaurant.restaurantname,
            phonenumber: this.userPhoneNumber,
            restaurantid: restaurant.restaurantid
        };

        console.log("📤 Sending:", navigationData);

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

        this.setState({ searchQuery: searchValue });

        if(searchValue.trim() === ""){
            this.setState({listOfRest: this.state.allRestaurants});
            return;
        }

        // Simple client-side search
        const filteredRestaurants = this.state.allRestaurants.filter(restaurant =>
            restaurant.restaurantname.toLowerCase().includes(searchValue.toLowerCase())
        );

        this.setState({listOfRest: filteredRestaurants});
    };

    render() {
        const { listOfRest, loading, error, searchQuery } = this.state;

        if (loading) {
            return (
                <div className='ShowUserRestuarants'>
                    <div className="loading-container">
                        <p>Loading restaurants...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className='ShowUserRestuarants'>
                    <div className="error-container">
                        <p>Error: {error}</p>
                        <button onClick={() => window.location.reload()}>Try Again</button>
                    </div>
                </div>
            );
        }

        return (
            <div className='ShowUserRestuarants'>
                {/* Simple Header */}
                <div className="page-header">
                    <h1>Foods</h1>
                </div>

                {/* Search Section */}
                <div className="search-section">
                    <h2>Restaurants</h2>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={this.searchRestaurants}
                        placeholder='Search Restaurant'
                        className='search-input'
                    />
                </div>

                <hr className="section-divider" />

                {/* Restaurants List */}
                <div className='restaurants-list'>
                    {listOfRest.length === 0 ? (
                        <div className="no-restaurants">
                            <p>No Restaurants Found</p>
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        this.setState({
                                            listOfRest: this.state.allRestaurants,
                                            searchQuery: ''
                                        });
                                    }}
                                >
                                    Show All Restaurants
                                </button>
                            )}
                        </div>
                    ) : (
                        listOfRest.map((restaurant) => {
                            return(
                                <div className="restaurant-item" key={restaurant.restaurantid}>
                                    <h3>{restaurant.restaurantname}</h3>
                                    <p className="rating">Rating : {restaurant.restaurantrating ? restaurant.restaurantrating.toFixed(1) : "0"} / 5</p>
                                    <p className="address">{restaurant.restaurantaddress}</p>
                                    <button
                                        className='view-menu-btn'
                                        onClick={() => this.checkFoods(restaurant)}
                                    >
                                        View menu
                                    </button>

                                    {/* Restaurant Images - only show if available */}
                                    {restaurant.restaurantimages && restaurant.restaurantimages.length > 0 && (
                                        <div className="restaurant-images">
                                            {restaurant.restaurantimages.slice(0, 2).map((image, index) => (
                                                <img
                                                    src={image.link}
                                                    key={image.imageId || image.imageid || index}
                                                    alt={restaurant.restaurantname}
                                                    className='restaurant-image'
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <hr className="item-divider" />
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }
}