
import React from 'react';
import {BacKAndroid, View, Text, StyleSheet, TouchableOpacity, Image, TouchableHighlight} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FloatingAction} from 'react-native-floating-action';
import AsyncStorage from '@react-native-community/async-storage';

class Floating extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     user : '',
     circle : [],
     email : ''
    };
  }
  
  componentWillMount(){
    AsyncStorage.getItem("user", (err, res) => {
      if (res){ 
        this.setState({user : res});
      }
    });

    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.setState({email : res});
      }
    });
  }
  
  componentDidMount(){
    
  }
  
  render(){

    if(this.state.user == "retinah"){
       actions = [
          {
            text : "Add hospital",
            icon : <Icon name = "hospital-o" style = {{color : "white"}}/>,
            name : "hospital",
            position : 1
          },
          {
            text : "Add police",
            icon : <Icon name = "tasks" style = {{color : "white"}}/>,
            name : "police",
            position : 2
          },
          {
            text : "Users",
            icon : <Icon name = "user" style = {{color : "white"}}/>,
            name : "users",
            position : 3
          }
      ];
     }else if(this.state.user == "police"){
       actions = [
          
          {
            text : "Add police",
            icon : <Icon name = "tasks" style = {{color : "white"}}/>,
            name : "police",
            position : 1
          },
          {
            text : "Users",
            icon : <Icon name = "user" style = {{color : "white"}}/>,
            name : "users",
            position : 2
          }
       ];
     }

    return (
        <FloatingAction
            actions={actions}
            onPressItem={ name => {
                if(name == "hospital"){
                    Actions.hospital();
                }else if(name == "users"){
                    Actions.users();
                }else if(name == "police"){
                    Actions.police();
                }
            }}
            color={'#ff33cc'}
            />
         );
      }
   }


const styles = StyleSheet.create({
header : {
   marginTop : 11.5,
   marginLeft : 8,
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

export default Floating;


















































