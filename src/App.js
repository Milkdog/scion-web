import React, { Component } from 'react'
import * as firebase from 'firebase'
import FontAwesome from 'react-fontawesome'

import Container from './Container/Container'
import SelectCharacter from './SelectCharacter'

import './App.css'

const storageCharacterKey = '@scion:character'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: false,
      character: ''
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

    firebase.auth().signInWithRedirect(provider).then(function(result) {
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
    const storedCharacter = localStorage.getItem(storageCharacterKey)
    this.setState({
      character: storedCharacter
    })

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

  setCharacter(name) {
    localStorage.setItem(storageCharacterKey, name)

    this.setState({
      character: name
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

    if (!this.state.character) {
      return <SelectCharacter database={ this.state.database } doSetCharacter={ this.setCharacter.bind(this) } />
    }

    const database = this.state.database.child(this.state.character)
    return (
      <Container database={ database } character={ this.state.character } doSetCharacter={ this.setCharacter.bind(this) } />
    )
  }
}

export default App;
