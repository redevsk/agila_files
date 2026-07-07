const express = require('express');

const areasRoutes = require('./areas/areas.routes');
const authRoutes = require('./auth/auth.routes');
const barangaysRoutes = require('./barangays/barangays.routes');
const dashboardRoutes = require('./dashboard/dashboard.routes');
const exportsRoutes = require('./exports/exports.routes');
const inspectionsRoutes = require('./inspections/inspections.routes');
const publicStatusRoutes = require('./public-status/public-status.routes');
const reportsRoutes = require('./reports/reports.routes');
const riskRoutes = require('./risk/risk.routes');
const routesRoutes = require('./routes/routes.routes');
const sentinelDevicesRoutes = require('./sentinel-devices/sentinel-devices.routes');
const tasksRoutes = require('./tasks/tasks.routes');
const treatmentsRoutes = require('./treatments/treatments.routes');
const usersRoutes = require('./users/users.routes');

const router = express.Router();

router.use('/areas', areasRoutes);
router.use('/auth', authRoutes);
router.use('/barangays', barangaysRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/exports', exportsRoutes);
router.use('/inspections', inspectionsRoutes);
router.use('/public-status', publicStatusRoutes);
router.use('/reports', reportsRoutes);
router.use('/risk', riskRoutes);
router.use('/routes', routesRoutes);
router.use('/sentinel-devices', sentinelDevicesRoutes);
router.use('/tasks', tasksRoutes);
router.use('/treatments', treatmentsRoutes);
router.use('/users', usersRoutes);

module.exports = router;
