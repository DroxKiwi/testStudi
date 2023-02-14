import React, { Component } from 'react';

export class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  };

  componentDidUpdate () {
    console.log('Phase de mise à jour');
    document.title = `vous avez cliqué ${this.state.count} fois`;
  };

  render() {
    console.log('render');
    return (
      <button
        type="button"
        onClick={
          () => this.setState({count: this.state.count + 1})
        }
      >
        Click me  
      </button>
    );
  };
};

export default Counter;