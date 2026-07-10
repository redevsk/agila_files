const { TASK_TYPES } = require('../../constants/statuses');

const initialTasks = [
  {
    id: 1,
    type: TASK_TYPES.PREVENTIVE_PATROL,
    status: 'in_progress',
    priority: 'critical',
    assignedTo: 3,
    barangayId: 1,
    areaId: 1,
    dueAt: '2026-07-08T16:00:00Z',
  },
  {
    id: 2,
    type: TASK_TYPES.SENTINEL_CHECK,
    status: 'scheduled',
    priority: 'high',
    assignedTo: 3,
    barangayId: 1,
    areaId: 2,
    sentinelDeviceId: 1,
    dueAt: '2026-07-08T17:00:00Z',
  },
  {
    id: 3,
    type: TASK_TYPES.INSPECTION,
    status: 'scheduled',
    priority: 'critical',
    assignedTo: 4,
    barangayId: 2,
    areaId: 3,
    dueAt: '2026-07-08T15:30:00Z',
  },
];

const tasks = initialTasks.map((task) => ({ ...task }));

async function findAllTasks() {
  return tasks;
}

async function createTask(payload) {
  const task = {
    id: tasks.length + 1,
    status: 'scheduled',
    ...payload,
  };
  tasks.push(task);
  return task;
}

async function updateTask(id, changes) {
  const task = tasks.find((item) => item.id === Number(id));
  if (!task) return null;
  Object.assign(task, changes);
  return task;
}

async function resetTasks() {
  tasks.splice(0, tasks.length, ...initialTasks.map((task) => ({ ...task })));
  return tasks;
}

module.exports = {
  createTask,
  findAllTasks,
  resetTasks,
  updateTask,
};
