import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Forecasts extends Component {
  render() {
    const forecasts = this.props.forecasts;
    return (
      <ul>
        {forecasts.map((forecast, i) => {
          const info = `${forecast.date}, ${forecast.text}, high: ${forecast.high}, low: ${forecast.low}`;
          return (<li key={i}>{info}</li>);
        })}
      </ul>
    );
  }
}

Forecasts.propTypes = {
  forecasts: PropTypes.array.isRequired,
};
