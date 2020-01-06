import React, { Component } from 'react';
import Spotify from './Spotify'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import queryString from 'query-string';

const client_id = "93bbd9bdac0741f2b2a873c624a12aec";
const response_type = "token";
const redirect_uri = "http://localhost:3000/";
const scope = "streaming";
const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;

class StartPage extends Component {
    state = {
        access_token: null
    };

    componentDidMount () {
        const access_token = localStorage.getItem('spotify_access_token')
        this.setState({access_token: access_token})
    
        if (window.location.hash) {
          const parsedHash = queryString.parse(window.location.hash);
          if (parsedHash.access_token) {
            localStorage.setItem('spotify_access_token', parsedHash.access_token)
            this.setState({ access_token: parsedHash.access_token })
          }
        }
        
    }
    
    logInSpotifyHandler() {
        window.open(url, "_self");
    }


    render() {
        return (
            <div>
                <h1>Flickguess</h1>
                {this.state.access_token ? <p>Välkommen!</p> : <p>För att spela detta spelet måste du ha Spotify Premium</p>}
                {this.state.access_token ? <Link to="/quiz" access_token= {this.state.access_token}><button class="glow-on-hover">Spela</button></Link> : <button class="glow-on-hover" type="button" onClick={this.logInSpotifyHandler}>Logga in på Spotify</button>}
            </div>
        )

    }
}


export default StartPage;