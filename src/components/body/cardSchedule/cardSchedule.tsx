import './cardSchedule.css';

const CardSchedule = (props) => {
  const teamDate = props.teamDate;
  return (
    <div className={teamDate.arenaName ? 'card blue-grey darken-1' : 'card white '}>
      <div className="card-content white-text">
        <h5>
          <span>
            {teamDate.awayTeam} / {teamDate.homeTeam}
          </span>
        </h5>
        <em>{teamDate.arenaName}</em>
      </div>
    </div>
  );
};
export default CardSchedule;
