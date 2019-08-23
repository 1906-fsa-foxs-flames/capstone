import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import apiKeys from '../../variables/apiKeys';
import * as firebase from 'firebase';
import ScheduleList from '../ScheduleList'

import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator'

firebase.initializeApp(apiKeys.firebaseConfig);

export default class Cam extends React.Component {
  constructor() {
    super()
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      photoProcessed: false,
      currentLine: ''
    }
    this.closeNextTrains = this.closeNextTrains.bind(this)
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    })
  }

  closeNextTrains() {
    this.setState({ photoProcessed: false })
  }

  snap = async () => {
    try {
      if (this.camera) {

        //Taking the photo
        let photo = await this.camera.takePictureAsync();

        //Compressing the photo
        photo = await ImageManipulator.manipulateAsync(photo.uri, {}, {compress: 0.375})

        //Encoding the photo as base64 so that it can be fed into Google Vision API directly
        let BASE_64_IMAGE = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64})

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
        let OCRtext = responseJson.responses[0].fullTextAnnotation.text
        let split = OCRtext.split('')
        this.setState({ photoProcessed: true, currentLine: split[0] })
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    let ref = firebase
      .storage()
      .ref()
      .child("images/" + imageName);
    let img = await ref.put(blob);
    blob.close();
    return img.ref.getDownloadURL();
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (!this.state.photoProcessed) {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View style={styles.cameraStyle}>
              <TouchableOpacity style={styles.onPress} onPress={this.snap}>
                <Text style={styles.cameraButton}> o </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    } else {
      return (
        <ScheduleList currentLine={this.state.currentLine} closeNextTrains={this.closeNextTrains}/>
      )
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
  cameraButton: {
    fontSize: 150,
    color: "white",
    fontFamily: "Courier New"
  }
});
