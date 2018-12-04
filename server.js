'use strict';

const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('./'));

app.get('/location', (request, response) => {
  console.log('my request object:', request.body);
  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
});

app.get('/weather', (request, response) => {
  console.log('my request object:', request.body)
  const weatherData = searchToWeather(request.query.data);
  response.send(weatherData);
});

// helper function - lat/long
function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  location.search_query = query;
  return location;
}

// helper function - weather
function searchToWeather(query) {
  const weatherData = require('./data/weather.json');
  const weather = new Weather(weatherData.daily.data[0]);
  weather.search_query = query;
  return weather;
}

function Location(data) {
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

function Weather(wData) {
  this.daily_query = wData.summary;
  this.time = wData.time;
  this.temperature = wData.temperature;
}

app.get('/home', function(req, res) {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}.`);
});
