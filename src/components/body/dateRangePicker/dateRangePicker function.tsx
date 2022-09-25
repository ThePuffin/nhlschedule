import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import React from 'react';
import { useState } from 'react';
import { DateRange } from 'react-date-range';

export default function DateRangePicker({
  startDate,
  endDate,
  handleChangeDateRange,
  startSeason,
  endSeason,
  thisBody,
}) {
  const handleSelect = async (event) => {
    setState([event.selection]);

    // await handleChangeDateRange(event.selection);
  };

  const [state, setState] = useState([
    {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      key: 'selection',
    },
  ]);

  return (
    <div>
      <DateRange
        editableDateInputs={true}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        ranges={state}
        minDate={new Date(startSeason)}
        maxDate={new Date(endSeason)}
        showMonthAndYearPickers={false}
      />
    </div>
  );
}
