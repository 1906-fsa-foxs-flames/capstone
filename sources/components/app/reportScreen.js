import React from "react";
import { Text, View } from "react-native";
import styles from "../../variables/styles";
import TopToolBar from "./topToolBar";

import Camera from "./camera";

export default class ReportScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TopToolBar navigation={this.props.navigation} />
        <View style={styles.mainSpace}>
          <Camera />
        </View>
      </View>
    );
  }
}