/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Commentbox extends React.Component {
 constructor(props){
  super();
  this.state = {
    msg : '',
    default : ''
  }
}
 
  render(){    
      return (
        <View style = {{backgroundColor : "#ffffff", height : 70}}>
          <View style = {{  flexDirection : "row" }}>
            <TextInput placeholder="Comment..." placeholderColor="#c4c3cb" value = {this.state.msg} onChangeText = {(text) => this.setState({msg : text})} style = {{backgroundColor : "#EEEEEE", borderRadius : 25, marginTop : 10, width : "85%", marginLeft : "2%", paddingLeft : 15 }} multiline = {true}/>
            <View style = {{flexDirection : "row", marginLeft :"2%", marginTop : "5%"}}>
                <TouchableOpacity  onPress = {() => {
                  if(this.state.msg == ""){

                  }else{
                    this.props.send(this.state.msg);
                    this.setState({msg : ''});
                  }
                }}>
                  <Icon name = "send" size = {30} style ={{color : "#ff33cc"}}/>
                </TouchableOpacity>
              </View>
          </View>
        </View>
    );
  }
}


const styles = StyleSheet.create({

});

export default Commentbox;