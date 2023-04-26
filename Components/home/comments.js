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
  Text,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
  FlatList,
  TextInput,
  AsyncStorage,
  scrollToEnd
} from 'react-native';

import {
  Header,
  Colors,
  
} from 'react-native/Libraries/NewAppScreen';
import Commentbox from './commentbox';
import {Actions} from 'react-native-router-flux';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Comments extends React.Component {
   constructor(){
       super();
       this.state = {
         id : 'comments',
         email : '',
         insert : 'yes',
         load : '',
         user : '',
         comments : []
      }
   }

  UNSAFE_componentWillMount() {
    AsyncStorage.getItem("user", (err, res) => {
      if (res){
         this.setState({user : res})
      }}); 
      this.load();
  }


 componentDidMount(){
    this.socket = io("https://retinah.herokuapp.com");
  }


  load = () =>{
    id = this.state.id;
    media_id = this.props.media_id;
    insert = '';

    fetch(//'https://agencyforadolescents.org/RetinahBackend/RetinahBackend/home.php',
      'http://192.168.67.1/RetinahBackend/home.php',
    {
      method : 'post',
      header : {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      },
      body:JSON.stringify({
         id : id,
         media_id : media_id,
         insert : insert,
      })
    })  
    .then((response) => response.json())
    .then((responseJson) => {
    //alert(responseJson);
      if(responseJson == "Error"){
        // alert("System Error");
      }else if(responseJson == "empty"){
         alert("System Error");

      }else{
          this.setState({comments : responseJson});
        }
     })
    .catch((error) => {
      alert(error);
      console.warn(error);
    })
  }
   
 
  onSend = (msg) => {
    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.setState({email : res});
        id = this.state.id;
        media_id = this.props.media_id;
        fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/home.php',
            //'http://192.168.64.1/RetinahBackend/home.php',
        {
          method : 'post',
          header : {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
          },
          body:JSON.stringify({
              id : id,
              media_id : media_id,
              email : this.state.email,
              insert : this.state.insert,
              comment : msg,
              user : this.state.user
           })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //alert(responseJson);
          if(responseJson == "Error"){
              alert("System Error");
          }else{
            //Actions.comments();
            this.setState({comments : responseJson});
            this.socket.emit('comment', {email : res});
          }
        })
        .catch((error) => {
          alert(error);
        })  
       }
    });
   }

  Chat = (comment) =>{
    AsyncStorage.getItem('email', (err, res) => {
      if (res != comment.email){ 
      Actions.inbox({title : comment.sent_by == "citizen" ? comment.fname +"  "+ comment.lname : comment.sent_by == "police" ? "Police" : "Retinah", sender : res, receiver : comment.email})}        
    });
  }

  render(){
   return (
    <View style = {{flex : 1, flexDirection :"column"}} key = {this.state.key}>
       <FlatList
          ref = {(scroller) => {this.scroller = scroller}}
          style = {styles.root}
          data = {this.state.comments}
          inverted={-1}
          extractData = {this.state}
          ItemSeparatorComponent={()=>{
          return (
            <View style = {styles.separator}/>
              )
            }
          }
          keyExtractor = {(item)=>{
            return item.commentId;
          }}
          renderItem = {(item)=>{
          const comment = item.item;
          
          return (
            <ScrollView ref = {(scroller) => {this.scroller = scroller}}>
              <View  style = {styles.container}>
                  <TouchableOpacity onPress = {()=>this.Chat(comment)}>
                      <Image style = {styles.image} source = {comment.sent_by == "police"  ? require('../Resources/police.png') : comment.sent_by == "retinah"  ? require('../Resources/logo.png') : comment.propic == "" ? require('../Resources/avatar.png') : {uri : comment.propic}}/>
                  </TouchableOpacity>
                  <View style = {styles.content}>
                      <View style = {styles.contentHeader}>
                          <Text numberOfLines ={1}  style = {styles.name}>{comment.sent_by == "police" ? "Police" : comment.sent_by == "retinah" ? "Retinah" : comment.fname + "  "+ comment.lname}</Text>
                          <Text style = {styles.time}>{comment.date +"  "+ comment.time}</Text>
                      </View>
                      <Text rkType ='primary3 mediumLine'>{comment.comment}</Text>
                      
                      <View style = {{flexDirection : "row"}}>
                        <TouchableOpacity>
                          <View style = {{flexDirection : "row"}}>
                            <Text style = {{ fontSize : 15, marginLeft : "0%", color : "#ff33cc"}}>reply</Text>
                            <Icon name = "reply" style = {{marginTop : 5}}/>
                          </View>
                        </TouchableOpacity> 
                      </View>
                  </View>
              </View>
            </ScrollView>
           );  
        }}
      />
      <Commentbox send = {this.onSend}/>
    </View>
   );
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
    marginBottom : 0,
  },

    separator : {
      height : 1,
      backgroundColor : "#cccccc",
    },
    
    image : {
      width : 45,
      height : 45,
      borderRadius : 25,
      marginLeft : 20,
    },

    time : {
      fontSize : 9,
      color : "#808080",
    },
    
    name : {
      fontSize : 14,
      fontWeight : "bold",
      width : "50%"
    },
 
});

export default Comments;
