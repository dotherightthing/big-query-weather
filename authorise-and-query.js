$(document).ready(function () {
  google.charts.load('current', {
    // callback: auth,
    packages: ['table']
  });

  $('form').submit(function(e) {
    e.preventDefault();
    auth();
  })
});

/**
 * @function auth
 * @summary Authenticate using supplied User Credentials, then run query
 */
const auth = () => {
  gapi.auth.authorize({
    'client_id': $('#client-id').val(),
    'scope': 'https://www.googleapis.com/auth/bigquery'
  }, function() {
      gapi.client.load('bigquery', 'v2', runQueries);
      $('#auth-status').html('BigQuery client authorized');
  });
}

/**
 * @function runQueries
 * @summary Run queries
 * @description
 * Previously, BigQuery executed queries using a non - standard SQL dialect known as BigQuery SQL.
 * With the launch of BigQuery 2.0, BigQuery released support for standard SQL,
 * and renamed BigQuery SQL to legacy SQL.
 * Standard SQL is the preferred SQL dialect for querying data stored in BigQuery.
 * @see https://cloud.google.com/bigquery/docs/reference/standard-sql/migrating-from-legacy-sql
 */
const runQueries = () => {
  getWeatherForHistoricalDate();
  getWeatherStationsClosestToLocation();
}

/**
 * @function getWeatherForHistoricalDate
 * @summary Get weather for a historical day as a data table
 */
const getWeatherForHistoricalDate = () => {
  const date = $('#date').val();

  if (date === '') {
    $('#date-results').text('No selection');
    return;
  }

  const [d, m, y] = date.split('.');

  const request = gapi.client.bigquery.jobs.query({
    'projectId': $('#project-id').val(),
    'timeoutMs': '30000',
    // note SQL dialect differs between Google console and here:
    // console: Standard dialect
    // table name - `` vs []
    // cast as integer - CAST(da as NUMERIC) vs INTEGER(da)
    'query': `SELECT da, mo, year, min, max, fog, rain_drizzle, snow_ice_pellets, hail, visib, stn FROM [bigquery-public-data.noaa_gsod.gsod2015] WHERE year = "${y}" AND mo = "${m}" AND INTEGER(da) = ${d} LIMIT 10`
  });

  $('#date-results').text('Processing..');

  request.execute(function(response) {
    if (response.totalRows > 0) {
      const data = new google.visualization.DataTable();
      // data.addColumn('string', 'Day');
      // data.addColumn('string', 'Month');
      // data.addColumn('string', 'Year');
      data.addColumn('number', 'Min \xB0C');
      data.addColumn('number', 'Max \xB0C');
      data.addColumn('string', 'Fog');
      data.addColumn('string', 'Rain/drizzle');
      data.addColumn('string', 'Snow/ice');
      data.addColumn('string', 'Hail');
      data.addColumn('string', 'Visibility');
      data.addColumn('string', 'Weather station');

      $.each(response.result.rows, function (i, item) {
        data.addRow([
          convertFarenheitToCelsius(item.f[3].v),
          convertFarenheitToCelsius(item.f[4].v),
          item.f[5].v,
          item.f[6].v,
          item.f[7].v,
          item.f[8].v,
          item.f[9].v,
          item.f[10].v
        ]);
      });

      const table = new google.visualization.Table(document.getElementById('date-results'));
      table.draw(data, { showRowNumber: true });
    } else {
      $('#date-results').text('No results');
    }
  });
}

/**
 * @function getWeatherStationsClosestToLocation
 * @summary Get weather stations closes to a location
 */
const getWeatherStationsClosestToLocation = () => {
  const location = $('#location').val();

  if (location === '') {
    $('#location-results').text('No selection');
    return;
  }

  let [lat, lng] = location.split(',');
  let latLimitLow, latLimitHigh, lngLimitLow, lngLimitHigh;

  lat = parseInt(lat);
  lng = parseInt(lng);

  if (lat > 0) {
    latLimitLow = lat;
    latLimitHigh = lat + 1;
  } else {
    latLimitLow = lat - 1;
    latLimitHigh = lat;
  }

  if (lng > 0) {
    lngLimitLow = lng;
    lngLimitHigh = lng + 1;
  } else {
    lngLimitLow = lng - 1;
    lngLimitHigh = lng;
  }

  const request = gapi.client.bigquery.jobs.query({
    'projectId': $('#project-id').val(),
    'timeoutMs': '30000',
    'query': `SELECT id, name, latitude, longitude FROM [bigquery-public-data.ghcn_d.ghcnd_stations] WHERE latitude > ${latLimitLow} AND latitude < ${latLimitHigh} AND longitude > ${lngLimitLow} AND longitude < ${lngLimitHigh} LIMIT 10`
  });

  $('#location-results').text('Processing..');

  request.execute(function (response) {
    if (response.totalRows > 0) {
      const data = new google.visualization.DataTable();
      data.addColumn('string', 'ID');
      data.addColumn('string', 'Name');
      data.addColumn('string', 'Lat');
      data.addColumn('string', 'Lng');

      $.each(response.result.rows, function (i, item) {
        data.addRow([
          item.f[0].v,
          item.f[1].v,
          item.f[2].v,
          item.f[3].v
        ]);
      });

      const table = new google.visualization.Table(document.getElementById('location-results'));
      table.draw(data, { showRowNumber: true });
    } else {
      $('#location-results').text('No results');
    }
  });
}

/**
 * @function convertFarenheitToCelsius
 * @summary Convert Farenheit into Celsius
 * @param {number} fahrenheit
 * @returns {number} celsius
 */
const convertFarenheitToCelsius = (fahrenheit) => parseInt((parseFloat(fahrenheit) - 32) * 5 / 9);
