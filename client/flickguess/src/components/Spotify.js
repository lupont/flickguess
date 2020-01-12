import React, { Component } from 'react';


class Spotify extends Component {
    state = {
        accessToken: '',
        deviceId: '',
        spotifyId: '',
        spotifyPlayer: null,
    };


    componentDidMount() {
        this.setState({ accessToken: this.props.accessToken });
        const script = document.createElement('script');

        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const spotifyPlayer = new window.Spotify.Player({
                name: 'Flickguess',
                getOAuthToken: (cb) => {
                    cb(this.state.accessToken);
                },
            });

            spotifyPlayer.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID!', device_id);
                this.setState({ deviceId: device_id });
            });

            this.setState({ spotifyPlayer });
        };
    }

    onSpotifyReady() {
        this.state.spotifyPlayer.connect();
        this.playSpotifyHandler();
    }

    playSpotifyHandler() {
        this.setState ({ spotifyId : this.props.spotifyId });

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({
                uris: [`spotify:track:${this.state.spotifyId}`],
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.state.accessToken}`,
            },
        });
    }

    stopPlaying() {
        fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${this.state.deviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.state.accessToken}`,
            },
        });
    }

    render() {
        const { spotifyPlayer } = this.state;

        if (spotifyPlayer) {
            spotifyPlayer.addListener('ready', ({ device_id }) => {
                this.setState({ deviceId: device_id });
            });
        }

        // if (spotifyPlayer && this.props.playInstantly) {
        //     this.onSpotifyReady();
        // }

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
        );
    }
}

export default Spotify;