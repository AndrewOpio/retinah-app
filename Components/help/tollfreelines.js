import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Heading from '../heading';
import {Button} from 'native-base';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
export default class Contacts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching : false,
      calls: [],
      loading : false
    };
    this.Call = this.Call.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.fetch();
  }
  
  fetch = () =>{

    this.setState({loading : true});
    
    if(this.props.title == "Referrals"){
       type = "ambulances";
    }else if(this.props.title == "Tollfreelines"){
       type = "tollfreelines";
    }
    id = "contacts";
    fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/help.php',
       //'http://192.168.64.1/RetinahBackend/help.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },

      body:JSON.stringify({
          type : type,
          id : id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //alert(responseJson);
       if(responseJson == "Error"){
          alert("System Error");
          this.setState({loading : false});
       }else{
        this.setState({calls : responseJson}); 
        // alert(responseJson);
        this.setState({loading : false});
        }    
      })
    .catch((error) => {
      alert(error);
      this.setState({loading : false});
    })
  }

  onRefresh = () =>{
    this.setState({isFetching : true}, () =>{this.fetch();})
  }

  Call(num){
    RNImmediatePhoneCall.immediatePhoneCall(num);
  }
  
 
  render() {
    return(
      <View style = {{flex : 1, flexDirection :"column"}}>
        {this.state.loading == true ? <ActivityIndicator color = "#ff33cc" size = "large" style = {{marginTop : "50%"}}/> :
        <FlatList
            style = {styles.root}
            data = {this.state.calls}
            extractData = {this.state}
            onRefresh={() => this.fetch()}
            refreshing={this.state.isFetching}
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
                        <Image style = {styles.image} source = {contact.logo == "" ? require('../Resources/avatar.png') : { uri : contact.logo}}/>
                    </TouchableOpacity >
                    <View style = {styles.content}>
                        <View style = {styles.contentHeader}>
                            <Text numberOfLines = {1} style = {styles.name}>{contact.name}</Text>
                            <Icon name = "phone" size = {19}/>
                          </View>
                        <Text rkType ='primary3 mediumLine'>{contact.contact}</Text>
                        <Text rkType ='primary3 mediumLine'>{contact.description}</Text>
                    </View>
                </View>
              </TouchableHighlight>
            );  
        }}
      />}
    </View>
    );
  }
}

const styles = StyleSheet.create({
  Button : {
    height : 25,
    marginLeft : 5,
    marginRight : 5,
    backgroundColor : "#ff33cc",
    marginTop : 5
  },
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
    resizeMode : "contain",
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
    width : 180
  },
 
}); 





