/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Router, Scene } from 'react-native-router-flux';
import Login from './Components/auth/login';
import Signup from './Components/auth/signup';
import  Profile from './Components/profile/profile';
import  Edit from './Components/profile/editprofile';
import Home from './Components/home/home';
import Saved from './Components/home/save';
import Chat from './Components/chat/chat';
import Contacts from './Components/help/tollfreelines';
import Map from './Components/help/map';
import Change from './Components/password/changepassword';
import Code from './Components/password/passcode';
import Forgot from './Components/password/forgotpassword';
import Comments from './Components/home/comments';
import Help from './Components/help/help';
import Search from './Components/help/search';
import Inbox from './Components/chat/inbox';
import Notifications from './Components/notifications';
import Post from './Components/posts/post';
import Notify from './Components/posts/notify';
import Hospital from './Components/admin/hospital';
import Police from './Components/admin/police';
import Users from './Components/admin/users';
import Circle from './Components/circle';
import DeliveryHome from './Components/Delivery app/home';
import Support from './Components/Delivery app/inbox';
import Details from './Components/Delivery app/details';
import DMap from './Components/Delivery app/dmap';
import Previous from './Components/Delivery app/previous';

navigator.geolocation = require('@react-native-community/geolocation');
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';

import io from 'socket.io-client';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-community/async-storage';


class App extends Component {
 constructor(props){
    super();
    this.state = {
      color : ''
    };
  }


  UNSAFE_componentWillMount() { 
    this.getDistrict();
  }

 //Getting the district of the current location
 getDistrict = () =>{
   navigator.geolocation.getCurrentPosition(
      (position) => {
         var latitude = position.coords.latitude;
         var longitude = position.coords.longitude;
         this.setState({latitude : latitude, longitude : longitude});

         const API_KEY = "AIzaSyB753snaAQ0ku3ufna7qSj4FxKp0XdVO24";
         Geocoder.init(API_KEY);
         Geocoder.from( this.state.latitude, this.state.longitude)
         .then(json => {
         //var addressComponent = json.results[0].address_component[0];
         //alert(plus_code.results[6].formatted_address);
         // console.log(json.results[0].address_components[2].long_name);
         AsyncStorage.removeItem("location", (err, res) => { 
         });

         AsyncStorage.setItem('location', json.results[0].address_components[2].long_name);    
         // this.setState({location : json.results[0].address_components[2].long_name });
         })
         .catch(error => console.warn(error)); 
        },
      (error) => {
         //alert("Please turn on your gps to continue");
      },
      {enableHighAccuracy : false, timeout : 15000, maximumAge : 10000 }
    );
   
   }


  logout = () =>{
    AsyncStorage.removeItem("email", (err, res) => { 
    });
    AsyncStorage.removeItem("user", (err, res) => { 
    });
   Actions.popTo('login');
  }


   render(){
    return (
  //Central Routing System
       <Router>
         <Scene key = "root">
            <Scene key = "login" title ="Log in" component = {Login} initial = {false} hideNavBar = {true}/>
            <Scene key = "signup" title ="Sign up" component = {Signup} hideNavBar = {true}/>


            <Scene key = "details" title ="Details" component = {Details} hideNavBar = {true}/>
            <Scene key = "dmap" title ="DMap" component = {DMap} hideNavBar = {true}/>
           <Scene
              key = "tabbar"
              lazy = {true}
              tabs
              tabBarStyle = {{backgroundColor : "#ffffff", color:"white"}}
              navBarStyle = {{backgroundColor : "#ffffff"}}
              hideNavBar = {true}
              activeBackgroundColor = {"#ffffff"}
              activeTintColor = {"#004d99"}
              swipeEnabled = {true}
              initial = {true}
              >
              <Scene key = "deliveryhome" title ="Home" component = {DeliveryHome} initial = {true} hideNavBar = {true} icon = {()=>(<Icon name = 'home' size = {18} style = {{color : "#666666"}}/>)}/>
              <Scene key = "previous" title ="Previous Trips" component = {Previous} hideNavBar = {true} titleStyle = {{color : "#ffffff"}} icon = {()=>(<Icon name = 'history' size = {18} style = {{color : "#666666"}}/>)}/>
              <Scene key = "supportchat" title ="Live Chat" component = {Support} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#267326"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}} icon = {()=>(<Icon name = 'message' size = {18} style = {{color : "#666666"}}/>)}/>
            </Scene>

            <Scene
              key = "tabbar1"
              lazy = {true}
              tabs
              tabBarStyle = {{backgroundColor : "#ffffff", color:"white"}}
              navBarStyle = {{backgroundColor : "#ffffff"}}
              hideNavBar = {true}
              activeBackgroundColor = {"#ffffff"}
              activeTintColor = {"#ff33cc"}
              swipeEnabled = {true}
              >
              <Scene key = "policehome" title ="Home" component = {Home} initial = {false} hideNavBar = {true} icon = {()=>(<Icon name = 'home' size = {19} style = {{color : "#666666"}}/>)} tintColor = "#000000" />
              <Scene key = "policepost" title ="Posts" component = {Post} hideNavBar = {true} titleStyle = {{color : "#ffffff"}} icon = {()=>(<Icon name = 'upload' size = {19} style = {{color : "#666666"}}/>)}/>
              <Scene key = "policenotify" title ="Notify" component = {Notify} hideNavBar = {true} titleStyle = {{color : "#ffffff"}} icon = {()=>(<Icon name = 'bell' size = {19} style = {{color : "#666666"}}/>)}/>
              <Scene key = "policechat" title ="Chats" component = {Chat} hideNavBar = {true} titleStyle = {{color : "#ffffff"}} icon = {()=>(<Icon name = 'comment' size = {19} style = {{color : "#666666"}}/>)}/>
            </Scene>

            <Scene
               key = "tabbar2"
               lazy = {true}
               tabs
               tabBarStyle = {{backgroundColor : "#ffffff", color:"white"}}
               navBarStyle = {{backgroundColor : "#ffffff"}}
               hideNavBar = {true}
               activeBackgroundColor = {"#ffffff"}
               activeTintColor = {"#ff33cc"}
               swipeEnabled = {true}
               >
                  <Scene key = "home" title ="Home" component = {Home} initial = {false} hideNavBar = {true} icon = {()=>(<Icon name = 'home' size = {19} style = {{color : "#666666"}}/>)} tintColor = "#000000" />
                  <Scene key = "chat" title ="Chat"on component = {Chat} hideNavBar = {true} icon = {()=>(<Icon name = 'comment' size = {19} style = {{color : "#666666"}}/>)} />
                  <Scene key = "help" title ="Help" component = {Help} hideNavBar = {true} icon = {()=>(<Icon name = 'exclamation-circle' size = {19} style = {{color : "#666666"}}/>)}/>
                  <Scene key = "notifications" title ="Notifications" component = {Notifications} hideNavBar = {true} icon = {()=>(<Icon name = 'bell' size = {19} style = {{color : "#666666"}}/>)}/>
               </Scene>
              <Scene
                  key = "tabbar3"
                  lazy = {true}
                  tabs
                  tabBarStyle = {{backgroundColor : "#ffffff", color:"white"}}
                  navBarStyle = {{backgroundColor : "#ffffff"}}
                  hideNavBar = {true}
                  activeBackgroundColor = {"#ffffff"}
                  activeTintColor = {"#ff33cc"}
                  swipeEnabled = {true}
                  >
                  <Scene key = "retinahhome" title ="Home" component = {Home} initial = {false} hideNavBar = {true} icon = {()=>(<Icon name = 'home' size = {19} style = {{color : "#666666"}}/>)} tintColor = "#000000" />
                  <Scene key = "retinahpost" title ="Posts" component = {Post} hideNavBar = {true} titleStyle = {{color : "#ffffff"}} icon = {()=>(<Icon name = 'upload' size = {19} style = {{color : "#666666"}}/>)}/>
                  <Scene key = "retinahnotify" title ="Notify" component = {Notify} hideNavBar = {true} titleStyle = {{color : "#ffffff"}} icon = {()=>(<Icon name = 'bell' size = {19} style = {{color : "#666666"}}/>)}/>
                  <Scene key = "retinahchat" title ="Chats" component = {Chat} hideNavBar = {true} titleStyle = {{color : "#ffffff"}} icon = {()=>(<Icon name = 'comment' size = {19} style = {{color : "#666666"}}/>)}/>
               </Scene>
               <Scene key = "saved" title ="Saved" component = {Saved} initial = {false} hideNavBar = {true} icon = {()=>(<Icon name = 'save' size = {19} style = {{color : "#666666"}}/>)} tintColor = "#000000" />
               <Scene key = "police" title ="Add Police" component = {Police}  rightButtonTextStyle={{color : "white", marginRight : 10}} onRight={()=> {}}hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/>
               <Scene key = "circle" title ="Your circle" component = {Circle} rightTitle={<Icon name = "plus" size = {20}/>} rightButtonTextStyle={{color : "white", marginRight : 10}} onRight={()=> Actions.users()} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/>
               <Scene key = "users" title ="Users" component = {Users} hideNavBar = {true} titleStyle = {{color : "#ffffff"}} icon = {()=>(<Icon name = 'plus' size = {19} style = {{color : "#666666"}}/>)}/>
               <Scene key = "hospital" title ="Add Hospital" component = {Hospital} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/>
               <Scene key = "hospitalchat" title ="Chats" component = {Chat} hideNavBar = {true} titleStyle = {{color : "#ffffff"}} icon = {()=>(<Icon name = 'comment' size = {19} style = {{color : "#666666"}}/>)}/>
               <Scene key = "search" title ="Search Contacts" component = {Search} hideNavBar = {true} titleStyle = {{color : "#ffffff"}}/>
               <Scene key = "change" title ="Change Password" component = {Change} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/>
               <Scene key = "edit" title ="Edit Profile" component = {Edit} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/>
               <Scene key = "forgot" title ="Forgot Password" component = {Forgot} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/>
               <Scene key = "code" title ="Confirm" component = {Code} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/>
               <Scene key = "map" title ="Hospitals" component = {Map} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/>
               <Scene key = "inbox" title ="Inbox" component = {Inbox} hideNavBar = {false}  titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/>
               <Scene key = "contacts" title ="Contacts" component = {Contacts} rightTitle={<Icon name = "search" size = {20}/>} rightButtonTextStyle={{color : "white", marginRight : 10}} onRight={()=> Actions.search()} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/>
               <Scene key = "comments" title ="Comments" component = {Comments} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}}  backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}} />
               <Scene key = "profile" title ="Profile" component = {Profile} rightTitle={<Icon name = "sign-out" size = {20}/>} rightButtonTextStyle={{color : "white", marginRight : 10}} onRight={this.logout} hideNavBar = {false} titleStyle = {{color : "#ffffff"}} navigationBarStyle = {{backgroundColor: "#ff33cc"}} backButtonTintColor ='#ffffff'  backButtonTextStyle = {{color : "#ffffff"}}/> 
         </Scene>
       </Router>
     );
  }
}


const styles = StyleSheet.create({

});

export default App;
