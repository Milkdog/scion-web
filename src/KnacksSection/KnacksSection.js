import React, { Component } from 'react'
import Modal from 'react-modal'
import FontAwesome from 'react-fontawesome'
import KnackCard from '../KnackCard/KnackCard'
import Attributes from '../Constants/Attributes'

const { object } = React.PropTypes

class KnacksSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      knacks: [],
      isModalVisible: false,
      isEdit: false,
      editIndex: '',
      newName: '',
      newCost: '',
      newAttribute: '',
      newDescription: ''
    }
  }

  componentDidMount() {
    this.getKnacksFromDb()
  }

  getKnacksFromDb() {
    // Clear the knacks from the state
    this.setState({
      isEdit: false,
      knacks: []
    }, () => {
      // Load state from DB
      this.props.database.child(this.getStoragePath()).orderByChild('epicAttribute').on('value', (snapshotData) => {
        // If it doesn't exist in the DB, skip it
        if (snapshotData.val() === null) {
          return null
        }

        const knacks = snapshotData.val().map((knack, index) => {
          knack.index = index
          return knack
        })

        this.setState({
          isEdit: false,
          knacks: knacks
        })
      })
    })
  }

  handleToggleModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      isEdit: false,
      newName: '',
      newCost: '',
      newAttribute: '',
      newDescription: ''
    })
  }

  getForm() {
    return {
      name: this.state.newName,
      cost: this.state.newCost,
      attribute: this.state.newAttribute,
      description: this.state.newDescription
    }
  }

  handleAddKnack() {
    const newKnack = [this.getForm()]

    this.props.database.child(this.getStoragePath()).set(this.state.knacks.concat(newKnack))
    this.setState({
      isModalVisible: false
    })
  }

  handleUpdateKnack() {
    console.log(this.getForm())
    this.props.database.child(this.getStoragePath()).child(this.state.editIndex).set(this.getForm())

    this.setState({
      isModalVisible: false
    })
  }

  handleEditKnack(knack) {
    this.setState({
      isModalVisible: true,
      isEdit: true,
      editIndex: knack.index,
      newName: knack.name,
      newAttribute: knack.attribute,
      newCost: knack.cost,
      newDescription: knack.description
    })
  }

  handleDeleteKnack(index) {
    this.props.database.child(this.getStoragePath()).child(index).remove()
  }

  getStoragePath() {
    return 'knacks'
  }

  renderModal() {
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
              Epic Attribute
            </div>
            <div className="input">
              <select value={ this.state.newAttribute } onChange={ (event) => this.setState({ newAttribute: event.target.value }) }>
                {
                  Attributes.map((group, groupIndex) => {
                    return group.items.map((attribute, index)=> {
                      return <option key={ groupIndex + '' + index } label={ attribute.name } value={ attribute.name }/>
                    })
                  })
                }
              </select>
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
              Description
            </div>
            <div className="input">
              <textarea defaultValue={ this.state.newDescription } onChange={ (event) => this.setState({ newDescription: event.target.value }) } />
            </div>
          </div>

          <button
            className="formButton"
            onClick={ this.state.isEdit ? this.handleUpdateKnack.bind(this) : this.handleAddKnack.bind(this) }
          >
            { this.state.isEdit ? 'Update' : 'Save' } Knack
          </button>
        </div>

      </Modal>
    )
  }

  renderKnacks() {
    return this.state.knacks.map((knack, index) => {
      return (
        <KnackCard
          key={index}
          onDelete={ () => { this.handleDeleteKnack(knack.index) } }
          onEdit={ this.handleEditKnack.bind(this, knack) }
          { ...knack }
        />
      )
    })
  }

  render() {
    return (
      <div>
        { this.renderModal() }
        <div className="titleContainer">
          <h2 className="withButton">Knacks</h2>
          <button className="headerButton" onClick={ this.handleToggleModal.bind(this) }>
            Add Knack
          </button>
        </div>
        <div className="cardList">
          { this.renderKnacks() }
        </div>
      </div>
    )
  }
}

KnacksSection.propTypes = {
  database: object.isRequired
}

export default KnacksSection