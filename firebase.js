import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyDzHbzEZaUMvgZ1sbfT_ODTpa8_5V_Wojw',
  authDomain: 'next-468f9.firebaseapp.com',
  projectId: 'next-468f9',
  storageBucket: 'next-468f9.appspot.com',
  messagingSenderId: '505536800530',
  appId: '1:505536800530:web:5a0a28f553b12db78ff5cb',
}

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()

const db = app.firestore()

export default db
