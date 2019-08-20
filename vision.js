let apiKeys = require('./sources/variables/apiKeys');
const firebase = require('firebase');

firebase.initializeApp(apiKeys.firebaseConfig);

async function quickstart() {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: './keys.json'
  });

  // Performs label detection on the image file
  const [result] = await client.textDetection('./assets/icon.png');
  const detections = result.textAnnotations;
  console.log('Text:');
  detections.forEach(text => console.log(text));
}

quickstart()