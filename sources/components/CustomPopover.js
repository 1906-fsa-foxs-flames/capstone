import React from 'react'
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

export default function CustomTooltip(props) {
  return (
    <View style={styles.viewStyle}>
      <Text style={styles.textStyle}>{(props.congested.includes(props.trainTime[1]) && 'Users have reported this train is congested') || ('No users have reported this train is congested')}</Text>
      <Button titleStyle={styles.buttonTitleStyle} buttonStyle={styles.buttonButtonStyle} title='Report congestion' onPress={() => props.writeTestData(props.trainTime[0], props.trainTime[1])}/>
    </View>
  )
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    height: 100,
    justifyContent: 'center'
  },
  textStyle: {
    textAlign: 'center',
    color: 'white'
  },
  buttonTitleStyle: {
    fontSize: 10,
    padding: 0
  },
  buttonButtonStyle: {
    width: 115,
    height: 25,
    padding: 0
  }
})
