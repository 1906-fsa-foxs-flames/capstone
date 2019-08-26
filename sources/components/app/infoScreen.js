/* eslint-disable complexity */
import React from "react";
import { Text, View, ScrollView, Image } from "react-native";
import styles from "../../variables/styles";
import TopToolBar from "./topToolBar";
import axios from "axios";

export default class InfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subwayState: [],
      finalObject: {},
      effectiveDate: ""
    };
    this.getSubwayState = this.getSubwayState.bind(this);
    this.getInstantDate = this.getInstantDate.bind(this);
    this.onRefresh = this.onRefresh.bind(this);

    //The locations of the images for each train line
    this.lineImgs = {
      1: require("../../../assets/1TRAIN.png"),
      2: require("../../../assets/2TRAIN.png"),
      3: require("../../../assets/3TRAIN.png"),
      4: require("../../../assets/4TRAIN.png"),
      5: require("../../../assets/5TRAIN.png"),
      6: require("../../../assets/6TRAIN.png"),
      S: require("../../../assets/STRAIN.png"),
      A: require("../../../assets/ATRAIN.png"),
      C: require("../../../assets/CTRAIN.png"),
      E: require("../../../assets/ETRAIN.png"),
      B: require("../../../assets/BTRAIN.png"),
      D: require("../../../assets/DTRAIN.png"),
      F: require("../../../assets/FTRAIN.png"),
      M: require("../../../assets/MTRAIN.png"),
      N: require("../../../assets/NTRAIN.png"),
      Q: require("../../../assets/QTRAIN.png"),
      R: require("../../../assets/RTRAIN.png"),
      W: require("../../../assets/WTRAIN.png"),
      L: require("../../../assets/LTRAIN.png"),
      G: require("../../../assets/GTRAIN.png"),
      J: require("../../../assets/JTRAIN.png"),
      Z: require("../../../assets/ZTRAIN.png"),
      7: require("../../../assets/7TRAIN.png"),
      SIR: require("../../../assets/SIRTRAIN.png")
    };
  }

  componentDidMount() {
    this.getSubwayState();
  }

  onRefresh() {
    this.getSubwayState();
  }

  getSubwayState() {
    const promise = new Promise((resolve, reject) => {
      const result = axios.get(
        "https://us-central1-subwar-a2611.cloudfunctions.net/getMTAState"
      );
      resolve(result);
    });
    promise.then(result => {
      this.setState({ subwayState: result.data });
      let obj = {};
      this.state.subwayState.forEach(element => {
        if (typeof element === "object") {
          obj[element.status] = {
            trains: [],
            timeStamp: ""
          };
        }
      });
      this.state.subwayState.forEach(element => {
        let fromFunc =
          element.name === "SIR" ? [element.name] : Array.from(element.name);
        if (obj[element.status]) {
          obj[element.status].trains = obj[element.status].trains.concat(
            fromFunc
          );
          if (element.Date !== "")
            obj[element.status].timeStamp = element.Date + " " + element.Time;
        }
      });
      this.setState({ finalObject: obj });
    });
    this.setState({ effectiveDate: this.getInstantDate() });
  }

  getInstantDate() {
    const date = new Date(Date.now());
    const day =
      (1 + date.getMonth() >= 10
        ? 1 + date.getMonth()
        : "0" + (1 + date.getMonth())) +
      "/" +
      date.getDate() +
      "/" +
      date.getFullYear();
    const time =
      (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) +
      ":" +
      (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()) +
      (date.getHours() >= 12 ? "PM" : "AM");
    return day + " " + time;
  }

  render() {
    const states = Object.keys(this.state.finalObject);
    return (
      <View style={styles.container}>
        <TopToolBar
          navigation={this.props.navigation}
          refreshPage={this.onRefresh}
        />
        <View style={styles.mainSpace}>
          <ScrollView>
            {states.map(state => {
              return (
                <View key={state} style={styles.infoContainer}>
                  <View
                    style={{
                      borderBottomColor: "white",
                      borderBottomWidth: 1,
                      width: "90%",
                      alignSelf: "center"
                    }}
                  />
                  <View style={styles.infoHeaderContainer}>
                    <Text style={styles.infoHeaderText}>
                      {state +
                        " (" +
                        (this.state.finalObject[state].timeStamp === ""
                          ? this.state.effectiveDate
                          : this.state.finalObject[state].timeStamp) +
                        ")"}
                    </Text>
                  </View>
                  <View style={styles.infoTrainContainer}>
                    {this.state.finalObject[state].trains.map(train => {
                      //For grabbing the train line image
                      let icon = train
                        ? this.lineImgs[train]
                        : require("../../../assets/Empty.png");
                      return (
                        <Image
                          key={train}
                          source={icon}
                          style={{ width: 50, height: 50 }}
                        />
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  }
}
