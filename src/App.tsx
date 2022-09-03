import './App.css';

import React from 'react';

import Body from './components/body/body';
import Header from './components/header/header';

function App() {
  return (
    <div className="App" style={{ overflow: 'hidden', height: '100vh' }}>
      <Header />
      <Body />
    </div>
  );
}

export default App;
