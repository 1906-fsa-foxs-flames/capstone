import React from 'react';
import { View } from 'react-native';
import UsersMap from '../UserLocation';
import styles from '../../variables/styles';
import TopToolBar from './topToolBar';

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TopToolBar navigation={this.props.navigation} />
        <UsersMap />
      </View>
    );
  }
}
