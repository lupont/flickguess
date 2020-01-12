import React, { Component } from 'react';
import Option from '../Option/OptionComponent';

class OptionsComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='options'>
            {this.props.options.map(option => (
                <Option
                    id={option['poster-id']}
                    key={option['poster-id']}
                    title={option['movie title']}
                    poster={option['poster-id']}
                    className='option'
                    onClick={() => {this.props.onClick(option['movie title'])}}
                />
            ))}
            </div>
        );
    }

}

export default OptionsComponent;