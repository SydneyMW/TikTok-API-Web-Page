import React, {useState} from 'react';
import MonthYearPicker from 'react-month-year-picker';


function MonthPicker(props) {
let date = props.date;

function pickedYear (year) {
  props.yearFun(year);
}

function pickedMonth (month) {
  props.monthFun(month);
}
  if (date) {
    return (
      <div className="monthDiv">
        <MonthYearPicker
          caption=""
          selectedMonth={date.month}
          selectedYear={date.year}
          minYear={2000}
          maxYear={2022}
          onChangeYear = {pickedYear}
          onChangeMonth = {pickedMonth}
        />
      </div> );
  } else {
    return (
      <div></div>
    );
  }
}

export default MonthPicker;