/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
import React from "react";
import { View, Text, Image, KeyboardAvoidingView } from "react-native";
import styles from "../variables/styles";
import SignInScreen from "./auth/signInScreen";

export default class StartScreen extends React.Component {
    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container} >
                <View style={styles.logoView}>
                    <Text style={[{...styles.logiText, marginBottom: 10}]}>MTALens</Text>
                    <Image
                        source={ require('../../assets/icon.png') }
                        style={styles.logoImage}
                    />
                    <Text style={styles.logiText}>Powered By Fox's Flames</Text>
                </View>
                <SignInScreen navigation={this.props.navigation} />
            </KeyboardAvoidingView>
        )
    }
}
