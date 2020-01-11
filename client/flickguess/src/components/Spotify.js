import React, { Component } from 'react'


class Spotify extends Component {
    state = {
        accessToken: '',
        deviceId: '',
        spotifyId: '',
        spotifyPlayer: null,
    };

    constructor(props) {
        super(props);
        // this.setState({ accessToken: props.accessToken });
    }

    componentDidMount() {
        this.setState({ accessToken: this.props.accessToken });
        const script = document.createElement("script");

        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const spotifyPlayer = new window.Spotify.Player({
                name: 'Flickguess',
                getOAuthToken: (cb) => {
                    cb(this.state.accessToken);
                },
            });

            this.setState({ spotifyPlayer });
        }
    }

    playSpotifyHandler() {
        this.setState ({
            spotifyId : this.props.spotifyId
        })
        //console.log('|||||||||||||||||||||||', this.state.deviceId);
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`, {
            method: "PUT",
            body: JSON.stringify({
                uris: [
                    "spotify:track:" + this.state.spotifyId
                ]
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.state.accessToken}`
            }
        });
    }

    render() {
        const { spotifyPlayer } = this.state;
        if (spotifyPlayer) {

            spotifyPlayer.addListener('ready', ({ device_id }) => {
                this.setState({ deviceId: device_id });
            });

            spotifyPlayer.connect();
        }

        return (
            <div>
                {this.state.deviceId ? 
                    <button onClick={this.playSpotifyHandler.bind(this)}>
                        Spela låt
                    </button> 
                : 
                    <h1>
                        Initializing Spotify...
                    </h1>
                }
            </div>

        )
    }


}

export default Spotify;