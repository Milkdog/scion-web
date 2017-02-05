import React, { Component } from 'react'
import AttributeCard from '../AttributeCard/AttributeCard'
import Attributes from '../Constants/Attributes'

import './stats-page.scss'

const { object } = React.PropTypes

class StatsPage extends Component {
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

  render() {
    return (
      <div>
        <div className="header">
          Attributes
        </div>
        <div className="cardGroupRow">
          { this.renderAttributes() }
        </div>
        Stats Page
      </div>
    )
  }
}

StatsPage.propTypes = {
  database: object
}

export default StatsPage;
