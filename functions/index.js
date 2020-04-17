const functions = require('firebase-functions')

const app = require('express')()

const FBAuth = require('./util/fbAuth')

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnSCream,
  likeScream,
  unlikeScream
} = require('./handlers/screams')
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello world!')
})

// Screams route
app.get('/screams', getAllScreams)
app.post('/scream', FBAuth, postOneScream)
app.get('/scream/:screamId', getScream)
// Todo
// delete scream
app.get('/scream/:screamId/like', FBAuth, likeScream)
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream)
app.post('/scream/:screamId/comment', FBAuth, commentOnSCream)
// users route
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthenticatedUser)

exports.api = functions.https.onRequest(app)
