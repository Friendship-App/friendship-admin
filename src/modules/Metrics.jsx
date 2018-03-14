import React from "react";
import theme from "../utils/theme";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Button
} from "material-ui";
import FileDownload from "material-ui-icons/FileDownload";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import rest from "../utils/rest";
import moment from "moment";
import { CardGridWrapper } from "../components/CardGridWrapper";
import { CSVLink, CSVDownload } from "react-csv";
import {Line} from 'react-chartjs';

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
    dispatch(rest.actions.metricsAllMetrics());
    dispatch(rest.actions.metricsWeek());
    dispatch(rest.actions.metricsMonth());
  }
});

const dataset = {
  //get labels from date column of backend request
  labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", 
"November", "December"],
  datasets: [
    {
      label: "Conversations in total",
      fillColor: "rgba(220,220,220,0.2)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)",
      //change data onclick in the switch
      data: [65, 59, 80, 81, 56, 55, 40]
    },
    {
      label: "Average Conversations length",
      fillColor: "rgba(151,187,205,0.2)",
      strokeColor: "rgba(151,187,205,1)",
      pointColor: "rgba(151,187,205,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(151,187,205,1)",
      //change data onclick in the switch
      data: [28, 48, 40, 19, 86, 27, 90]
    }
  ]
};

class Metrics extends React.Component {
  componentDidMount() {
    const { refresh } = this.props;
    refresh();
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedState: "7days"
    };
  }

  handleChange = e => {
    this.setState({
      selectedState: e.target.value
    });
  };

  render() {

    const renderOptionRows = () => {
      
      switch (this.state.selectedState) {
        case "30days":
          return this.props.metricsMonth.data.map(record => {
            return (
              <TableRow key={record.id}>
                <TableCell>
                  {moment(record.date).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>{record.number_of_users_registered}</TableCell>
                <TableCell>{record.number_of_active_users}</TableCell>
                <TableCell>{record.number_of_active_conversations}</TableCell>
                <TableCell>{record.average_conversations_length}</TableCell>
              </TableRow>
              //map new labels
              //map activeconversation and conversation length to dataset
            );
          });
        case "all":
          return this.props.allMetrics.data.map(record => {
            return (
              <TableRow key={record.id}>
                <TableCell>
                  {moment(record.date).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>{record.number_of_users_registered}</TableCell>
                <TableCell>{record.number_of_active_users}</TableCell>
                <TableCell>{record.number_of_active_conversations}</TableCell>
                <TableCell>{record.average_conversations_length}</TableCell>
              </TableRow>
              //map new labels
              //map activeconversation and conversation length to dataset
            );
          });
        default:
          return this.props.metricsWeek.data.map(record => {
            return (
              <TableRow key={record.id}>
                <TableCell>
                  {moment(record.date).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>{record.number_of_users_registered}</TableCell>
                <TableCell>{record.number_of_active_users}</TableCell>
                <TableCell>{record.number_of_active_conversations}</TableCell>
                <TableCell>{record.average_conversations_length}</TableCell>
              </TableRow>
              //map new labels
              //map activeconversation and conversation length to dataset
            );
          });
      }
    };

    const renderDownloadButton = () => {
      switch (this.state.selectedState) {
        case "30days":
          return (
            <div style={{ textAlign: "center" }}>
              <Button color="secondary">
                <CSVLink
                  data={this.props.metricsMonth.data}
                  filename={"metrics_lastMonth.csv"}
                >
                  Download Metrics
                </CSVLink>
                <FileDownload />
              </Button>
            </div>
          );
        case "all":
          return (
            <div style={{ textAlign: "center" }}>
              <Button color="secondary">
                <CSVLink
                  data={this.props.allMetrics.data}
                  filename={"all_metrics.csv"}
                >
                  Download Metrics
                </CSVLink>
                <FileDownload />
              </Button>
            </div>
          );
        default:
          return (
            <div style={{ textAlign: "center" }}>
              <Button color="secondary">
                <CSVLink
                  data={this.props.metricsWeek.data}
                  filename={"metrics_last_7days.csv"}
                >
                  Download Metrics
                </CSVLink>
                <FileDownload />
              </Button>
            </div>
          );
      }
    };

    return (
      <div style={{ width: "100vw" }}>
        <CardGridWrapper classes={theme.palette} width={"100"}>
          <Paper style={theme.paper}>
            <Typography type="headline" component="h3">
              Metrics
            </Typography>
            <label style={{ margin: 20 }}>Display: </label>
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
                    {this.props.intl.formatMessage({ id: "metrics_day" })}
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
          </Paper>
        </CardGridWrapper>
        <CardGridWrapper classes={theme.palette} width={"100"}>
          <Line data={dataset} width="850" height="400"></Line>
        </CardGridWrapper>
      </div>
    );
  }
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Metrics)
);
