const reports = [
  {
    id: 1,
    submittedBy: null,
    barangayId: 1,
    areaId: 1,
    lat: 14.5998,
    lng: 120.9844,
    description: 'Standing water behind market stalls',
    status: 'scheduled_for_inspection',
    riskLevel: 'high',
    createdAt: '2026-07-07T09:00:00Z',
  },
];

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

module.exports = {
  createReport,
  findAllReports,
  updateReportStatus,
};
