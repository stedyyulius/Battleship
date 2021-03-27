
import admin from "firebase-admin";

import serviceAccount from "../serviceAccountKey.json";

if (!admin.apps.length) {
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

export default admin
