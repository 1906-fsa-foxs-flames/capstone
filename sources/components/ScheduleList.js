import React, { Component } from 'react'
import { View, Text, Alert, ScrollView } from 'react-native'
import { Card, Button } from 'react-native-elements'
import axios from 'axios'

import UserLocation from './UsersMap'
import NearestCity from "../../trainStopInfo";

export default class ScheduleList extends Component {
  constructor(props) {
    super(props)
    this.state = { uptownTrains: [], downtownTrains: [] }
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
    this.setState({ uptownTrains: arrivals.data[0].sort((a, b) => a - b), downtownTrains: arrivals.data[1].sort((a, b) => a - b)})
  }

  componentDidMount() {
    //Gets the user's location in the background for use in calculating what station a user is at
    navigator.geolocation.getCurrentPosition(position => this.sendToAPI(position))
  }

  render() {
    //For rendering the times as relative instead of absolute
    const now = new Date().getTime() / 1000

    //For rendering a maximum number of trains (who cares if there's a train coming in an hour and a half?)
    let uptownCounter = 0
    let downtownCounter = 0
    return (
      <ScrollView style={{flex:1}}>
        <View style={{height:300}}>
          <UserLocation smaller={true} />
        </View>
        <View>
          <Text style={{ textAlign: 'center' }}>Next {this.props.currentLine} Trains</Text>
          <Card title='Uptown' containerStyle={{ flex: 1, alignItems: 'center' }}>
          {this.state.uptownTrains.map(function(trainTime) {
            if (Math.ceil((trainTime - now) / 60) >= 0 && uptownCounter < 4) {
              uptownCounter++
              return <Text key={trainTime} style={{ textAlign: 'center' }}>{Math.ceil((trainTime - now) / 60)} Min. away</Text>
            } else {
              return null
            }
          })}
          </Card>
          <Card title='Downtown' containerStyle={{ flex: 1, alignItems: 'center' }}>
          {this.state.downtownTrains.map(function(trainTime) {
            if (Math.ceil((trainTime - now) / 60) >= 0 && downtownCounter < 4) {
              downtownCounter++
              return <Text key={trainTime} style={{ textAlign: 'center' }}>{Math.ceil((trainTime - now) / 60)} Min. away</Text>
            } else {
              return null
            }
          })}
          </Card>
          <Button onPress={() => this.props.closeNextTrains()} title='Back to Camera' style={{ padding: 15 }}/>
        </View>
      </ScrollView>
    )
  }
}
