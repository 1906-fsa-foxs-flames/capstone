# MTALens
Have you ever found yourself in a subway station without a train time display? Or found yourself outside a station, wondering if you have time for a coffee before your train comes?  Or staring at a congested train, unsure if you need to try and squeeze in or if there's another train right behind?

With MTALens, we can solve all these conundrums and more. All you have to do is point and shoot, and the next 4 trains coming to your station are displayed. MTALens is also social, allowing riders to alert other users if a train is congested as well as providing a chat with all current users to discuss the current state of the MTA.

Next train coming in a 34 minutes? Go grab a drink or food instead of waiting for a stuffy platform.

Upcoming train crowded but the next train is coming in 2 minutes? Wait for the next one and so you don't have to be packed like sardines.

MTALens-- powered by the users, for the users

## Getting Started
These instructions will get you a copy of the project up and running on your local device soley for development and testing purposes.

## Prerequisites
Install Expo on your phone or emulator-- only on iOS and Android. Sorry windows users. 
1.  Clone the git onto your machine and run ```npm install``` in your terminal.
2.  Then run ```npm start```.
3. Scan QR code in terminal or the localhost, then be on your to transversing the subway like a pro!
* Note: this project requires access to a Google Firebase Project and a Google Vision API account.  We may disable our linked Google accounts once this project is complete to avoid accidential billing.

## Features
* Take a photo of a subway sign and return the next four uptown/downtown trains to your station, specific to the line that was photographed.

![OCR Gif](https://media.giphy.com/media/eJuiOM9SXzfZmPR5Ad/giphy.gif)

* Users can report that a train is congested as a heads up to other users, and future users who see that train will receive an alert

![Congestion Gif](https://media.giphy.com/media/eHWFGNUB5LCUNKV3cV/giphy.gif)

* An animated map with a moving train representing the next train to arrive at your station

![ANIMATION GIF](https://media.giphy.com/media/Yl4plfeTktVF2sDEY6/giphy.gif)

(TODO: Resize and crop this .gif)

#### OCR recognition
* Point and shoot a picture of a train line
#### Cross Platform
* iOS and Android users rejoice!
#### Chat integration
* Connect with other users
* Notify if there are unexpected delays
#### User integration
* Users able to report train congestion
* Users can see other reports
#### Automatically detects the closest station
* No look ups necessary, we'll always know where you are ;)

## Built With
#### Backend
* [Firebase](https://firebase.google.com/)
* [Google Vision](https://cloud.google.com/vision/)
* [MTA API](http://web.mta.info/developers/)

#### Frontend
* [React-Native](https://facebook.github.io/react-native/)
* [Expo](https://expo.io/)

## Authors
* [Luke B.](https://github.com/lbuckheit)
* [Dzmitry M.](https://github.com/dzmitry-maslau)
* [Oleksii M.](https://github.com/omusinov)
* [Danny L.](https://github.com/dongledan)

## Acknowledgments

* TODO
