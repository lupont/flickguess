import React, { Component } from 'react';

let deviceId;
let spotifyPlayer;

class Spotify extends Component {

    constructor(props) {
        super(props);
        this.playSpotifyHandler.bind(this);
    }

    shouldComponentUpdate(newProps, newState) {
        if (newProps.spotifyId !== this.props.spotifyId) {
            return true;
        } 

        return false;
    }

    componentDidMount() {
        this.setState({ accessToken: this.props.accessToken });
        const script = document.createElement('script');

        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;

        document.body.appendChild(script);

        //create player
        window.onSpotifyWebPlaybackSDKReady = () => {
            spotifyPlayer = new window.Spotify.Player({
                name: 'Flickguess',
                getOAuthToken: (cb) => {
                    cb(this.props.accessToken);
                },
            });

            //Get device id, contacts parent when done
            spotifyPlayer.addListener('ready', ({ device_id }) => { deviceId = device_id; this.props.spotifyReady() });
            spotifyPlayer.connect();

        };
    }

    playSpotifyHandler(spotifyId) {

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            body: JSON.stringify({
                uris: [ "spotify:track:" + spotifyId ]
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.props.accessToken}`
            }
        });
    }

    stopPlaying() {
        spotifyPlayer.pause().then(() => {
            console.log('Paused!');
          });
    }

    //No graphical rendering, just plays in the background
    render() { return ( <div className='spotifyPlayer'></div> ) }
}

export default Spotify;