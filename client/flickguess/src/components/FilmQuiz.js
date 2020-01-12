import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Spotify from "./Spotify";
import './FilmQuiz.css';
//import Timer from './Timer/TimerComponent';

let nbrOfQuestions = 3; //How many questions the game has
let nbrOfOptions = 4; //How many options each question has
const quizData = []; //Containing the answers and options for the questions
const imageData = []; //Linking image urls to image ids

class Option extends Component {

    //Deselecting all other options and selecting this
    select() {
        let elems = document.getElementsByClassName('option');
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('gray-border');
        }
        let elem = document.getElementById(this.props.poster);
        elem.classList.add('gray-border');
        this.props.onClick();
    }

    render() {
        
        //Find poster url in imageData
        let source;
        for (let i = 0; i < imageData.length; i++) {
            if (imageData[i].id === this.props.poster) {
                source = imageData[i].poster;
                break;
            }
        }
        return(
            <div
                id={this.props.poster}
                 className={this.props.className}
                 onClick={() => this.select()}
            >
                <img src={source} alt='movie poster' className='optionImage'/>
                <p className='optionText'>{this.props.title}</p>
            </div>
        );
    }
}

class Options extends Component {

    render() {
        return (
            <div className='options'>
            {this.props.options.map((option, index) => (
                <Option
                    key={index}
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

const addToQuizData = (options, answer) => {
    quizData.push({
        options: options,
        answer: answer,
    });
}

function shuffle (array) {
    var i = 0
      , j = 0
      , temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
}

class Game extends Component {
    state = {
        currentQuestion: 0,
        disabled: true,
        myAnswer: null,
        score: 0,
        options: [],
        answer: '',
    };

    constructor(props) {
        super(props);
        this.child = React.createRef(); // To run spotifys play method
    }

    // Used to start playing as soon as spotify player are ready
    spotifyReady() {
        this.child.current.playSpotifyHandler(quizData[0].answer.spotify);
    }

    componentDidMount() {
        let index = this.state.currentQuestion;
        this.setState({
            answer: quizData[index].answer
        })
    }

    componentDidUpdate(prevProps, prevState) {
        let index = this.state.currentQuestion
        if (index !== prevState.currentQuestion) {
            this.setState({
                disabled: true,
                options: quizData[index].options,
                answer: quizData[index].answer,
            });
        }
    }

    nextQuestionHandler() {
        this.updateScore();

        let elems = document.getElementsByClassName('option');
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('gray-border');
        }

        let index = this.state.currentQuestion + 1;
        this.setState({
            currentQuestion: index
        });
        this.child.current.playSpotifyHandler(quizData[index].answer.spotify);
    };

    updateScore() {
        const { myAnswer, answer, score } = this.state;

        if (myAnswer === answer.title) {
            this.setState({ score: score + 1 });
            quizData[this.state.currentQuestion].answer.correct = true;
            if (this.state.currentQuestion === quizData.length - 1) {
                this.props.end(score + 1);
                this.child.current.stopPlaying();
            }
        } else {
            if (this.state.currentQuestion === quizData.length - 1) {
                this.props.end(score);
                this.child.current.stopPlaying();
            }
        }
    }

    selectAnswer(answer) {
        this.setState({
            myAnswer: answer,
            disabled: false,
        });
    };

    render() {
        return (
            <div className="App">
                <Spotify
                    spotifyReady={() => this.spotifyReady()}
                    ref={this.child}
                    accessToken={this.props.location.state.accessToken}
                    spotifyId={this.state.spotifyId}
                />
                {/*Removed temporarily*/}
                {/*<Timer time={5}
                        onFinish={this.onTimerFinish.bind(this)}
                        onChange={this.onTimerChange.bind(this)}
                    />*/}

                <h1>{'Vilken film är detta?'} </h1>

                <span key={'questionOrder'}>{`Fråga ${this.state.currentQuestion+1} av ${quizData.length}`}</span>

                <Options options={quizData[this.state.currentQuestion].options} onClick={(title) => this.selectAnswer(title)}/>

                {this.state.currentQuestion < quizData.length - 1 && (
                    <button className="glow-on-hover"
                            disabled={this.state.disabled}
                            onClick={this.nextQuestionHandler.bind(this)}>
                        Nästa
                    </button>
                )}

                {this.state.currentQuestion === quizData.length - 1 && (
                    <button className="glow-on-hover"
                            disabled={this.state.disabled}
                            onClick={() => this.updateScore()}>
                        Avsluta
                    </button>
                )}
            </div>
        );
    }
}

class Result extends Component {
    render() {
        return (
            <div className="result">
                <h3>Ditt slutresultat blev {this.props.score} av {quizData.length} poäng </h3>

                <p>
                    Rätt svar på frågorna var
                </p>

                <ul id="quizResultList">
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

class FilmQuiz extends Component {
    state = {
        isEnd: false,
        load: false,
        score: 0
    };

    constructor(props) {
        super(props);
        nbrOfQuestions = this.props.location.state.questions;
        nbrOfOptions = this.props.location.state.options;
    }

    componentDidMount() {
        this.fetchQuizData();
    }

    fetchMoviePosters() {
        const apiKey = '7aa96104';
        let id;
        for (let i = 0; i < quizData.length; i++) {
            for (let j = 0; j < quizData[i].options.length; j++) {
                id = quizData[i].options[j].imdb;
                fetch(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
                .then(response => response.json())
                .then((responseJson) => {
                    let counter = i * quizData[i].options.length + j;
                    quizData[i].options[j]['poster-id'] = counter;
                    imageData.push({
                        'id' : counter,
                        'poster' : responseJson.Poster
                    })
                    this.setState({
                        load: true
                    })
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        }
    }

    fetchQuizData() {
        fetch(`http://localhost:5000/api/v1/themes/random?questions=${nbrOfQuestions}&options=${nbrOfOptions}`)
        .then(response => response.json())
        .then((responseJson) => {
            let answer = "";
            for (let i = 0; i < responseJson.length; i++) {
                let options = [];
                answer = {
                    'title' : responseJson[i][0]['movie title'],
                    'spotify': responseJson[i][0]['spotify'],
                    'song': responseJson[i][0]['title'],
                    'composer': responseJson[i][0]['composer'],
                    'correct': false
                };
                for (let j = 0; j < responseJson[i].length; j++) {
                    options.push({
                        'movie title' : responseJson[i][j]['movie title'],
                        'imdb': responseJson[i][j]['imdb'],
                    })
                }
                shuffle(options);
                addToQuizData(options, answer);
            };
            this.setState ({
                spotifyId: quizData[0].answer.spotify
            })
            this.fetchMoviePosters();
        })
        .catch((error) => {
            console.error(error);
        });
    }

    onTimerChange(time) {
    }

    onTimerFinish() {
        console.log('finished');
    }

    end(theScore) {
        this.setState({
            score: theScore,
            isEnd: true
        })
    }

    render() {
        return this.state.load ? (this.state.isEnd ? 
            <Result 
                score={this.state.score}
            />
        : 
            <Game 
                location={this.props.location}
                end={(score) => this.end(score)}
            />
        ) : <div></div>
    }
}
export default FilmQuiz;
