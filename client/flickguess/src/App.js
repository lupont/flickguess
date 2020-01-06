import React, { Component } from 'react';
import queryString from 'query-string';
import { getMovie } from './util/http';
import MovieComponent from './components/MovieComponent/MovieComponent';
import './App.css';
import BazQuz from './components/pages/FooBar';
import FilmQuiz from './components/FilmQuiz';
import 'bootstrap/dist/css/bootstrap.min.css';
import StartPage from './components/StartPage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


class App extends Component {
    state = {
        movie: null,
    };

    async updateMovie(title) {
        this.setState({ movie: null });

        try {
            const movie = await getMovie(title);
            this.setState({ movie });
        }
        catch (ex) { }
    }

    render() {
        const { movie } = this.state;

        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route path="/" exact component={StartPage} />
                        <Route path="/quiz" component={FilmQuiz} />
                    </Switch>
                </div>
            </Router>
            // <div id="main-container">
            //     <div id="container">
            //         <div>
            //             
            //             <label htmlFor="movie-title-input">
            //                 Enter a movie title
            //             </label>

            //             <input name="movie-title-input"
            //                 onInput={event => this.updateMovie(event.target.value)} />
            //         </div>

            //         <MovieComponent movie={movie} />
            //     </div>
            // </div>

        );
    }
}






export default App;

