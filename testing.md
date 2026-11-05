# SPEC: Bug Hunt and Refinement of an Existing Full-Stack Project


### 0.1 Project name and type
```
[ PROJECT NAME: Imgixy]

```

### 0.2 Tech stack and how to run it
```
```
for UI/UX: HTML5 CSS3,Tailwaind CSS,
and this is MERN project hope you know what tech stack should be use
- React
- React Router
- Express
- MongoDB
- CSS3
- Tailwind CSS
- OAuth

```
for client: npm run dev 
for server: npm start
Note: it is already started so you can test
```

### 0.3 Task for this run

Find and fix all bugs across the whole project, including hidden text visibility, responsiveness, typos, and checklist verification. ensure test all feature functionality UI looks ok and good none of issue/bugs will be left,console error,cors error on deployment, responsivenes, any css hidden issue or need adjecement fix it, I mention below read it.

tumhare kam hai bug to find krna hai lekin niche diya gaye problem statment/PRD/checklist ko bhi check krke weather all feature covered sabhi batai gaye feature covered hai a/c to PRD/checklist/PS sabhi check kro properly sabhi chicho test varify kro all should be 


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

NOTE: if you unabled to read this cheklist so must open below link open it open this below link where present exact checklist that present above

Open link: https://files.cdn.thinkific.com/file_uploads/887743/attachments/357/167/3b4/kaviosPix.pdf

- read properly for testing & varify ensure all should work and all checklist featured covered.
- every missing checklist point should be cover.
- read properly for testing & varify ensure all should work.
- test all this problem statement feature on browser check if any missing of them and fix the issue nothing will be left
- read properly for testing & varify ensure all should work and all checklist featured covered.
 
### 0.5 Test accounts (optional)


### 0.6 Known problems (optional)

```
[ PAGES, THEMES, OR SCREEN SIZES WHERE I ALREADY SEE PROBLEMS ]
```

### 0.7 Market benchmark (optional)


## 1. Type and Intent
- **Type:** Bug Hunt, Verification, and Refinement (NOT a redesign, NOT a rebuild)
- **Goal:** The project already works and the UI already looks good. Find and fix every remaining bug and small problem, verify every checklist point, and polish the details so that no recruiter can find a mistake.
- **Why:** Mentor feedback said the basics are missing: error messages, functionality, edge cases, UI/UX, spelling and grammar. Recruiters compare projects with real products and notice small mistakes immediately. The quality must feel carefully built, not "kaam chalau" (just-working).

## 2. Scope Lock
1. Work only on the task in Section 0.3 and on verifying Section 0.4. If the task says "whole project", the whole project is in scope. Otherwise only the named parts.
2. Do **not** redesign the UI. Keep the current layout, colors, branding, and structure. Only fix and refine: spacing, alignment, fonts, contrast, overflow, and similar details.
3. Do **not** touch anything outside the scope. If something outside looks wrong, list it under "Observations (not changed)".
4. If a fix might affect a protected item (Section 3), stop and ask first. If anything is unclear, ask. Do not guess.
5. ensure while preserving this project you have to work on this task 

## 3. Protected Items (must stay exactly the same)
- **Authentication and authorization:** it was implemented by me and it works. Do **not** remove, replace, or rewrite it. Only test and verify it (register, login, logout, token or session expiry, protected routes, role access, wrong password, duplicate account, refresh while logged in). If a real bug is found, report it and fix it with the smallest possible change.
- All API endpoints: paths, methods, request and response shapes used by the frontend, status codes (already tested in Postman).
- All frontend routes and URLs.
- All `.env` variable names and values.
- All business logic, validation rules, database schemas, and existing data.
- Every feature that works today.
- Existing dependencies, unless strictly needed (flag first).
- presserve this project while doing this

## 4. Phase 1: Test and Find Bugs (no code changes in this phase)
Run the frontend and backend locally and test everything thoroughly. Produce a **Bug Log** with: ID, page or file, description, severity (high / medium / low), and how to reproduce.

### 4.1 Checklist verification
- Test every point in Section 0.4 and mark it ✅ working, ⚠️ partial or buggy, ❌ missing.
- Test each feature end to end: UI → API → database → response → UI.


### 4.2 Responsiveness audit
Test at widths 320, 360, 375, 390, 414, 600, 768, 820, 1024, 1280, 1440, and 1920 px, plus mobile landscape and browser zoom up to 200%.
- Margin, padding, gap, and height problems, text cut off or overlapping, horizontal scroll, overflow, wrong font size or weight, misalignment, broken images, tables on small screens, sticky header or footer overlap, small tap targets, modal sizing, and mobile keyboard overlap on forms.
- Navbar, menus, forms, cards, lists, and every page behave correctly on desktop, tablet, and all mobile sizes.

### 4.4 Text, spelling, and grammar
Check all visible text (headings, labels, buttons, placeholders, toasts, error messages, empty states, page titles, alt text, 404 page), and also file and variable names, comments, and README. Error messages must be clear and human, with no raw errors, stack traces, or "undefined" shown.

### 4.5 Functionality and edge cases
Empty states, invalid input, very long input, duplicate actions, double clicks, expired session, network failure, slow network, deleted or missing data, back and forward browser buttons, refresh in the middle of a flow, and invalid URLs.

### 4.6 Console, network, and security
- Browser console: zero errors and zero warnings that matter. Network tab: no failed requests and no CORS errors. Server console: no errors.
- API responses must not expose sensitive data (password hashes, tokens, other users' private data, internal fields). Remove such fields **without** removing anything the frontend uses and **without** changing endpoints.
- No secrets in frontend code or git. `.env` ignored by git, `.env.example` with names only.
- Backend input validation and route authorization are in place. CORS stays restricted to configured origins (no wildcard shortcut).

### 4.7 Performance
Find real bottlenecks only (unnecessary re-renders, heavy repeated calculations, large lists, N+1 queries, large images, large bundles).

### 4.8 Structure and naming
Review the folder structure and file names. Note what is messy or unclear.

## 5. Phase 2: Fix and Refine
- Fix bugs in order of severity. Make small, safe steps, and re-test after each fix.
- **Performance:** use `useMemo`, `useCallback`, `React.memo`, closures, currying, debounce and throttle, lazy loading, pagination, and proper keys only where a real bottleneck exists. Do not add them everywhere. Same behavior and same output after optimization.
- **Structure:** if the folder structure is messy, improve it safely: clear folders (components, pages, hooks, services or api, utils, routes, controllers, models, middleware, config) and meaningful file and function names (no `test1`, `final2`, `temp`). When moving or renaming, update every import, run the build, and confirm it passes. Never rename anything that changes an API path, URL, or env variable. Delete only files that are clearly unused.
- **Missing checklist features:** build them inside the existing architecture, using the existing patterns.
- **Writing and code quality:** all text must be correct, natural English with no typos. The code must look human-written: short focused functions, meaningful names, and comments only where they explain why. No AI-style filler, no lorem ipsum, no leftover `console.log`, TODOs, or commented-out code.

## 6. Browser Testing and Evidence (required)
- Test in a real browser use my chrome if the agent can run one (for example browser automation or a browser tool). Test both themes and the screen sizes in Section 4.3. Capture before and after screenshots for every UI fix.
- Test the whole auth flow and all checklist features in the browser, and check the console and network tab during the test.
- If the agent cannot run a browser, it must say so clearly, perform a careful code-level review of theme and layout, and give me a short manual test list for the parts it could not verify. It must never claim something was tested when it was not.

## 7. Final Verification
1. Re-run every checklist point in the browser.
2. Test all API endpoints (Postman or equivalent), and confirm paths and results are unchanged.
3. Re-check both themes on every page and every state.
4. Re-check all screen sizes.
5. Re-check console, network, and CORS, AI generation error.
6. Run a spelling and grammar pass.
7. Run the production build with no errors or new warnings.
8. Review the diff: only task-related changes, no protected item changed (especially auth, endpoints, URLs, env).

## 8. Acceptance Criteria
- [ ] Every checklist point is verified and working, and every gap is fixed or clearly reported.
- [ ] Authentication still works exactly as before.
- [ ] All text is visible and readable in both dark and light themes on every page and state.
- [ ] No layout, spacing, font, or overflow issues on desktop, tablet, and mobile.
- [ ] No spelling, grammar, or typo mistakes anywhere.
- [ ] No console errors, no CORS errors, no failed requests.
- [ ] No sensitive data exposure.
- [ ] No regression: everything that worked before works the same now.
- [ ] No endpoint, URL, or `.env` variable changed.
- [ ] Folder structure is clean, names are meaningful, and the build passes.
- [ ] Evidence (screenshots or test notes) is provided for the fixes.

## 9. Final Report Format
1. **Bug Log:** ID, page, problem, severity, fix, files changed, status.
2. **Checklist result:** each point with its final status.
3. **Theme and responsiveness results:** what was found and fixed, with before and after evidence.
4. **Verification done:** what was tested in the browser and what was not.
5. **Observations (not changed):** issues noticed outside the scope.
6. **Talking points:** 5 to 6 simple points I can use to explain the improvements in an interview.

## 10. Out of Scope
- Anything outside Section 0.3. No redesign, no rewrite, no new tech stack, no endpoint changes, no authentication replacement, no database change preserve this functionality,logic and work on specified task.

---

### Execution order for the agent
Read Section 0 fully → run the project → test everything in the browser and build the Bug Log (Phase 1) → fix in small safe steps (Phase 2) → verify after every fix → full verification (Section 7) → final report. Stop and ask whenever a change might touch a protected item.