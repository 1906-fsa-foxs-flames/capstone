/* eslint-disable linebreak-style */
import React from 'react';
import { View, Platform, Text, KeyboardAvoidingView, YellowBox } from 'react-native';
import styles from '../../variables/styles';
import TopToolBar from './topToolBar';
import * as firebase from 'firebase';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

class Fire {

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  parse = snapshot => {
    const { createdAt: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const createdAt = new Date(numberStamp);
    const message = {
      _id,
      createdAt,
      text,
      user,
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  // close the connection to the Backend
  off() {
    this.ref.off();
  }
}

Fire.shared = new Fire();

export default class ChatScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
      }
    }
    YellowBox.ignoreWarnings(['Setting a timer']);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getInstantDate = this.getInstantDate.bind(this);
    this.renderBubble = this.renderBubble.bind(this)
  }

  componentDidMount() {
    this.getUserInfo();
    Fire.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }

  componentWillUnmount() {
    Fire.shared.off();
  }

  getUserInfo() {
    const user = firebase.auth().currentUser;
    if (user) {
      const email = user.email.slice(0, user.email.indexOf('@'));
      this.setState({ user: {name: email, _id: user.uid }} );
    }
  }

  getInstantDate = () => {
    const date = new Date(Date.now());
    const day =
      (1 + date.getMonth() >= 10
        ? 1 + date.getMonth()
        : '0' + (1 + date.getMonth())) +
      '/' +
      date.getDate() +
      '/' +
      date.getFullYear();
    const time =
      (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) +
      ':' +
      (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()) +
      (date.getHours() >= 12 ? 'PM' : 'AM');
    return <Text> {day + ' ' + time} </Text>
  }
  renderBubble(props) { return ( <Bubble {...props} 
    {...props}
    wrapperStyle={{
      // left: {
      //   backgroundColor: 'white',
      // },
      right: {
        backgroundColor: '#f2a900'
      }
    }} />
    );
  }
  render() {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch', backgroundColor: '#0f61a9' }}
        accessible
        accessibilityLabel="main"
        testID="main"
      >
        <View style={{ flex: 1 }}>
          <TopToolBar
            navigation={this.props.navigation} 
            tab="Chat" />
        </View>
        { Platform.OS === 'android' ?
        <KeyboardAvoidingView
          style={{ flex: 9 }}
          behavior="padding"
        >
          <GiftedChat
            messages={this.state.messages}
            onSend={Fire.shared.send}
            user={this.state.user}
            renderUsernameOnMessage={true}
            // renderTime={this.getInstantDate}
            renderBubble={this.renderBubble}
          />
        </KeyboardAvoidingView>
        : 
        <View
          style={{ flex: 9 }}
        >
          <GiftedChat
            messages={this.state.messages}
            onSend={Fire.shared.send}
            user={this.state.user}
            renderUsernameOnMessage={true}
            // renderTime={this.getInstantDate}
            renderBubble={this.renderBubble}
          />
        </View>
        }
      </View>
    );
  }
}
