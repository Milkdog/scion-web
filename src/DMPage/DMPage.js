import React, { Component } from 'react'
import DMCharacterSection from '../DMCharacterSection'

const { object } = React.PropTypes

class DMPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      lastLoggedInCharacters: []
    }
  }

  componentDidMount() {
    this.props.database.root.child('users').once('value', (snapshotData) => {
      // If it doesn't exist in the DB, skip it
      if (snapshotData.val() === null) {
        return null
      }

      const usersSnapshot = snapshotData.val()

      // Find the most recent logged in character for each user
      for (const userId in usersSnapshot) {
        let maxLoggedInTime = 0
        let lastLoggedInCharacterName = ''

        if (Object.prototype.hasOwnProperty.call(usersSnapshot, userId)) {
          const characters = usersSnapshot[userId]

          for (const characterName in characters) {
            if (Object.prototype.hasOwnProperty.call(characters, characterName)) {
              const character = characters[characterName]

              if (character.lastLogin) {
                if (character.lastLogin > maxLoggedInTime) {
                  maxLoggedInTime = character.lastLogin
                  lastLoggedInCharacterName = characterName
                }
              }
            }
          }

          if (!!maxLoggedInTime && !!lastLoggedInCharacterName) {
            // Add the DB reference for the last logged in character
            const characterData = {
              name: lastLoggedInCharacterName,
              ref: this.props.database.root.child('users').child(userId).child(lastLoggedInCharacterName)
            }

            this.setState({
              lastLoggedInCharacters: this.state.lastLoggedInCharacters.concat([characterData])
            })
          }
        }
      }
    })
  }

  renderCharacterCombatStats() {
    return this.state.lastLoggedInCharacters.map((characterData, index) => {
      return <DMCharacterSection key={ index } characterName={ characterData.name } database={ characterData.ref } />
    })
  }

  render() {
    return (
      <div>
        { this.renderCharacterCombatStats() }
      </div>
    )
  }
}

DMPage.propTypes = {
  database: object.isRequired
}

export default DMPage