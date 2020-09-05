const admin = require('firebase-admin')
const serviceAccount = require('../config/serviceAccountKey.json')
require('dotenv').config()

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
})

module.exports = admin.database()