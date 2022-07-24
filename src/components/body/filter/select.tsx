import axios from 'axios';
import M from 'materialize-css';
import React from 'react';

class Select extends React.Component {
  state = {
    teams: [],
  };
  async componentDidMount() {
    M.AutoInit();
    try {
      const resTeams = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams`);
      this.setState({ teams: resTeams.data.teams });
      console.log(this.state.teams[0]);
    } catch (error) {
      console.error({ error });
    }
  }
  componentDidUpdate() {
    M.AutoInit();
  }

  render() {
    if (this.state.teams.length) {
      return (
        <div className="input-field col s12">
          <select defaultValue="">
            <option value="" disabled>
              Choose a team
            </option>
            {this.state.teams.map((team) => (
              <option value={team.franchiseId}>{team.name}</option>
            ))}
          </select>
        </div>
      );
    }
  }
}

export default Select;
