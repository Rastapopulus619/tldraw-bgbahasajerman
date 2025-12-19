# CLAUDE.md Structure Guide

**Purpose**: This guide explains the structure and function of CLAUDE.md files for AI-assisted development projects.

**What is CLAUDE.md?**
CLAUDE.md serves as the "quick start guide" for AI agents (like Claude Code) when they join your coding session. It provides essential context about your project so the AI can help effectively without hallucinating or making incorrect assumptions.

**Philosophy**: "What does an AI agent need to know to start coding RIGHT NOW?"

---

## File overview

**Location**: Project root (`/CLAUDE.md`)

**Audience**:
- Primary: AI agents (Claude Code, Cursor, etc.)
- Secondary: Human developers (quick project orientation)

**Relationship to other docs**:
- CLAUDE.md = Quick reference (250-600 lines)
- MASTER_REFACTORING_LOG.md = Complete history and technical details (unlimited size)
- README.md = User-facing project documentation

---

## Section-by-section guide

### 1. Project description (First section)

**Format**:
```markdown
## Project: [Project name and one-line description]

[2-3 sentence overview of what this project does and key technologies]

**Documentation structure**:
- **This file (CLAUDE.md)**: Quick start, current status, navigation
- **MASTER_REFACTORING_LOG.md**: Complete project history, technical specs, API reference
- **[Other key docs]**: [Purpose]
```

**Function**:
- Orients AI to project domain and tech stack
- Clarifies documentation hierarchy

**When to update**:
- Project scope changes
- Key technologies change
- New major documentation files added

**Example use cases**:

**0-to-1 startup project**:
```markdown
## Project: TaskFlow - AI-powered task management app

A React + FastAPI task management application with AI-driven prioritization.
Users can create tasks, and the AI suggests optimal scheduling based on deadlines and dependencies.

**Documentation structure**:
- **This file (CLAUDE.md)**: Quick start, current status, navigation
- **API_DOCS.md**: FastAPI endpoint specifications
- **ARCHITECTURE.md**: System design and data flow
```

**Existing mature project**:
```markdown
## Project: tldraw custom whiteboard application

This is a customized fork of the tldraw monorepo - an infinite canvas SDK for React applications.
The main development focus is a custom whiteboard application with advanced file management and color customization capabilities.
```

---

### 2. Current phase

**Format**:
```markdown
## Current phase

**Status**: [One-line: what was just done + what's next]
**Branch**: `feature/branch-name`
**Recent work**: [1-2 sentences about this session's accomplishments]
**Immediate priority**: [Next most important task]
```

**Function**:
- Shows AI the current state of development
- Provides context for what to work on next
- Updated after EVERY coding session

**When to update**:
- After every coding session (by packawaytime agent)
- When switching focus areas
- When completing major milestones

**Example use cases**:

**Early development**:
```markdown
**Status**: Initial project setup complete - Next: Implement user authentication
**Branch**: `feature/auth-setup`
**Recent work**: Configured FastAPI backend with PostgreSQL database, set up project structure
**Immediate priority**: Implement JWT authentication and user registration endpoint
```

**Bug fixing phase**:
```markdown
**Status**: Fixed critical login bug - Next: Deploy hotfix to production
**Branch**: `hotfix/login-redirect`
**Recent work**: Resolved infinite redirect loop in OAuth callback handler
**Immediate priority**: Test fix in staging, then deploy to production
```

**Feature development**:
```markdown
**Status**: Task prioritization algorithm implemented - Next: Build frontend UI
**Branch**: `feature/ai-prioritization`
**Recent work**: Implemented ML model for task priority scoring based on deadlines and dependencies
**Immediate priority**: Create React component for displaying AI-suggested task order
```

---

### 3. Quick start

**Format**:
```markdown
## Quick start

### Running the application

[Step-by-step instructions to get app running]

### Essential commands reference

**Development**: [commands]
**Testing**: [commands]
**Build**: [commands]
```

**Function**:
- Tells AI how to run the project
- Lists critical commands
- Updated when setup changes

**When to update**:
- New dependencies added (package.json changes)
- Environment setup changes
- New development servers needed
- Build process changes

**Example use cases**:

**Simple single-server app**:
```markdown
## Quick start

### Running the application

```bash
npm install
npm run dev  # Runs on http://localhost:3000
```

### Essential commands

**Development**: `npm run dev`, `npm run lint`
**Testing**: `npm test`, `npm run test:watch`
**Build**: `npm run build`
```

**Multi-service architecture**:
```markdown
## Quick start

### Running the application

The app requires three services running simultaneously:

```bash
# Terminal 1: Frontend (React)
cd frontend
npm install
npm run dev  # Port 3000

# Terminal 2: Backend API (FastAPI)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload  # Port 8000

# Terminal 3: Redis cache
redis-server  # Port 6379
```

### Environment setup

Copy `.env.example` to `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Random secret for token signing

### Essential commands

**Development**: `npm run dev`, `uvicorn main:app --reload`
**Testing**: `npm test` (frontend), `pytest` (backend)
**Database**: `alembic upgrade head` (migrations)
```

---

### 4. Repository overview

**Format**:
```markdown
## Repository overview

**Base**: [Framework/starter template used]
**Organization**: [Monorepo/single package/microservices/etc.]
**Main development location**: [Where most code lives]

[Optional: Important notes about structure]
```

**Function**:
- Explains project organization
- Helps AI navigate codebase
- Highlights unconventional structures

**When to update**:
- New packages/modules created
- Directory restructure
- Migration to monorepo (or vice versa)

**Example use cases**:

**Simple single-package app**:
```markdown
## Repository overview

**Base**: Create React App with TypeScript
**Organization**: Single package application
**Main development location**: `src/` directory

Standard CRA structure with components in `src/components/`, hooks in `src/hooks/`.
```

**Monorepo**:
```markdown
## Repository overview

**Base**: Yarn workspaces monorepo
**Organization**:
- `packages/ui` - Shared React component library
- `packages/api` - FastAPI backend
- `packages/shared` - TypeScript types shared across frontend/backend
- `apps/web` - Main web application
- `apps/admin` - Admin dashboard

**Main development location**: `apps/web/` for features, `packages/ui/` for reusable components
```

**Microservices**:
```markdown
## Repository overview

**Base**: Docker Compose orchestrated microservices
**Organization**:
- `services/auth` - Authentication service (Node.js)
- `services/tasks` - Task management service (Python)
- `services/notifications` - Email/SMS service (Go)
- `gateway/` - API gateway (nginx)

Each service is independently deployable with its own database.
```

---

### 5. Key files and locations

**Format**:
```markdown
## Key files and locations

**[Category]**:
- `path/to/file.ts` - [What this file does]
- `path/to/directory/` - [What this directory contains]

**[Another category]**:
- ...
```

**Function**:
- Helps AI quickly locate important files
- Saves time searching for where to make changes
- Documents non-obvious file purposes

**When to update**:
- New critical files created
- File organization changes
- Files moved/renamed

**Example use cases**:

**Small React app**:
```markdown
## Key files and locations

**Core application**:
- `src/App.tsx` - Root component, routing setup
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/api/client.ts` - Axios instance with interceptors

**Configuration**:
- `.env` - Environment variables (not in git)
- `vite.config.ts` - Build configuration
```

**Backend API**:
```markdown
## Key files and locations

**API**:
- `app/main.py` - FastAPI app initialization, middleware
- `app/routers/` - API route handlers
- `app/models/` - SQLAlchemy database models
- `app/schemas/` - Pydantic request/response schemas

**Database**:
- `alembic/versions/` - Database migrations
- `app/database.py` - Database connection and session management

**Configuration**:
- `app/config.py` - Settings loaded from environment variables
```

**Complex custom project**:
```markdown
## Key files and locations

**Custom application core**:
- `templates/vite/src/components/AppContainer.tsx` - Root component managing sidebar and canvas state
- `templates/vite/src/components/Sidebar/` - File tree UI components
- `templates/vite/src/hooks/` - Custom hooks (useWhiteboardLoader, useAutoSave, useKeyboardShortcuts)

**Backend**:
- `templates/vite/server/index.js` - Express API server
- `templates/vite/server/routes/` - API route handlers
- `templates/vite/server/utils/` - File system and validation utilities

**Configuration and data**:
- `templates/vite/config/` - Color palette configuration files
- `userdata/whiteboards/` - Stored whiteboard files (.tldr format)
```

---

### 6. Decisions made

**Format**:
```markdown
## Decisions made

**[Category]**:
- **[Decision name]**: [Brief explanation and rationale]

**[Another category]**:
- **[Decision name]**: [Brief explanation and rationale]
```

**Function**:
- Records architectural choices
- Prevents AI from suggesting already-rejected approaches
- Provides "why" context for code patterns
- Keep last 5-7 major decisions (full history in MASTER_REFACTORING_LOG.md)

**When to update**:
- Architectural decisions made
- Technology choices finalized
- Design patterns chosen
- After every session with significant choices (by packawaytime agent)

**Example use cases**:

**Technology decisions**:
```markdown
## Decisions made

**State management**:
- **Use Zustand instead of Redux**: Simpler API, less boilerplate, sufficient for our app size. Rejected Redux (overkill), Context (performance issues with frequent updates).

**Database**:
- **PostgreSQL over MongoDB**: Need relational data (users, tasks, dependencies). ACID guarantees important for task scheduling. Rejected MongoDB (no joins, eventual consistency issues).

**Authentication**:
- **JWT tokens with refresh tokens**: Stateless auth, scales horizontally. Refresh tokens in httpOnly cookies prevent XSS. Rejected sessions (requires sticky sessions/shared store).
```

**Architecture patterns**:
```markdown
## Decisions made

**Component structure**:
- **Wrapper pattern for Sidebar + Canvas**: Sidebar and Tldraw exist as independent sibling components within AppContainer (not parent-child) to maintain separation of concerns and independent state management.

**Store lifecycle**:
- **Create new store on each whiteboard load**: Dispose old store to prevent memory leaks when switching between boards. Rejected reusing store (accumulates stale data).
```

**API design**:
```markdown
## Decisions made

**API route pattern**:
- **Query parameters instead of path parameters**: Using `?id=path` instead of `/:id` due to Express 5 wildcard limitation. Path parameters don't capture slashes in nested file paths like `folder/board.tldr`.

**Error handling**:
- **Problem Details (RFC 7807) format**: Consistent error responses with type, title, status, detail. Better DX than custom formats.
```

---

### 7. Features / Custom implementations

**Format**:
```markdown
## Features

### [Feature name]

- [Key capability 1]
- [Key capability 2]
- [Technical implementation note if relevant]

### [Another feature]

- ...
```

**Function**:
- Lists what the project can do
- Helps AI understand capabilities when adding related features
- Documents custom implementations vs standard patterns

**When to update**:
- New features implemented
- Existing features significantly enhanced
- Features removed

**Example use cases**:

**User-facing features**:
```markdown
## Features

### User authentication

- Email/password registration with email verification
- OAuth login (Google, GitHub)
- JWT-based sessions with automatic refresh
- Password reset via email

### Task management

- Create, edit, delete tasks
- Task dependencies (blocking relationships)
- Due date tracking with notifications
- AI-powered priority suggestions based on deadlines and dependencies
```

**Developer-facing features**:
```markdown
## Features

### Extended color palette system

- 28 colors (vs standard 13) with position-based naming: `color1_R1C1` through `color28_R7C4`
- Custom HSL color picker modal with auto-generation of light/dark variants
- File-based persistence via Express API endpoints
- Color palette embedded in `.tldr` file metadata

### Custom sidebar with file management

- VS Code-style collapsible sidebar with file tree navigation
- File operations: rename (F2), delete, copy/paste (Ctrl+C/V), drag-and-drop
- Keyboard shortcuts: Ctrl+B (toggle sidebar), Ctrl+Shift+E (toggle focus), Arrow keys (navigation)
- Protected `welcome.tldr` file (cannot be deleted or renamed)
```

---

### 8. Known issues and next steps

**Format**:
```markdown
## Known issues and next steps

**🚨 IMMEDIATE NEXT STEP**: [Top priority task]

**Top current blockers**:
1. [Blocker 1]
2. [Blocker 2]
3. [Blocker 3]

**Complete details**: See `MASTER_REFACTORING_LOG.md` Section X
```

**Function**:
- Shows AI what's broken or needs attention
- Prioritizes next work
- Prevents AI from working on non-issues

**When to update**:
- After every session (by packawaytime agent)
- When bugs discovered
- When blockers resolved
- When priorities shift

**Example use cases**:

**Active development**:
```markdown
## Known issues and next steps

**🚨 IMMEDIATE NEXT STEP**: Implement email verification for new user signups

**Top current blockers**:
1. Email service not configured (need SendGrid API key)
2. No tests for authentication flow yet
3. Password reset endpoint returns 500 error on invalid email
```

**Bug fixing mode**:
```markdown
## Known issues and next steps

**🚨 IMMEDIATE NEXT STEP**: Fix critical production bug - users can't log in with OAuth

**Top current blockers**:
1. OAuth redirect URL mismatch in production (works in dev)
2. Need to update callback URL in Google Cloud Console
3. Session cookies not persisting across OAuth flow
```

**Polishing phase**:
```markdown
## Known issues and next steps

**🚨 IMMEDIATE NEXT STEP**: Add loading states to all async operations

**Top current blockers**:
1. No visual feedback during task creation (users click multiple times)
2. Task list doesn't show loading spinner on initial fetch
3. Need error boundaries for React component errors
```

---

### 9. Essential commands

**Format**:
```markdown
## Essential commands

### [Category]

- `command` - [What it does]
- `command --flag` - [What it does]

### [Another category]

- ...
```

**Function**:
- Quick reference for common tasks
- Helps AI run correct commands
- Documents non-obvious command usage

**When to update**:
- New npm/yarn scripts added
- Build process changes
- New CLI tools added
- Testing commands change

**Example use cases**:

**Frontend app**:
```markdown
## Essential commands

### Development

- `npm run dev` - Start dev server on http://localhost:3000
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Testing

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

### Build

- `npm run build` - Production build
- `npm run preview` - Preview production build locally
```

**Monorepo**:
```markdown
## Essential commands

### Development

- `yarn dev` - Start all workspaces in dev mode
- `yarn workspace @app/web dev` - Start only web app
- `yarn workspace @app/api dev` - Start only API server

### Code quality

- `yarn typecheck` - Type check all packages (NEVER use bare `tsc`)
- `yarn lint` - Lint all packages
- `yarn test` - Run all tests (slow, avoid unless necessary)

### Building

- `yarn build` - Build all packages
- `yarn workspace @app/web build` - Build only web app
```

---

### 10. Architecture overview

**Format**:
```markdown
## Architecture overview

**High-level summary**: [1-2 sentences about architecture]

**[Key pattern/component]**: [Brief explanation]

**Complete details**: [Link to detailed docs]
```

**Function**:
- Explains how the system is structured
- Documents key patterns
- Links to detailed architecture docs

**When to update**:
- Architectural patterns change
- New layers/modules introduced
- Data flow significantly modified

**Example use cases**:

**Simple app**:
```markdown
## Architecture overview

**High-level summary**: Standard React SPA with FastAPI backend and PostgreSQL database.

**Frontend**: React components with Zustand for state management, React Router for routing.

**Backend**: FastAPI with SQLAlchemy ORM, Alembic for migrations. RESTful API with JWT authentication.

**Database**: PostgreSQL with normalized schema. Users, tasks, and dependencies tables.
```

**Complex system**:
```markdown
## Architecture overview

**High-level summary**: Microservices architecture with event-driven communication and CQRS pattern.

**Event bus**: RabbitMQ for async communication between services. Each service publishes domain events.

**CQRS**: Write operations go to PostgreSQL (normalized), read operations from MongoDB (denormalized views).

**API Gateway**: Kong handles routing, rate limiting, and authentication. Services are not directly exposed.

**Complete details**: See `docs/ARCHITECTURE.md` for sequence diagrams and service boundaries.
```

---

### 11. Writing style guidelines

**Format**:
```markdown
## Writing style guidelines

**[Guideline name]**

- [Rule 1]
- Examples: ✅ Good / ❌ Bad
- Exception: [When rule doesn't apply]
- Applies to: [Where this rule matters]
```

**Function**:
- Ensures consistency in code, comments, and documentation
- Helps AI follow project conventions
- Documents style choices not enforced by linters

**When to update**:
- Style guidelines added/changed
- New conventions adopted
- Rarely changes after initial setup

**Example use cases**:

**Documentation style**:
```markdown
## Writing style guidelines

**Sentence case for titles and headings**

- Always use sentence case for titles, headings, and labels (NOT Title Case)
- Examples:
  - ✅ "Database configuration"
  - ❌ "Database Configuration"
  - ✅ "Real-time updates"
  - ❌ "Real-Time Updates"
- Exception: Proper nouns, acronyms, and class/component names remain capitalized
  - ✅ "PostgreSQL database"
  - ✅ "WebSocket connections"
  - ✅ "NodeShapeUtil implementation"
- Applies to:
  - Markdown headers (##, ###, etc.)
  - Documentation titles
  - Code comments describing features
```

**Code conventions**:
```markdown
## Writing style guidelines

**Named exports over default exports**

- Always use named exports, never default exports
- Reasoning: Better IDE autocomplete, easier refactoring, explicit imports
- Examples:
  - ✅ `export function Button() { ... }`
  - ❌ `export default function Button() { ... }`
- Exception: Next.js page components (framework requirement)

**Async/await over Promise chains**

- Use async/await syntax, not .then() chains
- Examples:
  - ✅ `const data = await fetchUser(id)`
  - ❌ `fetchUser(id).then(data => ...)`
- Exception: When you need Promise.all() for parallel operations
```

---

### 12. important-instruction-reminders

**Format**:
```markdown
# important-instruction-reminders

[Core rules that must ALWAYS be followed]
[Critical constraints]
[Project-specific commandments]
```

**Function**:
- Critical rules that must never be violated
- Often related to file creation, editing patterns, etc.
- Helps AI avoid common mistakes

**When to update**:
- Core project rules established
- Rarely changes after initial setup

**Example use cases**:

**File management**:
```markdown
# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
```

**Code generation**:
```markdown
# important-instruction-reminders

NEVER generate database migrations manually - always use `alembic revision --autogenerate`.
NEVER commit directly to main branch - always create feature branch.
ALWAYS run `yarn typecheck` before committing - never bypass type errors.
DO NOT modify files in `generated/` directory - these are auto-generated.
```

---

### 13. IDE and development conventions

**Format**:
```markdown
# IDE and development conventions

**[IDE name]**: [IDE-specific notes]

**[Another IDE/tool]**: [Notes]

[General development workflow notes]
```

**Function**:
- Documents IDE-specific configurations
- Project-specific development workflows
- References to style guides or example files

**When to update**:
- New IDE configurations added
- Recommended extensions change
- Linter/formatter settings updated

**Example use cases**:

**IDE setup**:
```markdown
# IDE and development conventions

**VSCode**: Install recommended extensions (ESLint, Prettier, Tailwind CSS IntelliSense). Settings are in `.vscode/settings.json`.

**Cursor**: Use `.cursorrules` file for AI code generation guidelines.

**JetBrains IDEs**: Import code style from `.idea/codeStyles/Project.xml`.
```

**Project conventions**:
```markdown
# IDE and development conventions

**Cursor IDE**: When writing examples, be sure to read the `./apps/examples/writing-examples.md` file for proper example patterns and conventions.

**General workflow**:
- Always create feature branch from `main`
- Run `npm test` before pushing
- Use conventional commits: `feat:`, `fix:`, `docs:`, etc.
- PRs require at least one approval before merging
```

---

### 14. Reference documents

**Format**:
```markdown
## Reference documents

**[Category]**:
- `filename.md` - [What this document covers]

**[Another category]**:
- [External link] - [What resource]
```

**Function**:
- Links to detailed documentation
- Points to related resources
- Helps AI find comprehensive information

**When to update**:
- New documentation files created
- Documentation reorganized
- External resources added

**Example use cases**:

**Internal docs**:
```markdown
## Reference documents

**API documentation**:
- `API_REFERENCE.md` - Complete REST API endpoint specifications
- `WEBHOOKS.md` - Webhook event types and payload formats

**Development guides**:
- `CONTRIBUTING.md` - How to contribute, PR guidelines
- `TESTING.md` - Testing strategy and how to write tests
- `DEPLOYMENT.md` - How to deploy to staging/production

**Architecture**:
- `ARCHITECTURE.md` - System design, service boundaries, data flow diagrams
```

**External resources**:
```markdown
## Reference documents

**Frameworks**:
- [React Documentation](https://react.dev) - Official React docs
- [FastAPI Docs](https://fastapi.tiangolo.com) - FastAPI framework guide

**Libraries**:
- [Zustand GitHub](https://github.com/pmndrs/zustand) - State management library
- [TanStack Query](https://tanstack.com/query/latest) - Data fetching and caching
```

---

## Tips for maintaining CLAUDE.md

### 1. Keep it concise

- Target: 250-600 lines
- If sections grow too large, move details to MASTER_REFACTORING_LOG.md
- Link to detailed docs rather than duplicating

### 2. Update after every session

- Use the packawaytime agent to automate updates
- Keep "Current phase" always fresh
- Remove outdated blockers from "Known issues"

### 3. Write for AI agents

- Be explicit, not clever
- Use consistent section names
- Include code examples when helpful
- Avoid ambiguity

### 4. Use sentence case

- "Quick start" not "Quick Start"
- "Known issues" not "Known Issues"
- Exception: Proper nouns (React, PostgreSQL)

### 5. Make it project-agnostic

- Section names should work for any project
- Content is project-specific (that's fine)
- Labels like "**VSCode**:" make multi-project sections clear

---

## Template for new projects

```markdown
# CLAUDE.md

**Purpose**: AI agent quick reference for [your project]
**Audience**: Claude Code and other AI assistants
**Philosophy**: "What do I need to know to start coding RIGHT NOW?"

## Project: [Name] - [One-line description]

[2-3 sentence overview]

**Documentation structure**:
- **This file (CLAUDE.md)**: Quick start, current status, navigation
- **[Other key docs]**: [Purpose]

## Current phase

**Status**: [Current state + next]
**Branch**: `main`
**Recent work**: [What was just done]
**Immediate priority**: [What's next]

## Quick start

### Running the application

```bash
# Commands to run the app
```

### Essential commands reference

**Development**:
**Testing**:
**Build**:

## Repository overview

**Base**: [Framework/starter]
**Organization**: [Structure]
**Main development location**: [Where code lives]

## Key files and locations

**Core**:
- `path/to/file` - Description

## Decisions made

**Category**:
- **Decision**: Rationale

## Features

### Feature name

- What it does
- Key capabilities

## Known issues and next steps

**🚨 IMMEDIATE NEXT STEP**:

**Top current blockers**:
1.
2.
3.

## Essential commands

### Development

- `command` - Description

## Architecture overview

**High-level summary**:

## Writing style guidelines

[If applicable]

# important-instruction-reminders

[Critical rules]

# IDE and development conventions

**[IDE]**: [Notes]

## Reference documents

**Category**:
- `file.md` - Description
```

---

## Conclusion

CLAUDE.md is a living document that evolves with your project. Start simple, add sections as needed, and keep it updated after each coding session. The packawaytime agent automates most updates, but you may occasionally need to restructure sections as your project grows.

**Remember**: This file serves AI agents first, humans second. Write clearly, explicitly, and consistently.
