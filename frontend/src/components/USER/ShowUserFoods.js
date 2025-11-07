import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/Showuserfood.css';
import UserLogin from './UserLogin';
import { withRouter } from 'react-router-dom';

class ShowUserFoods extends Component {
    constructor(props) {
        super(props);

        // ✅ FIX: Get data from React Router props, NOT URL parameters
        const locationState = this.props.location?.state || {};
        this.restaurantId = locationState.restaurantId;
        this.userPhoneNumber = locationState.phonenum;

        console.log("Restaurant ID from PROPS:", this.restaurantId);
        console.log("User Phone from PROPS:", this.userPhoneNumber);

        this.state = {
            listOfFoods: [],
            loading: true,
        };
    }

    componentDidMount() {
        console.log("PROPS IN DID MOUNT:", this.props);

        // ✅ FIX: Check if we have required data - if not, redirect to restaurant list
        if (!this.restaurantId || !this.userPhoneNumber) {
            console.error("Missing required data. Redirecting to restaurant list...");
            this.props.history.push({
                pathname: "/Userrestaurant",
                state: { phonenum: this.userPhoneNumber }
            });
            return;
        }

        this.fetchFoodItems();
    }

    fetchFoodItems = () => {
        // ✅ FIX: Use correct API endpoint
        axios
            .get(`http://localhost:8080/zomato/user/get-all-food-items`)
            .then((resp) => {
                console.log("All food items:", resp.data);
                if (resp.data && Array.isArray(resp.data)) {
                    // Filter foods by restaurantId
                    const restaurantFoods = resp.data.filter(food =>
                        food.restaurantId === this.restaurantId
                    );
                    this.setState({
                        listOfFoods: restaurantFoods,
                        loading: false
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((err) => {
                console.error("Error fetching foods:", err);
                this.setState({ loading: false });
            });
    };

    orderFood = (e) => {
        const index = e.target.parentNode.id;
        const foodDetail = this.state.listOfFoods[index];
        const foodData = foodDetail.foodItem;

        let obj = {
            image: foodData.image,
            restaurantid: foodDetail.restaurantId,
            restaurantname: foodDetail.restaurantName,
            phonenumber: this.userPhoneNumber,
            deliveryaddress: null,
            totalamount: foodData.price || 0,
            fooditemid: [foodData.foodItemId],
            foodname: [foodData.foodName],
            amount: [foodData.price || 0],
            quantity: [1],
        };

        // ✅ FIX: Use this.props.history instead of History
        this.props.history.push({
            pathname: "/Placeorder",
            state: {
                orddata: obj,
                phonenum: this.userPhoneNumber,
            },
        });
    };

    render() {
        const { listOfFoods, loading } = this.state;

        if (loading) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className="ShowUserFoods">
                        <p style={{ textAlign: 'center' }}>Loading foods...</p>
                    </div>
                </>
            );
        }

        if (!listOfFoods || listOfFoods.length === 0) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className="ShowUserFoods">
                        <p style={{ textAlign: 'center' }}>No Foods Available for this restaurant</p>
                        <p style={{ textAlign: 'center' }}>Restaurant ID: {this.restaurantId}</p>
                        <p style={{ textAlign: 'center' }}>User Phone: {this.userPhoneNumber}</p>
                    </div>
                </>
            );
        }

        return (
            <>
                <UserLogin phh={this.userPhoneNumber} />
                <div className="ShowUserFoods">
                    <div className="foodlistuser">
                        {listOfFoods.map((foodDetail, index) => {
                            const foodData = foodDetail.foodItem;
                            const rating = foodData.foodItemRating ? foodData.foodItemRating.toFixed(2) : "No rating";
                            const price = foodData.price || "N/A";

                            return (
                                <div className="restaurantsf" key={foodData.foodItemId} id={index}>
                                    <div id="fooddata">
                                        <p>Dish : {foodData.foodName}</p>
                                        <p>Price : Rs.{price}/-</p>
                                        <p className="UFLResname">Restaurant : {foodDetail.restaurantName}</p>
                                        <p className="UFLDescription">Description : {foodData.description}</p>
                                        <p className="UFLRating">Rating : {rating} / 5</p>
                                    </div>
                                    <button onClick={this.orderFood} className="UFLOrderb">
                                        Order
                                    </button>
                                    <img src={foodData.image} alt={foodData.foodName} className="Checkfood" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

// ✅ FIX: Export with withRouter
export default withRouter(ShowUserFoods);