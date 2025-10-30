import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom'; // 🔥 ADD THIS IMPORT
import '../CSS/Addres.css'

class Addrestaurant extends Component {

    constructor(props){
        super(props);
        this.state = {
            restaurantName: "",
            restaurantAddress: "",
            imagesLink: []
        };
        this.count = 0;
    }

    submit = (e) => {
        e.preventDefault();

        const restaurantName = document.getElementById('restaurantname').value;
        const restaurantAddress = document.getElementById('restaurantaddress').value;

        if (!restaurantName || !restaurantAddress) {
            alert("Please fill in restaurant name and address");
            return;
        }

        const imagesToSend = this.state.imagesLink.length === 0
            ? ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"]
            : this.state.imagesLink;

        const restaurantData = {
            restaurantName: restaurantName,
            restaurantAddress: restaurantAddress,
            restaurantimages: imagesToSend
        };

        console.log("FINAL DATA BEING SENT:", JSON.stringify(restaurantData, null, 2));

        axios.post("http://localhost:8080/zomato/admin/add-restaurant", restaurantData)
            .then((resp) => {
                console.log("Success:", resp.data);

                // Clear form
                document.getElementById('restaurantname').value = "";
                document.getElementById('restaurantaddress').value = "";
                document.getElementById('enterImage').value = "";
                document.getElementById('restaurantImages').innerHTML = "";
                this.setState({ imagesLink: [] });

                alert("Restaurant added successfully!");

                // Navigate back to Admin
                this.props.history.push("/Admin");

            })
            .catch((err) => {
                console.log("Full error:", err);
                console.log("Error response data:", err.response?.data);
                alert("Error adding restaurant: " + (err.response?.data || err.message));
            });
    }

    uploadImage = (e) => {
        const imageUrl = document.getElementById('enterImage').value;

        if(!imageUrl) {
            alert("Please enter an image URL");
            return;
        }

        if(imageUrl.length >= 9501) {
            alert("Link too long");
            return;
        }

        this.setState(prevState => ({
            imagesLink: [...prevState.imagesLink, imageUrl]
        }));

        let section = document.createElement('div');
        section.className = "Image";
        section.id = this.count;

        let img = document.createElement('img');
        img.src = imageUrl;
        img.setAttribute("class", "Addedimg")

        let button = document.createElement('button');
        button.textContent = "X";
        button.setAttribute("class", "imgx")
        button.onclick = (e) => this.removeImage(e, this.count);
        section.setAttribute("class", "imgwrp")
        section.appendChild(img);
        section.appendChild(button);
        document.getElementById('restaurantImages').appendChild(section);

        this.count++;
        if(this.count === 5) {
            document.getElementById('addImage').disabled = true;
        }
        document.getElementById('enterImage').value = "";
    }

    removeImage = (e, index) => {
        let ele = e.target.parentNode;

        this.setState(prevState => ({
            imagesLink: prevState.imagesLink.filter((_, i) => i !== index)
        }));

        this.count--;
        ele.parentNode.removeChild(ele);

        document.getElementById('addImage').disabled = false;
    }

    back = () => {
        this.props.history.push("/Admin");
    }

    render() {
        return (
            <>
                <div id="Adlogback"></div>
                <div id="Admintag">
                    <img src='../IMAGES/Adminic.png' alt='Not found'></img>
                    <p>ADMIN</p>
                </div>
                <img src="../IMAGES/Home.png" alt="Not found" className='Home' onClick={this.back}></img>
                <div className='AddRestaurant' id='AddRestaurant'>
                    <h1 id="arhead">Add Restaurant</h1>
                    <form id="Addresform">
                        <input
                            id='restaurantname'
                            type="text"
                            maxLength={50}
                            placeholder='Enter Restaurant Name'
                            required
                        ></input>
                        <input
                            id="restaurantaddress"
                            type="text"
                            maxLength={100}
                            placeholder='Enter Address'
                            required
                        ></input>
                        <div id='restaurantImages'></div>
                        <input
                            id="enterImage"
                            type="url"
                            placeholder='Enter Image URL'
                        ></input>
                        <input
                            id="addImage"
                            type="button"
                            value='+'
                            onClick={this.uploadImage}
                        ></input>
                        <button type="submit" id="addresssubmit" onClick={this.submit}>SUBMIT</button>
                    </form>
                </div>
            </>
        );
    }
}

// Export with withRouter
export default withRouter(Addrestaurant);