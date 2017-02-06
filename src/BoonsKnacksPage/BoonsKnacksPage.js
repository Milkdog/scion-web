import React, { Component } from 'react'

import BoonsSection from '../BoonsSection/BoonsSection'

import './boons-knacks-page.scss'

// import BoonsSection from './BoonsSection.js'
// import KnacksSection from './KnacksSection.js'

const { object } = React.PropTypes

class BoonsKnacksPage extends Component {
  render() {
    return (
      <div className="boonsKnacksPage">
        <div className="sectionContainer">
          <BoonsSection database={ this.props.database } />
        </div>
        <div className="sectionContainer">
          Knacks
        </div>
      </div>
    )
  }
}

BoonsKnacksPage.propTypes = {
  database: object.isRequired
}

export default BoonsKnacksPage