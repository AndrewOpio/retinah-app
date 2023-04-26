/**
* This is the SideMenu component used in the navbar
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { ScrollView, LayoutAnimation, UIManager, Linking, Text, Image } from 'react-native';
import { View, List, ListItem, Body, Left, Right,  Item, Input, Button, Grid, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
// Our custom files and classes import
import SideMenuSecondLevel from './SideMenuSecondLevel';
import io from 'socket.io-client';

export default class SideMenu extends Component {
  constructor(props) {
      super(props);
      this.state = {
        id : "home",
        data : [],
        search: "",
        searchError: false,
        subMenu: false,
        email : '',
        user : '',
        info : '',
        subMenuItems: [],
        clickedItem: ''
      };

      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }



UNSAFE_componentWillMount(){
  this.fetch();
   // this.socket = io("https://retinah.herokuapp.com");
     AsyncStorage.getItem("user", (err, res) => {
      if (res){ 
        this.setState({user : res});
      }
    });
  }

  fetch = () => {
    AsyncStorage.getItem("email", (err, res) => {
    if (res){ 
      this.setState({email : res, loading : true});

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
       }else{
          this.setState({info : responseJson, loading : false});
       }
    })
    .catch((error) => {
      alert(error);
     })
     }
    });
  }

  componentDidMount() {
    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.socket = io("https://retinah.herokuapp.com");
        this.socket.on("propic"+res, msg =>{
          this.fetch();
        });
       }
    });
  }
  

//Fetching lost and found from the database
 LostandFound = () =>{
    this.setState({loading : true})
    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.setState({email : res});
        fetch(//'https://agencyforadolescents.org/RetinahBackend/RetinahBackend/home.php',
            'http://192.168.67.1/RetinahBackend/home.php',
        {
          method : 'post',
          header : {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
          },
          body:JSON.stringify({
            email : res,
            id : this.state.id,
            category : "lost"
          })
        })  
        .then((response) => response.json())
        .then((responseJson) => {
            //alert(responseJson);
          if(responseJson == "Error"){
              this.setState({loading : true})
          }else{
          //alert(responseJson);
            this.setState({data : responseJson[0], propic : responseJson[1]});
            this.setState({loading : false})
          }
        })
        .catch((error) => {
          this.setState({loading : false})
          alert(error);
        })
      }else{
        alert("failed");
      }
   });
 }


//Fetching missing person from the database
 MissingPerson = () =>{
    this.setState({loading : true})
    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.setState({email : res});
        fetch(//'https://agencyforadolescents.org/RetinahBackend/RetinahBackend/home.php',
            'http://192.168.67.1/RetinahBackend/home.php',
        {
          method : 'post',
          header : {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
          },
          body:JSON.stringify({
            email : res,
            id : this.state.id,
            category : "missing"
          })
        })  
        .then((response) => response.json())
        .then((responseJson) => {
           // alert(responseJson);
          if(responseJson == "Error"){
              this.setState({loading : true})
          }else{
          //alert(responseJson);
            this.setState({data : responseJson[0], propic : responseJson[1]});
            this.setState({loading : false})
          }
        })
        .catch((error) => {
          this.setState({loading : false})
          alert(error);
        })
      }else{
        alert("failed");
      }
   });
 }

  logout = () =>{
    AsyncStorage.removeItem("email", (err, res) => { 
    });
    AsyncStorage.removeItem("user", (err, res) => { 
    });
   Actions.popTo('login');
  }

  
  render() {
    
    return(
      <ScrollView style={styles.container}>
          {this.renderMenu()}
      </ScrollView>
    );
  }

  renderMenu() {

    if(!this.state.subMenu) {
      return(
        <View>
        <View style = {{backgroundColor : "#ff33cc"}} >
        <Image  style = {styles.img} source = {this.state.info.propic ? {uri : this.state.info.propic} : this.state.user == "retinah" ? require('./Resources/logo.png') : this.state.user == "police" ? require('./Resources/police.png') : require('./Resources/avatar.png')}/>
          <View style={{paddingRight: 15}}>
            <List>
              <ListItem
                icon
                key={0}
                button={true}
              >
                <View style = {{alignItems : "center"}}>
                  <Text style = {{fontSize : 19, color : "white"}}>{this.state.user == "retinah" ? "Retinah" : this.state.user == "police" ? "Police" : this.state.user == "hospital" ? "Hospital" : this.state.info.fname + " " + this.state.info.lname}</Text>
                </View>
                
              </ListItem>
            </List>
          </View>
          </View>
          <View style={styles.line} />
          <View style={{paddingRight: 15}}>
            <List>
              {this.renderSecondaryList()}
            </List>
          </View>
          <View style={styles.line} />
          <View style={{paddingRight: 15, paddingLeft: 15}}>
            <Text style={{marginBottom: 7}}>Follow us</Text>
            <Grid>
              <Col style={{alignItems: 'center'}}><Icon style={{fontSize: 18}} name='facebook' onPress={() => Linking.openURL('http://www.facebook.com/').catch(err => console.error('An error occurred', err))} /></Col>
              <Col style={{alignItems: 'center'}}><Icon style={{fontSize: 18}} name='instagram' onPress={() => Linking.openURL('http://www.instagram.com/').catch(err => console.error('An error occurred', err))} /></Col>
              <Col style={{alignItems: 'center'}}><Icon style={{fontSize: 18}} name='twitter' onPress={() => Linking.openURL('http://www.twitter.com/').catch(err => console.error('An error occurred', err))} /></Col>
              <Col style={{alignItems: 'center'}}><Icon style={{fontSize: 18}} name='youtube' onPress={() => Linking.openURL('http://www.youtube.com/').catch(err => console.error('An error occurred', err))} /></Col>
              <Col style={{alignItems: 'center'}}><Icon style={{fontSize: 18}} name='snapchat' onPress={() => Linking.openURL('http://www.snapchat.com/').catch(err => console.error('An error occurred', err))} /></Col>
            </Grid>
          </View>
        </View>
      );
    }
    else {
      return(
        <SideMenuSecondLevel back={this.back.bind(this)} title={this.state.clickedItem} menu={this.state.subMenuItems} />
      );
    }
  }


  
  renderSecondaryList() {
    let secondaryItems = [];
    menusSecondaryItems.map((item, i) => {
      if(this.state.user != "citizen" &&this.state.user != "retinah" && (item.key != "profile" && item.key != "circle")){
      secondaryItems.push(
        <ListItem
          last
          icon
          key={item.id}
          button={true}
          onPress={ item.key == "profile" ? () =>Actions.profile() : item.key == "circle" ? () => Actions.circle() :
           item.key == "chat" ? () => Actions.inbox({title : "Retinah", sender : this.state.email, receiver : "retinahapp@gmail.com"}) :
           item.key == "sign-out" ? this.logout : () =>{} 
          }
        >  
          <Left style={{width : 40}}>
            <Icon style={{fontSize: 15}} size = {20} name={item.icon} style = {{color : "#ff33cc"}}/>
          </Left>
          <Body style={{marginLeft: 0}}>
            <Text style={{fontSize: 18}}>{item.title}</Text>
          </Body> 
        </ListItem>
       );
      }else if(this.state.user == "citizen"){
        secondaryItems.push(
        <ListItem
          last
          icon
          key={item.id}
          button={true}
          onPress={item.key == "lost" ? () =>{
               this.LostandFound();
               Actions.home({data : this.state.data})
            
            }: item.key == "missing" ? () =>{
              this.MissingPerson();
              Actions.home({data : this.state.data})
              
            } :item.key == "saved" ? () =>Actions.saved() : item.key == "profile" ? () =>Actions.profile() : item.key == "circle" ? () => Actions.circle() :
           item.key == "chat" ? () => Actions.inbox({title : "Retinah", sender : this.state.info.email, receiver : "retinahapp@gmail.com"}) :
           item.key == "sign-out" ? this.logout : () =>{} 
          }
        >  
          <Left style={{width : 40}}>
            <Icon style={{fontSize: 15}} size = {20} name={item.icon} style = {{color : "#ff33cc"}}/>
          </Left>
          <Body style={{marginLeft: 0}}>
            <Text style={{fontSize: 18}}>{item.title}</Text>
          </Body> 
        </ListItem>
       );
      }else if(this.state.user == "retinah" && ( item.key != "chat" && item.key != "profile" && item.key != "circle")){
        secondaryItems.push(
        <ListItem
          last
          icon
          key={item.id}
          button={true}
          onPress={item.key == "missing" ? this.Missing : item.key == "profile" ? () =>Actions.profile() : item.key == "circle" ? () => Actions.circle() :
           item.key == "chat" ? () => Actions.inbox({title : "Retinah", sender : this.state.info.email, receiver : "retinahapp@gmail.com"}) :
           item.key == "sign-out" ? this.logout : () =>{} 
          }
        >  
          <Left style={{width : 40}}>
            <Icon style={{fontSize: 15}} size = {20} name={item.icon} style = {{color : "#ff33cc"}}/>
          </Left>
          <Body style={{marginLeft: 0}}>
            <Text style={{fontSize: 18}}>{item.title}</Text>
          </Body> 
        </ListItem>
       );
      }
    });
    return secondaryItems;
  }

}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd'
  },

  img : {
   width : 85,
   height : 86,
   borderRadius : 63,
   marginLeft : 10,
   marginTop : 5,
   backgroundColor : "white",
   alignSelf : "center"
 },

  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(189, 195, 199, 0.6)',
    marginTop: 10,
    marginBottom: 10
  }
};

var menuItems = [];

const menusSecondaryItems = [
      {
        id: 191,
        title: 'Missing Persons',
        icon: 'user',
        key: 'missing'
      },
      {
        id: 192,
        title: 'Lost and Found',
        icon: 'map',
        key: 'lost'
      },
      {
        id: 193,
        title: 'Saved Posts',
        icon: 'save',
        key: 'saved'
      },
      {
        id: 190,
        title: 'Profile',
        icon: 'user',
        key: 'profile'
      },
      {
        id: 519,
        title: 'Circle',
        icon: 'users',
        key: 'circle'
      },
      {
        id: 1,
        title: 'Settings',
        icon: 'gear',
        key: 'settings'
      },
      {
        id: 19,
        title: 'About Retinah',
        icon: 'question-circle',
        key: 'about'
      },
      
      {
        id: 20,
        title: 'Leave feedback',
        icon: 'comment',
        key: 'chat'
      },
      {
        id: 21,
        title: 'Help',
        icon: 'exclamation-circle',
        key: 'help'
      },
      {
        id: 22,
        title: 'Sign-out',
        icon: 'sign-out',
        key: 'sign-out'
      },
    ];

