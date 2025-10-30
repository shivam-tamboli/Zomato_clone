import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/Showuserfood.css';
import UserLogin from './UserLogin';
import History from '../History';

class ShowUserFoods extends Component {
    constructor(props) {
        super(props);

        // GET DATA FROM URL PARAMETERS
        const urlParams = new URLSearchParams(window.location.search);
        this.restaurantId = urlParams.get('restaurantId');
        this.userPhoneNumber = urlParams.get('phonenum');

        console.log("Restaurant ID from URL:", this.restaurantId);
        console.log("User Phone from URL:", this.userPhoneNumber);

        this.state = {
            listOfFoods: [],
            loading: true,
        };
    }

    componentDidMount() {
        console.log("PROPS IN DID MOUNT:", this.props);

        // If no restaurantId from URL, show error
        if (!this.restaurantId) {
            console.error("No restaurantId provided in URL");
            this.setState({ loading: false });
            return;
        }

        this.fetchFoodItems();
    }

    fetchFoodItems = () => {
        axios
            .get(`http://localhost:8080/zomato/user/get-fooditems?restaurantId=${this.restaurantId}`)
            .then((resp) => {
                if (resp.data && Array.isArray(resp.data)) {
                    this.setState({
                        listOfFoods: resp.data,
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

        History.push({
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

export default ShowUserFoods;