import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/Addres.css'
import History from '../History';

export default class Addrestaurant extends Component {

    constructor(props){
        super(props);
        this.state = {
            restaurantName: "",
            restaurantAddress: "",
            imagesLink: []  // Store images in state
        };
        this.count = 0;
    }

    submit = (e) => {
        e.preventDefault();

        const restaurantName = document.getElementById('restaurantname').value;
        const restaurantAddress = document.getElementById('restaurantaddress').value;

        const imagesToSend = this.state.imagesLink.length === 0
            ? ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"]
            : this.state.imagesLink;

        const restaurantData = {
            restaurantName: restaurantName,
            restaurantAddress: restaurantAddress,
            restaurantRating: 0,
            numOfRating: 0,
            imagesLink: imagesToSend
        };

        console.log("FINAL DATA BEING SENT:", JSON.stringify(restaurantData, null, 2));

        axios.post("http://localhost:8080/zomato/admin/add-restaurant", restaurantData)
            .then((resp) => {
                console.log("Success:", resp.data);

                // ✅ FIX: Clear the form and show success message
                document.getElementById('restaurantname').value = "";
                document.getElementById('restaurantaddress').value = "";
                document.getElementById('enterImage').value = "";
                document.getElementById('restaurantImages').innerHTML = "";
                this.setState({ imagesLink: [] });

                // ✅ Show success message
                alert("Restaurant added successfully!");

                // ✅ Redirect to admin page
                setTimeout(() => {
                    History.push("/Admin");
                    window.location.reload(); // Force refresh to show new restaurant
                }, 1000);

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

        // Update state with new image
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

        // Update state by removing the image
        this.setState(prevState => ({
            imagesLink: prevState.imagesLink.filter((_, i) => i !== index)
        }));

        this.count--;
        ele.parentNode.removeChild(ele);

        document.getElementById('addImage').disabled = false;
    }

    back = () => {
        History.push({
            pathname: "/Admin",
        })
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