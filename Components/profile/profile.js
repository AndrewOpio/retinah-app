
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  ViewPropTypes,
  ActivityIndicator
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Button} from 'native-base';
import {Actions} from 'react-native-router-flux';
import PropTypes from 'prop-types';
import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker'; 
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';

class Profile extends React.Component {
  constructor(props){
    super();

    this.state = {
      email : '',
      image : '',
      data : '',
      user : '',
      loading : false,
      info : []
    }
  }

  UNSAFE_componentWillMount(){
    this.socket = io("https://retinah.herokuapp.com");
     AsyncStorage.getItem("user", (err, res) => {
      if (res){ 
        this.setState({user : res});
      }
    });

   AsyncStorage.getItem("email", (err, res) => {
    if (res){ 
      if(this.props.email){
        this.setState({email : this.props.email, loading : true});
      }else{
        this.setState({email : res, loading : true});
      }

    fetch(//'https://agencyforadolescents.org/RetinahBackend/RetinahBackend/profile.php',
        'http://192.168.67.1/RetinahBackend/profile.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        email : this.state.email,
      })
     })

    .then((response) => response.json())

    .then((responseJson) => {
        if(responseJson == "empty"){
          alert("System Error");
          this.setState({loading : false});      
       }else{
          this.setState({info : responseJson, loading : false});
       }
    })
    
     .catch((error) => {
        alert(error);
        this.setState({loading : false});      
      })
     }
   });
 }
      
//Changing the profile picture            

 profilepic = () =>{
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

      const source = response.uri;
      this.setState({image : source});
   
      var photo = {
        uri : response.uri,
        name :response.fileName,
        type : 'image/jpg',
      }

      var email  = this.state.email;
      
      var form = new FormData();
      form.append("propic", photo);
      form.append("email", email);
           
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/propic.php',
            //'http://192.168.64.1/RetinahBackend/propic.php',
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
       if(responseJson == "Failed"){
            alert("Error");
          }else{ 
            this.setState({info : responseJson});
            this.socket.emit('propic', {text : this.state.info.propic, email : this.state.info.email});
            //this.socket.emit('notification', {district : "Kampala", title : "Alert", message : "hi"});
          //alert(responseJson);       
          }
       })
    .catch((error) => {
      //alert(error);
    }) 
  });
 }

render(){
  const { containerStyle, lightboxProps, imageProps, imageStyle, currentMessage, } = this.props;
  
  return (
    <ScrollView>
      <View style = {styles.container}>
      
        <View style = {{width : 130,  borderRadius : 160, alignSelf : "center", backgroundColor: "#000000", marginTop: 30}}>
            <Lightbox activeProps={{ style: styles.imageActive,}} {...lightboxProps} underlayColor = {'#ffffff'}>
                 <Image {...imageProps} style = {styles.avatar} source = {this.state.info.propic == "" ? require('../Resources/avatar.png') : {uri : this.state.info.propic}}/>
            </Lightbox>
            <TouchableOpacity  onPress = {this.state.user == "citizen" && !this.props.email? this.profilepic : this.state.user == "retinah" ? this.profilepic : () => {alert("Permission denied");} } style = {{ width: 30, position : 'absolute', marginTop : 90, marginLeft : 90}}>
           <View style = {{width : 100}}>
               <Icon name = "camera" size ={25} style = {{ color : "#ff33cc"}}/>
           </View>
           </TouchableOpacity>
        </View>

        <View style = {styles.body}>
            <View styles = {styles.bodyContent}>
            <View style={{flex : 1, marginBottom : 10}}>
              <View style={{flexDirection : "row",  alignSelf : "center"}}>
                <Text style = {styles.name}>{this.state.info.fname +" "+ this.state.info.lname}</Text>
                </View>
                </View>
                <View style = {{flex : 1, flexDirection : "row", marginTop : 8,}}>
                  <Icon name = "phone" size ={19} style = {{paddingLeft : 10}}/>
                  <Text style = {styles.description}>Contact : {this.state.info.contact}</Text>
                </View>
                <View style = {{flex : 1, flexDirection : "row", marginTop : 8,}}>
                  <Icon name = "envelope" size ={19} style = {{ paddingLeft : 10}}/>
                  <Text style = {styles.description}>Email : {this.state.info.email}</Text>
                </View>
                <View style = {{flex : 1, flexDirection : "row", marginTop : 8,}}>
                  <Icon name = "home" size ={19} style = {{paddingLeft : 10}}/>
                  <Text style = {styles.description}>Residence : {this.state.info.residence}</Text>
                </View>
                <View style = {{flex : 1, flexDirection : "row", marginTop : 8,}}>
                  <Icon name = "user" size ={19} style = {{ paddingLeft : 10}}/>
                  <Text style = {styles.description}>Gender : {this.state.info.gender}</Text>
                </View>
               
                {/*<View style = {{flexDirection : "row", alignSelf : "center", marginTop: 20}}>
                    <TouchableOpacity  onPress={() => {}}>
                        <Text style={styles.forgotPassword}>About US</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={this.state.user == "citizen" && !this.props.email? () => Actions.change() : this.state.user == "retinah" ? () => Actions.change({email : this.props.email}) : () => {alert("Permission denied");}} style = {{marginLeft : "20%"}}>
                        <Text style={styles.forgotPassword}>Change Password</Text>
                    </TouchableOpacity>
                </View>*/}
                <View style = {styles.profButtons}>
                  <TouchableOpacity onPress={this.state.user == "citizen" ? () => Actions.home() : this.state.user == "retinah" ? () => Actions.retinahhome() : this.state.user == "police" ? () => Actions.policehome() : () => {}} style = {styles.buttonContainer}>
                    <Icon name = "home" size ={19} style = {{ paddingLeft : 10}}/>
                    <Text style = {{marginLeft : 10}}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style = {styles.btnContainer }  onPress={ this.state.user == "citizen" && !this.props.email? () => Actions.edit() : this.state.user == "retinah" ? () => Actions.edit({email : this.props.email}) : () =>{alert("Permission denied");}}>
                    <Icon name = "edit" size ={19} style = {{ paddingLeft : 10}}/>
                    <Text style = {{marginLeft : 10}}>Edit</Text>
                  </TouchableOpacity>
                </View>
            </View>
        </View>
      </View>
    </ScrollView>
   );
 }
}

 Profile.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
};
 Profile.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    imageStyle: PropTypes.object,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
};
    const styles = StyleSheet.create({
       header : {
         backgroundColor: '#ff33cc',
         height : 200,
       },
    container : {
      height : "100%"
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
       },
       
       forgotPassword: {
          color:'#ff33cc',
          fontSize : 15,
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
         borderRadius : 10,
         backgroundColor: '#ff33cc',
       },

       btnContainer : {
         marginTop : 10,
         alignSelf : 'center',
         height : 45,
         flexDirection : 'row',
         justifyContent : 'center',
         alignItems : 'center',
         marginBottom : 20,
         marginLeft : 5,
         width : "40%",
         borderRadius : 10,
         backgroundColor: '#ff33cc',
       }
    });

  export default Profile;
