import React from 'react'
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

export default function CustomTooltip(props) {
  //A flag for whether this train is on the list of congested trains or not
  const isCongested = props.congestedTrains.includes(props.trainTime[1])

  return (
    <View style={styles.viewStyle}>

      {/* CHECKING THE ARRAY OF DELAYED TRAINS (CONSTRUCTED FROM THE DATABASE), AND DISPLAING THE APPROPRIATE TEXT*/}
      <Text style={styles.textStyle}>
        {isCongested && 'Users have reported this train is congested'}
        {!isCongested && 'No users have reported this train congested'}
      </Text>

      {/* DISPLAYING A BUTTON THAT WILL PUT THIS TRAIN ONTO THE CONGESTED TRAINS SECTION OF THE DB */}
      <Button titleStyle={styles.buttonTitleStyle} buttonStyle={styles.buttonButtonStyle} title='Report congestion' onPress={() => props.writeCongestedTrain(props.trainTime[0], props.trainTime[1])} />

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
