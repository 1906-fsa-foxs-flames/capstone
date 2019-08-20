import React from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";

const usersMap = props => {
  let userLocationMarker = null;
  if (props.userLocation) {
    userLocationMarker = <MapView.Marker coordinate={props.userLocation} />;
  }
  return (
    <View style={styles.mapContainer}>
      <MapView
        initialRegion={{
          latitude: 40.78,
          longitude: -73.96,
          latitudeDelta: 0.1,
          longitudeDelta: 0.0421
        }}
        region={props.userLocation}
        style={styles.map}
      >
        {userLocationMarker}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: "90%",
    marginTop: 10
  },
  map: {
    width: "100%",
    height: "100%"
  }
});

export default usersMap;
