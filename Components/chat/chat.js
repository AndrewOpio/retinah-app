import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList,
  ViewPropTypes,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Heading from '../heading';
import PropTypes from 'prop-types';
import Lightbox from 'react-native-lightbox';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import Floating from '../button';
import Float from '../button1';
import SideMenu from '../SideMenu';
import SideMenuDrawer from '../SideMenuDrawer';

export default class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page : 'Chats',
      name : '',
      user : '',
      email : '',
      chats: [],
      pchat : [],
      rchat : [],
      loading : false,
      isFetching : false,
    };
  }


 UNSAFE_componentWillMount() {
   this.police();
   this.retinah();
   this.fetch();
  }

 //listening to server for any messages recieved
 componentDidMount(){
   AsyncStorage.getItem("user", (err, res) => {
    if (res){ 
      this.setState({user : res});
    }});
    
   AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.socket = io("https://retinah.herokuapp.com");
        this.socket.on(res, msg =>{
          this.police();
          this.retinah();
          this.reload();
        });

        this.socket.on("sent"+res, msg =>{
          this.police();
          this.retinah();
          this.reload();
        });

        this.socket.on("update"+res, msg =>{
          this.police();
          this.retinah();
          this.reload();
        });
       }
    });
   }
  
  //Reload messages after receiving, sending or reading messages
  reload = () =>{
    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.setState({email : res});
        email = res;
        fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/chats.php',
            //'http://192.168.64.1/RetinahBackend/chats.php',
        {
          method : 'post',
          header : {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
          },

          body:JSON.stringify({
            email : email,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({chats : responseJson})
        })
        .catch((error) => {
          alert(error);
        })
      }
   });
  }


//Fetching chats to display on the chats screen
 fetch = () =>{
    AsyncStorage.getItem("email", (err, res) => {
    if (res){ 
      this.setState({email : res});
      email = res;
      this.setState({loading : true});
      fetch(//'https://agencyforadolescents.org/RetinahBackend/RetinahBackend/chats.php',
          'http://192.168.67.1/RetinahBackend/chats.php',
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },

        body:JSON.stringify({
          email : email,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
    //alert(responseJson);
        this.setState({loading : false});
        this.setState({chats : responseJson})
      })
      .catch((error) => {
        alert(error);
       })
      }
   });
 }

 //Fetching police chats to display on the chats screen
 police = () =>{
    AsyncStorage.getItem("email", (err, res) => {
    if (res){ 
      email = res;
      fetch(//'https://agencyforadolescents.org/RetinahBackend/RetinahBackend/policechat.php',
          'http://192.168.67.1/RetinahBackend/policechat.php',
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },

        body:JSON.stringify({
          email : email,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({pchat : responseJson})
      })
       .catch((error) => {
          // alert(error);
       })
     }
  });
 }


//Fetching chats under retinah 
retinah = () =>{
  AsyncStorage.getItem("email", (err, res) => {
    if (res){       
      email = res;
      fetch(//'https://agencyforadolescents.org/RetinahBackend/RetinahBackend/retinahchat.php',
        'http://192.168.67.1/RetinahBackend/retinahchat.php',
      {
        method : 'post',
        header : {
          'Accept' : 'application/json',
          'Content-type' : 'application/json'
        },

        body:JSON.stringify({
          email : email,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({rchat : responseJson})
      })
      .catch((error) => {
      alert(error);
      })
    }
  });
 }


  
  onRefresh = () =>{
    this.setState({isFetching : true}, () =>{this.fetch();})
  }

  render() {
    return(
     <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
      <View>
       <Heading title = {this.state.page} show = {() => this._sideMenuDrawer.open()}/>
        {this.state.loading == false && this.state.user != "police" && this.state.pchat.name ? <TouchableHighlight underlayColor = "#f2f2f2" onPress = {() => Actions.inbox({title : this.state.pchat.name, sender : this.state.email, receiver : this.state.pchat.email})}>
          <View style = {styles.container}>
              <TouchableOpacity>
                  <Image style = {styles.image} source = {require('../Resources/police.png')}/>
              </TouchableOpacity >
              <View style = {styles.content}>
                  <View style = {styles.contentHeader}>
                      <Text style = {styles.name}>{this.state.pchat.name}</Text>
                      <Text style = {styles.time}>{this.state.pchat.time}</Text>
                    </View>
                <View style = {styles.contentHeader}>
                  <Text rkType ='primary3 mediumLine' numberOfLines ={1} style = {styles.message}>{this.state.pchat.msg}</Text>
                {this.state.pchat.count != 0 ? 
                  <View style = {styles.num}>
                    <Text style ={{color:"white", fontSize : 12}}>{this.state.pchat.count}</Text>
                  </View>: <View></View>}
                </View>
              </View>
            </View>
        </TouchableHighlight>: <View></View> }

       
      <View style = {styles.separator}/> 
       {this.state.loading == true ? <ActivityIndicator color = "#ff33cc" size = "large" style = {{marginTop : "50%"}}/>:
        this.state.chats.length > 0 ?

         <FlatList
          style = {styles.root}
          onRefresh={() => this.fetch()}
          refreshing={this.state.isFetching}
          data = {this.state.chats}
          extractData = {this.state}
          ItemSeparatorComponent={()=>{
            return (
              <View style = {styles.separator}/>
              )
            }
          }
          keyExtractor = {(item)=>{
            return item.id.toString();
          }}
          renderItem = {(item)=>{
          const chats = item.item;
          
          return (
             chats.identity == "citizen" ?
              <TouchableHighlight underlayColor = "#f2f2f2" onPress = {() => Actions.inbox({title : chats.fname + " " + chats.lname, sender : this.state.email, receiver : chats.email})}>
                <View style = {styles.container}>
                    <TouchableOpacity onPress = {this.state.user == "police" || this.state.user == "retinah" ? () => Actions.profile({email : chats.email}) : () => {}}>
                        <Image style = {styles.image} source = {chats.propic == "" ?require('../Resources/avatar.png') : {uri : chats.propic}}/>
                    </TouchableOpacity>
                    <View style = {styles.content}>
                        <View style = {styles.contentHeader}>
                            <Text style = {styles.name}>{chats.fname + " " + chats.lname}</Text>
                            <Text style = {styles.time}>{chats.time}</Text>
                          </View>
                      <View style = {styles.contentHeader}>
                        <Text rkType ='primary3 mediumLine' numberOfLines ={1} style = {styles.message}>{chats.msg}</Text>
                        {chats.count != 0 ? 
                        <View style = {styles.num}>
                          <Text style ={{color:"white", fontSize : 12}}>{chats.count}</Text>
                        </View>: <View></View>}
                      </View>
                    </View>
                  </View>
               </TouchableHighlight> : 

               <TouchableHighlight underlayColor = "#f2f2f2" onPress = {() => Actions.inbox({title : chats.name , sender : this.state.email, receiver : chats.email})}>
                <View style = {styles.container}>
                    <TouchableOpacity onPress = {/*this.state.user == "police" || this.state.user == "retinah" ? () => Actions.profile({email : chats.email}) :*/ () => {}}>
                        <Image style = {styles.image} source = {chats.logo == "" ?require('../Resources/avatar.png') : {uri : chats.logo}}/>
                    </TouchableOpacity >
                    <View style = {styles.content}>
                        <View style = {styles.contentHeader}>
                            <Text style = {styles.name}>{chats.name}</Text>
                            <Text style = {styles.time}>{chats.time}</Text>
                          </View>
                      <View style = {styles.contentHeader}>
                        <Text rkType ='primary3 mediumLine' numberOfLines ={1} style = {styles.message}>{chats.msg}</Text>
                        {chats.count != 0 ? 
                        <View style = {styles.num}>
                          <Text style ={{color:"white", fontSize : 12}}>{chats.count}</Text>
                        </View>: <View></View>}
                      </View>
                    </View>
                  </View>
             </TouchableHighlight> 
          );  
       }}
     /> 
     : <View></View>}
     
      {this.state.loading == false && this.state.user != "retinah" && this.state.rchat.msg ? 
        <TouchableHighlight underlayColor = "#f2f2f2" onPress = {() => Actions.inbox({title : this.state.rchat.name, sender : this.state.email, receiver : this.state.rchat.email})}>         
         <View> 
          <View style = {styles.separator}/>
          <View style = {styles.container}>
              <TouchableOpacity>
                  <Image style = {styles.image} source = {require('../Resources/logo.png')}/>
              </TouchableOpacity >
              <View style = {styles.content}>
                  <View style = {styles.contentHeader}>
                      <Text style = {styles.name}>{this.state.rchat.name}</Text>
                      <Text style = {styles.time}>{this.state.rchat.time}</Text>
                    </View>
                <View style = {styles.contentHeader}>
                  <Text rkType ='primary3 mediumLine' numberOfLines ={1} style = {styles.message}>{this.state.rchat.msg}</Text>
                {this.state.rchat.count != 0 ? 
                  <View style = {styles.num}>
                    <Text style ={{color:"white", fontSize : 12}}>{this.state.rchat.count}</Text>
                  </View>: <View></View>}
                </View>
              </View>
            </View>
            </View>
        </TouchableHighlight>: <View></View> }
        </View>
        <Float/>
       </SideMenuDrawer>
    );
  }
}

Chat.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
};
 Chat.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    imageStyle: PropTypes.object,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
};
const styles = StyleSheet.create({
  
    root : {
     backgroundColor : "#ffffff",
     marginTop : 0,
    },
    
   imageActive: {
      flex: 1,
      resizeMode: 'contain',
      width: "100%",
      height: 200,
    },

  header : {
   marginTop : "3%",
   marginLeft : "15%",
   color : "#ffffff",
   fontWeight : "bold"
  },
 
 message: {
   width : "80%"
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

    num : {
      color :"white",
      paddingLeft : 5,
      paddingRight: 5,
      borderRadius: 20,
      marginRight: 14,
      backgroundColor : "#ff33cc"
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
      borderRadius : 25,
      marginLeft : 5,
    },

    time : {
      fontSize : 11,
      color : "#808080",
      marginRight : 10
    },
    
    name : {
      fontSize : 14,
      fontWeight : "bold",
    },
 
}); 





