import React from 'react';
import './header.css';

class Filter extends React.Component {
  render() {
    return (
      <div>
        <h4 className="header-title">
          <img
            className="img-title"
            src="https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Ancien_logo_LNH.svg/747px-Ancien_logo_LNH.svg.png"
            alt="nhl old logo"
          />
          &nbsp; game selector
        </h4>
      </div>
    );
  }
}

export default Filter;
