import React, { Component } from 'react'
import classNames from 'classnames'
import FontAwesome from 'react-fontawesome'

class BirthrightCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isDeleteConfirm: false
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

  render() {
    const titleClasses = classNames({
      title: true,
      selectedCardTitle: this.props.isActive
    })

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
        <div className={ titleClasses } onClick={ this.props.doActivate.bind(this) }>
          { this.props.name }
        </div>
        <div>
          Rating: { this.props.rating }
        </div>
        <div>
          Purviews: { this.props.purview }
        </div>
        <div className="descriptionContainer">
          { this.props.description }
        </div>
      </div>
    )
  }
}

export default BirthrightCard