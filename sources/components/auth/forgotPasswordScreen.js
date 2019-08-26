/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "../../variables/styles";
import * as firebase from "firebase";

export default class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  onResetPasswordPress = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(
        () => {
          Alert.alert("Password reset email has been sent");
        },
        error => {
          Alert.alert(error.message);
        }
      );
  };

  onGoBackPress = () => {
    this.props.navigation.navigate("Start");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <TextInput
            placeholder="email"
            placeholderTextColor="rgba(255, 255, 255, 0.8)"
            returnKeyType="go"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.email}
            onChangeText={text => this.setState({ email: text })}
            style={styles.inputText}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.onResetPasswordPress}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onGoBackPress}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
