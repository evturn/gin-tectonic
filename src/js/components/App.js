import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { drawQuake } from '../actions';
import Table from './Table';
import '../../css/app.less';

class App extends Component {
  componentDidMount() {
    const { quakes, dispatch } = this.props;

    quakes.subscribe(quake => dispatch(drawQuake(quake)));
  }
  render() {

    return (
      <div>
        <Table quakes={this.props.quakes}/>
      </div>
    );
  }
}

App.propTypes = {
  quakes: PropTypes.object,
  dispatch: PropTypes.func
};

export default connect(
  state => ({
    quakes: state.quake.quakes
  })
)(App);