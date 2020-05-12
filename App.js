import React from 'react';
import AppContainer from './components/AppContainer'
import firebase from 'firebase'

FirebaseConfig = {
  apiKey: "AIzaSyAW4xH2KpvKyKoPm61O7CQ0SfpCHPa--v0",
  authDomain: "shredr-da4af.firebaseapp.com",
  databaseURL: "https://shredr-da4af.firebaseio.com",
  projectId: "shredr-da4af",
  storageBucket: "shredr-da4af.appspot.com",
  messagingSenderId: "75199916530",
  appId: "1:75199916530:web:c5bd75714ed2cdb39b236b",
  measurementId: "G-XTTMT0EEX8"
}

firebase.initializeApp(FirebaseConfig)

class App extends React.Component {

  render() {
    return (
        <AppContainer />
    )
  } 
}

export default App











