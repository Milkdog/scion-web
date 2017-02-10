import React, { Component } from 'react';

class ExperienceCard extends Component {
  static get defaultProps() {
    return {
      title: 'Experience'
    };
  }

  constructor(props) {
    super(props)

    this.state = {
      total: '0',
      spent: '0'
    }
  }

  componentDidMount() {
    // Load state from DB
    this.props.database.child(this.getStoragePath()).on('value', (snapshotData) => {
      if (snapshotData.val()) {
        this.setState(snapshotData.val())
      }
    })
  }

  componentWillUnmount() {
    this.props.database.child(this.getStoragePath()).off('value')
  }

  saveData(data) {
    if (data.total >= 0 || data.spent >= 0) {
      this.setState(data, () => {
        this.props.database.child(this.getStoragePath()).set(this.state)
      })
    }
  }

  getStoragePath() {
    return 'experience'
  }

  render() {
    return (
      <div>
        <div className="header leftHeader">
          { this.props.title }
        </div>
        <div className="experienceInputs">
          <div className="inputGroup">
            Total: <input value={ this.state.total } onChange={ (event) => this.saveData({total: event.target.value}) } />
          </div>
          <div className="inputGroup">
            Spent: <input value={ this.state.spent } onChange={ (event) => this.saveData({spent: event.target.value}) } />
          </div>
        </div>
        <div className="info">
          Remaining: { this.state.total - this.state.spent }
        </div>
      </div>
    )
  }
}

export default ExperienceCard