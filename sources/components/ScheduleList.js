import React, { Component } from 'react'
import { View, Text } from 'react-native'

//This library handles the protocol buffers required to get the MTA data in a useful format
const MtaGtfsRealtimeBindings = require('gtfs-realtime-bindings');
const RNFetchBlob = require('rn-fetch-blob')

export default class ScheduleList extends Component {
  constructor() {
    super()
    this.state = { trains: [] }
  }

  componentDidMount() {
    const MTA_URL = 'http://datamine.mta.info/mta_esi.php?key=3f1463633a6a8c127fcd6560f9d6299a&feed_id=21'
    const CURRENT_STATION = { id: 'F20N', name: 'Bergen St.' }  //The 'N' refers to the train's direction
    const CURRENT_LINE = 'F'

    const newTrains = []

    //A helper funciton that filters the trains for schedules containing the current stop and then logs the arrival time at this stop
    const filterAndLog = (scheduleArray, stopId) => {
      let filtered = scheduleArray.filter(stop => stop.stop_id == stopId)

      //Currently this logs in UTC time.  Will eventually want to convert it to EST time
      filtered.length > 0 ? newTrains.push(new Date(filtered[0].arrival.time.low * 1000)) : null
    }

    //Need to send the r-p with null encoding because of the specifics of GTFS spec
    RNFetchBlob(MTA_URL, {
      method: 'GET',
      encoding: null,
    }).then((buf) => {
      console.log(buf, 'this is the buf')
      const feed = MtaGtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buf);
      console.log(feed)
      //This will hold the trains of the type we care about
      let relevantTrains = []

      //entity = a single train
      feed.entity.forEach((entity) => {
        //Each train's ID will include the number/letter of it's line
        if (entity.id.includes(CURRENT_LINE)) {
          if (entity.trip_update) {
            //Pushing all the relevant trains to an array for filtering
            relevantTrains.push(entity)
          }
        }
      });

      //Filtering for trains scheduled to stop at the current stop and then logging the arrival times
      relevantTrains.forEach(train => filterAndLog(train.trip_update.stop_time_update, CURRENT_STATION.id))

      this.setState({ trains: newTrains })

    }).catch(e => console.log(e));
  }

  render() {
    return (
      <View>{this.state.trains.map(x => <Text key={x}>{x}</Text>)}</View>
    )
  }
}
