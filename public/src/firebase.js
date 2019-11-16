import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp({
	apiKey: 'AIzaSyBgzlDC2hOSn7KFy4L0WvLRR0v8rv1HrD8',
    authDomain: 'smlurl.firebaseapp.com',
    databaseURL: 'https://smlurl.firebaseio.com',
    projectId: 'smlurl',
    storageBucket: 'smlurl.appspot.com',
    messagingSenderId: '207397960050',
    appId: '1:207397960050:web:9293e1f1599f4705e345eb',
    measurementId: 'G-0EBRDNR315'
})

export default firebase
