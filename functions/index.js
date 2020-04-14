const functions = require('firebase-functions')

const app = require('express')()

const FBAuth = require('./util/fbAuth')

const { getAllScreams, postOneScream } = require('./handlers/screams')
const { signup, login } = require('./handlers/users')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello world!')
})

// Screams route
app.get('/screams', getAllScreams)
app.post('/scream', FBAuth, postOneScream)

// users route
app.post('/signup', signup)
app.post('/login', login)

exports.api = functions.https.onRequest(app)
