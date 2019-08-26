import React, { Component } from "react";
import { View, Text, ScrollView, Image, Dimensions, StyleSheet } from "react-native";
import { Card, Button } from "react-native-elements";
import axios from "axios";

import UserLocation from "./ScheduleListMap";
import DefaultLocation from "./UsersMap";
import NearestCity from "../../trainStopInfo";

export default class ScheduleList extends Component {
  constructor(props) {
    super(props);
    this.state = { uptownTrains: [], downtownTrains: [] };

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
    let arrivals = await axios.post(
      "https://us-central1-subwar-a2611.cloudfunctions.net/queryMTA",
      { feedId, currentLine: this.props.currentLine, station }
    );

    //Setting the trains on state.  Each train will be of the form [ARRIVAL_TIME, TRAIN_ID]
    this.setState({
      uptownTrains: arrivals.data[0].sort((a, b) => a[0] - b[0]),
      downtownTrains: arrivals.data[1].sort((a, b) => a[0] - b[0])
    });
  }

  componentDidMount() {
    //Gets the user's location in the background for use in calculating what station a user is at
    navigator.geolocation.getCurrentPosition(position =>
      this.sendToAPI(position)
    );
  }

  render() {
    //For rendering the times as relative instead of absolute
    const now = Date.now() / 1000

    //For rendering a maximum number of trains
    let uptownCounter = 0;
    let downtownCounter = 0;

    //For grabbing the train line image
    let icon = this.props.currentLine
      ? this.lineImgs[this.props.currentLine]
      : require("../../assets/Empty.png");

    let phoneWidth = Dimensions.get("window").width;

    //helper function that converts absolute arrival times into relative times
    //arrivalTime: epoch seconds
    //currentTime: epoch seconds
    //returns minutes
    function getTimeUntil(arrivalTime, currentTime) {
      return Math.ceil((arrivalTime - currentTime) / 60)
    }

    return (
      //PARENT VIEW FOR THE WHOLE PAGE
      <ScrollView style={styles.overallParentScroll}>

        {/* PARENT VIEW FOR THE UPPER SECTION OF THE PAGE */}
        <View style={styles.upperParentView}>

          {/* FOR RENDERING THE MAP WITH THE SELECTED SUBWAY LINE OVERLAID*/}
          {this.props.currentLine === "2" ? (
            <UserLocation smaller={true} currentLine={this.props.currentLine} />
          ) : (
            <DefaultLocation smaller={true} />
          )}

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
            <View style={{ width: phoneWidth }}>
              <Card
                title="Uptown"
                titleStyle={styles.cardTitleStyle}
                containerStyle={styles.cardContainerStyle}
              >
                {this.state.uptownTrains.map(function(trainTime) {
                  if (
                    getTimeUntil(trainTime[0], now) >= 0 &&
                    uptownCounter < 4
                  ) {
                    uptownCounter++;
                    return (
                      <Text key={trainTime[0]} style={styles.cardTextStyle}>
                        {getTimeUntil(trainTime[0], now)} minutes
                      </Text>
                    );
                  } else {
                    return null;
                  }
                })}
              </Card>
            </View>
            <View style={{ width: phoneWidth }}>
              <Card
                title="Downtown"
                titleStyle={styles.cardTitleStyle}
                containerStyle={styles.cardContainerStyle}
              >
                {this.state.downtownTrains.map(function(trainTime) {
                  if (
                    getTimeUntil(trainTime[0], now) >= 0 &&
                    downtownCounter < 4
                  ) {
                    downtownCounter++;
                    return (
                      <Text key={trainTime[0]} style={styles.cardTextStyle}>
                        {getTimeUntil(trainTime[0], now)} minutes
                      </Text>
                    );
                  } else {
                    return null;
                  }
                })}
              </Card>
            </View>
          </ScrollView>

          {/* SWIPING INSTRUCTIONS*/}
          <Text style={styles.swipingInstructionsTextStyle}>
            Swipe left/right for uptown/downtown
          </Text>

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
    height: 300
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
  cardTitleStyle: {
    fontSize: 24
  },
  cardContainerStyle: {
    flex: 1,
    alignItems: "center"
  },
  cardTextStyle: {
    textAlign: "center"
  },
  swipingInstructionsTextStyle: {
    textAlign: "center"
  },
  closeCameraStyle: {
    padding: 15
  },
  closeCameraButtonStyle: {
    backgroundColor: "#0f61a9"
  }
})
