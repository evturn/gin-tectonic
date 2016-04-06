import React, { Component } from 'react';

class Table extends Component {
  render() {
    return (
      <div id="eq-data">
        <ul id="data-header">
          <li>Location</li>
          <li>Magnitude</li>
          <li>Time</li>
        </ul>
        <div id="data-list"></div>
      </div>
    )
  }
}

export default Table;