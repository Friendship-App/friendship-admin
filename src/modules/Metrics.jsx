import React from "react";
import theme from "../utils/theme";
import {Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "material-ui";
import FileDownload from "material-ui-icons/FileDownload";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import rest from "../utils/rest";
import moment from "moment";
import {CardGridWrapper} from "../components/CardGridWrapper";
import {CSVLink} from "react-csv";
import LineChart from '../components/LineChart';

const mapStateToProps = state => ({
  allMetrics: state.metricsAllMetrics,
  metricsWeek: state.metricsWeek,
  metricsMonth: state.metricsMonth
});

const mapDispatchToProps = dispatch => ({
  /**
   * Refresh the all metrics
   *
   * @return {void}
   */
  refresh: () => {
    dispatch(rest.actions.metricsRegisteredUsers());
    dispatch(rest.actions.metricsActiveUsers());
    dispatch(rest.actions.metricsActiveConversations());
    dispatch(rest.actions.metricsConversationsLength());
    dispatch(rest.actions.metricsAllMetrics());
    dispatch(rest.actions.metricsWeek());
    dispatch(rest.actions.metricsMonth());
  }
});

class Metrics extends React.Component {
  convoOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          id: 'activeconv',
          type: 'linear',
          display: true,
          position: 'left',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          }
        },
        {
          id: 'convlength',
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            min: 0
          },
          gridLines: {
            display: false
          },
          labels: {
            show: true
          }
        }
      ]
    }
  };

  componentDidMount() {
    const {refresh} = this.props;
    refresh();
    const newChartData = this.renderChart();
    this.setState({
      newChartData
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedState: "7days",
      convoChartData: {
        labels: [],
        datasets: [
          {
            label: 'Active conversations',
            data: [],
            yAxisID: 'activeconv'
          },
          {
            label: 'Conversations length',
            backgroundColor: 'rgba(192,75,134,0.4)',
            borderColor: 'rgba(192,75,134,1)',
            pointBorderColor: 'rgba(192,75,134,1)',
            pointHoverBackgroundColor: 'rgba(192,75,134,1)',
            pointHoverBorderColor: 'rgba(192,75,134,1)',
            data: [],
            yAxisID: 'convlength'
          }
        ]
      }
    };
  }

  handleChange = e => {
    const newChartData = this.renderChart(e.target.value);
    this.setState({
      selectedState: e.target.value,
      newChartData
    });
  };

  emptyState = (initialState) => {
    initialState.convoChartData.labels = [];
    initialState.convoChartData.datasets[0].data = [];
    initialState.convoChartData.datasets[1].data = [];
  };

  renderChart = (selectedState) => {
    let tempState = this.state;
    switch (selectedState) {
      case "30days":
        this.emptyState(tempState);
        this.props.metricsMonth.data.map(record => {
          tempState.convoChartData.labels.unshift(moment(record.date).format("DD-MM-YYYY"));
          tempState.convoChartData.datasets[0].data.unshift(record.number_of_active_conversations);
          tempState.convoChartData.datasets[1].data.unshift(parseFloat(record.average_conversations_length));
        });
        break;

      case "all":
        this.emptyState(tempState);
        this.props.allMetrics.data.map(record => {
          tempState.convoChartData.labels.unshift(moment(record.date).format("DD-MM-YYYY"));
          tempState.convoChartData.datasets[0].data.unshift(record.number_of_active_conversations);
          tempState.convoChartData.datasets[1].data.unshift(parseFloat(record.average_conversations_length));
        });
        break;

      default:
        this.emptyState(tempState);
        this.props.metricsWeek.data.map(record => {
          tempState.convoChartData.labels.unshift(moment(record.date).format("DD-MM-YYYY"));
          tempState.convoChartData.datasets[0].data.unshift(record.number_of_active_conversations);
          tempState.convoChartData.datasets[1].data.unshift(parseFloat(record.average_conversations_length));
        });
    }
    return tempState;
  };


  render() {
    const renderOptionRows = () => {
      switch (this.state.selectedState) {
        case "30days":
          return this.props.metricsMonth.data.map((record, index) => {
            return (
                <TableRow key={index}>
                  <TableCell>
                    {moment(record.date).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell>{record.number_of_users_registered}</TableCell>
                  <TableCell>{record.number_of_active_users}</TableCell>
                  <TableCell>{record.number_of_active_conversations}</TableCell>
                  <TableCell>{record.average_conversations_length}</TableCell>
                </TableRow>
            );
          });
        case "all":
          return this.props.allMetrics.data.map((record, index) => {
            return (
                <TableRow key={index}>
                  <TableCell>
                    {moment(record.date).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell>{record.number_of_users_registered}</TableCell>
                  <TableCell>{record.number_of_active_users}</TableCell>
                  <TableCell>{record.number_of_active_conversations}</TableCell>
                  <TableCell>{record.average_conversations_length}</TableCell>
                </TableRow>

            );
          });
        default:
          return this.props.metricsWeek.data.map((record, index) => {
            return (
                <TableRow key={index}>
                  <TableCell>
                    {moment(record.date).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell>{record.number_of_users_registered}</TableCell>
                  <TableCell>{record.number_of_active_users}</TableCell>
                  <TableCell>{record.number_of_active_conversations}</TableCell>
                  <TableCell>{record.average_conversations_length}</TableCell>
                </TableRow>
            );
          });
      }
    };

    const renderDownloadButton = () => {
      switch (this.state.selectedState) {
        case "30days":
          return (
              <div style={{textAlign: "center"}}>
                <Button>
                  <CSVLink
                      data={this.props.metricsMonth.data}
                      filename={"metrics_lastMonth.csv"}>
                    Download Metrics
                  </CSVLink>
                  <FileDownload/>
                </Button>
              </div>
          );
        case "all":
          return (
              <div style={{textAlign: "center"}}>
                <Button>
                  <CSVLink
                      data={this.props.allMetrics.data}
                      filename={"all_metrics.csv"}
                  >
                    Download Metrics
                  </CSVLink>
                  <FileDownload/>
                </Button>
              </div>
          );
        default:
          return (
              <div style={{textAlign: "center"}}>
                <Button>
                  <CSVLink
                      data={this.props.metricsWeek.data}
                      filename={"metrics_last_7days.csv"}
                  >
                    Download Metrics
                  </CSVLink>
                  <FileDownload/>
                </Button>
              </div>
          );
      }
    };

    return (
        <div style={{width: "100vw"}}>
          <CardGridWrapper classes={theme.palette} width={"100"}>
            <Paper style={theme.paper}>
              <Typography type="headline" component="h3">
                Metrics
              </Typography>
              <label style={{margin: 20}}>Display: </label>
              <select
                  value={this.state.selectedState}
                  onChange={this.handleChange}
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="all">--All--</option>
              </select>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {this.props.intl.formatMessage({id: "metrics_day"})}
                    </TableCell>
                    <TableCell>
                      {this.props.intl.formatMessage({
                        id: "metrics_users_registered_day"
                      })}
                    </TableCell>
                    <TableCell>
                      {this.props.intl.formatMessage({
                        id: "metrics_users_total"
                      })}
                    </TableCell>
                    <TableCell>
                      {this.props.intl.formatMessage({
                        id: "metrics_conversation_total"
                      })}
                    </TableCell>
                    <TableCell>
                      {this.props.intl.formatMessage({
                        id: "metrics_conversation_length"
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderOptionRows()}</TableBody>
              </Table>
              {renderDownloadButton()}
              <LineChart data={this.state.convoChartData} options={this.convoOptions}/>
            </Paper>
          </CardGridWrapper>
        </div>
    );
  }
}

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(Metrics)
);
