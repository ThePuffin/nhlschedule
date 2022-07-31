import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import M from 'materialize-css';
import moment from 'moment';
import React from 'react';

import CardSchedule from './cardSchedule/cardSchedule';
import DateTimePicker from './dateTimePicker/dateTimePicker';
import Filter from './filter/filter';

const teamsIdArray = [1, 55, 23, 22, 20, 52];
let startDate = '2022-10-25';
let endDate = '2022-11-15';

class Body extends React.Component {
  constructor(props) {
    super(props);
  }

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
          const gameDate = moment(date.date).format('DD-MM-YYYY');
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
    if (!isEmpty(this.state.teams) && !isEmpty(this.state.schedule)) {
      return (
        <div>
          <div className="container">
            <div className="input-field col s12">
              <DateTimePicker />
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
                  <div>
                    <div className="input-field ">
                      <select defaultValue={teamId} onChange={this.handleChange}>
                        {this.state.teams.map((team) => (
                          <option value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>
                    {this.state.schedule[teamId].map((teamDate) => (
                      <CardSchedule teamDate={teamDate} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <p>Wait for it ...</p>
        </div>
      );
    }
  }
}

export default Body;
