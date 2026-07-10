const express = require('express');

const areasRoutes = require('./areas/areas.routes');
const authRoutes = require('./auth/auth.routes');
const barangaysRoutes = require('./barangays/barangays.routes');
const dashboardRoutes = require('./dashboard/dashboard.routes');
const demoRoutes = require('./demo/demo.routes');
const exportsRoutes = require('./exports/exports.routes');
const inspectionsRoutes = require('./inspections/inspections.routes');
const mapsRoutes = require('./maps/maps.routes');
const operationMapRoutes = require('./operation-map/operation-map.routes');
const publicStatusRoutes = require('./public-status/public-status.routes');
const reportsRoutes = require('./reports/reports.routes');
const riskRoutes = require('./risk/risk.routes');
const routesRoutes = require('./routes/routes.routes');
const sentinelDevicesRoutes = require('./sentinel-devices/sentinel-devices.routes');
const tasksRoutes = require('./tasks/tasks.routes');
const ticketsRoutes = require('./tickets/tickets.routes');
const treatmentsRoutes = require('./treatments/treatments.routes');
const usersRoutes = require('./users/users.routes');

const router = express.Router();

router.use('/areas', areasRoutes);
router.use('/auth', authRoutes);
router.use('/barangays', barangaysRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/demo', demoRoutes);
router.use('/exports', exportsRoutes);
router.use('/inspections', inspectionsRoutes);
router.use('/maps', mapsRoutes);
router.use('/operation-map', operationMapRoutes);
router.use('/public-status', publicStatusRoutes);
router.use('/reports', reportsRoutes);
router.use('/risk', riskRoutes);
router.use('/routes', routesRoutes);
router.use('/sentinel-devices', sentinelDevicesRoutes);
router.use('/tasks', tasksRoutes);
router.use('/tickets', ticketsRoutes);
router.use('/treatments', treatmentsRoutes);
router.use('/users', usersRoutes);

module.exports = router;
