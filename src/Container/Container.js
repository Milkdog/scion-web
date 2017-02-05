import React, { Component } from 'react'

import StatsPage from '../StatsPage/StatsPage'

import './container.scss'

const { object } = React.PropTypes

const pages = [
  {
    id: 'stats',
    name: 'Stats',
    componentName: StatsPage
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
    const { database } = this.props

    const filteredPages = pages.filter((page) => {
      return page.id === this.state.selectedPage
    })

    const ThisPage = filteredPages[0].componentName

    const pageProps = {
      database
    }

    return <ThisPage { ...pageProps } />
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

Container.propTypes = {
  database: object.isRequired
}

export default Container;
