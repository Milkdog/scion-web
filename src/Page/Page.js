import React, { Component } from 'react'
import './page.css'

class Page extends Component {
  render() {
    return (
      <div>
        <div className="header">
          Scion Character sheet
        </div>
        { this.props.children }
        <div className="footer">
          <div className="footerItem">
            Stats
          </div>
        </div>
      </div>
    )
  }
}

export default Page;
