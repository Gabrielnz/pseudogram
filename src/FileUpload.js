import React, { Component } from 'react'
import firebase from 'firebase'

class FileUpload extends Component {
  constructor () {
    super()

    this.state = {
      uploadValue: 0,
      picture: null
    }

    this.handleUpload = this.handleUpload.bind(this)
  }

  // evento que maneja la carga de una imagen
  handleUpload (event) {
    const file = event.target.files[0]
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`)
    const task = storageRef.put(file)

    // cuando el estado de la carga de la imagen cambia
    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

      this.setState({ uploadValue: percentage })
    }, err => {
      // cuando ocurre un error en la carga de la imagen
      console.log(err.message)
    }, () => {
      // cuando la carga de la imagen finaliza
      console.log(task.snapshot)
      this.setState({
        picture: task.snapshot.downloadURL
      })
    })
  }

  render () {
    return (
      <div>
        <progress value={this.state.uploadValue} max='100' />
        <br />
        <input type='file' onChange={this.handleUpload} />
        <br />
        <img width='320' src={this.state.picture} alt='' />
      </div>
    )
  }
}

export default FileUpload
