import React from "react"
import { Component } from "react"

class FormTest extends Component{
    render(){
        return(
            <div>
                <label>{this.props.label}</label>
                <input
                    type="text"
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                />
            </div>
        )
    }
}

export default FormTest
