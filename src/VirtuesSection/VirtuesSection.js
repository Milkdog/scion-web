import React, { Component } from 'react';
import VirtueCard from '../VirtueCard'

const { object } = React.PropTypes

class VirtuesSection extends Component {
  renderVirtues() {
    const virtues = []

    for (let i=0; i < 4; i++) {
      virtues.push(
        <VirtueCard key={ i } slot={ i } database={ this.props.database } />
      )
    }

    return virtues
  }

  render() {
    return (
      <div className="card">
        <div className="header">
          Virtues
        </div>
        { this.renderVirtues() }
      </div>
    )
  }
}

VirtuesSection.propTypes = {
  database: object.isRequired
}

export default VirtuesSection