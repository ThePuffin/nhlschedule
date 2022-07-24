import React from 'react';

import Filter from './filter/filter';

const ITeam = require('../../nhl data/ITeam.ts');

let teams = require('../../nhl data/team light.json');
let teamName = [];

function defineDivisions() {
  let divisions = [];
  for (const team of teams) {
    if (team.active) {
      switch (team.arenaCity) {
        case 'New York':
          divisions.push({ id: team.divisionId, name: 'Metropolitan' });
          break;
        case 'Toronto':
          divisions.push({ id: team.divisionId, name: 'Atlantic' });
          break;
        case 'Chicago':
          divisions.push({ id: team.divisionId, name: 'Central' });
          break;
        case 'Vancouver':
          divisions.push({ id: team.divisionId, name: 'Pacific' });
          break;
        default:
          break;
      }
    }
  }
  teams = teams.map((team) => {
    team.divisonName = divisions.find((division) => division.id === team.divisionId).name;
    return team;
  });
}

function getTeamName() {
  teamName = teams.map((team) => team.fullName).sort();
}

class Body extends React.Component {
  componentDidMount() {
    defineDivisions();
    getTeamName();
  }

  render() {
    return (
      <div>
        <Filter />
      </div>
    );
  }
}

export default Body;
