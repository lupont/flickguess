import React from 'react';
import './App.css';
import BazQuz from './components/FooBar';
import FilmQuiz from './components/FilmQuiz';
import 'bootstrap/dist/css/bootstrap.min.css';




class App extends React.Component {
  /*render(){

 //  Uses the JS ternary operator to showcase
   //conditional rendering.
  
    return (
     <div className="App">
        {true ? <BazQuz/> : <p>Not foo bar</p>}
      </div>
      );
    }
  }*/


  render(){
    
    return (
      <div className="App">
      <FilmQuiz />
    </div>
    );
  }

}






export default App;

