import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Tooltip, Icon, Button } from "react-native-elements";
import CustomPopover from "./CustomPopover";

export default function TrainCard(props) {
  //helper function that converts absolute arrival times into relative times
  //arrivalTime: epoch seconds
  //currentTime: epoch seconds
  //returns minutes
  function getTimeUntil(arrivalTime, currentTime) {
    return Math.ceil((arrivalTime - currentTime) / 60);
  }

  //For only displaying the next 'x' trains
  let trainCounter = 0;

  return (
    <Card
      title={props.direction}
      titleStyle={styles.cardTitleStyle}
      containerStyle={styles.cardContainerStyle}
    >
      {/* USER INSTRUCTIONS */}
      <View style={styles.instructionsContainerStyle}>
        <Text style={styles.InstructionsTextStyle}>
          Tap a train for congestion information
        </Text>
      </View>

      {/* Map over every train in the array passed to this component*/}
      {props.trains.map(function(trainTime, index) {
        let color;
        let isCongested = props.congestedTrains.includes(trainTime[1]);
        if (isCongested) {
          color = "orange";
        } else color = "black";
        //This if-else checks whether the train's arrival is still in the future and whether the train is one of the next 'x' trains to arrive (don't want to list every future train)
        if (getTimeUntil(trainTime[0], props.now) >= 0 && trainCounter < 4) {
          //For every train we display, increment the counter
          trainCounter++;
          return (
            <View style={styles.viewStyle} key={index}>
              {/* TOOLTIP DISPLAYS A POP-UP WITH CONGESTION DETAILS WHEN THE USER TAPS ON A TRAIN*/}
              {/* WRITECONGESTEDTRAIN = A METHOD TO WRITE CONGESTION DATA TO THE DB */}
              {/* CONGESTEDTRAINS = AN ARRAY PULLED FROM THE DB OF WHICH TRAINS ARE CURRENTLY CONGESTED*/}
              {/* TRAINTIME = AN ARRAY OF THE FORM [ARRIVAL_TIME, TRIP_ID, FUTURE_STOPS_ARRAY] */}
              <Tooltip
                height={100}
                key={trainTime[0]}
                popover={
                  <CustomPopover
                    writeCongestedTrain={props.writeCongestedTrain}
                    congestedTrains={props.congestedTrains}
                    trainTime={trainTime}
                  />
                }
              >
                {/* TEXT DISPLAYS THE ARRIVAL TIMES OF THE TRAINS, RELATIVE TO NOW*/}
                {isCongested ? (
                  <Text
                    key={trainTime[0]}
                    style={{
                      textAlign: "center",
                      margin: 5,
                      fontWeight: "bold",
                      color: color
                    }}
                  >
                    {getTimeUntil(trainTime[0], props.now)} minutes away
                    (crowded)
                  </Text>
                ) : (
                  <Text
                    key={trainTime[0]}
                    style={{
                      textAlign: "center",
                      margin: 5,
                      fontWeight: "bold",
                      color: color
                    }}
                  >
                    {getTimeUntil(trainTime[0], props.now)} minutes away
                  </Text>
                )}
              </Tooltip>
            </View>
          );
        } else {
          return null;
        }
      })}

      {/* SWIPING INSTRUCTIONS*/}
      <View style={styles.swipingInstructionsViewStyle}>
        {props.direction === "Uptown" && (
          <Text style={styles.swipingInstructionsTextStyle}>
            Swipe right for downtown
          </Text>
        )}
        {props.direction === "Downtown" && (
          <Text style={styles.swipingInstructionsTextStyle}>
            Swipe left for uptown
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: "center"
  },
  cardTitleStyle: {
    fontSize: 24
  },
  cardContainerStyle: {
    flex: 1,
    alignItems: "center"
  },
  InstructionsTextStyle: {
    textAlign: "center",
    fontSize: 10
  },
  instructionsContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginBottom: 4
  },
  swipingInstructionsTextStyle: {
    textAlign: "center",
    fontSize: 10
  },
  swipingInstructionsViewStyle: {
    borderTopWidth: 1,
    borderTopColor: "black",
    marginTop: 2
  }
});
