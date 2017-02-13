import React, { Component } from 'react';
import Modal from 'react-modal'
import FontAwesome from 'react-fontawesome'
import Box from '../Box/Box'

import './ability-card.scss'

const { string, object, bool } = React.PropTypes

class AbilityCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rating: 0,
      specialty: false,
      specialtyName: '',
      isFavored: false,
      isModalVisible: false
    }
  }

  componentDidMount() {
    this.getFromDb()
  }

  componentWillUnmount() {
    this.props.database.child(this.getStoragePath()).off('value')
  }

  getFromDb() {
    // Load state from DB
    this.props.database.child(this.getStoragePath()).child(this.props.title).on('value', (snapshotData) => {
      if (snapshotData.val() !== null) {
        this.setState(snapshotData.val())
      }
    })
  }

  saveData(data) {
    this.setState(data, () => {
      this.props.database.child(this.getStoragePath()).child(this.props.title).set({
        specialty: this.props.specialty,
        ...this.state
      })
    })
  }

  getStoragePath() {
    return 'ability'
  }

  onPressIncrement(isBoxActive, updateType) {
    const change = isBoxActive ? -1 : 1
    const update = {}
    update[updateType] = this.state[updateType] + change
    this.saveData(update)
  }

  handleToggleFavored() {
    this.saveData({
      isFavored: !this.state.isFavored
    })
  }

  handleAddSpecialty() {
    const dbPath = this.props.title + ' (' + this.state.specialtyName + ')'
    this.props.database.child(this.getStoragePath()).child(dbPath).set({
      editable: true,
      isFavored: this.state.isFavored,
      rating: 1
    })

    this.setState({
      isModalVisible: false
    })
  }

  renderRatingBoxes() {
    const ratingBoxes = []

    for (let i=0; i < 5; i++) {
      const isActive = (i < this.state.rating)
      ratingBoxes.push(
        <Box key={i} isActive={isActive} isRounded={true} onPress={() => { this.onPressIncrement(isActive, 'rating')}} />
      )
    }

    return ratingBoxes
  }

  renderFavoredBox() {
    return (
      <Box isActive={ this.state.isFavored } onPress={ this.handleToggleFavored.bind(this) } />
    )
  }

  renderAbilityContent() {
    if (this.props.specialty) {
      return (
        <div className="clickable" onClick={ () => { this.setState({ isModalVisible: true }) } }>
          Select specialty <FontAwesome name="arrow-circle-o-right" />
        </div>
      )
    }

    return this.renderRatingBoxes()
  }

  renderModal() {
    return (
      <Modal
        isOpen={ this.state.isModalVisible }
        onRequestClose={ () => this.setState({
          isModalVisible: false
        })}
        contentLabel="Special Ability"
        style={{
          content: {
            width: '400px'
          }
        }}
      >
        <div className="modalClose btn" onClick={ () => { this.setState({ isModalVisible: false })} }>
          <FontAwesome
            name="window-close"
          />
        </div>
        <h2>
          { this.state.isEdit ? 'Edit' : 'Add'} Specialty for { this.props.title }
        </h2>
        <div className="form">
          <div className="inputRow">
            <div className="label">
              Specialty
            </div>
            <div className="input">
              <input  onChange={ (event) => this.setState({ specialtyName: event.target.value}) } />
            </div>
          </div>

          <button
            className="formButton"
            onClick={ this.handleAddSpecialty.bind(this) }
          >
            { this.state.isEdit ? 'Update' : 'Save' } Special Ability
          </button>
        </div>
      </Modal>
    )
  }

  render() {
    if (!this.props.showEmpty && this.state.rating === 0)
      return null

    return (
      <div className="card abilityCard">
        { this.renderModal() }
        <div className="favoredBox">
          { this.renderFavoredBox() }
        </div>
        <div className="cardTitle titleContainer">
          { this.props.title }
        </div>
        <div className="boxesContainer">
          { this.renderAbilityContent() }
        </div>
      </div>
    )
  }
}

AbilityCard.propTypes = {
  database: object.isRequired,
  title: string.isRequired,
  specialty: bool,
  showEmpty: bool
}

export default AbilityCard