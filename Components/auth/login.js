import React, { PureComponent } from "react";
import {TouchableOpacity, BackHandler, Keyboard, Text, View, TextInput, TouchableHighlight,Image, ScrollView, Alert, AsyncStorage, KeyboardAvoidingView, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux'; 
import {Colors, } from 'react-native/Libraries/NewAppScreen';

 class Login extends PureComponent {
 constructor(props){
    super();
    this.state = {
      email : '',
      password : '',
      entry : '',
      loading : false,
      direct : false
    };
  }

  componentWillMount(){
    //Auto login if you have ever logged in using the same phone
   this.setState({direct : true});

    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        AsyncStorage.getItem("user", (err, res) => {
         if (res == "police"){ 
           Actions.policehome();
           this.setState({direct : false});
         }else if(res == "citizen"){
           Actions.home();
           this.setState({direct : false});
         }else if(res == "retinah"){
            Actions.retinahhome();
            this.setState({direct : false});
        }else if(res == "hospital"){
            Actions.hospitalchat();
            this.setState({direct : false});
          }
        });
      }
    });

    //back TouchableOpacity on the photo
    BackHandler.addEventListener('hardwareBackPress', this.Back);
   }

  componentDidMount(){
    this.setState({direct : false});
  }

  UNSAFE_componentWillUnmount() { 
    BackHandler.removeEventListener('hardwareBackPress', this.Back);
  }


 //Exit app when phone back TouchableOpacity is pressed
 Back = () =>{
   BackHandler.exitApp();
   return true;
 }


 //Authentication on login press
  validation = () =>{ 
    email = this.state.email;
    password = this.state.password;
    if(email != "" && password != ""){
      this.setState({loading : true});
      fetch(//'https://agencyforadolescents.org/RetinahBackend/RetinahBackend/login.php',
     'http://192.168.67.1/RetinahBackend/login.php',
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },

        body:JSON.stringify({
          email : email,
          password : password
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //alert(responseJson);
        if(responseJson == "Failed"){
          Alert.alert(   
          "OOpps..",
          "Wrong Email or Password"
          )          
          this.setState({loading : false})

        }else if(responseJson == "Police"){ 
               
          AsyncStorage.setItem('email', this.state.email);
          AsyncStorage.setItem('user', "police");
          Actions.policehome(); 
          this.setState({loading : false})
          
        } else if(responseJson == "Citizen"){    

          AsyncStorage.setItem('email', this.state.email);
          AsyncStorage.setItem('user', "citizen");
          Actions.home(); 
          this.setState({loading : false})

        }else if(responseJson == "Retinah"){    

          AsyncStorage.setItem('email', this.state.email);
          AsyncStorage.setItem('user', "retinah");
          Actions.retinahhome(); 
          this.setState({loading : false})

        }else if(responseJson == "Hospital"){    

          AsyncStorage.setItem('email', this.state.email);
          AsyncStorage.setItem('user', "hospital");
          Actions.hospitalchat(); 
          this.setState({loading : false})

        } else if(responseJson == "Blocked"){    
           Alert.alert(
             "Sorry",
             "This account has been blocked"
           )
          this.setState({loading : false})
        }          
      })
      .catch((error) => {
        this.setState({loading : false})
        alert(error);
      })
    }else{
      Alert.alert(
        "Hi there",
        "All input fields should be filled"
      )
    }
  }

  
  render() {
    return (
    this.state.direct == false ? 
    <ImageBackground source = {require('../Resources/bg.jpg')} style={styles.containerView}>
    
      <ScrollView>
        <KeyboardAvoidingView style={styles.containerView}>
            <View style={styles.loginScreenContainer}>
              <View style={styles.loginFormView}>
                <Image style = {styles.avatar} source = {require('../Resources/logo.png')}/>
                <Text style={styles.logoText}>Retinah</Text>
                <Text style = {{alignSelf : "center", marginBottom: 30, fontSize:18, color :"#ffffff"}}>your safety companion</Text>
                <TextInput placeholder="Enter Email" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} onChangeText = {(text) => this.setState({email : text})}/>            
                <TextInput placeholder="Enter Password" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true} onChangeText = {(text) => this.setState({password : text})}/>
              
              <TouchableOpacity block style = {styles.loginButton}   onPress={this.validation}>
                {this.state.loading == false ? <Text style ={{ marginTop : "0%",  alignSelf : "center", color : "white"}}>Login</Text> :
                <ActivityIndicator color = "#ffffff"/>}
              </TouchableOpacity>

                <TouchableOpacity onPress={() => Actions.forgot()}>
                    <Text style = {styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                <View style = {styles.available}>
                  <Text style={styles.account}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => Actions.signup()}  style={styles.signup}>
                        <Text style = {{color:'#ff33cc', fontWeight : "bold", fontSize : 15}}>Sign up</Text>
                    </TouchableOpacity>                
                </View> 
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView> 
        </ImageBackground>: <View></View>
    );
  }
}



const styles = StyleSheet.create({
containerView: {
  flex: 1,
  justifyContent : 'center',

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
  color :"#ffffff"
},

 avatar : {
  width : 100,
  height : 100,
  borderRadius : 63,
  borderWidth : 0,
  marginBottom : 10,
  alignSelf : 'center',
  position : 'absolute',
  marginTop : 80,
},

signup: {
 color:'#ff33cc',
 marginLeft : 50,
 marginTop: "4.5%",
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
  alignSelf : "center",
  marginBottom : 10
},

account : {
  marginTop : "5%",
  textAlign: 'center',
  fontSize: 13,
  color : "#ffffff"
},

forgotPassword: {
 color:'#ffffff',
 fontSize : 17,
 textAlign : "center",
 marginTop : "5%"
},

loginFormView: {
  flex: 1
},

loginFormTextInput: {
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
loginButton: {
  justifyContent : "center",
  backgroundColor: '#ff33cc',
  borderRadius: 5,
  height: 45,
  width : "85%",
  alignSelf : 'center',
  marginTop : 10
},

});

export default Login;
