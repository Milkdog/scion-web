import React, { Component } from 'react';
import Box from '../Box'

class WillpowerCard extends Component {
  static get defaultProps() {
    return {
      title: 'Willpower'
    };
  }

  constructor(props) {
    super(props)

    this.state = {
      rating: 0,
      tempRating: 0
    }
  }

  componentDidMount() {
    // Load state from DB
    this.props.database.child(this.getStoragePath()).on('value', (snapshotData) => {
      // If it doesn't exist in the DB, skip it
      if (snapshotData.val() === null) {
        return null
      }

      this.setState(snapshotData.val())
    })
  }

  componentWillUnmount() {
    this.props.database.child(this.getStoragePath()).off('value')
  }

  saveData(data) {
    this.setState(data, () => {
      this.props.database.child(this.getStoragePath()).set(this.state)
    })
  }

  getStoragePath() {
    return 'willpower'
  }

  onPressIncrement(isBoxActive, updateType) {
    const change = isBoxActive ? -1 : 1
    const update = {}
    update[updateType] = this.state[updateType] + change
    this.saveData(update)
  }

  renderRatingBoxes() {
    const ratingBoxes = []

    for (let i=0; i < 12; i++) {
      const isActive = (i < this.state.rating)
      ratingBoxes.push(
        <Box key={i} isActive={isActive} isRounded={true} onPress={() => { this.onPressIncrement(isActive, 'rating')}} />
      )
    }

    return ratingBoxes
  }

  renderTempRatingBoxes() {
    const ratingBoxes = []

    for (let i=0; i < 12; i++) {
      const isActive = (i < this.state.tempRating)
      ratingBoxes.push(
        <Box key={i} isActive={isActive} onPress={() => { this.onPressIncrement(isActive, 'tempRating')}} />
      )
    }

    return ratingBoxes
  }

  render() {
    return (
      <div className="card">
        <div className="header leftHeader">
          { this.props.title }
        </div>
        <div className="boxRow">
          { this.renderRatingBoxes() }
        </div>
        <div className="boxRow">
          { this.renderTempRatingBoxes() }
        </div>
      </div>
    )
  }
}

export default WillpowerCard