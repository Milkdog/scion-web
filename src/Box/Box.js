import React, { Component } from 'react'
import classNames from 'classnames'

import './box.scss'

const { func, bool } = React.PropTypes

class Box extends Component {
  render() {
    const boxClasses = classNames({
      box: true,
      active: this.props.isActive,
      inactive: !this.props.isActive,
      rounded: this.props.isRounded
    })

    return (
      <div onClick={ this.props.onPress } className={ boxClasses } />
    )
  }
}

Box.propTypes = {
  onPress: func.isRequired,
  isActive: bool.isRequired,
  isRounded: bool
}

export default Box