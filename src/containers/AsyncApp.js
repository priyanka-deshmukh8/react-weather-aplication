import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  selectCity,
  invalidateCity,
  fetchForecastsIfNeeded,
} from '../actions';
import Picker from '../components/Picker';
import Forecasts from '../components/Forecasts';

class AsyncApp extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  componentDidMount() {
    const {dispatch, selectedCity} = this.props;
    dispatch(fetchForecastsIfNeeded(selectedCity));
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedCity !== prevProps.selectedCity) {
      const {dispatch, selectedCity} = this.props;
      dispatch(fetchForecastsIfNeeded(selectedCity));
    }
  }

  handleChange(nextCity) {
    this.props.dispatch(selectCity(nextCity));
    this.props.dispatch(fetchForecastsIfNeeded(nextCity));
  }

  handleRefreshClick(e) {
    e.preventDefault();

    const {dispatch, selectedCity} = this.props;
    dispatch(invalidateCity(selectedCity));
    dispatch(fetchForecastsIfNeeded(selectedCity));
  }

  render() {
    const {selectedCity, forecasts, isFetching, lastUpdated} = this.props;
    return (
      <div>
        <Picker
          value={selectedCity}
          onChange={this.handleChange}
          options={['Durham, NC', 'Mountain View, CA']}
        />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>}
          {!isFetching &&
            <a href="." onClick={this.handleRefreshClick}>
              Refresh
            </a>}
        </p>
        {isFetching && forecasts.length === 0 && <h2>Loading...</h2>}
        {!isFetching && forecasts.length === 0 && <h2>Empty.</h2>}
        {forecasts.length > 0 &&
          <div style={{opacity: isFetching ? 0.5 : 1}}>
          <Forecasts forecasts={forecasts} />
          </div>}
      </div>
    );
  }
}

AsyncApp.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedCity: PropTypes.string.isRequired,
  forecasts: PropTypes.array.isRequired,
  lastUpdated: PropTypes.number,
  isFetching: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const {selectedCity, forecastsByCity} = state;
  const {
    isFetching,
    lastUpdated,
    items: forecasts,
  } = forecastsByCity[selectedCity] || {
    isFetching: true,
    items: [],
  };
  return {
    isFetching,
    lastUpdated,
    forecasts,
    selectedCity,
  };
}

export default connect(mapStateToProps)(AsyncApp);
