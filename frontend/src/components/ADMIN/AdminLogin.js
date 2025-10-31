import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import '../CSS/Adminlogin.css';

class AdminLogin extends Component {
    constructor(props) {
        super(props);
        this.phone = JSON.parse(localStorage.getItem('ap'));
        this.state = {
            listOfRest: [],
            loading: true,
            error: null
        };


        this.handleRestaurantAdded = this.handleRestaurantAdded.bind(this);
    }

    componentDidMount() {
        this.fetchRestaurants();
    }

    fetchRestaurants = () => {
        console.log("🔄 Loading restaurants...");
        axios
            .get('http://localhost:8080/zomato/get-restaurants')
            .then((resp) => {
                console.log("📊 Restaurants data:", resp.data);
                this.setState({
                    listOfRest: resp.data,
                    loading: false
                });
            })
            .catch((err) => {
                console.error("❌ Error fetching restaurants:", err);
                this.setState({
                    loading: false,
                    error: "Failed to load restaurants"
                });
            });
    };

    // 🔥 FIX: This method is now bound in constructor
    handleRestaurantAdded() {
        console.log("🆕 Restaurant added, refreshing list...");
        this.fetchRestaurants(); // Refresh the list
    }

    checkFoods = (restaurantId) => {
        console.log("View Menu clicked for:", restaurantId);
        this.props.history.push({
            pathname: '/Viewmenu',
            state: { resid: restaurantId }
        });
    };

    editRestaurant = (restaurantId) => {
        console.log("Edit clicked for:", restaurantId);
        const restaurant = this.state.listOfRest.find(
            (rest) => rest.restaurantId === restaurantId
        );

        console.log("Restaurant to edit:", restaurant);

        this.props.history.push({
            pathname: '/Edit',
            state: {
                resid: restaurantId,
                resobj: restaurant
            }
        });
    };

    deleteRestaurant = (restaurantId) => {
        console.log("Delete clicked for:", restaurantId);
        if (!window.confirm("Are you sure you want to delete this restaurant?")) {
            return;
        }

        axios
            .post('http://localhost:8080/zomato/admin/delete-restaurant', {
                restaurantId: Number(restaurantId),
            })
            .then((resp) => {
                console.log("✅ Delete success:", resp.data);
                this.fetchRestaurants(); // Refresh after delete
            })
            .catch((err) => {
                console.error("❌ Delete error:", err);
                alert("Failed to delete restaurant");
            });
    };

    back = () => {
        this.props.history.push({ pathname: '/Admin' });
    };

    logout = () => {
        axios
            .post('http://localhost:8080/zomato/user/logout', { phonenumber: this.phone })
            .then((resp) => console.log(resp.data))
            .catch((err) => console.log(err.message));
        this.props.history.push('/');
    };

    render() {
        const { listOfRest, loading, error } = this.state;

        if (loading) {
            return (
                <div className="AdminLogin">
                    <p>Loading restaurants...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="AdminLogin">
                    <p>Error: {error}</p>
                    <button onClick={this.fetchRestaurants}>Retry</button>
                </div>
            );
        }

        return (
            <>
                <div id="Adlogback"></div>
                <div id="Admintag">
                    <img src="../IMAGES/Adminic.png" alt="Admin Icon" />
                    <p>ADMIN DASHBOARD</p>
                </div>
                <img src="../IMAGES/Home.png" alt="Home" className="Home" onClick={this.back} />
                <img src="../IMAGES/Logout.png" alt="Logout" className="Logout" onClick={this.logout} />

                <div className="AdminLogin" style={{padding: '20px', marginTop: '100px'}}>
                    {listOfRest.length === 0 ? (
                        <>
                            <p id="artext2">No restaurants available</p>
                            {/*  FIX: Use regular Link without passing function */}
                            <Link to="/Addrestaurant">
                                <button id="addRestaurant2">Add Restaurant</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <p id="artext2">Available Restaurants ({listOfRest.length})</p>
                            {listOfRest.map((rest, index) => {
                                const restaurantId = rest.restaurantId;
                                const restaurantName = rest.restaurantName;
                                const restaurantAddress = rest.restaurantAddress;

                                console.log("🍴 Restaurant data:", {
                                    id: restaurantId,
                                    name: restaurantName,
                                    address: restaurantAddress
                                });

                                return (
                                    <div
                                        className="restaurant"
                                        key={restaurantId}
                                        style={{
                                            border: '2px solid #ccc',
                                            padding: '15px',
                                            margin: '10px',
                                            borderRadius: '8px',
                                            background: 'white'
                                        }}
                                    >
                                        <div className="resname" style={{fontSize: '20px', fontWeight: 'bold'}}>
                                            {restaurantName}
                                        </div>
                                        <div className="resaddress" style={{margin: '5px 0'}}>
                                            Address: {restaurantAddress}
                                        </div>
                                        <div className="Arbg" style={{margin: '10px 0'}}>
                                            <button
                                                onClick={() => this.checkFoods(restaurantId)}
                                                className="resviewmenu"
                                                style={{
                                                    background: '#4CAF50',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    margin: '5px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                View Menu
                                            </button>
                                            <button
                                                onClick={() => this.editRestaurant(restaurantId)}
                                                className="resedit"
                                                style={{
                                                    background: '#FF9800',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    margin: '5px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Edit Restaurant
                                            </button>
                                            <button
                                                onClick={() => this.deleteRestaurant(restaurantId)}
                                                className="resdelet"
                                                style={{
                                                    background: '#f44336',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    margin: '5px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Delete Restaurant
                                            </button>
                                        </div>
                                        <div id="imggrp" style={{display: 'flex', overflowX: 'auto'}}>
                                            {rest.restaurantImages && rest.restaurantImages.length > 0 ? (
                                                rest.restaurantImages.map((image, imgIndex) => (
                                                    <img
                                                        src={image.link}
                                                        key={image.imageId || `img-${imgIndex}`}
                                                        alt={restaurantName}
                                                        className="hotelimg"
                                                        style={{
                                                            width: '100px',
                                                            height: '80px',
                                                            objectFit: 'cover',
                                                            margin: '5px',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <p>No images available</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {/* FIX: Use regular Link without passing function */}
                            <Link to="/Addrestaurant">
                                <button id="addRestaurant1" style={{
                                    background: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginTop: '20px'
                                }}>
                                    ADD RESTAURANT
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </>
        );
    }
}

export default withRouter(AdminLogin);