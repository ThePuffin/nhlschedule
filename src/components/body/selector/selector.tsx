const Selector = ({ teamId, teams, index, handleChange }) => {
  const change = (event) => {
    console.log(index, 'teamId', event.target.value);
    handleChange({ index, newValue: event.target.value });
  };
  return (
    <div id={teamId} className="input-field ">
      <select onChange={change} id={teamId} defaultValue={teamId}>
        {teams.map((team) => (
          <option value={team.id}>{team.name}</option>
        ))}
      </select>
    </div>
  );
};
export default Selector;
