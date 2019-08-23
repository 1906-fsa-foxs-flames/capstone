import React from 'react';
import { View } from 'react-native';
import styles from '../../variables/styles';
import TopToolBar from './topToolBar';
import UsersMap from "../UsersMap";

export default class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TopToolBar navigation={this.props.navigation} />
        <UsersMap />
      </View>
    );
  }
}
