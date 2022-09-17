import './cardSchedule.css';

const CardSchedule = (props) => {
  const data = props.teamDate ? props.teamDate : props.gameDate;

  if (props.teamDate) {
    return (
      <div className={data.arenaName ? 'card cardGame' : 'card '}>
        <h4>
          <span>
            {data.awayTeam} / {data.homeTeam}
          </span>
        </h4>

        <em>{data.arenaName}</em>
      </div>
    );
  } else {
    return (
      <div className="card cardDate">
        <h4>
          <span>{data}</span>
        </h4>
      </div>
    );
  }
};
export default CardSchedule;
