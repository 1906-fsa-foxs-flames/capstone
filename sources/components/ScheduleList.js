import React, { Component } from "react";
import { View, Text, ScrollView, Image, Dimensions, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import axios from "axios";

import UserLocation from "./ScheduleListMap";
import DefaultLocation from "./UsersMap";
import NearestCity from "../../trainStopInfo";
import TrainCard from './TrainCard'

//Firebase configuration and initialization
var firebase = require("firebase/app");
var firebaseConfig = {
  apiKey: "AIzaSyDFJrmYkjMr6bymsyonik7Xr6zL9SMlxtA",
  authDomain: "subwar-a2611.firebaseapp.com",
  databaseURL: "https://subwar-a2611.firebaseio.com",
  projectId: "subwar-a2611",
  storageBucket: "subwar-a2611.appspot.com",
  messagingSenderId: "909830506182",
  appId: "1:909830506182:web:ac670ea82577cee6"
};
firebase.initializeApp(firebaseConfig);

const trains = ['2', '3', 'J']

export default class ScheduleList extends Component {
  constructor(props) {
    super(props);

    //uptown and downtown trains will be arrays, where each element consists of [ARRIVAL_TIME, TRIP_ID, FUTURE_STOPS_ARRAY]
    this.state = { uptownTrains: [], downtownTrains: [] };

    //binding the methods
    this.writeCongestedTrain = this.writeCongestedTrain.bind(this)
    this.readCongestedTrains = this.readCongestedTrains.bind(this)

    // Initialize Firebase & database
    this.db = firebase.database()

    //Array for holding the list of congested trains (will not change so does not need to be on state)
    this.congestedTrains = []

    //Populate the congested trains array
    this.readCongestedTrains(this.congestedTrains)

    //Object that maps the train lines to the feed IDs
    this.feedIds = {
      "123456S": 1,
      ACEHS: 26,
      NQRW: 16,
      BDFM: 21,
      L: 2,
      G: 31,
      JZ: 36,
      "7": 51
    };

    //The locations of the images for each train line
    this.lineImgs = {
      1: require("../../assets/1TRAIN.png"),
      2: require("../../assets/2TRAIN.png"),
      3: require("../../assets/3TRAIN.png"),
      4: require("../../assets/4TRAIN.png"),
      5: require("../../assets/5TRAIN.png"),
      6: require("../../assets/6TRAIN.png"),
      S: require("../../assets/STRAIN.png"),
      A: require("../../assets/ATRAIN.png"),
      C: require("../../assets/CTRAIN.png"),
      E: require("../../assets/ETRAIN.png"),
      B: require("../../assets/BTRAIN.png"),
      D: require("../../assets/DTRAIN.png"),
      F: require("../../assets/FTRAIN.png"),
      M: require("../../assets/MTRAIN.png"),
      L: require("../../assets/LTRAIN.png"),
      G: require("../../assets/GTRAIN.png"),
      N: require("../../assets/NTRAIN.png"),
      Q: require("../../assets/QTRAIN.png"),
      R: require("../../assets/RTRAIN.png"),
      W: require("../../assets/WTRAIN.png"),
      J: require("../../assets/JTRAIN.png"),
      Z: require("../../assets/ZTRAIN.png"),
      7: require("../../assets/7TRAIN.png")
    };
  }

  //method for sending package of data to the MTA API and getting results back
  async sendToAPI(position) {
    //Getting the station you're at
    const station = NearestCity(
      position.coords.latitude,
      position.coords.longitude
    );

    //Finding which MTA feed to query in the firebase function
    let feedKeys = Object.keys(this.feedIds);
    feedKeys = feedKeys.filter(key => key.includes(this.props.currentLine));
    let feedId = this.feedIds[feedKeys[0]];

    //Querying the firebase function
    //Arrivals will return in the form of [UPTOWN_ARRIVALS_ARRAY, DOWNTOWN_ARRIVALS_ARRAY]
    let arrivals = await axios.post(
      "https://us-central1-subwar-a2611.cloudfunctions.net/queryMTA",
      { feedId, currentLine: this.props.currentLine, station }
    );

    //Sorting the trains by arrival time
    let sortedUptown = arrivals.data[0].sort((a, b) => a[0] - b[0])
    let sortedDowntown = arrivals.data[1].sort((a, b) => a[0] - b[0])

    //Setting the trains on state.  Each train will be of the form [ARRIVAL_TIME, TRAIN_ID, FUTURE_STOPS_ARRAY]
    //FUTURE_STOPS_ARRAY elements will be of the form: { stop_sequence, stop_id, ARRIVAL_OBJECT, departure = null, schedule_relationship, NYCT_STOP_TIME_UPDATE_OBJECT }
    //To give meaning to stop_id, combine with the MTA static data to access station name and coordinates
    //To access arrival time in ARRIVAL_OBJECT, use arrival.time.low
    this.setState({
      uptownTrains: sortedUptown,
      downtownTrains: sortedDowntown
    });
  }

  //this method adds a new train to the database under 'congested-trains'
  writeCongestedTrain(trainNumber, tripId) {
    this.db.ref('congested-trains/' + trainNumber).set({
      'tripId': tripId
    })
  }

  //this method reads in all congested trains from the db and pushes them to an array for processing
  readCongestedTrains(congestedTrains) {
    var ref = this.db.ref('congested-trains')
    ref.on('child_added', function(snapshot) {
      congestedTrains.push(snapshot.val().tripId)
    })
  }

  //grabs the user's location and then sends all the relevant data to the MTA's API
  componentDidMount() {
    //Gets the user's location in the background for use in calculating what station a user is at
    navigator.geolocation.getCurrentPosition(position =>
      this.sendToAPI(position)
    );
  }

  render() {
    //For rendering the times as relative instead of absolute.  'now' is in epoch time (s)
    const now = Date.now() / 1000
    console.log(trains.includes(this.props.currentLine))
    //For grabbing the train line image
    let icon = this.props.currentLine
      ? this.lineImgs[this.props.currentLine]
      : require("../../assets/Empty.png");

    let phoneWidth = Dimensions.get("window").width;

    return (
      //PARENT VIEW FOR THE WHOLE PAGE
      <ScrollView style={styles.overallParentScroll}>

        {/* PARENT VIEW FOR THE UPPER SECTION OF THE PAGE */}
        <View style={styles.upperParentView}>

          {/* FOR RENDERING THE MAP WITH THE SELECTED SUBWAY LINE OVERLAID*/}
          {trains.includes(this.props.currentLine)
          ?  <UserLocation smaller={true} currentLine={this.props.currentLine}/>
          :  <DefaultLocation smaller={true} />
          }

          {/* FOR RENDERING THE 'NEXT A/B/C/1/2/3/ETC. TRAINS HEADER */}
          <View style={styles.nextTrainHeaderView}>
            <Text style={styles.nextTrainHeaderText}>Next</Text>
            <Image source={icon} style={styles.nextTrainHeaderImg} />
            <Text style={styles.nextTrainHeaderText}>Trains</Text>
          </View>

        </View>

        {/* PARENT VIEW FOR THE LOWER SECTION OF THE PAGE*/}
        <View>

          {/* PARENT VIEW FOR THE LEFT/RIGHT SWIPING CARDS*/}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {/* UPTOWN/DOWNTOWN SWIPABLE CARDS*/}
            {/* TRAINS = ARRAY OF TRAINS TO BE DISPLAYED */}
            {/* NOW = CURRENT TIME */}
            {/* WRITECONGESTEDTRAIN = METHOD FOR ADDING CONGESTION INFO TO THE DB*/}
            {/* CONGESTEDTRAINS = ARRAY PULLED FROM THE DB OF ALL CURRENTLY CONGESTED TRAINS*/}
            <View style={{ width: phoneWidth }}>
              <TrainCard direction='Uptown' trains={this.state.uptownTrains} now={now} writeCongestedTrain={this.writeCongestedTrain} congestedTrains={this.congestedTrains}/>
            </View>
            <View style={{ width: phoneWidth }}>
              <TrainCard direction='Downtown' trains={this.state.downtownTrains} now={now} writeCongestedTrain={this.writeCongestedTrain} congestedTrains={this.congestedTrains}/>
            </View>

          </ScrollView>

          {/* 'CLOSE CAMERA' BUTTON */}
          <Button
            onPress={() => this.props.closeNextTrains()}
            title="Back to Camera"
            style={styles.closeCameraStyle}
            buttonStyle={styles.closeCameraButtonStyle}
          />

        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  overallParentScroll: {
    flex: 1
  },
  upperParentView: {
    height: 400
  },
  nextTrainHeaderView: {
    paddingTop: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  nextTrainHeaderText: {
    textAlign: "center",
    fontSize: 24
  },
  nextTrainHeaderImg: {
    width: 40,
    height: 40
  },
  closeCameraStyle: {
    padding: 15
  },
  closeCameraButtonStyle: {
    backgroundColor: "#0f61a9"
  }
})
