import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import M from 'materialize-css';
import moment from 'moment';
import React from 'react';

import CardSchedule from './cardSchedule/cardSchedule';
import DateTimePicker from './dateTimePicker/dateTimePicker';
import Loader from './loader/loader';
import Selector from './selector/selector';

let defaultTeamsSelectedIds = [];
const year = new Date().getFullYear();
const now = moment();
const startSeason =
  now.isBefore(moment(`${year} 08 01`)) && now.isSameOrAfter(moment(`${year} 01 01`))
    ? moment(`${year - 1} 10 01 `).format('YYYY-MM-DD')
    : moment(`${year} 10 01 `).format('YYYY-MM-DD');
const endSeason =
  now.isAfter(moment(`${year} 08 01`)) && now.isBefore(moment(`${year + 1} 01 01`))
    ? moment(`${year + 1} 07 01 `).format('YYYY-MM-DD')
    : moment(`${year} 07 01 `).format('YYYY-MM-DD');

let startDate = moment().isBefore(startSeason) ? startSeason : moment().format('YYYY-MM-DD');
let endDate = moment(startDate).add(1, 'month').format('YYYY-MM-DD');
let allDates = [];
const userFormat = 'DD MM YYYY';

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeTeam = this.handleChangeTeam.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  state = {
    startDate: startDate,
    endDate: endDate,
    teams: [],
    teamsSelectedIds: defaultTeamsSelectedIds,
    schedule: {},
  };

  async componentWillMount() {
    const teamsFromStorage = JSON.parse(localStorage.getItem('defaultTeamsSelectedIds'));

    if (teamsFromStorage.length) {
      defaultTeamsSelectedIds = teamsFromStorage;
      this.setState({ teamsSelectedIds: teamsFromStorage });
    }
  }
  async componentDidMount() {
    this.getAllDates();

    M.AutoInit();
    try {
      const resTeams = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams`);

      const activeTeams = resTeams.data.teams
        .filter((team) => team.active)
        .map((team) => {
          team.value = team.id;
          team.label = team.name;
          return team;
        });

      const schedule = { ...this.state.schedule };

      activeTeams.forEach((team, index) => {
        schedule[team.id] = [];
        if (defaultTeamsSelectedIds.length < 5) {
          defaultTeamsSelectedIds.push(team.value);
        }
      });

      this.setState({ schedule });
      for (const teamSelectedId of this.state.teamsSelectedIds) {
        await this.updateScheduleData({ teamSelectedId });
      }
      this.setState({ teams: activeTeams });
    } catch (error) {
      console.error({ error });
    }
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
      localStorage.setItem('defaultTeamsSelectedIds', JSON.stringify(teamsSelectedIds));

      await this.updateScheduleData({ teamSelectedId: newTeamId });
    }
  }

  async handleChangeDate({ newDate, dateToChange }) {
    const newDateFormated = newDate.split(' ').reverse().join('-');

    startDate = newDateFormated;
    endDate = moment(newDateFormated).add(1, 'month').format('YYYY-MM-DD');

    this.setState({ startDate, endDate });

    await this.getAllDates();
    for (const teamSelectedId of this.state.teamsSelectedIds) {
      await this.updateScheduleData({ teamSelectedId });
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
            <div className="row" style={{ height: '10vh' }}>
              <div className="input-field col s12" id="start">
                <DateTimePicker
                  dateTimePickerData={{
                    startSeason,
                    endSeason,
                    handleChangeDate: this.handleChangeDate,
                    date: this.state.startDate,
                    format: userFormat,
                    icon: 'hourglass_top',
                    name: 'start',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="container" style={{ height: '78vh', overflow: 'auto' }}>
            <div className="row">
              <div className="col s2">
                <div style={{ visibility: 'hidden' }} id="hidden selector">
                  <Selector
                    handleChangeTeam={this.handleChangeTeam}
                    index="1"
                    teams={this.state.teams}
                    teamIds={this.state.teamsSelectedIds}
                  />
                </div>

                {allDates.map((gameDate) => (
                  <div className="card red darken-3" id={gameDate}>
                    <div className="card-content white-text">
                      <span className="card-title">{gameDate}</span>
                    </div>
                  </div>
                ))}
              </div>

              {this.state.teamsSelectedIds.map((teamId, index) => (
                <div className="col s2" id={teamId.toString()}>
                  <Selector
                    handleChangeTeam={this.handleChangeTeam}
                    index={index}
                    teams={this.state.teams}
                    teamIds={this.state.teamsSelectedIds}
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
