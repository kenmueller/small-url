import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'

admin.initializeApp()

const app = express()
const firestore = admin.firestore()

const _app = functions.https.onRequest(app)
export { _app as app }

app.get('/:url', ({ params: { url } }, res) =>
	firestore.collection('urls').where('source', '==', url).get().then(({ empty, docs }) =>
		res.redirect(
			empty
				? '/'
				: normalizeUrl(docs[0].get('destination'))
		)
	)
)

const normalizeUrl = (url: string): string =>
	url.startsWith('https://') || url.startsWith('http://') ? url : `https://${url}`
