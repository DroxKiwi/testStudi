import React, { Component } from 'react';
import './SeekAndDestroy.css'

export class SeekAndDestroy extends Component {
  componentWillUnmount () {
    console.log('phase de démontage');
  };

  render() {
    console.log('render');
    return (
      <div className="Destroy">
        Je suis un composant sur le point d'être détruit.
      </div>
    );
  };
};

export default SeekAndDestroy;