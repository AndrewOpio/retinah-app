
import React from 'react';
import {BacKAndroid, Alert, View, Text, StyleSheet, TouchableOpacity, Image, TouchableHighlight} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FloatingAction} from 'react-native-floating-action';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
navigator.geolocation = require('@react-native-community/geolocation');
import ImagePicker from 'react-native-image-picker';

class Float extends React.Component {
constructor(props){
    super(props);
    this.state = {
     user : '',
     circle : [],
     email : '',
     latitude : '',
     longitude : ''
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
    this.socket = io("https://retinah.herokuapp.com");
  }
  

//Random id generator
messageIdGenerator = () =>{
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c =>{
    let r = (Math.random()* 16) | 0,
    v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


//Function for picking image and sending it
  sendImage = () =>{     
    const options = {
      title : 'Select media',
      takePhotoButtonTitle : "Use Camera",
      chooseFromLibraryButtonTitle: "Choose from Library",
      customButton : [{name : 'image', title : 'take phot0'},{name : 'video', title : 'Take video'}],
      storageOptions : {
        skipBackup : true,
        path : 'images',
      }
    }

  ImagePicker.showImagePicker(options, (response) =>{
    if(response.didCancel){
      //alert('Cancel');
    }else if(response.error){
      alert(response.error);
    }else {
      const source = response.uri;
      var photo = {
      uri : response.uri,
      name :response.fileName,
      type : 'image/jpg',
      }
      var form = new FormData();
      form.append("chatimage", photo);
      form.append("type", "image");
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/chatlink.php',
          //'http://192.168.64.1/RetinahBackend/chatlink.php',
      {
      method : 'post',
      header : {
      'Accept' : 'application/json',
      'Content-type' : 'multipart/form-data',
      },
      body: form,

      })
    .then((response) => response.json())
    .then((responseJson) => {
    // alert(responseJson);
      if(responseJson == "Failed"){
          alert("Error");
      }else{ 
        this.message("police@gmail.com", responseJson, "image");
      }
    })
  .catch((error) => {
    // alert(error);
    }) 
    }   
  });
} 
   

//Function to pick video and send it
   sendVideo = () =>{  
      const options = {
        title : 'Select media',
        mediaType : 'video',
        takePhotoButtonTitle : "Use Camera",
        chooseFromLibraryButtonTitle: "Choose from Library",
        customButton : [{name : 'image', title : 'take phot0'},{name : 'video', title : 'Take video'}],
        storageOptions : {
          skipBackup : true,
          path : 'videos',
        }
     }

    ImagePicker.showImagePicker(options, (response) =>{
      if(response.didCancel){
       // alert('Cancel');
      }else if(response.error){
        alert(response.error);
        
      }else {
        var video = {
          uri : response.uri,
          name : this.messageIdGenerator()+'.mp4',
          type : 'video/mp4',
        }

       var form = new FormData();
       form.append("chatvideo", video);
       form.append("type", "video");

       fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/chatlink.php',
            //'http://192.168.64.1/RetinahBackend/chatlink.php',
       {
       method : 'post',
       header : {
        'Accept' : 'application/json',
        'Content-type' : 'multipart/form-data',
       },
       body: form,

       })
     .then((response) => response.json())
     .then((responseJson) => {
       //alert(responseJson);
       if(responseJson == "Failed"){
         alert("Error");
       }else{ 
          this.message("police@gmail.com", responseJson, "video");
         }
       })
      .catch((error) => {
        alert(error);
       })               
      }
    });
   }

//Sending message on button press
message = (email, msg, type) =>{
  fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/chat.php',
        //'http://192.168.64.1/RetinahBackend/chat.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        sender : this.state.email,
        receiver : email,
        messageid : this.messageIdGenerator(),
        period : new Date(),
        messagetype : type,
        message : msg,
        latitude : this.state.latitude,
        longitude : this.state.longitude,
        circle : "true"
       })
     })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "Error"){
          alert("System Error");
         }else{
           alert("Media Sent");
           this.socket.emit('update', {email : this.state.email});
         }
       })
      .catch((error) => {
        alert(error);
     })
   }


  render(){

      const actions = [
          {
            text : "Image",
            icon : <Icon name = "camera" style = {{color : "white"}}/>,
            name : "image",
            position : 1
          },
          {
            text : "Video",
            icon : <Icon name = "video-camera" style = {{color : "white"}}/>,
            name : "video",
            position : 2
          },
      ];

    return (
        <FloatingAction
           actions={actions}
            onPressItem={ name => {
                if(name == "image"){
                    this.sendImage();
                }else if(name == "video"){
                    this.sendVideo();
                }
            }}
            color={'#ff33cc'}
            showBackground = {false}
            floatingIcon = {<Icon name = "camera" size = {18} style = {{color : "white"}}/>}
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

export default Float;


















































