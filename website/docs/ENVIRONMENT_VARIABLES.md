# Environment Variables Documentation

This document describes all environment variables used in the Antigravity platform.

## Validation & Architecture
The project utilizes `zod` for strict runtime environment variable validation.
- **Client variables** are validated in `lib/config/env.client.ts` and must be prefixed with `NEXT_PUBLIC_`.
- **Server variables** are validated in `lib/config/env.server.ts` and must never be exposed to the browser.
- The application will throw an error at startup if required variables are missing or malformed.

## Application

| Variable | Required | Client/Server | Purpose | Example |
|---|---|---|---|---|
| `NODE_ENV` | Yes | Server | Node runtime environment | `production` |
| `NEXT_PUBLIC_APP_NAME` | No | Client | Name of the app | `Antigravity` |
| `NEXT_PUBLIC_APP_URL` | No | Client | Base URL for the app | `https://maziz.me` |
| `NEXT_PUBLIC_APP_ENV` | No | Client | App specific environment | `production` |
| `NEXT_PUBLIC_APP_VERSION` | No | Client | Current version of the app | `1.0.0` |

## Supabase

| Variable | Required | Client/Server | Purpose | Example |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client | Database endpoint | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client | Public anon key | `ey...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server | Admin DB key (DO NOT EXPOSE) | `ey...` |
| `SUPABASE_DB_PASSWORD` | No | Server | Postgres password if direct connecting | `...` |

## Groq (LLM Inference)

| Variable | Required | Client/Server | Purpose | Example |
|---|---|---|---|---|
| `GROQ_API_KEY` | Yes | Server | Groq API Key | `gsk_...` |
| `DEFAULT_FAST_MODEL` | No | Server | Model definition for fast routing | `openai/gpt-oss-20b` |
| `DEFAULT_CHAT_MODEL` | No | Server | Model definition for standard chat | `openai/gpt-oss-20b` |
| `DEFAULT_REASONING_MODEL` | No | Server | Model definition for complex routing | `openai/gpt-oss-120b` |
| `GPT_OSS_20B_MODEL` | No | Server | Direct fallback 20B mapping | `openai/gpt-oss-20b` |
| `GPT_OSS_120B_MODEL` | No | Server | Direct fallback 120B mapping | `openai/gpt-oss-120b` |

## Jina AI (Embeddings)

| Variable | Required | Client/Server | Purpose | Example |
|---|---|---|---|---|
| `JINA_API_KEY` | Yes | Server | Key for generating dense vectors | `jina_...` |
| `JINA_EMBEDDING_MODEL` | No | Server | Defaults to jina-embeddings-v2-base-en | `jina-embeddings-v2-base-en` |

## Resend (Email Automation)

| Variable | Required | Client/Server | Purpose | Example |
|---|---|---|---|---|
| `RESEND_API_KEY` | Yes | Server | API key for transactional emails | `re_...` |
| `RESEND_FROM_EMAIL` | No | Server | Outbound verified domain | `io@maziz.me` |
| `RESEND_REPLY_TO` | No | Server | Reply-to address | `io@maziz.me` |
| `ADMIN_EMAIL` | No | Server | Recipient for lead notifications | `io@maziz.me` |
| `RAG_EMAIL` | No | Server | RAGX AI identity outbound | `ragx@maziz.me` |

## Sanity (CMS)

| Variable | Required | Client/Server | Purpose | Example |
|---|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Client | Sanity project identifier | `a1b2c3d4` |
| `NEXT_PUBLIC_SANITY_DATASET` | No | Client | Usually 'production' | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | Client | API versioning | `2024-03-01` |
| `SANITY_API_READ_TOKEN` | No | Server | Viewer token for draft mode | `sk...` |
| `SANITY_API_WRITE_TOKEN` | No | Server | Mutation token for automated updates | `sk...` |

## Google Calendar

| Variable | Required | Client/Server | Purpose | Example |
|---|---|---|---|---|
| `GOOGLE_CLIENT_ID` | No | Server | OAuth Client ID | `...` |
| `GOOGLE_CLIENT_SECRET` | No | Server | OAuth Client Secret | `...` |
| `GOOGLE_REFRESH_TOKEN` | No | Server | Long-lived refresh token | `...` |
| `GOOGLE_CALENDAR_ID` | No | Server | Specific calendar to sync | `primary` |

## Cloudflare

| Variable | Required | Client/Server | Purpose | Example |
|---|---|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Client | CAPTCHA site key | `0x...` |
| `TURNSTILE_SECRET_KEY` | No | Server | CAPTCHA verification key | `1x...` |
| `CLOUDFLARE_ACCOUNT_ID` | No | Server | Pages/Workers config | `...` |
| `CLOUDFLARE_API_TOKEN` | No | Server | Cache purge/deploy token | `...` |

## Analytics

| Variable | Required | Client/Server | Purpose | Example |
|---|---|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Client | Google Analytics ID | `G-...` |
| `NEXT_PUBLIC_CLARITY_ID` | No | Client | Microsoft Clarity ID | `...` |
| `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`| No | Client | Web Analytics Beacon | `...` |

## Security & Settings

- `SESSION_TIMEOUT_MINUTES`: JWT timeout window
- `RATE_LIMIT_WINDOW_MS`: Upstream rate limit tracking window
- `MAX_UPLOAD_SIZE_MB`: Ceiling for Edge Function payload sizes
- `ENABLE_RAG`: Global feature flag (true/false)

*(See `.env.example` for the exhaustive list of configuration blocks).*
