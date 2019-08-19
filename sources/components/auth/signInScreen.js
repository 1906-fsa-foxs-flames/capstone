/* eslint-disable no-return-assign */
/* eslint-disable linebreak-style */
/* eslint-disable no-extra-semi */
/* eslint-disable eol-last */
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../../variables/styles';
import * as firebase from 'firebase';

export default class SignInScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    onSignInPress = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then( () => {

        }, (error) => {
            Alert.alert(error.message);
        });
    }

    onSignUpPress = () => {
        this.props.navigation.navigate('SignUp');
    }

    onGuestPress = () => {
        this.props.navigation.navigate('Home');
    }

    onForgotPasswordPress = () => {
        this.props.navigation.navigate('ForgotPassword');
    }

    render() {
        return (
        <View style={styles.container}>
            <View style={styles.container} >
                <TextInput
                    placeholder="email"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    returnKeyType="next"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    value={this.state.email}
                    onChangeText={ (text) => this.setState({email: text}) }
                    style={styles.inputText}
                />
                <TextInput
                    placeholder="password"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    secureTextEntry
                    returnKeyType="go"
                    style={styles.inputText}
                    ref={(input) => this.passwordInput = input}
                    value={this.state.password}
                    onChangeText={ (text) => this.setState({password: text}) }
                />
            </View>
            <View style={styles.buttonContainer} >
                    <TouchableOpacity onPress={this.onSignInPress} >
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onSignUpPress} >
                        <Text style={styles.buttonText} >Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onGuestPress} >
                        <Text style={styles.buttonText} >Guest</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onForgotPasswordPress} >
                        <Text>Forgot your password ?</Text>
                    </TouchableOpacity>
            </View>
        </View>
        )
    }
}