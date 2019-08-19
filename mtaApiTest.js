var Mta = require("mta-gtfs");
var moment = require("moment");

var mta = new Mta({
  key: "3f1463633a6a8c127fcd6560f9d6299a", // only needed for mta.schedule() method
  feed_id: 1 // optional, default = 1
});

// TO GET MTA STOP INFO
// mta.stop(635).then(function(result) {
//   console.log(result);
// });

// TO GET MTA STATUS
// mta.status("subway").then(function(result) {
//   console.log(result);
// });

// TO GET MTA SCHEDULE
// mta.schedule((train = 635)).then(function(result) {
//   console.log(result.schedule[train]["N"]);
// });

// TO GET MTA SCHEDULE FORMATTED
// mta.schedule((train = 635)).then(function(result) {
//   let schedule = result.schedule[train]["N"].map(train =>
//     moment.unix(train.arrivalTime).format("MMMM Do YYYY, h:mm:ss a")
//   );
//   console.log(schedule);
// });
