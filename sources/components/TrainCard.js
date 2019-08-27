import React from 'react'
import { Text, StyleSheet } from "react-native";
import { Card } from "react-native-elements";

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
      {props.trains.map(function(trainTime) {

        //This if-else checks whether the train's arrival is still in the future and whether the train is one of the next 'x' trains to arrive (don't want to list every future train)
        if (
          getTimeUntil(trainTime[0], props.now) >= 0 &&
          trainCounter < 4
        ) {
          trainCounter++;
          return (
            <Text key={trainTime[0]} style={styles.cardTextStyle}>
              {getTimeUntil(trainTime[0], props.now)} minutes
            </Text>
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
