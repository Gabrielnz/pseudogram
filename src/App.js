import React, { Component } from 'react'
import firebase from 'firebase'
import './App.css'
import FileUpload from './FileUpload'

class App extends Component {
  constructor () {
    super()
    this.state = {
      user: null
    }

    this.handleAuth = this.handleAuth.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user })
    })
  }

  renderLoginButton () {
    // si el usuario ha iniciado sesion
    if (this.state.user) {
      return (
        <div>
          <img width='200' src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}>Salir</button>
          <FileUpload />
        </div>
      )
    } else {
      // si no
      return (
        <button onClick={this.handleAuth}>Login con Google</button>
      )
    }
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(provider)
    .then(result => {
      console.log(`${result.user.email} ha iniciado sesion`)
    })
    .catch(err => {
      console.log(`Error - ${err.code}: ${err.message}`)
    })
  }

  handleLogout () {
    firebase.auth().signOut()
    .then(() => {
      console.log(`El usuario ha salido`)
    })
    .catch(err => {
      console.log(`Error - ${err.code}: ${err.message}`)
    })
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>Pseudogram</h2>
        </div>
        <div className='App-intro'>
          { this.renderLoginButton() }
        </div>
      </div>
    )
  }
}

export default App
