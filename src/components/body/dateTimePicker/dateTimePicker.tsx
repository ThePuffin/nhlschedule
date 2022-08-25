import moment from 'moment';

const DateTimePicker = ({ icon, name, date, format }) => {
  const handleChange = (event) => {
    const newDate = event.target.value;
    console.log(date);
  };
  return (
    <div id="dateTime" onClick={handleChange}>
      <i className="material-icons prefix">{icon}</i>
      <input
        id={name}
        type="text"
        className="datepicker dateset"
        defaultValue={moment(date).format(format)}
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
