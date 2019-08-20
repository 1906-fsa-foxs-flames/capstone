import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
// import vision from '@google-cloud/vision';
import apiKeys from '../../variables/apiKeys';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

firebase.initializeApp(apiKeys.firebaseConfig);

export default class Cam extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const { rollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ 
      hasCameraPermission: status === 'granted',
      hasCameraRollPermission: status === 'granted'
   })
  }
  snap = async () => {
    try {
      if (this.camera) {
        const photo = await this.camera.takePictureAsync();
        Alert.alert('Success!')
        this.uploadImage(photo.uri, 'test')
      }
    } catch(error) {
      alert(error);
    }
  }

  onChooseImagePress = async() => {
    let result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      this.uploadImage(result.uri, "test")
      .then(() => {
        alert("Success");
      })
      .catch((error) => {
        alert(error);
      });
    }
  }

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    let ref = firebase.storage().ref().child('images/' + imageName);
    return ref.put(blob);
  }

  //     // Creates a client
  //     const client = new vision.ImageAnnotatorClient({
  //       keyFilename: './capstone.json'
  //     });
    
  //     // Performs label detection on the image file
  //     const [result] = await client.textDetection(photo.uri);
  //     const detections = result.textAnnotations;
  //     console.log('Text:');
  //     detections.forEach(text => console.log(text));
  //   }
  // }
  
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />
    }
    else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    }
    else {
      return ( 
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} 
            ref={ref => {
              this.camera = ref;
            }}>
            <View style={styles.cameraStyle}>
              <TouchableOpacity style={styles.onPress}
                onPress={this.snap}>
                <Text style={styles.cameraButton}> o </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  cameraStyle: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  onPress: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  cameraButton: {
    fontSize: 150, 
    color: 'white', 
    fontFamily: 'Courier New' 
  }
});