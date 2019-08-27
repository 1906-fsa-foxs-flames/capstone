// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/database");

var firebaseConfig = {
  apiKey: "AIzaSyDFJrmYkjMr6bymsyonik7Xr6zL9SMlxtA",
  authDomain: "subwar-a2611.firebaseapp.com",
  databaseURL: "https://subwar-a2611.firebaseio.com",
  projectId: "subwar-a2611",
  storageBucket: "subwar-a2611.appspot.com",
  messagingSenderId: "909830506182",
  appId: "1:909830506182:web:ac670ea82577cee6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Write the data to the DB and then kill the connection
function writeTestData(testNumber, str) {
  firebase.database().ref('test-collection/' + testNumber).set({
    'test-field': str
  })
  .then(() => killConnection())
}

//Kill the firebase connection and log success
function killConnection() {
  firebase.app().delete().then(function() {
    console.log('connection closed')
  });
}

writeTestData(17, 'FARTS')
