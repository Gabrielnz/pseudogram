import React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'
import App from './App'
import './index.css'

// inicializando firebase con la configuracion necesaria
firebase.initializeApp({
  apiKey: 'AIzaSyDjFgnKOcyqO1yGCxUAQiCwZQnThkf4hy8',
  authDomain: 'pseudogram-b71a6.firebaseapp.com',
  databaseURL: 'https://pseudogram-b71a6.firebaseio.com',
  storageBucket: 'pseudogram-b71a6.appspot.com',
  messagingSenderId: '1088358105829'
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
