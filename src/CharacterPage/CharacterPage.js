import React, { Component } from 'react'
import SelectCharacter from '../SelectCharacter'

import './character-page.scss'

class CharacterPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false,
      name: '',
      calling: '',
      nature: '',
      pantheon: '',
      god: '',
      notes: ''
    }
  }

  componentDidMount() {
    // Load state from DB
    this.props.database.child(this.getStoragePath()).on('value', (snapshotData) => {
      if (snapshotData.val()) {
        this.setState({
          isLoaded: true,
          ...snapshotData.val()
        })
      }
    })
  }

  componentWillUnmount() {
    this.props.database.child(this.getStoragePath()).off('value')
  }

  saveData(data) {
    if(this.state.isLoaded) {
      this.setState(data, () => {
        this.props.database.child(this.getStoragePath()).set(this.state)
      })
    }
  }

  async handleUpdateName(name) {
    if (this.state.isLoaded && name) {
      await this.saveData({name})

      this.props.database.once('value', (snapshotData) => {
        this.props.database.parent.child(name).set(snapshotData.val())
        this.props.database.remove()
        this.props.doSetCharacter(name)
      })
    }
  }

  getStoragePath() {
    return 'character'
  }

  render() {
    return (
      <div>
        <div className="characterContainer">
          <SelectCharacter database={ this.props.database.parent } doSetCharacter={ this.props.doSetCharacter.bind(this) } />
          <hr />
          <div className="form">
            <div className="inputRow">
              <div className="label">
                Name
              </div>
              <div className="input">
                <input value={ this.state.name } onChange={ (event) => this.handleUpdateName(event.target.value) } />
              </div>
            </div>
            <div className="inputRow">
              <div className="label">
                Calling
              </div>
              <div className="input">
                <input value={ this.state.calling } onChange={ (event) => this.saveData({ calling: event.target.value }) } />
              </div>
            </div>
            <div className="inputRow">
              <div className="label">
                Nature
              </div>
              <div className="input">
                <input value={ this.state.nature } onChange={ (event) => this.saveData({ nature: event.target.value }) } />
              </div>
            </div>
            <div className="inputRow">
              <div className="label">
                Pantheon
              </div>
              <div className="input">
                <input value={ this.state.pantheon } onChange={ (event) => this.saveData({ pantheon: event.target.value }) } />
              </div>
            </div>
            <div className="inputRow">
              <div className="label">
                God
              </div>
              <div className="input">
                <input value={ this.state.god } onChange={ (event) => this.saveData({ god: event.target.value }) } />
              </div>
            </div>
          </div>
        </div>
        <div className="notesContainer">
          <div className="label">
            Notes
          </div>
          <textarea className="notes" value={ this.state.notes } onChange={ (event) => this.saveData({ notes: event.target.value }) } />
        </div>
      </div>
    )
  }
}

export default CharacterPage