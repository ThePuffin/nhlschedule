import M from 'materialize-css';
import React from 'react';

const moment = require('moment');

class CardSchedule extends React.Component {
  componentDidMount() {
    M.AutoInit();
  }
  componentDidUpdate() {
    M.AutoInit();
  }
  render() {
    return (
      <div className="input-field col s12">
        <div class="row">
          <div class="col s12 m6">
            <div class="card blue-grey darken-1">
              <div class="card-content white-text">
                <span class="card-title">Card Title</span>
                <p>
                  I am a very simple card. I am good at containing small bits of information. I am convenient because I
                  require little markup to use effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardSchedule;
