import axios from 'axios';
import React from 'react';

import Select from './select';

class Filter extends React.Component {
  state = {
    teams: [],
  };

  async componentDidMount() {
    try {
      const resTeams = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams`);
      this.setState({ teams: resTeams.data.teams });
    } catch (error) {
      console.error(error);
    }
  }

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
