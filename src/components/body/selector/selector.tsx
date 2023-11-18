import React from 'react';
import Select from 'react-select';

export default function Selector({ teamIds, teams, index, handleChangeTeam }) {
  const teamId = teamIds[index];
  const teamData = teams.find((team) => team.teamAbbrev?.default === teamId);
  const teamName = teamData?.teamName?.default ?? '';

  const changeTeam = async (event) => {
    await handleChangeTeam({ index, newTeamId: event.value });
  };
  const filtredTeam = teams.filter((team) => !teamIds.includes(team.value));

  return (
    <div className="App">
      <Select defaultValue={teamId} placeholder={teamName} onChange={changeTeam} isSearchable options={filtredTeam} />
    </div>
  );
}
