import React, { Component } from 'react'

import BoonsSection from '../BoonsSection/BoonsSection'
import KnacksSection from '../KnacksSection/KnacksSection'

import './boons-knacks-page.scss'

const { object } = React.PropTypes

class BoonsKnacksPage extends Component {
  render() {
    return (
      <div className="boonsKnacksPage">
        <div className="sectionContainer">
          <BoonsSection database={ this.props.database } />
        </div>
        <div className="sectionContainer">
          <KnacksSection database={ this.props.database } />
        </div>
      </div>
    )
  }
}

BoonsKnacksPage.propTypes = {
  database: object.isRequired
}

export default BoonsKnacksPage