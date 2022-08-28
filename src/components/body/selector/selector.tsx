import React from 'react';
import Select from 'react-select';

export default function Selector({ teamId, teams, index, handleChangeTeam }) {
  const teamData = teams.find((team) => team.id === teamId);
  const teamName = teamData ? teamData.name : '';

  const changeTeam = async (event) => {
    await handleChangeTeam({ index, newTeamId: event.value });
  };
  const filtredTeam = teams.filter((team) => team.value !== teamId);

  return (
    <div className="App">
      <Select defaultValue={teamId} placeholder={teamName} onChange={changeTeam} isSearchable options={filtredTeam} />
    </div>
  );
}
