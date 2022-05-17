import React from 'react'

// Import spinner image
import spinner from '../../images/spinner.gif'

const Spinner = () => (
  <div className="spinner-wrapper">
    <img src={spinner} alt="Spinner" className="spinner" />
  </div>
)

export default Spinner