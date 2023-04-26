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
import Floating from '../button';
import SideMenu from '../SideMenu';
import SideMenuDrawer from '../SideMenuDrawer';


//User Profile screen

class Notify extends React.Component {
  constructor(props){
    super();

    this.state = {
      page : 'Notify',
      email : '',
      title : '',
      message : '',
      location : '',
      type : '',
      link : '',
      user : '',
      loading : false
    }
  }


  UNSAFE_componentWillMount() {
     AsyncStorage.getItem("user", (err, res) => {
      if (res){ 
        this.setState({user : res});
      }
    });
  }
 
 componentDidMount(){
    this.socket = io("https://retinah.herokuapp.com");
 }

  notify = () =>{
    this.setState({loading : true});

    if(this.state.title != "" && this.state.message != "" && this.state.location != "" && this.state.type != ""){
    email = this.state.email;
    edit = "edit";
    fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/notify.php',
     //'http://192.168.63.1/RetinahBackend/notify.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        title : this.state.title,
        message : this.state.message,
        location : this.state.location,
        code : this.state.type,
        link : this.state.link
       })
    })

    .then((response) => response.json())
    .then((responseJson) => {
          //alert(responseJson);

        if(responseJson == "Error"){
          alert("System Error");
          this.setState({loading : false});
       }else{
         if(this.state.type == "#FF0000"){
           this.socket.emit('notification', {title : "Alert", message : this.state.title, district : this.state.location});
         }
         Alert.alert(
           "Congs",
           "Sent successfully"
           );
           this.setState({loading : false});
        }
    })
    
    .catch((error) => {
      alert(error);
      this.setState({loading : false});
    })
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
  <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
   <View style ={{height : "100%"}}>
   <ScrollView>
    <View style = {styles.container}>
        <Heading title = {this.state.page} show = {() => this._sideMenuDrawer.open()}/>
        <Text style ={{ marginLeft: 5, fontSize : 18, marginTop : 10, fontStyle : "italic"}}>Title:</Text>
        <TextInput placeholder="title (required)" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}  onChangeText = {(text) => this.setState({title : text})}/>            
        <Text style ={{ marginLeft: 5, fontSize : 18, marginTop : 10, fontStyle : "italic"}}>Message:</Text>
        <TextInput placeholder="message (required)" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}  onChangeText = {(text) => this.setState({message : text})}/>
        <Text style ={{ marginLeft: 5, fontSize : 18, marginTop : 10, fontStyle : "italic"}}>Link:</Text>
        <TextInput placeholder="link (optional)" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}  onChangeText = {(text) => this.setState({link : text})}/>            
        <Text style ={{ marginLeft: 5, fontSize : 18, marginTop : 10, fontStyle : "italic"}}>Type:</Text>
        
        <View style={styles.loginFormTextInput}>
          <Picker selectedValue = {this.state.type}
              onValueChange={this.type}
            >
              <Picker.Item label = "Type" value = ""/>
              <Picker.Item label = "Alert" value = "#FF0000"/>
              <Picker.Item label = "Normal" value = "#FF33CC"/>
          </Picker>
          </View>  
        
        <Text style ={{ marginLeft: 5, fontSize : 18, marginTop : 10, fontStyle : "italic"}}>Location:</Text>
        <View style={styles.loginFormTextInput}>
          <Picker selectedValue = {this.state.location}
              onValueChange={this.location}
            >
              <Picker.Item label = "District" value = ""/>
              <Picker.Item label = "Kampala" value = "Kampala"/>
              <Picker.Item label = "Wakiso" value = "Wakiso"/>
              <Picker.Item label = "Mukono" value = "Mukono"/>
              <Picker.Item label = "Jinja" value = "Jinja"/>
              <Picker.Item label = "Masaka" value = "Masaka"/>

          </Picker>
          </View>  
                {this.state.code == 1? code : null}
         <TouchableOpacity block style = {styles.Button}   onPress={this.notify}>
              {this.state.loading == true ? <ActivityIndicator color = "#ff33cc" style ={{alignSelf : "center", color : "#ff33cc"}}/> : <Text style ={{alignSelf : "center", color : "#ff33cc"}}>Notify</Text>}
       </TouchableOpacity>
      </View>
    </ScrollView>
  {this.state.user != "retinah"  ? <View></View> : <Floating/>}
    </View>
  </SideMenuDrawer>

   );
 }
}

 Notify.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
};
Notify.propTypes = {
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
        justifyContent : "center",
	      backgroundColor: '#ffffff',
	      height: 45,
	      width : "96%",
	      alignSelf : 'center',
        marginTop : 10,
        borderColor : "#ff33cc",
        borderWidth : 1,
	    },
    });

  export default Notify;
