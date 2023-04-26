/**
* This is the SideMenuSecondLevel component used in the submenu
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { ScrollView, TouchableHighlight, Text } from 'react-native';
import { View, Button, ListItem, List, Body, Right, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';

// Our custom files and classes import

export default class SideMenuSecondLevel extends Component {
  render() {
    return(
      <View>
        <View style={styles.header}>    
         <TouchableHighlight  onPress={() => this.props.back()} underlayColor = "#eaeaea">
          <Icon name='ios-arrow-back' style={{fontSize: 20, marginTop: 4, paddingLeft : 10, paddingRight : 10}}/>
         </TouchableHighlight>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{textAlign: 'center', fontSize: 15, color : "#00b300"}}>{this.props.title}</Text>
          </View>
        </View>
        <View style={{paddingRight: 15}}>
          <List>
            {this.renderMenuItems()}
          </List>
        </View>
      </View>
    );
  }

  renderMenuItems() {
    let items = [];
    this.props.menu.map((item, i) => {
      items.push(
        <ListItem
          last={this.props.menu.length === i+1}
          icon
          key={item.id}
          button={true}
          onPress={() => this.itemClicked(item)}
        >
          <Body>
            <Text style = {{fontSize : 13}}>{item.title}</Text>
          </Body>
          <Right>
            <Icon name="ios-arrow-forward" />
          </Right>
        </ListItem>
      );
    });
    return items;
  }

  itemClicked(item) {
      if(item.title == "MISSING PERSONS"){
        Actions.home();
      }else if(item.title == "LOST AND FOUND"){
        Actions.home();
      }       
   }
}

const styles={
  header: {
    flex: 1,
    flexDirection: 'row',
    padding: 15
  }
};
