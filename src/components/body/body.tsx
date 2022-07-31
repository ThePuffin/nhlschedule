import axios from 'axios';
import M from 'materialize-css';
import moment from 'moment';
import React from 'react';

import CardSchedule from './cardSchedule/cardSchedule';
import DateTimePicker from './dateTimePicker/dateTimePicker';
import Filter from './filter/filter';

const teamsIdArray = [1, 55, 23, 22, 20, 52];
let startDate = '2022-10-20';
let endDate = '2022-11-10';

class Body extends React.Component {
  state = {
    teams: [],
    schedule: {},
  };
  async componentDidMount() {
    M.AutoInit();
    try {
      for (const teamId of teamsIdArray) {
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

        this.state.schedule[teamId] = teamDates;
      }

      const resTeams = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams`);

      this.setState({ teams: resTeams.data.teams });
    } catch (error) {
      console.error({ error });
    }
  }
  componentDidUpdate() {
    M.AutoInit();
  }

  handleChange(event) {
    console.log({ event });
  }

  render() {
    if (this.state.teams.length > 1 && Object.keys(this.state.schedule).length > 1) {
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
              {teamsIdArray.map((teamId) => (
                <div className="col s2">
                  <p>coucou</p>
                  <div>
                    <div className="input-field ">
                      <select defaultValue={teamId} onChange={this.handleChange}>
                        {this.state.teams.map((team) => (
                          <option value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>
                    {this.state.schedule[teamId].map((teamDate) => (
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
    } else if (Object.keys(this.state.schedule).length === 0) {
      return (
        <div>
          <p>ici</p>
        </div>
      );
    } else {
      return (
        <div>
          <p>nope</p>
        </div>
      );
    }
  }
}

export default Body;
