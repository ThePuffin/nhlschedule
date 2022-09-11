import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import M from 'materialize-css';
import moment from 'moment';
import React from 'react';

import CardSchedule from './cardSchedule/cardSchedule';
import DateRangePicker from './dateRangePicker/dateRangePicker';
import Loader from './loader/loader';
import Selector from './selector/selector';

let defaultTeamsSelectedIds = [];
const userFormat = 'DD MM YYYY';
const dataFormat = 'YYYY-MM-DD';
const year = new Date().getFullYear();
const now = moment();
const startSeason =
  now.isBefore(moment(`${year} 08 01`)) && now.isSameOrAfter(moment(`${year} 01 01`))
    ? moment(`${year - 1} 10 01 `).format(dataFormat)
    : moment(`${year} 10 01 `).format(dataFormat);
const endSeason =
  now.isAfter(moment(`${year} 08 01`)) && now.isBefore(moment(`${year + 1} 01 01`))
    ? moment(`${year + 1} 07 01 `).format(dataFormat)
    : moment(`${year} 07 01 `).format(dataFormat);

let startDateSelected = moment().isBefore(startSeason) ? startSeason : moment().format(dataFormat);
let endDateSelected = moment(startDateSelected).add(1, 'month').format(dataFormat);

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeTeam = this.handleChangeTeam.bind(this);
    this.handleChangeDateRange = this.handleChangeDateRange.bind(this);
  }

  state = {
    startDate: startDateSelected,
    endDate: endDateSelected,
    teams: [],
    teamsSelectedIds: defaultTeamsSelectedIds,
    schedule: {},
    allDates: [startDateSelected],
  };

  async componentWillMount() {
    const teamsFromStorage = JSON.parse(localStorage.getItem('defaultTeamsSelectedIds'));
    const datesFromStorage = JSON.parse(localStorage.getItem('selectedDates'));

    if (teamsFromStorage) {
      defaultTeamsSelectedIds = teamsFromStorage;
      this.setState({ teamsSelectedIds: teamsFromStorage });
    }
    if (datesFromStorage) {
      startDateSelected = datesFromStorage.startDate;

      endDateSelected = datesFromStorage.endDate;

      this.setState({ startDate: startDateSelected, endDate: endDateSelected });
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
    let date = moment(startDateSelected);
    const allDates = [];

    while (moment(date).isSameOrBefore(moment(endDateSelected))) {
      allDates.push(moment(date).format(userFormat));
      date = moment(date).add(1, 'day');
    }
    this.setState({ allDates });
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

  async handleChangeDateRange({ startDate, endDate }) {
    startDateSelected = startDate;
    endDateSelected = endDate;

    await this.getAllDates();
    for (const teamSelectedId of this.state.teamsSelectedIds) {
      await this.updateScheduleData({ teamSelectedId });
    }
  }
  async handleChangeDate({ newDate, dateToChange }) {
    const newDateFormated = newDate.split(' ').reverse().join('-');

    startDateSelected = newDateFormated;
    endDateSelected = moment(newDateFormated).add(1, 'month').format(dataFormat);

    this.setState({ startDateSelected, endDateSelected });
    localStorage.setItem('selectedDates', JSON.stringify({ startDateSelected, endDateSelected }));

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

      for (const date of this.state.allDates) {
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
      console.error({ error });
    }
  }

  render() {
    if (!isEmpty(this.state.teams) && !isEmpty(this.state.schedule)) {
      return (
        <div>
          <div className="container">
            <div className="row" style={{ height: '10vh' }}>
              <div className="input-field col s12" id="start">
                <DateRangePicker
                  dateTimePickerData={{
                    startSeason,
                    endSeason,
                    handleChangeDateRange: this.handleChangeDateRange,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    dataFormat: dataFormat,
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

                {this.state.allDates.map((gameDate) => (
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
