import React, { Component } from 'react'
import classNames from 'classnames'
import FontAwesome from 'react-fontawesome'

class BoonCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isDeleteConfirm: false,
      isDescriptionVisible: false,
    }
  }

  handleDelete() {
    // On first press
    if (!this.state.isDeleteConfirm) {
      this.setState({
        isDeleteConfirm: true
      })
    } else {
      // On next press
      this.props.onDelete()
    }
  }

  handleToggleVisible() {
    this.setState({
      isDescriptionVisible: !this.state.isDescriptionVisible
    })
  }

  render() {
    const deleteClasses = classNames({
      controlItem: true,
      btn: true,
      warning: this.state.isDeleteConfirm
    })

    return (
      <div className="card cardContainer">
        <div className="controlContainer">
          <div className="controlItem btn" onClick={ this.props.onEdit.bind(this) }>
            <FontAwesome
              name="pencil-square"
            />
          </div>
          <div className={ deleteClasses } onClick={ this.handleDelete.bind(this) }>
            <FontAwesome
              name="window-close"
            />
          </div>
        </div>
        <div className="title">
          { this.props.name }
        </div>
        <div>
          Rating: { this.props.rating }
        </div>
        <div>
          Purview: { this.props.purview }
        </div>
        <div>
          Dice: { this.props.dicePool }
        </div>
        <div>
          Cost: { this.props.cost }
        </div>
        <div className="descriptionContainer">
          <div
            className="toggleVisibleButton"
            onClick={ this.handleToggleVisible.bind(this) }
          >
            {
              this.state.isDescriptionVisible ?
                <FontAwesome name="minus-square" />
                : <FontAwesome name="plus-square" />
            }
          </div>
          {
            this.state.isDescriptionVisible ?
              this.props.description
              : null
          }
        </div>
      </div>
    )
  }
}

export default BoonCard