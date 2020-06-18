# big-query-weather

Testing the BigQuery API as a potential replacement for Apple Darksky.

## Set up

```sh
npm install
npm run serve
```

## Building/testing queries

### Create the expected JavaScript Origin & Authorised Domain

1. `sudo nano /etc/hosts`
1. Add `127.0.0.1   dslocal.com`

### OAuth Credentials

1. Create a new Project in Google Cloud
   1. Copy your Project Number to the `Project Number/ID` field in <http://dslocal.com:3000/>
1. APIs & Services > Create OAuth client ID
   1. Type: Web application
   1. Authorised JavaScript origins: `http://dslocal.com:3000`
   1. Create
   1. Copy `Your Client ID` to the `Client ID` field in <http://dslocal.com:3000/>
1. APIs & Services > OAuth consent screen
   1. Application type: `Internal`
   1. Authorised domains: `dslocal.com`
   1. Save

### Enable the API

> GSOD - Global Surface Summary of the Day Weather Data
>
> This public dataset was created by the National Oceanic and Atmospheric Administration (NOAA) and includes global data obtained from the USAF Climatology Center. This dataset covers GSOD data between 1929 and present (updated daily), collected from over 9000 stations.
>
> Global summary of the day is comprised of a dozen daily averages computed from global hourly station data. Daily weather elements include mean values of: temperature, dew point temperature, sea level pressure, station pressure, visibility, and wind speed plus maximum and minimum temperature, maximum sustained wind speed and maximum gust, precipitation amount, snow depth, and weather indicators. With the exception of U.S. stations, 24-hour periods are based upon UTC times.
>
> This public dataset is hosted in Google BigQuery and is included in BigQuery's 1TB/mo of free tier processing. This means that each user receives 1TB of free BigQuery processing every month, which can be used to run queries on this public dataset.

Note:

> actual, observed data and not the weather forecast

1. In the [Marketplace](https://console.cloud.google.com/marketplace), search for 'daily weather'
1. Select 'GSOD' from NOAA
1. Click 'View Dataset'

### Test queries in Google's BigQuery console

1. <https://console.cloud.google.com/bigquery> (see [Using the BigQuery web UI in the Cloud Console](https://cloud.google.com/bigquery/docs/bigquery-web-ui))
1. Select a data set on the LHS
1. Click 'Query table'

---

## Related links

* <https://opendata.stackexchange.com/questions/7578/historical-weather-forecast-api/7583#7583>
* <https://cloud.google.com/blog/products/gcp/global-historical-daily-weather-data-now-available-in-bigquery>
* <https://console.cloud.google.com/marketplace/details/noaa-public/ghcn-d?_ga=2.4119856.1074356311.1592383129-1395638239.1587514500>
* <https://stackoverflow.com/questions/12479895/obtaining-bigquery-data-from-javascript-code>
* <https://stackoverflow.com/questions/10456174/oauth-how-to-test-with-local-urls>
* <https://developers.google.com/chart/interactive/docs/reference#DataTable>
* <https://stackoverflow.com/questions/32458437/typeerror-google-visualization-datatable-is-not-a-constructor#32459785>
* <https://stackoverflow.com/questions/34804654/how-to-get-the-historical-weather-for-any-city-with-bigquery#34804655>
* <https://github.com/GoogleCloudPlatform/training-data-analyst/blob/master/blogs/ghcn/ghcn_on_bq.ipynb?short_path=974a495>
* <https://console.cloud.google.com/marketplace/product/noaa-public/ghcn-d>
* <https://stackoverflow.com/questions/42068651/haversine-distance-in-bigquery>
* <https://cloud.google.com/bigquery/docs/reference/standard-sql/geography_functions>

## Alternatives

* wunderground.com was purchased by The Weather Company (IBM). Apparently there are pricing tiers but they don't publish their prices: <https://www.ibm.com/nz-en/marketplace/weather-company-data-packages/purchase>
* <https://www.weatherbit.io/pricing> costs a whopping USD 470/month for 10 years of historical data.
* <https://weatherstack.com/product> USD 50/month for full historical data (to 2008)
