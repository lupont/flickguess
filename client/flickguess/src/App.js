import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import FilmQuiz from './components/FilmQuiz/FilmQuizComponent';
import StartPage from './components/StartPage/StartPageComponent';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" exact component={StartPage}/>
                    <Route path="/quiz" component={FilmQuiz}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
