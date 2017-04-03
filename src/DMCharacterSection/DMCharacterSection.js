import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import CombatStatsSection from '../CombatStatsSection'

import './dm-character-section.scss'

const { string, object } = React.PropTypes

class DMCharacterSection extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isDataHidden: false
    }
  }

  handleToggleCharacterStats() {
    this.setState({
      isDataHidden: !this.state.isDataHidden
    })
  }

  renderCharacterStats() {
    if (this.state.isDataHidden) {
      return null
    }

    return (
      <div>
        <CombatStatsSection database={ this.props.database } />
      </div>
    )
  }

  render() {
    return (
      <div className="characterStatSection">
        <div className="characterName" onClick={ this.handleToggleCharacterStats.bind(this) }>
          <span className="characterStateIcon">
            { this.state.isDataHidden ? <FontAwesome name="plus-square" /> : <FontAwesome name="minus-square" /> }
          </span>
          { this.props.characterName }
        </div>
        { this.renderCharacterStats() }
      </div>
    )
  }
}

DMCharacterSection.propTypes = {
  characterName: string.isRequired,
  database: object.isRequired
}

export default DMCharacterSection