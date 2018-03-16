import React from 'react';
import {Line, defaults} from 'react-chartjs-2';
var createReactClass = require('create-react-class');

const data = {
  datasets: [
    {
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10
    }
  ]
};

var LineChart = createReactClass({
  displayName: 'LineChart',
  
  render() {
    return (
      <div>
        <h2>Metrics</h2>
        <Line data={this.props.data}/>
      </div>
    );
  }
});

export default LineChart;