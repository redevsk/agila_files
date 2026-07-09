const ROLES = {
  CITY_ADMIN: 'city_admin',
  BARANGAY_ADMIN: 'barangay_admin',
  INSPECTOR: 'inspector',
  TREATMENT_TEAM: 'treatment_team',
  CITIZEN: 'citizen',
};

const REPORT_STATUSES = [
  'submitted',
  'under_review',
  'duplicate',
  'rejected',
  'scheduled_for_inspection',
  'checked',
  'confirmed',
  'closed',
];

const TASK_STATUSES = [
  'scheduled',
  'assigned',
  'in_progress',
  'paused',
  'completed',
  'cancelled',
];

const TASK_TYPES = {
  PREVENTIVE_PATROL: 'preventive_patrol',
  INSPECTION: 'inspection',
  TREATMENT: 'treatment',
  SENTINEL_CHECK: 'sentinel_check',
  FOLLOW_UP: 'follow_up',
};

const INSPECTION_RESULTS = [
  'no_breeding_found',
  'confirmed',
  'need_revisit',
  'unable_to_access',
];

const TREATMENT_RESULTS = [
  'treated',
  'unable_to_treat',
  'follow_up_needed',
];

const ROUTE_STATUSES = ['scheduled', 'in_progress', 'paused', 'completed'];

const ROUTE_POINT_STATUSES = [
  'scheduled',
  'checked',
  'unchecked',
  'skipped',
  'need_revisit',
  'unable_to_access',
];

const PUBLIC_STATUSES = {
  GRAY: 'gray',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  RED: 'red',
  GREEN: 'green',
};

const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

module.exports = {
  ROLES,
  REPORT_STATUSES,
  TASK_STATUSES,
  TASK_TYPES,
  INSPECTION_RESULTS,
  TREATMENT_RESULTS,
  ROUTE_STATUSES,
  ROUTE_POINT_STATUSES,
  PUBLIC_STATUSES,
  PRIORITIES,
};
