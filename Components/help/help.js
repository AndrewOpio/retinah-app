import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Heading from '../heading';
import Icon from 'react-native-vector-icons/FontAwesome';
import Float from '../button1';
navigator.geolocation = require('@react-native-community/geolocation');
import AsyncStorage from '@react-native-community/async-storage';
import SideMenu from '../SideMenu';
import SideMenuDrawer from '../SideMenuDrawer';

export default class Help extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page : "Help",
      data: [
        {id:1, title: "Hospitals", icon :"hospital-o"},
        {id:1, title: "Referrals", icon :"medkit"},
        {id:2, title: "Tollfreelines", icon :"phone"} ,
        
      ]
    };
  }
  
 componentWillMount() {
 }

  //Getting user's initial position.
   /* getPosition = () =>{
        navigator.geolocation.getCurrentPosition(
          (position) => {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            
            var coords = [];

            coords[0] = latitude;
            coords[1] = longitude;

            AsyncStorage.removeItem("coords", (err, res) => { 
            });
            
            AsyncStorage.setItem('coords', JSON.stringify(coords));
          },
          (error) => {
            alert("Please turn on your gps to continue");
          },
          {enableHighAccuracy : false, timeout : 15000, maximumAge : 10000 }
        );   
      }*/


  clickEventListener(item) {
   if(item == "Tollfreelines" || item == "Referrals")  {
      Actions.contacts({title : item}); 
   }else{
      Actions.map(); 
    }
  }

  render() {
    return (
        <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>

        <Heading title = {this.state.page} show = {() => this._sideMenuDrawer.open()}/>
       <View>
        <FlatList style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={this.state.data}
          horizontal={false}
          numColumns={2}
          keyExtractor= {(item) => {
            return item.id;
          }}
          renderItem={({item}) => {
            return (
              <View style={{flex:1, paddingTop : 50, borderRadius : 10}}>
                <TouchableOpacity style={styles.card} onPress={() => {this.clickEventListener(item.title)}}>
                    <Icon name = {item.icon} size ={60} style = {{ color : "#ff33cc", alignSelf : "center"}}/>
                </TouchableOpacity>
                <View style={styles.cardHeader}>
                  <View style={{marginLeft : 15, justifyContent:"center"}}>
                    <Text style={styles.title}>{item.title}</Text>
                  </View>
                </View>
              </View>
            )
          }}/>
          </View>
        <Float/> 
        </SideMenuDrawer>
    );
  }
}

const styles = StyleSheet.create({
  container:{

  },
  list: {
    padding : 1,

  },
  listContainer:{
     marginLeft : "8%"
  },
  /******** card **************/
  card:{
    shadowColor: '#474747',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
    backgroundColor:"#e2e2e2",
    width:120,
    height:120,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center'
  },
  cardContent: {
  },
  
  title:{
    fontSize:18,
    color:"#696969",
    marginTop : 10
  },
});     

