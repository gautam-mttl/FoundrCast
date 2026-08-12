# 00 Agent Instructions & Guidelines

> **IMPORTANT**: This document defines the permanent, non-negotiable operational rules for all AI agents and developers working on the FoundrCast project.

---

## 1. Core Operating Principles

### Rule 1: The Existing Backend is Protected
- **Do NOT** modify, refactor, delete, or rename any backend routes, controllers, models, utilities, or middlewares.
- **Do NOT** replace MongoDB, Mongoose, Express, or Cloudinary.
- **Do NOT** alter authentication logic or token mechanics.
- The existing Node.js/Express backend located in `./BACK-END` is fully tested and served as the immutable ground truth for all API contracts.

### Rule 2: Frontend Adapts to Existing APIs
- The frontend must be designed and built to fit the existing backend API contracts, parameter names, and payload shapes precisely.
- If an endpoint expects `req.body.fullName` or query parameter `userId`, the frontend must send exactly those keys.
- Do not request backend code changes to accommodate preferred frontend patterns.

### Rule 3: No Mock Data When Real Endpoints Exist
- Every frontend feature must integrate directly with the live Express/MongoDB backend APIs.
- Dummy/mock data is strictly prohibited for any feature covered by an existing backend controller.

### Rule 4: Backend Changes Require Explicit Approval
- Under no circumstances should backend code be altered without prior written specification and explicit authorization from the lead architect/user.

### Rule 5: API Behavior Verification Precedes Integration
- Before integrating any endpoint into a frontend feature, inspect the actual controller code (`BACK-END/src/controllers/*.js`) and route definition (`BACK-END/src/routes/*.js`).
- Verify exact HTTP methods, path parameters, query flags, header requirements, payload schemas, and response envelope shapes.

### Rule 6: Mandatory Documentation Review
- Developers and agents must review `docs/01_BACKEND_AUDIT.md`, `docs/02_API_CONTRACT.md`, `docs/03_FRONTEND_ARCHITECTURE.md`, `docs/04_UI_UX_SPEC.md`, `docs/05_IMPLEMENTATION_PLAN.md`, and `docs/06_DEPLOYMENT_PLAN.md` before initiating work on any phase.

### Rule 7: Lightweight & Purposeful State Management
- Avoid over-engineering global state management.
- Utilize React Context for core global states (Auth session, theme, global toast notifications).
- Use local component state or lightweight data-fetching abstractions for localized page data.

### Rule 8: UX Excellence & State Completeness
- Every visual component and page must explicitly implement:
  - **Loading states** (Skeletons, spinners, progress indicators)
  - **Empty states** (Actionable messages when arrays/lists are empty)
  - **Error states** (User-friendly toast/alert fallbacks for API errors)
  - **Responsive layouts** (Mobile, tablet, desktop optimized views)

### Rule 9: Zero Secret Exposure
- Secrets, private keys, access token secrets, or Cloudinary credentials must **never** be exposed in client-side code, environment files committed to git, or console logs.
- Environment variables exposed to the frontend must use the standard public prefix (e.g., `VITE_API_BASE_URL`).

### Rule 10: Single Repository Hierarchy
- Keep both frontend and backend within this single Git repository (`FoundrCast`).
- The backend remains in `./BACK-END` and the upcoming frontend will reside in `./frontend` or root as established in the implementation plan.

## 1.1 Master Execution Protocol

This project must be developed as a controlled, phase-by-phase implementation.

Before starting ANY implementation work:

1. Read this file completely.
2. Read the documentation relevant to the current phase:
   - `01_BACKEND_AUDIT.md`
   - `02_API_CONTRACT.md`
   - `03_FRONTEND_ARCHITECTURE.md`
   - `04_UI_UX_SPEC.md`
   - `05_IMPLEMENTATION_PLAN.md`
   - `06_DEPLOYMENT_PLAN.md`
3. Inspect the actual backend source code whenever an API behavior is uncertain.
4. Never assume an API contract from memory or from a generic YouTube implementation.
5. Never modify backend code unless the user explicitly approves the specific backend change.
6. Implement only the current phase. Do not silently proceed into later phases.
7. After implementation:
   - run the required build/type checks;
   - test the implemented functionality against the real backend;
   - inspect the Git diff;
   - confirm that no backend files were modified;
   - report files changed, tests performed, failures found, and remaining issues.
8. STOP and wait for user review before beginning the next phase.

### Implementation Philosophy

FoundrCast is an existing backend-first project, not a request to rebuild the backend.

The frontend must adapt to the existing system rather than forcing the backend to conform to frontend preferences.

Do not:
- invent API endpoints;
- invent response fields;
- create mock data where a real endpoint exists;
- silently change API contracts;
- rewrite working backend logic;
- install unnecessary dependencies;
- implement multiple phases at once;
- commit or push without explicit user approval.

When the backend has an unusual field name, response shape, route, authentication behavior, or limitation, create a frontend adapter rather than changing the backend.

The goal is a production-quality frontend that exposes the capabilities already provided by the existing backend.

---

## 2. Summary of Repository Constraints

| Rule ID | Constraint | Enforcement Mechanism |
|---|---|---|
| **R-01** | Backend Code Frozen | Audit git status before and after frontend work. |
| **R-02** | Strict API Adaptation | Follow `02_API_CONTRACT.md` schema definitions. |
| **R-03** | Real API Integration | Prohibit mock service workers / inline mock data. |
| **R-04** | Change Gatekeeping | Require explicit user approval for backend edits. |
| **R-05** | Code Audit First | Inspect controller/route code prior to feature coding. |
| **R-06** | Read Docs First | Check phase instructions in `05_IMPLEMENTATION_PLAN.md`. |
| **R-07** | Simple State | Avoid redundant state machines or unnecessary boilerplate. |
| **R-08** | Full State Handling | Require Loading, Empty, Error, and Responsive UI states. |
| **R-09** | Secret Hygiene | Audit `.env` and bundle outputs for secret leaks. |
| **R-10** | Monorepo Structure | Maintain repository layout without splitting repos. |
