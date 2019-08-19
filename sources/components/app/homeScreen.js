/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../variables/styles';
import * as firebase from 'firebase';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: ''
        }
    }

    onSignOutPress = () => {
        firebase.auth().signOut();
    }

    onGoBackPress = () => {
        this.props.navigation.navigate('Start');
    }

    render() {
        return (
            <View style={styles.container} >
                <Text>Home Screen</Text>
                <TouchableOpacity onPress={this.onSignOutPress}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onGoBackPress}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }
}