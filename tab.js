import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import LogIn from './LogIn';
import CamTest from './CamTest'

class SettingsScreen extends React.Component {
  render() { 
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === 'Home') {
    iconName = 'md-subway';
  } else if (routeName === 'Camera') {
    iconName = 'md-camera';
  } else if (routeName === 'LogIn') {
    iconName = 'md-person'
  }
  return <IconComponent name={iconName} size={25} color={tintColor} />;
};

const TabNavigator = createBottomTabNavigator({
  Home: { screen: SettingsScreen},
  Camera: { screen: CamTest },
  LogIn: { screen: LogIn }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor),
    }),
    tabBarOptions: {
      activeTintColor: 'dodgerblue',
      inactiveTintColor: 'gray',
    },
    initialRouteName: 'Camera'
  }
);

export default TabNavigator;