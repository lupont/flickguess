import React, { Component } from 'react';
import { quizData } from "./quizData";
import Spotify from "./Spotify";

import Timer from './Timer/TimerComponent';

class FilmQuiz extends Component { 
    state = {
        currentQuestion: 0,
        myAnswer: null,
        options: [],
        score: 0,
        disabled: true,
        isEnd: false
    };

    loadQuizData() {
        this.setState({
            questions: quizData[this.state.currentQuestion].question,
            answer: quizData[this.state.currentQuestion].answer,
            options: quizData[this.state.currentQuestion].options,
        });
    };

    componentDidMount() {
        this.loadQuizData();
        console.log('filmquiz loaded');
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentQuestion !== prevState.currentQuestion) {
            this.setState({
                disabled: true,
                questions: quizData[this.state.currentQuestion].question,
                options: quizData[this.state.currentQuestion].options,
                answer: quizData[this.state.currentQuestion].answer,
            });
        }
    }

    nextQuestionHandler() {
        const { myAnswer, answer, score } = this.state;

        if (myAnswer === answer) {
            this.setState({ score: score + 1 });
        }

        this.setState({ currentQuestion: this.state.currentQuestion + 1 });
        console.log(this.state.currentQuestion);
    };
    
    checkAnswer(answer) {
        this.setState({ 
            myAnswer: answer, 
            disabled: false, 
        });
    };

    finishHandler() {
        if (this.state.currentQuestion === quizData.length - 1) {
            this.setState({ isEnd: true });
        }
    };

    onTimerChange(time) {
        console.log('time left', time);
    }

    onTimerFinish() {
        console.log('finished');
    }

    render() {
        const { options, myAnswer, currentQuestion, isEnd } = this.state;

        console.log('!!!!!!!!!!!!!!!!!!!!', this.props.location.state.accessToken);
        
        return isEnd ? (
            <div className="result">
                <h3>Game Over your Final score is {this.state.score} points </h3>
                
                <p>
                    The correct answer's for the questions was
                </p>
                
                <ul>
                {quizData.map((item, index) => (
                    <li className="ui floating message options" key={index}>
                        {item.answer}
                    </li>
                ))}
                </ul>
            </div>
        ) : (
            <div className="App">
                <Spotify accessToken={this.props.location.state.accessToken}/>
                <Timer time={5} 
                       onFinish={this.onTimerFinish.bind(this)} 
                       onChange={this.onTimerChange.bind(this)}/>

                <h1>{this.state.questions} </h1>
                
                <span>{`Questions ${currentQuestion}  out of ${quizData.length - 1} remaining`}</span>

                {options.map(option => (
                    <p key={option.id}
                        className={`ui floating message options ${myAnswer === option ? "selected" : null}`}
                        onClick={() => this.checkAnswer(option)}>
                        {option}
                    </p>
                ))}

                {currentQuestion < quizData.length - 1 && (
                    <button className="ui inverted button"
                            disabled={this.state.disabled}
                            onClick={this.nextQuestionHandler.bind(this)}>
                        Next
                    </button>
                )}

                {currentQuestion === quizData.length - 1 && (
                    <button className="ui inverted button" 
                            onClick={this.finishHandler.bind(this)}>
                        Finish
                    </button>
                )}
            </div>
        );
    }
}
export default FilmQuiz;
