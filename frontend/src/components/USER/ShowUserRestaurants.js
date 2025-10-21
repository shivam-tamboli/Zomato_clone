import React, { Component } from 'react';
import axios from 'axios';
import UserLogin from './UserLogin';
import '../CSS/Showuserres.css';
import History from '../History';

export default class ShowUserRestaurants extends Component {
    constructor(props) {
        super(props);
        this.userPhoneNumber = this.props.location?.state?.phonenum || '';
        this.state = {
            listOfRest: [],
            loading: true,
        };
    }

    componentDidMount() {
        axios
            .get('http://localhost:8080/zomato/user/get-all-restaurants')
            .then((resp) => {
                if (Array.isArray(resp.data)) {
                    this.setState({
                        listOfRest: resp.data,
                        loading: false,
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((err) => {
                console.error('Error fetching restaurants:', err);
                this.setState({ loading: false });
            });
    }

    handleClick = (restaurant) => {
        console.log('Navigating to foods for:', restaurant.restaurantName, 'ID:', restaurant.restaurantId);

        // FIXED: Use state approach for ShowUserRestaurantFoods
        const orderData = {
            restaurantid: restaurant.restaurantId,
            restaurantname: restaurant.restaurantName,
            phonenumber: this.userPhoneNumber
        };

        History.push({
            pathname: "/Userfoods",
            state: {
                orddata: orderData,
                phonenum: this.userPhoneNumber
            }
        });
    };

    render() {
        const { listOfRest, loading } = this.state;

        if (loading) {
            return <p style={{ textAlign: 'center' }}>Loading restaurants...</p>;
        }

        if (!listOfRest || listOfRest.length === 0) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <p style={{ textAlign: 'center' }}>No restaurants available</p>
                </>
            );
        }

        return (
            <>
                <UserLogin phh={this.userPhoneNumber} />
                <div className="ShowUserRestaurants">
                    <h2 style={{ textAlign: 'center' }}>Available Restaurants</h2>
                    <div className="restaurant-list">
                        {listOfRest.map((rest) => (
                            <div
                                className="restaurant-card"
                                key={rest.restaurantId}
                                onClick={() => this.handleClick(rest)}
                                style={{
                                    cursor: 'pointer',
                                    border: '1px solid #ccc',
                                    padding: '15px',
                                    margin: '10px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                <p><strong style={{fontSize: '18px'}}>{rest.restaurantName}</strong></p>
                                <p>⭐ Rating: {rest.restaurantRating ? rest.restaurantRating.toFixed(2) : 'N/A'} / 5</p>
                                <p>📍 Address: {rest.restaurantAddress || 'Not provided'}</p>
                                <p>📊 Number of Ratings: {rest.numOfRating || 0}</p>
                                <p style={{color: 'blue', marginTop: '10px'}}>Click to view foods →</p>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}