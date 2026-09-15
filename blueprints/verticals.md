# Vertical Systems Blueprint  

## Full Vertical Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. VERTICALS OVERVIEW  

Verticals are the major functional domains of WFS CMMS.  

Each vertical is:

- modular  

- isolated  

- AIMI‑integrated  

- multilingual  

- voice‑enabled  

- adaptive‑UI‑aware  

- tenant‑safe  

- role‑safe  

Verticals define the core business logic of the CMMS.

The major verticals are:

1. Assets  

2. Workorders  

3. PM (Preventive Maintenance)  

4. Parts  

5. Scheduling  

6. Telematics  

7. Compliance  

8. Reporting  

9. AIMI (intelligence layer)  

10. Diagnostics (troubleshooting layer)

Each vertical is documented below.

---

# 2. ASSETS VERTICAL  

The Assets vertical manages all fleet assets.

## 2.1 Asset Features  

- asset profile  

- asset group  

- meters  

- telematics link  

- PM schedule  

- workorder history  

- diagnostic history  

- predictive health  

- AIMI health score  

- multilingual labels  

- voice commands  

- 3D visualization  

## 2.2 Asset Tables  

- Assets  

- AssetGroups  

- AssetMeters  

- AssetTelematics  

- AssetHealth  

- AssetHistory  

## 2.3 AIMI Integration  

AIMI provides:

- severity  

- predictive alerts  

- routing  

- scheduling  

- health scoring  

---

# 3. WORKORDERS VERTICAL  

The Workorders vertical is the core of the CMMS.

## 3.1 Workorder Features  

- severity  

- diagnostics  

- parts  

- labor  

- notes  

- photos  

- telematics  

- PM linkage  

- predictive linkage  

- technician assignment  

- routing  

- scheduling  

- AIMI insights  

- voice commands  

- multilingual support  

## 3.2 Workorder Tables  

- Workorders  

- WorkorderNotes  

- WorkorderPhotos  

- WorkorderLabor  

- WorkorderParts  

- WorkorderTimeline  

## 3.3 AIMI Integration  

AIMI provides:

- severity  

- routing  

- scheduling  

- diagnostics  

- predictive alerts  

---

# 4. PM (PREVENTIVE MAINTENANCE) VERTICAL  

The PM vertical manages preventive maintenance.

## 4.1 PM Features  

- PM templates  

- PM schedules  

- PM triggers  

- PM completion  

- PM findings  

- PM severity  

- PM predictive linkage  

- PM voice commands  

- PM multilingual support  

## 4.2 PM Tables  

- PMTemplates  

- PMSchedules  

- PMTriggers  

- PMHistory  

- PMFindings  

## 4.3 AIMI Integration  

AIMI provides:

- PM severity  

- PM predictive updates  

- PM scheduling  

- PM workorder creation  

---

# 5. PARTS VERTICAL  

The Parts vertical manages inventory.

## 5.1 Parts Features  

- inventory  

- stock levels  

- reorder points  

- vendor info  

- part usage history  

- part predictive usage  

- part linking to diagnostics  

- part linking to repairs  

- part linking to PM  

## 5.2 Parts Tables  

- Parts  

- PartInventory  

- PartVendors  

- PartUsage  

- PartRequests  

## 5.3 AIMI Integration  

AIMI provides:

- part prediction  

- part usage patterns  

- reorder alerts  

---

# 6. SCHEDULING VERTICAL  

The Scheduling vertical manages technician and bay availability.

## 6.1 Scheduling Features  

- technician schedules  

- bay schedules  

- asset availability  

- predictive scheduling  

- PM scheduling  

- workorder scheduling  

- voice scheduling  

- multilingual scheduling  

## 6.2 Scheduling Tables  

- TechnicianSchedules  

- BaySchedules  

- AssetAvailability  

- PredictiveSchedules  

## 6.3 AIMI Integration  

AIMI provides:

- technician selection  

- bay selection  

- predictive scheduling  

- workload balancing  

---

# 7. TELEMATICS VERTICAL  

The Telematics vertical processes real‑time vehicle data.

## 7.1 Telematics Features  

- DTC ingestion  

- live data  

- fault detection  

- predictive modeling  

- AIMI severity  

- AIMI diagnostics  

- AIMI routing  

- AIMI scheduling  

- technician learning  

- asset health scoring  

## 7.2 Telematics Tables  

- TelematicsEvents  

- TelematicsFaults  

- TelematicsLiveData  

- TelematicsHistory  

## 7.3 AIMI Integration  

AIMI provides:

- severity  

- diagnostics  

- predictive modeling  

- routing  

- scheduling  

---

# 8. COMPLIANCE VERTICAL  

The Compliance vertical manages inspections and regulations.

## 8.1 Compliance Features  

- inspections  

- forms  

- checklists  

- driver reports  

- DOT compliance  

- school district compliance  

- multilingual compliance  

- voice compliance  

## 8.2 Compliance Tables  

- Inspections  

- InspectionFindings  

- InspectionHistory  

- ComplianceViolations  

## 8.3 AIMI Integration  

AIMI provides:

- severity  

- routing  

- predictive compliance  

---

# 9. REPORTING VERTICAL  

The Reporting vertical provides insights.

## 9.1 Reporting Features  

- dashboards  

- charts  

- tables  

- AIMI insights  

- predictive insights  

- asset health  

- PM compliance  

- parts usage  

- technician performance  

## 9.2 Reporting Tables  

- Reports  

- ReportHistory  

- AIMIInsights  

## 9.3 AIMI Integration  

AIMI provides:

- severity distribution  

- routing decisions  

- predictions  

- asset health scores  

- schedule risk  

---

# 10. AIMI VERTICAL  

The AIMI vertical is the intelligence layer.

## 10.1 AIMI Features  

- severity  

- routing  

- scheduling  

- diagnostics  

- predictive models  

- technician learning  

- multilingual NLP  

- voice NLP  

## 10.2 AIMI Tables  

- AIMILearningWeights  

- TechnicianLearningProfile  

- DiagnosticHistory  

- PredictiveModels  

- SeverityHistory  

- RoutingHistory  

---

# 11. DIAGNOSTICS VERTICAL  

The Diagnostics vertical powers troubleshooting.

## 11.1 Diagnostics Features  

- symptom intake  

- fault correlation  

- path selection  

- guided troubleshooting  

- repair recommendation  

- verification steps  

- closeout checklist  

- technician learning  

## 11.2 Diagnostics Tables  

- DiagnosticFlows  

- DiagnosticSteps  

- DiagnosticHistory  

- DiagnosticVoiceLogs  

---

# 12. FUTURE VERTICAL EXPANSION  

Verticals support future expansion:

- new verticals  

- new modules  

- new workflows  

- new languages  

- new voice commands  

- new adaptive UI modes  

- new AIMI engines  

No rewrites required.

---

# END OF VERTICALS BLUEPRINT

