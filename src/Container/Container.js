import React, { Component } from 'react'

import StatsPage from '../StatsPage/StatsPage'

import './container.scss'

const pages = [
  {
    id: 'stats',
    name: 'Stats',
    component: <StatsPage />
  },
  {
    id: 'boons-knacks',
    name: 'Boons & Knacks'
  },
  {
    id: 'birthrights',
    name: 'Birthrights'
  },
  {
    id: 'combat',
    name: 'Combat'
  },
  {
    id: 'character',
    name: 'Character'
  },
  {
    id: 'roll',
    name: 'Roll Dice'
  }
]

class Container extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedPage: 'stats'
    }
  }

  getPageComponent() {
    const filteredPages = pages.filter((page) => {
      return page.id === this.state.selectedPage
    })

    return filteredPages[0].component
  }


  render() {
    return (
      <div>
        <div className="header">
          Scion Character sheet
        </div>
        { this.getPageComponent() }
        <div className="footer">
          {
            pages.map((page, index) => {
              return (
                <div key={ index } className="footerItem" onClick={() => { this.setState({ selectedPage: page.id})} }>
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

export default Container;
