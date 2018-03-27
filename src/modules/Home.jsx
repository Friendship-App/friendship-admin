import React from 'react';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import Card, { CardContent, CardActions, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import CardGridWrapper from '../components/CardGridWrapper';

const styles = {
  cards: {
    // background: `url(${chilicorn})`,
    // backgroundColor: theme.palette.primary[100],
    // backgroundSize: 'contain',
    // backgroundPosition: 'center',
    // backgroundRepeat: 'no-repeat',
    width:'35vw',
  },
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => ({
  changeView(view) {
    dispatch(push(view));
  },
});

export class Home extends React.Component {
  renderReportCard = () =>
    <Card style={styles.cards} className="Reportbtn" onClick={() => {
        this.props.changeView("/reports");
      }} >
      {/* <CardMedia>
        <div style={styles.ReportsCard} />
      </CardMedia> */}
      <CardContent>
        {/* <Typography type="headline" component="h2">
          Title 1
        </Typography> */}

        <Typography component="p">
          [number of] New Reports
        </Typography>
      </CardContent>
      <CardActions>

      </CardActions>
    </Card>;

  renderUserCard = () =>
    <Card style={styles.cards} className="Reportbtn"   onClick={() => {
        this.props.changeView("/users");
      }} >
      <CardContent>
        <Typography component="p">
          Number of users
        </Typography>
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>;

    renderMetricsCard = () =>
      <Card style={styles.cards} className="Reportbtn"   onClick={() => {
          this.props.changeView("/metrics");
        }} >
        <CardContent>
          <Typography component="p">
            Metrics
          </Typography>
        </CardContent>
        <CardActions>
        </CardActions>
      </Card>;

      renderEventsCard = () =>
        <Card style={styles.cards} className="Reportbtn"   onClick={() => {
            this.props.changeView("/events");
          }} >
          <CardContent>
            <Typography component="p">
              Events
            </Typography>
          </CardContent>
          <CardActions>
          </CardActions>
        </Card>;

        renderTagsCard = () =>
          <Card style={styles.cards} className="Reportbtn"   onClick={() => {
              this.props.changeView("/tags");
            }} >
            <CardContent>
              <Typography component="p">
                Tags
              </Typography>
            </CardContent>
            <CardActions>
            </CardActions>
          </Card>;

  render() {
    return (
      <div style={{width:'100vw'}}>
      <CardGridWrapper>
        {this.renderReportCard()}
        {this.renderUserCard()}
        {this.renderMetricsCard()}
        {this.renderTagsCard()}
      </CardGridWrapper>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
