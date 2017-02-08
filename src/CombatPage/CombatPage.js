import React, { Component } from 'react'
import ArmorSection from '../ArmorSection'
import BirthrightsSection from '../BirthrightsSection'
import CombatStatsSection from '../CombatStatsSection'
import WeaponSection from '../WeaponSection'

const { object } = React.PropTypes

class CombatPage extends Component {
  render() {
    return (
      <div className="columnPage">
        <div className="sectionContainer">
          <WeaponSection database={ this.props.database } />
          <ArmorSection database={ this.props.database } />
          <BirthrightsSection database={ this.props.database } />
        </div>
        <div className="sectionContainer">
          <CombatStatsSection database={ this.props.database } />
        </div>
      </div>
    )
  }
}

CombatPage.propTypes = {
  database: object.isRequired
}

export default CombatPage