/* eslint-disable no-use-before-define */
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import StartScreen from './sources/components/startScreen';
import HomeScreen from './sources/components/app/homeScreen';
import forgotPasswordScreen from './sources/components/auth/forgotPasswordScreen';
import signInScreen from './sources/components/auth/signInScreen';
import signUpScreen from './sources/components/auth/signUpScreen';
import * as firebase from 'firebase';
import ApiKeys from './sources/variables/apiKeys';

const AuthStack = createStackNavigator(
  {
    Home: HomeScreen,
    SignIn: signInScreen,
    SignUp: signUpScreen,
    ForgotPassword: forgotPasswordScreen,
    Start: StartScreen,
  },
  {
    initialRouteName: 'Start',
    headerMode: 'none',
  }
);

const AppStack = createStackNavigator(
  {
    Home: HomeScreen
  }
);

const AppContainer = createAppContainer(AppStack);

const AuthContainer = createAppContainer(AuthStack);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthReady: false,
      isAuth: false,
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.firebaseConfig);
    }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = (user) => {
    this.setState({isAuthReady: true});
    this.setState({isAuth: !!user});
  }

  render() {
    return (
      this.state.isAuth
      ? <AppContainer />
      : <AuthContainer />
    )
  }
}
