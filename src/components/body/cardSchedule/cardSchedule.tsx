import './cardSchedule.css';

import moment from 'moment';

const CardSchedule = (props) => {
  const data = props.teamDate ? props.teamDate : props.gameDate;

  if (props.teamDate) {
    return (
      <div className={data.arenaName ? 'card cardGame' : 'card '}>
        <div className="ext-box">
          <h4 className="cardText">{data.awayTeamShort}</h4>
          <p className="cardText">vs</p>
          <h4 className="cardText">{data.homeTeamShort}</h4>
          <p className="cardText"> {data.arenaName}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="card cardDate">
        <div className="ext-box">
          <p className="cardText">{moment(data.split(' ').reverse().join(' ')).format('dddd')} </p>
          <h3 className="cardText">{data}</h3>
          <br />
        </div>
      </div>
    );
  }
};
export default CardSchedule;
