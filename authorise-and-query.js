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

function auth() {
  gapi.auth.authorize({
    'client_id': $('#client-id').val(),
    'scope': 'https://www.googleapis.com/auth/bigquery'
  }, function() {
      gapi.client.load('bigquery', 'v2', runQuery);
      $('#client_initiated').html('BigQuery client authorized');
  });

  $('#auth_button').hide();
}

function runQuery() {
  var request = gapi.client.bigquery.jobs.query({
    'projectId': $('#project-id').val(),
    'timeoutMs': '30000',
    // note SQL format differs between Google console and here:
    // table name - `` vs []
    // cast as integer - CAST(da as NUMERIC) vs INTEGER(da)
    'query': 'SELECT da, mo, year, min, max, fog, rain_drizzle, snow_ice_pellets, hail, visib, stn FROM [bigquery-public-data.noaa_gsod.gsod2015] WHERE year = "2015" AND mo = "09" AND INTEGER(da) > 7 AND INTEGER(da) < 9 LIMIT 10'
  });

  request.execute(function(response) {
    var data = new google.visualization.DataTable();
    // data.addColumn('string', 'Day');
    // data.addColumn('string', 'Month');
    // data.addColumn('string', 'Year');
    data.addColumn('string', 'MinF');
    data.addColumn('string', 'MaxF');
    data.addColumn('string', 'Fog');
    data.addColumn('string', 'Rain/drizzle');
    data.addColumn('string', 'Snow/ice');
    data.addColumn('string', 'Hail');
    data.addColumn('string', 'Visibility');
    data.addColumn('string', 'Weather station');

    $.each(response.result.rows, function(i, item) {
      data.addRow([
        item.f[3].v,
        item.f[4].v,
        item.f[5].v,
        item.f[6].v,
        item.f[7].v,
        item.f[8].v,
        item.f[9].v,
        item.f[10].v
      ]);
    });

    var table = new google.visualization.Table(document.getElementById('results'));
    table.draw(data, { showRowNumber: true });
  });
}
