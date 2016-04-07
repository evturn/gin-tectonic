import React, { Component } from 'react';
import TableRow from './TableRow';

class Table extends Component {
  render() {
    const header = (
      <ul id="data-header">
        <li>Location</li>
        <li>Magnitude</li>
        <li>Time</li>
      </ul>
    );

    return (
      <div id="eq-data">
        {header}
        <div id="data-list">{
          this.props.quakes
            .pluck('properties')
            .map((quake, i) => <TableRow key={i} {...quake} />)
            .subscribe()
        }</div>
      </div>
    )
  }
}

export default Table;