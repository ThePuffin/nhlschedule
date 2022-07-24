import React from 'react';

import CardSchedule from './cardSchedule/cardSchedule';
import DateTimePicker from './dateTimePicker/dateTimePicker';
import Filter from './filter/filter';

class Body extends React.Component {
  render() {
    return (
      <div>
        <DateTimePicker />
        <Filter />
        <CardSchedule />
      </div>
    );
  }
}

export default Body;
