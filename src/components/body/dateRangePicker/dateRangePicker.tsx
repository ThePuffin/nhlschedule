import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import moment from 'moment';
import React from 'react';
import { DateRange } from 'react-date-range';

let data, handleChangeDateRange, dataFormat;

export default class DateRangePicker extends React.Component<any> {
  constructor(props) {
    super(props);
    data = props.dateTimePickerData;
    dataFormat = data.dataFormat;
    handleChangeDateRange = data.handleChangeDateRange;

    data.key = 'selection';
  }
  state = {
    ...data,
  };

  handleSelect = async ({ selection }) => {
    this.setState(selection);

    const startDate = moment(selection.startDate).format(dataFormat);
    const endDate = moment(selection.endDate).format(dataFormat);

    localStorage.setItem('selectedDates', JSON.stringify({ startDate, endDate }));
    await handleChangeDateRange({ startDate, endDate });
  };

  render() {
    if (this.state) {
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
    }
  }
}
