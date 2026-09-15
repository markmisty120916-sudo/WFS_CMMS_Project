# BACKEND STRUCTURE  

## Full Backend Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. BACKEND OVERVIEW  

The WFS CMMS backend is:

- service‑oriented  

- event‑driven  

- AIMI‑integrated  

- tenant‑safe  

- role‑safe  

- multilingual  

- voice‑aware  

- diagnostics‑aware  

- predictive‑aware  

Primary goals:

- reliability  

- determinism  

- zero drift  

- strict rule enforcement  

- unified intelligence layer (AIMI)

---

# 2. TECHNOLOGY STACK  

- Runtime: Node.js  

- Framework: NestJS  

- Database: PostgreSQL  

- ORM: Prisma  

- Cache: Redis  

- Message Bus: NATS or Kafka  

- Auth: JWT + tenant header  

- Storage: S3‑compatible  

- Telemetry: OpenTelemetry

---

# 3. BACKEND DIRECTORY STRUCTURE  

/src  

  /modules  

  /core  

  /aimi  

  /events  

  /middleware  

  /guards  

  /interceptors  

  /config  

  /database  

  /utils  

  main.ts

---

# 4. CORE LAYER  

Located in `/src/core`.

Includes:

- AuthModule  

- TenantModule  

- RBACModule  

- ConfigModule  

- LoggerModule  

- DatabaseModule  

- EventBusModule  

Core enforces:

- tenant isolation  

- role isolation  

- audit logging  

- soft deletes  

- deterministic behavior

---

# 5. VERTICAL MODULES  

Located in `/src/modules`.

Each vertical is isolated:

- AssetsModule  

- WorkordersModule  

- PMModule  

- PartsModule  

- SchedulingModule  

- TelematicsModule  

- ComplianceModule  

- DiagnosticsModule  

Verticals communicate ONLY through events.

---

# 6. AIMI MODULE  

Located in `/src/aimi`.

Submodules:

- SeverityEngine  

- RoutingEngine  

- SchedulingEngine  

- DiagnosticEngine  

- PredictiveEngine  

- LearningEngine  

- MultilingualNlpEngine  

- VoiceNlpEngine  

AIMI consumes:

- workorder events  

- telematics events  

- PM events  

- diagnostic events  

- compliance events  

- scheduling events  

AIMI produces:

- severity updates  

- routing updates  

- scheduling updates  

- diagnostic flows  

- predictive alerts  

- learning updates

---

# 7. EVENT BUS  

Located in `/src/events`.

Event bus responsibilities:

- receive events  

- validate events  

- route events  

- log events  

- deliver to AIMI  

- deliver to verticals  

- enforce tenant_id  

- enforce RBAC  

Event types:

- workorder.created  

- workorder.updated  

- pm.completed  

- diagnostic.completed  

- telematics.event.received  

- predictive.alert  

- asset.updated  

- voice.command.received  

- multilingual.text.translated

---

# 8. API LAYER  

Located in `/src/modules/*/controllers`.

Controllers:

- validate JWT  

- validate tenant_id  

- validate role  

- call service layer  

- emit events  

- return JSON  

Controllers NEVER contain business logic.

---

# 9. SERVICE LAYER  

Located in `/src/modules/*/services`.

Services:

- contain business logic  

- enforce rules  

- update database  

- emit events  

- call AIMI when needed  

Services NEVER bypass:

- AIMI  

- event bus  

- tenant isolation  

- RBAC

---

# 10. DATABASE LAYER  

Located in `/src/database`.

Includes:

- Prisma schema  

- migrations  

- repositories  

Repositories enforce:

- soft deletes  

- tenant_id  

- audit logging

---

# 11. MIDDLEWARE  

Located in `/src/middleware`.

Includes:

- tenant extraction  

- JWT validation  

- request logging  

- rate limiting

---

# 12. GUARDS  

Located in `/src/guards`.

Includes:

- TenantGuard  

- RoleGuard  

- PermissionGuard  

Guards enforce:

- tenant isolation  

- RBAC  

- permission checks

---

# 13. INTERCEPTORS  

Located in `/src/interceptors`.

Includes:

- response formatting  

- error formatting  

- audit logging

---

# 14. MULTILINGUAL INTEGRATION  

Backend multilingual layer:

- language detection  

- translation service  

- multilingual logs  

- multilingual NLP for AIMI  

All multilingual operations pass through AIMI.

---

# 15. VOICE INTEGRATION  

Backend voice layer:

- speech transcription  

- command parsing  

- voice NLP  

- voice logs  

Voice commands emit:

- voice.command.received

---

# 16. SECURITY  

Backend enforces:

- JWT  

- tenant header  

- RBAC  

- audit logs  

- rate limits  

- HTTPS  

- no cross‑tenant access  

- no cross‑role access

---

# 17. FUTURE BACKEND EXPANSION  

Supports future:

- new verticals  

- new AIMI engines  

- new predictive models  

- new multilingual engines  

- new voice engines  

- new compliance modules  

No rewrites required.

---

# END OF BACKEND STRUCTURE BLUEPRINT

