Team name: Fox’s Flames
Team members: Luke Buckheit, Danny Li, Dzmitry Maslau, Oleksii Musinov

MVP goals
-App will use a React Native/Firebase framework
-User can scan a subway platform sign with their phone and the app will use Google Cloud Vision to do optical character recognition (OCR) and pick out the text
-The text will be combined with location data from the phone (what station the user is at) and sent to the MTA’s live data feed API (if no GPS, be able to choose a station from a local list)
-The MTA API will return to the app a list of upcoming stops on the line, when the next several trains are due, whether the train is running express, whether there are any delays on the line, and whether there are any service changes
-The train data will be displayed to the user, and some details will be stored in the user’s history for later viewing/analysis

Stretch goals
-A live map that shows a moving sprite of the nearest train
-Data visualization of user history (how many trains on this line have been delayed for the user, etc.)
-Suggest faster alternate routes
-Networked user inputs (like Pigeon; is the train crowded, is the station flooded, etc)
