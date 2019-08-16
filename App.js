/* eslint-disable no-use-before-define */
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>Email:</Text>
          <TextInput style={styles.inputText} placeholder="Type Email Here" />
        </View>
        <View>
          <Text>Password:</Text>
          <TextInput style={styles.inputText} placeholder="Type Password Here" />
        </View>
        <View>
          <Button onPress={() => {alert('Satisfaction !!!')}} title="Push Me" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: {
    height: 40,
    width: 100,
  }
});
