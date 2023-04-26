  import React, { Component } from 'react';
  import { Platform, StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
  import MapView, {PROVIDER_GOOGLE, MapMarker} from 'react-native-maps';
  import MapViewDirections from 'react-native-maps-directions';
  import {Button} from 'native-base';
  import {getPreciseDistance } from 'geolib';
  import Geocoder from 'react-native-geocoding';
  import AsyncStorage from '@react-native-community/async-storage';
  import {Actions} from 'react-native-router-flux';

  navigator.geolocation = require('@react-native-community/geolocation');

  class Map extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        district : '',
        email : '',
        latitude : '',
        longitude : '',
        nearlng : '',
        nearlat : '',
        loading : false,
        hospitals: [], 
      };
    }
   



     //Getting user position
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




   //Getting shortest distance between two coordinates on the map.
   getDistance = () => {
     var distance = [];
     var i = 0;
     this.state.hospitals.map((hospital)=>{
      var pdis = getPreciseDistance(
      { latitude: this.state.latitude, longitude: this.state.longitude},
      { latitude: hospital.lat, longitude: hospital.lng }
     );
      distance[i] = pdis;
      i++;
    })
      
     var min = Math.min(...distance);

       this.state.hospitals.map((hospital)=>{
        var pdis = getPreciseDistance(
        { latitude: this.state.latitude, longitude: this.state.longitude},
        { latitude: hospital.lat, longitude: hospital.lng }
      );
        if(pdis == min){
          nearlat = hospital.lat;
          nearlng = hospital.lng;
        }
        i++;
      })
    }

 

    UNSAFE_componentWillMount() {
       AsyncStorage.getItem("email", (err, res) => {
       if (res){
          this.setState({email : res});
        }})

      this.getPosition();
      this.fetch();
    }



    fetch = () =>{  
    this.setState({loading : true});   
     AsyncStorage.getItem("location", (err, res) => {
      if (res){ 
      id = "hospitals";
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/help.php',
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
        body:JSON.stringify({
            location : res,
            id : id
          })
        })

      .then((response) => response.json())
      .then((responseJson) => {
       //alert(responseJson);
        if(responseJson == "System Error"){
          this.setState({loading : false});   
        }else{
          this.setState({hospitals : responseJson, loading : false});
          //alert(this.state.hospitals);
          }    
        })
      .catch((error) => {
       //alert("error");
          this.setState({loading : false});   
        }) 
       }
     })
   }

    componentDidMount(){
      
    }

    //Displaying markers on the map from the database
    markers = () => {
      return(
       this.state.hospitals.map((hospital)=>{
        return (
         <MapView.Marker 
          coordinate = {{
            latitude : parseFloat(hospital.lat),
            longitude : parseFloat(hospital.lng),
          }}
          title = {hospital.name}
          description = {"Chat with"+" "+hospital.name}
          onCalloutPress = {() => Actions.inbox({title : hospital.name, sender : this.state.email, receiver : hospital.email})}
          >
            <MapView.Callout>
              <Text>{hospital.name}</Text>
              <Text>{"Chat with"+" "+hospital.name}</Text>
            </MapView.Callout>
          </MapView.Marker>
          )
        }
      )    
    );
  }

    
    render() {
     //0.3362
     //32.5723
     this.getDistance();
      const pinColor = 'indigo';
      //alert(nearlat);
      return (
        this.state.loading == true ? <ActivityIndicator color = "#ff33cc" size = "large" style = {{marginTop : "50%"}}/>:
        <View style = {styles.container}>{this.state.latitude ?
          <MapView
              style = {styles.map}
              provider = {PROVIDER_GOOGLE}
              initialRegion ={{
                latitude : this.state.latitude,
                longitude : this.state.longitude,
                latitudeDelta : 0.0922,
                longitudeDelta : 0.0421,                
              }}             
            >
            <MapViewDirections
              origin={{latitude :this.state.latitude, longitude: this.state.longitude}}
              destination={{latitude : this.props.lat ? this.props.lat : nearlat, longitude: this.props.lng ? this.props.lng : nearlng}}
              strokeWidth={4}
              strokeColor ="hotpink"
              apikey={'AIzaSyB753snaAQ0ku3ufna7qSj4FxKp0XdVO24'}
            />
              <MapView.Marker
                coordinate ={{latitude: this.state.latitude , longitude: this.state.longitude}}
                title = {"Your location"}
                pinColor = {pinColor}
                >                                                    
              </MapView.Marker> 

              {this.props.lat ? <MapView.Marker
                coordinate ={{latitude: parseFloat(this.props.lat) , longitude: parseFloat(this.props.lng)}}
                title = {"sender location"}
                >                                                    
              </MapView.Marker>: <View></View>} 
              {!this.props.lat ? this.markers() : <View></View>}                     
         </MapView> : <View></View>}
        </View>
      );
    }
  }

const styles = StyleSheet.create({
 container : {
   position : 'absolute',
   top : 0,
   left : 0,
   bottom : 0,
   right : 0, 
   justifyContent : 'flex-end',
   alignItems : 'center'
 },

 map : {
    position : 'absolute',
   top : 0,
   left : 0,
   bottom : 0,
   right : 0, 
 },
 button : {
   backgroundColor : "#ffffff",
   height : 20,
  
   marginLeft : 2,
   marginRight : 2

 }
});

export default Map;