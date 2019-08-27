import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView from "react-native-maps";
import Geojson from "react-native-geojson";
import FetchLocation from "./FetchLocation";
import NearestCity from "../../trainStopInfo";
import { twoLines } from "../../twoLine";
import { jLines } from "../../jLine";
import { twoPoints } from "../../twoLinePoints";
import { jPoints } from "../../jLinePoints";


class UsersMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: null
    };
    this.getUserLocationHandler = this.getUserLocationHandler.bind(this);
  }

  getUserLocationHandler = (zoom = true) => {
    //This makes it so the automatic zoom to the users location is a wide view, but if the botton is pressed it zooms in much closer
    let latDelta = 0.05;
    let lonDelta = 0.05;
    if (zoom) {
      latDelta /= 30;
      lonDelta /= 30;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLocation: {
            // latitude: position.coords.latitude,
            latitude: 40.706821,
            // longitude: position.coords.longitude,
            longitude: -74.0091,
            latitudeDelta: latDelta,
            longitudeDelta: lonDelta
          }
        });
      },
      err => console.log(err)
    );
  };

  componentDidMount() {
    this.getUserLocationHandler();
  }

  render() {
    let points, color, lines;
   if (this.props.currentLine === '2') {
    points = twoPoints;
    lines = twoLines;
    color = 'red';
   } else {
     points = jPoints;
     lines = jLines;
     color = '#8B4513';
   }
    return (
      <View style={styles.mapContainer}>
        {this.state.userLocation && (
          <MapView
            initialRegion={{
              latitude: 40.78,
              longitude: -73.965,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
            }}
            region={this.state.userLocation}
            showsUserLocation
            style={styles.map}
            mapType={"mutedStandard"}
          >
            <Geojson geojson={lines} strokeColor={color} />
            {points.map((point, i) => (
              <MapView.Marker
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude
                }}
                title={point.title}
                description={point.description}
                key={i}
              >
              <View style={{
                height: 15,
                width: 15,
                borderWidth: 3,
                backgroundColor: 'white',
                borderRadius: 10,
                borderColor: color,
                overflow: 'hidden'
                }}>
              </View>
            </MapView.Marker>
            ))}
          </MapView>
        )}
        <View
          style={{
            position: "absolute",
            top: this.props.smaller ? "76.25%" : "85%",
            alignSelf: "flex-end",
            right: "5%"
          }}
        >
          <View
            style={{
              backgroundColor: "#f2a900",
              padding: 6,
              marginBottom: 5,
              borderRadius: 3
            }}
          >
            {this.state.userLocation && (
              <Text
                style={{ fontSize: 12, textAlign: "center", color: "white" }}
              >
                Closest station:{" "}
                {
                  NearestCity(
                    this.state.userLocation.latitude,
                    this.state.userLocation.longitude
                  )[1]
                }
              </Text>
            )}
          </View>
          <FetchLocation onGetLocation={this.getUserLocationHandler} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: "89%"
  },
  map: {
    width: "100%",
    height: "100%"
  },
});

export default UsersMap;
