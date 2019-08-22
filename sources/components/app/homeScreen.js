import React from 'react';
import { View } from 'react-native';
import UsersMap from '../UserLocation';
import styles from '../../variables/styles';
import TopToolBar from './topToolBar';

import LogIn from "../auth/signInScreen";
import CamTest from "../camera/camera";

import UsersMap from "../UsersMap";

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TopToolBar navigation={this.props.navigation} />
        <UsersMap />
      </View>
    );
  }
}
