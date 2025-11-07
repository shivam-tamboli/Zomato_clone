import React, { Component } from 'react';
import '../CSS/Userlogin.css'
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class UserLogin extends Component {

    constructor(props){
        super(props);
        this.userPhoneNumber = this.props.phh;
    }

    showFoods = (e) =>{
        this.props.history.push({
            pathname:"/Userfoods",
            state:{
                phonenum:this.userPhoneNumber
            }
        })
    }

    showRestaurants = (e) =>{
        console.log("CHECK : ",this.userPhoneNumber)
        this.props.history.push({
            pathname:"Userrestaurant",
            state:{
                phonenum:this.userPhoneNumber
            }
        })
    }

    showOrders = (e) =>{
        this.props.history.push({
            pathname:"Orders",
            state:{
                phonenum:this.userPhoneNumber
            }
        })
    }

    back=()=>
    {
        console.log("OKK")
        this.props.history.push({
            pathname:"/Userrestaurant",
            state:{
                phonenum:this.userPhoneNumber
            }
        })
    }

    logout=()=>
    {
        axios.post("http://localhost:8080/zomato/user/logout",{phonenumber:this.userPhoneNumber })
            .then((resp)=>
            {
                console.log(resp.data)
            })
            .catch((err)=>{
                console.log(err.message)
            })
        this.props.history.push('/')
    }

    render() {
        return (
            <>
                <div id="Adlogback"></div>
                <div id="Admintag">
                    <img src='../IMAGES/Userpic.png' alt='Not found'></img>
                    <p>USER</p>
                </div>
                <img src="../IMAGES/Home.png" alt="Not found" className='Home' onClick={this.back}></img>
                <img src="../IMAGES/Logout.png" alt="Not found" className='Logout' onClick={this.logout}></img>
                <div className='UserLoginBack'>
                    <div className='UserLoginButton'>
                        <button className='ShowFoodUsrB' onClick={this.showFoods}>Foods</button>
                        <button className='ShowResUsrB' onClick={this.showRestaurants}>Restaurants</button>
                        <button className='ShowOrderUsrB' onClick={this.showOrders}>My Orders</button>
                    </div>
                </div>
            </>
        )
    }
}


export default withRouter(UserLogin);