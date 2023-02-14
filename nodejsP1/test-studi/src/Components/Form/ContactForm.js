// Fichier ContactForm.js
import React, { Component } from 'react';

export default class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'label test',
      placeholder: 'placeholder test'
    };
  };

  render() {
    return (
      <>
        <div>
            <label>{this.state.label}</label>
            <input 
                type="text"
                placeholder={this.state.placeholder}
            />
        </div>
      </>
    );
  };
};