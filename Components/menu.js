import React, { Component } from 'react';
//import react in our code.
import { View, Text, TouchableHighlight } from 'react-native';
//import all the components we are going to use.
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
//import menu and menu item
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';

export default class PopupMenu extends Component {
     constructor(props){
        super(props);
        this.state = {
           user : '',
        };
    }
 
  componentWillMount(){
    AsyncStorage.getItem("user", (err, res) => {
      if (res){ 
        this.setState({user : res});
      }
    });
  }



  _menu = null;
  setMenuRef = ref => {
    this._menu = ref;
  };
  showMenu = () => {
    this._menu.show();
  };
  hideMenu = () => {
    this._menu.hide();
  };
  option1Click = () => {
    this._menu.hide();
    this.props.option1Click();
  };
  option2Click = () => {
    this._menu.hide();
    this.props.option2Click();
  };
  option3Click = () => {
    this._menu.hide();
    this.props.option3Click();
  };
  option4Click = () => {
    this._menu.hide();
    this.props.option4Click();
  };
  render() {
    return (
       <View style = {{flexDirection : "row"}}>
        <View>
        <Menu
          ref={this.setMenuRef}
          button={
          <TouchableHighlight underlayColor = "#ffffff" onPress = {this.showMenu} style = {{alignSelf : "flex-end"}}>
           <Icon name = "more-vert" size = {25}/>
          </TouchableHighlight>
          }>
          <MenuItem>Save post</MenuItem>
          <MenuItem>Download media</MenuItem>
          {this.state.user != "citizen" ?
           <MenuItem onPress={() => this.props.delete(this.props.id)}> Delete post</MenuItem> :
           <View></View>}
          <MenuDivider />
        </Menu>
        </View>
        </View>
    );
  }
}