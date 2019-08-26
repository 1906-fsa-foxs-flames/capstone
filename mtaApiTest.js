var Mta = require("mta-gtfs");
var moment = require("moment");
const axios = require('axios');

var mta = new Mta({
  key: "3f1463633a6a8c127fcd6560f9d6299a", // only needed for mta.schedule() method
  feed_id: 1 // optional, default = 1
});

// TO GET MTA STOP INFO
// mta.stop("635").then(function(result) {
//   console.log(result);
// });

// TO GET MTA STATUS
// mta.status("subway").then(function(result) {
//   console.log(result);
// });

// TO GET MTA SCHEDULE
// mta.schedule((stop = "635")).then(function(result) {
//   console.log(result.schedule[stop]["N"]);
// });

// TO GET MTA SCHEDULE FORMATTED
// mta.schedule((stop = "635")).then(function(result) {
//   let schedule = result.schedule[stop]["N"].map(train =>
//     moment.unix(train.arrivalTime).format("MMMM Do YYYY, h:mm:ss a")
//   );
//   console.log(schedule);
// });

const myPromise = new Promise((resolve, reject) => {
  const subwayState = axios.get('https://us-central1-subwar-a2611.cloudfunctions.net/getMTAState');
  resolve(subwayState);
}) 

myPromise.then(
  result => {
    console.log(result.data);
  }
);
