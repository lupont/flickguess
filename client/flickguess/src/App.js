import React from 'react';
import './App.css';
import BazQuz from './components/FooBar';

function App() {
  // Uses the JS ternary operator to showcase
  // conditional rendering.

  return (
    <div className="App">
      {true ? <BazQuz/> : <p>Not foo bar</p>}
    </div>
  );
}

export default App;
