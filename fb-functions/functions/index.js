const functions = require('firebase-functions');

//This library handles the protocol buffers required to get the MTA data in a useful format
const MtaGtfsRealtimeBindings = require('mta-gtfs-realtime-bindings');
//Request-promise is used instead of something like axios because it's simpler to decode binary responses using a protocol buffer in r-p
const rp = require('request-promise')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.queryMTA = functions.https.onRequest(async (req, res) => {

  //For testing purposes, these values are hardcoded.  Eventually they will be dynamic
  const MTA_URL = `http://datamine.mta.info/mta_esi.php?key=3f1463633a6a8c127fcd6560f9d6299a&feed_id=${req.body.feedId}`
  const CURRENT_STATION = { id: 'F20N', name: 'Bergen St.' }  //The 'N' refers to the train's direction
  const CURRENT_LINE = req.body.currentLine

  //Hitting the MTA API
  let arrivals = await rp({
    method: 'GET',
    url: MTA_URL,
    encoding: null
  })

  //Decoding the GTFS data
  const feed = MtaGtfsRealtimeBindings.transit_realtime.FeedMessage.decode(arrivals)

  //Holds all the trains that match our criteria
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

  //This will hold the arrival times of the trains for this station
  let arrivalTimes = []

  //A helper funciton that filters the trains for schedules containing the current stop and then logs the arrival time at this stop
  const filterAndLog = (scheduleArray, stopId) => {
    let filtered = scheduleArray.filter(stop => stop.stop_id === stopId)

    //Currently this logs in UTC time.  Will eventually want to convert it to EST time
    filtered.length > 0 ? arrivalTimes.push(new Date(filtered[0].arrival.time.low * 1000)) : null
  }

  //Filtering for trains scheduled to stop at the current stop and then logging the arrival times
  relevantTrains.forEach(train => filterAndLog(train.trip_update.stop_time_update, CURRENT_STATION.id))

  res.send(arrivalTimes)
})
