import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * A component that shows the player's score as well as the answers.
 */
class ResultComponent extends Component {
    render() {
        const { quizData } = this.props;

        return (
            <div className="result">
                <h3>Ditt slutresultat blev {this.props.score} av {quizData.length} poäng </h3>

                <p>
                    Rätt svar på frågorna var
                </p>

                <ul>
                {quizData.map((item, index) => (
                    <li className={item.answer.correct ? 'correct' : 'wrong'} key={index}>
                        {item.answer.title} ({item.answer.song} by {item.answer.composer})
                    </li>
                ))}
                </ul>
                <Link to={{
                        pathname: '/',
                        //state: { accessToken }
                    }}
                        >
                        <button className='glow-on-hover'>
                            Spela igen?
                        </button>
                </Link> 
            </div>
        );
    }
}

export default ResultComponent;