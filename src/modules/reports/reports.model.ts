const initialReports = [
  {
    id: 1,
    submittedBy: null,
    barangayId: 1,
    areaId: 1,
    lat: 14.7024,
    lng: 120.979,
    description: 'Standing water beside creekside homes after rainfall',
    status: 'scheduled_for_inspection',
    riskLevel: 'high',
    createdAt: '2026-07-07T09:00:00Z',
  },
  {
    id: 2,
    submittedBy: null,
    barangayId: 2,
    areaId: 3,
    lat: 14.6845,
    lng: 120.9738,
    description: 'Clogged drainage near market walkway',
    status: 'submitted',
    riskLevel: 'high',
    createdAt: '2026-07-07T10:30:00Z',
  },
];

const reports = initialReports.map((report) => ({ ...report }));

async function findAllReports() {
  return reports;
}

async function createReport(payload) {
  const report = {
    id: reports.length + 1,
    status: 'submitted',
    createdAt: new Date().toISOString(),
    ...payload,
  };
  reports.push(report);
  return report;
}

async function updateReportStatus(id, status) {
  const report = reports.find((item) => item.id === Number(id));
  if (!report) return null;
  report.status = status;
  return report;
}

async function resetReports() {
  reports.splice(0, reports.length, ...initialReports.map((report) => ({ ...report })));
  return reports;
}

module.exports = {
  createReport,
  findAllReports,
  resetReports,
  updateReportStatus,
};
