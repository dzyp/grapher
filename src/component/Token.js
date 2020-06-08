import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

class Token extends Component {
    render() {
        return (
            <div>
                <FormGroup>
                    <Label for="tokenText">Please enter your token</Label>
                    <Input type="textarea" name="text" id="tokenText" value={this.props.token} onChange={this.props.onChange}/>
                </FormGroup>
            </div>
        );
    }
}

export default Token;