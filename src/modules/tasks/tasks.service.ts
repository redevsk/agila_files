const { getAreaPriorityRanking } = require('../areas/areas.service');
const { createTask, findAllTasks, updateTask } = require('./tasks.model');

async function listTasks() {
  return findAllTasks();
}

async function assignTask(id, assignedTo) {
  return updateTask(id, { assignedTo });
}

async function setTaskStatus(id, status) {
  return updateTask(id, { status });
}

async function generatePreventiveTasks() {
  const rankedAreas = await getAreaPriorityRanking();
  const existingTasks = await findAllTasks();
  const candidates = rankedAreas.filter((area) => ['critical', 'high'].includes(area.priority));
  return Promise.all(
    candidates.map((area) => {
      const existing = existingTasks.find(
        (task) =>
          task.areaId === area.id &&
          task.type === 'preventive_patrol' &&
          ['scheduled', 'in_progress'].includes(task.status),
      );

      if (existing) return existing;

      return createTask({
        type: 'preventive_patrol',
        status: 'scheduled',
        priority: area.priority,
        assignedTo: 3,
        barangayId: area.barangayId,
        areaId: area.id,
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }),
  );
}

module.exports = {
  assignTask,
  generatePreventiveTasks,
  listTasks,
  setTaskStatus,
};
