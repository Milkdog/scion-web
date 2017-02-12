import React, { Component } from 'react';
import Select from 'react-select'
import Box from '../Box'
import Virtues from '../Constants/Virtues'

import './virtue-card.scss'

const { number, object } = React.PropTypes

class VirtueCard extends Component {
  static get defaultProps() {
    return {
      title: 'Virtue Slot'
    };
  }

  constructor(props) {
    super(props)

    this.state = {
      title: '',
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
    return 'virtue/' + this.props.slot
  }

  onPressIncrement(isBoxActive, updateType) {
    const change = isBoxActive ? -1 : 1
    const update = {}
    update[updateType] = this.state[updateType] + change
    this.saveData(update)
  }

  renderRatingBoxes() {
    const ratingBoxes = []

    for (let i=0; i < 5; i++) {
      const isActive = (i < this.state.rating)
      ratingBoxes.push(
        <Box key={ i } isActive={ isActive } isRounded onPress={() => { this.onPressIncrement(isActive, 'rating')}} />
      )
    }

    return ratingBoxes
  }

  renderTempRatingBoxes() {
    const ratingBoxes = []

    for (let i=0; i < 5; i++) {
      const isActive = (i < this.state.tempRating)
      ratingBoxes.push(
        <Box key={ i}  isActive={ isActive}  onPress={ () => { this.onPressIncrement(isActive, 'tempRating')} } />
      )
    }

    return ratingBoxes
  }

  render() {
    return (
      <div className="card virtueCard">
        <Select
          className="title"
          value={ this.state.title }
          onChange={ (value) => { this.saveData({ title: value }) }}
          options={
            Virtues.map((virtue) => {
              return {
                label: virtue,
                value: virtue
              }
            })
          }
        />
        <div className="boxes">
          <div className="boxRow">
            { this.renderRatingBoxes() }
          </div>
          <div className="boxRow">
            { this.renderTempRatingBoxes() }
          </div>
        </div>
      </div>
    )
  }
}

VirtueCard.propTypes = {
  slot: number.isRequired,
  database: object.isRequired
}

export default VirtueCard