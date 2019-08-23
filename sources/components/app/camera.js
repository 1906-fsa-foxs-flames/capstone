import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import apiKeys from '../../variables/apiKeys';
import * as firebase from 'firebase';
import ScheduleList from '../ScheduleList'

import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator'
import { Ionicons } from '@expo/vector-icons';

firebase.initializeApp(apiKeys.firebaseConfig);

export default class Cam extends React.Component {
  constructor() {
    super()
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      photoProcessed: false,
      currentLine: '',
      isLoading: false
    }
    this.closeNextTrains = this.closeNextTrains.bind(this)
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
      isLoading: false
    })
  }

  closeNextTrains() {
    this.setState({ photoProcessed: false, isLoading: false })
  }

  snap = async () => {
    try {
      if (this.camera) {
        this.setState({isLoading: true})
        //Taking the photo
        let photo = await this.camera.takePictureAsync();

        //Compressing the photo
        photo = await ImageManipulator.manipulateAsync(photo.uri, {}, {compress: 0.4})

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
      this.setState({isLoading: false})
      Alert.alert('Image processing failed - please try again or yell your train line into the microphone');
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
        
        <View style={{ flex: 1 , justifyContent: 'center'}}>
          {!this.state.isLoading
          ? (<Camera
            style={{ flex: 5 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View style={styles.cameraStyle}>
              <TouchableOpacity style={styles.onPress} onPress={this.snap}>
                <Ionicons name="ios-radio-button-off" color='white' size={100} />
              </TouchableOpacity>
            </View>
          </Camera>)
          :
          (
            <View>
          <ActivityIndicator size='large'/>
            <View style={{flexDirection: "row", justifyContent: "center", alignContent:"center"}}>
              <Text textAlign='center'>Your data is being held by a train dispatcher</Text>
            </View>
          </View>)
          }
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
  }
});
