import './body.css';

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
const maxTeamToSelect = window.innerWidth > 500 ? 5 : 4;

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeTeam = this.handleChangeTeam.bind(this);
    this.handleChangeDateRange = this.handleChangeDateRange.bind(this);
    this.hadOrRemoveGame = this.hadOrRemoveGame.bind(this);
    this.removeSelectedGame = this.removeSelectedGame.bind(this);
  }

  state = {
    startDate: startDateSelected,
    endDate: endDateSelected,
    teams: [],
    teamsSelectedIds: defaultTeamsSelectedIds,
    schedule: {},
    allDates: [startDateSelected],
    showPicker: false,
    showHome: true,
    showAway: false,
    gamesSelected: [],
  };
  async componentWillMount() {
    const teamsFromStorage = JSON.parse(localStorage.getItem('defaultTeamsSelectedIds'));
    const datesFromStorage = JSON.parse(localStorage.getItem('selectedDates'));
    const gamesSelectedFromStorage = JSON.parse(localStorage.getItem('gamesSelectedDates'));

    if (teamsFromStorage) {
      defaultTeamsSelectedIds = teamsFromStorage;
      if (defaultTeamsSelectedIds.length > maxTeamToSelect) {
        defaultTeamsSelectedIds.pop();
      }
      this.setState({ teamsSelectedIds: defaultTeamsSelectedIds });
    }
    if (datesFromStorage) {
      startDateSelected = datesFromStorage.startDate;

      endDateSelected = datesFromStorage.endDate;

      this.setState({ startDate: startDateSelected, endDate: endDateSelected });
    }

    if (gamesSelectedFromStorage) {
      this.setState({ gamesSelected: gamesSelectedFromStorage });
    }
  }

  async componentDidMount() {
    await this.getAllDates();

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

        if (defaultTeamsSelectedIds.length < maxTeamToSelect) {
          defaultTeamsSelectedIds.push(team.value);
        }
      });

      this.setState({ schedule });
      this.setState({ teams: activeTeams });
      for (const teamSelectedId of this.state.teamsSelectedIds) {
        await this.updateScheduleData({ teamSelectedId });
      }
    } catch (error) {
      console.error({ error });
    }
  }

  hadOrRemoveGame(teamData) {
    const { teamSelectedId, timestampDate, show } = teamData;
    if (timestampDate >= 0 && show) {
      let gamesSelected = [...this.state.gamesSelected];
      const existingGame = gamesSelected.find(
        (game) => game.teamSelectedId === teamSelectedId && game.timestampDate === timestampDate
      );

      if (existingGame) {
        this.removeSelectedGame(teamData);
      } else {
        gamesSelected = gamesSelected.filter((game) => game.gameDate !== teamData.gameDate);
        gamesSelected.push(teamData);

        gamesSelected.sort((a, b) => {
          return a.timestampDate - b.timestampDate;
        });

        this.setState({ gamesSelected });
      }
      localStorage.setItem('gamesSelectedDates', JSON.stringify(gamesSelected));
    }
  }

  removeSelectedGame(teamData) {
    let gamesSelected = [...this.state.gamesSelected];
    gamesSelected = gamesSelected.filter(
      (game) => game.teamSelectedId !== teamData.teamSelectedId || game.timestampDate !== teamData.timestampDate
    );
    this.setState({ gamesSelected });
  }

  async getAllDates() {
    let date = moment(startDateSelected);
    const allDates = [];

    while (moment(date).isSameOrBefore(moment(endDateSelected))) {
      allDates.push(moment(date).format(userFormat));
      date = moment(date).add(1, 'day');
    }
    this.setState({ allDates });
  }

  async handleChangeTeam({ index, newTeamId }) {
    if (index >= 0 && newTeamId) {
      newTeamId = Number(newTeamId);
      const teamsSelectedIds = [...this.state.teamsSelectedIds];
      teamsSelectedIds.splice(index, 1, newTeamId);

      this.setState({ teamsSelectedIds });
      localStorage.setItem('defaultTeamsSelectedIds', JSON.stringify(teamsSelectedIds));

      await this.updateScheduleData({ teamSelectedId: newTeamId });

      const gamesSelected = [...this.state.gamesSelected].filter((game) =>
        this.state.teamsSelectedIds.includes(game.teamSelectedId)
      );
      this.setState({ gamesSelected });
    }
  }

  async handleChangeDateRange({ startDate, endDate }) {
    startDateSelected = startDate;
    endDateSelected = endDate;
    this.setState({ startDate: startDateSelected, endDate: endDateSelected, showPicker: false });

    localStorage.setItem('selectedDates', JSON.stringify({ startDate: startDateSelected, endDate: endDateSelected }));

    const gamesSelected = [...this.state.gamesSelected].filter(
      (game) =>
        moment(game.timestampDate / 1000).isAfter(moment(startDateSelected).unix()) &&
        moment(game.timestampDate / 1000).isBefore(moment(endDateSelected).unix())
    );

    this.setState({ gamesSelected });

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

          if (teams.home.team.id === teamSelectedId || teams.away.team.id === teamSelectedId) {
            datas = {
              awayTeamId: teams.away.team.id,
              awayTeamShort: this.state.teams.find((team) => team.id === teams.away.team.id).franchise?.teamName,
              homeTeamId: teams.home.team.id,
              homeTeamShort: this.state.teams.find((team) => team.id === teams.home.team.id).franchise?.teamName,
              arenaName: venue.name || '',
              gameDate: game.date,
              teamSelectedId,
              timestampDate: new Date(game.date).getTime(),
              show:
                (teams.home.team.id === teamSelectedId && this.state.showHome) ||
                (teams.away.team.id === teamSelectedId && this.state.showAway),
              selectedTeam: Number(teams.home.team.id) === Number(teamSelectedId),
            };
          }
        }

        scheduleState[teamSelectedId].push(datas);
      }

      await this.setState({ schedule: scheduleState });
    } catch (error) {
      console.error({ error });
    }
  }

  async switchButton(showType) {
    let showHome = this.state.showHome;
    let showAway = this.state.showAway;
    if (showType === 'away') {
      showAway = !showAway;

      await this.setState({ showAway });
    }

    if (showType === 'home') {
      showHome = !showHome;

      await this.setState({ showHome });
    }
    await this.updateVisibility();
  }

  async updateVisibility() {
    const newSchedule = this.state.schedule;

    for (const team in newSchedule) {
      if (newSchedule[team].length) {
        newSchedule[team] = newSchedule[team].map((game) => {
          if (game.homeTeamId) {
            game.show =
              (Number(game.homeTeamId) === Number(team) && this.state.showHome) ||
              (Number(game.awayTeamId) === Number(team) && this.state.showAway);

            return game;
          } else {
            return {};
          }
        });
      }
    }
    await this.setState({ schedule: newSchedule });
    const gamesSelected = [...this.state.gamesSelected].filter((game) => game.show);
    this.setState({ gamesSelected });
  }

  render() {
    let dateChoice;
    let selectedGame;
    if (this.state.showPicker) {
      dateChoice = (
        <div className="row">
          <div className="input-field col s12 m2 offset-m4" id="changeDate">
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
      );
    } else {
      dateChoice = (
        <div className="col s12 m2">
          <div className="input-field col s3 m6" id="buttonsDateAndPlace">
            <button
              className="dateButton selectButton"
              type="button"
              onClick={async () => {
                await this.setState({ showPicker: true });
              }}
            >
              <p>
                <i className="material-icons">event</i>
              </p>
            </button>
          </div>
          <div className="input-field col s3 m6" id="deleteSweepButton">
            <button
              className={this.state.gamesSelected.length > 0 ? 'sweepButton selectButton' : 'selectButton unclickable'}
              type="button"
              onClick={async () => {
                if (this.state.gamesSelected.length) {
                  this.setState({ gamesSelected: [] });
                }
              }}
            >
              <p>
                <i className="material-icons">delete_sweep</i>
              </p>
            </button>
          </div>
          <div className="input-field col s3 m6" id="changeDate">
            <button
              className={this.state.showHome ? 'activeButton selectButton' : 'inactiveButton selectButton'}
              onClick={async () => {
                await this.switchButton('home');
              }}
              type="button"
            >
              <p>
                <i className="material-icons">home</i>
              </p>
            </button>
          </div>

          <div className="input-field col s3 m6" id="changeDate">
            <button
              className={this.state.showAway ? 'activeButton selectButton' : 'inactiveButton selectButton'}
              onClick={async () => {
                await this.switchButton('away');
              }}
              type="button"
            >
              <p>
                <i className="material-icons">flight_takeoff</i>
              </p>
            </button>
          </div>
        </div>
      );

      if (this.state.gamesSelected.length) {
        selectedGame = (
          <div className="col s12 row-selection">
            {this.state.gamesSelected.map((game) => (
              <div
                onClick={() => this.removeSelectedGame(game)}
                className="col s3 m2
              "
                style={{ height: '25vh' }}
              >
                <CardSchedule teamDate={game} />
              </div>
            ))}
          </div>
        );
      }
    }

    if (!isEmpty(this.state.teams) && !isEmpty(this.state.schedule)) {
      return (
        <div>
          <div className="container">
            <div className="row">
              <div>{dateChoice}</div>
              <div className="col s12 m10">{selectedGame}</div>
            </div>
          </div>

          <div className="container gamesList">
            <div className="row">
              <div className="col s2 cardDateColumn">
                <div style={{ visibility: 'hidden', height: '8vh' }} id="hidden selector">
                  <Selector
                    handleChangeTeam={this.handleChangeTeam}
                    index="1"
                    teams={this.state.teams}
                    teamIds={this.state.teamsSelectedIds}
                  />
                </div>

                {this.state.allDates.map((gameDate) => (
                  <div style={{ height: '25vh' }}>
                    <CardSchedule gameDate={gameDate} />
                  </div>
                ))}
              </div>

              {this.state.teamsSelectedIds.map((teamId, index) => (
                <div className="col s3 m2">
                  <div style={{ height: '8vh' }} id={teamId.toString()}>
                    <Selector
                      handleChangeTeam={this.handleChangeTeam}
                      index={index}
                      teams={this.state.teams}
                      teamIds={this.state.teamsSelectedIds}
                    />
                  </div>

                  {this.state.schedule[teamId].map((teamDate) => (
                    <div onClick={() => this.hadOrRemoveGame(teamDate)} style={{ height: '25vh' }}>
                      <CardSchedule
                        teamDate={teamDate}
                        hideDate="true"
                        dateSelected={this.state.gamesSelected.findIndex(
                          (e) => e.teamSelectedId === teamDate.teamSelectedId && e.gameDate === teamDate.gameDate
                        )}
                      />
                    </div>
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
