import React, { Component } from 'react';
import { getMovie } from './util/http';
import './App.css';
import FilmQuiz from './components/FilmQuiz/FilmQuiz';
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
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route path="/" exact component={StartPage} />
                        <Route path="/quiz" component={FilmQuiz} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
