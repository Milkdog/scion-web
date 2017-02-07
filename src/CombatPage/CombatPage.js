import React, { Component } from 'react'
import WeaponSection from '../WeaponSection'

const { object } = React.PropTypes

class CombatPage extends Component {
  render() {
    return (
      <div className="columnPage">
        <div className="sectionContainer">
          <WeaponSection database={ this.props.database } />
          <div className="header">
            Armor
          </div>
          <div className="cardList">
            Cards
          </div>

          <div className="header">
            Other Birthrights
          </div>
          <div className="cardList">
            Cards
          </div>
        </div>
        <div className="sectionContainer">
          Combat Stats
        </div>
      </div>
    )
  }
}

CombatPage.propTypes = {
  database: object.isRequired
}

export default CombatPage