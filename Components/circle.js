/**
* This is the Search file
**/

// React native and others libraries imports
import React, { Component } from 'react';
import {Text, Container, Content, View, Header, Body, Item, Input, Thumbnail, Button, Right, Grid, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import {FlatList, StyleSheet, TouchableHighlight,TouchableOpacity, Image, Alert, ActivityIndictor} from 'react-native';
// Our custom files and classes import

export default class Circle extends Component {
  constructor(props) {
      super(props);
      this.state = {
        searchText: '',
        circle: [],
        requests : [],
        email :'',
        loading : false
      };
    }

    componentWillMount() {
    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.setState({email : res});
        this.pendingfetch(res);
        this.acceptedfetch(res);
       }
     });
    }


   componentDidMount() {
      this.socket = io("https://retinah.herokuapp.com");
      //Listens to new circle adds
      AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.socket.on("circle"+res, msg =>{
           this.pendingfetch(res);
           this.acceptedfetch(res);
        });
       }
    });
  }

    acceptedfetch = (text) => {
      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/circle.php',
            //'http://192.168.64.1/RetinahBackend/circle.php',
  
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
            email : text,
            status : "accepted"
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //alert(responseJson);
         if(responseJson == "Error"){
            this.setState({items : []});
            this.setState({loading : false});
            Alert.alert(
              'Oopps..',
              'Contact not found'
            );
         }else{
           this.setState({circle : responseJson}); 
          // alert(responseJson);
          this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }


//Accepting a connect request
  accept = (text) => {

      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/circle.php',
          //'http://192.168.64.1/RetinahBackend/circle.php',
  
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
            sender : text,
            receiver : this.state.email,
            status : "accept"
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //alert(responseJson);
         if(responseJson == "Error"){
            this.setState({items : []});
            this.setState({loading : false});
            Alert.alert(
              'Oopps..',
              'Contact not found'
            );
         }else{
           this.pendingfetch(this.state.email);
           this.acceptedfetch(this.state.email);          
           this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }


   //Declining a connect request
   decline = (text) => {

      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/circle.php',
          //'http://192.168.64.1/RetinahBackend/circle.php',
  
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
            sender : text,
            receiver : this.state.email,
            status : "decline"
        })
      })
      .then((response) => response.text())
      .then((responseJson) => {
       // alert(responseJson);
         if(responseJson == "Error"){
            this.setState({items : []});
            this.setState({loading : false});
            Alert.alert(
              'Oopps..',
              'Contact not found'
            );
         }else{
           this.pendingfetch(this.state.email);
           this.acceptedfetch(this.state.email);          
           this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }


   //Removing a connection
    remove = (text) => {
      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/circle.php',
          //'http://192.168.64.1/RetinahBackend/circle.php',
  
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
            sender : text,
            receiver : this.state.email,
            status : "remove"
        })
      })
      .then((response) => response.text())
      .then((responseJson) => {
        //alert(responseJson);
         if(responseJson == "Error"){
            
         }else{
           this.pendingfetch(this.state.email);
           this.acceptedfetch(this.state.email);          
           this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }


  //Cancelling a sent request
   cancel = (text) => {
      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/circle.php',
          //'http://192.168.64.1/RetinahBackend/circle.php',
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
        body:JSON.stringify({
            sender : this.state.email,
            receiver : text,
            status : "cancel"
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //alert(responseJson);
         if(responseJson == "Error"){
           
         }else{
           this.pendingfetch(this.state.email);
           this.acceptedfetch(this.state.email);          
           this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }


    //fetching requests sent to a given user
    pendingfetch = (text) => {
      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/circle.php',
            //'http://192.168.64.1/RetinahBackend/circle.php',
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
          email : text,
          status : "pending"
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson == "Error"){
            this.setState({items : []});
            this.setState({loading : false});
            Alert.alert(
              'Oopps..',
              'Contact not found'
            );
         }else{
          this.setState({requests : responseJson}); 
          this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }


    render() {
     return(
      <Container style={{backgroundColor: '#fdfdfd'}}>
           {this.state.circle.length <=0 && this.state.requests.length <=0 && this.state.loading == false ?
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="user" size={30} style={{fontSize: 38, color: '#95a5a6', marginBottom: 7}} />
              <Text style={{color: '#95a5a6', textAlign : "center", width : 200}}>Your emergency contacts will appear here, please add some to your circle...</Text>
            </View>
            :
            <Content padder>
               {this.renderRequests()}
               {this.renderCircle()}
            </Content>
          }
      </Container>
    );
  }


  renderRequests() {
    return(
      this.state.requests.length > 0 ?
      <View style = {{flex : 1, flexDirection :"column"}}>
        <View style={{alignSelf : "center", marginBottom :10}}>
          <Text style = {{textAlign : "center", color : "#404040"}}>Received connect requests</Text>
        </View> 
        <View style = {{height : 1, backgroundColor : "#008080"}}/>
       <FlatList
          style = {styles.root}
          data = {this.state.requests}
          extractData = {this.state}
          ItemSeparatorComponent={()=>{
          return (
            <View style = {styles.separator}/>
              )
            }
          }
          keyExtractor = {(item)=>{
              return item.id;
          }}
          renderItem = {(item)=>{
          const request = item.item;          
          return (
             <TouchableHighlight underlayColor = "#f2f2f2">
               <View  style = {styles.container}>
                  <TouchableOpacity onPress = { this.scrolltoend}>
                      <Image style = {styles.image} source = {request.propic == "" ? require('./Resources/avatar.png')  : {uri : request.propic}}/>
                  </TouchableOpacity>
                  <View style = {styles.content}>
                      <View style = {styles.contentHeader}>
                          <Text style = {styles.name}>{request.fname+ " " +request.lname}</Text>
                          
                        </View>
                       <View style={{flexDirection : "row"}}>
                        <Icon name = "globe" size = {12} style = {{marginTop : 3}}/>
                        <Text rkType ='primary3 mediumLine' style = {{ fontSize : 13, color : "black", marginLeft : 6}}>{request.residence}</Text>
                      </View>
                      <View style = {{flexDirection : "row"}}>
                        <Button onPress = {() => this.accept(request.email)} style = {{marginRight : 15, width : 80, height : 20, backgroundColor : "#ff33cc", marginTop : 5}}>
                            <Text rkType ='primary3 mediumLine'  style = {{fontSize : 11, color : "#ffffff"}}>Accept</Text>
                          </Button>
                          <Button onPress = {() => this.decline(request.email)} style = {{width : 80, height : 20, backgroundColor : "#999999", marginTop : 5}}>
                             <Text rkType ='primary3 mediumLine' style = {{fontSize : 11, color : "#ffffff"}}>Decline</Text>
                          </Button>
                      </View>
                   </View>
               </View>
             </TouchableHighlight>
           );  
        }}
      />
    </View> : <View></View>
    );
  }


renderCircle() {
    return(
       this.state.circle.length > 0 ?
      <View style = {{flex : 1, flexDirection :"column"}}>
      <View style={{alignSelf : "center", marginBottom : 10}}>
        <Text style = {{textAlign : "center", color : "#404040"}}>Connected people and Sent connect requests</Text>
      </View>
        <View style = {{height : 1, backgroundColor : "#008080"}}/>
       <FlatList
          style = {styles.root}
          data = {this.state.circle}
          extractData = {this.state}
          ItemSeparatorComponent={()=>{
          return (
            <View style = {styles.separator}/>
              )
            }
          }
          keyExtractor = {(item)=>{
              return item.id;
          }}
          renderItem = {(item)=>{
          const circle = item.item;          
          return (
             <TouchableHighlight underlayColor = "#f2f2f2">
              <View  style = {styles.container}>
                  <TouchableOpacity onPress = {circle.status == "connected" ? () => Actions.profile({email : circle.email}) : () => {}}>
                      <Image style = {styles.image} source = {circle.propic == "" ? require('./Resources/avatar.png')  : {uri : circle.propic}}/>
                  </TouchableOpacity >
                  <View style = {styles.content}>
                      <View style = {styles.contentHeader}>
                          <Text style = {styles.name}>{circle.fname+ "  " +circle.lname}</Text>
                          <Text rkType ='primary3 mediumLine' style = {{fontSize : 12,marginTop : 2, color : circle.status == "pending" ? "red" : "green"}}>{circle.status == "pending" ? "pending..." : "connected"}</Text>
                        </View>
                      <View style={{flexDirection : "row"}}>
                        <Icon name = "globe" size = {12} style = {{marginTop : 3}}/>
                        <Text rkType ='primary3 mediumLine' style = {{ fontSize : 13, color : "black", marginLeft : 6}}>{circle.residence}</Text>
                      </View>
                      <View style={{flexDirection : "row"}}>
                         <Button onPress = {circle.status == "connected" ? () => Actions.inbox({title : circle.fname + " " + circle.lname, sender : this.state.email, receiver : circle.email}) : () => {}} style = {{marginRight : 15, width : 80, height : 20, backgroundColor : "#ff33cc", marginTop : 5}}>
                             <Text rkType ='primary3 mediumLine' style = {{marginLeft : 8, fontSize : 11, color : "#ffffff", alignSelf : "center"}}>Chat</Text>
                          </Button>
                        {circle.status == "pending" ?
                           <Button  onPress = {() => this.cancel(circle.email)} style = {{width : 80, height : 20, backgroundColor : "#ff33cc", marginTop : 5}}>
                             <Text rkType ='primary3 mediumLine' style = {{fontSize : 11, color : "#ffffff", alignSelf : "center"}}>Cancel</Text>
                          </Button> :
                           <Button onPress = {() => this.remove(circle.email)} style = {{width : 80, height : 20, backgroundColor : "#ff33cc", marginTop : 5}}>
                             <Text rkType ='primary3 mediumLine' style = {{fontSize : 11, color : "#ffffff", alignSelf : "center"}}>Remove</Text>
                          </Button>}
                        </View>
                  </View>
              </View>
             </TouchableHighlight>
           );  
        }}
      />
    </View> : <View></View>
    );
  } 
}

const styles = StyleSheet.create({
  root : {
    backgroundColor : "#ffffff",
    marginTop : 0,
    marginBottom : 30
  },
  header : {
   marginTop : "3%",
   marginLeft : "15%",
   color : "#ffffff",
   fontWeight : "bold"
  },

  avatar : {
   width : 35,
   height : 36,
   borderRadius : 63,
   borderWidth : 4,
   borderColor : "#FFFFFF",
   marginBottom : 10,
   alignSelf : 'center',
   position : 'absolute',
   marginTop : 0 ,
   marginLeft : "1%"
  },

  container : {
    paddingLeft: 1,
    paddingRight : 16,
    paddingVertical : 12,
    flexDirection : "row",
    alignItems : "flex-start",
  },
  
  content : {
    marginLeft : 16,
    flex : 1,
  },

  contentHeader : {
    flexDirection : "row",
    justifyContent : "space-between",
  },

  separator : {
    height : 1,
    backgroundColor : "#cccccc",
  },
    
  image : {
    width : 45,
    height : 45,
    marginLeft : 5,
    borderRadius : 25
  },

  time : {
    fontSize : 11,
    color : "#808080",
  },
  
  name : {
    color:"#008080",
    fontSize : 14,
    fontWeight : "bold",
  },
 
}); 



































































