# TENANT ISOLATION  

## Full Tenant Isolation Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. TENANT ISOLATION OVERVIEW  

Tenant Isolation ensures WFS CMMS can support:

- Northwest ISD (current tenant)  

- future school districts  

- future commercial fleets  

without rewriting the system.

Tenant isolation is enforced at:

- database level  

- API level  

- backend service level  

- AIMI engine level  

- event bus level  

- frontend routing level  

No cross‑tenant data is ever allowed.

---

# 2. TENANT IDENTIFIER RULES  

## 2.1 tenant_id Required  

Every request must include:

- X-Tenant-Id: <tenant_id>

Requests without tenant_id are rejected.

## 2.2 tenant_id Immutable  

Once assigned:

- tenant_id cannot be changed  

- tenant_id cannot be overwritten  

- tenant_id cannot be removed  

## 2.3 tenant_id Logged  

Every action must log:

- tenant_id  

- user_id  

- timestamp  

---

# 3. DATABASE TENANT ISOLATION  

## 3.1 tenant_id Required on Every Table  

Every table includes:

- tenant_id  

- created_at  

- updated_at  

- deleted_at  

No exceptions.

## 3.2 Queries Must Filter by tenant_id  

Every query must include:

WHERE tenant_id = $tenant_id

## 3.3 Soft Deletes Required  

All deletes must set:

deleted_at = NOW()

Never hard delete tenant data.

## 3.4 No Cross‑Tenant Joins  

Forbidden:

JOIN tableA a ON [a.id](http://a.id) = [b.id](http://b.id)

Allowed:

JOIN tableA a ON [a.id](http://a.id) = [b.id](http://b.id) AND a.tenant_id = b.tenant_id

## 3.5 No Cross‑Tenant Aggregation  

Forbidden:

- global counts  

- global averages  

- global severity distribution  

Allowed:

- per‑tenant aggregation only  

# 4. API TENANT ISOLATION  

## 4.1 tenant_id Required  

All API endpoints require:

- JWT  

- tenant header  

## 4.2 Controllers Must Enforce tenant_id  

Controllers must:

- extract tenant_id  

- validate tenant_id  

- inject tenant_id into service layer  

## 4.3 Services Must Enforce tenant_id  

Services must:

- filter by tenant_id  

- write with tenant_id  

- log tenant_id  

## 4.4 No Cross‑Tenant Responses  

Forbidden:

- returning data from other tenants  

- returning aggregated multi‑tenant data  

---

# 5. BACKEND TENANT ISOLATION  

## 5.1 TenantGuard  

TenantGuard enforces:

- tenant_id exists  

- tenant_id valid  

- tenant active  

## 5.2 Service Layer Enforcement  

Services must:

- validate tenant_id  

- apply tenant_id to all queries  

- reject cross‑tenant access  

## 5.3 Repository Enforcement  

Repositories must:

- apply tenant_id filters  

- apply soft deletes  

- apply audit logging  

## 5.4 Event Bus Enforcement  

Events must include:

- tenant_id  

- user_id  

- role  

- timestamp  

Event bus must reject events missing tenant_id.

---

# 6. AIMI TENANT ISOLATION  

AIMI must operate per tenant.

## 6.1 AIMI Must Never Learn Across Tenants  

Forbidden:

- cross‑tenant severity learning  

- cross‑tenant routing learning  

- cross‑tenant scheduling learning  

- cross‑tenant diagnostic learning  

- cross‑tenant predictive learning  

## 6.2 AIMI Must Store Per‑Tenant Models  

AIMI tables include:

- AIMILearningWeights  

- TechnicianLearningProfile  

- PredictiveModels  

- SeverityHistory  

- RoutingHistory  

All rows include tenant_id.

## 6.3 AIMI Must Consume Per‑Tenant Events  

AIMI must ignore events from other tenants.

## 6.4 AIMI Must Produce Per‑Tenant Outputs  

Severity, routing, scheduling, diagnostics, predictive alerts must be tenant‑specific.

---

# 7. EVENT BUS TENANT ISOLATION  

## 7.1 Events Must Include tenant_id  

Every event must include:

- tenant_id  

- user_id  

- role  

- timestamp  

## 7.2 Event Bus Must Reject Missing tenant_id  

Events missing tenant_id are invalid.

## 7.3 Event Routing Must Be Tenant‑Scoped  

Event bus must deliver events only to:

- AIMI engines for that tenant  

- vertical modules for that tenant  

- services for that tenant  

## 7.4 No Cross‑Tenant Event Delivery  

Forbidden:

- delivering events to other tenants  

- merging events across tenants  

# 8. FRONTEND TENANT ISOLATION  

## 8.1 Tenant Header Injection  

Frontend must inject:

X-Tenant-Id: <tenant_id>

into every request.

## 8.2 Role‑Based Routing  

Frontend must:

- hide routes not allowed for tenant  

- hide features not enabled for tenant  

## 8.3 Tenant‑Scoped Dashboards  

Dashboards must show:

- tenant‑specific assets  

- tenant‑specific workorders  

- tenant‑specific PM  

- tenant‑specific telematics  

- tenant‑specific compliance  

- tenant‑specific AIMI insights  

---

# 9. MULTILINGUAL TENANT ISOLATION  

## 9.1 Per‑Tenant Language Settings  

Each tenant defines:

- default language  

- supported languages  

## 9.2 Per‑Tenant Translation Logs  

Multilingual logs include tenant_id.

---

# 10. VOICE TENANT ISOLATION  

## 10.1 Voice Commands Must Include tenant_id  

Voice commands must be logged per tenant.

## 10.2 Voice NLP Must Be Tenant‑Scoped  

Voice NLP must not learn across tenants.

---

# 11. SECURITY RULES  

Tenant isolation requires:

- JWT validation  

- tenant header validation  

- RBAC enforcement  

- audit logging  

- rate limiting  

- HTTPS  

Forbidden:

- cross‑tenant reads  

- cross‑tenant writes  

- cross‑tenant learning  

- cross‑tenant events  

---

# 12. FUTURE TENANT EXPANSION  

Supports future:

- new school districts  

- new commercial fleets  

- new enterprise tenants  

- new AIMI engines  

- new verticals  

No rewrites required.

---

# END OF TENANT ISOLATION BLUEPRINT

