# CURSOR INSTRUCTIONS  
## Deterministic Build Rules for WFS  
## Master Blueprint V2 Enforcement

---

# 1. PURPOSE  
These instructions force Cursor to:

- reference Master Blueprint V2 only  
- ignore all previous blueprint versions  
- follow WFS architecture deterministically  
- prevent drift  
- maintain consistent naming, structure, and workflows  
- enforce RBAC and tenant isolation  
- follow delete → paste → save workflow  
- follow neon dark UI theme  

Cursor must treat this file as a global instruction layer for all code generation.

---

# 2. MASTER BLUEPRINT REFERENCE RULES  

Cursor must:

- load /blueprints/master-blueprint-v2.md for all architectural decisions  
- load all supporting blueprint files in /blueprints/  
- ignore any previous blueprint versions  
- ignore any blueprint fragments not in /blueprints/  
- treat Master Blueprint V2 as the single source of truth  

Forbidden:

- referencing Master Blueprint V1  
- referencing any deprecated blueprint  
- referencing any blueprint not in /blueprints/  

---

# 3. DRIFT PREVENTION RULES  

Cursor must:

- follow the exact naming conventions in Master Blueprint V2  
- follow the exact workflow structures  
- follow the exact RBAC rules  
- follow the exact tenant isolation rules  
- follow the exact module hierarchy  
- follow the exact event bus structure  
- follow the exact predictive, learning, and insight rules  

Cursor must never:

- invent new modules  
- rename modules  
- reorder modules  
- merge modules  
- split modules  
- change hierarchy  
- change naming  
- change color scheme  

---

# 4. FILE GENERATION RULES  

Cursor must:

- generate files using delete → paste → save workflow  
- replace entire files when instructed  
- avoid partial edits unless explicitly requested  
- maintain consistent formatting  
- maintain consistent folder structure  

Cursor must never:

- generate code outside the requested file  
- modify unrelated files  
- create new folders without instruction  

---

# 5. UI RULES  

Cursor must enforce:

- neon command center theme  
- dark background  
- high‑visibility accents  
- consistent panel grouping  
- consistent dashboard hierarchy  

Cursor must never:

- change UI theme  
- change color scheme  
- change naming  
- change hierarchy  

---

# 6. RBAC RULES  

Cursor must enforce RBAC exactly as defined:

- Technician  
- Master Technician  
- Fleet Manager  
- Parts Manager  
- Compliance Officer  
- Driver  
- Silent Master Key  

Cursor must never:

- grant unauthorized access  
- mix role visibility  
- bypass RBAC  

---

# 7. TENANT ISOLATION RULES  

Cursor must enforce:

- strict tenant isolation  
- tenant‑scoped data  
- tenant‑scoped events  
- tenant‑scoped logs  

Cursor must never:

- leak cross‑tenant data  
- reference cross‑tenant events  
- merge tenant data  

---

# 8. AIMI INTEGRATION RULES  

Cursor must integrate AIMI exactly as defined:

- AIMI Predictive  
- AIMI Learning  
- AIMI Insights  
- AIMI Multilingual  
- AIMI Voice  
- AIMI Diagnostic Flow  
- AIMI Scheduling  
- AIMI Routing  

Cursor must never:

- modify AIMI learning weights  
- modify predictive thresholds  
- invent new AIMI modules  

---

# 9. EVENT BUS RULES  

Cursor must follow:

- event categories  
- event structure  
- event routing  
- event logging  
- event replay  
- event audit  

Cursor must never:

- change event structure  
- invent new event categories  
- modify event routing logic  

---

# 10. WORKFLOW RULES  

Cursor must follow:

- workorder lifecycle  
- PM lifecycle  
- compliance lifecycle  
- inventory lifecycle  
- diagnostic lifecycle  
- scheduling lifecycle  
- routing lifecycle  

Cursor must never:

- alter lifecycle order  
- skip lifecycle stages  
- merge lifecycle stages  

---

# 11. CODE GENERATION RULES  

Cursor must:

- generate code that matches Master Blueprint V2  
- generate backend + frontend consistently  
- generate deterministic logic  
- generate drift‑proof modules  
- generate consistent naming  

Cursor must never:

- generate code that contradicts blueprint rules  
- generate code that changes architecture  
- generate code that changes naming  

---

# 12. ALWAYS INCLUDE THIS IN EVERY CURSOR PROMPT  

Cursor must treat the following line as mandatory:

Reference ONLY /blueprints/master-blueprint-v2.md and ignore all previous blueprint versions.

This line must be honored for all code generation.
