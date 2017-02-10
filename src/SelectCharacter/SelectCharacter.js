import React, { Component } from 'react'
import Select from 'react-select'

const { object, func } = React.PropTypes

class SelectCharacter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      characters: []
    }
  }

  componentDidMount() {
    this.props.database.orderByKey().on('value', (snapshotData) => {
      if (snapshotData.val() !== null) {
        let characters = []
        for (let character of Object.keys(snapshotData.val())) {
          characters.push({
            label: character,
            value: character
          })
        }

        this.setState({
          characters
        })
      }
    })
  }

  componentWillUnmount() {
    this.props.database.off('value')
  }

  render() {
    return (
      <div className="characterContainer">
        <Select.Creatable
          promptTextCreator={ (label) => {
            return 'Create character "' + label + '"'
          }}
          options={ this.state.characters }
          onChange={ (option) => this.props.doSetCharacter(option.value) }
        />
      </div>
    )
  }
}

SelectCharacter.propTypes = {
  database: object.isRequired,
  doSetCharacter: func.isRequired
}

export default SelectCharacter