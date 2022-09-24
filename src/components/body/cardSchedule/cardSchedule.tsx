import './cardSchedule.css';

const CardSchedule = (props) => {
  const data = props.teamDate ? props.teamDate : props.gameDate;

  if (props.teamDate) {
    return (
      <div className={data.arenaName ? 'card cardGame' : 'card '}>
        <div className="ext-box">
          <h4 className="cardText">{data.awayTeam}</h4>
          <p className="cardText">vs</p>
          <h4 className="cardText">{data.homeTeam}</h4>
          <p className="cardText"> {data.arenaName}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="card cardDate">
        <div className="ext-box">
          <h3 className="cardText">{data}</h3>
          <br />
        </div>
      </div>
    );
  }
};
export default CardSchedule;
