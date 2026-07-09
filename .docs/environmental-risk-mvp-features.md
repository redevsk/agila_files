# Recommended MVP Features: Environmental Dengue Risk Surveillance

## Purpose

This MVP supports environmental dengue risk surveillance and barangay/LGU response tracking. It does not diagnose dengue, track hospital cases, or replace PIDSR clinical case reporting.

## Core MVP Features

### 1. Barangay Area Mapping

- Map barangay zones such as purok, street clusters, subdivisions, drainage areas, schools, markets, construction sites, vacant lots, and water-prone areas.
- Store zone center point, optional boundary, environmental risk factors, accessibility notes, population exposure, and current risk level.

### 2. Risk-Based Sentinel Placement

- Recommend smart ovitrap sentinel locations using environmental risk, population exposure, accessibility, safety, and distance from existing sentinels.
- Show sentinel locations on the map with assigned zone and maintenance status.

### 3. Sentinel Monitoring

- Record sentinel location, egg activity/count, reading date/time, trap status, battery level, water level, and maintenance status.
- Classify readings as Low, Moderate, High, or Critical environmental risk.

### 4. Citizen Environmental Reporting

- Allow residents to report stagnant water, clogged canals, larvae, garbage buildup, abandoned tires, uncovered containers, flooded areas, and high mosquito presence.
- Capture location pin, photo evidence, description, and date/time.
- Let residents track report progress without exposing internal operations.

### 5. Data Validation

- Review duplicate reports, incomplete submissions, false reports, offline traps, and overlapping reports in the same area.
- Combine nearby reports and sentinel alerts into one inspection task when practical.

### 6. Zone Risk Scoring

- Calculate a risk score per zone using sentinel readings, citizen reports, environmental factors, and field verification results.
- Classify zones as Low, Moderate, High, or Critical.
- Display risk reasons so barangay and LGU users understand why an area is prioritized.

### 7. Alert and Inspection Task Creation

- Generate an alert when a zone reaches High or Critical risk.
- Create inspection tasks for field inspectors or barangay health workers.
- Include target location, trigger source, risk level, and suggested inspection perimeter.

### 8. Field Verification

- Let inspectors open assigned tasks, view target location, start inspection, and record GPS check-in.
- Capture checked locations, photos, findings, breeding-site pins, report validity, and optional inspection route/path.
- Support findings such as Verified, Invalid, Duplicate, Needs Intervention, and Needs Recheck.

### 9. Risk Perimeters

- Create an initial alert perimeter from a citizen report or high sentinel reading.
- Create a verified risk perimeter after field confirmation.
- Create an intervention perimeter when cleanup, source reduction, education, authorized larvicide, or recheck is required.

### 10. Intervention and Response Tracking

- Assign response actions to sanitation or barangay response teams.
- Track action taken, assigned personnel, before/after photos, status, completion date, and recheck recommendation.

### 11. Follow-Up Monitoring

- Recheck areas using new sentinel readings, citizen reports, and field inspection findings.
- Update risk depending on whether environmental risk decreased, remained the same, or increased.

### 12. Dashboard and Reporting

- Show risk map, sentinel locations, citizen reports, inspection tasks, verified breeding sites, risk perimeters, unresolved hotspots, completed interventions, overdue inspections, and weekly barangay/LGU summaries.
- Export weekly reports for planning and coordination.

## Required Status Flows

Citizen report flow:

```text
Submitted -> Pending Review -> Inspection Task Created -> Field Verification Ongoing -> Verified / Invalid / Duplicate -> Intervention Assigned -> Action Taken -> For Recheck -> Resolved
```

Sentinel alert flow:

```text
Reading Received -> Risk Level Calculated -> Alert Generated -> Inspection Task Created -> Field Verification -> Intervention / Monitoring -> Recheck -> Risk Updated
```

## Recommended MVP Screens

- Citizen report form and public advisory/status view.
- Barangay admin risk map and validation queue.
- Sentinel map and device reading panel.
- Field inspector task and verification screen.
- Response team intervention screen.
- LGU supervisor dashboard and weekly export.
- System admin configuration screen.

## Future Features

- Automated smart ovitrap data ingestion.
- Offline-first field verification.
- Advanced GIS perimeter generation.
- Weather and rainfall overlays.
- Route optimization.
- Predictive environmental risk modeling.
- SMS or push notifications.
- Public advisory map.
- Device maintenance forecasting.
- Multi-city supervision.
- Full audit and compliance reporting.
