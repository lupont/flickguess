import React, { Component } from 'react';
import Spotify from "../Spotify";
import './FilmQuiz.css';
import Timer from '../Timer/TimerComponent';
import Options from '../Options/OptionsComponent';

const quizData = [];
const imageData = [];
const addToQuizData = (options, answer, poster) => {
    quizData.push({
        id : quizData.length,
        options: options,
        answer: answer,
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

class FilmQuiz extends Component {
    state = {
        currentQuestion: 0,
        myAnswer: null,
        options: [],
        score: 0,
        disabled: true,
        isEnd: false,
        quizData: [],
        spotifyId: ""
    };

    loadQuizData() {
        this.setState({
            questions: quizData[this.state.currentQuestion].question,
            answer: quizData[this.state.currentQuestion].answer,
            options: quizData[this.state.currentQuestion].options,
        })
    }

    async fetchMoviePosters() {
        const apiKey = '7aa96104';
        let counter = 0;

        for (let i = 0; i < quizData.length; i++) {
            for (let j = 0; j < quizData[i].options.length; j++) {
                const id = quizData[i].options[j].imdb;
                const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
                const json = await response.json();
                quizData[i].options[j]['poster-id'] = counter;
                imageData.push({
                    id: counter,
                    poster: json.Poster,
                });
                counter++;
                this.loadQuizData();
            }
        }
    }

    async fetchQuizData() {
        const response = await fetch(`http://localhost:5000/api/v1/themes/random?questions=${5}&options=${4}`);
        const json = await response.json();
        let answer = '';
        for (let i = 0; i < json.length; i++) {
            answer = {
                title: json[i][0]['movie title'],
                spotify: json[i][0]['spotify'],
            };
            
            let options = [];
            for (let j = 0; j < json[i].length; j++) {
                options.push({
                    'movie title': json[i][j]['movie title'],
                    'imdb': json[i][j]['imdb'],
                });
            }

            shuffle(options);
            addToQuizData(options, answer);
        }

        this.setState({ spotifyId: quizData[0].answer.spotify });
        this.fetchMoviePosters();

        // const q = 5;
        // const o = 4;
        // fetch(`http://localhost:5000/api/v1/themes/random?questions=${q}&options=${o}`)
        //     .then(response => response.json())
        //     .then((responseJson) => {
        //         let answer = "";
        //         for (let i = 0; i < responseJson.length; i++) {
        //             let options = [];
        //             answer = {
        //                 'title' : responseJson[i][0]['movie title'],
        //                 'spotify': responseJson[i][0]['spotify']
        //             };
        //             for (let j = 0; j < responseJson[i].length; j++) {
        //                 options.push({
        //                     'movie title' : responseJson[i][j]['movie title'],
        //                     'imdb': responseJson[i][j]['imdb'],
        //                 })
        //             }
        //             shuffle(options);
        //             addToQuizData(options, answer);
        //         };
        //         this.setState ({
        //             spotifyId: quizData[0].answer.spotify
        //         })
        //         this.fetchMoviePosters();
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
    }

    componentDidMount() {
        this.fetchQuizData();
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
        const { answer } = this.state;

        this.updateScore();

        let index = this.state.currentQuestion + 1;
        this.setState({
            currentQuestion: index, 
            spotifyId: quizData[index].answer.spotify
        });
    };

    updateScore() {
        const { myAnswer, answer, score } = this.state;

        if (myAnswer == answer.title) {
            this.setState({ score: score + 1 });
        }
    }

    checkAnswer(answer) {
        this.setState({
            myAnswer: answer,
            disabled: false,
        });
    };

    finishHandler() {
        if (this.state.currentQuestion === quizData.length - 1) {
            this.updateScore();
            this.setState({ isEnd: true });
        }
    };

    onTimerChange(time) {
    }

    onTimerFinish() {
        this.spotify.stopPlaying();
    }

    render() {
        const { options, myAnswer, currentQuestion, isEnd } = this.state;
        
        return isEnd ? (
            <div className="result">
                <h3>Ditt slutresultat blev {this.state.score} poäng </h3>

                <p>
                    Rätt svar på frågorna var
                </p>

                <ul>
                {quizData.map((item, index) => (
                    <li className="ui floating message options" key={index}>
                        {item.answer.title}
                    </li>
                ))}
                </ul>
            </div>
        ) : (
            <div className="App">
                <Spotify accessToken={this.props.location.state.accessToken} playInstantly={true} ref={ref => this.spotify = ref}/>
                <Timer time={5} 
                       onFinish={this.onTimerFinish.bind(this)} 
                       onChange={this.onTimerChange.bind(this)}/>

                <h1>{this.state.questions} </h1>
                
                <span>{`Questions ${currentQuestion}  out of ${quizData.length - 1} remaining`}</span>

                {options.map((option, index) => (
                    <p key={index}
                        className={`ui floating message options ${myAnswer === option ? "selected" : null}`}
                        onClick={() => this.checkAnswer(option)}>
                        {option.title}
                    </p>
                ))}

                <Options options={options} 
                         imageData={imageData}
                         onClick={(title) => this.checkAnswer(title)}/>

                {currentQuestion < quizData.length - 1 && (
                    <button className="ui inverted button"
                            disabled={this.state.disabled}
                            onClick={this.nextQuestionHandler.bind(this)}>
                        Nästa
                    </button>
                )}

                {currentQuestion === quizData.length - 1 && (
                    <button className="ui inverted button"
                            onClick={this.finishHandler.bind(this)}>
                        Avsluta
                    </button>
                )}
            </div>
        );
    }
}
export default FilmQuiz;
