const db: any = require('../config/database');
const { addDaysIso, nowIso } = require('./date');
const { nextId } = require('./ids');

function logAudit(actorId: any, action: any, entityType: any, entityId: any, metadata: any = {}) {
  db.auditLogs.push({
    id: nextId('audit'),
    actorId: actorId || null,
    action,
    entityType,
    entityId,
    metadata,
    createdAt: nowIso(),
  });
}

function priorityFromScore(score: any) {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

function setAreaPublicStatus(areaId: any, status: any, sourceType: any, sourceId: any, options: any = {}) {
  const area = (db.areas as any[]).find((item: any) => item.id === areaId);
  if (area) {
    area.publicStatus = status;
    if (status === 'green') {
      area.lastCheckedAt = options.lastCheckedAt || nowIso();
    }
  }

  const existing = (db.publicStatuses as any[]).find((item: any) => item.areaId === areaId);
  const expiresAt = options.expiresAt === undefined ? null : options.expiresAt;

  if (existing) {
    Object.assign(existing, {
      status,
      sourceType,
      sourceId,
      lastCheckedAt: options.lastCheckedAt || existing.lastCheckedAt,
      expiresAt,
      updatedAt: nowIso(),
    });
    return existing;
  }

  const statusRecord = {
    id: nextId('pub'),
    areaId,
    status,
    sourceType,
    sourceId,
    lastCheckedAt: options.lastCheckedAt || null,
    expiresAt,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  db.publicStatuses.push(statusRecord);
  return statusRecord;
}

function createTask(payload: any) {
  const timestamp = nowIso();
  const task = {
    id: nextId('task'),
    type: payload.type,
    status: payload.status || 'scheduled',
    priority: payload.priority || 'medium',
    assignedTo: payload.assignedTo || null,
    barangayId: payload.barangayId,
    areaId: payload.areaId || null,
    reportId: payload.reportId || null,
    sentinelDeviceId: payload.sentinelDeviceId || null,
    dueAt: payload.dueAt || addDaysIso(1),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  db.tasks.push(task);
  return task;
}

function handleInspectionResult(inspection: any) {
  const task = (db.tasks as any[]).find((item: any) => item.id === inspection.taskId);
  const report = inspection.reportId
    ? (db.reports as any[]).find((item: any) => item.id === inspection.reportId)
    : null;
  const areaId = task?.areaId || report?.areaId;

  if (task) {
    task.status = 'completed';
    task.updatedAt = nowIso();
  }

  if (report) {
    report.status = inspection.result === 'confirmed' ? 'confirmed' : 'checked';
    report.updatedAt = nowIso();
  }

  if (!areaId) return { createdTasks: [] };

  if (inspection.result === 'no_breeding_found') {
    setAreaPublicStatus(areaId, 'green', 'inspection', inspection.id, {
      lastCheckedAt: inspection.createdAt,
      expiresAt: addDaysIso(14),
    });
    if (report) report.status = 'closed';
    return { createdTasks: [] };
  }

  if (inspection.result === 'confirmed') {
    setAreaPublicStatus(areaId, 'red', 'inspection', inspection.id);
    const treatmentTask = createTask({
      type: 'treatment',
      status: 'scheduled',
      priority: 'critical',
      barangayId: task?.barangayId || report?.barangayId,
      areaId,
      reportId: report?.id || null,
    });
    return { createdTasks: [treatmentTask] };
  }

  if (inspection.result === 'need_revisit') {
    setAreaPublicStatus(areaId, 'yellow', 'inspection', inspection.id, {
      expiresAt: addDaysIso(3),
    });
    const followUpTask = createTask({
      type: 'follow_up',
      status: 'scheduled',
      priority: 'high',
      barangayId: task?.barangayId || report?.barangayId,
      areaId,
      reportId: report?.id || null,
      assignedTo: task?.assignedTo || null,
      dueAt: addDaysIso(3),
    });
    return { createdTasks: [followUpTask] };
  }

  setAreaPublicStatus(areaId, 'orange', 'inspection', inspection.id, {
    expiresAt: addDaysIso(3),
  });
  return { createdTasks: [] };
}

function handleTreatmentResult(treatment: any) {
  const task = (db.tasks as any[]).find((item: any) => item.id === treatment.taskId);
  const areaId = task?.areaId;

  if (task) {
    task.status = treatment.result === 'treated' ? 'completed' : 'in_progress';
    task.updatedAt = nowIso();
  }

  if (!areaId) return { createdTasks: [] };

  if (treatment.result === 'treated') {
    setAreaPublicStatus(areaId, 'orange', 'treatment', treatment.id, {
      lastCheckedAt: treatment.createdAt,
      expiresAt: addDaysIso(7),
    });
    return { createdTasks: [] };
  }

  if (treatment.result === 'follow_up_needed') {
    setAreaPublicStatus(areaId, 'yellow', 'treatment', treatment.id, {
      expiresAt: addDaysIso(3),
    });
    const followUpTask = createTask({
      type: 'follow_up',
      status: 'scheduled',
      priority: 'high',
      barangayId: task.barangayId,
      areaId,
      reportId: task.reportId,
      dueAt: addDaysIso(3),
    });
    return { createdTasks: [followUpTask] };
  }

  setAreaPublicStatus(areaId, 'red', 'treatment', treatment.id);
  return { createdTasks: [] };
}

module.exports = {
  logAudit,
  priorityFromScore,
  setAreaPublicStatus,
  createTask,
  handleInspectionResult,
  handleTreatmentResult,
};
