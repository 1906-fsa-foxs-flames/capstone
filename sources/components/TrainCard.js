import React from 'react'
import { View, Text, StyleSheet } from "react-native";
import { Card, Tooltip, Icon, Button } from "react-native-elements";
import CustomPopover from './CustomPopover'

export default function TrainCard(props) {
  //helper function that converts absolute arrival times into relative times
  //arrivalTime: epoch seconds
  //currentTime: epoch seconds
  //returns minutes
  function getTimeUntil(arrivalTime, currentTime) {
    return Math.ceil((arrivalTime - currentTime) / 60)
  }

  //For only displaying the next 'x' trains
  let trainCounter = 0

  return (
    <Card
      title={props.direction}
      titleStyle={styles.cardTitleStyle}
      containerStyle={styles.cardContainerStyle}
    >
      {/* USER INSTRUCTIONS */}
      <Text>Tap a train for congestion information</Text>

      {/* Map over every train in the array passed to this component*/}
      {props.trains.map(function(trainTime) {

        //This if-else checks whether the train's arrival is still in the future and whether the train is one of the next 'x' trains to arrive (don't want to list every future train)
        if (
          getTimeUntil(trainTime[0], props.now) >= 0 &&
          trainCounter < 4
        ) {
          trainCounter++;
          return (
            <View style={{justifyContent: 'center'}}>
              <Tooltip height={100} popover={<CustomPopover writeCongestedTrain={props.writeCongestedTrain} congested={props.congested} trainTime={trainTime} />}>
                <Text key={trainTime[0]} style={styles.cardTextStyle}>
                  {getTimeUntil(trainTime[0], props.now)} minutes
                </Text>
              </Tooltip>
            </View>
          );
        } else {
          return null;
        }
      })}
    </Card>
  )
}

const styles = StyleSheet.create({
  cardTitleStyle: {
    fontSize: 24
  },
  cardContainerStyle: {
    flex: 1,
    alignItems: "center"
  },
  cardTextStyle: {
    textAlign: "center"
  }
})
