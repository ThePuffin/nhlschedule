const Selector = ({ teamId, teams, index, handleChangeTeam, updateScheduleData }) => {
  const change = async (event) => {
    await handleChangeTeam({ index, newValue: event.target.value });
    // await updateScheduleData({ teamsSelectedId: event.target.value });
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
