/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TextInput,
  Image,
  Picker,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  ViewPropTypes,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';
import {Button} from 'native-base';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import {Actions} from 'react-native-router-flux';
import PropTypes from 'prop-types';
import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import Heading from '../heading';
import io from 'socket.io-client';


//User Profile screen

class Police extends React.Component {
  constructor(props){
    super();

    this.state = {
      email : '',   
      password : '',
      confirm : '',
      sender : '',
      loading : false
    }
  }


  UNSAFE_componentWillMount() {
     AsyncStorage.getItem("email", (err, res) => {
       if (res){ 
        this.setState({sender : res});
        }
      });
  }
 
 componentDidMount(){
    this.socket = io("https://retinah.herokuapp.com");
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


  add = () =>{
    this.setState({loading : true});

    if(this.state.email != "" && this.state.password != ""){
      if(this.state.password == this.state.confirm){

    email = this.state.email;
    fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/regpolice.php',
     //'http://192.168.64.1/RetinahBackend/regpolice.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        email : this.state.email,
        password : this.state.password,
       })
    })

    .then((response) => response.text())
    .then((responseJson) => {
        //alert(responseJson);
        if(responseJson == "Failed"){
          Alert.alert(
           "Oopps..",
           "Email already exists"
           );         
            this.setState({loading : false});
       }else{
         this.message(this.state.sender, "Hello, welcome to Retinah");
         Alert.alert(
           "Congs",
           "Registered successfully"
           );
           this.setState({loading : false});
        }
    })
    
    .catch((error) => {
      alert(error);
      this.setState({loading : false});
    })
      }else{
      Alert.alert('Oopps..', "Passwords don't match");
      this.setState({loading : false});
    }
    }else{
      Alert.alert('Oopps..', "fill in all required fields");
      this.setState({loading : false});
    }
  }



 type = (value) => {
     this.setState({type : value});
   }

  location = (value) => {
     this.setState({location : value});
   }

  render(){
   const { containerStyle, lightboxProps, imageProps, imageStyle, currentMessage, } = this.props;
  return (
   <ScrollView>
    <View style = {styles.container}>
        <Text style ={{ marginLeft: 5, fontSize : 18, marginTop : 10, fontStyle : "italic"}}>Email:</Text>
        <TextInput placeholder="email (required)" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}  onChangeText = {(text) => this.setState({email : text})}/>            
        <Text style ={{ marginLeft: 5, fontSize : 18, marginTop : 10, fontStyle : "italic"}}>Password:</Text>
        <TextInput placeholder="password (required)" secureTextEntry={true} placeholderColor="#c4c3cb" style={styles.loginFormTextInput}  onChangeText = {(text) => this.setState({password : text})}/>        
        <Text style ={{ marginLeft: 5, fontSize : 18, marginTop : 10, fontStyle : "italic"}}>Confirm Password:</Text>
        <TextInput placeholder="confirm password (required)" secureTextEntry={true} placeholderColor="#c4c3cb" style={styles.loginFormTextInput}  onChangeText = {(text) => this.setState({confirm : text})}/>        

         <Button block style = {styles.Button}   onPress={this.add}>
              {this.state.loading == true ? <ActivityIndicator color = "#ff33cc" style ={{alignSelf : "center", color : "#ff33cc"}}/> : <Text style ={{alignSelf : "center", color : "#ff33cc"}}>Add Account</Text>}
       </Button>
      </View>
    </ScrollView>
   );
 }
}

 Police.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
};
Police.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    imageStyle: PropTypes.object,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
};

 const styles = StyleSheet.create({
  loginFormTextInput : {
      marginTop : 5,
      marginLeft: 5,
      marginRight : 5,
      backgroundColor : "#eaeaea", 
      paddingLeft : 10
    },
    header : {
      backgroundColor: '#ff33cc',
      height : 200,
    },
    
    container : {
    // marginTop : 10
    },

  imageActive: {
    flex: 1,
    resizeMode: 'contain',
    width: "100%",
    height: 200,
    },
    avatar : {
      width : 130,
      height : 130,
      borderRadius : 63,
      borderColor : "#ffffff",
      borderWidth : 4,
      alignSelf : 'center',
      marginTop : 20,
    },
    
    forgotPassword: {
      color:'#ff33cc',
      fontSize : 13,
      textAlign : "center",
      marginTop : "5%"
    },
    
    profButtons :{
      marginTop : 5,
      flexDirection : "row",
      alignSelf : "center"
    },
    
    report : {
    marginLeft : 0,
    },

    name : {
      fontSize : 22,
      color : "blue",
      fontWeight : '600',
    },

    body : {
      marginTop : 30,
      borderRadius : 10,
      marginLeft : "0.5%",
      marginRight : "0.5%",
      backgroundColor : "#eaeaea",
    },

    bodyContent : {
      flex : 1,
      alignItems : 'center',
      padding : 30,
    },

    name : {
      fontSize : 22,
      color : "#000000",
      fontWeight : '600',
      textAlign : 'center',
      marginTop : 15
    }, 

    info : {
      fontSize : 15,
      color : "#000000",
      marginTop : 10,
      textAlign : 'center',
    },

    description : {
      fontSize : 14,
      color : "#000000",
      marginTop : 10,
      paddingLeft : 15

    },

    buttonContainer : {
      marginTop : 10,
      alignSelf : 'center',
      height : 45,
      flexDirection : 'row',
      justifyContent : 'center',
      alignItems : 'center',
      marginBottom : 20,
      width : "40%",
      borderRadius : 30,
      backgroundColor: '#ff33cc',
    },

  Button: {
    backgroundColor: '#ffffff',
    height: 45,
    width : "96%",
    alignSelf : 'center',
    marginTop : 10,
    borderColor : "#ff33cc",
    borderWidth : 1
    },
});

  export default Police;
