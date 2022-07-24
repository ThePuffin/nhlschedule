import axios from 'axios';
import M from 'materialize-css';
import React from 'react';

const moment = require('moment');

class CardSchedule extends React.Component {
  state = {
    teamDates: [],
  };
  async componentDidMount() {
    M.AutoInit();
    try {
      const resDate = await axios.get(
        ` https://statsapi.web.nhl.com/api/v1/schedule?site=fr_nhl&startDate=2022-10-01&endDate=2022-10-30&teamId=1`
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
    console.log(this.state.teamDates);
  }
  render() {
    if (this.state.teamDates.length) {
      return (
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
      );
    } else {
      return <p>no date</p>;
    }
  }
}

export default CardSchedule;
