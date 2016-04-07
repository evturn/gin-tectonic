import React, { Component } from 'react';

class TableCell extends Component {
  render() {
    return (
      <li className="cell">{this.props.text}</li>
    );
  }
}

export default TableCell;