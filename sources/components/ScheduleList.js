import React, { Component } from 'react'
import { View, Text, Alert, ScrollView } from 'react-native'
import { Card, Button } from 'react-native-elements'
import axios from 'axios'

import UserLocation from './UsersMap'
import NearestCity from "../../trainStopInfo";

export default class ScheduleList extends Component {
  constructor(props) {
    super(props)
    this.state = { trains: [] }
    this.feedIds = {
      '123456S': 1,
      'ACEHS': 26,
      'NQRW': 16,
      'BDFM': 21,
      'L': 2,
      'G': 31,
      'JZ': 36,
      '7': 51
    }
  }

  async sendToAPI(position) {
    //Getting the station you're at
    const station = NearestCity(position.coords.latitude, position.coords.longitude)

    //Finding which MTA feed to query in the firebase function
    let feedKeys = Object.keys(this.feedIds)
    feedKeys = feedKeys.filter(key => key.includes(this.props.currentLine))
    let feedId = this.feedIds[feedKeys[0]]

    //Querying the firebase function and setting the trains on state
    let arrivals = await axios.post('https://us-central1-subwar-a2611.cloudfunctions.net/queryMTA', { feedId, currentLine: this.props.currentLine, station })
    this.setState({ trains: arrivals.data })
  }

  componentDidMount() {
    //Gets the user's location in the background for use in calculating what station a user is at
    navigator.geolocation.getCurrentPosition(position => this.sendToAPI(position))
  }

  render() {
    const now = new Date().getTime() / 1000
    const sortedTrains = this.state.trains.sort((a, b) => a - b)
    return (
      <ScrollView style={{flex:1}}>
        <View style={{height:300}}>
          <UserLocation />
        </View>
        <View>
          <Button onPress={() => this.props.closeNextTrains()} title='Close' />
          <Card title='Next Trains' containerStyle={{ flex: 1, alignItems: 'center' }}>
          {sortedTrains.map(function(trainTime) {
            if (Math.ceil((trainTime - now) / 60) >= 0) {
              return <Text key={trainTime}>{Math.ceil((trainTime - now) / 60)} Min. away</Text>
            } else {
              return null
            }
          })}
          </Card>
        </View>
      </ScrollView>
    )
  }
}
