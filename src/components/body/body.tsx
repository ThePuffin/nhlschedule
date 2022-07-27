import axios from 'axios';
import M from 'materialize-css';
import moment from 'moment';
import React from 'react';

import CardSchedule from './cardSchedule/cardSchedule';
import DateTimePicker from './dateTimePicker/dateTimePicker';
import Filter from './filter/filter';

const teamsID = [1, 55, 23, 22, 20, 52];
let startDate = '2022-10-20';
let endDate = '2022-11-10';

class Body extends React.Component {
  state = {
    teams: [],
    teamDates: [],
  };
  async componentDidMount() {
    M.AutoInit();
    try {
      const teamId = 1;
      const resTeams = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams`);

      this.setState({ teams: resTeams.data.teams });

      const resDate = await axios.get(
        ` https://statsapi.web.nhl.com/api/v1/schedule?site=fr_nhl&startDate=${startDate}&endDate=${endDate}&teamId=${teamId}`
      );
      let teamDates = resDate.data.dates.map((date) => {
        const arenaName = date.games[0].venue.name;
        const gameDate = date.date;
        const awayTeam = date.games[0].teams.away.team.name;
        const homeTeam = date.games[0].teams.home.team.name;
        const homeTeamId = date.games[0].teams.home.team.id;

        const datas = {
          gameDate,
          arenaName,
          awayTeam,
          homeTeam,
        };

        if (teamId === homeTeamId) {
          return datas;
        }
      });
      teamDates = teamDates.filter((teamDate) => teamDate);

      this.setState({ ...this.state.teamDates, teamDates });
    } catch (error) {
      console.error({ error });
    }
  }
  componentDidUpdate() {
    M.AutoInit();
  }

  render() {
    if (this.state.teamDates.length > 1 && this.state.teams.length > 1) {
      return (
        <div>
          <div className="container">
            <div className="input-field col s12">
              <p>dateTimePicker</p>
            </div>
            <div className="col s12">
              <a className="btn-floating btn-large waves-effect waves-light red">
                <i className="material-icons">add</i>
              </a>
              <p>add a team</p>
            </div>
          </div>

          <div className="container">
            <div className="row">
              {teamsID.map((teamId) => (
                <div className="col s2">
                  <div>
                    <div className="input-field ">
                      <select defaultValue="">
                        <option value="">{this.state.teams.find((team) => team.id === teamId).name}</option>
                        {this.state.teams.map((team) => (
                          <option value={teamId}></option>
                        ))}
                      </select>
                    </div>

                    {this.state.teamDates.map((teamDate) => (
                      <div className="row">
                        <div className="col 12">
                          <div className="card blue-grey darken-1">
                            <div className="card-content white-text">
                              <span className="card-title">{teamDate.gameDate}</span>
                              <p>
                                "{teamDate.awayTeam}" VS "{teamDate.homeTeam}"
                              </p>
                              <em>at : "{teamDate.arenaName}"</em>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Body;
