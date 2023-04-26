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
import Mdal from '../modal'

//User Profile screen

class Edit extends React.Component {
  constructor(props){
    super();

    this.state = {
      email : '',
      code : '',
      firstname : '',
      lastname : '',
      contact : '',
      residence : '',
      gender : '',
      user : '',
      loading : false,
      info : []
    }
  }


  UNSAFE_componentWillMount() {
     AsyncStorage.getItem("user", (err, res) => {
      if (res){ 
        this.setState({user : res});
      }
    });

    AsyncStorage.getItem("email", (err, res) => {
    if (res){ 
      if(this.props.email){
         this.setState({email : this.props.email});
      }else{
         this.setState({email : res});
      }
    edit = ""; 
    email = this.state.email;
    
    fetch(//'https://agencyforadolescents.org/RetinahBackend/RetinahBackend/edit.php',
    'http://192.168.67.1/RetinahBackend/edit.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        email : email,
        edit : edit
      })
    })

    .then((response) => response.json())

    .then((responseJson) => {

        if(responseJson == "Error"){
          alert("System Error");
       }else{
          this.setState({info : responseJson});
       }
    })
    
    .catch((error) => {
      alert('Network Error, check your connection and try again');
    }) 
   }
    })
  }




  edit = () =>{
    email = this.state.email;
    edit = "edit";

    this.setState({loading : true});

    fetch(//'https://agencyforadolescents.org/RetinahBackend/RetinahBackend/edit.php',
     'http://192.168.67.1/RetinahBackend/edit.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
        email : email,
        firstname : this.state.firstname,
        lastname : this.state.lastname,
        contact : this.state.contact,
        residence : this.state.residence,
        gender : this.state.gender,
        edit : edit
      })
    })

    .then((response) => response.json())
    .then((responseJson) => {
        if(responseJson == "Error"){
          alert("System Error");
          this.setState({loading : false});
       }else{
         Alert.alert(
           "Congs",
           "Edited successfully"
           );
           Actions.profile();
          this.setState({loading : false});
       }
    })
    
    .catch((error) => {
      alert("Network Error");
      this.setState({loading : false});
    })
  }


  code = (text) =>{
   if(text != "" && text.length == 10){
    this.setState({code : 1});
   }else{
    this.setState({code : 0});
   }
  }


  render(){
  var code = <View>
         <Text style = {{marginLeft : 5, color : "#bfbfbf"}}>Check messages for confirmation code...</Text>
       <TextInput placeholder="Confirmation code" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}/>
      </View>;
  const { containerStyle, lightboxProps, imageProps, imageStyle, currentMessage, } = this.props;
  return (
    <ScrollView>
      <View style = {styles.container}>
        <TextInput placeholder="First Name" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} defaultValue = {this.state.info.fname} onChangeText = {(text) => this.setState({firstname : text})}/>            
        <TextInput placeholder="Last Name" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} defaultValue = {this.state.info.lname} onChangeText = {(text) => this.setState({lastname : text})}/>
        <TextInput placeholder="Gender" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} defaultValue = {this.state.info.gender} onChangeText = {(text) => this.setState({gender : text})}/>            
        <TextInput placeholder="Email" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} defaultValue = {this.state.info.email} onChangeText = {(text) => this.setState({email : text})}/>
        <TextInput placeholder="Contact" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} defaultValue = {this.state.info.contact} onChangeText = {(text) => this.setState({contact : text})}/>
        <TextInput placeholder="Residence" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} defaultValue = {this.state.info.residence} onChangeText = {(text) => this.setState({residence : text})}/> 
        {this.state.code == 1? code : null}
       <TouchableOpacity block style = {styles.Button}   onPress={this.edit}>
         {this.state.loading == true ? <ActivityIndicator color = "#ff33cc" style ={{alignSelf : "center", color : "#ff33cc"}}/> : <Text style ={{alignSelf : "center", color : "#ff33cc"}}>Save</Text> }
       </TouchableOpacity>
      </View>
    </ScrollView>
   );
 }
}

 Edit.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
};
 Edit.propTypes = {
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
    marginTop : 40
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
    borderWidth : 1
  },
});

  export default Edit;
