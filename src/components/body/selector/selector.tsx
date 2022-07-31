import moment from 'moment';

const Selector = (props) => {
  return (
    <div className="input-field ">
      <select defaultValue={props.teamId}>
        {props.teams.map((team) => (
          <option value={team.id}>{team.name}</option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
