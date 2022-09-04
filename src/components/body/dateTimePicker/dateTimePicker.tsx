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
    handleChangeDate = this.state.handleChangeDate;

    const elems = document.querySelectorAll('.datepicker');

    M.Datepicker.init(elems, {
      onSelect: this.handleChange,
      onClose: this.close,
      onDraw: this.onDraw,
      format: data.format.toLowerCase(),
      autoClose: 'true',
      minDate: new Date(data.startSeason),
      maxDate: new Date(data.endSeason),
      defaultDate: new Date(),
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
          <input id={this.state.name} type="text" className="datepicker" placeholder={data.date} />
        </div>
      );
    }
  }
}
