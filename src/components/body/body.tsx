import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import M from 'materialize-css';
import moment from 'moment';
import React from 'react';

import CardSchedule from './cardSchedule/cardSchedule';
import DateTimePicker from './dateTimePicker/dateTimePicker';
import Filter from './filter/filter';
import Loader from './loader/loader';
import Selector from './selector/selector';

const teamsIdArray = [55, 23, 22, 20, 1];
let startDate = '2022-10-25';
let endDate = '2022-11-10';
const format = 'DD-MM-YYYY';

const callback = (name: string | undefined) => {
  console.log('callback');
};

class Body extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    startValue: startDate,
    endValue: endDate,
    teams: [],
    schedule: {},
  };
  async componentDidMount() {
    M.AutoInit();
    try {
      const resTeams = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams`);

      const activeTeams = resTeams.data.teams.filter((team) => team.active);

      const resDate = await axios.get(
        ` https://statsapi.web.nhl.com/api/v1/schedule?site=fr_nhl&startDate=${startDate}&endDate=${endDate}`
      );
      const scheduleDates = resDate.data.dates;
      for (const scheduleDate of scheduleDates) {
        const games = scheduleDate.games;
        const gameDate = moment(scheduleDate.date).format(format);
        activeTeams.forEach((activeTeam) => {
          let datas;
          const team = games.find((game) => game.teams.home.team.id === activeTeam.id);
          if (team) {
            datas = {
              gameDate,
              awayTeam: team.teams.away.team.name,
              homeTeam: team.teams.home.team.name,
              arenaName: team.venue.name,
            };
          } else {
            datas = { gameDate };
          }
          if (!this.state.schedule[activeTeam.id]) {
            this.state.schedule[activeTeam.id] = [datas];
          } else {
            this.state.schedule[activeTeam.id].push(datas);
          }
        });
      }

      this.setState({ teams: activeTeams });
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
            <div className="row">
              <div className="input-field col s6">
                <DateTimePicker date={startDate} format={format} icon={'hourglass_top'} name="start" />{' '}
              </div>
              <div className="input-field col s6">
                <DateTimePicker date={endDate} format={format} icon={'hourglass_bottom'} name="end" />
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              {teamsIdArray.map((teamId, index) => (
                <div className="col s2">
                  <Selector onClick={callback} index={index} teams={this.state.teams} teamId={teamId} />

                  {this.state.schedule[teamId].map((teamDate) => (
                    <CardSchedule teamDate={teamDate} />
                  ))}
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
          <Loader />
        </div>
      );
    }
  }
}

export default Body;
