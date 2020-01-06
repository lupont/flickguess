import React, { Component } from 'react';
import './MovieComponent.css';

class MovieComponent extends Component {
    render() {
        const { movie } = this.props;

        if (!movie || !movie.Response) {
            return (
                <div>
                    <p>
                        No movie supplied.
                    </p>
                </div>
            );
        }

        if (!movie.Response) {
            return (
                <div>
                    <p>
                        Movie not found.
                    </p>
                </div>
            );
        }

        return (
            <div>
                <div>
                    <h2>{movie.Title} ({movie.Year})</h2>
                    
                    <p>
                        Directed by <span>{movie.Director}</span>
                    </p>

                    <p>
                        Starring <span>{movie.Actors}</span>
                    </p>

                    <p>
                        {movie.Plot}
                    </p>
                    
                    <img src={movie.Poster} alt={`Poster for ${movie.Title}`}/>
                </div>
            </div>
        );
    }
}

export default MovieComponent;