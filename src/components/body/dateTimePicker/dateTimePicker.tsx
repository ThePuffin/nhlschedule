import M from 'materialize-css';
import moment from 'moment';
import React from 'react';

let data, newDate, handleChangeDate, dateToChange;

export default class DateTimePicker extends React.Component<any> {
  constructor(props) {
    super(props);
    data = props.dateTimePickerData;
  }
  state = {
    ...data,
  };

  componentDidMount() {
    const dateNow = new Date();

    const actualYear = dateNow.getFullYear();

    handleChangeDate = this.state.handleChangeDate;

    const elems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(elems, {
      onSelect: this.handleChange,
      onClose: this.close,
      onDraw: this.onDraw,
      autoClose: 'true',
      minDate: dateNow,
      maxDate: new Date(`${actualYear + 1} 07 31`),
    });
  }

  onDraw(event) {
    dateToChange = event.el.id;
  }

  close(event) {
    if (newDate) {
      handleChangeDate({ newDate, dateToChange });
    }
  }
  handleChange(event) {
    newDate = moment(event).format(data.format);
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
            defaultValue={moment(this.state.date).format(data.format)}
          />
        </div>
      );
    }
  }
}
