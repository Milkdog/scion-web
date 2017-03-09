import React, { Component } from 'react'
import classNames from 'classnames'

const diceMinimum = 1
const diceMaximum = 10
const minimumSuccessCount = 7
const botch = 1
const doubleCount = 10

const { bool, object } = React.PropTypes

class DiceModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isRolling: true,
      rawDiceRolls: [],
      lastDiceRolls: [],
      dice: 0,
      autoSuccess: 0,
      rawBonus: 0
    }
  }

  componentDidMount() {
    this.getItemsFromDb()
  }

  getItemsFromDb() {
    // Load state from DB
    this.props.database.child(this.getStoragePath()).on('value', (snapshotData) => {
      if (snapshotData.val() !== null) {
        let dice = 0
        let autoSuccess = 0
        let rawBonus = 0

        // eslint-disable-next-line
        for (const [ name, stats ] of Object.entries(snapshotData.val())) {
          dice += stats.rating ? stats.rating : 0
          autoSuccess += this.getEpicModifier(stats.epic)
          rawBonus += stats.rawBonus ? stats.rawBonus : 0
        }

        this.setState({
          dice,
          autoSuccess,
          rawBonus
        })
      }
    })
  }

  componentWillUnmount() {
    this.props.database.child(this.getStoragePath()).off('value')
  }

  getStoragePath() {
    return 'selectedStats'
  }

  handleClearSelectedStats() {
    this.props.database.child(this.getStoragePath()).remove()
    this.setState({
      rawDiceRolls: [],
      dice: 0,
      autoSuccess: 0,
      rawBonus: 0
    })
  }

  handleIncrementDice(diceChange) {
    this.setState({
      dice: this.state.dice + diceChange
    })
  }

  handleRollDice() {
    const rawDiceRolls = []

    for (let i = 0; i < this.state.dice; i++) {
      rawDiceRolls.push(this.rollDie())
    }

    this.setState({
      lastDiceRolls: this.state.rawDiceRolls,
      rawDiceRolls
    })
  }

  getEpicModifier(epicRating) {
    if (!epicRating || epicRating === 0) {
      return 0
    }

    return Number((0.5 * Math.pow(epicRating, 2)) - (0.5 * epicRating) + 1)
  }

  getRawSuccesses(numberDice) {
    let successes = 0
    let botches = 0

    this.state.rawDiceRolls.map((result) => {
      if (result === doubleCount) {
        successes += 2
      } else if (result >= minimumSuccessCount) {
        successes++
      } else if (result === botch) {
        botches++
      }
    })

    if (successes > 0) {
      return successes
    } else if (botches > 0) {
      return -1
    } else {
      return 0
    }
  }

  rollDie() {
    return Math.floor(Math.random() * (diceMaximum - diceMinimum + 1)) + diceMinimum;
  }

  renderResults() {
    const rawSuccesses = this.getRawSuccesses()

    if (rawSuccesses < 0) {
      // Botch
      return (
        <div>
          <img className="diceBotch" src="/botch.jpg" alt="Botch" />
          <div className="diceInfo">{ this.state.rawDiceRolls.join(', ') }</div>
        </div>
      )

    } else {
      const calculatedSuccesses = rawSuccesses + this.state.autoSuccess + this.state.rawBonus

      const successClasses = classNames({
        diceSuccesses: true,
        active: this.state.rawDiceRolls === this.state.lastDiceRolls
      })

      return (
        <div>
          <div className={ successClasses }>{ calculatedSuccesses }</div>
          <div className="diceModalLabel">Successes</div>
          <div className="changeDiceButtons">
            <button onClick={ this.handleIncrementDice.bind(this, -1) }>
              -
            </button>
            <button onClick={ this.handleIncrementDice.bind(this, 1) }>
              +
            </button>
          </div>
          <div className="diceInfo">Rolled { this.state.dice }d10</div>
          <div className="diceInfo">Dice Successes: { rawSuccesses }</div>
          <div className="diceInfo">{ this.state.rawDiceRolls.join(', ') }</div>
          <div className="diceInfo">Auto Successes: { this.state.autoSuccess }</div>
        </div>
      )
    }
  }

  render() {
    if (!this.props.isVisible)
      return null

    return (
      <div className="diceModalContainer">
        <div className="header">
          Roll Dice
        </div>
        <div className="changeDiceButtons">
          <button onClick={ this.handleRollDice.bind(this) }>
            Roll Dice
          </button>
        </div>
        { this.renderResults() }
        <button onClick={ this.handleClearSelectedStats.bind(this) }>
          Clear Dice
        </button>
      </div>
    )
  }
}

DiceModal.propTypes = {
  isVisible: bool.isRequired,
  database: object.isRequired

}

export default DiceModal
