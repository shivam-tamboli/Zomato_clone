import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../CSS/Editfood.css'

class EditFooditem extends Component {
    constructor(props){
        super(props);

        const foodData = this.props.location?.state?.resdata;
        const restaurantId = this.props.location?.state?.resid;

        console.log("🔍 EDIT FOOD - Raw data received:", foodData);
        console.log("🔍 EDIT FOOD - Restaurant ID:", restaurantId);

        if (!foodData || !restaurantId) {
            alert("Error: Cannot edit food item. Missing data.");
            this.props.history.push({
                pathname: '/Viewmenu',
                state: { resid: restaurantId }
            });
            return;
        }

        const foodItemId = foodData.fooditemid || foodData.foodItemId || foodData.id;
        const foodName = foodData.foodname || foodData.foodName || foodData.name;

        this.state = {
            foodName: foodName,
            description: foodData.description || "",
            price: foodData.price || "",
            image: foodData.image || "",
            newImageUrl: "",
            loading: false
        };

        this.restaurantId = Number(restaurantId);
        this.foodItemId = Number(foodItemId); // ✅ Ensure it's a number
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submit = async (e) => {
        e.preventDefault();

        const { foodName, description, price, image } = this.state;

        if (!foodName || !description || !price) {
            alert("Please fill all required fields");
            return;
        }

        // ✅ FIX: Send data in EXACT format backend expects
        const foodData = {
            fooditemid: this.foodItemId, // ✅ Must be number
            restaurantId: this.restaurantId, // ✅ Must be number
            foodName: foodName,
            description: description,
            price: Number(price), // ✅ Ensure it's a number, not string
            image: image || "default-food-image.jpg"
        };

        console.log("🚀 SENDING TO BACKEND:", foodData);
        console.log("🔍 Data types - fooditemid:", typeof foodData.fooditemid,
            "restaurantId:", typeof foodData.restaurantId,
            "price:", typeof foodData.price);

        this.setState({ loading: true });

        try {
            const response = await axios.post("http://localhost:8080/zomato/admin/edit-fooditems", foodData);
            console.log("✅ SUCCESS:", response.data);

            if (response.data === "success") {
                alert("Food item updated successfully!");
                this.props.history.push({
                    pathname: '/Viewmenu',
                    state: { resid: this.restaurantId }
                });
            } else if (response.data === "name") {
                alert("A food item with this name already exists in the restaurant!");
            } else {
                alert("Update failed: " + response.data);
            }

        } catch (error) {
            console.error("❌ ERROR:", error);
            console.error("❌ Error response:", error.response?.data);
            alert("Failed to update food item. Please check console for details.");
        } finally {
            this.setState({ loading: false });
        }
    }

    uploadImage = () => {
        const { newImageUrl } = this.state;
        if (!newImageUrl) {
            alert("Please enter an image URL");
            return;
        }
        this.setState({
            image: newImageUrl,
            newImageUrl: ""
        });
    }

    removeImage = () => {
        this.setState({ image: "" });
    }

    back = () => {
        this.props.history.push({
            pathname: "/Viewmenu",
            state: { resid: this.restaurantId }
        });
    }

    render() {
        const { foodName, description, price, image, newImageUrl, loading } = this.state;

        return (
            <>
                <div id="Addresback"></div>
                <div id="Admintag">
                    <img src='../IMAGES/Adminic.png' alt='Admin' />
                    <p>ADMIN</p>
                </div>
                <img src="../IMAGES/Home.png" alt="Home" className='Home' onClick={this.back} />

                <div id='EditFooditem'>
                    <h1 id="arhead">Edit Food Item</h1>

                    <div className="current-info">
                        <h3>Editing: {foodName}</h3>
                        <p><strong>Food ID:</strong> {this.foodItemId}</p>
                        <p><strong>Restaurant ID:</strong> {this.restaurantId}</p>
                    </div>

                    <form id="editfoodform" onSubmit={this.submit}>
                        <input
                            name="foodName"
                            type="text"
                            placeholder='Food Name'
                            value={foodName}
                            onChange={this.handleInputChange}
                            required
                        />

                        <input
                            name="description"
                            type="text"
                            placeholder='Description'
                            value={description}
                            onChange={this.handleInputChange}
                            required
                        />

                        <input
                            name="price"
                            type="number"
                            placeholder='Price'
                            value={price}
                            onChange={this.handleInputChange}
                            min="1"
                            step="0.01"
                            required
                        />

                        <div className="image-section">
                            <h4>Food Image:</h4>
                            {image ? (
                                <div className="current-image">
                                    <img src={image} alt="Current food" />
                                    <button type="button" onClick={this.removeImage}>Remove Image</button>
                                </div>
                            ) : (
                                <div className="no-image">
                                    <p>No image set</p>
                                </div>
                            )}

                            <div className="add-image">
                                <input
                                    type="url"
                                    placeholder='Enter New Image URL'
                                    value={newImageUrl}
                                    onChange={(e) => this.setState({newImageUrl: e.target.value})}
                                />
                                <button type="button" onClick={this.uploadImage}>Add Image</button>
                            </div>
                        </div>

                        <button type="submit" id="editfoodsubmit" disabled={loading}>
                            {loading ? "UPDATING..." : "UPDATE FOOD ITEM"}
                        </button>
                    </form>
                </div>
            </>
        );
    }
}

export default withRouter(EditFooditem);