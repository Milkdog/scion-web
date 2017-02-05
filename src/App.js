import React, { Component } from 'react'
import * as firebase from "firebase"

import Container from './Container/Container'

import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyC4SXAxLdw91GuxcYP_ys9JTKcTtTyyLxE",
      authDomain: "scion-character-sheet.firebaseapp.com",
      databaseURL: "https://scion-character-sheet.firebaseio.com",
      storageBucket: "scion-character-sheet.appspot.com",
      messagingSenderId: "266368524623"
    };
    firebase.initializeApp(firebaseConfig);

    const provider = new firebase.auth.FacebookAuthProvider()

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    })

    this.state = {
      firebase
    }

  }

  render() {
    return (
      <Container />
    )
  }
}

export default App;
