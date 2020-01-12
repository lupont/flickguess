import React, { Component } from 'react';

import Options from '../Options/OptionsComponent';
import Spotify from '../Spotify/SpotifyComponent';
import Timer from '../Timer/TimerComponent';

class GameComponent extends Component {
    state = {
        currentQuestion: 0,
        disabled: true,
        myAnswer: null,
        score: 0,
        options: [],
        quizData: [],
        answer: '',
        missedAnswer: false,
    };

    constructor(props) {
        super(props);
        console.log('game created');
        // this.child = React.createRef(); // To run spotifys play method
    }

    componentDidMount() {
        console.log('game loaded');
        console.log(this.props.quizData);
        let index = this.state.currentQuestion;
        this.setState({ 
            quizData: this.props.quizData,
            answer: this.props.quizData[index].answer,
        });
    }

    // Used to start playing as soon as spotify player are ready
    spotifyReady() {
        this.spotify.playSpotifyHandler(this.state.quizData[0].answer.spotify);
    }

    componentDidUpdate(prevProps, prevState) {
        const { quizData } = this.state;
        let index = this.state.currentQuestion;

        if (index !== prevState.currentQuestion) {
            this.setState({
                disabled: true,
                options: quizData[index].options,
                answer: quizData[index].answer,
            });
        }
    }

    nextQuestionHandler() {
        const { quizData } = this.state;
        this.updateScore();
        console.log('spotify', this.spotify)

        let elems = document.getElementsByClassName('option');
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('gray-border');
        }

        let index = this.state.currentQuestion + 1;
        this.setState({
            currentQuestion: index,
            missedAnswer: false,
        });
        // this.child.current.playSpotifyHandler(quizData[index].answer.spotify);
        this.spotify && this.spotify.playSpotifyHandler(quizData[index].answer.spotify);
        this.timer && this.timer.restart();
    };

    updateScore() {
        const { myAnswer, answer, score, quizData } = this.state;

        if (myAnswer === answer.title) {
            this.setState({ score: score + 1 });
            quizData[this.state.currentQuestion].answer.correct = true;
            if (this.state.currentQuestion === quizData.length - 1) {
                this.props.end(score + 1);
                // this.child.current.stopPlaying();
                this.spotify && this.spotify.stopPlaying();
            }
        } else {
            if (this.state.currentQuestion === quizData.length - 1) {
                this.props.end(score);
                this.spotify && this.spotify.stopPlaying();
            }
        }
    }

    selectAnswer(answer) {
        this.setState({
            myAnswer: answer,
            disabled: false,
            missedAnswer: false,
        });

        setTimeout(this.nextQuestionHandler.bind(this), 500);
    }

    onTimerFinish() {
        this.setState({
            missedAnswer: true,
        });
        this.spotify.stopPlaying();
        console.log('missed answering');
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
                
                <Timer time={this.props.location.state.time}
                        onFinish={this.onTimerFinish.bind(this)}
                        onChange={() => {}}
                        ref={ref => this.timer = ref}/>

                <h1>Vilken film är detta?</h1>

                <span key={'questionOrder'}>{`Fråga ${this.state.currentQuestion+1} av ${quizData.length}`}</span>

                <Options missedAnswer={this.state.missedAnswer} 
                         options={quizData[this.state.currentQuestion].options} 
                         imageData={this.props.imageData}
                         onClick={(title) => {
                             console.log(this.state.missedAnswer);
                             if (!this.state.missedAnswer)
                                 this.selectAnswer(title);
                         }}/>

                {this.state.missedAnswer && (
                    <button className="ui inverted button"
                            // disabled={this.state.disabled}
                            onClick={this.nextQuestionHandler.bind(this)}>
                        Nästa
                    </button>
                )}

                {this.state.currentQuestion === quizData.length - 1 && (
                    <button className="ui inverted button"
                            disabled={this.state.disabled}
                            onClick={() => this.updateScore()}>
                        Avsluta
                    </button>
                )}
            </div>
        );
    }
}

export default GameComponent;