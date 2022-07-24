import M from 'materialize-css';
import React from 'react';

class Select extends React.Component {
  componentDidMount() {
    M.AutoInit();
  }
  componentDidUpdate() {
    M.AutoInit();
  }
  render() {
    return (
      <div className="input-field col s12">
        <select defaultValue="">
          <option value="" disabled>
            Choose a team
          </option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </select>
      </div>
    );
  }
}

export default Select;
