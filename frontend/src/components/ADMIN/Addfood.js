import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../CSS/Addfood.css'

class AddFooditem extends Component {
    constructor(props){
        super(props);

        // ✅ FIX: Add safety check for props
        const restaurantId = this.props.location?.state?.resid;
        console.log("Restaurant ID received:", restaurantId);

        if (!restaurantId) {
            console.error("❌ NO RESTAURANT ID RECEIVED!");
            alert("Error: No restaurant selected. Going back to admin.");
            this.props.history.push('/Admin');
            return;
        }

        this.fooditem = {
            restaurantId: Number(restaurantId),
            foodName: null,
            description: null,
            price: null,
            image: null
        };
        this.count = 0;
    }

    submit = (e) => {
        e.preventDefault();
        console.log("Submitting food item...");

        this.fooditem.foodName = document.getElementById('foodname').value;
        this.fooditem.description = document.getElementById("fooddescription").value;
        this.fooditem.price = document.getElementById("foodprice").value;

        // ✅ FIX: Provide default image if none is set
        if (!this.fooditem.image) {
            this.fooditem.image = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"; // Default food image
            console.log("No image provided, using default image");
        }

        console.log("Food data being sent:", this.fooditem);

        if (!this.fooditem.foodName || !this.fooditem.description || !this.fooditem.price) {
            alert("Please fill all required fields");
            return;
        }

        axios.post("http://localhost:8080/zomato/admin/add-fooditems", this.fooditem)
            .then((resp) => {
                console.log("Success:", resp.data);
                this.props.history.push({
                    pathname: '/Viewmenu',
                    state: {
                        resid: this.fooditem.restaurantId
                    }
                });
            })
            .catch((err) => {
                console.log("Error details:", err.response?.data || err.message);
                alert("Failed to add food item: " + (err.response?.data?.message || err.message));
            });
    }

    uploadImage = (e) => {
        const imageUrl = document.getElementById("enterFoodImage").value;

        if (!imageUrl) {
            alert("Please enter an image URL");
            return;
        }

        this.fooditem.image = imageUrl;

        let section = document.createElement('div');
        section.className = "Image";
        section.id = this.count;

        let img = document.createElement('img');
        img.src = imageUrl;
        img.setAttribute("class", "AAddedimg");

        let button = document.createElement('button');
        button.textContent = "X";
        button.onclick = (e) => this.removeImage(e, this.count);
        button.setAttribute("class", "imgxf");

        section.appendChild(img);
        section.appendChild(button);
        document.getElementById('FoodImage').appendChild(section);
        section.setAttribute("class", "imgwrp");

        document.getElementById("addFoodImage").style.visibility = "hidden";
        document.getElementById("enterFoodImage").style.visibility = "hidden";

        this.count++;
    }

    removeImage = (e, index) => {
        let ele = e.target.parentNode;
        this.fooditem.image = null;
        ele.parentNode.removeChild(ele);
        document.getElementById("addFoodImage").style.visibility = "visible";
        document.getElementById("enterFoodImage").style.visibility = "visible";
    }

    changeType = (e) => {
        e.target.type = "number";
    }

    restrictE = (e) => {
        if((e.key === 'e' || e.target.value > 1000) && e.key !== "Backspace"){
            e.preventDefault();
        }
    }

    back = () => {
        this.props.history.push({
            pathname: "/Admin",
        });
    }

    render() {
        return (
            <>
                <div id="Addresback"></div>
                <div id="Admintag">
                    <img src='../IMAGES/Adminic.png' alt='Not found'></img>
                    <p>ADMIN</p>
                </div>
                <img src="../IMAGES/Home.png" alt="Not found" className='Home' onClick={this.back}></img>

                <div className='AddFooditem' id='AddFooditem'>
                    <h1 id="arhead">Add Food Item</h1>
                    <form id="addfoodform">
                        <input id='foodname' type="text" maxLength={50} placeholder='Enter Food Name' required></input>
                        <input id="fooddescription" type="text" maxLength={100} placeholder='Enter Food Description' required></input>
                        <input id="foodprice" type="text" onClick={this.changeType} onKeyDown={this.restrictE} placeholder='Enter Food Price' required></input>
                        <div id='FoodImage'></div>
                        <input id="enterFoodImage" type="url" placeholder='Enter Image URL'></input>
                        <input id="addFoodImage" type="button" value='+' onClick={this.uploadImage}></input>
                        <input id="addfoodsubmit" type='button' value='Submit' onClick={this.submit}></input>
                    </form>
                </div>
            </>
        );
    }
}

// ✅ FIX: Export with withRouter
export default withRouter(AddFooditem);