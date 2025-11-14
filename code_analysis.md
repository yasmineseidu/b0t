# Project Analysis Report: b0t

## Project Overview

b0t is a sophisticated, open-source workflow automation platform that revolutionizes how users create automations. Instead of clicking through visual editors or wiring nodes together like traditional tools (Zapier, n8n, Make.com), users describe what they want in plain English to Claude Code, which then generates, validates, and executes production-grade workflows.

The platform is designed for:
- **Individuals**: Content creators, developers, marketers who want to automate repetitive tasks
- **Agencies**: Multi-tenant architecture supports managing workflows for multiple clients
- **Teams**: Role-based access control with organization-level isolation

Key differentiator: b0t combines the ease of Zapier with the power of n8n, offering infinite extensibility (every module is just a TypeScript file you can modify) while being completely free and self-hostable.

## Technology Stack

### Frontend
- **React 19**: Latest React version with concurrent features
- **Next.js 15**: Full-stack framework using App Router architecture
- **TypeScript 5**: Type-safe development across the entire codebase
- **Tailwind CSS 4**: Utility-first CSS framework for modern styling
- **Radix UI**: Accessible, unstyled component primitives
- **shadcn/ui**: High-quality pre-built components
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### Backend
- **Node.js 20+**: JavaScript runtime (minimum version requirement)
- **Next.js API Routes**: Serverless API endpoints
- **NextAuth v5**: Authentication and session management
- **PostgreSQL 16**: Primary database for workflows, users, credentials, execution history
- **Redis 7**: Job queue and caching via BullMQ
- **Drizzle ORM**: Type-safe database queries with auto-migrations
- **BullMQ**: Robust queue system for concurrent workflow execution

### AI/LLM Integration
- **Anthropic Claude**: Primary AI model (Sonnet 4.5, Haiku 4.5) for workflow generation
- **OpenAI GPT**: Alternative AI provider
- **Vercel AI SDK**: Unified interface for multiple AI providers

### Infrastructure & DevOps
- **Docker Compose**: Local development environment (PostgreSQL + Redis)
- **Railway**: Primary cloud deployment platform
- **Vercel**: Alternative deployment option
- **GitHub Actions/GitLab CI**: CI/CD pipeline support (via scripts)

### Development Tools
- **Vitest**: Fast unit testing framework
- **Playwright**: End-to-end testing (configured but not extensively used)
- **ESLint 9**: Code linting with Next.js config
- **TypeDoc**: API documentation generation
- **tsx**: TypeScript execution for scripts

### Production-Ready Features
- **Opossum**: Circuit breaker implementation for API resilience
- **Bottleneck**: Rate limiting for API calls (Twitter 300/15min, OpenAI 500/min, etc.)
- **Pino**: Structured JSON logging
- **CASL**: Role-based access control (RBAC)
- **AES-256**: Credential encryption
- **Axios + Axios Retry**: HTTP client with automatic retries

### Major Dependencies (140+ integrations)
- **Social Media**: Twitter (@), Discord, Telegram, Reddit, YouTube, Instagram, TikTok
- **Communication**: Slack, Email (Resend), Twilio, WhatsApp, Intercom, Zendesk
- **AI Services**: OpenAI, Anthropic, Cohere, HuggingFace, Stability AI, Replicate, Runway, HeyGen, ElevenLabs
- **Databases**: PostgreSQL (pg), MongoDB, MySQL2, ChromaDB, Pinecone, Weaviate
- **Business Tools**: Salesforce, HubSpot, QuickBooks, Stripe, DocuSign, Notion, Airtable
- **E-commerce**: Shopify, WooCommerce, Square
- **Developer Tools**: GitHub (Octokit), Google APIs (Sheets, Calendar, Analytics)

## Project Structure

```
smarter-b0t/
├── src/                          # Main source code directory
│   ├── app/                      # Next.js App Router (pages, layouts, API routes)
│   │   ├── api/                  # 45+ API endpoints
│   │   │   ├── workflows/        # Workflow CRUD, execution, webhooks
│   │   │   ├── credentials/      # Credential management
│   │   │   ├── clients/          # Multi-tenant client management
│   │   │   ├── auth/             # OAuth callbacks (Twitter, YouTube, Google, Outlook)
│   │   │   └── monitoring/       # System capacity and health checks
│   │   ├── dashboard/            # Main dashboard pages
│   │   │   ├── workflows/        # Workflow management UI
│   │   │   ├── activity/         # Execution history viewer
│   │   │   ├── credentials/      # API key management UI
│   │   │   └── clients/          # Client/organization management
│   │   ├── auth/                 # Authentication pages (signin, register)
│   │   ├── settings/             # User settings page
│   │   ├── layout.tsx            # Root layout with providers
│   │   └── page.tsx              # Home page (redirects to dashboard or signin)
│   │
│   ├── components/               # React UI components
│   │   ├── automation/           # Workflow builder components
│   │   ├── workflow/             # Workflow execution & display
│   │   ├── credentials/          # Credential forms & lists
│   │   ├── clients/              # Client management UI
│   │   ├── dashboard/            # Dashboard widgets
│   │   ├── layout/               # Header, sidebar, navigation
│   │   ├── ui/                   # Reusable UI primitives (buttons, dialogs, etc.)
│   │   └── providers/            # React context providers
│   │
│   ├── lib/                      # Core utilities and business logic
│   │   ├── workflows/            # Workflow execution engine (21 files)
│   │   │   ├── executor.ts       # Main workflow executor
│   │   │   ├── parallel-executor.ts  # Automatic step parallelization
│   │   │   ├── workflow-queue.ts # BullMQ job queue integration
│   │   │   ├── workflow-scheduler.ts # Cron-based scheduling
│   │   │   ├── module-registry.ts    # 3,300-line registry of all 900+ functions
│   │   │   ├── credentials.ts    # Credential loading & decryption
│   │   │   └── control-flow.ts   # Step execution logic
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── db.ts                 # PostgreSQL connection pool (configurable 30-100 connections)
│   │   ├── schema.ts             # Drizzle ORM database schema
│   │   ├── logger.ts             # Pino structured logger
│   │   ├── queue.ts              # BullMQ queue setup
│   │   ├── organizations.ts      # Multi-tenancy logic
│   │   ├── cache/                # Caching utilities
│   │   ├── jobs/                 # Background job definitions
│   │   └── mcp/                  # Model Context Protocol integration
│   │
│   ├── modules/                  # 17 domain modules, 163 service files
│   │   ├── ai/                   # AI services (16 files): OpenAI, Anthropic, Cohere, HuggingFace, vector DBs
│   │   ├── social/               # Social media (11 files): Twitter, Reddit, YouTube, Instagram, TikTok
│   │   ├── communication/        # Communication (13 files): Slack, Discord, Telegram, Email, Twilio
│   │   ├── business/             # Business tools (10 files): Salesforce, HubSpot, QuickBooks, DocuSign
│   │   ├── ecommerce/            # E-commerce (8 files): Shopify, WooCommerce, Square, Amazon
│   │   ├── data/                 # Databases (9 files): PostgreSQL, MongoDB, MySQL, Google Sheets, Airtable
│   │   ├── content/              # Content platforms (8 files): WordPress, Medium, Ghost
│   │   ├── video/                # Video/audio (8 files): ElevenLabs, HeyGen, Runway, Cloudinary
│   │   ├── productivity/         # Productivity (11 files): Notion, Asana, Trello, Linear
│   │   ├── leads/                # Lead gen (6 files): Apollo, Clearbit, Hunter, ZoomInfo
│   │   ├── devtools/             # Developer tools (7 files): GitHub, Vercel, Netlify, Sentry
│   │   ├── payments/             # Payments (4 files): Stripe, PayPal
│   │   ├── utilities/            # 250+ utility functions (32 files): HTTP, CSV, JSON, dates, validation
│   │   ├── dataprocessing/       # Data transformation utilities
│   │   ├── external-apis/        # RapidAPI integrations
│   │   └── mcp/                  # Model Context Protocol modules
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── workflows.ts          # Workflow & step type definitions
│   │
│   └── hooks/                    # Custom React hooks
│       └── (various UI hooks)
│
├── scripts/                      # 35+ utility scripts
│   ├── first-time-setup.sh       # Automated first-time setup (322 lines)
│   ├── dev-start.sh              # Start Next.js + worker in parallel
│   ├── seed-admin.ts             # Create admin user
│   ├── delete-workflows.ts       # Workflow cleanup
│   ├── import-workflow.ts        # Import workflow JSON
│   ├── export-workflow.ts        # Export workflow JSON
│   ├── validate-workflow-new.ts  # Workflow validation
│   ├── generate-module-registry.ts   # Auto-generate module documentation
│   ├── generate-openapi-spec.ts  # OpenAPI spec generation
│   └── (30+ other maintenance scripts)
│
├── drizzle/                      # Database migrations (15 migration files)
│   └── (auto-generated by Drizzle Kit)
│
├── tests/                        # Test suite
│   ├── templates/                # Test templates for modules
│   └── scripts/                  # Test generation scripts
│
├── public/                       # Static assets
│   └── (images, screenshots)
│
├── .claude/                      # Claude Code configuration
│   ├── commands/                 # Custom slash commands (/commit, /workflow, etc.)
│   └── skills/                   # Custom Claude Code skills
│
├── worker.ts                     # Standalone worker process (206 lines)
│   └── Processes workflows from Redis queue independently
│
├── package.json                  # Dependencies & scripts (6,563 bytes, 200 lines)
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── drizzle.config.ts             # Database migration config
├── docker-compose.yml            # Local development services
├── vitest.config.ts              # Test configuration
├── eslint.config.mjs             # Linting rules
├── postcss.config.mjs            # PostCSS config
├── components.json               # shadcn/ui config
├── .env.example                  # Environment variable template (113 lines)
├── .env.local.example            # Local environment template
├── README.md                     # Main documentation (539 lines)
├── CLAUDE.md                     # Project instructions for Claude Code
└── (various documentation files)
```

### Codebase Statistics
- **Total lines of code**: ~119,240 lines of TypeScript/TSX
- **API endpoints**: 45 routes
- **Module categories**: 17 domains
- **Service integrations**: 163 module files (900+ exported functions)
- **Database tables**: 13 tables with optimized indexes
- **Scripts**: 35+ utility scripts for automation

## Key Files and Their Purpose

### Entry Points

**src/app/page.tsx** (16 lines)
- Root page that redirects users to dashboard (if authenticated) or signin page
- Simple authentication check using NextAuth

**src/app/layout.tsx**
- Root layout component wrapping entire application
- Sets up providers (ThemeProvider, SessionProvider)
- Imports global styles and fonts

**worker.ts** (206 lines)
- Standalone worker process for horizontal scaling
- Processes workflows from Redis queue independently from web server
- Configurable concurrency (default: 50 workflows)
- Graceful shutdown with active job completion
- Health checks every 30 seconds
- Module pre-loading for zero cold starts

### Core Workflow Engine

**src/lib/workflows/executor.ts**
- Main workflow execution engine
- Loads workflow from database, validates organization status
- Injects user credentials into execution context
- Executes steps sequentially or in parallel
- Handles errors and updates database with results
- Returns formatted output based on display configuration

**src/lib/workflows/parallel-executor.ts**
- Automatic parallelization of independent workflow steps
- Analyzes dependencies between steps
- Executes steps concurrently when safe (verified 3x speedup)
- Handles errors and maintains execution context

**src/lib/workflows/control-flow.ts**
- Individual step execution logic
- Variable interpolation (replaces {{variable}} with actual values)
- Dynamic module loading and function invocation
- Control flow: conditionals, loops, map/filter/reduce
- Error handling and logging

**src/lib/workflows/workflow-queue.ts**
- BullMQ queue integration for concurrent execution
- Configurable worker concurrency (20 dev, 100 prod)
- Job status tracking and error handling
- Queue monitoring and statistics

**src/lib/workflows/workflow-scheduler.ts**
- Cron-based workflow scheduling
- Loads scheduled workflows from database on startup
- Executes workflows at specified intervals
- Node-cron based implementation

**src/lib/workflows/module-registry.ts** (3,300+ lines)
- Complete registry of all 900+ available functions
- Documents parameters, return types, examples
- Used by Claude Code to discover available capabilities
- Auto-generated from module source code

**src/lib/workflows/credentials.ts**
- Loads and decrypts user credentials from database
- AES-256 decryption using ENCRYPTION_KEY
- Caches credentials for performance
- Handles missing credentials gracefully

### Authentication & Multi-Tenancy

**src/lib/auth.ts** (548 lines)
- NextAuth v5 configuration
- Supports credentials-based authentication
- Auto-creates personal organization on first sign-in
- Session management with JWT tokens
- Organization context loading
- Helper functions: requireAuth(), hasRole(), getCurrentOrganizationId()

**src/lib/organizations.ts**
- Multi-tenant organization management
- CRUD operations for organizations
- Member management with roles (owner, admin, member, viewer)
- Organization switching
- Client organization support (for agencies)

**src/lib/schema.ts** (200+ lines shown, full file larger)
- Drizzle ORM database schema definitions
- 13 tables: users, accounts, organizations, workflows, workflow_runs, credentials, etc.
- Optimized indexes for common query patterns
- Denormalized fields for performance (e.g., organizationStatus)
- JSONB columns for flexible configuration storage

### Database & Infrastructure

**src/lib/db.ts** (94 lines)
- PostgreSQL connection pool configuration
- Configurable pool size (30 dev, 100 prod)
- Connection monitoring and error handling
- Pool statistics for debugging

**src/lib/logger.ts**
- Pino-based structured logging
- JSON format for production parsing
- Supports multiple log levels (debug, info, warn, error)

**src/lib/queue.ts**
- BullMQ queue initialization
- Redis connection management
- Job processing and error handling

### API Routes

**src/app/api/workflows/[id]/run/route.ts**
- Executes a workflow manually via API
- Validates user permissions
- Enqueues job to BullMQ
- Returns execution status

**src/app/api/workflows/[id]/webhook/route.ts**
- Webhook trigger endpoint
- Validates webhook secret
- Executes workflow with webhook payload

**src/app/api/workflows/[id]/chat/route.ts**
- Chat-based workflow triggers
- Conversational automation interface

**src/app/api/credentials/route.ts**
- Credential CRUD operations
- Encrypts credentials before storage
- Per-user credential isolation

**src/app/api/monitoring/capacity/route.ts**
- System health and capacity monitoring
- Queue statistics (active, waiting, completed, failed)
- Database pool utilization

### Configuration Files

**package.json** (199 lines)
- 167 production dependencies (AI SDKs, API clients, databases, UI libraries)
- 24 dev dependencies (testing, linting, type definitions)
- 40+ npm scripts for development, testing, deployment
- Node.js 20+ requirement

**next.config.ts** (73 lines)
- Standalone output for containerization
- External packages with native dependencies
- Webpack config for production builds
- Suppresses expected warnings

**drizzle.config.ts** (19 lines)
- Database migration configuration
- Supports PostgreSQL (prod) and SQLite (fallback)
- Schema location and output directory

**docker-compose.yml** (89 lines)
- PostgreSQL 16 container (port 5433 to avoid conflicts)
- Redis 7 container (port 6379)
- Optional pgAdmin and Redis Commander (debug profile)
- Health checks and volume persistence

**tsconfig.json** (45 lines)
- TypeScript compiler configuration
- ES2017 target, ESNext modules
- Strict mode enabled
- Path alias: @ maps to ./src/
- Excludes problematic modules from compilation

**vitest.config.ts** (18 lines)
- Test environment: jsdom for React component testing
- React plugin for JSX support
- Setup file for global test configuration

## How to Set Up and Run

### Prerequisites

1. **Node.js 20+**: Download from https://nodejs.org/
2. **Docker Desktop**: Download from https://www.docker.com/products/docker-desktop/
   - Required for PostgreSQL and Redis containers

### Installation Steps

#### Automated Setup (Recommended)

The project includes a comprehensive setup script that handles everything automatically:

```bash
# 1. Clone the repository
git clone https://github.com/KenKaiii/b0t.git
cd b0t

# 2. Run automated setup (installs dependencies, starts Docker, sets up database)
npm run setup

# 3. Start the application
npm run dev:full
```

The `npm run setup` script (scripts/first-time-setup.sh) performs the following:
1. Checks prerequisites (Node.js 20+, Docker)
2. Installs npm dependencies
3. Creates .env.local from template
4. Generates AUTH_SECRET and ENCRYPTION_KEY automatically
5. Starts Docker containers (PostgreSQL + Redis)
6. Waits for services to be ready (with health checks)
7. Pushes database schema to PostgreSQL
8. Seeds admin account (admin@b0t.dev / admin)
9. Verifies installation

#### Manual Setup (If automated setup fails)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.local.example .env.local

# 3. Generate encryption keys (macOS/Linux)
echo "AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "ENCRYPTION_KEY=$(openssl rand -base64 32)" >> .env.local

# Windows users: Use Git Bash or WSL2, or generate at random.org/bytes

# 4. Start Docker services
npm run docker:start

# 5. Setup database
npm run db:push
npm run db:seed

# 6. Start application
npm run dev:full
```

### How to Run the Application

**Development Mode** (with hot reload):
```bash
npm run dev:full
# Starts Next.js dev server (port 3000) + background worker
# Uses Turbopack for faster builds
```

**Development Mode** (web server only):
```bash
npm run dev
# Starts Next.js dev server without worker
# Workflows execute synchronously in API routes
```

**Production Mode**:
```bash
npm run build
npm start
# Separate worker: npm run worker:prod
```

**Access the application**:
- Open http://localhost:3000
- Login with: admin@b0t.dev / admin
- IMPORTANT: Change password after first login (Settings → Security)

### How to Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests once and exit
npm run test:run

# Generate coverage report
npm run test:coverage
```

Test files are located in:
- `src/**/__tests__/*.test.ts` - Unit tests
- `tests/` - Integration tests and templates

### Environment Variables

The setup script auto-configures these, but you can customize:

**Required Variables**:
- `DATABASE_URL`: PostgreSQL connection string (default: postgresql://postgres:postgres@localhost:5433/b0t_dev)
- `REDIS_URL`: Redis connection string (default: redis://localhost:6379)
- `AUTH_SECRET`: Session encryption key (auto-generated)
- `ENCRYPTION_KEY`: API credential encryption key (auto-generated, CRITICAL - do not lose)

**Optional Variables**:
- `NEXTAUTH_URL`: Application URL (default: http://localhost:3000)
- `ADMIN_EMAIL`: Admin account email (default: admin@b0t.dev)
- `ADMIN_PASSWORD`: Admin account password (default: admin)
- `NODE_ENV`: Environment mode (development/production)
- `LOG_LEVEL`: Logging verbosity (debug/info/warn/error)

**Scaling Configuration** (Advanced):
- `DB_POOL_MAX`: Max database connections (default: 30 dev, 100 prod)
- `DB_POOL_MIN`: Min database connections (default: 5)
- `WORKFLOW_CONCURRENCY`: Max concurrent workflows (default: 20 dev, 100 prod)
- `WORKER_NAME`: Worker instance identifier
- `WORKER_MODE`: Enable dedicated worker mode (true/false)

**Platform API Keys** (configured in web UI):
- Not stored in .env file
- Managed per-user through Settings → Credentials
- Encrypted with AES-256 using ENCRYPTION_KEY

## Entry Points

### Application Entry Points

1. **Web Application**: src/app/page.tsx
   - Checks user authentication status
   - Redirects to /dashboard (authenticated) or /auth/signin (not authenticated)

2. **API Routes**: src/app/api/
   - 45 endpoints organized by resource
   - RESTful design with [id] dynamic routes
   - Authentication middleware in middleware.ts

3. **Background Worker**: worker.ts
   - Standalone process for workflow execution
   - Runs independently from Next.js server
   - Processes jobs from Redis BullMQ queue
   - Supports horizontal scaling (multiple worker instances)

### User Journey Entry Points

**First-Time User**:
1. Visit http://localhost:3000
2. Redirected to /auth/signin
3. Login with admin credentials
4. Redirected to /dashboard
5. Click "Create Workflow" to start

**Workflow Creation**:
1. Dashboard → Workflows → "Create Workflow"
2. Describe workflow in plain English to Claude Code
3. Claude generates workflow JSON
4. Review and approve
5. Workflow saved to database
6. Can be triggered manually, scheduled, or via webhook

**Workflow Execution Flow**:
```
User clicks "Run" button
  ↓
API: POST /api/workflows/{id}/run
  ↓
Enqueued to BullMQ (Redis)
  ↓
Worker picks up job from queue
  ↓
executor.ts loads workflow config
  ↓
Credentials loaded and decrypted
  ↓
Steps executed (sequential or parallel)
  ↓
Results saved to database
  ↓
Real-time updates via Server-Sent Events
  ↓
UI displays formatted results
```

## Main Components

### Frontend Components

**components/automation/**
- Workflow builder and editor interface
- Step configuration forms
- Variable interpolation helpers

**components/workflow/**
- Workflow execution display
- Real-time progress tracking
- Output formatters (table, markdown, gallery, etc.)

**components/workflows/output-renderer/**
- Renders workflow results in various formats
- Table view for structured data
- Markdown for text content
- Gallery for images/videos
- JSON viewer for raw data

**components/credentials/**
- Credential management forms
- Platform-specific credential inputs
- Encrypted storage indicators

**components/clients/**
- Multi-tenant client management
- Organization switching UI
- Member invitation and role management

**components/dashboard/**
- Dashboard widgets and statistics
- Recent activity feed
- Workflow status cards

**components/ui/**
- Reusable primitives from shadcn/ui
- Buttons, dialogs, forms, tables, etc.
- Consistent design system

### Backend Components

**Workflow Execution Engine**
- `executor.ts`: Main orchestrator
- `parallel-executor.ts`: Automatic parallelization
- `control-flow.ts`: Step execution and variable interpolation
- `workflow-queue.ts`: BullMQ integration
- `workflow-scheduler.ts`: Cron scheduling

**Module System**
- 17 module categories (ai, social, business, etc.)
- 163 module files with 900+ functions
- Each module exports pure functions with:
  - Circuit breakers (graceful API failure handling)
  - Rate limiting (respects API limits)
  - Automatic retries (3 attempts with exponential backoff)
  - Structured logging (Pino)
  - Type safety (full TypeScript)

**Authentication System**
- NextAuth v5 with JWT strategy
- Credentials provider (email/password)
- Organization context in session
- Role-based access control (CASL)

**Database Layer**
- Drizzle ORM with type-safe queries
- PostgreSQL connection pooling
- Optimized indexes for performance
- Migration system via Drizzle Kit

## APIs and Endpoints

### Workflow Management
- `POST /api/workflows` - Create new workflow
- `GET /api/workflows` - List user's workflows
- `GET /api/workflows/{id}` - Get workflow details
- `PATCH /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow
- `POST /api/workflows/{id}/run` - Execute workflow manually
- `POST /api/workflows/{id}/webhook` - Webhook trigger endpoint
- `GET /api/workflows/{id}/runs` - Get execution history
- `GET /api/workflows/{id}/export` - Export workflow as JSON
- `POST /api/workflows/import` - Import workflow from JSON
- `GET /api/workflows/queue/stats` - Queue statistics

### Credential Management
- `GET /api/credentials` - List user's credentials
- `POST /api/credentials` - Add new credential
- `GET /api/credentials/{id}` - Get credential details
- `PUT /api/credentials/{id}` - Update credential
- `DELETE /api/credentials/{id}` - Delete credential

### Organization Management
- `GET /api/organizations` - List user's organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations/{id}` - Get organization details
- `PATCH /api/organizations/{id}` - Update organization
- `DELETE /api/organizations/{id}` - Delete organization
- `GET /api/organizations/{id}/members` - List members
- `POST /api/organizations/{id}/members` - Add member
- `DELETE /api/organizations/{id}/members/{userId}` - Remove member

### Client Management (Agency Use Case)
- `GET /api/clients` - List client organizations
- `POST /api/clients` - Create client organization
- `GET /api/clients/{id}` - Get client details
- `PATCH /api/clients/{id}` - Update client
- `DELETE /api/clients/{id}` - Delete client
- `GET /api/clients/{id}/members` - List client members

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (signin, signout, callback)
- OAuth callbacks for Twitter, YouTube, Google, Outlook

### Monitoring
- `GET /api/monitoring/capacity` - System capacity and queue stats
- `GET /api/system/status` - Health check
- `GET /api/services/status` - Service status (database, redis)

### Dashboard
- `GET /api/dashboard/stats` - User statistics and metrics

### Settings
- `POST /api/settings/model` - Update preferred AI model

## Database and Data Models

### Database Technology
- **Primary Database**: PostgreSQL 16
- **ORM**: Drizzle ORM (type-safe, auto-migrations)
- **Connection Pooling**: node-postgres Pool (30-100 connections)
- **Migrations**: Drizzle Kit with migration files in drizzle/

### Core Tables

**Users & Authentication**
- `users`: User accounts (id, email, password, name, created_at)
- `accounts`: OAuth accounts (provider, tokens, refresh tokens)
- `oauth_state`: Temporary OAuth state storage

**Multi-Tenancy**
- `organizations`: Organizations/workspaces (id, name, slug, owner_id, plan, status)
- `organization_members`: Member relationships (org_id, user_id, role, joined_at)
- `invitations`: Pending invitations (token, email, org_id, role, expires_at)

**Workflow System**
- `workflows`: Workflow definitions
  - id, user_id, organization_id
  - name, description, prompt (original user request)
  - config (JSON: steps, return value, output display)
  - trigger (JSON: type [cron/manual/webhook/chat], config)
  - status (draft/active/paused/archived)
  - organization_status (denormalized for performance)
  - last_run, last_run_status, last_run_error, last_run_output
  - run_count, created_at

- `workflow_runs`: Execution history
  - id, workflow_id, user_id, organization_id
  - status (running/completed/failed)
  - trigger_type, trigger_data
  - started_at, completed_at, duration
  - output, error, error_step

**Credentials**
- `credentials`: Encrypted API keys
  - id, user_id, organization_id
  - platform (e.g., "openai", "twitter")
  - encrypted_value (AES-256 encrypted)
  - created_at, updated_at

**System**
- `app_settings`: Application configuration (key-value pairs)
- `job_logs`: Background job execution logs

### Data Model Features

**Optimized Indexes**:
- Composite indexes for common queries (10-50× performance improvement)
- Example: workflows_user_org_status_idx on (user_id, organization_id, status)
- Unique indexes for email, slugs, tokens

**Denormalization for Performance**:
- `workflows.organization_status`: Avoids JOIN on every workflow execution
- `workflows.last_run_status`: Quick status overview without querying runs table

**JSONB Columns**:
- Flexible configuration storage
- `workflows.config`: Workflow steps and configuration
- `workflows.trigger`: Trigger configuration
- `workflows.last_run_output`: Latest execution result

**Encryption**:
- All credentials encrypted at rest with AES-256
- Encryption key stored in ENCRYPTION_KEY environment variable
- Never logged or exposed in API responses

## Common Commands

### Development
```bash
npm run dev                # Start Next.js dev server only
npm run dev:full          # Start Next.js + background worker
npm run worker            # Start worker only (dev mode)
npm run build             # Build for production
npm run start             # Start production server
npm run worker:prod       # Start worker (production mode)
```

### Database
```bash
npm run db:generate       # Generate migration files
npm run db:migrate        # Run migrations
npm run db:push           # Push schema to database
npm run db:push:force     # Force push (recreates tables)
npm run db:studio         # Open Drizzle Studio (database GUI)
npm run db:seed           # Seed admin account
```

### Docker
```bash
npm run docker:start      # Start PostgreSQL + Redis
npm run docker:stop       # Stop containers
npm run docker:logs       # View container logs
npm run docker:clean      # Remove containers and volumes
npm run docker:debug      # Start with debug tools (pgAdmin, Redis Commander)
```

### Code Quality
```bash
npm run lint              # Run ESLint
npm run typecheck         # Run TypeScript compiler check
npm test                  # Run Vitest tests
npm run test:ui           # Run tests with UI
npm run test:coverage     # Check test coverage
```

### Workflow Management
```bash
npm run delete-workflows  # Delete all workflows (with confirmation)
npm run validate          # Validate workflow JSON
npm run search            # Search modules with LLM
npm run list-agent-tools  # List available AI agent tools
npm run list-mcp-servers  # List MCP servers
```

### Documentation
```bash
npm run generate:registry # Generate module registry
npm run generate:openapi  # Generate OpenAPI spec
npm run generate:docs     # Generate TypeDoc documentation
```

### Deployment
```bash
npm run setup             # First-time setup (automated)
npm run railway:env       # Export Railway environment variables
npm run railway:sync      # Sync environment variables with Railway
```

### Custom Commands (via Claude Code)
```bash
/commit                   # Create git commit with AI-generated message
/workflow                 # Build workflow conversationally
/agent-builder            # Create AI agent workflow
/analyze_code             # Generate codebase analysis (this report!)
/fix                      # Run typecheck/lint and fix issues
```

## Additional Notes

### Architecture Highlights

**Automatic Parallelization**:
- Workflow engine analyzes step dependencies
- Independent steps execute concurrently (verified 3× speedup)
- No manual configuration required

**Production-Grade Reliability**:
- Circuit breakers prevent cascading failures
- Rate limiting respects API quotas (Twitter 300/15min, OpenAI 500/min, etc.)
- Automatic retries with exponential backoff (3 attempts)
- Structured logging for debugging

**Performance Optimizations**:
- Database connection pooling (30-100 connections)
- Denormalized fields avoid expensive JOINs
- Composite indexes for common queries
- Redis caching for hot data
- Module pre-loading eliminates cold starts

**Security**:
- AES-256 credential encryption
- Environment-based encryption key (never in code)
- NextAuth session management
- Role-based access control (RBAC)
- Organization-level data isolation

### Scalability

**Horizontal Scaling**:
- Separate worker processes from web servers
- Multiple workers can process queue concurrently
- Redis-backed BullMQ for distributed job processing

**Vertical Scaling**:
- Configurable database pool size (30-100 connections)
- Configurable worker concurrency (20-100 workflows)
- Tested up to 500 concurrent workflows without failures

**Stress Test Results** (from README):
- 157,480 workflows/min with 100 concurrent workflows
- 295,858 workflows/min with 500 concurrent workflows
- 100% success rate, <25ms P95 latency
- 36× faster than n8n on similar hardware

### Deployment Options

**Local Development**:
- Docker Compose for PostgreSQL + Redis
- Hot reload with Next.js Turbopack
- Built-in debugging tools

**Cloud Deployment**:
- **Railway**: One-click deploy with auto-provisioned database
- **Vercel**: Next.js optimized hosting
- **Self-hosted**: Any Node.js hosting (VPS, DigitalOcean, AWS, etc.)

**Requirements**:
- Node.js 20+
- PostgreSQL 16+ (or Railway-managed)
- Redis 7+ (or Upstash Redis)
- 2GB RAM minimum, 4GB recommended

### Extensibility

**Adding New Integrations**:
1. Create `src/modules/[category]/[service].ts`
2. Export typed functions with circuit breakers
3. Update `src/lib/workflows/module-registry.ts`
4. Add tests in `src/modules/[category]/__tests__/`
5. Submit PR

**Custom Slash Commands**:
- Create `.claude/commands/[command-name].md`
- Write prompt in markdown
- Use via `/command-name` in Claude Code

**Custom Skills**:
- Create `.claude/skills/[skill-name]/skill.md`
- Define skill capabilities
- Invoke via Skill tool in Claude Code

### Known Limitations

**Early Stage**:
- Some integrations need polish (noted in README)
- Claude Code sometimes generates workflows needing tweaking
- Not as plug-and-play as Zapier (yet)

**Excluded from TypeScript Compilation**:
- `src/modules/social/reddit.ts` - Type issues with snoowrap
- `src/modules/utilities/pdf.ts` - Native dependency conflicts
- Test templates and coverage scripts

**Dependencies**:
- Requires Docker for local development (PostgreSQL + Redis)
- Some modules have native dependencies (Discord.js, sharp, etc.)
- Platform API keys required for each integration

### Community & Support

- **GitHub Repository**: https://github.com/KenKaiii/b0t
- **Issues**: Report bugs and request features
- **Discussions**: Community support and Q&A
- **YouTube**: @kenkaidoesai (project creator)
- **License**: AGPL-3.0 (open source, self-hostable)

### Project Vision

b0t aims to fundamentally change how people think about automation:
- Describe intent, computer figures out implementation
- No visual editors or API documentation to memorize
- Infinitely extensible (every module is editable TypeScript)
- Production-ready infrastructure (not a weekend project)
- No vendor lock-in (export workflows as JSON, commit to git)

This is a living project under active development with a roadmap including:
- Workflow marketplace
- More integrations (Microsoft Suite, Monday.com, Google Analytics)
- Visual workflow editor (optional)
- Hosted cloud version
- Mobile app
- Workflow analytics
- Team collaboration features

---

**Report Generated**: 2025-11-14
**Codebase Version**: smarter-b0t (fork of KenKaiii/b0t)
**Total Lines Analyzed**: 119,240 lines of TypeScript/TSX
**Analysis Tool**: Claude Code /analyze_code command
