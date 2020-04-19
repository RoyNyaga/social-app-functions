const functions = require('firebase-functions')

const { db } = require('./util/admin')

const app = require('express')()

const FBAuth = require('./util/fbAuth')

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnSCream,
  likeScream,
  unlikeScream,
  deleteScream
} = require('./handlers/screams')
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require('./handlers/users')

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
app.delete('/scream/:screamId', FBAuth, deleteScream)
app.get('/scream/:screamId/like', FBAuth, likeScream)
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream)
app.post('/scream/:screamId/comment', FBAuth, commentOnSCream)
// users route
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthenticatedUser)
app.get('/user/:handle', getUserDetails)
app.post('/notifications', FBAuth, markNotificationsRead)

exports.api = functions.https.onRequest(app)

exports.createNotificationOnlike = functions.region('us-central1').firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          })
        }
      })
      .catch((err) => console.error(err))
  })

exports.deleteNotificationOnUnlike = functions.region('us-central1').firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err)
      })
  })

exports.createNotificationOnComment = functions.region('us-central1').firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamid: doc.id
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  })

exports.onUserImageChange = functions.firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data())
    console.log(change.after.data())
    if (change.before.data().imagUrl !== change.after.data().imagUrl) {
      console.log('image has changed')
      var batch = db.batch()
      return db.collection('screams').where('userHandle', '==', change.before.data().handle).get()
        .then((data) => {
          data.forEach(doc => {
            var scream = db.doc(`/screams/${doc.id}`)
            batch.update(scream, { userImage: change.after.data().imagUrl })
          })
          return batch.commit()
        })
    }
  })

exports.onScreamDelete = functions.firestore.document('/screams/{screamId}')
  .onDelete((snapshot, context) => {

  })
