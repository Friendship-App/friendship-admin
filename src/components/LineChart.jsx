import React from 'react';
import {Line} from 'react-chartjs-2';

// Set default design here
const defaults = {
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

class LineChart extends React.Component{
  state = {};

  // Pass own chart settings in props. If nothing is passed for the property, it will keep the default value.
  constructor (props) {
    super(props);
    let passedProps = this.props.data;
    for (let i = 0; i < passedProps.datasets.length; i++) {
      passedProps.datasets[i] = {...defaults.datasets[0], ...passedProps.datasets[i]};
    }
    this.state = passedProps;
  }

  render() {
    return (
      <div>
        <Line data={this.state} options={this.props.options} />
      </div>
    );
  }
};

export default LineChart;