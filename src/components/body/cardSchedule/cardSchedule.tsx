import './cardSchedule.css';
import './colorsTeam.css';

import moment from 'moment';

const CardSchedule = (props) => {
  const data = props.teamDate ? props.teamDate : props.gameDate;
  let hideDate = props.hideDate;
  let dateSelected = props.dateSelected;

  if (props.teamDate) {
    return (
      <div
        className={
          data.arenaName && data.show
            ? data.selectedTeam
              ? `card t${data.homeTeamId}`
              : `card awayGame`
            : 'card unclickable'
        }
      >
        <div className={dateSelected >= 0 ? 'selected' : ''}>
          <div className={data.show ? 'ext-box' : 'whiteCard'}>
            <p className={hideDate ? 'cardText hideDate' : 'cardText'}>
              {moment(data.gameDate).format('ddd DD-MM-YY')}
            </p>
            <h4 className="cardText">{data.awayTeamShort}</h4>
            <p className="cardText">vs</p>
            <h4 className="cardText">{data.homeTeamShort}</h4>
            <p className="cardText arena"> {data.arenaName}</p>
          </div>
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
