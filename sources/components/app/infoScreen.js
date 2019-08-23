import React from 'react';
import { Text, View } from 'react-native';
import styles from '../../variables/styles';
import TopToolBar from './topToolBar'

export default class InfoScreen extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <TopToolBar navigation={this.props.navigation} />
                <View style={styles.mainSpace}>
                Linking.openURL('http://google.com')
                </View>
            </View>
        )
    }
}