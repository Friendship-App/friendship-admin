import React from 'react';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import Card, { CardContent, CardActions, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import CardGridWrapper from '../components/CardGridWrapper';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  changeView(view) {
    dispatch(push(view));
  }
});

export class Home extends React.Component {
  renderReportCard = () => (
    <Card
      className="Reportbtn"
      onClick={() => {
        this.props.changeView('/reports');
      }}
    >
      {/* <CardMedia>
        <div style={styles.ReportsCard} />
      </CardMedia> */}
      <CardContent>
        {/* <Typography type="headline" component="h2">
          Title 1
        </Typography> */}

        <Typography component="p">[number of] New Reports</Typography>
      </CardContent>
      <CardActions />
    </Card>
  );

  renderFeedbackCard = () => (
    <Card
      className="Reportbtn"
      onClick={() => {
        this.props.changeView('/feedbacks');
      }}
    >
      <CardContent>
        <Typography component="p">Feedbacks</Typography>
      </CardContent>
      <CardActions />
    </Card>
  );

  renderUserCard = () => (
    <Card
      className="Reportbtn"
      onClick={() => {
        this.props.changeView('/users');
      }}
    >
      <CardContent>
        <Typography component="p">Number of users</Typography>
      </CardContent>
      <CardActions />
    </Card>
  );

  renderMetricsCard = () => (
    <Card
      className="Reportbtn"
      onClick={() => {
        this.props.changeView('/metrics');
      }}
    >
      <CardContent>
        <Typography component="p">Metrics</Typography>
      </CardContent>
      <CardActions />
    </Card>
  );

  renderEventsCard = () => (
    <Card
      className="Reportbtn"
      onClick={() => {
        this.props.changeView('/events');
      }}
    >
      <CardContent>
        <Typography component="p">Events</Typography>
      </CardContent>
      <CardActions />
    </Card>
  );

  renderTagsCard = () => (
    <Card
      className="Reportbtn"
      onClick={() => {
        this.props.changeView('/tags');
      }}
    >
      <CardContent>
        <Typography component="p">Tags</Typography>
      </CardContent>
      <CardActions />
    </Card>
  );

  render() {
    return (
      <div style={{ width: '100vw' }}>
        <CardGridWrapper>
          {/*{this.renderReportCard()}*/}
          {this.renderUserCard()}
          {this.renderMetricsCard()}
          {this.renderTagsCard()}
          {this.renderEventsCard()}
          {this.renderFeedbackCard()}
        </CardGridWrapper>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
