import React, { Component } from "react";
import {Keyboard, Text, View, TextInput, TouchableOpacity, ImageBackground,TouchableHighlight, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Picker, StyleSheet} from 'react-native';
import { Actions } from 'react-native-router-flux'; 
import {Button} from 'native-base';

export default class Signup extends Component {

constructor(props){
    super();
    this.state = {
      firstname : '',
      lastname : '',
      contact : '',
      residence : '',
      gender : '',
      email : '',
      password : '',
      confirm : '',
      loading : false
    };
    this.register = this.register.bind(this);
  }

messageIdGenerator = () =>{
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c =>{
    let r = (Math.random()* 16) | 0,
    v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


//Sending default meessage from retinah or police to the user
message = (email, msg) =>{
  fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/chat.php',
      //'http://192.168.64.1/RetinahBackend/chat.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        sender : email,
        receiver : this.state.email,
        messageid : this.messageIdGenerator(),
        period : new Date(),
        messagetype : "text",
        message : msg,
        latitude : 0,
        longitude : 0,
        circle : ""
       })
     })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "Error"){
          alert("System Error");
         }else{
         }
       })
      .catch((error) => {
        alert(error);
      })
   }

//Adding users to the system
 register(){
    firstname = this.state.firstname;
    lastname  = this.state.lastname;
    contact = this.state.contact;
    residence = this.state.residence;
    gender = this.state.gender;
    email = this.state.email;
    password = this.state.password;
   if(firstname != "" && lastname != "" && contact != "" && residence != "" && gender != "G" && email != "" && password != "" ){
      if(this.state.password == this.state.confirm || this.state.password.length < 5){
          this.setState({loading : true})      
          fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/signup.php',
              //'http://192.168.64.1/RetinahBackend/signup.php',
          {
            method : 'post',
            headers : {
              'Content-type' : 'application/json'
            },
            body:JSON.stringify({
              firstname : firstname,
              lastname : lastname,
              contact : contact,
              residence : residence,
              gender : gender,
              email : email,
              password : password
            })
          })
          .then((response) => response.json())
          .then((responseJson) => {
            alert(responseJson);
            if(responseJson == "Failed"){
                alert("Email already exists");
            }else if(responseJson == "Success"){

              this.message("retinahapp@gmail.com", "Welcome to retinah support, how may we help you");
              this.message("police@gmail.com", "Welcome, how may we help you");

              this.setState({loading : false})
                alert('Success');
                Actions.login();
              }         
            })
          .catch((error) => {
            this.setState({loading : false})
            alert("Network Error");
          })
        }else{
          if(this.state.lastname == ''){
            Alert.alert('Hey there',
            'The passwords you entered dont match.' + " " +
            'Make sure your password is atleast five characters long'
            );
          }else{
            Alert.alert('Hey' +"  " + this.state.lastname,
            'The passwords you entered dont match'
            );
          }
        }
      }else{
        Alert.alert(
          "Hi there",
          "Please fill in all fields to proceed"
        )
      }
   }

   //set gender from the picker
   gender = (value) => {
     this.setState({gender : value});
   }

    
  render() {
    return (
  <ImageBackground source = {require('../Resources/bg.jpg')} style={styles.containerView}>
    <ScrollView>
        <View style={styles.signupScreenContainer}>
          <View style={styles.signupFormView}>
              <Text style={styles.logoText}>Retinah</Text>
              <View style = {styles.name}>
                <TextInput placeholder="First Name" placeholderColor="#c4c3cb" style={styles.signupTextInput} onChangeText = {(text) => this.setState({firstname : text})}/>
                <TextInput placeholder="Last Name" placeholderColor="#c4c3cb" style={styles.signupTextInput} onChangeText = {(text) => this.setState({lastname : text})}/>
                </View>
                <TextInput placeholder="Contact" placeholderColor="#c4c3cb" style={styles.signupFormTextInput} onChangeText = {(text) => this.setState({contact : text})}/>
                <TextInput placeholder="Email" placeholderColor="#c4c3cb" style={styles.signupFormTextInput} onChangeText = {(text) => this.setState({email : text})}/>
                <TextInput placeholder="Residence" placeholderColor="#c4c3cb" style={styles.signupFormTextInput} onChangeText = {(text) => this.setState({residence : text})}/>
                 <View   style={styles.signupFormTextInput}>
                  <Picker selectedValue = {this.state.gender}
                      onValueChange={this.gender}
                    >
                      <Picker.Item label = "Gender" value = "G" style = {{color : "#c4c3cb"}}/>
                      <Picker.Item label = "Male" value = "M"/>
                      <Picker.Item label = "Female" value = "F"/>
                  </Picker>
                 </View>
                <TextInput placeholder="Password" placeholderColor="#c4c3cb" style={styles.signupFormTextInput}  secureTextEntry={true} onChangeText = {(text) => this.setState({password : text})}/>
                <TextInput placeholder="Confirm Password" placeholderColor="#c4c3cb" style={styles.signupFormTextInput} secureTextEntry={true} onChangeText = {(text) => this.setState({confirm : text})}/>
                 <TouchableOpacity block  style = {styles.signupButton} onPress = {this.register}>
                    {this.state.loading == false ? <Text style ={{alignSelf : "center", color: "white"}}>Signup</Text> :
                    <ActivityIndicator color = "#ffffff"/>}
                  </TouchableOpacity>
                <View style = {styles.available}>
                  <Text style={styles.account}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => Actions.login()} style={styles.signin}>
                    <View>
                      <Text style = {{color:'#ff33cc', fontWeight : "bold", fontSize : 17,}}>Sign in</Text>
                    </View>
                  </TouchableOpacity>                
                </View>               
            </View>
        </View>
    </ScrollView>
    </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({

containerView: {
  flex: 1,
},
signupScreenContainer: {
  flex: 1,
},
logoText: {
  fontSize: 30,
  fontWeight: "800",
  marginTop: 20,
  marginBottom: 30,
  textAlign: 'center',
  color: "#ffffff",
  fontFamily : "helvetica"
},

signin: {
 marginLeft : 50,
 marginTop: "5%",
 textAlign: "right",
 marginBottom : 10
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
  fontSize: 14,
  color : "#ffffff"
},

signupFormView: {
  flex: 1
},
signupTextInput: {
  borderTopColor: "#bfbfbf",
  borderTopWidth: 1,
  borderLeftColor: "#bfbfbf",
  borderLeftWidth: 1,
  borderRightColor: "#bfbfbf",
  borderRightWidth: 1,
  borderBottomColor: "#bfbfbf",
  borderBottomWidth: 1,
  height: 43,
  width : "40%",
  alignSelf : 'center',  
  fontSize: 14,
  borderRadius: 0,
  borderWidth: 0,
  backgroundColor: '#fafafa',
  paddingLeft: 10,
  marginLeft : "4%",
  marginRight: 15,
  marginTop: 5,
  marginBottom: 5,

},
signupFormTextInput: {
  borderTopColor: "#bfbfbf",
  borderTopWidth: 1,
  borderLeftColor: "#bfbfbf",
  borderLeftWidth: 1,
  borderRightColor: "#bfbfbf",
  borderRightWidth: 1,
  borderBottomColor: "#bfbfbf",
  borderBottomWidth: 1,
  height: 43,
  width : "85%",
  fontSize: 14,
  borderRadius: 0,
  borderWidth: 0,
  backgroundColor: '#fafafa',
  paddingLeft: 10,
  marginLeft: 15,
  marginRight: 15,
  marginTop: 5,
  marginBottom: 5,
  alignSelf : 'center',

},
signupButton: {
  justifyContent : "center",
  backgroundColor: '#ff33cc',
  borderRadius: 5,
  height: 45,
  width : "85%",
  alignSelf : 'center',  
  marginTop: 10,
},

});
