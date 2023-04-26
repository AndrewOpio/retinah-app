/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {BacKAndroid, View, Alert, Text, StyleSheet, TouchableOpacity, Image, TouchableHighlight} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import {LocalNotification} from './services/PushController';
import SideMenu from './SideMenu';
import SideMenuDrawer from './SideMenuDrawer';
navigator.geolocation = require('@react-native-community/geolocation');

class Heading extends React.Component {
constructor(props){
    super(props);

    this.state = {
      propic : "",
      email : '',
      user : '',
      circle : [],
      notification : '',
      latitude : '',
      longitude : ''
    };
  }
  


  componentWillMount(){
    this.circle();
    this.getPosition();
    AsyncStorage.getItem("user", (err, res) => {
      
    if (res == "police"){
       this.setState({user : res, propic : require('./Resources/police.png')});
     }else if (res == "retinah"){
       this.setState({user : res, propic : require('./Resources/logo.png')});
     }else if (res == "hospital"){
       this.setState({user : res, propic : require('./Resources/avatar.png')});
     }else{

    this.setState({user : res});
    AsyncStorage.getItem("email", (err, res) => {
    if (res){ 
     this.setState({email : res});

    fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/profile.php',
        //'http://192.168.64.1/RetinahBackend/profile.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        email : res,
      })
    })
    .then((response) => response.json())

    .then((responseJson) => {
        if(responseJson == "empty"){
         // alert("System Error");
       }else{
          this.setState({propic : responseJson.propic});
       }
    })
     .catch((error) => {
      //alert(error);
       })
      }
     });
   }})
  }
  
  componentDidMount() {
    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.socket = io("https://retinah.herokuapp.com");
        this.socket.on(res, msg =>{
          this.setState({propic : msg});
        });
       }
    });
  }
  
  logout = () =>{
    AsyncStorage.removeItem("email", (err, res) => { 
    });
    AsyncStorage.removeItem("user", (err, res) => { 
    });
   Actions.popTo('login');
  }


  
  componentDidMount(){
    this.socket = io("https://retinah.herokuapp.com");
  }
  

  //Getting user's initial position.
  getPosition = () =>{
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          this.setState({latitude : latitude, longitude : longitude});
        },
        (error) => {
          alert("Please turn on your gps to continue");
        },
        {enableHighAccuracy : false, timeout : 15000, maximumAge : 10000 }
      );   
    }


  //Members in your circle
 circle = () =>{
    AsyncStorage.getItem("email", (err, res) => {
    if (res){ 
    fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/alert.php',
        //'http://192.168.64.1/RetinahBackend/alert.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },
      body:JSON.stringify({
        email : res,
      })
    })  
    .then((response) => response.json())
    .then((responseJson) => {
    // alert(responseJson);
       if(responseJson == "Error"){
         // alert("Syst Error");
         // this.setState({loading : true})
       }else{
         this.setState({circle : responseJson});
        // this.setState({loading : false})
        //alert(this.state.circle);
       }
    })
    .catch((error) => {
     // this.setState({loading : false})
       //alert(error);
       //Actions.login();
     })
    }else{
      alert("failed");
    }
  });
 }


//Sending alerts to circle members 
send = () =>{
  if(this.state.circle.length > 0){
    this.state.circle.map((help) => {
      this.socket.emit('help', {email : help, message : "Please help me"});
      this.message(help);
    })
  }else{
    Alert.alert("Oopps..", "Your circle is empty, Please add members to your circle");
  }
}

messageIdGenerator = () =>{
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c =>{
    let r = (Math.random()* 16) | 0,
    v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//Sending message on button press
message = (email) =>{
  fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/chat.php',
          //'http://192.168.64.1/RetinahBackend/chat.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        sender : this.state.email,
        receiver : email,
        messageid : this.messageIdGenerator(),
        period : new Date(),
        messagetype : "text",
        message : "Please help me",
        latitude : this.state.latitude,
        longitude : this.state.longitude,
        circle : "true"
       })
     })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "Error"){
          alert("System Error");
         }else{
           alert("Alerts Sent");
           this.socket.emit('update', {email : this.state.email});
         }
       })
      .catch((error) => {
        alert(error);
     })
   }


  render(){
    return (
        <View style = {{ backgroundColor : "#ff33cc", height : 50, flexDirection : "row" }}>
            <TouchableHighlight onPress={this.props.show} underlayColor = "#ff33cc">
                {/*<Image  style = {styles.img} source = {this.state.propic == "" ? require('./Resources/avatar.png') : this.state.user == "police" ? this.state.propic : this.state.user == "retinah" ? this.state.propic :
                 this.state.user == "hospital" ? this.state.propic : {uri : this.state.propic}}/>*/}
                 <Icon name = "navicon" size = {25} style = {{color : "white", marginLeft : 15, marginTop : 12}}/>
            </TouchableHighlight>
            <Text style = {styles.header}>{this.props.title}</Text>
            <View style ={{flex : 1}}>
              <TouchableHighlight onPress={this.state.user == "citizen" ? () => this.send() : this.logout} underlayColor = "#ff33cc" style = {{ marginTop : 15, marginRight :15, alignSelf : "flex-end"}}>
               {this.state.user == "citizen" ? 
               <View style ={{flexDirection : "row"}}>
                  <Icon name = "exclamation-circle" size ={25} style = {{color : "white"}}/>
                  <Text style = {{color : "white", marginLeft : 10, fontSize : 18}}>Alert</Text>
                </View> :
                <View style = {{flexDirection : "row", marginTop :1}}> 
                </View>}
              </TouchableHighlight>
            </View>
        </View>
     );
    }
   }


const styles = StyleSheet.create({
header : {
   marginTop : 11.5,
   marginLeft : 10,
   color : "#ffffff",
   fontSize : 20
  },
img : {
   width : 35,
   height : 36,
   borderRadius : 63,
   marginLeft : 10,
   marginTop : 5,
   backgroundColor : "white"
 },


 
});

export default Heading;
