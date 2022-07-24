import './App.css';

import React from 'react';

import Filter from './components/filter/filter';
import Header from './components/header/header';

function App() {
  return (
    <div className="App">
      <Header />
      <Filter />
    </div>
  );
}

export default App;
