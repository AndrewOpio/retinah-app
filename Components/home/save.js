import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  BackHandler,
  TextInput,
  Linking,
  TouchableHighlight,
  ViewPropTypes,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import Button from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import Heading from '../heading';
import PropTypes from 'prop-types';
import Lightbox from 'react-native-lightbox';
import ViewMoreText from 'react-native-view-more-text';
//import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import AsyncStorage from '@react-native-community/async-storage';
import {LocalNotification} from '../services/PushController';
import io from 'socket.io-client';
import Geocoder from 'react-native-geocoding';
import VidPlayer from './VidPlayer';
import Floating from '../button';
import Float from '../button1';
import PopupMenu from '../menu';
import SideMenu from '../SideMenu';
import SideMenuDrawer from '../SideMenuDrawer';

navigator.geolocation = require('@react-native-community/geolocation');

class Saved extends React.Component {
  constructor(props){
    super();
    this.state = {
     page : 'Saved Posts',
     email : '',
     user : '',
     id : 'home',
     paused : true,
     items : [],
     count : 20,
     like : '',
     loading : false,
     data: [],
     isFetching : false,
     propic : [],
     district : 'Kampala',
     circle : [],
     latitude : '',
     longitude : '',
     more : true
   };
  }

  UNSAFE_componentWillMount() { 
    this.fetch();
    this.getPosition();
    BackHandler.addEventListener('hardwareBackPress', this.Back);
  }
 
 
  componentDidMount() {
    this.socket = io("https://retinah.herokuapp.com");

    AsyncStorage.getItem("user", (err, res) => {
    if (res){ 
      this.setState({user : res});
      if(res == "citizen"){

      //Listening to help calls
        AsyncStorage.getItem("email", (err, res) => {
          if (res){ 
            this.socket.on(res+"help", (elem1, elem2) =>{
              LocalNotification(elem1, elem2);
            });
          }})


       AsyncStorage.getItem("location", (err1, res1) => {
        if (res1){ 
          //Listens to notifications
          this.socket.on(res1, (elem1, elem2) =>{
             LocalNotification(elem1, elem2);
          });
         }
       });
     }
    }});
      
    //Listens to new posts
    this.socket.on("post", msg =>{
      this.fetch();
    });

    //Listening to delete
    this.socket.on("delete", msg =>{
      this.fetch();
    });

    //Listens to new new comments from the
    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.socket.on("comment"+res, msg =>{
        this.fetch();
        });
      }
    });
  }
  
  UNSAFE_componentWillUnmount() { 
    //BackHandler.removeEventListener('hardwareBackPress', this.Back);
  }
  
 //Device back button
 Back = () =>{
   BackHandler.exitApp();
   return true;
 }


//Getting user's initial position.
   getPosition = () =>{
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          this.setState({latitude : latitude, longitude : longitude});
        },
        (error) => {
          alert("Please turn on your gps to continue");
        },
        {enableHighAccuracy : false, timeout : 15000, maximumAge : 10000 }
      );   
    }


//Fetching data from the database
 fetch = () =>{
    this.setState({loading : true})
    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        this.setState({email : res});
        fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/home.php',
            //'http://192.168.64.1/RetinahBackend/home.php',
        {
          method : 'post',
          header : {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
          },
          body:JSON.stringify({
            email : res,
            id : this.state.id
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


 
   
//Pausing video when it ends
  onEnd = () => {
    this.setState({paused : true});
  }


  onScroll = () => {
    this.setState({paused : true})
  }
   
  //onRefresh = () =>{
    //this.setState({isFetching : true}, () =>{this.fetch();})
  //}

  //Liking a given post
  likes = (media) =>{
    //this.state.items.push(media);
    AsyncStorage.getItem("email", (err, res) => {
      if (res){ 
        //this.setState({email : res});
        fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/like.php',
         //'http://192.168.64.1/RetinahBackend/like.php',
        {
          method : 'post',
          header : {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
          },
          body:JSON.stringify({
            email : res,
            media : media.id,
            color : media.like,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //alert(responseJson);
          if(responseJson == "Error"){
            //alert("System Error");
          }else{
            this.setState({data : responseJson[0], propic : responseJson[1]});
            }
          })
        .catch((error) => {
        alert(error);
         })
        }
      });
     }

  
    //Deleting post from home
    deletepost = (media) =>{
        fetch('https://agencyforadolescents.org/RetinahBackend/RetinahBackend/deletepost.php',
           //'http://192.168.64.1/RetinahBackend/deletepost.php',
        {
          method : 'post',
          header : {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
          },
          body:JSON.stringify({
            media : media,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //alert(responseJson);
          if(responseJson == "Error"){
            //alert("System Error");
          }else{
           this.socket.emit('delete', {});
           alert("Deleted");
            }
          })
        .catch((error) => {
        alert(error);
      })
    }



//showing more text for a given post
 renderViewMore = (onPress) =>{
   return (
     <Text style = {{color : "#ff33cc", fontSize : 12}} onPress = {onPress}>view more..</Text>
   );
 }

//showing less text for a given post
 renderViewLess = (onPress) =>{
   return (
     <Text style = {{color : "#ff33cc", fontSize : 12}} onPress = {onPress}>view less..</Text>
   );
 }




  render() {
    const { containerStyle, lightboxProps, imageProps, imageStyle, currentMessage, } = this.props;

    return (
    <View style={styles.container}>  
      <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
 
        <Heading title = {this.state.page} show = {() => this._sideMenuDrawer.open()}/>

        <View style = {{borderRadius: 0, borderColor : "#ff33cc", borderWidth : 1, alignItems : "center", marginTop : 5, marginBottom : 5,  marginLeft : 5, marginRight : 5}}><Text style = {{color : "#a6a6a6", fontStyle : "italic"}}>News Feeds</Text></View>
        {this.state.loading == true ? 
        <ActivityIndicator color = "#ff33cc" size = "large" animating = {true} style = {{marginTop : "50%"}}/>:
        /*Looping through all elements in the array*/

        <FlatList 
          style={styles.posts}
          onRefresh={() => this.fetch()}
          refreshing={this.state.isFetching}
          columnWrapperStyle={styles.listContainer}
          data={this.state.data}
          itemSeparatorComponent={()=>{
            return (
              <View style = {styles.separator}/>
             )
            }
          }
          keyExtractor = {(item) => {
            return item.id.toString();
          }}
          renderItem={({item}) => {
            return (
              <View style = {styles.card}>
                <View style = {styles.cardHeader}>
                  <View style = {{width : "100%"}}>
                   <View style ={{flexDirection : "row"}}>

                    <View style = {{flexDirection : "row", marginBottom : 6}}>
                      <Image source = {item.posted_by == "police" ? require('../Resources/police.png') : require('../Resources/logo.png')} style ={{width : 40, height : 40, borderRadius : 20}}/>
                      <View>
                        <Text style = {{ fontSize : 18, marginLeft : 6}}>{item.posted_by == "police" ? "Police" : "Retinah"}</Text>
                        <Text style = {styles.title}>{item.title}</Text>
                      </View>
                    </View>
                    <View style = {{flex : 1, width : "100%", alignItems : "flex-end"}}>
                       <PopupMenu delete = {this.deletepost} id = {item.id}/>
                    </View>
                    </View>

                    <ViewMoreText
                      numberOfLines = {2}
                      renderViewMore = {this.renderViewMore}
                      renderViewLess = {this.renderViewLess}
                    >
                       <Text style = {styles.description}>{item.description}</Text>
                    </ViewMoreText>
                        {item.link != "" ? <Text style = {{color : "blue", fontSize : 13, fontStyle : "italic"}} onPress = {() => Linking.openURL(item.link)}>{item.link}</Text> :<View></View> }
                      <View style = {styles.timeContainer}>
                        <Icon name = "globe" size = {15} style = {{marginTop : 3}}/>
                        <Text style = {styles.time}>{item.date + "  " + item.time}</Text>
                      </View>
                    </View>
                </View>
                {item.type == "image" ? <Lightbox activeProps={{style: styles.imageActive,}} {...lightboxProps}underlayColor = {'#ffffff'}>
                    <Image {...imageProps} style = {styles.cardImage} source = {{uri : item.media}}/>
                </Lightbox> : <VidPlayer video ={item.media}/> }
              <View style = {styles.cardFooter}>
                <View style = {styles.socialBarContainer}>
                  <View style = {styles.socialBarSection}>
                      <TouchableHighlight underlayColor = "#e6e6e6" onPress = {()=>this.likes(item)} style = {styles.socialBarButton}>
                        <View style = {{flexDirection : "row"}}>
                          <Icon name = "thumbs-o-up" size = {20} style = {{color : item.like }}/>
                          <Text style = {styles.socialBarLabel}>{item.lcount}</Text>
                        </View>
                      </TouchableHighlight>
                  </View>

                   <View style = {styles.socialBarSection}>            
                    <TouchableHighlight underlayColor = "#e6e6e6" style = {styles.socialBarButton} onPress = {()=> Actions.comments({media_id : item.id})}>
                      <View style = {{flexDirection : "row"}}>
                        <Icon name = "comment-o" size = {20} />
                        <Text style = {styles.socialBarLabel}>{item.comments}</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
            </View>
             <View style = {{flexDirection : "row", marginTop : 10, marginBottom : 10}}>
                  <TouchableOpacity>
                      <Image style = {styles.image} source = {item.pic == "" ? require('../Resources/avatar.png') : {uri : item.pic}}/>
                  </TouchableOpacity>
                  <View style = {styles.content}>
                      <View style = {styles.contentHeader}>
                          <Text numberOfLines ={1}  style = {styles.name}>{item.fname + "  "+ item.lname}</Text>
                      </View>
                      <ViewMoreText
                        numberOfLines = {1}
                        renderViewMore = {this.renderViewMore}
                        renderViewLess = {this.renderViewLess}
                      >
                        <Text rkType ='primary3 mediumLine' style = {{marginRight : 20}}>{item.msg}</Text>
                      </ViewMoreText>
                  </View>
              </View>
            <View style = {{height : 10, backgroundColor : "#b3b3b3"}}></View>
         </View>
       );
     }}
   />}
  </SideMenuDrawer>
  </View>
    );
  }
}

Saved.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
};
Saved.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    imageStyle: PropTypes.object,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
};


const styles = StyleSheet.create({

  header : {
   marginTop : 11.5,
   marginLeft : 8,
   color : "#ffffff",
   fontSize : 20
  },

  backgroundVideo : {
    
  },
  content : {
    marginLeft : 16,
    marginRight : 10,
    flex : 1,
  },

  contentHeader : {
    flexDirection : "row",
    justifyContent : "space-between",
    marginBottom : 0,
  },

    image : {
      width : 35,
      height : 35,
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
    },

 imageActive: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf : "center",
    borderRadius : 0,
    width: "100%",
    height: 200,
  },

   footer : {
    marginHorizontal: "7.5%",
    alignSelf : "center"
   },

 container : {
   flex : 1,
   marginTop : 0,
   marginBottom : 0
 },
 
  separator : {
      height : 1,
      backgroundColor : "#cccccc",
    },
 
 img : {
   width : 35,
   height : 36,
   borderRadius : 63,
   marginLeft : 10,
   marginRight : 10,
   marginTop : 5

 },

 list : {
   paddingHorizontal : 17,
   backgroundColor : "#E6E6E6",
 },

 separator : {
   marginTop : 10,
 },

 /************card**********/

 card : {
   shadowColor : "#00000021",
   shadowOffset : {
     width : 2,
   },
   shadowOpacity : 0.5,
   shadowRadius : 4,
   marginVertical : 8,
   backgroundColor : "white",
 },

 cardHeader : {
   paddingVertical : 17,
   paddingHorizontal : 16,
   borderTopLeftRadius : 1,
   borderTopRightRadius : 1,
   flexDirection : "row",
   justifyContent : 'space-between',
 },

 cardContent : {
   paddingVertical : 12.5,
   paddingHorizontal : 16,
 },

 cardFooter : {
   flexDirection : "row",
   justifyContent : "space-between",
   paddingTop : 12.5,
   paddingBottom : 25,
   paddingHorizontal : 16,
   borderTopRightRadius : 1,
   borderTopLeftRadius : 1,
   backgroundColor : "#EEEEEE",
 },

 cardImage : {
   borderRadius : 10,
   flex : 1,
   height : 250,
   width : null,
   marginLeft : "0.5%",
   marginRight : "0.5%",
   resizeMode : "cover"
 },

 cardvid : {
   borderRadius : 10,
   flex : 1,
   height : 250,
   width : null,
   marginLeft : "0.5%",
   marginRight : "0.5%"
 },

 /********card components********/

 title : {
   fontSize : 15,
   flex : 1,
   marginLeft : 6
 },

 description : {
   fontSize : 15,
   color : "#888",
   flex : 1,
   marginTop : 5,
   marginBottom : 5,
 },

 posts : {
   marginBottom : 0
 },

 time : {
   fontSize : 13,
   color : "#808080",
   marginTop : 3,
   marginLeft : 5
 },

 icon : {
   width : 25,
   height : 25,
 },

 iconData : {
   width : 15,
   height : 15,
   marginTop : 5,
   marginRight : 5,
 },

 timeContainer : {
   flexDirection : "row",
 },

 /********social bar********/

 socialBarContainer : {
   justifyContent : 'center',
   alignItems : 'center',
   flexDirection : 'row',
   flex : 1,
 },

 socialBarSection : {
   justifyContent : 'center',
   flexDirection : 'row',
   flex : 1,
 },

 socialBarLabel : {
   marginLeft : 8,
 },

 socialBarButton : {
   height : 20,
   borderRadius : 20,
   backgroundColor : "#ffffff",
   flexDirection : 'row',
   height : 30,
   paddingLeft : 10,
   paddingRight : 10,
   justifyContent : 'center',
   alignItems : 'center',
  }
 
 });

export default Saved;
