import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

export default class CustomTooltip extends Component {
  constructor(props) {
    super(props)
    //state components:
    //title: the text that appears on the button in the tooltip
    this.state = { title: 'Report congestion' }

    //Binding the methods
    this.markCongested = this.markCongested.bind(this)

    //A flag for whether this train is on the list of congested trains or not
    this.isCongested = props.congestedTrains.includes(props.trainTime[1])
  }

  //A method that changes the button text and marks the train congested in the DB
  markCongested() {
    this.setState({ title: 'Reported!' }, this.props.writeCongestedTrain(this.props.trainTime[0], this.props.trainTime[1]))
  }

  render() {
    return (
      <View style={styles.viewStyle}>

        {/* CHECKING THE ARRAY OF DELAYED TRAINS (CONSTRUCTED FROM THE DATABASE), AND DISPLAING THE APPROPRIATE TEXT*/}
        <Text style={styles.textStyle}>
          {this.isCongested && 'Users have reported this train is congested'}
          {!this.isCongested && 'No users have reported this train congested'}
        </Text>

        {/* DISPLAYING A BUTTON THAT WILL PUT THIS TRAIN ONTO THE CONGESTED TRAINS SECTION OF THE DB */}
        <Button titleStyle={styles.buttonTitleStyle} buttonStyle={styles.buttonButtonStyle} title={this.state.title} onPress={() => this.markCongested()} />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    height: 100,
    justifyContent: 'center'
  },
  textStyle: {
    textAlign: 'center',
    color: 'white'
  },
  buttonTitleStyle: {
    fontSize: 10,
    padding: 0
  },
  buttonButtonStyle: {
    width: 115,
    height: 25,
    padding: 0
  }
})
