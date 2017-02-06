import React, { Component } from 'react'
import sortBy from 'sort-array'
import Modal from 'react-modal'
import FontAwesome from 'react-fontawesome'
import BoonCard from '../BoonCard/BoonCard'
import Purviews from '../Constants/Purviews'

const { object } = React.PropTypes

class BoonsSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      boons: [],
      isModalVisible: false,
      isEdit: false,
      editIndex: '',
      newName: '',
      newRating: '',
      newCost: '',
      newPurview: '',
      newDicePool: '',
      newDescription: ''
    }
  }

  componentDidMount() {
    this.getBoonsFromDb()
  }

  getBoonsFromDb() {
    // Clear the boons from the state
    this.setState({
      isEdit: false,
      boons: []
    }, () => {
      // Load state from DB
      this.props.database.child(this.getStoragePath()).orderByChild('purview').on('value', (snapshotData) => {
        // If it doesn't exist in the DB, skip it
        if (snapshotData.val() === null) {
          return null
        }

        const boons = snapshotData.val().map((boon, index) => {
          boon.index = index
          return boon
        })

        sortBy(boons, ['purview', 'rating'])

        this.setState({
          isEdit: false,
          boons: boons
        })
      })
    })
  }

  handleToggleModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      isEdit: false
    })
  }

  getForm() {
    return {
      name: this.state.newName,
      rating: this.state.newRating,
      cost: this.state.newCost,
      purview: this.state.newPurview,
      dicePool: this.state.newDicePool,
      description: this.state.newDescription
    }
  }

  handleAddBoon() {
    const newBoon = [this.getForm()]

    this.props.database.child(this.getStoragePath()).set(this.state.boons.concat(newBoon))
    this.setState({
      isModalVisible: false
    })
  }

  handleUpdateBoon() {
    this.props.database.child(this.getStoragePath()).child(this.state.editIndex).set(this.getForm())

    this.setState({
      isModalVisible: false
    })
  }

  handleEditBoon(boon) {
    this.setState({
      isModalVisible: true,
      isEdit: true,
      editIndex: boon.index,
      newName: boon.name,
      newRating: boon.rating,
      newCost: boon.cost,
      newPurview: boon.purview,
      newDicePool: boon.dicePool,
      newDescription: boon.description
    })
  }

  handleDeleteBoon(index) {
    this.props.database.child(this.getStoragePath()).child(index).remove()
  }

  getStoragePath() {
    return 'boons'
  }

  renderModal() {
    return (
      <Modal
        isOpen={ this.state.isModalVisible }
        onRequestClose={ () => this.setState({
          isModalVisible: false
        })}
        contentLabel="Modify Boon"
      >
        <div className="modalClose btn" onClick={ this.handleToggleModal.bind(this) }>
          <FontAwesome
            name="window-close"
          />
        </div>
        <h2>
          { this.state.isEdit ? 'Edit' : 'Add'} Boon
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
              Purviews
            </div>
            <div className="input">
              <select value={ this.state.newPurview } onChange={ (event) => this.setState({ newPurview: event.target.value }) }>
                {
                  Purviews.map((purview, index) => {
                    return <option key={index} label={purview} value={purview} />
                  })
                }
              </select>
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
              Cost
            </div>
            <div className="input">
              <input defaultValue={ this.state.newCost } onChange={ (event) => this.setState({ newCost: event.target.value }) } />
            </div>
          </div>
          <div className="inputRow">
            <div className="label">
              Dice Pool
            </div>
            <div className="input">
              <input defaultValue={ this.state.newDicePool } onChange={ (event) => this.setState({ newDicePool: event.target.value }) } />
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
        </div>

      </Modal>
    )
  }

  renderBoons() {
    return this.state.boons.map((boon, index) => {
      return (
        <BoonCard
          key={index}
          onDelete={() => {this.handleDeleteBoon(boon.index)}}
          onEdit={this.handleEditBoon.bind(this, boon)}
          {...boon}
        />
      )
    })
  }

  render() {
    return (
      <div>
        { this.renderModal() }
        <div className="titleContainer">
          <h2>Boons</h2>
          <button onClick={ this.handleToggleModal.bind(this) }>
            Add
          </button>
        </div>
        <div className="cardList">
          {this.renderBoons()}
        </div>
      </div>
    )
  }
}

BoonsSection.propTypes = {
  database: object.isRequired
}

export default BoonsSection