import React, { useEffect, useState } from "react";
import './App.css';
import MonthPicker from './MonthPicker';
//import MonthYearPicker from 'react-month-year-picker';
import useSendPost from './useGetPost';
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

function App() {
  const [seeLessMore, updateSeeLessMore] = useState("See More");
  return (
    <main>
      <div class = "fixedRect">Water Storage in California Reservoirs</div>
      <div className = "upperDiv">
        <div className = "upperLeftDiv">
          <p className = "mainText">
          California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity. 
          </p>
          <p className = "mainText">
California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
          </p>
          <button onClick = {function() {
              if(seeLessMore == "See More") updateSeeLessMore("See Less");
              else updateSeeLessMore("See More");} }> {seeLessMore}
          </button>
        </div>
        <div className = "upperRightDiv">
          <img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
"/>
          <p className = "caption"> Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of California's Historic Drought.
          </p>
        </div>
      </div>
      <DisappearingDiv show = {seeLessMore}/>

    </main>
  );
}

function DisappearingDiv(props) {
  if (props.show == "See Less") { // if "see more" button pressed, make new div
    const [chartRender, setChartRender] = useState([]);  // start tracking whether object fetched changes
    const [date, setDate] = useState({month: 4, year: 2020 });
    function yearChange(newYear) {
      let m = date.month;
      setDate({year: newYear, month: m });
    }
    function monthChange(newMonth){
      let y = date.year;
      setDate({month: newMonth, year: y});
    }

    useSendPost("query/test", date, {date}, thenFun, catchFun);
    function thenFun(object) {
      //console.log("Object",object);
      setChartRender(object);  // render chart once we have new object from new date
    }
    function catchFun(error) {
      //console.log("Error: ",error);
    }
    
      return (
      <div className = "disappearingDiv">
        <div className = "chartDiv">
          <BuildChart obj = {chartRender}/>
        </div>
        <div className = "seeMoreTextDiv">
          <p> Here's a quick look at some of the data on reservoirs from the <a href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the eleven largest in-state reservoirs. 
          </p>
          <h3> Change Month:</h3>
          <MonthPicker  
            // props 
            date = {date}
            yearFun = {yearChange}
            monthFun = {monthChange}
          />
        </div>
      </div>
    );
  } else {
    return (<div></div>);
  }
}

function BuildChart(props) {  // props: obj = chartRender
  //console.log("Build chart props object:", props.obj);

  const names = new Map();
  names.set(0, 'Shasta');
  names.set(1, 'Oroville');
  names.set(2, 'Trinity Lake');
  names.set(3, 'New Melones');
  names.set(4, 'San Luis');
  names.set(5, 'Don Pedro');
  names.set(6, 'Berryessa');

  let capacityObj = {label: "Capacity", data:[4552000, 3537577, 2447650, 2400000, 2041000, 2030000, 1602000], backgroundColor: "rgb(120, 199, 227)"};
  
  let storageObj = {label: "Storage", data: [], backgroundColor: "rgb(66, 145, 152)"};
  
  let labels = [];
  
  if (props.obj.length > 0) {  // dates inputted
    for (let i = 0; i < 7; i++) {
      storageObj.data.push(props.obj[i].value);
      labels.push(names.get(i));
    }
    let userData = {};
    userData.labels = labels;
    userData.datasets = [storageObj, capacityObj];
    //console.log(userData);
  
  let options = {
    plugins: {
      title: {
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  };
    return (
      <div className="chartContainer">
        <Bar options={options} data={userData} />
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }
}
export default App;