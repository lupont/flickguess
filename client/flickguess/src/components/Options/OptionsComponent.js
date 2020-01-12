import React, { Component } from 'react';
import Option from '../Option/OptionComponent';

/**
 * A component showing the different options for a question.
 */
class OptionsComponent extends Component {
    render() {
        const { missedAnswer, imageData } = this.props;

        return (
            <div className='options'>
            {this.props.options.map((option, index) => (
                <Option
                    key={index}
                    title={option['movie title']}
                    poster={option['poster-id']}
                    className={`option ${missedAnswer ? 'disabled' : ''}`}
                    missedAnswer={missedAnswer}
                    imageData={imageData}
                    onClick={() => {this.props.onClick(option['movie title'])}}
                />
            ))}
            </div>
        );
    }
}

export default OptionsComponent;