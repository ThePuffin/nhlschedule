import moment from 'moment';

const DateTimePicker = (props) => {
  // componentDidMount() {
  //   var context = this;

  //   var elems = document.querySelectorAll('.dateset');
  //   M.Datepicker.init(elems, {
  //     defaultDate: new Date(),
  //     format: this.state.format,
  //     container: 'body',
  //     onSelect: function (date) {
  //       context.setState({ startValue: context.state.startValue });
  //       console.log(date); // Selected date is logged
  //     },
  //     autoClose: true,
  //   });
  // }

  // state = {
  //   startValue: new Date(),
  //   endValue: new Date(),
  //   format: 'ddd d, mmm',
  //   formatMoment: 'ddd D, MMM',
  // };

  return (
    <div>
      <i className="material-icons prefix">{props.icon}</i>
      <input
        id="date"
        type="text"
        className="datepicker dateset"
        defaultValue={moment(props.date).format(props.format)}
      />
    </div>
  );
};

export default DateTimePicker;
