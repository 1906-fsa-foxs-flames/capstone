import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";

import LogIn from "../auth/signInScreen";
import CamTest from "../camera/camera";
// import CamTest from '../../../test';

import FetchLocation from "../FetchLocation";
import UsersMap from "../UserLocation";

class SettingsScreen extends React.Component {
  state = {
    userLocation: null
  };

  getUserLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.000622,
            longitudeDelta: 0.0421
          }
        });
      },
      err => console.log(err)
    );
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FetchLocation onGetLocation={this.getUserLocationHandler} />
        <UsersMap userLocation={this.state.userLocation} />
      </View>
    );
  }
}

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === "Home") {
    iconName = "md-subway";
  } else if (routeName === "Camera") {
    iconName = "md-camera";
  } else if (routeName === "LogIn") {
    iconName = "md-person";
  }
  return <IconComponent name={iconName} size={25} color={tintColor} />;
};

const TabNavigator = createBottomTabNavigator(
  {
    Home: { screen: SettingsScreen },
    Camera: { screen: CamTest },
    LogIn: { screen: LogIn }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor)
    }),
    tabBarOptions: {
      activeTintColor: "dodgerblue",
      inactiveTintColor: "gray"
    },
    initialRouteName: "Camera"
  }
);

export default TabNavigator;
