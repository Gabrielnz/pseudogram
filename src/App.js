import React, { Component } from 'react'
import firebase from 'firebase'
import './App.css'
import FileUpload from './FileUpload'

class App extends Component {
  constructor () {
    super()
    this.state = {
      user: null,
      pictures: [],
      uploadValue: 0
    }

    this.handleAuth = this.handleAuth.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user })
    })

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
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
          <FileUpload onUpload={this.handleUpload} />

          {
            this.state.pictures.map((picture, index) => (
              <div key={index}>
                <img src={picture.image} alt='' />
                <br />
                <img width='100' src={picture.photoURL} alt={picture.displayName} />
                <br />
                <span>{picture.displayName}</span>
              </div>
            )).reverse()
          }
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

  // evento que maneja la carga de una imagen
  handleUpload (event) {
    const file = event.target.files[0]
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`)
    const task = storageRef.put(file)
    console.log('entra a handleUpload')

    // cuando el estado de la carga de la imagen cambia
    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

      this.setState({ uploadValue: percentage })
      console.log(this.state.uploadValue)
    }, err => {
      // cuando ocurre un error en la carga de la imagen
      console.log(err.message)
    }, () => {
      // cuando la carga de la imagen finaliza
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      }

      const dbRef = firebase.database().ref('pictures')
      const newPicture = dbRef.push()
      newPicture.set(record)
      console.log('termina la carga')
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
