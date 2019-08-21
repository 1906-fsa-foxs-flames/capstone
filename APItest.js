//This library handles the protocol buffers required to get the MTA data in a useful format
const MtaGtfsRealtimeBindings = require('mta-gtfs-realtime-bindings');
//Request-promise is used instead of something like axios because it's simpler to decode binary responses using a protocol buffer in r-p
const rp = require('request-promise')

//First, combine the phone's location data with the list of stations and a 'distance' helper function to get the current station

//Then, use the camera to ID the relevant line, which will be used to select the proper MTA data feed for query

//For the purposes of developing the API query code, the data feed URL, current station, and current line will be hardcoded

const MTA_URL = 'http://datamine.mta.info/mta_esi.php?key=3f1463633a6a8c127fcd6560f9d6299a&feed_id=21'
const CURRENT_STATION = { id: 'F20N', name: 'Bergen St.' }  //The 'N' refers to the train's direction
const CURRENT_LINE = 'F'

//A helper funciton that filters the trains for schedules containing the current stop and then logs the arrival time at this stop
const filterAndLog = (scheduleArray, stopId) => {
  let filtered = scheduleArray.filter(stop => stop.stop_id == stopId)

  //Currently this logs in UTC time.  Will eventually want to convert it to EST time
  filtered.length > 0 ? console.log('Arrival Time: ', new Date(filtered[0].arrival.time.low * 1000)) : null
}

//Need to send the r-p with null encoding because of the specifics of GTFS spec
rp({
  method: 'GET',
  url: MTA_URL,
  encoding: null,
}).then((buf) => {
  console.log(buf)
  const feed = MtaGtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buf);

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

}).catch(e => console.log(e));
