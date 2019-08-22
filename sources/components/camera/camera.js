import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import apiKeys from '../../variables/apiKeys';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import ScheduleList from '../ScheduleList'

import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

firebase.initializeApp(apiKeys.firebaseConfig);

export default class Cam extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photoProcessed: false,
    currentLine: ''
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    })
  }

  snap = async () => {
    try {
      if (this.camera) {
        const photo = await this.camera.takePictureAsync();
        let uploadUrl = await this.uploadImage(photo.uri, "test");
        let body = JSON.stringify({
          requests: [
            {
              features: [{ type: "TEXT_DETECTION", maxResults: 5 }],
              image: {
                source: {
                  imageUri: uploadUrl
                }
              }
            }
          ]
        });
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

  onChooseImagePress = async () => {
    let result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      this.uploadImage(result.uri, "test")
        .then(() => {
          alert("Success");
        })
        .catch(error => {
          alert(error);
        });
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
        <ScheduleList currentLine={this.state.currentLine}/>
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
