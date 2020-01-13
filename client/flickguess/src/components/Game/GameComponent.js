import React, { Component } from 'react';

import Options from '../Options/OptionsComponent';
import Spotify from '../Spotify/SpotifyComponent';
import Timer from '../Timer/TimerComponent';

/**
 * A component that contains the game's logic and rendering.
 */
class GameComponent extends Component {
    state = {
        currentQuestion: 0,
        myAnswer: null,
        score: 0,
        options: [],
        quizData: [],
        answer: '',
        missedAnswer: false,
    };

    componentDidMount() {
        let index = this.state.currentQuestion;
        this.setState({ 
            quizData: this.props.quizData,
            answer: this.props.quizData[index].answer,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { quizData } = this.state;
        let index = this.state.currentQuestion;

        if (index !== prevState.currentQuestion) {
            this.setState({
                options: quizData[index].options,
                answer: quizData[index].answer,
            });
        }
    }

    /**
     * Plays the current song.
     */
    spotifyReady() {
        this.spotify.playSpotifyHandler(this.state.quizData[0].answer.spotify);
    }

    /**
     * Updates the score of the game and clears CSS styling of the previously selected movie.
     * Updates the current question and either plays the next song and resets the timer,
     * or stops playing and stops the timer if the game is over.
     */
    nextQuestionHandler() {
        const { quizData } = this.state;
        this.updateScore();

        let elems = document.getElementsByClassName('option');
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('gray-border');
        }

        let index = this.state.currentQuestion + 1;
        this.setState({
            currentQuestion: index,
            missedAnswer: false,
        });

        if (index >= quizData.length) {
            this.spotify && this.spotify.stopPlaying();
            this.timer && this.timer.stop();
        }
        else {
            this.spotify && this.spotify.playSpotifyHandler(quizData[index].answer.spotify);
            this.timer && this.timer.restart();
        }
    };

    /**
     * Checks the current answer and adds to the score if it was correct. 
     * Also stops playing from Spotify.
     */
    updateScore() {
        const { myAnswer, answer, score, quizData } = this.state;

        if (myAnswer === answer.title) {
            this.setState({ score: score + 1 });
            quizData[this.state.currentQuestion].answer.correct = true;
            if (this.state.currentQuestion === quizData.length - 1) {
                this.props.end(score + 1);
                this.spotify && this.spotify.stopPlaying();
            }
        } else {
            if (this.state.currentQuestion === quizData.length - 1) {
                this.props.end(score);
                this.spotify && this.spotify.stopPlaying();
            }
        }
    }

    /**
     * Sets the current answer to the state, for validation. Calls for validation and handling
     * of the next question 500ms after to give time for selection CSS to appear.
     * @param {*} answer The option the user answered.
     */
    selectAnswer(answer) {
        this.setState({
            myAnswer: answer,
            missedAnswer: false,
        });

        setTimeout(this.nextQuestionHandler.bind(this), 500);
    }

    /**
     * Updates the state to show that the user missed answering when the timer has reached 0.
     * Also stops Spotify from playing.
     */
    onTimerFinish() {
        this.setState({
            missedAnswer: true,
        });
        this.spotify.stopPlaying();
    }

    render() {
        const { quizData } = this.state;

        if (!quizData || !quizData.length) 
            return false;

        return (
            <div className="App">
                <Spotify
                    spotifyReady={() => this.spotifyReady()}
                    ref={ref => this.spotify = ref}
                    accessToken={this.props.location.state.accessToken}
                    spotifyId={this.state.spotifyId}
                />

                <h1>Vilken film är detta?</h1>

                <span key={'questionOrder'}>{`Fråga ${this.state.currentQuestion+1} av ${quizData.length}`}</span>

                <Options missedAnswer={this.state.missedAnswer} 
                         options={quizData[this.state.currentQuestion].options} 
                         imageData={this.props.imageData}
                         onClick={(title) => {
                             if (!this.state.missedAnswer)
                                 this.selectAnswer(title);
                         }}/>
                
                <Timer time={this.props.location.state.time}
                        onFinish={this.onTimerFinish.bind(this)}
                        onChange={() => {}}
                        ref={ref => this.timer = ref}/>

                {this.state.missedAnswer && (
                    <button className="ui inverted button glow-on-hover" 
                            onClick={this.nextQuestionHandler.bind(this)}>
                        {this.state.currentQuestion === quizData.length - 1 ? 'Avsluta' : 'Nästa'}
                    </button>
                )}
            </div>
        );
    }
}

export default GameComponent;