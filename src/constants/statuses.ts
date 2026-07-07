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

const TASK_TYPES = {
  PREVENTIVE_PATROL: 'preventive_patrol',
  INSPECTION: 'inspection',
  TREATMENT: 'treatment',
  SENTINEL_CHECK: 'sentinel_check',
  FOLLOW_UP: 'follow_up',
};

module.exports = {
  PRIORITIES,
  PUBLIC_STATUSES,
  TASK_TYPES,
};
