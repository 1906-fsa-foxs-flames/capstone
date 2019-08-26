import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from '../../variables/styles';
import * as firebase from 'firebase';

export default class TopToolBar extends React.Component {
    constructor() {
        super()
        this.onLogoutPress = this.onLogoutPress.bind(this)
    }

    onLogoutPress = () => {
        firebase.auth().signOut();
        this.props.navigation.navigate('Start');
    }

    render() {
        const user = firebase.auth().currentUser;
        return (
            <View style={styles.toolsBar}>
                <TouchableOpacity onPress={this.onLogoutPress}>
                    <Text style={styles.toolBarButton} >{user ? 'Sign Out' : 'Sign In'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.refreshPage}>
                    <Text style={styles.toolBarButton}>Refresh</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
