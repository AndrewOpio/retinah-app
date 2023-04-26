import React, { Component } from "react";
import {TouchableOpacity, AsyncStorage, Keyboard, Text, View, TextInput, TouchableHighlight, Alert, StyleSheet, ScrollView} from 'react-native';
import { Actions } from 'react-native-router-flux'; 
import {Colors, } from 'react-native/Libraries/NewAppScreen';
import {Button} from 'native-base';
 class Change extends React.Component {
 constructor(props){
    super();
    this.state = {
      password : '',
      old : '',
      new : '',
    };
  }

  componentWillMount() {
    if(this.props.email){
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/change.php',
        //'http://192.168.64.1/RetinahBackend/change.php',

     {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        email :this.props.email,
        change : ""
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
     // alert(responseJson);
       if(responseJson == "Error"){
          alert("Error");
       }else{
         this.setState({password : responseJson.password});
        }    
      })
    .catch((error) => {
      alert(error);
    })
    }
  }

//Changing password
  validation = () =>{
    AsyncStorage.getItem("email", (err, res) => {
    if (res){ 
    
    fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/change.php',
        //'http://192.168.64.1/RetinahBackend/change.php',

    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        email :this.props.email ? this.props.email : res,
        old : this.state.old,
        new : this.state.new,
        change : "yes"
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
       if(responseJson == "Error"){
          alert("Error");
       }else{
         alert("Success");
          Actions.popTo('login'); 
        }    
      })
    .catch((error) => {
      alert('Network Error, check your connection and try again');
      })
     }
   })
  }


  render() {
    return (
     <ScrollView>
       <View style={styles.containerView}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <TextInput placeholder="Old Password.." placeholderColor="#c4c3cb" defaultValue = {this.state.password} style={styles.loginFormTextInput} onChangeText = {(text) => this.setState({old : text})}/>            
            <TextInput placeholder="New Password.." placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true} onChangeText = {(text) => this.setState({new : text})}/>          
            <TouchableOpacity block  onPress={this.validation}  style={styles.loginButton}>
                  <Text style = {{color : "#ff33cc", alignSelf : "center"}}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
    );
  }

}

const styles = StyleSheet.create({

containerView: {
  flex: 1,
  justifyContent : 'center',
  marginTop: "50%",
  width : "100%",
},
loginScreenContainer: {
  flex: 1,
},
logoText: {
  fontSize: 15,
  fontWeight: "800",
  marginTop: 180,
  marginBottom: 0,
  textAlign: 'center',
},

 avatar : {
  width : 100,
  height : 100,
  borderRadius : 63,
  borderWidth : 4,
  marginBottom : 10,
  alignSelf : 'center',
  position : 'absolute',
  marginTop : 80,
},

signup: {
 color:'#ff33cc',
 fontSize : 15,
 marginRight : "8%",
 marginTop : "20%",
 textAlign: "right",
 fontWeight : "bold"
},

name : {
  flexDirection : "row"
},


available : {
  color : "#ff33cc",
  flex :1,
  flexDirection : "row",
  alignSelf : "center"
},

account : {
  marginTop : "5%",
  textAlign: 'center',
  fontSize: 14
},

account : {
  marginTop : "5%",
  textAlign: 'center',
  fontSize: 13
},

forgotPassword: {
 color:'#ff33cc',
 fontSize : 12,
 textAlign : "center",
 marginTop : "5%"
},
loginFormView: {
  flex: 1
},
loginFormTextInput: {
  
  height: 43,
  width : "85%",
  fontSize: 14,
  borderRadius: 0,
  borderWidth: 0,
  borderColor: 'black',
  backgroundColor: '#eaeaea',
  paddingLeft: 10,
  marginLeft: 15,
  marginRight: 15,
  marginTop: 5,
  marginBottom: 5,
  alignSelf : 'center',

},
loginButton: {
  justifyContent : "center",
  backgroundColor: '#ffffff',
  borderWidth : 1,
  borderColor : "#ff33cc",
  alignSelf : 'center',
  marginTop : 10,
  height: 45,
  width : "85%",
},

});

export default Change;
