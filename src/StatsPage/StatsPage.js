import React, { Component } from 'react'
import AbilityCard from '../AbilityCard/AbilityCard'
import AttributeCard from '../AttributeCard/AttributeCard'
import Abilities from '../Constants/Abilities'
import Attributes from '../Constants/Attributes'
import ExperienceCard from '../ExperienceCard'
import LegendCard from '../LegendCard'
import WillpowerCard from '../WillpowerCard'
import VirtuesSection from '../VirtuesSection'

import './stats-page.scss'

const { object } = React.PropTypes

class StatsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dbAbilities: [],
      isAbilitiesLoaded: false,
      isShowEmptyAbilities: true,
    }
  }

  componentDidMount() {
    // Load state from DB
    this.props.database.child('ability').on('value', (snapshotData) => {
      let dbAbilities = []

      snapshotData.forEach((childSnapshot) => {
        const ability = childSnapshot.val()
        ability.name = childSnapshot.key
        dbAbilities.push(ability)
      })

      this.setState({
        dbAbilities,
        isAbilitiesLoaded: true
      })
    })
  }

  componentWillUnmount() {
    this.props.database.child('ability').off('value')
  }

  renderAttributes() {
    return Attributes.map((group, groupIndex) => {
      const attributeCards = group.items.map((attribute, index) => {
        return (
          <AttributeCard
            key={ index }
            title={ attribute.name }
            database={ this.props.database }
          />
        )
      })

      return (
        <div key={ groupIndex } className="cardGroup">
          <div className="groupTitle">
            { group.groupName }
          </div>
          <div>
            { attributeCards }
          </div>
        </div>
      )
    })
  }

  renderAbilities() {
    if (!this.state.isAbilitiesLoaded) {
      return null
    }

    // Merge the arrays, and make it unique
    let renderAbilities = this.state.dbAbilities.concat(Abilities)
    let passedFilter = new Set()

    renderAbilities = renderAbilities.filter((item) => {
      if (passedFilter.has(item.name)) {
        return false
      }

      passedFilter.add(item.name)
      return true
    })

    // Alphabetize the abilities
    renderAbilities = renderAbilities.sort((a, b) => {
      if ( a.name < b.name )
        return -1
      if ( a.name > b.name )
        return 1
      return 0
    })

    return renderAbilities.map((ability, index) => {
      return (
        <AbilityCard
          key={ index + ability.name }
          database={ this.props.database }
          showEmpty={ this.state.isShowEmptyAbilities }
          specialty={ ability.specialty }
          title={ ability.name }
        />
      )
    })
  }

  render() {
    return (
      <div>
        <div className="header">
          Attributes
        </div>
        <div className="cardGroupRow">
          { this.renderAttributes() }
        </div>

        <div className="header">
          Abilities
        </div>
        <div className="cardGroupStack">
          { this.renderAbilities() }
        </div>

        <div className="cardGroupRow">
          <div className="cardGroup">
            <VirtuesSection database={ this.props.database } />
          </div>
          <div className="cardGroup">
            <LegendCard database={ this.props.database } />
            <WillpowerCard database={ this.props.database } />
          </div>
          <div className="cardGroup">
            <ExperienceCard database={ this.props.database } />
          </div>
        </div>

      </div>
    )
  }
}

StatsPage.propTypes = {
  database: object
}

export default StatsPage;
