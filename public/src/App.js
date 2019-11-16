import React from 'react'
import * as Semantic from 'semantic-ui-react'

import firebase from './firebase'

const firestore = firebase.firestore()

export default class extends React.Component {
	state = { input: '', urlExtension: '' }
	
	onInputChange = async ({ target: { value } }) => {
		this.setState({ input: value })
		if (!value)
			return
		this.setState({ urlExtension: '' })
		const { urlExtension, isNew } = await this.calculateOutput(value)
		this.setState({ urlExtension })
		if (isNew) {
			firestore.doc('values/current').set({
				value: this.calculateNextSource(urlExtension)
			})
			firestore.collection('urls').add({
				source: urlExtension,
				destination: value
			})
		}
	}
	
	calculateOutput = url =>
		firestore.collection('urls').where('destination', '==', url).get().then(({ empty, docs }) =>
			empty
				? firestore.doc('values/current').get().then(current => ({
					urlExtension: current.get('value'),
					isNew: true
				}))
				: {
					urlExtension: docs[0].get('source'),
					isNew: false
				}
		)
	
	calculateNextSource = currentSource => {
		const parts = currentSource.split('')
		const { length } = parts
		const incrementedCharacter = this.incrementCharacter(parts[length - 1])
		return incrementedCharacter
			? `${parts.slice(0, length - 1).join('')}${incrementedCharacter}`
			: `${currentSource}0`
	}
	
	incrementCharacter = character => {
		if (/[0-9]/.test(character))
			return character === '9'
				? 'a'
				: (parseInt(character) + 1).toString()
		if (/[a-z]/.test(character))
			return character === 'z'
				? 'A'
				: (() => {
					const nextCharacter = String.fromCharCode(character.charCodeAt(0) + 1)
					return nextCharacter === '{'
						? null
						: nextCharacter
				})()
		if (/[A-Z]/.test(character))
			return character === 'Z'
				? null
				: (() => {
					const nextCharacter = String.fromCharCode(character.charCodeAt(0) + 1)
					return nextCharacter === '['
						? null
						: nextCharacter
				})()
		return null
	}
	
	renderOutput = () => {
		const { urlExtension } = this.state
		return urlExtension
			? <>https://smlurl.web.app/{urlExtension}</>
			: (
				<>
					<Semantic.Dimmer active inverted>
						<Semantic.Loader inverted>Loading</Semantic.Loader>
					</Semantic.Dimmer>
					<Semantic.Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
				</>
			)
	}
	
	render = () => (
		<div style={{ marginTop: '20px' }}>
			<Semantic.Container>
				<Semantic.Header as="h1" textAlign="center">Small URL</Semantic.Header>
				<div style={{ margin: '0 100px', marginTop: '20px' }}>
					<Semantic.Form>
						<Semantic.FormField>
							<Semantic.Input
								value={this.state.input}
								onChange={this.onInputChange}
								placeholder="URL"
							/>
						</Semantic.FormField>
					</Semantic.Form>
					{this.state.input
						? <Semantic.Segment>{this.renderOutput()}</Semantic.Segment>
						: null
					}
				</div>
			</Semantic.Container>
		</div>
	)
}
