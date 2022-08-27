import './cardSchedule.css';

const CardSchedule = (props) => {
  const teamDate = props.teamDate;

  return (
    <div className={teamDate.arenaName ? 'card blue-grey darken-1' : 'card white '}>
      <div className="card-content white-text">
        <span className="card-title">
          {teamDate.awayTeam} / {teamDate.homeTeam}
          {teamDate.gameDate}
        </span>
        <em>{teamDate.arenaName}</em>
      </div>
    </div>
  );
};
export default CardSchedule;
