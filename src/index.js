import React from 'react';
import ReactDOM from 'react-dom';
import Coerce from 'coerce-string';

class CoerceComponent extends React.Component {
    constructor(props) {
        super(props);
        this.coerce = new Coerce({
            value: '',
            pattern: this.props.pattern,
            extend: {L: '.{1,10}', S: 's?', D:'([0-9]*,?)*.?[0-9]*'}
        })
        this.state = {
            text: this.coerce.string('')
        }
    }
    onChange = (event) => {
        this.setState({
            text: this.coerce.string(event.currentTarget.value)
        })
    }
    render() {
        return (<input 
                style={{
                    width: '100%'
                }}
                onChange={this.onChange} 
                value={this.state.text} 
                placeholder={this.props.placeholder}
                type='text' />);
    }
}

class Container extends React.Component {
    render = () => (
        <div>
            <h3>Phone Number</h3>
            <CoerceComponent pattern='(999) 999-9999' placeholder='(___) ___-____' />
            <h3>URL with optional "s"</h3>
            <CoerceComponent pattern='httpS://+' placeholder='http(s)://www.example.com' />
            <h3>Date</h3>
            <CoerceComponent pattern='99/99/9999' placeholder='__/__/____' />
            <h3>Money</h3>
            <CoerceComponent pattern='$D' placeholder='$___' />
        </div>
    )
}

ReactDOM.render(<Container />, document.getElementById('react-root'));