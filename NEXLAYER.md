# Nexlayer — cat-voting-app

<!-- nexlayer:meta version=1 analyzed=2026-06-11T16:21:10Z repo=https://github.com/KatieHarris2397/cat-voting-app branch=nexlayer-mcp -->

> **For AI agents (Claude Code, Cursor, Gemini CLI, Copilot):**
> This file is the **project context** for this Nexlayer deployment — tech stack, env vars, secrets, live URL.
> For full platform detail (nexlayer.yaml schema, Dockerfile rules, CI/CD, task recipes) read **`nexlayer.skills`** in this repo.
>
> **Critical rules (full detail in `nexlayer.skills`):**
> - Inter-pod refs: `${podName:port}` only — never `localhost` or bare hostnames
> - Docker Hub images: prefix with `mirror.gcr.io/library/` — bare tags fail on the cluster
> - Secrets: set in the Nexlayer dashboard — never commit to `nexlayer.yaml` or Dockerfile
>
> **This file:** `agent-managed` sections update automatically. `user-editable` sections (Local Development Setup, Nexlayer Deployment Plan, Build Notes) are yours — preserved across re-analysis.

## Project Summary
<!-- nexlayer:section agent-managed=project_summary -->
A full-stack cat voting application featuring a React frontend and Node.js backend that leverages Supabase for data persistence and authentication.
<!-- nexlayer:end -->

## Technology Stack
<!-- nexlayer:section agent-managed=tech_stack -->
| Name | Kind | Version | Detected From |
|------|------|---------|---------------|
| React | framework | 18 | README.md |
| Node.js | language | 18 | Dockerfile |
| Express | framework | unspecified | README.md |
| Supabase | database | unspecified | README.md |
| Vite | build | unspecified | README.md |
| Nginx | infra | alpine | docker-compose.yml |
<!-- nexlayer:end -->

## Repository Structure
<!-- nexlayer:section agent-managed=structure_map -->
- client/ — React frontend source code and build configuration
- server/ — Node.js/Express backend API
- supabase/ — Database schema and migration scripts
- nginx.conf — Reverse proxy configuration
<!-- nexlayer:end -->

## External Services Required
<!-- nexlayer:section agent-managed=external_deps -->
Services that must be configured separately (not deployed by Nexlayer):

- Supabase Cloud (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
<!-- nexlayer:end -->

## Local Development Setup
<!-- nexlayer:section user-editable=local_setup -->
### Prerequisites

- Node.js >= 16
- npm

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
```

### Steps

1. `npm install` — Install root dependencies
2. `npm run install:all` — Install client and server dependencies
3. `npm run dev` — Start both client and server in development mode

<!-- nexlayer:end -->

## Nexlayer Setup
<!-- nexlayer:section agent-managed=nexlayer_setup -->
### Pod Environment Variables

| Pod | Variable | Value | Kind |
|-----|----------|-------|------|
| `"frontend"` | `NODE_ENV` | `"production"` | plain |
| `"backend"` | `NODE_ENV` | `"production"` | plain |
| `"backend"` | `PORT` | `"5000"` | plain |
| `"backend"` | `SUPABASE_URL` | `"https://ivbijiqzgujhinqdiqnp.supabase.co"` | plain |
| `"backend"` | `SUPABASE_SERVICE_ROLE_KEY` | `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YmlqaXF6Z3VqaGlucWRpcW5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODczNTIzMywiZXhwIjoyMDc0MzExMjMzfQ.BTLzkLYBMp-bTdYB7Zztyl5j62MEODj0hVvVLsHP5_E"` | plain |

### nexlayer.yaml

```yaml
application:
  name: "cute-or-not-cat-app"
  pods:
    - name: "frontend"
      image: "registry.nexlayer.io/nexlayer-mcp/62b8555a9bcb1433a857183de559749a/cat-voting-app-e06d9c87-frontend:d07ee4bf-1758737527"
      path: "/"
      servicePorts: [80]
      vars:
        NODE_ENV: "production"
    - name: "backend"
      image: "registry.nexlayer.io/nexlayer-mcp/62b8555a9bcb1433a857183de559749a/cat-voting-app-e06d9c87-backend:61872d22-1758738468"
      servicePorts: [5000]
      vars:
        NODE_ENV: "production"
        PORT: "5000"
        SUPABASE_URL: "https://ivbijiqzgujhinqdiqnp.supabase.co"
        SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YmlqaXF6Z3VqaGlucWRpcW5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODczNTIzMywiZXhwIjoyMDc0MzExMjMzfQ.BTLzkLYBMp-bTdYB7Zztyl5j62MEODj0hVvVLsHP5_E"
```

<!-- nexlayer:end -->

## Nexlayer Deployment Plan
<!-- nexlayer:section user-editable=deployment_plan -->
### Pod Topology

| Pod | Image | Port | Role |
|-----|-------|------|------|
| proxy | mirror.gcr.io/library/nginx:alpine | 80 | web |
| app-server | mirror.gcr.io/library/node:18-alpine | 5000 | web |

### Inter-pod environment variables

- `proxy` pod: `UPSTREAM_URL=${app-server:5000}`
- `app-server` pod: `SUPABASE_URL=${SUPABASE_URL}`
- `app-server` pod: `SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}`

### Deployment notes

- Frontend is built into static assets and served by the app-server pod as per the production Dockerfile
- Proxy pod uses ${app-server:5000} to route traffic to the Node.js backend
- Supabase is utilized as an external BaaS, therefore no internal database pod is defined in the topology

<!-- nexlayer:end -->

## Build Notes
<!-- nexlayer:section user-editable=build_notes -->
<!-- Add notes for future builds here — preserved across re-analysis -->
<!-- nexlayer:end -->

## Nexlayer Configuration
<!-- nexlayer:section agent-managed=nexlayer_config -->
**Last deployed:** 2026-06-11T16:27:31Z  
**Live URL:** https://kitbear-studio-cute-or-not-cat-app.cloud.nexlayer.ai  
**Runtime:**  · **Port:** auto-detected  
**Deploy branch:** nexlayer-mcp  

```yaml
application:
  name: "cute-or-not-cat-app"
  pods:
    - name: "frontend"
      image: "registry.nexlayer.io/nexlayer-mcp/62b8555a9bcb1433a857183de559749a/cat-voting-app-e06d9c87-frontend:d07ee4bf-1758737527"
      path: "/"
      servicePorts: [80]
      vars:
        NODE_ENV: "production"
    - name: "backend"
      image: "registry.nexlayer.io/nexlayer-mcp/62b8555a9bcb1433a857183de559749a/cat-voting-app-e06d9c87-backend:61872d22-1758738468"
      servicePorts: [5000]
      vars:
        NODE_ENV: "production"
        PORT: "5000"
        SUPABASE_URL: "https://ivbijiqzgujhinqdiqnp.supabase.co"
        SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YmlqaXF6Z3VqaGlucWRpcW5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODczNTIzMywiZXhwIjoyMDc0MzExMjMzfQ.BTLzkLYBMp-bTdYB7Zztyl5j62MEODj0hVvVLsHP5_E"
```
<!-- nexlayer:end -->

## Build History
<!-- nexlayer:section agent-managed=build_history -->
| Date | Status | Notes |
|------|--------|-------|
| 2026-06-11T16:21:10Z | analyzed | initial repo analysis |
| 2026-06-11T16:27:31Z | success | deployed https://kitbear-studio-cute-or-not-cat-app.cloud.nexlayer.ai |
<!-- nexlayer:end -->
