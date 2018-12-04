'use strict';

const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('./'));
app.use(express.urlencoded({extended: true}));

app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
});

app.get('/weather', (request, response) => {
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
  console.log('query', query);
  const weather = new Weather(weatherData.darkSky[0]);
  console.log('weather', weather);
  weather.search_query = query;
  return weather;
}

function Location(data) {
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

function Weather(wData) {
  this.time = wData.time;
  this.hourly_query = wData.summary;
  this.humidity = wData.humidity;
  this.temperature = wData.temperature;
  this.dewPoint = wData.dewPoint;
}

app.get('/home', function(req, res) {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}.`);
});
