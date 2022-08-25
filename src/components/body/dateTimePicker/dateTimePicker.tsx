import M from 'materialize-css';
import moment from 'moment';
import React from 'react';

let data, newDate, startDate, endDate;

export default class DateTimePicker extends React.Component<any> {
  constructor(props) {
    super(props);
    data = props.dateTimePickerData;
  }
  state = {
    ...data,
  };

  componentDidMount() {
    if (this.state.name === 'start') {
      startDate = this.state.date;
    } else {
      endDate = this.state.date;
    }
    const elems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(elems, {
      onSelect: this.handleChange,
      onClose: this.close,
      autoClose: true,
    });
  }

  close(event) {
    console.log(startDate, '+', endDate);

    console.log('close', newDate);
  }

  handleChange(event) {
    newDate = event;
    console.log({ newDate });
  }
  render() {
    if (this.state) {
      return (
        <div id={this.state.icon}>
          <i className="material-icons prefix">{this.state.icon}</i>
          <input
            id={this.state.name}
            type="text"
            className="datepicker "
            defaultValue={moment(this.state.date).format(this.state.format)}
          />
        </div>
      );
    }
  }
}
