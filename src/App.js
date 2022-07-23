import React from 'react';

import Filter from './components/filter/filter';
import Header from './components/header/header';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Filter />
      </div>
    );
  }
}

export default App;
