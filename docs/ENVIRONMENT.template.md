# Environment template (docs only)

Copy these names into the deployment secret store. Do not commit secrets.

```
# Backend
WFS_CMMS_DATABASE_URL=
WFS_CMMS_API_BASE=/v1
NODE_ENV=production

# Frontend
NEXT_PUBLIC_WFS_CMMS_API_BASE=/v1
```

Required headers (not environment variables):

```
Authorization=
X-Tenant-Id=
```

Optional operational flag already used by Production Hardening (unchanged):

```
# sessionStorage wfs.cmms.maintenance=1
```

Release preflight treats sessionStorage `wfs.cmms.mock=1` as invalid. Dashboards must not load mock data.
