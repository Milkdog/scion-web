import React, { Component } from 'react'
import Modal from 'react-modal'
import FontAwesome from 'react-fontawesome'
import Select from 'react-select'
import BirthrightCard from '../BirthrightCard'
import Purviews from '../Constants/Purviews'

const { object } = React.PropTypes

class BirthrightsSection extends Component {
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
      newBashSoak: '',
      newLethalSoak: '',
      newMobilityPenalty: '',
      newDescription: ''
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
      newDescription: '',
    })
  }

  getForm() {
    return {
      name: this.state.newName,
      rating: this.state.newRating,
      purview: this.state.newPurview,
      description: this.state.newDescription
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
      newDescription: item.description
    })
  }

  handleDelete(index) {
    this.props.database.child(this.getStoragePath()).child(index).remove()
    this.getItemsFromDb()
  }

  getStoragePath() {
    return 'birthrights'
  }

  renderModal() {
    const purviewOptions = Purviews.map((purview) => { return {label: purview, value: purview}})

    return (
      <Modal
        isOpen={ this.state.isModalVisible }
        onRequestClose={ () => this.setState({
          isModalVisible: false
        })}
        contentLabel="Modify Birthright"
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
          { this.state.isEdit ? 'Edit' : 'Add'} Birthright
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
            { this.state.isEdit ? 'Update' : 'Save' } Birthright
          </button>
        </div>

      </Modal>
    )
  }

  renderItems() {
    return this.state.items.map((item, index) => {
      return (
        <BirthrightCard
          key={ index }
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
          Other Birthrights
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

BirthrightsSection.propTypes = {
  database: object.isRequired
}

export default BirthrightsSection