import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native";
import apiKeys from "../../variables/apiKeys";
import * as firebase from "firebase";
import ScheduleList from "../ScheduleList";

import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const CAMERA_TYPE = Camera.Constants.Type.back;

export default class Cam extends React.Component {
  constructor() {
    super();

    //State components:
    //hasCameraPermission: bool that states whether the user has allowed use of the camera or not
    //photoProcessed: bool that triggers rendering of relevant components once the photo has been processed
    //currentLine: string that represents the result of the google vision OCR
    //isLoading: bool that triggers rendering of the loading screen while the OCR is processing
    this.state = {
      hasCameraPermission: null,
      photoProcessed: false,
      currentLine: "",
      isLoading: false
    };

    //closeNextTrains resets the bools that display different components.  For use when the "back to camera" button is pressed in ScheduleList
    this.closeNextTrains = this.closeNextTrains.bind(this);
  }

  //componentDidMount asks for camera permissions
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  }

  //closeNextTrains is fired when the user presses "back to camera" in the scheduleList component
  closeNextTrains() {
    this.setState({ photoProcessed: false, isLoading: false });
  }

  snap = async () => {
    try {
      //Triggering the display of the loading screen
      this.setState({ isLoading: true });
      let photo = null;

      if (Platform.OS === "ios") {
        //Taking the photo for iOS
        photo = await this.camera.takePictureAsync();

        //Compressing the photo for iOS
        photo = await ImageManipulator.manipulateAsync(
          photo.uri,
          {},
          { compress: 0.5 }
        );
      } else if (Platform.OS === "android") {
        //Taking the photo for Android
        photo = await ImagePicker.launchCameraAsync({
          base64: true,
          quality: 0.5
        });
      }

      //Encoding the photo as base64 so that it can be fed into Google Vision API directly
      let BASE_64_IMAGE = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      //Setting the body for the Vision API request
      let body = JSON.stringify({
        requests: [
          {
            features: [{ type: "TEXT_DETECTION", maxResults: 5 }],
            image: {
              content: BASE_64_IMAGE
            }
          }
        ]
      });

      //Hitting the vision API
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDELKklvRwJOftEZ73My2iykf2bzaDKoR8",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: body
        }
      );

      //Getting the text data back, splitting it up so that we only grab the first letter (should be the train line if the user has composed the photo correctly), and passing that letter on to the MTA API call
      let responseJson = await response.json();
      let OCRtext = responseJson.responses[0].fullTextAnnotation.text;
      let split = OCRtext.split("");

      //Triggering the display of the ScheduleList component and setting the OCR result on state for use by ScheduleList
      this.setState({ photoProcessed: true, currentLine: split[0] });
    } catch (error) {
      //Changing the state so if the OCR fails the loading screen goes away so you can try again
      this.setState({ isLoading: false });
      Alert.alert(
        "Image processing failed - please try again or yell your train line into the microphone"
      );
    }
  };

  render() {
    const { hasCameraPermission } = this.state;

    //If the user has not given camera permission, display a warning
    if (!hasCameraPermission) {
      return (
        <View style={styles.permissionTextContainer}>
          <Text style={styles.permissionText}>
            Please allow camera access to use this feature
          </Text>
        </View>
      );
    } else if (!this.state.photoProcessed) {
      //If the photo has not been successfully processed, display either the camera or the loading screen
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#0f61a9"
          }}
        >
          {/*CAMERA DISPLAY FOR ANDROID*/}
          {!this.state.isLoading && Platform.OS === "android" && (
            <View>
              <TouchableOpacity onPress={this.snap}>
                <Text
                  style={{ textAlign: "center", fontSize: 24, color: "white" }}
                >
                  Press to take a picture
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/*CAMERA DISPLAY FOR iOS*/}
          {!this.state.isLoading && Platform.OS === "ios" && (
            <Camera
              style={{ flex: 5 }}
              type={CAMERA_TYPE}
              ref={ref => {
                this.camera = ref;
              }}
            >
              <View style={styles.cameraStyle}>
    
                <TouchableOpacity style={styles.onPress} onPress={this.snap}>
                <View style={{borderColor: 'white', borderWidth: 2, width: 370, height: 370, marginBottom: 30, alignContent: 'center', alignSelf: 'center', borderRadius: 370/2}}/>
                <Text style={{marginBottom: 10, color: 'white', fontSize: 24}}>Place train line inside circle</Text>
                  <Ionicons
                    name="ios-radio-button-off"
                    color="white"
                    size={100}
                  />
                </TouchableOpacity>
              </View>
            </Camera>
          )}

          {/*LOADING SCREEN DISPLAY*/}
          {this.state.isLoading && (
            <View>
              <ActivityIndicator size="large" color="white" />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                <Text
                  style={{ textAlign: "center", fontSize: 24, color: "white" }}
                >
                  Your data is being held by a train dispatcher
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    } else {
      //If the photo has been processed, display the ScheduleList component
      return (
        <ScheduleList
          currentLine={this.state.currentLine}
          closeNextTrains={this.closeNextTrains}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  cameraStyle: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  onPress: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  permissionText: {
    textAlign: "center"
  },
  permissionTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1
  }
});
