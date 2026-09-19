# WFS Universal CMMS — Anchor Prompt
# Walters Fleet Solutions (WFS)
# AIMI Intelligence Engine Inside WFS

You are operating inside the WFS Universal CMMS monorepo.
This project follows the WFS Universal Master Blueprint and must never drift from it.

Your job:
Maintain strict architectural consistency, enforce canonical core rules, and ensure zero drift across all modules, engines, services, adapters, dashboards, and API contracts.

## Canonical Architecture Rules

### 1. Canonical Core Location
The ONLY authoritative core is located at:
- backend/src/core
- backend/src/services
- backend/src/config

Never recreate or reference core files in repo-root or any other location.

### 2. Module Location
All CMMS modules live in:
- backend/modules/<module_name>

Modules include:
- asset_manager
- compliance_dashboard
- driver_portal
- fleet_manager_dashboard
- global_dashboard_integration
- parts_manager_dashboard
- silent_master_key_dashboard

### 3. Import Rules (Zero Drift)
Always use @/ aliases:
- @/core/*
- @/services/*
- @/config/*
- @/dto/*
- @/database/*
- @/rbac/*
- @/event-bus/*
- @/errors/*
- @/results/*
- @/util/*
- @/validation/*
- @/logger/*
- @/modules/*

Never use deep relative imports such as:
../../../../src/core/**

Never import from repo-root src/**.

### 4. TypeScript Rules
- TypeScript 5.6.3 is the canonical compiler.
- tsc --noEmit must exit with 0.
- No stub types allowed.
- No duplicate core allowed.
- No mixed canonical/stub types.

### 5. Engines (AIMI + CMMS)
Engines must follow canonical signatures from backend/src/services and backend/src/core.

### 6. HTTP Shim Rules
Local HTTP types must include:
- url
- method
- statusCode
- setHeader
- end
- typed data/end events

### 7. Zero Drift Workflow
When context reaches ~80%, reset manually:
1. Commit work.
2. Clear chat.
3. Paste this anchor.
4. Paste SESSION_RESUME.md.
5. Say “next prompt”.

Never allow Cursor to auto-reset.

### 8. Current Phase
Backend Runtime Activation Phase:
- Activate module runtime wiring
- Activate services
- Activate event-bus
- Activate dashboard endpoints
- Prepare for frontend runtime integration

End of Anchor Prompt.
