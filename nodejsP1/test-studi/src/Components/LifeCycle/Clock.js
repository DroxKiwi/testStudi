import React, { Component } from 'react';

export class Clock extends Component {
  componentDidMount() {
    console.log('phase de montage');
  };

  render() {
    console.log('render');
    const localeDateTime = new Date().toLocaleTimeString();

    return (
      <div>
        Il est {localeDateTime}
      </div>
    );
  };
};

export default Clock;