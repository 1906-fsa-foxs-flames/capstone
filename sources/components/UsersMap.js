import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView from "react-native-maps";
import FetchLocation from "./FetchLocation";
import NearestCity from "../../trainStopInfo";

class UsersMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: null
    };
    this.getUserLocationHandler = this.getUserLocationHandler.bind(this)
  }

  getUserLocationHandler = (zoom = false) => {
    //This makes it so the automatic zoom to the users location is a wide view, but if the botton is pressed it zooms in much closer
    let latDelta = 0.05
    let lonDelta = 0.05
    if (zoom) {
      latDelta /= 4
      lonDelta /= 4
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: latDelta,
            longitudeDelta: lonDelta
          }
        });
      },
      err => console.log(err)
    );
  };

  componentDidMount() {
    this.getUserLocationHandler()
  }

  render() {
    return (
      <View style={styles.mapContainer}>
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
        />
        <View
          style={{
            position: "absolute",
            top: "80%",
            alignSelf: "flex-end",
            right: "5%"
          }}
        >
        <FetchLocation onGetLocation={this.getUserLocationHandler} />
        </View >
        {this.state.userLocation && (
          <Text style={{ fontSize: 20, textAlign: 'center' }}>
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
    height: "89%"
  },
  map: {
    width: "100%",
    height: "100%"
  }
});

export default UsersMap;
