# SPEC: Market-Ready Upgrade of an Existing Full-Stack Project

### 0.1 Project name and type

```
[ PROJECT NAME: Imgixy]
```

### 0.2 Tech stack (if known)

```
for UI/UX: CSS3, Tailwaind CSS, or if case(Bootstrap)
and this is MERN project hope you know what tech stack should be use still for your clearence below listed

# Tech Stack
- React
- React Router
- Express
- MongoDB
- JWT Authentication
- OAuth
```

### 0.3 Task for this run

# SDD: Make the Application Market-Ready

## Objective

Make the existing application production-ready and competitive with market standards now there are lot of think still missing a/c to market recruiter perspective, using the provided reference links

## Requirements

- Thoroughly review all existing specifications, PRDs, checklists, and reference links before starting.
- Audit every feature against the checklist. Identify and implement any missing or incomplete requirements.
- fix any bugs If you find while building this
- Evaluate the application from a real user's perspective, including UI/UX, responsiveness, functionality, and edge cases.
- Identify and fix discovered bugs, errors, and usability issues.
- Refine the design to meet professional, polished, market-ready standards.

## Strict Constraints

- Preserve all existing business logic, functionality, APIs, routes, URLs, links, integrations, and configurations.
- Do not remove or break existing features or introduce unrelated while building.
- Make only necessary improvements while maintaining backward compatibility.

## Acceptance Criteria

- All checklist requirements are implemented and verified.
- No known critical bugs or broken functionality remain.
- The application meets professional market standards across desktop, tablet, and mobile.
- Existing functionality remains intact.
- Test the changes and report completed checklist items, fixes, modified files, and any remaining issues.

## Source of Truth --- Strict

- `client` and `server` are my existing application and remain the
  source of truth.
- Keep the project name **Imgixy**.
- Preserve all current features, business rules, backend logic, data,
  APIs/endpoints, HTTP methods, request/response contracts,
  URLs/routes, query parameters, authentication/authorization,
  database behavior, integrations, and environment-variable
  names/usage.
- Do not change URLs, API contracts, environment configuration, or
  backend logic for styling convenience.
- No feature may be removed or silently disabled. Avoid new CORS
  error no AI generation errors, console errors/warnings, failed requests, and regressions.

## 1. Inspect Before Changing

1.  Read all existing specs, PRD/problem statement, checklists, and
    relevant project documentation completely.
2.  Inventory existing functionality and map each major UI flow to its
    current implementation and API.
3.  Compare the implementation against the provided requirements and
    identify missing, incomplete, buggy, or inconsistent
    items---including spelling, grammar, typos, responsiveness, theme
    behavior, hidden text on theme check. and loading/performance problems.

## 2. UI/UX Redesign

- Make Imgixy look intentionally designed, professional, modern,
  cohesive, and appropriate for a real hiring/recruitment product add missing think as per market of today's.
- Use the reference projects/links to understand visual hierarchy,
  typography, spacing, layouts, navigation, content presentation,
  forms, card and interaction patterns. Adapt ideas to Imgixy
  rather than copying pages or content.
- Avoid generic AI-generated styling, repetitive template-like cards,
  excessive gradients/glassmorphism, decorative effects, inconsistent
  spacing, and unnecessary animation.
- Improve hierarchy, readability, alignment, contrast, component
  consistency, whitespace, and clear calls to action.
- Correct spelling, grammar, punctuation, capitalization, labels,
  helper text, and error messages while preserving meaning and
  business rules.
- Keep the **Imgixy** name and existing project content. Do not
  invent testimonials, employers, statistics, jobs, features, or
  claims.

## 4. Functionality & Requirements Coverage

- UI controls must remain connected to the original application logic
  and real APIs.
- Preserve all existing flows, forms, validation, navigation,
  search/filtering, pagination, CRUD actions, authentication,
  role-based behavior, and other features actually present.
- Test all applicable Imgixy flows based on the real project and
  supplied checklist/PRD---not assumptions.
- If the checklist/PRD requires a feature that is genuinely missing,
  determine whether the existing backend supports it. Implement it
  only within the documented requirement and current architecture; if
  it requires a backend/API change, assess impact first and preserve
  backward compatibility.
- Do not invent new product behavior or use hardcoded/demo data to
  make a screen appear complete.
- Ensure loading, success, empty, validation, and failure states are
  clear and functional.

## 5. Responsive & Accessible UI

Test key pages and flows on mobile, small mobile, tablet, laptop, and
desktop. - Fix overflow, overlapping content, clipped text, hidden
controls, hiddent text on UI while toggling theme broken menus, unusable forms, and inconsistent spacing. -
Ensure navigation, tables, cards, dialogs, forms, and interactive
controls adapt to screen size. - Check keyboard navigation, focus
visibility, semantic elements, form labels, accessible names, and
readable color contrast. - Preserve existing theme/toggle behavior if
present; ensure switching themes does not hide content or make
text/components unreadable.

## 6. Performance & Stability

Inspect and fix actual, verifiable problems rather than optimizing
blindly. - Review bundle size, large assets, image loading, fonts,
unnecessary dependencies, duplicate API calls, repeated rendering,
expensive calculations, blocking work, and unnecessary network
requests. - Inspect loading delays and PWA/Lighthouse issues if PWA
configuration exists; use available Lighthouse results to prioritize
fixes. - Optimize only where justified. Avoid premature memoization,
unnecessary abstractions, and caching that could make data stale or
change behavior. - Do not hide slow operations by changing loaders
alone. - Preserve API base URLs, environment configuration,
authentication, and request sequencing requirements. - Do not expose
secrets or server-only environment variables in client code.

## 7. No-Regression Rules

- Make focused, incremental changes; avoid a full rewrite.
- Do not change backend logic just to accommodate a new design.
- Do not rename or remove routes, endpoints, environment variables,
  database fields, or public interfaces without an explicit
  requirement and a verified compatibility plan.
- Do not delete code/assets until confirmed unused.
- Do not suppress lint, type, build, browser, or network errors to
  make checks appear clean.
- Do not claim a test passed unless it was actually run.
- If a requirement cannot be safely completed, explain the blocker
  rather than silently omitting it.
- ensure you read all this `market-stand.md`study,analysis properly and you start to design so what exactly i want you should know.

## 8. Verification Checklist

Before finishing:

- \[ \] Read the supplied specifications/checklist/PRD and map requirements to implementation.
- \[ \] Confirm Imgixy branding and content remain correct.
- \[ \] Confirm every existing route and important user flow works.
- \[ \] Test all applicable forms,validations, and interactive controls.
- \[ \] Confirm frontend-to-backend requests use the original endpoints and compatible contracts.
- \[ \] Confirm authentication, authorization, database operations, and integrations still work.
- \[ \] Confirm no new CORS errors, no AI generation error failed API requests, console errors, or warnings are introduced.
- \[ \] Check responsive layouts across mobile, tablet, and desktop.
- \[ \] Run available linting, tests, and production build; fix issues introduced by changes.
- \[ \] Inspect performance/Lighthouse findings where tools and environment permit, and re-test important changes.
- \[ \] Recheck for spelling, grammar, typos, broken assets,dead links, and accidental hidden content.

## Acceptance Criteria

Imgixy has a cohesive, market-standard, human-designed UI inspired by
the references, with corrected text and reliable responsive behavior.
The provided PRD/checklist is covered to the extent supported by the
inspected project and requirements. Tailwind migration is complete and
stable. **All existing functionality, business logic, endpoints, URLs,
environment configuration, and backend behavior remain intact**, with no
regressions introduced by the work.

## Final Instruction

**Read thoroughly → Inspect both projects 'client', 'server' → Map requirements and
existing behavior → Plan → Redesign/migrate incrementally → Test → Fix
regressions → Report honestly.**

My existing Imgixy application is the product improve more as much as markete stnad fill missing whatever you feel and align with checklist point all should be work accordingly. Prioritize preserving behavior over visual
convenience. Do not guess, do not copy-paste an unrelated application,
and do not mark the task complete until the changes have been verified.

---

## Implementation & Verification

- Adapt the reference UI to my existing pages, components, data, and interactions.
- Replace mock/static reference data with my existing dynamic data wherever applicable.
- Ensure buttons, forms, navigation, filters, theme controls (if present), and other interactive elements work correctly.
- Test important user flows and API integrations after implementation.
- Check browser console, network requests, responsive layouts, and existing functionality for regressions.
- Fix any bugs introduced by the UI migration & as well in functionality.

### 0.4 Checklist / PRD / Problem Statement

## Problem Statement

kaviosPix
Project Name: KaviosPix

1. Project Overview:
   The project involves building an API-based image management system similar to
   Google Photos with authentication through Google Auth. Users can create albums,
   share them with others via email, and upload images with various metadata. The
   project will allow adding tags, comments, favorites, and person names to the
   images. Only image files are allowed, and there’s a set maximum file size per
   upload.
2. Entities:
   User:
   userId : Unique UUID for each user.
   email : Email of the user (retrieved from Google Auth).
   Authentication: Google OAuth2 for user sign-in.
   Album:
   albumId : UUID for uniquely identifying each album.
   name : Name of the album.
   description : Optional description for the album.
   ownerId : Reference to the user who created the album.
   Shared Users: List of users (via email) who have access to the album.
   kaviosPix 2
   CRUD: Users can create albums, update descriptions, delete albums, and
   share with others via email.
   Image:
   imageId : UUID for each image.
   albumId : Reference to the album where the image is uploaded.
   name : Name of the image file.
   tags : List of tags related to the image.
   person : Name of the person in the image (if tagged).
   isFavorite : Boolean field indicating if the image is starred or favorited.
   comments : List of comments on the image.
   size : Size of the image in bytes.
   uploadedAt : Timestamp when the image was uploaded.
   CRUD: Users can upload images, tag them, add comments, star them, and
   delete images.
3. Authentication:
   3.1 Google Auth Integration
   Flow:
   Users must sign in via Google OAuth2 to access the application.
   Upon authentication, retrieve the user’s email and userId .
   Endpoint:
   GET /auth/google (initiate authentication)
   GET /auth/google/callback (Google callback endpoint)
   Token-Based Access:
   Issue a JWT upon successful authentication.
   Use JWT for all subsequent API requests to ensure authentication.
   kaviosPix 3
4. Album Functionalities:
   4.1 Create Album
   Endpoint: POST /albums
   Payload:
   {
   "name": "Vacation 2024",
   "description": "Photos from my trip to Goa"
   }
   Validations:
   name : Required, string.
   description : Optional, string.
   4.2 Update Album Description
   Endpoint: PUT /albums/:albumId
   Payload:
   {
   "description": "Updated description for the album"
   }
   Validations:
   Ensure the user is the owner of the album before allowing updates.
   4.3 Add Users to Album (Share Album)
   Endpoint: POST /albums/:albumId/share
   Payload:
   {
   "emails": ["friend1@example.com", "friend2@example.com"]
   kaviosPix 4
   }
   Functionality:
   Add users (by email) to the album's access list.
   These users will now have read access to the album and its images.
   Validations:
   Ensure the provided emails are valid.
   Ensure the users being added exist in the system.
   4.4 Delete Album
   Endpoint: DELETE /albums/:albumId
   Functionality: Deletes the album and all its associated images.
   Error Handling:
   Ensure only the owner of the album can delete it.
5. Image Functionalities:
   5.1 Upload Image
   Endpoint: POST /albums/:albumId/images
   Payload: Multipart form data (image + optional metadata)
   {
   "file": "image_to_upload.jpg",
   "tags": ["beach", "sunset"],
   "person": "John Doe",
   "isFavorite": true
   }
   Validations:
   Ensure albumId exists and the user has access.
   Only image file types are allowed (jpg, png, gif, etc.).
   kaviosPix 5
   Enforce a maximum file size limit (e.g., 5MB).
   Save metadata like tags , person , isFavorite , and uploadedAt .
   Metadata Saved:
   File name, size, tags, person name (if tagged), isFavorite, and timestamp.
   Hint: Use fs.statSync(file) in Node.js to extract file size and
   path.extname(file) to verify the image type.
   5.2 Star (Favorite) Image
   Endpoint: PUT /albums/:albumId/images/:imageId/favorite
   Payload:
   {
   "isFavorite": true
   }
   Functionality:
   Allows the user to mark or unmark an image as a favorite.
   5.3 Add Comment to Image
   Endpoint: POST /albums/:albumId/images/:imageId/comments
   Payload:
   {
   "comment": "This is a beautiful sunset!"
   }
   Functionality:
   Users can add comments to an image.
   Comments are stored as an array of strings.
   5.4 Delete Image
   kaviosPix 6
   Endpoint: DELETE /albums/:albumId/images/:imageId
   Functionality: Deletes the image from the album.
   Error Handling:
   Ensure the image imageId exists and the user has permission to delete it.
6. Read Functionalities:
   6.1 Get All Albums
   Endpoint: GET /albums
   Response:
   [
   {
   "albumId": "uuid-123",
   "name": "Vacation 2024",
   "description": "Photos from my trip to Goa",
   "ownerId": "uuid-owner-001",
   "sharedWith": ["friend1@example.com", "friend2@exampl
   e.com"]
   }
   ]
   6.2 Get All Images in an Album
   Endpoint: GET /albums/:albumId/images
   Response:
   [
   {
   "imageId": "uuid-abc",
   "name": "sunset.jpg",
   "tags": ["sunset", "beach"],
   "person": "John Doe",
   "isFavorite": true,
   kaviosPix 7
   "comments": ["Amazing shot!", "So beautiful!"],
   "size": 200000,
   "uploadedAt": "2024-10-17T11:00:00Z"
   }
   ]
   6.3 Get Favorite Images in an Album
   Endpoint: GET /albums/:albumId/images/favorites
   Functionality: Returns all images marked as favorite in the album.
   6.4 Get Images by Tags
   Endpoint: GET /albums/:albumId/images?tags=sunset
   Functionality: Returns all images in the album that have the specified tags.
7. Key Points:
   Authentication: All users sign in via Google OAuth2, and API access is
   controlled via JWT.
   File upload: Only image files (jpg, png, gif) are allowed, with a set maximum
   file size (e.g., 5MB).
   Metadata:
   For images: Tags, person name, favorite status, comments, size, and
   uploaded date.
   For albums: Description and shared users list (emails).
   Permissions:
   Shared users can view images but cannot delete the album or images.
   Error Handling:
   Return appropriate errors if the user doe

NOTE: if you unabled to read this cheklist so must open below link open it

Open link: https://files.cdn.thinkific.com/file_uploads/887743/attachments/357/167/3b4/kaviosPix.pdf

- read properly for testing & varify ensure all should work and all checklist featured covered.
- every missing checklist point should be cover.

---

# Guidelines

This project will be evaluated based on the following criteria. Ensure the implementation satisfies each of them.

- Clean code and proper project structure.
- Good engineering decisions.
- Complete implementation of all required features.
- Clear and professional project walkthrough.
- Well-organized code and project presentation.
- Timely completion.
- All required features implemented successfully.

---

## Evaluation Checklist

The reviewer will evaluate the project based on the following questions:

- Does the application work correctly?
- Is the code clean, readable, and maintainable?
- Is the project structure well organized?
- Can the implementation be explained clearly during an interview?
- Does the project satisfy all required features?

Build the project keeping all of these evaluation points in mind.

---

# Development Rules

Before implementing any feature:

- Read and understand the complete problem statement closely.
- Read this specs carefully what I want exactly thourily
- Prioritize core features first, then implement additional requirements incrementally.
- Follow a human-friendly coding style that reflects my learning and understanding.
- Avoid code that looks auto-generated or unnecessarily complex.
- Implement every feature according to the problem statement.
- Write clean, understandable code that is easy to explain during interviews.

---

### 0.5 Market benchmark (optional)

> Real products this project should be compared with (for example Amazon and Flipkart for e-commerce, WhatsApp for chat).

### 0.6 Extra notes (optional)

```
[ KNOWN BUGS, WEAK PAGES, ANYTHING ELSE ]
Check all pages you need to fix

```

## 1. Type and Intent

- **Type:** Audit, Fix, Polish, Optimize (NOT a rebuild)
- **Goal:** Take this working full-stack project and raise it to a standard where a recruiter sees a real, well-built product and not a "kaam chalau" (just-working) student project, while everything that works today keeps working exactly the same. fill whaterver needs as per market.
- **Why:** Mentor feedback said (1) the projects do not stand out in the market, and recruiters compare them with existing products, and (2) basic mistakes (errors, edge cases, UI/UX, spelling and grammar, checklist and PRD points missing functionality) must be reviewed before the final submission. This is the last review before placement interviews, so quality matters in every detail.Then revise the core concepts again, especially around full-stack flows, APIs, validation, authentication, job status handling, and frontend responsivenes and one more think After multiple back and forth and multiple reviews and feedback, your projects were not as per the checklist base on feedback work on it..

## 2. Scope Lock

1. Work only on the task in Section 0.3, and on verifying the points in Section 0.4. If Section 0.3 says "full audit and polish", the whole project is in scope. If it names specific pages, features, or files, only those are in scope.
2. Inside that scope, the audit is thorough. Outside it, change nothing.
3. If something outside scope looks wrong, list it under "Observations (not changed)". Do not touch it.
4. If a change would affect something protected (Section 4), stop and ask first.
5. If anything is unclear, ask. Do not guess.

## 3. Phase 1: Study and Audit (no code changes in this phase)

Read the real code and run the real app. Then produce an **Audit Report** covering:

1. **Checklist / PRD coverage:** each point from Section 0.4 marked ✅ working, ⚠️ partial or buggy, ❌ missing.
2. **Market comparison:** features that users expect from the benchmark products (Section 0.5) but are missing or weak here. Suggest only realistic additions that fit the existing architecture.
3. **Functionality and edge cases:** empty states, invalid input, duplicate actions, expired sessions, network failure, large data, double clicks, refresh in the middle of a flow.
4. **Error handling:** every user-facing error message must be clear, human, and helpful. No raw errors, stack traces, or "undefined" shown.
5. **UI/UX:** consistency, hierarchy, spacing, loading and empty and error states, form feedback, navigation, no hidden text on both theme shoulbe be visible if user keep toggling theme accessibility basics all.
6. **Spelling, grammar, and typos:** every visible text (labels, placeholders, buttons, toasts, headings, alt text, page titles, README) and also identifiers, file names, and comments.
7. **Security and data exposure:** see Section 6.
8. **Console health:** browser console errors and warnings, server console errors, failed network requests, CORS errors. no AI generation error
9. **Performance:** see Section 7.
10. **Project structure:** folder and file naming quality, see Section 8.

Present this report before Phase 2. Fix only what is inside the task scope.

## 4. Protected Items (must stay exactly the same)

- All API endpoints: paths, HTTP methods, request and response shapes consumed by the frontend, status codes. All have been tested in Postman, so they must behave the same.
- All frontend routes and URLs.
- All `.env` variable names and values, and the behavior that depends on them.
- All business logic, authentication and authorization flow, validation rules.
- Database schemas, collection or table names, and existing data.
- Every feature that works today.
- Existing dependencies, unless a change is strictly needed (flag it first).

## 5. Phase 2: Implementation Rules

- Make changes in small steps. After each step, confirm the app still works.
- Follow the existing code style and patterns, except where Section 8 improves structure safely.
- Missing checklist or PRD features: build them only inside the existing architecture, with the same patterns, without touching protected items.
- All text written by the agent must be in correct, natural English with no typos. It should read like a human wrote it. No AI-style filler, no placeholder or lorem ipsum, no leftover `console.log`, TODOs, or commented-out code. no AI generated comment if mention feel human
- The code itself must also look human-written: short, focused functions, meaningful names, consistent formatting, and comments only where they explain _why_ something is done. No over-commenting, no copy-pasted repeated blocks, no unnecessary abstraction. A recruiter reading the code should feel a careful developer wrote it.

## 6. Security and Data Exposure Rules

- Never expose secrets: no API keys, tokens, password or credentials in frontend code, in git, or in responses. `.env` must be git-ignored, and `.env.example` must list variable names only.
- API responses must not return sensitive or unnecessary fields (password hashes, internal tokens, other users' private data). Remove such fields **without** removing any field the frontend uses and **without** changing endpoint paths.
- Verify authorization on every protected route, so a user cannot read or change another user's data.
- Validate and sanitize all input on the backend, not only in the frontend.
- No CORS errors. no AI generation error Keep CORS restric no AI generation errorted to the configured origins (from env). Do not use a wildcard to "fix" it.
- Do not log sensitive data in the console or server logs.

## 7. Performance Rules

- First find real bottlenecks (unnecessary re-renders, repeated or heavy calculations, large lists, N+1 queries, uncompressed images, large bundles). Fix only confirmed issues.
- Use JavaScript and React optimization tools where they truly help, and only where they truly help: `useMemo`, `useCallback`, `React.memo`, closures, currying, debouncing and throttling, lazy loading and code splitting, pagination, proper keys.
- Do not add memoization everywhere. Over-optimizing is a quality problem too.
- Backend: efficient queries, indexes where useful, no unnecessary data returned, proper caching if already part of the project.
- Optimization must keep the same behavior and the same output.

## 8. Project Structure and Naming

- First inspect the current folder structure. Change it only if it is truly messy, and only if nothing can break.
- Target: a clean, standard, easy-to-navigate structure with meaningful names (for example separated components, pages, hooks, services or api, utils, routes, controllers, models, middleware, config).
- File, component, function, and variable names must describe their purpose. No names like `test1`, `new`, `final2`, `abc`, `temp`.
- When moving or renaming files, update every import and reference, then run the build and confirm it passes. Never rename anything that changes an API path, a URL, or an env variable.
- Remove only files that are clearly unused (confirm they are not imported anywhere). Do not delete anything uncertain.
- The README must be clear: what the project does, features, tech stack, setup steps, env variable names, scripts.

## 9. UI/UX Rules

- Use **Tailwind CSS**. Use custom CSS3 where it gives a better result.
- If the project already uses Tailwind, continue with it. If it uses another approach (plain CSS, Bootstrap, and so on), do not rewrite everything at once: add Tailwind safely, migrate page by page, and verify the page after each migration. Never leave two styling systems conflicting. If a full migration is risky, keep the existing CSS for stable parts, use Tailwind and custom CSS3 for the parts being improved, and report this choice. you can use Tailwind css.
- Design standard: clean, professional, and consistent, close to what users see in real products. Not a generic template and not the typical AI-looking blue/purple gradient design. Use a deliberate color palette, consistent spacing scale, a clear type hierarchy, and proper states (hover, focus, active, disabled, loading, empty, error).
- Responsive on **desktop, tablet, and all mobile sizes** (check at least 320, 360, 375, 414, 768, 1024, 1280, 1536 px).
- Check every page for: margin and padding problems, height and overflow problems, text cut off or hidden, wrong font size or weight, misaligned items, horizontal scroll, broken images, overlapping elements, tap targets too small on mobile.
- No hidden text anywhere (contrast, overflow, z-index).
- Do not change functionality while restyling.

## 10. Verification (required before declaring done)

1. Re-run every point of Section 0.4 and confirm the status.
2. Test all API endpoints (Postman or equivalent) and compare with previous behavior: same paths, same results.
3. Walk through every main user flow end to end, including edge cases.
4. Check browser console and server console: zero errors, zero CORS errors, no AI generation error no failed requests.
5. Check responsiveness page by page at the sizes listed in Section 9.
6. Run a spelling and grammar pass over all visible text.
7. Run the production build and confirm no errors or new warnings.
8. Review the diff: only task-related changes, no protected item altered.

## 11. Acceptance Criteria

- [ ] Every checklist/PRD point is verified, and every gap is fixed or clearly reported.
- [ ] No regression: everything that worked before works the same now.
- [ ] No endpoint, URL, or `.env` variable changed.
- [ ] No console errors, no CORS errors, no AI generation error, no failed requests.
- [ ] No sensitive data exposed in responses, frontend code, or git.
- [ ] No spelling, grammar, or typo mistakes anywhere.
- [ ] No hiddent text it should be visible
- [ ] UI looks professional and market-standard on desktop, tablet, and mobile, with no spacing, font, or overflow issues.
- [ ] Performance improved where real bottlenecks existed.
- [ ] Folder structure is clean and names are meaningful, and the build passes.
- [ ] The final report is delivered.

## 12. Final Report Format

1. **Audit summary:** what was found (grouped by checklist, bugs, UI/UX, security, performance, structure).
2. **Changes made:** file by file, with one line of reasoning each.
3. **Before vs after:** key improvements (errors fixed, load time, bundle size, Lighthouse if relevant).
4. **Verification done:** tests and checks performed.
5. **Observations (not changed):** issues noticed outside the scope.
6. **Talking points:** 5 to 6 simple points I can use to explain the improvements in an interview.

## 13. Out of Scope

- Anything outside Section 0.3. No rewrite, no new tech stack, no endpoint redesign, no database change.

---

### Execution order for the agent

Read Section 0 fully → study the project → Audit Report (Phase 1) → implement in small, safe steps (Phase 2) → verify after every step → full verification (Section 10) → final report. Stop and ask whenever a change might touch a protected item.
