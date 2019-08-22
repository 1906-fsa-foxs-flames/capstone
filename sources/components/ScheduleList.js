import React, { Component } from 'react'
import { View, Text, Alert } from 'react-native'
import axios from 'axios'

//This library handles the protocol buffers required to get the MTA data in a useful format

export default class ScheduleList extends Component {
  constructor() {
    super()
    this.state = { trains: [] }
  }

  async componentDidMount() {
    console.log('a')
    //let a = await fetch('https://us-central1-subwar-a2611.cloudfunctions.net/queryMTA')
    let a = await axios.get('https://us-central1-subwar-a2611.cloudfunctions.net/queryMTA')
    console.log('b')
    console.log(a)
  }

  render() {
    return (
      <View>{this.state.trains.map(x => <Text key={x}>{x}</Text>)}</View>
    )
  }
}
