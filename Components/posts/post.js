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
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  ViewPropTypes,
  AsyncStorage,
  ActivityIndicator
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
import ImagePicker from 'react-native-image-picker'; 
import io from 'socket.io-client';
import Floating from '../button';
import SideMenu from '../SideMenu';
import SideMenuDrawer from '../SideMenuDrawer';

//User Profile screen

class Post extends React.Component {
  constructor(props){
    super();

    this.state = {
      page : "Post",
      title : '',
      description : '',
      link : '',
      user : '',
      imgloading : false,
      vidloading : false
    }
  }


  UNSAFE_componentWillMount() {
      AsyncStorage.getItem("user", (err, res) => {
        if (res){ 
          this.setState({user : res});
        }
     });
  }

  componentDidMount() {
    this.socket = io("https://retinah.herokuapp.com");
  }

 messageIdGenerator = () =>{
       return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c =>{
         let r = (Math.random()* 16) | 0,
         v = c == "x" ? r : (r & 0x3) | 0x8;
         return v.toString(16);
       });
     }


image = () =>{
   if(this.state.title != "" && this.state.description != ""){
   const options = {
      title : 'Choose image',
      //mediaType: 'video',
      customButton : [{name : 'fb', title : 'Choose photo'}],
      storageOptions : {
        skipBackup : true,
        path : 'images',
      }
    }

    ImagePicker.showImagePicker(options, (response) =>{
      if(response.didCancel){
        // alert('Cancel');
       }else if(response.error){
         //alert(response.error);
       }else {
 
      var image = {
        uri : response.uri,
        name :response.fileName,
        type : 'image/jpg',
      }     
      var form = new FormData();
      form.append("image", image);
      form.append("type", "image");
      form.append("title", this.state.title);
      form.append("description", this.state.description);
      form.append("link", this.state.link);
      form.append("user", this.state.user);

      this.setState({imgloading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/post.php',
           //'http://192.168.64.1/RetinahBackend/post.php',
      {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'multipart/form-data',
      },
      body: form,

      })
    .then((response) => response.text())
    .then((responseJson) => {
        //alert(responseJson);       

       if(responseJson == "Failed"){
            alert("Error");
            this.setState({imgloading : false});
          }else{ 
            //this.setState({info : responseJson});
            //this.socket.emit('propic', {text : this.state.info.propic, email : this.state.info.email});
            this.socket.emit('post', {});
            this.setState({imgloading : false});
            Alert.alert("Congs", "Posted..");       
          }
       })
    .catch((error) => {
      //alert(error);
          this.setState({imgloading : false});
    })
    }  
   });
   }else{
     Alert.alert('Oopps..', "fill in all required fields");
   }
 }

video = () =>{
  if(this.state.title != "" && this.state.description != ""){
   const options = {
      title : 'Choose video',
      mediaType: 'video',
      customButton : [{name : 'fb', title : 'Choose photo'}],
      storageOptions : {
        skipBackup : true,
        path : 'images',
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
       form.append("video", video);
       form.append("type", "video");
       form.append("title", this.state.title);
       form.append("description", this.state.description);
       form.append("link", this.state.link);
       form.append("user", this.state.user);

       this.setState({vidloading : true});

       fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/post.php',
           //'http://192.168.63.1/RetinahBackend/post.php',
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
            this.setState({vidloading : false});
          }else{ 
            this.socket.emit('post', {});
            Alert.alert("Congs", "Posted..");
            this.setState({vidloading : false});
          }       
       })
    .catch((error) => {
     // alert(error);
           this.setState({vidloading : false});
       }) 
      }        
    });

   }else{
     Alert.alert('Oopps..', "fill in all required fields");
   }
 }
  


  code = (text) =>{
   if(text != "" && text.length == 10){
    this.setState({code : 1});
   }else{
    this.setState({code : 0});
   }
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
        <Text style ={{ marginLeft: 5, fontSize : 18, marginTop : 10, fontStyle : "italic"}}>Description:</Text>
        <TextInput placeholder="description (required)" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}  onChangeText = {(text) => this.setState({description : text})}/>
        <Text style ={{ marginLeft: 5, fontSize : 18, marginTop : 10, fontStyle : "italic"}}>Link:</Text>
        <TextInput placeholder="link (optional)" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}  onChangeText = {(text) => this.setState({link : text})}/>            
        <View style = {{flexDirection : "row", marginBottom : 10, marginTop : 20}}>
         <TouchableOpacity block style = {styles.Button1}  onPress={this.image}>
          {this.state.imgloading == true ? <ActivityIndicator color = "#ff33cc" style ={{alignSelf : "center", color : "#ff33cc"}}/> : <Text style ={{alignSelf : "center", color : "#ff33cc"}}>Post with image</Text>}
         </TouchableOpacity>
         <TouchableOpacity block style = {styles.Button1}  onPress={this.video}>
          {this.state.vidloading == true ? <ActivityIndicator color = "#ff33cc" style ={{alignSelf : "center", color : "#ff33cc"}}/> : <Text style ={{alignSelf : "center", color : "#ff33cc"}}>Post with video</Text>}
         </TouchableOpacity>
         </View>
      </View>

      </ScrollView>
     {this.state.user != "retinah"  ? <View></View> : <Floating/>}
      </View>
      </SideMenuDrawer>
   );
 }
}

 Post.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
};
 Post.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    imageStyle: PropTypes.object,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
};
    const styles = StyleSheet.create({
	loginFormTextInput : {
           	  width : "97%",

           marginTop : 5,
           marginLeft: 5,
         backgroundColor : "#eaeaea", 
           paddingLeft : 10
	},

  loginFormTextInput1 : {
           	  width : "84%",

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
          borderWidth : 1,
          marginTop :10
	},
  Button1: {
    justifyContent : "center",
	  backgroundColor: '#ffffff',
	  height: 45,
	  width : "45%",
	  alignSelf : 'center',
          borderColor : "#ff33cc",
          borderWidth : 1,
          marginLeft : "3%"
	},
    });

  export default Post;
