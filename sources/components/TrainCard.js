import React from 'react'
import { View, Text, StyleSheet } from "react-native";
import { Card, Tooltip, Icon, Button } from "react-native-elements";

//ALL THE FIREBASE STUFF -------------------------------------------------------

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/database");

var firebaseConfig = {
  apiKey: "AIzaSyDFJrmYkjMr6bymsyonik7Xr6zL9SMlxtA",
  authDomain: "subwar-a2611.firebaseapp.com",
  databaseURL: "https://subwar-a2611.firebaseio.com",
  projectId: "subwar-a2611",
  storageBucket: "subwar-a2611.appspot.com",
  messagingSenderId: "909830506182",
  appId: "1:909830506182:web:ac670ea82577cee6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.database()

function readTest(db) {
  var ref = db.ref('congested-trains')
  ref.on('child_added', function(snapshot) {
    console.log(snapshot.val().trainId)
  })
}

readTest(db)

//Write the data to the DB
function writeTestData(testNumber, str) {
  db.ref('congested-trains/' + testNumber).set({
    'trainId': str
  })
}

//Kill the firebase connection and log success
function killConnection() {
  firebase.app().delete().then(function() {
    console.log('connection closed')
  });
}

//ALL THE FIREBASE STUFF -------------------------------------------------------

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
              <Tooltip popover={<Text>DISPLAY CONGESTION DATA HERE?</Text>}>
                <Text key={trainTime[0]} style={styles.cardTextStyle}>
                  {getTimeUntil(trainTime[0], props.now)} minutes
                </Text>
              </Tooltip>
              <Button title='Report congestion' onPress={() => writeTestData(trainTime[0], trainTime[1])}/>
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
