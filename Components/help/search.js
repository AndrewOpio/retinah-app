/**
* This is the Search file
**/

// React native and others libraries imports
import React, { Component } from 'react';
import {Text, Container, Content, View, Header, Body, Item, Input, Thumbnail, Button, Right, Grid, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {FlatList, StyleSheet, TouchableHighlight,TouchableOpacity, Image, Alert, ActivityIndictor} from 'react-native';
// Our custom files and classes import
import Colors from '../Colors';

export default class Search extends Component {
  constructor(props) {
      super(props);
      this.state = {
        searchText: '',
        items: [],
        loading : false
      };
    }
    search = (text) => {

      this.setState({loading : true});
      fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/search.php',
              //'http://192.168.63.1/RetinahBackend/search.php',
  
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },
  
        body:JSON.stringify({
            text : text,
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
          this.setState({items : responseJson}); 
          // alert(responseJson);
          this.setState({loading : false});
          }    
        })
      .catch((error) => {
        alert("Network Error");
        this.setState({loading : false});
      })
    }

    render() {
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
            <Item style = {{borderRadius : 20}}>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon name="close" size={20} style = {{marginLeft : 13, color : "#8c8c8c"}}/>
              </Button>
              <Input
                placeholder="Search..."
                value={this.state.searchText}
                onChangeText={(text) => this.setState({searchText: text})}
                onSubmitEditing={() => this.search(this.state.searchText)}
                style={{marginTop: 0, paddingLeft : 10}}
              />
              <Icon name="search" size={20} style = {{marginRight : 13, color : "#8c8c8c"}} onPress={() => this.search(this.state.searchText)} />
            </Item>
          </Header>
          {this.state.items.length <=0 && this.state.loading == false ?
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="search" size={30} style={{fontSize: 38, color: '#95a5a6', marginBottom: 7}} />
              <Text style={{color: '#95a5a6'}}>Search for a contact...</Text>
            </View>
            :
            <Content padder>
               {this.renderResult()}
               
            </Content>
          }
      </Container>
    );
  }

  renderResult() {
    return(
      <View style = {{flex : 1, flexDirection :"column"}}>
       <FlatList
          style = {styles.root}
          data = {this.state.items}
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
          const contact = item.item;          
          return (
             <TouchableHighlight underlayColor = "#f2f2f2" onPress ={() => this.Call(contact.status)}>
              <View  style = {styles.container}>
                  <TouchableOpacity onPress = { this.scrolltoend}>
                      <Image style = {styles.image} source = {{uri : contact.logo}}/>
                  </TouchableOpacity >
                  <View style = {styles.content}>
                      <View style = {styles.contentHeader}>
                          <Text style = {styles.name}>{contact.name}</Text>
                           <Icon name = "phone" size = {19}/>
                        </View>
                      <Text rkType ='primary3 mediumLine'>{contact.contact}</Text>
                      <Text rkType ='primary3 mediumLine'>{contact.description}</Text>
                  </View>
              </View>
             </TouchableHighlight>
           );  
        }}
      />
    </View>
    );
  }

  Call = (num) =>{
    RNImmediatePhoneCall.immediatePhoneCall(num);
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
    marginBottom : 6,
  },

  separator : {
    height : 1,
    backgroundColor : "#cccccc",
  },
    
  image : {
    width : 45,
    height : 45,
    marginLeft : 5,
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

