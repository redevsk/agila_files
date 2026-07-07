const express = require('express');
const routes = require('./modules');

const app = express();

app.use(express.json());
app.use('/api/v1', routes);

module.exports = app;
