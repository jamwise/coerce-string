import { Component } from 'react';
import { render } from 'react-dom';
import Coerce from 'coerce-string';

class CoerceComponent extends Component {
    constructor() {
        this.coerce = new Coerce({
            value: '',
            pattern: this.props.pattern,
            extend: {L: '.{1,10}', S: 's?'}
        })
        return {
            text: this.coerce.string('')
        }
    }
    onChange(event) {
        this.setState({
            text: this.coerce.string(event.currentTarget.value)
        })
    }
    render() {
        return <input 
                onChange={this.onChange} 
                value={this.state.text} 
                type='text' />;
    }
}

class Container extends Component {
    render() {
        <CoerceComponent pattern='AAAa' />
    }
}

render (<Container />, document.getElementById('react-root'));