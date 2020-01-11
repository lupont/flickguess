import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

const client_id = '93bbd9bdac0741f2b2a873c624a12aec';
const response_type = 'token';
const redirect_uri = 'http://localhost:3000/';
const scope = ['streaming', "user-read-email", "user-read-private"];
const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;

class StartPage extends Component {
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
                
                {accessToken ? 
                    <Link to={{
                        pathname: '/quiz',
                        state: { accessToken }}}>
                        <button className='glow-on-hover'>
                            Spela
                        </button>
                    </Link> 
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


export default StartPage;