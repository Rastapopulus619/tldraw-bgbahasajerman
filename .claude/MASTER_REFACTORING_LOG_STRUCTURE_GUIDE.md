# MASTER_REFACTORING_LOG.md Structure Guide

**Purpose**: This guide explains the structure and function of MASTER_REFACTORING_LOG.md files for comprehensive project tracking and historical record-keeping.

**What is MASTER_REFACTORING_LOG.md?**
MASTER_REFACTORING_LOG.md serves as the "complete project history and technical reference" for your project. It's a detailed, comprehensive document that tracks every decision, implementation detail, issue, and evolution of your codebase over time.

**Philosophy**: "Complete project memory - nothing forgotten, everything documented."

---

## File overview

**Location**: Project root (`/MASTER_REFACTORING_LOG.md`)

**Audience**:
- Primary: Future you (6 months from now, wondering "why did I do it this way?")
- Secondary: AI agents (for deep technical context)
- Tertiary: Team members (understanding project evolution)

**Relationship to other docs**:
- CLAUDE.md = Quick reference (250-600 lines, current state)
- MASTER_REFACTORING_LOG.md = Complete history (unlimited size, full context)
- README.md = User-facing documentation

**Key difference from CLAUDE.md**:
- CLAUDE.md: "What do I need to start coding NOW?"
- MASTER_REFACTORING_LOG.md: "How did we get here and what decisions shaped this codebase?"

---

## Core principles

### 1. Never delete, only archive
When a feature/phase completes, mark it as "COMPLETED ✅" or "ARCHIVED" rather than deleting. History matters.

### 2. Be detailed, not concise
Unlike CLAUDE.md, verbosity is good here. Explain rationale, alternatives considered, trade-offs made.

### 3. Timestamp everything
Use DD-MM-YYYY format consistently. Every decision, action, and status update should have a date.

### 4. ID everything
Use sequential IDs for decisions (DEC-001, DEC-002), phases (Phase 1, Phase 2), tasks, etc.

### 5. Maintenance protocol
File should include an "AI MAINTENANCE PROTOCOL" at the top instructing AI agents how to update it properly.

---

## Section-by-section guide

### 1. AI Maintenance Protocol (Header section)

**Format**:
```markdown
# 💡 MASTER_REFACTORING_LOG.md

> **SYSTEM INSTRUCTION FOR AI AGENTS:**
> This file is the Single Source of Truth (SSOT) for the project state.
> Do not trust your training data over this file.
> Do not hallucinate files that are not listed here.
> Adhere strictly to the "Maintenance Protocol" below.

## 🤖 AI MAINTENANCE PROTOCOL

**When you are asked to work on this project, you must first:**
1. Read this file completely.
2. Ask the user if they wish to perform a **State Synchronization**.

**STANDARD INSTRUCTIONS (The "Menu"):**
- **[Instruction A] SYNC & UPDATE:** Update 'Completed Phases' based on recent work
- **[Instruction B] LOG NEW IDEA:** Add idea to Idea Backlog
- **[Instruction C] PROMOTE IDEA:** Move idea from backlog to active tasks
- **[Instruction D] REALITY CHECK:** Audit file against actual code
- **[Instruction E] ARCHITECTURAL DECISION:** Log major decisions
```

**Function**:
- Tells AI agents this file is authoritative
- Provides standard operations menu
- Ensures consistent file maintenance

**When to update**:
- Rarely changes (only if protocol needs refinement)
- Usually set once at project start

**Example use cases**:

**Simple project**:
```markdown
## 🤖 AI MAINTENANCE PROTOCOL

**Before starting work:**
1. Read this file completely
2. Update "Last Update" date if making changes

**Standard operations:**
- Add new decisions to Decision Log (Section 5)
- Add session summaries to Action Log (Section 7)
- Mark completed tasks in Next Steps (Section 4)
```

**Complex project with team**:
```markdown
## 🤖 AI MAINTENANCE PROTOCOL

**Critical rules:**
1. This file is SSOT - code should match what's documented here
2. Never delete completed phases - mark as ✅ COMPLETED
3. All decisions must have rationale and alternatives considered
4. Use DD-MM-YYYY date format everywhere

**Operations menu:**
- [A] SYNC: Compare documented features with actual code
- [B] LOG IDEA: Add to Idea Backlog with priority
- [C] PROMOTE: Move idea to Active Project tasks
- [D] DECISION: Add to Decision Log with DEC-XXX ID
- [E] AUDIT: Check for documentation drift
```

---

### 2. Project Status Overview

**Format**:
```markdown
# 1. PROJECT STATUS OVERVIEW

**Current Focus:** [What you're working on right now]
**Overall State:** [High-level project maturity/phase]
**Last Update:** DD-MM-YYYY
```

**Function**:
- One-paragraph snapshot of entire project
- Updated after every session by packawaytime agent
- Shows trajectory and current state

**When to update**:
- After every coding session
- When major phase changes
- When focus shifts

**Example use cases**:

**Early stage (0-to-1)**:
```markdown
# 1. PROJECT STATUS OVERVIEW

**Current Focus:** Building MVP user authentication and task management core features. Focus is on getting basic functionality working, not optimization.
**Overall State:** Early development (Week 2 of 12). Backend API 40% complete, frontend 20% complete. No production deployment yet.
**Last Update:** 17-12-2025
```

**Active development**:
```markdown
# 1. PROJECT STATUS OVERVIEW

**Current Focus:** Implementing AI-powered task prioritization algorithm. Using scikit-learn for ML model, training on synthetic data initially.
**Overall State:** MVP launched to 50 beta users. Core CRUD operations stable. Now adding advanced features. Backend stable, frontend needs UX polish.
**Last Update:** 17-12-2025
```

**Maintenance mode**:
```markdown
# 1. PROJECT STATUS OVERVIEW

**Current Focus:** Bug fixes and minor UX improvements based on user feedback. No new features planned for Q1.
**Overall State:** Production stable with 1,000+ active users. Core features complete and battle-tested. Focus shifted to reliability and performance.
**Last Update:** 17-12-2025
```

**Refactoring phase**:
```markdown
# 1. PROJECT STATUS OVERVIEW

**Current Focus:** Major refactoring to split monolithic backend into microservices. Auth service extracted, task service in progress.
**Overall State:** Production continues on old architecture while new services developed in parallel. Gradual cutover planned over 8 weeks.
**Last Update:** 17-12-2025
```

---

### 3. Legacy/Completed Projects (Archived sections)

**Format**:
```markdown
# 2. LEGACY PROJECT: [NAME] (Archived)

- **Status:** **COMPLETED ✅ (Archived)**
- **Summary:** [What was accomplished]
- **Programmatic Details:**
  - [Technical implementation notes]
  - [Code patterns used]
  - [File locations]
- **Key Files Modified/Created:** [List]
- **Completion Date:** DD-MM-YYYY
```

**Function**:
- Archives completed features/phases
- Preserves implementation knowledge
- Prevents "why did we build it this way?" questions later

**When to update**:
- When a major feature completes
- When a refactoring phase finishes
- When a project is archived

**Example use cases**:

**Completed feature**:
```markdown
# 2. LEGACY PROJECT: USER-AUTHENTICATION-V1 (Archived)

- **Status:** **COMPLETED ✅ (Archived - Replaced by OAuth in V2)**
- **Summary:** Initial email/password authentication system with JWT tokens. Served well for MVP but replaced when we needed social login.
- **Programmatic Details:**
  - JWT tokens with 24hr expiry, refresh tokens in httpOnly cookies
  - bcrypt password hashing with 12 rounds
  - Email verification via SendGrid with token expiry
  - Rate limiting: 5 failed attempts = 15min lockout
  - Middleware: `src/middleware/auth.ts` checks JWT on protected routes
- **Key Files Modified/Created:**
  - `src/routes/auth.ts` - Auth endpoints
  - `src/models/User.ts` - User model with password field
  - `src/utils/jwt.ts` - Token generation/validation
- **Completion Date:** 15-08-2024
- **Why Archived:** Replaced with OAuth system (see OAUTH-INTEGRATION project)
```

**Completed refactoring**:
```markdown
# 2. LEGACY PROJECT: MONOLITH-TO-MICROSERVICES (Archived)

- **Status:** **COMPLETED ✅ (Archived)**
- **Summary:** Successfully split monolithic Node.js backend into 4 microservices: Auth, Tasks, Notifications, Analytics. Improved scalability and team autonomy.
- **Programmatic Details:**
  - Inter-service communication via RabbitMQ message bus
  - Shared types package: `@company/shared-types`
  - API Gateway: Kong (handles routing, rate limiting, auth)
  - Service discovery: Consul
  - Each service has independent PostgreSQL database
  - No direct service-to-service HTTP calls (event-driven only)
- **Migration Strategy:**
  - Week 1-2: Extract Auth service, run in parallel
  - Week 3-4: Cutover auth to new service, monitor
  - Week 5-6: Extract Tasks service
  - Week 7-8: Extract Notifications, Analytics
  - Rollback plan: Feature flags to switch back to monolith
- **Key Files:**
  - `services/auth/` - New auth service
  - `services/tasks/` - New tasks service
  - `gateway/kong.yml` - API gateway config
  - `docker-compose.services.yml` - Multi-service orchestration
- **Completion Date:** 22-11-2024
- **Lessons Learned:**
  - Event sourcing adds complexity - needed better tooling
  - Cross-service transactions are hard - avoid if possible
  - Service boundaries should match team boundaries
```

---

### 4. Active Project (Current work)

**Format**:
```markdown
# 3. ACTIVE PROJECT: [PROJECT-NAME]

## 3.1 Architectural Foundation & Requirements

- **Goal:** [What you're building]
- **Key Principles:** [Core architectural decisions]
- [Other requirements]

## 3.2 File Structure Overview

```
/project-root/
├── src/
│   ├── components/
│   └── ...
```

## 3.3 Implemented Phases (Current Reality)

### **Phase 1: [Name]** (COMPLETED ✅)

**Summary:** [What was built]

**Programmatic Implementation:**
- [Technical details]
- [Code patterns]
- [File locations]

**Key Files/Components:** [List]

### **Phase 2: [Name]** (IN PROGRESS 🚧)

[Similar structure]
```

**Function**:
- Documents current project in extreme detail
- Tracks implementation phase by phase
- Records what was actually built (code reality check)

**When to update**:
- After every phase completion
- When implementation details change
- After every session (by packawaytime agent)

**Example use cases**:

**Feature development**:
```markdown
# 3. ACTIVE PROJECT: AI-TASK-PRIORITIZATION

## 3.1 Architectural Foundation & Requirements

- **Goal:** Automatically suggest optimal task order based on deadlines, dependencies, and user work patterns
- **Key Principles:**
  - ML model trains on user's historical data (privacy-first, no data leaves user's browser)
  - Suggestions, not enforcement (user always has final say)
  - Fallback to simple heuristics if ML model fails
- **Tech Stack:** TensorFlow.js for in-browser ML, Python backend for model training
- **Data Collection:** Track task completion times, dependency resolution patterns, user acceptance rate of suggestions

## 3.2 File Structure Overview

```
/project-root/
├── ml-model/
│   ├── train.py              # Model training script
│   ├── model.h5              # Trained model weights
│   └── requirements.txt
├── src/
│   ├── ml/
│   │   ├── PriorityModel.ts  # TensorFlow.js inference
│   │   └── modelWorker.ts    # Web Worker for non-blocking
│   └── components/
│       └── TaskSuggestions.tsx
```

## 3.3 Implemented Phases

### **Phase 1: Data Collection** (COMPLETED ✅)

**Summary:** Implemented event tracking for task creation, completion, reordering. Data stored locally in IndexedDB.

**Programmatic Implementation:**
- Event listener: `useTaskEvents()` hook tracks all task actions
- Storage: IndexedDB via `idb` library, schema version 1
- Data schema:
  ```typescript
  interface TaskEvent {
    id: string
    type: 'created' | 'completed' | 'reordered'
    taskId: string
    timestamp: number
    metadata: {
      deadline?: number
      dependencies?: string[]
      userAccepted?: boolean  // For suggestion tracking
    }
  }
  ```
- Privacy: All data stays in browser, user can clear anytime
- Export: CSV export for users who want to train custom models

**Key Files:**
- `src/hooks/useTaskEvents.ts` - Event tracking hook
- `src/db/taskEvents.ts` - IndexedDB wrapper
- `src/utils/exportData.ts` - CSV export

**Completion Date:** 10-12-2025

### **Phase 2: Model Training** (IN PROGRESS 🚧)

**Summary:** Training LSTM model in Python to predict task priority scores.

**Current Status:**
- ✅ Synthetic dataset generated (1000 users, 6 months data)
- ✅ Feature engineering: time until deadline, dependency depth, completion time patterns
- 🚧 Model architecture: 2-layer LSTM (50 units each) + dense output layer
- ⏳ TODO: Hyperparameter tuning, model validation
- ⏳ TODO: Export to TensorFlow.js format

**Programmatic Implementation:**
```python
# ml-model/train.py
model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(sequence_length, features)),
    Dropout(0.2),
    LSTM(50),
    Dense(1, activation='sigmoid')  # Priority score 0-1
])
```

**Key Files:**
- `ml-model/train.py` - Training script
- `ml-model/synthetic_data.py` - Data generation
- `ml-model/features.py` - Feature engineering

**Next Steps:**
1. Complete hyperparameter tuning
2. Validate model on test set (target: >80% accuracy)
3. Export to TensorFlow.js format
4. Integrate into frontend
```

---

### 5. API Endpoints Reference

**Format**:
```markdown
# 4. API ENDPOINTS REFERENCE

### Base URL: `http://localhost:3000/api`

#### **POST `/endpoint`**

- Description
- Request body schema
- Response format
- Error codes
- Example
```

**Function**:
- Complete API documentation
- Used by AI and developers to understand endpoints
- Documents all request/response formats

**When to update**:
- When endpoints added/modified
- When request/response formats change
- After backend refactoring

**Example use cases**:

**REST API**:
```markdown
# 4. API ENDPOINTS REFERENCE

### Base URL: `http://localhost:8000/api/v1`

All endpoints return JSON. Authentication via Bearer token in `Authorization` header.

#### **POST `/auth/register`**

- Register new user account
- Request body:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe"
  }
  ```
- Response (201 Created):
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-here"
  }
  ```
- Errors:
  - `400` - Invalid email format or weak password
  - `409` - Email already registered
- Example:
  ```bash
  curl -X POST http://localhost:8000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Pass123!","name":"Test"}'
  ```

#### **GET `/tasks`**

- Get all tasks for authenticated user
- Query params:
  - `status` (optional): `pending`, `completed`, `all` (default: `all`)
  - `sort` (optional): `deadline`, `created`, `priority` (default: `created`)
- Headers: `Authorization: Bearer <token>`
- Response (200 OK):
  ```json
  {
    "tasks": [
      {
        "id": "uuid",
        "title": "Finish report",
        "deadline": "2025-12-20T10:00:00Z",
        "status": "pending",
        "dependencies": ["other-task-id"]
      }
    ]
  }
  ```
- Errors:
  - `401` - Invalid or expired token
  - `500` - Database error
```

**GraphQL API**:
```markdown
# 4. API REFERENCE

### GraphQL Endpoint: `http://localhost:4000/graphql`

#### **Query: `tasks`**

```graphql
query GetTasks($status: TaskStatus, $limit: Int) {
  tasks(status: $status, limit: $limit) {
    id
    title
    deadline
    status
    dependencies {
      id
      title
    }
  }
}
```

**Variables:**
```json
{
  "status": "PENDING",
  "limit": 10
}
```

**Response:**
```json
{
  "data": {
    "tasks": [
      {
        "id": "1",
        "title": "Finish report",
        "deadline": "2025-12-20T10:00:00Z",
        "status": "PENDING",
        "dependencies": []
      }
    ]
  }
}
```

#### **Mutation: `createTask`**

```graphql
mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    title
    deadline
  }
}
```

**Input:**
```json
{
  "input": {
    "title": "New task",
    "deadline": "2025-12-25T10:00:00Z",
    "dependsOn": ["other-task-id"]
  }
}
```
```

---

### 6. Data Formats Reference

**Format**:
```markdown
# 5. DATA FORMATS REFERENCE

### **[DataType] Format**

```typescript
interface DataType {
  field: type  // Description
}
```

Example:
```json
{
  "field": "value"
}
```
```

**Function**:
- Documents all data structures
- TypeScript interfaces for type safety
- JSON examples for clarity

**When to update**:
- When data models change
- When new types added
- When migrating data formats

**Example use cases**:

**Simple types**:
```markdown
# 5. DATA FORMATS REFERENCE

### **Task Format**

```typescript
interface Task {
  id: string                    // UUID
  title: string                 // Max 200 characters
  description?: string          // Optional, markdown supported
  deadline: string              // ISO 8601 timestamp
  status: 'pending' | 'completed' | 'archived'
  priority: number              // 0-100 (AI-generated)
  createdAt: string             // ISO 8601 timestamp
  updatedAt: string             // ISO 8601 timestamp
  userId: string                // Owner user ID
  dependsOn: string[]           // Array of task IDs
}
```

**Example:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Finish quarterly report",
  "description": "Q4 2024 metrics and analysis",
  "deadline": "2025-01-15T17:00:00Z",
  "status": "pending",
  "priority": 85,
  "createdAt": "2024-12-10T09:00:00Z",
  "updatedAt": "2024-12-17T14:30:00Z",
  "userId": "user-123",
  "dependsOn": ["task-abc", "task-xyz"]
}
```

### **User Format**

```typescript
interface User {
  id: string
  email: string                 // Unique, validated
  name: string
  avatar?: string               // URL to image
  createdAt: string
  settings: UserSettings
}

interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  emailNotifications: boolean
  aiSuggestionsEnabled: boolean
}
```
```

**Complex nested types**:
```markdown
### **BoardFile Format** (tldraw project)

```typescript
interface BoardFile {
  tldrawSnapshot: TLStoreSnapshot  // Complete tldraw store state
  metadata: BoardMetadata
}

interface BoardMetadata {
  colorPalette: ColorPaletteConfig  // 28 colors with light/dark variants
  createdAt: string                 // ISO 8601 timestamp
  lastModified: string              // ISO 8601 timestamp
  boardName?: string                // Optional display name
  readOnly?: boolean                // Optional read-only flag
}

interface ColorPaletteConfig {
  [colorKey: string]: {
    light: string  // Hex color for light mode
    dark: string   // Hex color for dark mode
  }
}
```

**Example:**
```json
{
  "tldrawSnapshot": {
    "store": { /* ... */ },
    "schema": { "schemaVersion": 2 }
  },
  "metadata": {
    "colorPalette": {
      "color1_R1C1": { "light": "#ff0000", "dark": "#cc0000" },
      "color2_R1C2": { "light": "#00ff00", "dark": "#00cc00" }
    },
    "createdAt": "2025-12-06T10:00:00.000Z",
    "lastModified": "2025-12-16T12:30:00.000Z",
    "boardName": "Project Planning",
    "readOnly": false
  }
}
```
```

---

### 7. Known Issues & Technical Debt

**Format**:
```markdown
# 6. KNOWN ISSUES & TECHNICAL DEBT

## **[Category] Issues**

### **1. [Issue Name]** ⚠️ [PRIORITY LEVEL]

- **Location:** `file.ts` line 123
- **Issue:** [Description]
- **Impact:** [How it affects users/system]
- **Fix Required:** [What needs to be done]
- **Workaround:** [Temporary solution if any]
- **Testing:** [How to reproduce/verify]
```

**Function**:
- Tracks all known bugs and technical debt
- Prioritizes fixes
- Documents workarounds

**When to update**:
- When bugs discovered
- When issues fixed (mark as ✅ FIXED)
- When workarounds found

**Example use cases**:

**Bug tracking**:
```markdown
# 6. KNOWN ISSUES & TECHNICAL DEBT

## **Phase 4 Issues - Status Update:**

### **1. OAuth Redirect Bug in Production** 🚨 **CRITICAL**

- **Location:** `src/routes/auth.ts` line 45
- **Issue:** OAuth callback fails in production with "redirect_uri_mismatch" error. Works fine in development.
- **Impact:** Users cannot log in via Google/GitHub OAuth. Email auth still works.
- **Root Cause:** Production domain not added to OAuth app allowed redirect URIs
- **Fix Required:**
  1. Add `https://app.taskflow.com/auth/callback` to Google Cloud Console
  2. Add same URL to GitHub OAuth app settings
  3. Restart backend to reload config
- **Workaround:** Users must use email/password login temporarily
- **Testing:** After fix, test OAuth flow on production domain
- **Assigned To:** Backend team
- **Discovered:** 15-12-2025
- **Target Fix:** 17-12-2025

### **2. Task List Pagination Missing** ⚠️ **MEDIUM PRIORITY**

- **Location:** `src/components/TaskList.tsx`
- **Issue:** Loading all tasks at once. With 500+ tasks, page becomes slow.
- **Impact:** Users with many tasks experience 2-3 second load times
- **Fix Required:**
  - Implement virtual scrolling or pagination
  - Backend already supports `?limit=50&offset=0` query params
  - Frontend needs to use them
- **Workaround:** None - users must wait
- **Performance Target:** <500ms load time for any number of tasks
- **Deferred:** Will fix in next sprint (Week 3)

### **3. Memory Leak in Store Lifecycle** ✅ **FIXED** (16-12-2025)

- **Location:** `src/hooks/useWhiteboardLoader.ts`
- **Issue:** Old tldraw stores not disposed when switching boards. Memory accumulates.
- **Impact:** After switching 10+ boards, app becomes sluggish
- **Fix Applied:** Call `store.dispose()` before creating new store
- **Testing:** Verified with Chrome DevTools heap snapshots - memory now stable
- **Commit:** `a1b2c3d`
```

---

### 8. Active Project: Next Steps

**Format**:
```markdown
# 7. ACTIVE PROJECT: NEXT STEPS (The Priority Queue)

### 🚨 **Task 0: [Top Priority]** (STATUS)

**Goal:** [What needs to be done]

**Requirements:**
1. [Requirement 1]
2. [Requirement 2]

**Deliverables:**
- ✅ [Completed item]
- 🚧 [In progress item]
- ⏳ [Pending item]

**First Step:** [Where to start]

---

### 📋 **Task 1: [Next Task]** (STATUS)

[Similar structure]
```

**Function**:
- Ordered list of what to work on next
- Task 0 is always highest priority
- Tracks task status and progress

**When to update**:
- After completing tasks (mark ✅)
- When adding new tasks
- When priorities change
- After every session (by packawaytime agent)

**Example use cases**:

**Feature backlog**:
```markdown
# 7. ACTIVE PROJECT: NEXT STEPS

### 🚨 **Task 0: Implement Task Priority ML Model** (IN PROGRESS 🚧)

**Goal:** Train and deploy ML model that predicts optimal task order based on user's work patterns.

**Requirements:**
1. Model accuracy >80% on test set
2. Inference time <100ms in browser
3. Works offline (no server calls)
4. Privacy-preserving (data never leaves browser)

**Sub-tasks:**
- ✅ Collect training data (synthetic + real user data)
- ✅ Feature engineering (deadline proximity, dependency depth, completion patterns)
- 🚧 Train LSTM model (currently 75% accuracy, tuning hyperparameters)
- ⏳ Export to TensorFlow.js format
- ⏳ Integrate into frontend
- ⏳ A/B test with 50 users

**Deliverables:**
- ✅ `ml-model/train.py` - Training script
- ✅ `ml-model/model.h5` - Trained weights
- 🚧 `src/ml/PriorityModel.ts` - Inference wrapper
- ⏳ User acceptance: >60% of users follow AI suggestions

**First Step:** Complete hyperparameter tuning, target 80% accuracy by EOD

**Status:** 60% complete. Model training going well, integration starts tomorrow.

---

### 📋 **Task 1: Add Email Notifications** (PENDING ⏳)

**Goal:** Send email reminders for tasks approaching deadline.

**Requirements:**
1. User can configure notification preferences
2. Emails sent 24hr and 1hr before deadline
3. Users can unsubscribe
4. Track open rates

**Tech Stack:** SendGrid for email delivery, Redis for job queue

**Deliverables:**
- ⏳ Email templates (transactional HTML)
- ⏳ Background job processor (Bull queue)
- ⏳ User notification settings UI
- ⏳ Unsubscribe mechanism

**First Step:** Set up SendGrid account and verify domain

**Blocked By:** Task 0 (want ML priorities in notification emails)

---

### 📋 **Task 2: Performance Optimization Pass** (PENDING ⏳)

**Goal:** Improve app load time and perceived performance.

**Targets:**
- Initial load: <2s (currently 4.5s)
- Task list render: <500ms (currently 2-3s with 500+ tasks)
- Route transitions: <100ms (currently janky)

**Action Items:**
- Code splitting: Split ML model into separate chunk
- Lazy loading: Load task details on demand
- Virtual scrolling: Render only visible tasks
- Image optimization: Compress avatar images

**First Step:** Profile app with Chrome DevTools, identify bottlenecks
```

---

### 9. Decision Log

**Format**:
```markdown
# 10. DECISION LOG

| ID      | Date (DD-MM-YYYY) | Context                    | Verdict |
| :------ | :---------------- | :------------------------- | :------ |
| DEC-001 | 10-12-2025        | [Context/Title]            | [Full explanation, alternatives rejected, trade-offs] |
| DEC-002 | 11-12-2025        | [Context/Title]            | [Verdict] |
```

**Function**:
- Records every significant architectural decision
- Documents alternatives considered
- Explains trade-offs made
- Prevents "why did we do it this way?" questions

**When to update**:
- When architectural decisions made
- When technology choices finalized
- When design patterns chosen
- After every session with decisions (by packawaytime agent)

**Example use cases**:

**Technology choices**:
```markdown
# 10. DECISION LOG

| ID      | Date       | Context                    | Verdict |
| :------ | :--------- | :------------------------- | :------ |
| DEC-001 | 10-12-2025 | State Management Library   | **Chose Zustand over Redux.** Rationale: App state is simple (users, tasks, UI state). Zustand provides 90% of Redux functionality with 10% of the boilerplate. Team is small (2 devs) so maintainability > enterprise patterns. Alternatives rejected: Redux (too much boilerplate, overkill for our size), Context API (performance issues with frequent updates), MobX (smaller ecosystem, steeper learning curve). Trade-off: If app grows to 10+ state slices, may need to migrate to Redux Toolkit. |
| DEC-002 | 12-12-2025 | Database Choice            | **PostgreSQL over MongoDB.** Rationale: Data is relational (users → tasks → dependencies). Need ACID guarantees for task scheduling (can't have partial updates). Strong typing with schemas prevents bugs. Alternatives rejected: MongoDB (no joins, eventual consistency issues), SQLite (doesn't scale beyond single server), MySQL (PostgreSQL has better JSON support for task metadata). Trade-off: More complex migrations compared to schema-less MongoDB. |
| DEC-003 | 14-12-2025 | Authentication Strategy    | **JWT with refresh tokens over sessions.** Rationale: Stateless auth scales horizontally (can run multiple backend instances). Refresh tokens in httpOnly cookies prevent XSS. Access tokens in memory prevent CSRF. Works well with microservices architecture. Alternatives rejected: Sessions (requires sticky sessions or shared store), OAuth-only (want email/password option), Magic links (poor UX for frequent logins). Trade-off: More complex than simple sessions, need refresh token rotation strategy. |
```

**Design pattern decisions**:
```markdown
| ID      | Date       | Context                    | Verdict |
| :------ | :--------- | :------------------------- | :------ |
| DEC-004 | 15-12-2025 | Sidebar Component Pattern  | **Wrapper pattern: Sidebar and Canvas as sibling components.** Rationale: Sidebar needs to persist state (scroll position, expanded folders) when canvas re-renders. Parent-child relationship would cause sidebar to unmount when canvas updates. Sibling pattern with shared parent `AppContainer` allows independent lifecycles. Alternatives rejected: Parent-child (sidebar remounts on canvas changes), Global state (unnecessary complexity), Portals (over-engineering). Trade-off: More props passing through AppContainer, but cleaner separation of concerns. |
| DEC-005 | 16-12-2025 | Store Lifecycle Management | **Create new store on each board load.** Rationale: Prevents memory leaks when switching between boards. Old store accumulates stale data (deleted shapes still in memory). Disposing old store and creating fresh one ensures clean state. Alternatives rejected: Reuse store and clear data (still leaks shape references), Store per board (too much memory), Persist across boards (confusing state). Trade-off: Slight performance hit on board switch (~100ms to create store), but prevents accumulating memory leaks. |
```

**API design decisions**:
```markdown
| ID      | Date       | Context                    | Verdict |
| :------ | :--------- | :------------------------- | :------ |
| DEC-006 | 17-12-2025 | API Route Parameter Style  | **Query parameters `?id=path` instead of path parameters `/:id`.** Rationale: Express 5 wildcard routes don't capture slashes in path params. File paths like `folder/subfolder/board.tldr` would break with `/:id` pattern. Query params with `encodeURIComponent()` handle nested paths correctly. All endpoints use this pattern for consistency: `/api/whiteboards/load?id=path/to/board`. Alternatives rejected: Path params (doesn't work with slashes), POST body (inconsistent for GET requests), Base64 encode paths (ugly URLs, breaks caching). Trade-off: Slightly less RESTful, but pragmatic solution to technical limitation. |
```

---

### 10. Idea Backlog

**Format**:
```markdown
# 11. IDEA BACKLOG

This section is for new ideas that are not yet prioritized into the active plan.

- **[Idea name]:** [Description, use case, potential complexity]

- **[Another idea]:** [Description]
```

**Function**:
- Captures ideas without cluttering active work
- Prevents forgetting good ideas
- Easy to promote to active tasks later

**When to update**:
- When brainstorming features
- When users suggest features
- When discovering potential improvements
- When deprioritizing active tasks (move back to backlog)

**Example use cases**:

**Feature ideas**:
```markdown
# 11. IDEA BACKLOG

- **Collaborative task boards:** Allow multiple users to work on shared task lists. Would require real-time sync (WebSockets), conflict resolution, permissions system. Large effort (4-6 weeks). Deferred until we validate single-user MVP.

- **Task templates:** Pre-defined task sets for common workflows (e.g., "Launch checklist", "Weekly review"). Simple CRUD, 1-week effort. Good for V2.

- **Voice input for task creation:** "Hey app, add task: finish report by Friday". Would use Web Speech API. Cool factor high, practical value uncertain. Research prototype first.

- **Calendar integration:** Sync tasks with Google Calendar, Outlook. Two-way sync is complex (4 weeks), one-way export is simple (2 days). Start with export.

- **Mobile app:** React Native for iOS/Android. Shares 80% code with web. Requires: push notifications, offline mode, app store setup. 8-10 weeks full-time. Post-MVP.

- **Pomodoro timer:** Built-in timer for time-blocking tasks. Simple feature, high user demand. 3 days effort. Good candidate for next sprint.

- **Dark mode:** User-requested. Frontend only, 2 days effort. High impact/effort ratio. Promote to active tasks.

- **Task analytics:** Visualize completion trends, productivity patterns. Requires data pipeline, charting library. 2-3 weeks. Nice-to-have, not critical.

- **Undo support for file operations:** Restore deleted tasks. Would need event sourcing or backup system. Medium complexity. Safety feature, prioritize after core features solid.
```

---

### 11. Action Log

**Format**:
```markdown
# 12. ACTION LOG (Session History)

| Date (DD-MM-YYYY) | Agent | Action | Status |
| :---------------- | :---- | :----- | :----- |
| 17-12-2025        | Agent | [Concise summary of session work - max 200 chars] | Completed |
```

**Function**:
- Chronicles every coding session
- Quick timeline of project progress
- Helpful for weekly/monthly reviews

**When to update**:
- After every coding session (by packawaytime agent)
- Automatically appended (never delete old entries)

**Example use cases**:

**Project timeline**:
```markdown
# 12. ACTION LOG (Session History)

| Date       | Agent | Action | Status |
| :--------- | :---- | :----- | :----- |
| 01-12-2025 | User  | Project initialization: Created React + FastAPI starter, configured ESLint, Prettier, TypeScript. Set up PostgreSQL database. | Completed |
| 02-12-2025 | Agent | Implemented user registration and login endpoints. Added JWT auth middleware. Created User model with password hashing. | Completed |
| 03-12-2025 | Agent | Built frontend login/register forms with validation. Integrated with backend auth API. Added protected routes with redirect. | Completed |
| 05-12-2025 | User  | Fixed OAuth redirect bug in production. Updated Google Cloud Console redirect URIs. Tested OAuth flow on live site. | Completed |
| 06-12-2025 | Agent | Implemented task CRUD endpoints. Created Task model with dependencies. Added foreign key constraints to database. | Completed |
| 07-12-2025 | Agent | Built task list UI component with create/edit/delete. Added drag-drop reordering. Integrated with backend API. | Completed |
| 10-12-2025 | Agent | Started ML model for task prioritization. Generated synthetic training data. Implemented feature engineering (deadline proximity, dependency depth). | Completed |
| 12-12-2025 | Agent | Trained LSTM model, achieved 75% accuracy. Experimented with hyperparameters. Need to reach 80% before deployment. | Completed |
| 14-12-2025 | User  | Conducted user testing with 10 beta users. Gathered feedback: need email notifications, mobile app, dark mode. | Completed |
| 15-12-2025 | Agent | Fixed memory leak in whiteboard store lifecycle. Implemented store disposal on board switch. Verified with heap snapshots. | Completed |
| 17-12-2025 | Agent | Implemented packawaytime agent with conversation export support. Added automatic documentation updates, git commit/push. Updated CLAUDE.md structure guide. | Completed |
```

---

## Tips for maintaining MASTER_REFACTORING_LOG.md

### 1. Never delete, always archive

- Mark completed phases as ✅ COMPLETED
- Move to "Legacy Projects" section
- Preserve full implementation details
- Future you will thank you

### 2. Be detailed, not concise

- Explain WHY decisions were made
- Document alternatives considered
- Record trade-offs explicitly
- Include code snippets when helpful

### 3. Update after every session

- Use packawaytime agent to automate
- Update Action Log with session summary
- Add new decisions to Decision Log
- Mark completed tasks in Next Steps

### 4. Use consistent IDs and dates

- Decision IDs: DEC-001, DEC-002, ...
- Phase IDs: Phase 1, Phase 2, ...
- Date format: DD-MM-YYYY everywhere
- Never change existing IDs

### 5. Link to code

- Reference file paths: `src/components/Task.tsx`
- Include line numbers: `Task.tsx:45`
- Link to commits: `commit a1b2c3d`
- Point to related files

### 6. Keep sections in order

- Sections should flow logically
- Status Overview always first
- Active Project before archives
- Decision Log and Action Log at end
- Use numbered sections for easy reference

---

## Template for new projects

```markdown
# 💡 MASTER_REFACTORING_LOG.md

> **SYSTEM INSTRUCTION FOR AI AGENTS:**
> This file is the Single Source of Truth (SSOT) for the project state.
> Read completely before starting work.

## 🤖 AI MAINTENANCE PROTOCOL

**Before starting work:**
1. Read this file completely
2. Update "Last Update" date if making changes

**Standard operations:**
- Add decisions to Decision Log (Section X)
- Add session summaries to Action Log (Section Y)
- Mark completed tasks in Next Steps (Section Z)

---

# 1. PROJECT STATUS OVERVIEW

**Current Focus:** [What you're working on]
**Overall State:** [Project maturity]
**Last Update:** DD-MM-YYYY

---

# 2. ACTIVE PROJECT: [NAME]

## 2.1 Architectural Foundation & Requirements

- **Goal:** [What you're building]
- **Key Principles:** [Core decisions]

## 2.2 File Structure Overview

```
/project-root/
├── src/
```

## 2.3 Implemented Phases

### **Phase 1: [Name]** (IN PROGRESS 🚧)

**Summary:** [What's being built]

**Programmatic Implementation:**
- [Technical details]

**Key Files:**
- `file.ts` - Description

---

# 3. API ENDPOINTS REFERENCE

### Base URL: `http://localhost:3000/api`

#### **POST `/endpoint`**

- Description
- Request/Response

---

# 4. DATA FORMATS REFERENCE

### **TypeName Format**

```typescript
interface TypeName {
  field: type
}
```

---

# 5. KNOWN ISSUES & TECHNICAL DEBT

### **1. [Issue Name]** ⚠️ [PRIORITY]

- **Location:** `file.ts`
- **Issue:** [Description]
- **Fix Required:** [What to do]

---

# 6. ACTIVE PROJECT: NEXT STEPS

### 🚨 **Task 0: [Top Priority]** (STATUS)

**Goal:** [What needs to be done]

**Requirements:**
1. [Requirement]

**First Step:** [Where to start]

---

# 7. DECISION LOG

| ID      | Date       | Context | Verdict |
| :------ | :--------- | :------ | :------ |
| DEC-001 | DD-MM-YYYY | [Topic] | [Full explanation with alternatives and trade-offs] |

---

# 8. IDEA BACKLOG

- **[Idea]:** [Description]

---

# 9. ACTION LOG

| Date       | Agent | Action | Status |
| :--------- | :---- | :----- | :----- |
| DD-MM-YYYY | Agent | [Session summary] | Completed |

---

**END OF MASTER_REFACTORING_LOG.md**
```

---

## Comparison with CLAUDE.md

| Aspect | CLAUDE.md | MASTER_REFACTORING_LOG.md |
|--------|-----------|---------------------------|
| **Length** | 250-600 lines | Unlimited (grows over time) |
| **Style** | Concise, 1-2 sentences | Detailed, full explanations |
| **Updates** | After every session (replace old) | After every session (append new) |
| **History** | Last 5-7 decisions only | Complete history, nothing deleted |
| **Audience** | AI agents (quick start) | Future you (complete context) |
| **Sections** | Current state | Current + archived + timeline |
| **Detail level** | High-level summaries | Implementation details + code |

---

## Conclusion

MASTER_REFACTORING_LOG.md is your project's "memory". It grows with your project, captures every decision, tracks every phase, and preserves complete context.

**Key principle:** If it happened, it stays in this file. Archive completed work, but never delete it. Your future self (and AI agents) will thank you for this comprehensive record.

**Remember:** Be detailed, be consistent, be honest. This file is for you 6 months from now, wondering "why did I build it this way?"
