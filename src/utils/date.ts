const DAY_MS = 24 * 60 * 60 * 1000;

function nowIso() {
  return new Date().toISOString();
}

function addDaysIso(days, base = new Date()) {
  return new Date(base.getTime() + days * DAY_MS).toISOString();
}

function daysSince(isoDate) {
  if (!isoDate) return Number.POSITIVE_INFINITY;
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / DAY_MS);
}

function isPast(isoDate) {
  return Boolean(isoDate) && new Date(isoDate).getTime() < Date.now();
}

module.exports = { DAY_MS, nowIso, addDaysIso, daysSince, isPast };
