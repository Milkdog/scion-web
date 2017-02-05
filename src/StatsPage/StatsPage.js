import React, { Component } from 'react'
import AbilityCard from '../AbilityCard/AbilityCard'
import AttributeCard from '../AttributeCard/AttributeCard'
import Abilities from '../Constants/Abilities'
import Attributes from '../Constants/Attributes'

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

      if (snapshotData.val()) {
        for (let [ name, ability ] of Object.entries(snapshotData.val())) {
          ability.name = name
          dbAbilities.push(ability)
        }
      }

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
          key={index}
          database={this.props.database}
          showEmpty={this.state.isShowEmptyAbilities}
          specialty={ability.specialty === true}
          title={ability.name}
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

      </div>
    )
  }
}

StatsPage.propTypes = {
  database: object
}

export default StatsPage;
