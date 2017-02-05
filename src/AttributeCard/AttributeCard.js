import React, { Component } from 'react';
import Box from '../Box/Box'

import './attribute-card.scss'

class AttributeCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rating: 1,
      epic: 0
    }
  }

  componentDidMount() {
    // Load state from DB
    this.props.database.child(this.getStoragePath()).on('child_added', (snapshotData) => {
      const value = {}
      value[snapshotData.key] = snapshotData.val()

      this.setState(value)
    })

  }

  componentWillUnmount() {
    this.props.database.child(this.getStoragePath()).off('child_added')
  }

  saveData(data) {
    this.setState(data, () => {
      this.props.database.child(this.getStoragePath()).set(this.state)
    })
  }

  getStoragePath() {
    return 'attribute/' + this.props.title
  }

  onPress(isBoxActive, updateType) {
    const change = isBoxActive ? -1 : 1
    const update = {}
    update[updateType] = this.state[updateType] + change
    this.saveData(update)
  }

  renderRatingBoxes() {
    const ratingBoxes = []

    for (let i=0; i < 10; i++) {
      const isActive = (i < this.state.rating)
      ratingBoxes.push(
        <Box key={ i } isActive={ isActive } isRounded onPress={ () => { this.onPress(isActive, 'rating') } } />
      )
    }

    return ratingBoxes
  }

  renderEpicBoxes() {
    const epicBoxes = []

    for (let i=0; i < 10; i++) {
      const isActive = (i < this.state.epic)
      epicBoxes.push(
        <Box key={i} isActive={isActive} onPress={() => { this.onPress(isActive, 'epic')}} />
      )
    }

    return epicBoxes
  }

  calculateAutoSuccess() {
    const {epic} = this.state

    if (epic === 0) {
      return 0
    }

    return ((0.5 * Math.pow(epic, 2)) - (0.5 * epic) + 1)
  }

  render() {
    return (
      <div className="card">
        <div>
          <div className="cardTitle">
            { this.props.title }
          </div>
          <div className="cardSubtitle">
            Dice: { this.state.rating }d + { this.calculateAutoSuccess() }
          </div>
        </div>
        <div className="boxRow">
          { this.renderRatingBoxes() }
        </div>
        <div className="boxRow">
          { this.renderEpicBoxes() }
        </div>
      </div>
    )
  }
}

export default AttributeCard