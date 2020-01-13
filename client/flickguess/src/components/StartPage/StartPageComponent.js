import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

const client_id = '93bbd9bdac0741f2b2a873c624a12aec';
const response_type = 'token';
const redirect_uri = 'http://localhost:3000/';
const scope = ['streaming', "user-read-email", "user-read-private"];
const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;

/**
 * A component that displays authentication prompt and allows user to choose difficulty.
 */
class StartPageComponent extends Component {
    state = {
        accessToken: '',
    };

    componentDidMount () {
        if (window.location.hash) {
            const parsedHash = queryString.parse(window.location.hash);

            if (parsedHash.access_token) {
                this.setState({ accessToken: parsedHash.access_token });
            }
        }
    }
    
    logInSpotifyHandler() {
        window.open(url, '_self');
    }


    render() {
        const { accessToken } = this.state;

        return (
            <div>
                <h1>Flickguess</h1>
                {accessToken ? 
                    <p>Välkommen!</p> 
                : 
                    <p>För att spela detta spelet måste du ha Spotify Premium</p>
                }
                
                {accessToken ? (
                    <div>
                    <Link to={{
                        pathname: '/quiz',
                        state: { accessToken, questions:5, options: 4, time: 20 }}}>
                        <button className='glow-on-hover'>
                            Enkel
                        </button>
                    </Link>
                    <Link to={{
                        pathname: '/quiz',
                        state: { accessToken, questions:10, options: 4, time: 15 }}}>
                        <button className='glow-on-hover'>
                            Medel
                        </button>
                    </Link>
                    <Link to={{
                        pathname: '/quiz',
                        state: { accessToken, questions:20, options: 8, time: 10 }}}>
                        <button className='glow-on-hover'>
                            Svår
                        </button>
                    </Link> 
                </div>)
                : 
                    <button className='glow-on-hover' 
                            type='button' 
                            onClick={this.logInSpotifyHandler}>
                        Logga in på Spotify
                    </button>
                }
            </div>
        )

    }
}


export default StartPageComponent;