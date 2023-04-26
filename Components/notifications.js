/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geocoder from 'react-native-geocoding';
import {Actions} from 'react-native-router-flux';
import Heading from './heading';
import io from 'socket.io-client';
import Geolocation from 'react-native-geolocation-service';
navigator.geolocation = require('@react-native-community/geolocation');
import Float from './button1';
import SideMenu from './SideMenu';
import SideMenuDrawer from './SideMenuDrawer';

export default class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page : 'Notifications',
      email : '',
      location : '',
      delete_id : 'detete',
      loading : false,
      isFetching : false,
      latitude : '',
      longitude : '',
      notifications: []
    };
    this.Delete = this.Delete.bind(this);
  }


  UNSAFE_componentWillMount() {
    this.getPosition();
   }

 
  //Getting users' coordinates
  getPosition = () =>{
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          this.setState({latitude : latitude, longitude : longitude});

          const API_KEY = "AIzaSyB753snaAQ0ku3ufna7qSj4FxKp0XdVO24";
          Geocoder.init(API_KEY);
          Geocoder.from( this.state.latitude, this.state.longitude)
          .then(json => {
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


  //getting notifications from the database
  fetch = (dist) =>{
    
    AsyncStorage.getItem("email", (err, res) => {
      if (res){  
        email = res;
        district = dist;

        this.setState({loading : true})

        fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/notifications.php',
            //'http://192.168.63.1/RetinahBackend/notifications.php',
        {
          method : 'post',
          header : {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
          },

          body:JSON.stringify({
            email : email,
            district : district,
            delete_id : '',
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
           // alert(responseJson);
              //alert(this.state.email);
            if(responseJson == "Error"){
              this.setState({loading : false})
              //alert("System Error");
            }else{
              this.setState({loading : false})
              this.setState({notifications : responseJson});
            }   
          })   
        .catch((error) => {
          alert("Network Error");
          this.setState({loading : false})
           })
         }
      });
    }

    
   componentDidMount() {
    this.socket = io("https://retinah.herokuapp.com");
    AsyncStorage.getItem("location", (err, res) => {
      if (res){
        this.fetch(res);

        this.socket.on(res, (elem1, elem2) =>{
          this.fetch(res);
        });      
       }
     })    
   }

//Deleting user notifications
  Delete(x){
    
    AsyncStorage.getItem("email", (err, res) => {
    if (res){ 
    id = x;
    //alert(id);
    email = res;
    delete_id = this.state.delete_id;
    fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/notifications.php',
      //'http://192.168.63.1/RetinahBackend/notifications.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        delete_id : delete_id,
        email : email,
        id : id,
        district : district,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
       //alert(responseJson);
        if(responseJson == "Error"){
            alert("System Error");
        }else {
           this.setState({notifications : responseJson});
         }   
      })
    .catch((error) => {
      //alert(error);
       })
      }
    });
  }


  onRefresh = () =>{
    this.setState({isFetching : true}, () =>{this.fetch();})
  }

  render() {
    return (
      <View style={styles.container}>
       <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
        <Heading title = {this.state.page} show = {() => this._sideMenuDrawer.open()}/>
         {this.state.loading == true ? <ActivityIndicator color = "#ff33cc" size = "large" style = {{marginTop : "50%"}}/>:
        <FlatList 
          style={styles.tasks}
          columnWrapperStyle={styles.listContainer}
          data={this.state.notifications}
          onRefresh={() => this.fetch()}
          refreshing={this.state.isFetching}
          keyExtractor= {(item) => {
            return item.id.toString();
          }}
          renderItem={({item}) => {
            if(item.deleted == 0){
            return (
            <View style={[styles.card, {borderColor:item.code}]}>

             <View style = {{flex : 1, flexDirection : "row"}}>   
                <View style = {{flexDirection : "row"}}>
                  <Icon name = "bell-o" size ={17}/>
                  <Text style = {{marginLeft :5, fontStyle : "italic"}}>{item.title}</Text>
                </View>
                <View style = {{flex : 1}}>
               <TouchableHighlight onPress ={() => this.Delete(item.id)} underlayColor = "#ffffff" style = {{flexDirection : "row" ,width: 15, alignSelf : "flex-end"}}>
                  <Icon name = "trash-o" size ={17}/>
                </TouchableHighlight>
                </View>
              </View>
              <View style ={{flex : 1}}>              
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.description}>{item.message}</Text>
                  </View>
                  <Text style={styles.date}>{item.date + "  " + item.time}</Text>
                </View>
              </View>       
            </View>
          )}else{}
          }}/>}
              <Float /> 
        </SideMenuDrawer>
      </View>
    );  
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:0,
    backgroundColor:"#eeeeee"
  },
  
   footer : {
    marginHorizontal: "7.5%",
    alignSelf : "center"
   },

 img : {
   width : 35,
   height : 36,
   borderRadius : 63,
   marginLeft : 10,
   marginTop : 5
  },

  header : {
   marginTop : 11.5,
   marginLeft : 8,
   color : "#ffffff",
   fontSize : 20
  },
  tasks:{
    flex:1,
  },
  cardContent: {
    marginLeft:10,
    marginTop:2,
  },

  image:{
    width:25,
    height:25,
  },

  card:{
    shadowColor: '#00000021',
    resizeMode: 'contain',

    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 10,
    marginHorizontal:20,
    backgroundColor:"white",
    flexBasis: '46%',
    padding: 10,
    flexWrap: 'wrap',
    borderLeftWidth:6,
  },
  description:{
    fontSize:15,
    flex:1,
    color:"#008080",
    fontWeight:'bold',
  },
  date:{
    fontSize:14,
    flex:1,
    color:"#696969",
    marginTop:5
  },
});  
