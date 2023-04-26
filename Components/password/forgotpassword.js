import React, { Component } from "react";
import {TouchableOpacity, Keyboard, Text, View, TextInput, TouchableHighlight, Alert, StyleSheet, ScrollView} from 'react-native';
import { Actions } from 'react-native-router-flux'; 
import {Colors, } from 'react-native/Libraries/NewAppScreen';
import {Button} from 'native-base';
 class Forgot extends React.Component<{}> {
 constructor(props){
    super();
    this.state = {
      start : '',
      end : '',
      email : '',
      code : '',
      response : ''

    };
  }

 validation = () =>{
     email = this.state.email;
     code = this.state.code;

    fetch('https://athenian-returns.000webhostap.com/RetinahBackend/RetinahBackend/forgot.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        email : email,
        code : code,
        start : this.state.start,
        end : this.state.end
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
       if(responseJson == "Failed"){
          Alert.alert(
            "Sorry..",
            "Email doesnot exist"
          );
       }else{
         this.setState({response : responseJson});
       }    
      })
    .catch((error) => {
      alert("Disabled");
     })   
    }

  code = () =>{
    this.setState({code : 1});
   }

  render() {
      var code = <View>
                    <Text style = {{textAlign:"center", marginBottom: 5, color : "#808080"}}>Check email for confirmation code...</Text>
                    <TextInput placeholder="Confirmation code" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} onChangeText = {(text)=> {this.setState({code : text, end : text})}}/>
                 </View>;
      var email = <View>
                    <Text style = {{textAlign:"center", marginBottom: 5, color: "#808080"}}>Enter email used during sign up</Text>
                    <TextInput placeholder="Enter Email.." placeholderColor="#c4c3cb" style={styles.loginFormTextInput} onChangeText = {(text)=> {this.setState({email : text, start : text})}}/>
                  </View>;

    return (
     <ScrollView>
      <View>
       <Text style={styles.logoText}>Retinah</Text>
      </View>
       <View style={styles.containerView}>

        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
                {this.state.response == ''? email : code} 
            <Button block style={styles.loginButton}  onPress={this.validation}>
                  <Text style = {{textAlign : "center", color : "#ff33cc"}}>Submit</Text>
            </Button>
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
  marginTop: "0%",
  height: "100%",
  width : "100%",
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
    marginVertical: 50,
    marginHorizontal:20,
    backgroundColor:"white",
    flexBasis: '46%',
    padding: 10,
    flexWrap: 'wrap',
  },

loginScreenContainer: {
  flex: 1,
},
logoText: {
 fontSize: 30,
  fontWeight: "800",
  marginTop: "10%",
  marginBottom: 10,
  textAlign: 'center',
  color: "#ff33cc",
  fontFamily : "helvetica"
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
  backgroundColor : "#e6e6e6",
  height: 43,
  width : "85%",
  fontSize: 14,
  borderRadius: 0,
  borderWidth: 0,
  borderColor: 'black',
  paddingLeft: 10,
  marginLeft: 15,
  marginRight: 15,
  marginTop: 5,
  marginBottom: 5,
  alignSelf : 'center',

},
loginButton: {
  backgroundColor: '#ffffff',
  borderWidth : 2,
  borderColor : "#ff33cc",
  height: 45,
  marginTop: 10,
  width : "85%",
  alignSelf : 'center',
  justifyContent : "center"
},

});

export default Forgot;
