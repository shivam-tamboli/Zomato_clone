import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../CSS/Checkfood.css'

class AdminCheckFood extends Component {
    constructor(props){
        super(props);
        console.log("Restaurant ID received:", this.props.location?.state?.resid);

        this.obj = {restaurantId: this.props.location?.state?.resid};
        this.state = {listOfFoods: []};
    }

    componentDidMount(){
        this.fetchFoodItems();
    }


    fetchFoodItems = () => {
        axios.get("http://localhost:8080/zomato/get-fooditems", {
            params: this.obj
        })
            .then((resp)=>{
                console.log("Food items received:", resp.data);
                this.setState({listOfFoods: resp.data});
            })
            .catch((err)=>{
                console.error("Error fetching food items:", err);
            })
    }



    addFood = (e) => {
        this.props.history.push({
            pathname: "/Addfood",
            state: {
                resid: this.obj.restaurantId
            }
        })
    }

    editFood = (foodItem) => {
        console.log("Editing food item:", foodItem);

        this.props.history.push({
            pathname: '/Editfood',
            state: {
                resid: this.obj.restaurantId,
                resdata: foodItem
            }
        })
    }

    deleteFood = (foodItemId) => {
        console.log("Deleting food item ID:", foodItemId, "Type:", typeof foodItemId);

        if (!window.confirm("Are you sure you want to delete this food item?")) {
            return;
        }


        axios.post("http://localhost:8080/zomato/admin/delete-fooditems", {
            foodItemId: String(foodItemId)  // Convert to string
        })
            .then((resp) => {
                console.log("Delete success:", resp.data);
                this.fetchFoodItems();
            })
            .catch((err) => {
                console.error("Delete error:", err.response?.data || err.message);
                alert("Failed to delete food item: " + (err.response?.data?.message || err.message));
            })
    }

    back = () => {
        this.props.history.push({
            pathname: "/Admin",
        })
    }

    render() {
        if(this.state.listOfFoods.length === 0){
            return(
                <>
                    <div id="Adlogback"></div>
                    <div id="Admintag">
                        <img src='../IMAGES/Adminic.png' alt='Not found'></img>
                        <p>ADMIN</p>
                    </div>
                    <img src="../IMAGES/Home.png" alt="Not found" className='Home' onClick={this.back}></img>
                    <div id="Checkwindow">
                        <div className='AdminCheckFood'>
                            <p id="artext4">Menu empty</p>
                            <button id='addFood2' onClick={this.addFood}>Add Food</button>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div id="Adlogback"></div>
                    <div id="Admintag">
                        <img src='../IMAGES/Adminic.png' alt='Not found'></img>
                        <p>ADMIN</p>
                    </div>
                    <img src="../IMAGES/Home.png" alt="Not found" className='Home' onClick={this.back}></img>
                    <div id="Checkwindow">
                        <div className='AdminCheckFood'>
                            <p id="artext3">Our menu</p>
                            {
                                this.state.listOfFoods.map((foodItem) => {
                                    return(
                                        <div className="restaurant1" key={foodItem.fooditemid || foodItem.foodItemId} id={foodItem.fooditemid || foodItem.foodItemId}>
                                            <div id="fooddata">
                                                <p>Dish : {foodItem.foodname || foodItem.foodName}</p>
                                                <p>Price : Rs.{foodItem.price}/-</p>
                                                <p className='Description'>Description : {foodItem.description}</p>
                                            </div>
                                            <div className='Arbg1'>
                                                <button
                                                    className="checkedit"
                                                    onClick={() => this.editFood(foodItem)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="checkdelete"
                                                    onClick={() => this.deleteFood(foodItem.fooditemid || foodItem.foodItemId)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <img
                                                src={foodItem.image}
                                                alt={foodItem.foodname || foodItem.foodName}
                                                className='Checkfood'
                                            ></img>
                                        </div>
                                    );
                                })
                            }
                            <button id='addFood1' onClick={this.addFood}>Add Food</button>
                        </div>
                    </div>
                </>
            );
        }
    }
}

export default withRouter(AdminCheckFood);