import React, { Component } from 'react';
import TableCell from './TableCell';
import { MAP, req, quakeLayer } from '../api';

class TableRow extends Component {
  render() {
    const { net, code, place, mag, time } = this.props;
    const date = new Date(time);
    const columns = [place, mag, date.toString()];

    return (
      <ul className="row" id={net + code}>{columns.map((text, i) =>
        <TableCell key={i} text={text} />
      )}</ul>
    )
  }
}

export default TableRow;