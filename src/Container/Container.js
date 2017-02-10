import React, { Component } from 'react'
import classNames from 'classnames'

import StatsPage from '../StatsPage/StatsPage'
import BoonsKnacksPage from '../BoonsKnacksPage/BoonsKnacksPage'
import CombatPage from '../CombatPage'
import DiceModal from '../DiceModal'

import 'react-select/dist/react-select.css'
import './container.scss'

const { object } = React.PropTypes

const pages = [
  {
    id: 'stats',
    name: 'Stats',
    component: StatsPage
  },
  {
    id: 'boons-knacks',
    name: 'Boons & Knacks',
    component: BoonsKnacksPage
  },
  {
    id: 'combat',
    name: 'Combat & Birthrights',
    component: CombatPage
  },
  {
    id: 'character',
    name: 'Character'
  },
  {
    id: 'roll',
    name: 'Roll Dice',
    isModal: true
  }
]

class Container extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedPage: 'stats',
      isDiceModalVisible: false
    }
  }

  getPageComponent() {
    const { database } = this.props

    const filteredPages = pages.filter((page) => {
      return page.id === this.state.selectedPage
    })

    const ThisPage = filteredPages[0].component

    const pageProps = {
      database
    }

    return <ThisPage { ...pageProps } />
  }

  handleToggleDiceModal() {
    this.setState({
      isDiceModalVisible: !this.state.isDiceModalVisible
    })
  }

  render() {
    return (
      <div>
        <div className="appTitle ">
          Scion Character Sheet
        </div>
        <div className="pageContents">
          { this.getPageComponent() }
        </div>
        <DiceModal isVisible={ this.state.isDiceModalVisible } database={ this.props.database } />
        <div className="footer">
          {
            pages.map((page, index) => {
              const itemClasses = classNames({
                footerItem: true,
                footerActive: this.state.selectedPage === page.id
              })

              return (
                <div key={ index } className={ itemClasses } onClick={() => {
                  if (page.isModal) {
                    switch (page.id) {
                      case 'roll':
                      default:
                        this.handleToggleDiceModal()
                        break
                    }
                  } else {
                    this.setState({
                      selectedPage: page.id
                    })
                  }
                } }>
                  { page.name }
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

Container.propTypes = {
  database: object.isRequired
}

export default Container;
