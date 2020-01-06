import React, { Component } from 'react';
import './MovieComponent.css';

class MovieComponent extends Component {
    render() {
        const { movie } = this.props;

        if (!movie) {
            return (
                <div>
                    <p>
                        No movie supplied.
                    </p>
                </div>
            );
        }

        return (
            <div>
                <div>
                    <h2>{movie.Title}</h2>
                    
                    <p>
                        Directed by <span>{movie.Director}</span>
                    </p>

                    <p>
                        Starring <span>{movie.Actors}</span>
                    </p>
                    
                    <img src={movie.Poster} alt={'Poster for ' + movie.Title}/>
                </div>
            </div>
        );
    }
}

export default MovieComponent;