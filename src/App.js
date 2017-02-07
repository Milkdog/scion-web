import React, { Component } from 'react'
import * as firebase from 'firebase'
import FontAwesome from 'react-fontawesome'

import Container from './Container/Container'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: false
    }

    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyC4SXAxLdw91GuxcYP_ys9JTKcTtTyyLxE",
      authDomain: "scion-character-sheet.firebaseapp.com",
      databaseURL: "https://scion-character-sheet.firebaseio.com",
      storageBucket: "scion-character-sheet.appspot.com",
      messagingSenderId: "266368524623"
    }

    firebase.initializeApp(firebaseConfig)
  }

  promptLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      // var token = result.credential.accessToken;
      // // The signed-in user info.
      const user = result.user;
      const userId = user.uid

      this.state = {
        database: firebase.database().ref('/users/').child(userId),
        isLoading: false,
        isLoggedIn: true
      }

      // // ...
    }).catch(function(error) {
      // // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // // The email of the user's account used.
      // var email = error.email;
      // // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential;
      // // ...
      console.log(error)
    })
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user === null) {
        this.promptLogin()
      }

      console.log('Logged in', user.uid)

      // Set DB base
      const database = firebase.database().ref('/users/').child(user.uid)

      this.setState({
        database,
        isLoading: false,
        isLoggedIn: true
      })
    })
  }

  render() {

    if (!this.state.isLoggedIn) {
      return <FontAwesome
        className="loader"
        name="spinner"
        size="5x"
      />
    }

    const database = this.state.database.child('Fionnlagh (Finn)')
    return (
      <Container database={ database } />
    )
  }
}

export default App;
