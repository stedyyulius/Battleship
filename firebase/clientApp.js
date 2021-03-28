import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

console.log(clientCredentials)

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}else {
  firebase.app(); // if already initialized, use that one
}


export default firebase.database()
