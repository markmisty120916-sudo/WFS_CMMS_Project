# CI/CD pipeline hints (docs only)

These are hints. This phase does not add a new CI system or rename modules.

1. Checkout the repository.
2. Run build-time configuration validation:
   - `npx ts-node scripts/validate-release-config.ts`
3. Typecheck backend and frontend without rewriting modules.
4. Confirm integration routes still respond as documented in `docs/RELEASE_PREP.md`.
5. Build images from:
   - `deploy/Dockerfile.backend`
   - `deploy/Dockerfile.frontend`
6. Do not copy `.env` or credential files into images.
7. Health probes:
   - `GET /v1/integration/health`
   - `GET /v1/integration/ready`
   - Include `Authorization` and `X-Tenant-Id`.
8. Do not migrate, rename, or drop existing AIMI, EventBus, RBAC, or tenant isolation artifacts.
