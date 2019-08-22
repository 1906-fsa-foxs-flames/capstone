import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import MapView from "react-native-maps";
import FetchLocation from "./FetchLocation";
import NearestCity from "../../trainStopInfo";

class UsersMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: null,
      station: null
    };
  }

  getUserLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00622,
            longitudeDelta: 0.00421
          }
        });
      },
      err => console.log(err)
    );
  };

  render() {
    return (
      <View style={styles.mapContainer}>
        <MapView
          initialRegion={{
            latitude: 40.78,
            longitude: -73.965,
            latitudeDelta: 0.05,
            longitudeDelta: 0.0421
          }}
          region={this.state.userLocation}
          showsUserLocation
          style={styles.map}
        />
        <View
          style={{
            position: "absolute",
            top: "90%",
            alignSelf: "flex-end",
            right: "5%"
          }}
        >
          <FetchLocation onGetLocation={this.getUserLocationHandler} />
        </View>
        {this.state.userLocation && (
          <Text style={{ fontSize: 20 }}>
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
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: "70%"
  },
  map: {
    width: "100%",
    height: "100%"
  }
});

export default UsersMap;
