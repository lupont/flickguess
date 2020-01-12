import { Component } from 'react';

let deviceId;
let spotifyPlayer;

/**
 * A component containing the Spotify player. Does not render anything.
 */
class SpotifyComponent extends Component {

    constructor(props) {
        super(props);
        this.playSpotifyHandler.bind(this);
    }

    shouldComponentUpdate(newProps, newState) {
        return newProps.spotifyId !== this.props.spotifyId;
    }

    /**
     * Creates a script tag and inserts a spotify player script. Authenticates the player
     * and retrieves the device id.
     */
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

    componentWillUnmount() {
        this.stopPlaying();
    }

    /**
     * Performs a PUT request to Spotify's API to play the specified track.
     * @param {*} spotifyId The Spotify Track ID of the song to play.
     */
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

    /**
     * Performs a PUT request to Spotify's API to stop (pause) the currently playing song.
     */
    stopPlaying() {
        fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.props.accessToken}`,
            },
        });
    }

    //No graphical rendering, just plays in the background
    render() { 
        return false;
    }
}

export default SpotifyComponent;