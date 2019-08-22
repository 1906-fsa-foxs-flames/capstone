import React, { Component } from 'react'
import { View, Text, Alert } from 'react-native'
import axios from 'axios'

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

  async componentDidMount() {
    console.log(this.props.currentLine, 'CURRENT LINE')
    let feedKeys = Object.keys(this.feedIds)
    feedKeys = feedKeys.filter(key => key.includes(this.props.currentLine))
    let feedId = this.feedIds[feedKeys[0]]
    console.log(feedId)
    let arrivals = await axios.post('https://us-central1-subwar-a2611.cloudfunctions.net/queryMTA', { feedId, currentLine: this.props.currentLine })
    this.setState({ trains: arrivals.data })
  }

  render() {
    return (
      <View>{this.state.trains.map(x => <Text key={x}>{x}</Text>)}</View>
    )
  }
}
