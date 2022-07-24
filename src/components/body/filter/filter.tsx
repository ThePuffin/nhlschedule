import React from 'react';

import Select from './select';

class Filter extends React.Component {
  render() {
    return (
      <div>
        <a className="btn-floating btn-large waves-effect waves-light red">
          <i className="material-icons">add</i>
        </a>

        <Select />
      </div>
    );
  }
}

export default Filter;
