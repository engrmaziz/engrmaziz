# Enterprise Production Checklist

This checklist verifies the operational readiness of the platform before deployment.

## 1. Environment Configuration

Ensure the following critical environment variables are injected into the production environment via a secure secret manager (do not commit them):

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key (Server-only)
- `GROQ_API_KEY`: Groq API Key
- `JINA_API_KEY`: Jina AI API Key
- `ADMIN_API_TOKEN`: Cryptographically secure token for administrative endpoints

## 2. Startup Validation

Before exposing traffic to the instance, verify the startup sequence passes without warnings:

```bash
npx tsx scripts/startup-verify.ts
```

## 3. Health & Readiness

Verify the deployment is operational via HTTP endpoints:

- **Liveness/Readiness**: `GET /api/rag/health` should return `{ "overall": "HEALTHY" }` with `200 OK`.
- **Status Validation**: `GET /api/rag/status` should return system telemetry with `200 OK`.

## 4. Security

Confirm all administrative endpoints are secured.
```bash
npx tsx scripts/security-verify.ts
```
Ensure all administrative tools use `Authorization: Bearer <ADMIN_API_TOKEN>`.

## 5. Deployment Certification

After deployment, run the final release certification against the production-like staging environment to ensure all provider networks, storage bridges, and agents are functioning deterministically.

```bash
npx tsx scripts/release-verify.ts
```

## 6. Rollback Strategy

In the event of a critical failure during deployment:
1. Revert to the previous `GIT_COMMIT` hash immediately.
2. The Database layer is forward/backward compatible as no schema modifications occurred without backward support.

---
*Note: This architecture is statically deterministic. No dynamic orchestration configuration is required post-deployment.*
