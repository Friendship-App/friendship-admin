import React from 'react';

import Card, { CardContent, CardActions, CardMedia } from 'material-ui/Card';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import CardGridWrapper from '../components/CardGridWrapper';

import theme from '../utils/theme';

import chilicorn from '../assets/chilicorn/chilicorn_no_text-256.png';
import placeholder from '../assets/placeholder.png';

const styles = {
  chilicornHeader: {
    height: 240,
    background: `url(${chilicorn})`,
    backgroundColor: theme.palette.primary[100],
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  loremHeader: {
    height: 240,
    background: `url(${placeholder})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    objectFit: 'cover',
    width: '100%',
  },
};

export default class Events extends React.Component {
  renderChilicornCard = () =>
    <Card>
      <CardMedia>
        <div style={styles.chilicornHeader} />
      </CardMedia>
      <CardContent>
        <Typography type="headline" component="h2">
          Event Placeholder
        </Typography>

        <Typography component="p">
          placeholder until we are ready for events
        </Typography>
      </CardContent>
      <CardActions>
        <Button compact color="primary">
          Share
        </Button>
        <Button compact color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>;

  render() {
    return (
      <CardGridWrapper>
        {this.renderChilicornCard()}

      </CardGridWrapper>
    );
  }
}
