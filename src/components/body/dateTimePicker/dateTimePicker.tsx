import moment from 'moment';

const DateTimePicker = ({ icon, name, date, format, handleChangeDate }) => {
  const handleChange = (event) => {
    const newDate = event.target.value;
    console.log(date);
    
    handleChangeDate({ name, newDate });
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
