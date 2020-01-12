import React, { Component } from 'react';
import './FilmQuizComponent.css';

import Game from '../Game/GameComponent';
import Result from '../Result/ResultComponent';

let nbrOfQuestions = 3; //How many questions the game has
let nbrOfOptions = 4; //How many options each question has
const quizData = []; //Containing the answers and options for the questions
const imageData = []; //Linking image urls to image ids

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

class FilmQuizComponent extends Component {
    state = {
        isEnd: false,
        isLoading: true,
        score: 0
    };

    constructor(props) {
        super(props);
        nbrOfQuestions = this.props.location.state.questions;
        nbrOfOptions = this.props.location.state.options;
    }

    async componentDidMount() {
        console.log('quiz loaded');
        await this.fetchQuizData();
        console.log('data fetched');
    }

    async fetchMoviePosters() {
        const apiKey = '7aa96104';

        for (let i = 0; i < quizData.length; i++) {
            for (let j = 0; j < quizData[i].options.length; j++) {
                const id = quizData[i].options[j].imdb;
                const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
                const json = await response.json();
                const counter = i * quizData[i].options.length + j;
                quizData[i].options[j]['poster-id'] = counter;
                imageData.push({
                    id: counter,
                    poster: json.Poster,
                });
            }
        }
    }

    async fetchQuizData() {
        const response = await fetch(`http://localhost:5000/api/v1/themes/random?questions=${nbrOfQuestions}&options=${nbrOfOptions}`);
        const json = await response.json();

        let answer = '';
        for (let i = 0; i < json.length; i++) {
            const options = [];
            const current = json[i][0];

            answer = {
                title: current['movie title'],
                spotify: current['spotify'],
                song: current['title'],
                composer: current['composer'],
                correct: false,
            };

            for (let j = 0; j < json[i].length; j++) {
                options.push({
                    'movie title': json[i][j]['movie title'],
                    imdb: json[i][j]['imdb'],
                });
            }

            shuffle(options);
            addToQuizData(options, answer);
        }

        console.log(quizData);

        this.setState({ spotifyId: quizData[0].answer.spotify });
        await this.fetchMoviePosters();
        this.setState({ isLoading: false });
    }

    end(score) {
        this.setState({
            score,
            isEnd: true,
        });
    }

    render() {
        if (this.state.isLoading)
            return null;

        return this.state.isEnd ? (
            <Result score={this.state.score} quizData={quizData} />
        ) : (
            <Game location={this.props.location}
                  imageData={imageData}
                  quizData={quizData}
                  end={score => this.end(score)}/>
        );
    }
}
export default FilmQuizComponent;
