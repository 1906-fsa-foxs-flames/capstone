import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// import vision from '@google-cloud/vision';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

export default class Cam extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' })
  }
  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      alert(photo.uri)
    }
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
                onPress={(this.snap)}>
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