import './cardSchedule.css';
import './colorsTeam.css';

import moment from 'moment';

const CardSchedule = (props) => {
  const data = props.teamDate ? props.teamDate : props.gameDate;

  if (props.teamDate) {
    return (
      <div
        className={
          data.arenaName && data.show ? (data.selectedTeam ? `card t${data.homeTeamId}` : `card awayGame`) : 'card '
        }
      >
        <div className={data.show ? 'ext-box' : 'whiteCard'}>
          <h4 className="cardText">{data.awayTeamShort}</h4>
          <p className="cardText">vs</p>
          <h4 className="cardText">{data.homeTeamShort}</h4>
          <p className="cardText arena"> {data.arenaName}</p>
          <p className="cardText date">{moment(data.gameDate).format('DD MM YY')}</p>
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
