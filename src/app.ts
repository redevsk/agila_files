const express = require('express');
const path = require('path');
const routes = require('./modules');

const app = express();

app.use(express.json());
app.use('/api/v1', routes);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/map', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
