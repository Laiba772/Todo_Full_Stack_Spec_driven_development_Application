<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0 (initial creation)
Added principles: 6 core principles
Added sections: Technology Stack, Development Workflow, Quality Standards
Templates checked: ✅ plan-template.md (aligned - Constitution Check section exists)
                   ✅ spec-template.md (aligned - User Scenarios, Requirements, Success Criteria sections)
                   ✅ tasks-template.md (aligned - user story organization matches)
No command files in .specify/templates/commands/ to update
No other runtime guidance docs found
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-Driven Development
All implementation MUST strictly follow approved specifications. No code may be written without first creating and obtaining approval for a feature spec. The workflow is mandatory: Spec → Plan → Tasks → Implementation. This ensures every feature has explicit documentation of behavior before any code is written.

### II. Agentic Workflow Compliance
All code generation MUST occur through Claude Code using specialized agents (Auth, Frontend, Database, Backend). No manual coding is permitted. This ensures consistency, traceability, and enables the hackathon evaluation process to review prompts and iterations.

### III. Security-First Design
Authentication, authorization, and user isolation MUST be enforced by default. JWT tokens must be validated on every backend request. Task ownership must be enforced on every CRUD operation. Multi-user isolation is mandatory - users can only access their own data.

### IV. Deterministic Behavior
APIs and UI MUST behave consistently across users and sessions. All API behavior must be explicitly defined in specs. REST APIs must follow HTTP semantics and status codes. Errors must be explicit, predictable, and documented.

### V. Full-Stack Coherence
Frontend, backend, and database must integrate without mismatches. The frontend must consume APIs exactly as specified. All database queries must be user-scoped. No hard-coded secrets; environment variables only.

### VI. Traceability
All prompts, iterations, and implementation decisions MUST be recorded in Prompt History Records (PHRs). Specs, plans, and iterations must be reviewable and traceable. This enables the hackathon evaluation process.

## Technology Stack

The following technology stack is fixed and non-negotiable for this project:

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | Next.js 16+ (App Router) | Use Frontend Agent |
| Backend | Python FastAPI | Use Backend Agent |
| ORM | SQLModel | Use Database Agent |
| Database | Neon Serverless PostgreSQL | Use Database Agent |
| Authentication | Better Auth (JWT-based) | Use Auth Agent |

## Development Workflow

### Phase 0: Specification
1. Create feature spec in `specs/<feature>/spec.md`
2. Define user stories with priorities (P1, P2, P3)
3. Define functional requirements
4. Define success criteria
5. Obtain approval before proceeding

### Phase 1: Planning
1. Create implementation plan in `specs/<feature>/plan.md`
2. Define technical context and project structure
3. Document architecture decisions
4. Verify compliance with constitution
5. Obtain approval before proceeding

### Phase 2: Task Breakdown
1. Create task list in `specs/<feature>/tasks.md`
2. Organize tasks by user story
3. Define clear dependencies
4. Enable independent implementation of each story

### Phase 3: Implementation
1. Use specialized agents based on task type
2. Follow Red-Green-Refactor where tests are included
3. Create PHR for every agent invocation
4. Maintain full traceability

### Phase 4: Integration
1. Integrate frontend with backend APIs
2. Verify user isolation works correctly
3. Test end-to-end functionality
4. Ensure all unauthorized requests return 401

## Quality Standards

### API Requirements
- All endpoints require valid JWT after authentication
- Stateless backend authentication (JWT only)
- REST APIs must follow HTTP semantics
- Proper status codes for all outcomes
- Explicit error responses with documented schemas

### Security Requirements
- JWT token validation on every request
- Task ownership enforced on every operation
- User-scoped database queries
- No hard-coded secrets
- Environment variables for all credentials

### Testing Requirements
- Contract tests for API endpoints
- Integration tests for user journeys
- Independent testability of each user story
- All tests must fail before implementation (where applicable)

## Governance

This constitution supersedes all other development practices. Amendments require documentation and approval. All team members must verify compliance with these principles before merging any implementation.

The constitution takes precedence over:
- Individual developer preferences
- Convenience-driven shortcuts
- Undocumented assumptions

**Version**: 1.0.0 | **Ratified**: 2026-01-07 | **Last Amended**: 2026-01-07
