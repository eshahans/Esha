---
id: 2
title: "Listing detail page and navigation"
epic: "Local-Life Sublet Prototype"
status: todo
created: 2026-09-23T01:44:47+00:00
---

# Master Controller Sprint Definition — Sprint 2

**Epic:** Local-Life Sublet Prototype — a sublet listing app where hosts post a place to stay plus three local tips, so a guest gets a snapshot of the host's local knowledge.
**Sprint Objective:** Deliver the listing detail page and the navigation into and out of it, completing PRD §9 criteria 3 and 4 and closing the epic's core flow.

> **LiveQA environment for this epic.** The live artifact is this app's own production build run locally: `npm run build`, then `npm run preview`, opened in a real browser at the URL Vite prints. The user chose this target explicitly over a hosted deploy. This repository is a *downstream install* of the fully-completely framework, not the framework's own source repository — there is no npm package to publish here, and CLAUDE.md's `## Changes to this repo's own tooling` live test ("install the newly published package") does not apply. There is no version bump and no publish anywhere in this epic. If the preview server does not start, LiveQA obtains a working one — check the build output, the Node version, the printed port — and only if it genuinely cannot, records exactly what was attempted and the exact failure text. A bare claim that live testing is unavailable here is not an acceptable outcome; a browser and a local production build are both available on this machine.

### Context

Sprint 1 delivers create-and-browse. This sprint delivers the payoff: the screen where the host's three local tips actually reach the guest, which is the whole reason PRD §1 claims this is "more useful than a basic accommodation listing." Without it the epic has no product, only a form.

This sprint carries the one hard consequence of the in-memory store that sprint 1 could defer. The detail page routes on a listing `id`, and an in-memory store is empty on any fresh page load — so a refresh on the detail page, or a pasted detail URL, resolves to an id that is not in the store. That path must render a real "listing not found" state rather than crashing or white-screening on an undefined listing. This is not an edge case to skip; it is one keypress away from the main flow, and it is the single most likely way this build breaks in front of someone.

### Requirements

1. **Add a detail route keyed on the listing id** — `/listings/:id` or equivalent — reading the id from the route parameter and looking the listing up in the store sprint 1 built. Reuse that store and that router. Do not introduce a second store, a second source of truth, or prop-drilling of the selected listing around the router.
2. **Display the four property fields** PRD §6 names: Listing Title, Neighbourhood, Price, Available Dates. Dates render through **sprint 1's shared date helper** (sprint 1 Req 10) in the identical format the listings page uses — do not re-implement formatting here, and do not let the two screens disagree about how a date looks.
3. **Display the "Local-Life Bundle"** — the three tips under that heading, each under its own category label: coffee/food recommendation, activity/place recommendation, neighbourhood tip. Plain text, per PRD §6 ("The tips should simply be displayed as text"). No maps, no links, no enrichment of any kind.
4. **Handle tips that are empty.** Sprint 1 makes tips optional (PRD §9's "up to three"), so a listing may have one, two, or zero. An empty tip must not render as a dangling label with blank space after it, and a listing with zero tips must not render an empty "Local-Life Bundle" heading with nothing beneath it. Decide one coherent treatment — omit the empty entries, and omit the section heading entirely when all three are empty — and apply it consistently.
5. **Handle an id that is not in the store.** A refresh on the detail page, or a directly-pasted detail URL, will hit this on every run, because the store is empty on a fresh load by design. Render a clear "listing not found" message with a working link back to the listings page. **A crash, a white screen, a blank page, or a thrown `undefined` read is a FAIL.** Do not attempt to solve this by adding persistence — that is explicitly out of scope below.
6. **Add the "Back to Listings" action** PRD §6 requires, navigating client-side to the listings page with no full page load and no store reset.
7. **Wire the listings-page row through to the detail page.** Sprint 1 left the click target pointing at a non-404 placeholder route; this sprint makes it open that listing's own detail page. Clicking a row must open *that* row's listing, not the first one and not a stale one — the id must come from the row's own listing.
8. **All navigation added here stays client-side.** Same constraint as sprint 1 Req 4, restated because this sprint adds the two navigations most likely to break it: the row click and the back action. No `<a href>` to an in-app route, no `window.location` assignment.

### Acceptance Criteria

QA1 verifies these by reading the diff. No browser — that is LiveQA's gate, and neither substitutes for the other.

- **Req 1:** a route with an id parameter exists; the component reads that param and looks up the listing in sprint 1's existing store. Confirm no second store, context, or global was introduced.
- **Req 2:** all four fields render, and the date render calls sprint 1's shared helper. A local `toLocaleDateString` or a hand-rolled format string in this diff fails this criterion.
- **Req 3:** a "Local-Life Bundle" heading with the three tips beneath it, each carrying its own category label matching sprint 1's form labels. Assert the rendered labels, not just that three values are output.
- **Req 4:** there is an explicit branch for an empty tip value, and an explicit branch for all-three-empty that suppresses the heading. Trace what renders for a listing with zero tips — a bare heading over nothing fails.
- **Req 5:** there is an explicit not-found branch guarding every read of the listing. Confirm the field reads happen *inside* that guard — a guard that renders a message but still evaluates `listing.title` above it will still throw. This is the requirement most likely to be written as a comment rather than as code; read it carefully.
- **Req 6:** a back control exists and navigates through the client-side router.
- **Req 7:** the listings row passes its own listing's `id`. Check this is the row's id and not a captured outer-scope variable, a shared index, or a stale closure — a bug here shows every row opening the same listing.
- **Req 8:** grep this diff for `<a href` targeting an in-app path and for `window.location` — any hit is a FAIL.
- **Cross-cutting:** sprint 1's requirements must still hold. Confirm nothing here introduced `localStorage`, `sessionStorage`, `indexedDB`, `fetch`, or a backend call, and that the store provider still sits above the router.

**LiveQA live-test criteria** (after Pipeman pushes; real browser against `npm run build && npm run preview`):

- Post a listing with all three tips. Open it from the listings page. Title, neighbourhood, price and dates all match what was entered, and the date format is identical to the listings page's.
- All three tips render under the Local-Life Bundle heading with their category labels, as plain text.
- Post a **second, different** listing. From the listings page, click the second row. **The second listing opens, not the first.** This is Req 7's failure mode and it is invisible with only one listing in the store — two are required for this test to mean anything.
- Post a listing with only one tip filled. Open it: the one tip renders, and there is no dangling empty label or blank gap where the other two would be.
- Post a listing with zero tips. Open it: no empty "Local-Life Bundle" heading over nothing.
- Click "Back to Listings". The listings page renders and **every listing is still there.**
- With a listing open, press browser refresh. The page must show the "listing not found" message and a working link back — **not a crash, not a white screen.** This is Req 5 and it is the sharpest test in this sprint. Store loss on refresh is expected; a crash is not.
- From that not-found screen, follow the link back to the listings page. It loads (empty, correctly — the store was cleared by the refresh) and the empty state renders.
- Navigate listings → detail → back → detail again without refreshing. Listings survive throughout.

### Out of Scope

- **Adding persistence to make the refresh case work.** This is the tempting "while we're in there" fix and it is explicitly forbidden this sprint. The user chose in-memory deliberately; Req 5 handles the consequence honestly with a not-found state. If persistence is wanted, it is a future sprint with its own definition, not a mid-flight redesign.
- **Editing or deleting a listing from the detail page.** The PRD's flow is create-and-view; neither action exists in it.
- **Sharing, copying, or deep-linking a listing URL as a feature.** The URL will contain an id, but making it survive a share is a persistence feature — see above.
- **Everything in PRD §7:** photos, maps, accounts/login, booking, payments, messaging, reviews, search filters, home exchange, availability calendars, notifications. In particular, no map or link enrichment on the tips — PRD §6 says plain text.
- **Everything in PRD §8's future list.** Not this epic.
- **Any npm publish or version bump.** Downstream install, not the framework's source repo. See the header.

### Dependencies

- **Blocks:** nothing. This is the last sprint in the epic as planned; closing it completes all four of PRD §9's success criteria.
- **Blocked by:** **Sprint 1, fully closed.** This sprint reads sprint 1's `Listing` type, store, router and date helper. Do not start it while sprint 1 is still in its build or gate loop — a moving type or a moving store shape underneath this work is exactly the collision the framework's sequencing rules exist to prevent.
- **External:** none. Node v24.21.0 and npm 11.19.0 confirmed present. No hosting account, no API keys, no third-party service.

### Team Assignments

- **Dev Team 1:** the whole sprint. Same team as sprint 1, deliberately — this sprint extends sprint 1's own store, router, type and date helper, so the context carries over and there is nothing to hand across a boundary.
- **Dev Team 2:** not assigned. There is no second independent sprint in this epic to run in parallel; this sprint depends on sprint 1's shared files and types, which makes it sequential work, not parallel work. No worktree needed.

### Risks & Mitigations

- **Every row opens the same listing** — a stale closure or a shared index instead of the row's own id. Invisible with one listing in the store, which is the state most casual testing is in. Mitigated by Req 7, a QA1 criterion naming the specific bug shape, and a LiveQA test that mandates a *second* listing.
- **A refresh on the detail page white-screens** on an undefined listing read. The most likely live failure in this build. Mitigated by Req 5, a QA1 criterion that checks the field reads sit inside the guard rather than above it, and a dedicated LiveQA refresh test.
- **Someone "fixes" the refresh case by adding localStorage** mid-sprint, quietly reversing a decision the user made explicitly. Mitigated by naming it as the first Out of Scope item and by a cross-cutting QA1 grep.
- **The two screens format dates differently**, which reads as a bug even though both are individually correct. Mitigated by Req 2 forcing reuse of sprint 1's single helper, and a QA1 criterion that fails a locally re-implemented format.
- **Tip labels drift** between sprint 1's form and this detail page, so a host's coffee tip appears under "neighbourhood". Mitigated by Req 3 requiring the labels match sprint 1's, and a QA1 criterion asserting on the rendered label text.
