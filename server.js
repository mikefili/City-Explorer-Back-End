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
  const locationData = serachToLatLong(request.query.data);
  response.send(locationData);
});

function serachToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  location.search_query = query;
  return location;
}

function Location(data) {
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

app.get('/home', function(req, res) {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}.`);
});
