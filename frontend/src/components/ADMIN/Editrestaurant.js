import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../CSS/Editrestaurant.css'

class AdminEditRest extends Component {
    constructor(props){
        super(props);

        const restaurantData = this.props.location?.state?.resobj;
        const restaurantId = this.props.location?.state?.resid;

        if (!restaurantData || !restaurantId) {
            alert("Error: Cannot edit restaurant. Missing data.");
            this.props.history.push('/Admin');
            return;
        }

        const restaurantImages = restaurantData.restaurantImages || [];

        this.state = {
            restaurantName: restaurantData.restaurantName,
            restaurantAddress: restaurantData.restaurantAddress,
            imagesLink: restaurantImages.map(image => image.link || ""),
            newImageUrl: ""
        };
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submit = (e) => {
        e.preventDefault();

        const { restaurantName, restaurantAddress, imagesLink } = this.state;
        const restaurantData = this.props.location?.state?.resobj;
        const restaurantId = this.props.location?.state?.resid;

        if (!restaurantName || !restaurantAddress) {
            alert("Please fill all required fields");
            return;
        }

        const restaurant = {
            restaurantId: Number(restaurantId),
            restaurantName: restaurantName,
            restaurantAddress: restaurantAddress,
            imagesLink: imagesLink
        };

        axios.post("http://localhost:8080/zomato/admin/edit-restaurant", restaurant)
            .then((resp) => {
                alert("Restaurant updated successfully!");
                this.props.history.push('/Admin');
            })
            .catch((err) => {
                alert("Failed to update restaurant");
            });
    }

    uploadImage = () => {
        const { newImageUrl, imagesLink } = this.state;

        if (!newImageUrl) {
            alert("Please enter an image URL");
            return;
        }

        this.setState({
            imagesLink: [...imagesLink, newImageUrl],
            newImageUrl: ""
        });
    }

    removeImage = (index) => {
        const { imagesLink } = this.state;
        this.setState({
            imagesLink: imagesLink.filter((_, i) => i !== index)
        });
    }

    back = () => {
        this.props.history.push('/Admin');
    }

    render() {
        const { restaurantName, restaurantAddress, imagesLink, newImageUrl } = this.state;

        return (
            <>
                <div id="Addresback"></div>
                <div id="Admintag">
                    <img src='../IMAGES/Adminic.png' alt='Admin' />
                    <p>ADMIN</p>
                </div>
                <img src="../IMAGES/Home.png" alt="Home" className='Home' onClick={this.back} />

                <div id='EditRestaurant'>
                    <h1 id="arhead">Edit Restaurant</h1>

                    <div className="current-info">
                        <h3>Current Restaurant: {restaurantName}</h3>
                        <p>Address: {restaurantAddress}</p>
                    </div>

                    <form id="Editresform" onSubmit={this.submit}>
                        <input
                            name="restaurantName"
                            type="text"
                            placeholder='Restaurant Name'
                            value={restaurantName}
                            onChange={this.handleInputChange}
                            required
                        />

                        <input
                            name="restaurantAddress"
                            type="text"
                            placeholder='Restaurant Address'
                            value={restaurantAddress}
                            onChange={this.handleInputChange}
                            required
                        />

                        <div className="images-section">
                            <h4>Restaurant Images:</h4>
                            <div className="images-container">
                                {imagesLink.map((imageUrl, index) => (
                                    <div key={index} className="image-item">
                                        <img src={imageUrl} alt="Restaurant" />
                                        <button type="button" onClick={() => this.removeImage(index)}>X</button>
                                    </div>
                                ))}
                            </div>

                            <div className="add-image">
                                <input
                                    type="url"
                                    placeholder='Enter Image URL'
                                    value={newImageUrl}
                                    onChange={(e) => this.setState({newImageUrl: e.target.value})}
                                />
                                <button type="button" onClick={this.uploadImage}>Add Image</button>
                            </div>
                        </div>

                        <button type="submit" id="editressubmit">UPDATE RESTAURANT</button>
                    </form>
                </div>
            </>
        );
    }
}

export default withRouter(AdminEditRest);