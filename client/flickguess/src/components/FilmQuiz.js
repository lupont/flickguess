import React, { Component } from 'react';
import Spotify from "./Spotify";
import './FilmQuiz.css';
import Timer from './Timer/TimerComponent';

class Option extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState ({
            id: this.props.poster
        });
    }

    select() {
        let elems = document.getElementsByClassName('option');
        console.log(elems);
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('gray-border');
        }
        let elem = document.getElementById(this.props.poster);
        elem.classList.add('gray-border');
        this.props.onClick();
    }

    render() {
            let source;
    for (let i = 0; i < imageData.length; i++) {
        if (imageData[i].id == this.props.poster) {
            source = imageData[i].poster;
        }
    }
   return(
   <div id={this.props.poster} className={this.props.className} onClick={() => this.select()}>
       <img src={source} alt='movie poster' className='optionImage'/>
       <p className='optionText'>{this.props.title}</p>
    </div>
   );
    }
}

class Options extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let counter = 0;
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

const quizData = [];
const imageData = [];
const addToQuizData = (options, answer, poster) => {
    quizData.push({
        id : quizData.length,
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

    fetchMoviePosters() {
        const apiKey = '7aa96104';
        let id;
        let counter = 0;
        for (let i = 0; i < quizData.length; i++) {
            for (let j = 0; j < quizData[i].options.length; j++) {
                id = quizData[i].options[j].imdb;
                fetch(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
                    .then(response => response.json())
                    .then((responseJson) => {
                        quizData[i].options[j]['poster-id'] = counter;
                        imageData.push({
                            'id' : counter,
                            'poster' : responseJson.Poster})
                        counter++;
                    })
                    .then(()=> {
                        this.loadQuizData();}
                        )
                    .catch((error) => {
                        console.error(error);
                    });
                }
            }
    }

    fetchQuizData() {
        const q = 5;
        const o = 4;
        fetch(`http://localhost:5000/api/v1/themes/random?questions=${q}&options=${o}`)
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
            quizData[this.state.currentQuestion].answer.correct = true;
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
        console.log('finished');
    }

    render() {
        const { options, myAnswer, currentQuestion, isEnd } = this.state;
        console.log(quizData);
        return isEnd ? (
            <div className="result">
                <h3>Ditt slutresultat blev {this.state.score} av {quizData.length} poäng </h3>

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
            </div>
        ) : (
            <div className="App">
                <Spotify 
                    accessToken={this.props.location.state.accessToken}
                    spotifyId={this.state.spotifyId}
                />
                {/*Removed temporarily*/}
                {/*<Timer time={5}
                        onFinish={this.onTimerFinish.bind(this)}
                        onChange={this.onTimerChange.bind(this)}
                    />*/}

                <h1>{'Vilken film är detta?'} </h1>

                <span key={'questionOrder'}>{`Fråga ${currentQuestion+1} av ${quizData.length}`}</span>

                {/*Not used any more, could be removed*/}
                {/*{options.map(option => (
                    <p key={option['movie title']}
                        className={`ui floating message options ${myAnswer === option['movie title'] ? "selected" : null}`}
                        onClick={() => this.checkAnswer(option['movie title'])}>
                        {option['movie title']}
                    </p>
                ))}*/}

                <Options options={options} onClick={(title) => this.checkAnswer(title)}/>

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
