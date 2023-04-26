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
import Colors from '../Colors';

export default class Users extends Component {
  constructor(props) {
      super(props);
      this.state = {
        searchText: '',
        items: [],
        loading : false,
        toggle_on : "toggle-on",
        toggle_off : "toggle-off",
        isFetching : false,
        email : '',
        user : ''
      };
    }

    componentWillMount() {
      AsyncStorage.getItem("user", (err, res) => {
      if (res){ 
        this.setState({user : res});
        if(res == "citizen"){
          AsyncStorage.getItem("email", (err, res) => {
            if (res){ 
              this.setState({email : res});
              this.citizenfetch(res);
            }
          });
        }else if(res == "retinah"){
          this.adminfetch();
         }
       }
     });
    }



    componentDidMount() {
      this.socket = io("https://retinah.herokuapp.com");
    }

  
    search = (text) => {
     
      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/users.php',
        //'http://192.168.64.1/RetinahBackend/users.php',
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
        body:JSON.stringify({
           contact : text,
           search : 'yes'
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
              'User not found'
            );
         }else{
         this.setState({items : [responseJson]}); 
          // alert(this.state.items);
          this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }


   citizenfetch = (item) => {
      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/users.php',
          //'http://192.168.64.1/RetinahBackend/users.php',
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
          search : "",
          email : item,
          admin : ""
        })
      })
      .then((response) => response.json())
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
         this.setState({items : responseJson}); 
          // alert(responseJson);
          this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }



   adminfetch = () => {
      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/users.php',
      //'http://192.168.64.1/RetinahBackend/users.php',
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
          search : "",
          admin : "yes"
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
         this.setState({items : responseJson}); 
          // alert(responseJson);
          this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }


  delete = (email) =>{
    this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/admin.php',
        //'http://192.168.64.1/RetinahBackend/admin.php',
  
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
          email : email,
          delete : "yes"
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //alert(responseJson);
         if(responseJson == "Error"){
            this.setState({loading : false});
            Alert.alert(
              'Oopps..',
              'An error has occurred'
            );
         }else{
            this.adminfetch();
            Alert.alert(
              'Done',
              'User deleted'
            );
          // alert(responseJson);
          this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert("Network Error");
        this.setState({loading : false});
      })
    }


    
  //Blocking an account by an admin
  block = (email) =>{
    this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/admin.php',
        //'http://192.168.64.1/RetinahBackend/admin.php',
  
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
          email : email,
          delete : ""
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
       // alert(responseJson);
         if(responseJson == "Error"){
            this.setState({loading : false});
            Alert.alert(
              'Oopps..',
              'An error has occurred'
            );
         }else{
          this.adminfetch();
          // alert(responseJson);
          this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }
    
    //Adding a friend to your circle
    add = (item) =>{
      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/circle.php',
       // 'http://192.168.64.1/RetinahBackend/circle.php',
  
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
          sender : this.state.email,
          receiver : item,
          status : "insert"
        })
      })
      .then((response) => response.text())
      .then((responseJson) => {
       // alert(responseJson);
         if(responseJson == "Error"){
            this.setState({loading : false});
            Alert.alert(
              'Oopps..',
              'An error has occurred'
            );
         }else{
          this.citizenfetch(this.state.email);
          this.socket.emit('circle', {email : this.state.email});
          // alert(responseJson);
          this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert(error);
        this.setState({loading : false});
      })
    }


    render(){
     return(
      <Container style={{backgroundColor: '#fdfdfd'}}>
        <Header
          searchBar
          rounded
          style={{backgroundColor: Colors.navbarBackgroundColor}}
          backgroundColor={Colors.navbarBackgroundColor}
          androidStatusBarColor={Colors.statusBarColor}
          noShadow={true}
        >
            <Item style = {{borderRadius : 0}}>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon name="close" size={20} style = {{marginLeft : 13, color : "#8c8c8c"}}/>
              </Button>
              <Input
                placeholder="Search by contact..."
                value={this.state.searchText}
                onChangeText={(text) => this.setState({searchText: text})}
                onSubmitEditing={ () => this.search(this.state.searchText)}
                style={{marginTop: 0, paddingLeft : 10}}
              />
              <Icon name="search" size={20} style = {{marginRight : 13, color : "#8c8c8c"}} onPress={this.state.searchText != "" && this.state.searchText.length >= 9 ? () => this.search(this.state.searchText) : () => {}} />
            </Item>
          </Header>
          
          {//this.state.loading == true ?
           //<ActivityIndictor color = "#ff33cc" size = "large" style = {{marginTop : "50%"}}/> :

           <View>
              <FlatList
                  style = {styles.root}
                  data = {this.state.items}
                  onRefresh={() => this.fetch()}
                  refreshing={this.state.isFetching}
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
                  const user = item.item;          
                  return (
                    user.email != this.state.email ? <TouchableHighlight underlayColor = "#f2f2f2" onPress ={() => {}}>
                      <View  style = {styles.container}>
                          <TouchableOpacity onPress = {this.state.user == "retinah" ? () => Actions.profile({email : user.email}) : () => {}}>
                              <Image style = {styles.image} source = {user.propic == "" ? require('../Resources/avatar.png') : {uri : user.propic}}/>
                          </TouchableOpacity >
                          <View style = {styles.content}>
                              <View style = {styles.contentHeader}>
                                  <Text style = {styles.name}>{user.fname + " " + user.lname}</Text>
                                  {this.state.user == "retinah" ? <View style = {{flexDirection : "row"}}>
                                  <TouchableOpacity underlayColor = "#f2f2f2" onPress = {() => this.block(user.email)}>
                                    <Icon name = { user.blocked == "n" ? this.state.toggle_off : this.state.toggle_on } size = {19} style ={{marginRight :20}}/>
                                  </TouchableOpacity>
                                  <TouchableOpacity   underlayColor = "#f2f2f2" onPress = {() => this.delete(user.email)}>
                                    <Icon name = "trash-o" size = {19}/>
                                  </TouchableOpacity>
                                  </View> : 
                                  <View style = {{flexDirection : "row"}}>
                                  {user.status == "pending" ? <Icon name = "user-plus" size={22} style = {{color : "red"}}/> :
                                   user.status == "connected" ? <Icon name = "user-plus" size={22} style = {{color : "green"}}/> :
                                    <TouchableOpacity style = {{}} underlayColor = "#f2f2f2" onPress = {() => this.add(user.email)}>
                                      <Icon name = "user-plus" size={22}/>
                                    </TouchableOpacity>}
                                  </View> }
                                </View>
                                <View style = {{flexDirection : "row"}}>
                                  <Icon name = "phone" style ={{marginTop : 5}}/>
                                  <Text rkType ='primary3 mediumLine' numberOfLines = {1} style ={{marginLeft : 8, width : 60}}>{user.contact}</Text>
                                </View>
                                <View style = {{flexDirection : "row"}}>
                                  <Icon name = "globe" style ={{marginTop : 5}}/>
                                  <Text rkType ='primary3 mediumLine' style ={{marginLeft : 8}}>{user.residence}</Text>
                               </View>

                          </View>
                      </View>
                    </TouchableHighlight> : <View></View>
                  );  
                }}
              />
          </View> }
      </Container>
    );
  }

 onRefresh = () =>{
    this.setState({isFetching : true}, () =>{this.fetch();})
  }
 
}

const styles = StyleSheet.create({
  root : {
    backgroundColor : "#ffffff",
    marginTop : 0,
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
    paddingLeft: 19,
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

