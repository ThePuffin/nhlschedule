const Selector = ({ teamId, teams, index, handleChangeTeam }) => {
  const changeTeam = async (event) => {
    await handleChangeTeam({ index, newValue: event.target.value });
  };
  return (
    <div id={teamId} className="input-field ">
      <select onChange={changeTeam} id={teamId} defaultValue={teamId}>
        {teams.map((team) => (
          <option value={team.id}>{team.name}</option>
        ))}
      </select>
    </div>
  );
};
export default Selector;
