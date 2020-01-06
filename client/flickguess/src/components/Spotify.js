import React, { Component } from 'react'


class Spotify extends Component {
    constructor(props) {
        super(props);
        const { access_token } = props;
        this.state = { access_token };
    }


    componentDidMount() {
        const script = document.createElement("script");

        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const spotifyPlayer = new window.Spotify.Player({
                name: 'Flickguess',
                getOAuthToken: (cb) => {
                    cb(this.state.access_token);
                }
            });

            this.setState({ spotifyPlayer: spotifyPlayer })
        }
    }

    playSpotifyHandler = () => {
        console.log(this)
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.device_id}`, {
            method: "PUT",
            body: JSON.stringify({
                // in the URIS array put songs we want to play
                uris: [
                    "spotify:track:3bidbhpOYeV4knp8AIu8Xn"
                ]
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.state.access_token}`
            }
        });
    }

    render() {
        const { spotifyPlayer } = this.state
        if (spotifyPlayer) {

            spotifyPlayer.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                this.setState({ device_id: device_id });
            });

            spotifyPlayer.connect();
            return <button onClick={this.playSpotifyHandler}>Spela låt</button>
        }

        return <h1>Initializing Spotify...</h1>
    }


}

export default Spotify;