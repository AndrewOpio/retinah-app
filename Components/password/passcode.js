import React, { Component } from "react";
import {TouchableOpacity, Keyboard, Text, View, TextInput, TouchableHighlight, Alert, StyleSheet, ScrollView} from 'react-native';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux'; 
import {Colors, } from 'react-native/Libraries/NewAppScreen';

 class Code extends React.Component {
 constructor(props){
    super();
    this.state = {};
    this.validation = this.validation.bind(this);
  }

 validation(){
     Actions.login(); 
     this.setState({status : 'Logging in...'});
    }


  render() {
    return (
     <ScrollView>
     <View style = {styles.card}>
      <View>
       <Text style={styles.logoText}>Retinah</Text>
      </View>
       <View style={styles.containerView}>
        <Text style = {{textAlign:"center", marginBottom: 5, color: "#808080"}}>Enter email used during sign up</Text>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>

            <TextInput placeholder="Enter Email.." placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true}/>          
            <TouchableHighlight underlayColor = "#f2f2f2" onPress={this.validation} >
                <View style={styles.loginButton}>
                  <Text style = {{textAlign : "center", color : "#ff33cc", marginTop : 11}}>Submit</Text>
                </View>
            </TouchableHighlight>
          </View>
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
  borderTopColor: "black",
  borderTopWidth: 1,
  borderLeftColor: "black",
  borderLeftWidth: 1,
  borderRightColor: "black",
  borderRightWidth: 1,
  borderBottomColor: "black",
  borderBottomWidth: 1,
  height: 43,
  width : "85%",
  fontSize: 14,
  borderRadius: 0,
  borderWidth: 0,
  borderColor: 'black',
  backgroundColor: '#fafafa',
  paddingLeft: 10,
  marginLeft: 15,
  marginRight: 15,
  marginTop: 5,
  marginBottom: 5,
  alignSelf : 'center',

},
loginButton: {
  backgroundColor: '#ffffff',
  borderRadius: 10,
  borderWidth : 2,
  borderColor : "#ff33cc",
  height: 45,
  marginTop: 10,
  width : "85%",
  alignSelf : 'center',
},

});

export default Code;