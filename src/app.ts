const express = require('express');
const path = require('path');
const routes = require('./modules');

const app = express();

app.use(express.json());
app.use('/api/v1', routes);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));

app.get('/map', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'workflow.html'));
});

app.get('/workflow', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'workflow.html'));
});

app.get('/demo', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'demo.html'));
});

app.get('/citizen', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'citizen.html'));
});

app.get('/citizen/profile', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'citizen-profile.html'));
});

app.get('/barangay', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'barangay.html'));
});

app.get('/barangay/dashboard', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'barangay-dashboard.html'));
});

app.get('/barangay-operations', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'barangay-operations.html'));
});

app.get('/city', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'city.html'));
});

app.get('/city/dashboard', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'city-dashboard.html'));
});

app.get('/field-inspector', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'field-inspector.html'));
});

app.get('/response-team', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'response-team.html'));
});

app.get('/register/citizen', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'register-citizen.html'));
});

app.get('/terms', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'terms.html'));
});

app.get('/login/citizen', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login-citizen.html'));
});

app.get('/login/barangay', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login-barangay.html'));
});

app.get('/login/city', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login-city.html'));
});

app.get('/login/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login-admin.html'));
});

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
