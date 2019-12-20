import React, { Component } from 'react';

import { getMovie } from './util/http';
import MovieComponent from './components/MovieComponent/MovieComponent';

import './App.css';

class App extends Component {
    state = {
        movie: null,
    };

    async updateMovie(title) {
        this.setState({ movie: null });

        try {
            const movie = await getMovie(title);
            this.setState({ movie });
        }
        catch (ex) {}
    }
    
    render() {
        const { movie } = this.state;

        return (
            <div id="main-container">
                <div id="container">
                    <div>
                        <label htmlFor="movie-title-input">
                            Enter a movie title
                        </label>

                        <input name="movie-title-input" 
                               onInput={event => this.updateMovie(event.target.value)}/>
                    </div>

                    <MovieComponent movie={movie}/>
                </div>
            </div>
        );
    }
}

export default App;
