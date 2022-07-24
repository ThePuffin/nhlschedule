import M from 'materialize-css';
import React from 'react';

class DateTimePicker extends React.Component {
  componentDidMount() {
    M.AutoInit();
  }
  componentDidUpdate() {
    M.AutoInit();
  }
  render() {
    return (
      <div className="input-field col s12">
        <p>dateTimePicker</p>
      </div>
    );
  }
}

export default DateTimePicker;
