import axios from 'axios';
import M from 'materialize-css';
import React from 'react';

import CardSchedule from './cardSchedule/cardSchedule';
import DateTimePicker from './dateTimePicker/dateTimePicker';
import Filter from './filter/filter';

const teamID = [55, 23, 22, 20, 52];

class Body extends React.Component {
  state = {
    teams: [],
    teamDates: [],
  };
  async componentDidMount() {
    M.AutoInit();
    try {
      const resTeams = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams`);

      this.setState({ teams: resTeams.data.teams });

      const resDate = await axios.get(
        ` https://statsapi.web.nhl.com/api/v1/schedule?site=fr_nhl&startDate=2022-10-20&endDate=2022-11-10&teamId=22`
      );
      const teamDates = resDate.data.dates.map((date) => {
        date.games = date.games[0];
        return date;
      });

      this.setState({ teamDates });
    } catch (error) {
      console.error({ error });
    }
  }
  componentDidUpdate() {
    M.AutoInit();
  }

  render() {
    return (
      <div>
        <div className="input-field col s12">
          <p>dateTimePicker</p>
        </div>
        <div>
          <a className="btn-floating btn-large waves-effect waves-light red">
            <i className="material-icons">add</i>
          </a>

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
        </div>
        <div className="input-field col s12">
          {this.state.teamDates.map((teamDate) => (
            <div className="row">
              <div className="col s12 m6">
                <div className="card blue-grey darken-1">
                  <div className="card-content white-text">
                    <span className="card-title">{teamDate.date}</span>
                    <p>
                      "{teamDate.games.teams.away.team.name}" VS "{teamDate.games.teams.home.team.name}"
                    </p>
                    <em>at : "{teamDate.games.venue.name}"</em>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Body;
