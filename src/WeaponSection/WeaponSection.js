import React, { Component } from 'react'
import Modal from 'react-modal'
import FontAwesome from 'react-fontawesome'
import Select from 'react-select'
import WeaponCard from '../WeaponCard'
import DamageTypes from '../Constants/DamageTypes'
import Purviews from '../Constants/Purviews'

import 'react-select/dist/react-select.css'

const { object } = React.PropTypes

class WeaponsSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
      isModalVisible: false,
      isEdit: false,
      editIndex: '',
      newName: '',
      newRating: '',
      newPurview: '',
      newDamageModifier: '0',
      newDamageType: 'Bashing',
      newAccuracyModifier: '0',
      newSpeed: '0',
      newRange: '0',
      newDefenseValue: '0',
      newDescription: '',
      newIsActive: false
    }
  }

  componentDidMount() {
    this.getItemsFromDb()
  }

  componentWillUnmount() {
    this.props.database.child(this.getStoragePath()).off('value')
  }

  getItemsFromDb() {
    // Clear the knacks from the state
    this.setState({
      isEdit: false,
      items: []
    }, () => {
      // Load state from DB
      this.props.database.child(this.getStoragePath()).on('value', (snapshotData) => {
        // If it doesn't exist in the DB, skip it
        if (snapshotData.val() === null) {
          return null
        }

        const items = snapshotData.val().map((item, index) => {
          item.index = index
          return item
        })

        this.setState({
          isEdit: false,
          items: items
        })
      })
    })
  }

  handleToggleModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      isEdit: false,
      newName: '',
      newRating: '',
      newPurview: '',
      newDamageModifier: '0',
      newDamageType: 'Bashing',
      newAccuracyModifier: '0',
      newSpeed: '0',
      newRange: '0',
      newDefenseValue: '0',
      newDescription: '',
    })
  }

  getForm() {
    return {
      name: this.state.newName,
      rating: this.state.newRating,
      purview: this.state.newPurview,
      damageModifier: this.state.newDamageModifier,
      damageType: this.state.newDamageType,
      accuracyModifier: this.state.newAccuracyModifier,
      speed: this.state.newSpeed,
      range: this.state.newRange,
      defenseValue: this.state.newDefenseValue,
      description: this.state.newDescription,
      isActive: this.state.newIsActive
    }
  }

  handleAdd() {
    const newItem = [this.getForm()]

    this.props.database.child(this.getStoragePath()).set(this.state.items.concat(newItem))
    this.setState({
      isModalVisible: false
    })
  }

  handleUpdate() {
    this.props.database.child(this.getStoragePath()).child(this.state.editIndex).set(this.getForm())

    this.setState({
      isModalVisible: false
    })
  }

  handleEdit(item) {
    this.setState({
      isModalVisible: true,
      isEdit: true,
      editIndex: item.index,
      newName: item.name,
      newRating: item.rating,
      newPurview: item.purview,
      newDamageModifier: item.damageModifier,
      newDamageType: item.damageType,
      newAccuracyModifier: item.accuracyModifier,
      newSpeed: item.speed,
      newRange: item.range,
      newDefenseValue: item.defenseValue,
      newDescription: item.description,
      newIsActive: item.isActive
    })
  }

  handleDelete(index) {
    this.props.database.child(this.getStoragePath()).child(index).remove()
    this.getItemsFromDb()
  }

  handleActivate(index) {
    // Deactivate the other items
    for (let [ itemIndex, item ] of Object.entries(this.state.items)) {
      if (item.isActive) {
        this.props.database.child(this.getStoragePath()).child(itemIndex).child('isActive').set(false)
      }
    }

    // Activate this item
    this.props.database.child(this.getStoragePath()).child(index).child('isActive').set(true)
  }

  getStoragePath() {
    return 'weapons'
  }

  renderModal() {
    const purviewOptions = Purviews.map((purview) => { return {label: purview, value: purview}})

    return (
      <Modal
        isOpen={ this.state.isModalVisible }
        onRequestClose={ () => this.setState({
          isModalVisible: false
        })}
        contentLabel="Modify Knack"
        style={{
          content: {
            width: '400px'
          }
        }}
      >
        <div className="modalClose btn" onClick={ this.handleToggleModal.bind(this) }>
          <FontAwesome
            name="window-close"
          />
        </div>
        <h2>
          { this.state.isEdit ? 'Edit' : 'Add'} Knack
        </h2>
        <div className="form">
          <div className="inputRow">
            <div className="label">
              Name
            </div>
            <div className="input">
              <input defaultValue={ this.state.newName } onChange={ (event) => this.setState({ newName: event.target.value }) } />
            </div>
          </div>
          <div className="inputRow">
            <div className="label">
              Rating
            </div>
            <div className="input">
              <input defaultValue={ this.state.newRating } onChange={ (event) => this.setState({ newRating: event.target.value }) } />
            </div>
          </div>
          <div className="inputRow">
            <div className="label">
              Purview
            </div>
            <div className="input">
              <Select multi simpleValue value={ this.state.newPurview } options={ purviewOptions } onChange={ (value) => this.setState({ newPurview: value }) } />
            </div>
          </div>
          <div className="inputRow">
            <div className="label">
              Accuracy Modifier
            </div>
            <div className="input">
              <input defaultValue={ this.state.newAccuracyModifier } onChange={ (event) => this.setState({ newAccuracyModifier: event.target.value }) } />
            </div>
          </div>
          <div className="inputRow">
            <div className="label">
              Damage Modifier
            </div>
            <div className="input">
              <input defaultValue={ this.state.newDamageModifier } onChange={ (event) => this.setState({ newDamageModifier: event.target.value }) } />
            </div>
          </div>
          <div className="inputRow">
            <div className="label">
              Damage Type
            </div>
            <div className="input">
              <select value={ this.state.newDamageType } onChange={ (event) => this.setState({ newDamageType: event.target.value }) }>
                {
                  DamageTypes.map((type, index) => {
                    return <option key={ index } label={ type } value={ type }/>
                  })
                }
              </select>
            </div>
          </div>
          <div className="inputRow">
            <div className="label">
              Speed
            </div>
            <div className="input">
              <input defaultValue={ this.state.newSpeed } onChange={ (event) => this.setState({ newSpeed: event.target.value }) } />
            </div>
          </div>
          <div className="inputRow">
            <div className="label">
              Range
            </div>
            <div className="input">
              <input defaultValue={ this.state.newRange } onChange={ (event) => this.setState({ newRange: event.target.value }) } />
            </div>
          </div>
          <div className="inputRow">
            <div className="label">
              Defense Value
            </div>
            <div className="input">
              <input defaultValue={ this.state.newDefenseValue } onChange={ (event) => this.setState({ newDefenseValue: event.target.value }) } />
            </div>
          </div>
          <div className="inputRow">
            <div className="label">
              Description
            </div>
            <div className="input">
              <textarea defaultValue={ this.state.newDescription } onChange={ (event) => this.setState({ newDescription: event.target.value }) } />
            </div>
          </div>

          <button
            className="formButton"
            onClick={ this.state.isEdit ? this.handleUpdate.bind(this) : this.handleAdd.bind(this) }
          >
            { this.state.isEdit ? 'Update' : 'Save' } Weapon
          </button>
        </div>

      </Modal>
    )
  }

  renderItems() {
    return this.state.items.map((item, index) => {
      return (
        <WeaponCard
          key={ index }
          doActivate={ this.handleActivate.bind(this, item.index) }
          onDelete={ () => {this.handleDelete(item.index)} }
          onEdit={ this.handleEdit.bind(this, item) }
          { ...item }
        />
      )
    })
  }

  render() {
    return (
      <div>
        { this.renderModal() }
        <div className="header">
          Weapons
          <button onClick={ this.handleToggleModal.bind(this) }>
            Add
          </button>
        </div>
        <div className="cardList">
          { this.renderItems() }
        </div>
      </div>
    )
  }
}

WeaponsSection.propTypes = {
  database: object.isRequired
}

export default WeaponsSection