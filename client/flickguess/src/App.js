import React, { Component } from 'react';
import queryString from 'query-string';
import { getMovie } from './util/http';
import MovieComponent from './components/MovieComponent/MovieComponent';
import Spotify from './components/Spotify'
import './App.css';

const client_id = "93bbd9bdac0741f2b2a873c624a12aec";
const response_type = "token";
const redirect_uri = "http://localhost:3000";
const scope = "streaming";
const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;

class App extends Component {

    state = {
        movie: null,
        access_token: null,
    };

    componentDidMount () {
        const parsedHash = queryString.parse(window.location.hash);
        if (parsedHash.access_token) {
            this.setState({ access_token: parsedHash.access_token })
        }
    }

    logInSpotifyHandler() {
        window.open(url, "_self");
    }

    async updateMovie(title) {
        this.setState({ movie: null });

        try {
            const movie = await getMovie(title);
            this.setState({ movie });
        }
        catch (ex) { }
    }

    render() {
        const { movie, access_token } = this.state;

        return (
            <div id="main-container">
                <div id="container">
                    <div>
                        {this.state.access_token ? <Spotify access_token={access_token}/> : <button onClick={this.logInSpotifyHandler}>Logga in på Spotify</button>}
                        <label htmlFor="movie-title-input">
                            Enter a movie title
                        </label>

                        <input name="movie-title-input"
                            onInput={event => this.updateMovie(event.target.value)} />
                    </div>

                    <MovieComponent movie={movie} />
                </div>
            </div>
        );
    }
}

export default App;
