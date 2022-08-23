import moment from 'moment';

const handleChange = (event) => {
  console.log('date', event.target.value);
};

const DateTimePicker = (props) => {
  return (
    <div id="dateTime" onClick={handleChange}>
      <i className="material-icons prefix">{props.icon}</i>
      <input
        id={props.name}
        type="text"
        className="datepicker dateset"
        defaultValue={moment(props.date).format(props.format)}
        // onChange={(newDate) => {
        // handleChange({
        //   target: {
        //     id: props.name,
        //     value: newDate,
        //   },
        // });
        // }}
      />
    </div>
  );
};

export default DateTimePicker;
