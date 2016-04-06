import React, { Component } from 'react';
import { render } from 'react-dom';
import Table from './Table';

class App extends Component {
  render() {
    return (
      <div>
        <Table />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));

export default App;