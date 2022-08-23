



const Selector = (props) => {
  const change = (event) => {

    console.log(props.index, 'teamId', event.target.value);
  };
  return (
    <div id={props.teamId} className="input-field ">
      <select onChange={change} id={props.teamId} defaultValue={props.teamId}>
        {props.teams.map((team) => (
          <option value={team.id}>{team.name}</option>
        ))}
      </select>
    </div>
  );
};
export default Selector;
