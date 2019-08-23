/* eslint-disable no-use-before-define */
import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import StartScreen from './sources/components/startScreen';
import HomeScreen from './sources/components/app/homeScreen';
//import ReportScreen from './sources/components/app/reportScreen';
import Camera from './sources/components/app/camera'
import InfoScreen from './sources/components/app/infoScreen';
import forgotPasswordScreen from './sources/components/auth/forgotPasswordScreen';
import signInScreen from './sources/components/auth/signInScreen';
import signUpScreen from './sources/components/auth/signUpScreen';
import * as firebase from 'firebase';
import ApiKeys from './sources/variables/apiKeys';
import { Ionicons } from '@expo/vector-icons';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.firebaseConfig);
    }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = (user) => {
    this.setState({isAuth: !!user});
  }

  render() {

    const AuthNav = createStackNavigator(
      {
        Start: StartScreen,
        SignIn: signInScreen,
        SignUp: signUpScreen,
        ForgotPassword: forgotPasswordScreen,
      },
      {
        initialRouteName: 'Start',
        headerMode: 'none',
      }
    );

    const getTabBarIcon = (navigation, focused, tintColor) => {
      const { routeName } = navigation.state;
      let IconComponent = Ionicons;
      let iconName;
      if (routeName === 'Home') {
        iconName = 'md-home';
      } else if (routeName === 'Camera') {
        iconName = 'md-camera';
      } else if (routeName === 'Info') {
        iconName = 'md-subway';
      }
      return <IconComponent name={iconName} size={25} color={tintColor} />;
    };

    const AppNav = createBottomTabNavigator(
      {
        Home: { screen: HomeScreen },
        Camera: { screen: Camera},
        Info: { screen: InfoScreen},
      },
      {
        initialRouteName: 'Home',
        defaultNavigationOptions: ({navigation}) => ({
          tabBarIcon: ({focused, tintColor}) => getTabBarIcon(navigation, focused, tintColor)
        }),
        tabBarOptions: {
          activeTintColor: 'dodgerblue',
          inactiveTintColor: 'gray',
          labelStyle: {
            fontSize: 12,
            fontWeight: 'bold'
          },
          style: {
            backgroundColor: 'lightblue',
          }
        }
      }
    );

    const SwitchNav = createSwitchNavigator({
      AuthNav: { screen: AuthNav},
      AppNav: { screen: AppNav},
    }, {
      initialRouteName: this.state.isAuth ? 'AppNav' : 'AuthNav',
    });

    const AppContainer = createAppContainer(SwitchNav);

    return (
      <AppContainer />
    )
  }
}
