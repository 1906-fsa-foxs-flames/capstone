import React from "react";
import { Text, View } from "react-native";
import styles from "../../variables/styles";
import TopToolBar from "./topToolBar";
import * as firebase from 'firebase';
import { GiftedChat } from 'react-native-gifted-chat';

export default class ChatScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      userId: ''
    }
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    const user = firebase.auth().currentUser;
    const email = user.email.slice(0, user.email.indexOf('@'));
    if (user) {
      this.setState({userName: email, userId: user.uid});
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <TopToolBar navigation={this.props.navigation} tab="Chat" />
        <View style={styles.mainSpace}>
          <Text>Chat</Text>
        </View>
      </View>
    );
  }
}
