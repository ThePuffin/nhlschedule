import './dateRangerPicker.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import moment from 'moment';
import React from 'react';
import { DateRange } from 'react-date-range';

let count = 0;
let data, handleChangeDateRange, dataFormat;

export default class DateRangePicker extends React.Component<any> {
  constructor(props) {
    super(props);
    data = props.dateTimePickerData;
    dataFormat = data.dataFormat;
    data.key = 'selection';
  }
  state = {
    ...data,
  };
  componentDidMount() {
    handleChangeDateRange = this.state.handleChangeDateRange;
  }

  handleSelect = async ({ selection }) => {
    count = count + 1;

    this.setState(selection);
    if (count === 2) {
      const startDate = moment(selection.startDate).format(dataFormat);
      const endDate = moment(selection.endDate).format(dataFormat);

      localStorage.setItem('selectedDates', JSON.stringify({ startDate, endDate }));
      count = 0;

      await handleChangeDateRange({ startDate, endDate });
    }
  };

  render() {
    if (data?.startDate && data.endDate) {
      const selectionRange = {
        startDate: new Date(this.state.startDate),
        endDate: new Date(this.state.endDate),
        key: 'selection',
      };

      return (
        <div>
          <DateRange
            onChange={this.handleSelect}
            ranges={[selectionRange]}
            minDate={new Date(data.startSeason)}
            maxDate={new Date(data.endSeason)}
            showMonthAndYearPickers={false}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
          />
        </div>
      );
    } else {
      return (
        <div>
          <p>no state date</p>
        </div>
      );
    }
  }
}
