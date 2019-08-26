const functions = require('firebase-functions');

//This library handles the protocol buffers required to get the MTA data in a useful format
const MtaGtfsRealtimeBindings = require('mta-gtfs-realtime-bindings');
const MtaInfo = require('mta-gtfs');
//Request-promise is used instead of something like axios because it's simpler to decode binary responses using a protocol buffer in r-p
const rp = require('request-promise');
const mtaState = new MtaInfo({
  key: "3f1463633a6a8c127fcd6560f9d6299a",
  feed_id: 1 
});


exports.getMTAState = functions.https.onRequest(async (req, res) => {
  
  // Getting the state of subway traffic
  try {
    const result = await mtaState.status('subway')
    res.send(result);
  } catch (err) {
    console.error(err);
  }
  
})

exports.queryMTA = functions.https.onRequest(async (req, res) => {
  const MTA_URL = `http://datamine.mta.info/mta_esi.php?key=3f1463633a6a8c127fcd6560f9d6299a&feed_id=${req.body.feedId}`
  const CURRENT_STATION = { id: req.body.station[0], name: req.body.station[1] }
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

    //Entity = a single train
    feed.entity.forEach((entity) => {
      //Each train's ID will include the number/letter of it's line
      if (entity.trip_update) {
        if (entity.trip_update.trip.route_id.includes(CURRENT_LINE)) {
          //Pushing all the relevant trains to an array for filtering
          relevantTrains.push(entity)
        }
      }
    });

  //These hold the arrival times of the trains for this station
  let uptownArrivals = []
  let downtownArrivals = []

  //A helper funciton that filters the trains for schedules containing the current stop and then logs the arrival time at this stop
  const filterAndLog = (scheduleArray, stopId) => {
    let uptownArrival = false
    let downtownArrival = false

    //Checking each stop of the train for whether it matches our current stop
    scheduleArray.forEach(stop => {
      if (stop.stop_id === stopId + 'N') {
        uptownArrival = stop
      } else if (stop.stop_id === stopId + 'S') {
        downtownArrival = stop
      }
    })

    //Pushing any relevant stops to the arrays
    uptownArrival ? uptownArrivals.push(uptownArrival.arrival.time.low) : null
    downtownArrival ? downtownArrivals.push(downtownArrival.arrival.time.low) : null
  }

  //Filtering for trains scheduled to stop at the current stop and then logging the arrival times
  relevantTrains.forEach(train => filterAndLog(train.trip_update.stop_time_update, CURRENT_STATION.id))

  res.send([uptownArrivals, downtownArrivals])
})
