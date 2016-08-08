import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Container extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }
}


export default connect(mapStateToProps)(Container)
