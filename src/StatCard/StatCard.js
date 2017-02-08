import React, { Component } from 'react'
import classNames from 'classnames'

class StatCard extends Component {
  static get defaultProps() {
    return {
      title: 'Stat',
      rating: 0,
      epic: null,
      modifier: null,
      rawBonus: null
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      isSelected: false
    }
  }

  componentDidMount() {
    this.getItemsFromDb()
  }

  getItemsFromDb() {
    // Load state from DB
    this.props.database.child(this.getStoragePath()).child(this.props.title).on('value', (snapshotData) => {
      if (snapshotData.val() !== null) {
        this.setState(snapshotData.val())
      }
    })

    this.props.database.child(this.getStoragePath()).child(this.props.title).on('child_removed', () => {
      this.setState({
        isSelected: false
      })
    })
  }

  componentWillUnmount() {
    this.props.database.child(this.getStoragePath()).child(this.props.title).off('value')
  }

  getStoragePath() {
    return 'selectedStats'
  }

  handleSelect() {
    if (this.state.isSelected) {
      this.setState({
        isSelected: false
      }, () => {
        this.props.database.child(this.getStoragePath()).child(this.props.title).remove()
      })
    } else {
      this.setState({
        isSelected: true
      }, () => {
        const { title, rating, epic, rawBonus } = this.props
        const storedItems = {
          title,
          rating,
          epic,
          rawBonus
        }
        this.props.database.child(this.getStoragePath()).child(this.props.title).set(Object.assign(storedItems, this.state))
      })
    }
  }

  render() {
    const epicText = (this.props.epic !== null) ? ' (' + this.props.epic + ')' : ''
    const modifierText = (this.props.modifier !== null) ? ' ' + this.props.modifier : ''
    const rawBonusText = (this.props.rawBonus !== null) ? 'd + ' + this.props.rawBonus : ''

    const cardClasses = classNames(
      'statItem',
      { statSelected: this.state.isSelected }
    )

    return (
      <div className={ cardClasses } onClick={this.handleSelect.bind(this)}>
        <div className="statName">{ this.props.title }</div>
        <div className="statValue">{ this.props.rating }{ epicText }{ modifierText }{ rawBonusText }</div>
      </div>
    )
  }
}

export default StatCard
