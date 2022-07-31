import M from 'materialize-css';
import React from 'react';

class CardScheduleClass extends React.Component {
  async componentDidMount() {
    M.AutoInit();
  }
  componentDidUpdate() {
    M.AutoInit();
  }
  render() {
    return (
      <div>
        <p>card</p>
      </div>
      // <div className="row">
      //   <div className="col 12">
      //     <div className="card blue-grey darken-1">
      //       <div className="card-content white-text">
      //         <span className="card-title">{teamDate.gameDate}</span>
      //         <p>
      //           "{teamDate.awayTeam}" VS "{teamDate.homeTeam}"
      //         </p>
      //         <em>at : "{teamDate.arenaName}"</em>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}

const CardSchedule = (props) => {
  const teamDate = props.teamDate;

  return (
    <div className="row">
      <div className="col 12">
        <div className="card blue-grey darken-1">
          <div className="card-content white-text">
            <span className="card-title">{teamDate.gameDate}</span>
            <p>
              "{teamDate.awayTeam}" VS "{teamDate.homeTeam}"
            </p>
            <em>at : "{teamDate.arenaName}"</em>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardSchedule;
