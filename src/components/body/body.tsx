import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import M from 'materialize-css';
import moment from 'moment';
import React from 'react';

import CardSchedule from './cardSchedule/cardSchedule';
import DateTimePicker from './dateTimePicker/dateTimePicker';
import Loader from './loader/loader';
import Selector from './selector/selector';

const defaultTeamsSelectedIds = [55, 23, 22, 20, 1];
let startDate = '2022-10-25';
let endDate = '2022-11-10';
let allDates = [];
const userFormat = 'DD MM YYYY';

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeTeam = this.handleChangeTeam.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  state = {
    startDate,
    endDate,
    teams: [],
    teamsSelectedIds: defaultTeamsSelectedIds,
    schedule: {},
  };
  async componentDidMount() {
    this.getAllDates();
    M.AutoInit();
    try {
      const resTeams = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams`);

      const activeTeams = resTeams.data.teams.filter((team) => team.active);
      const schedule = { ...this.state.schedule };

      activeTeams.map((team) => (schedule[team.id] = []));
      this.setState({ schedule });
      for (const teamSelectedId of this.state.teamsSelectedIds) {
        await this.updateScheduleData({ teamSelectedId });
      }
      this.setState({ teams: activeTeams });
    } catch (error) {
      console.error({ error });
    }
  }

  componentDidUpdate() {
    M.AutoInit();
  }

  getAllDates = () => {
    let date = moment(startDate);
    allDates = [];

    while (moment(date).isSameOrBefore(moment(endDate))) {
      allDates.push(moment(date).format(userFormat));
      date = moment(date).add(1, 'day');
    }
  };

  async handleChangeTeam({ index, newTeamId }) {
    if (index >= 0 && newTeamId) {
      newTeamId = Number(newTeamId);
      const teamsSelectedIds = [...this.state.teamsSelectedIds];
      teamsSelectedIds.splice(index, 1, newTeamId);

      this.setState({ teamsSelectedIds });

      await this.updateScheduleData({ teamSelectedId: newTeamId });
    }
  }

  async handleChangeDate({ newDate, dateToChange }) {
    const newDateFormated = newDate.split(' ').reverse().join('-');

    if (dateToChange === 'start') {
      startDate = newDateFormated;
      this.setState({ startDate });
    } else {
      if (moment(newDateFormated).isAfter(moment(startDate))) {
        endDate = newDateFormated;
      } else {
        endDate = startDate;
      }
    }
    this.getAllDates();
    for (const teamSelectedId of this.state.teamsSelectedIds) {
      await this.updateScheduleData({ teamSelectedId: this.state.teamsSelectedIds[0] });
    }
  }

  async updateScheduleData({ teamSelectedId }) {
    try {
      const resDate = await axios.get(
        ` https://statsapi.web.nhl.com/api/v1/schedule?site=fr_nhl&startDate=${this.state.startDate}&endDate=${this.state.endDate}&teamId=${teamSelectedId}`
      );

      const scheduleDates = resDate.data.dates;
      const scheduleState = { ...this.state.schedule };
      scheduleState[teamSelectedId] = [];

      for (const date of allDates) {
        const game = scheduleDates.find((schedule) => moment(schedule.date).format(userFormat) === date);

        let datas = {};
        if (game) {
          const teams = game.games[0].teams;
          const venue = game.games[0].venue;

          if (teams.home.team.id === teamSelectedId) {
            datas = {
              awayTeam: teams.away.team.name,
              homeTeam: teams.home.team.name,
              arenaName: venue.name,
              gameDate: game.date,
            };
          }
        }

        scheduleState[teamSelectedId].push(datas);
      }

      this.setState({ schedule: scheduleState });
    } catch (error) {
      console.log({ error });
    }
  }

  render() {
    if (!isEmpty(this.state.teams) && !isEmpty(this.state.schedule)) {
      return (
        <div>
          <div className="container">
            <div className="row">
              <div className="input-field col s6">
                <DateTimePicker
                  dateTimePickerData={{
                    handleChangeDate: this.handleChangeDate,
                    date: startDate,
                    format: userFormat,
                    icon: 'hourglass_top',
                    name: 'start',
                  }}
                />
              </div>
              <div className="input-field col s6">
                <DateTimePicker
                  dateTimePickerData={{
                    handleChangeDate: this.handleChangeDate,
                    date: endDate,
                    format: userFormat,
                    icon: 'hourglass_bottom',
                    name: 'end',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col s2">
                <div className="input-field" style={{ visibility: 'hidden' }}>
                  <select id="hiddenSelect"></select>
                </div>

                {allDates.map((gameDate) => (
                  <div className="card blue-grey darken-3">
                    <div className="card-content white-text">
                      <span className="card-title">{gameDate}</span>
                    </div>
                  </div>
                ))}
              </div>
              {this.state.teamsSelectedIds.map((teamId, index) => (
                <div className="input-field col s2">
                  <Selector
                    handleChangeTeam={this.handleChangeTeam}
                    index={index}
                    teams={this.state.teams}
                    teamId={teamId}
                  />

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
