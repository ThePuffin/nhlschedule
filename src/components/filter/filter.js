import React from 'react';

import Select from './select';

class Filter extends React.Component {
  render() {
    return (
      <div>
        <a class="btn-floating btn-large waves-effect waves-light red">
          <i class="material-icons">add</i>
        </a>

        <Select />
      </div>
    );
  }
}

export default Filter;
