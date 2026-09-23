---
id: 1
title: "Create listing form and listings page"
epic: "Local-Life Sublet Prototype"
status: todo
created: 2026-09-23T01:44:40+00:00
---

# Master Controller Sprint Definition — Sprint 1

**Epic:** Local-Life Sublet Prototype — a sublet listing app where hosts post a place to stay plus three local tips, so a guest gets a snapshot of the host's local knowledge.
**Sprint Objective:** Scaffold the app and deliver the host's create-listing form and the all-listings page, so a listing can be created and immediately seen (PRD §9 criteria 1 and 2).

> **LiveQA environment for this epic.** The live artifact is this app's own production build run locally: `npm run build`, then `npm run preview`, opened in a real browser at the URL Vite prints. The user chose this target explicitly over a hosted deploy. This repository is a *downstream install* of the fully-completely framework, not the framework's own source repository — there is no npm package to publish here, and CLAUDE.md's `## Changes to this repo's own tooling` live test ("install the newly published package") does not apply. There is no version bump and no publish anywhere in this epic. If the preview server does not start, LiveQA obtains a working one — check the build output, the Node version, the printed port — and only if it genuinely cannot, records exactly what was attempted and the exact failure text. A bare claim that live testing is unavailable here is not an acceptable outcome; a browser and a local production build are both available on this machine.

### Context

The PRD (§1) describes a learning prototype: create, browse, and view listings, nothing more. No app exists yet — this repository contains only the sprint framework and has no `package.json`. So this sprint carries the scaffold as well as the first two screens. A scaffold-only sprint was considered and rejected: it would give LiveQA nothing to verify but "the app boots," which is bookkeeping rather than a real gate.

The user chose **in-memory storage** over browser storage or a backend, deliberately, for scope. That choice has one genuine consequence that this sprint must design around rather than discover later: PRD §3's core flow is listings → detail → back, and if that navigation triggers a full page load, the store is wiped and the guest lands on an empty page. The mitigation is architectural and costs nothing — client-side routing only, with the store lifted above the router — and it is written below as Req 4 rather than left to chance. Listings vanishing on a browser refresh is *expected behaviour* for this build, not a defect; listings vanishing while navigating between screens is a defect.

### Requirements

1. **Scaffold the application.** Vite + React + TypeScript, in this repository's root. `npm install`, `npm run dev`, `npm run build`, and `npm run preview` must all succeed from a clean checkout. A lint script and a test script must exist and pass. Remove Vite's default demo content (the counter, the Vite/React logos, the boilerplate CSS) — the app's own screens are the only thing that should render.
2. **Define the `Listing` type** in a single shared module, with exactly these fields and no others: `id` (string, unique, generated at creation — not the array index, since sprint 2 routes on it), `title` (string), `neighbourhood` (string), `price` (string), `availableFrom` (string, ISO `YYYY-MM-DD`), `availableUntil` (string, ISO `YYYY-MM-DD`), `tipFood` (string), `tipActivity` (string), `tipNeighbourhood` (string). **`price` is deliberately a free-text string**, not a number — PRD §4's own example is `"$1,200/month"`, which carries a currency symbol and a billing period. Do not "fix" this to a number; a future sprint can migrate it if sorting is ever needed.
3. **Hold listings in an in-memory store** — React state in a provider, exposing the current listings and an "add a listing" operation. No `localStorage`, no `sessionStorage`, no IndexedDB, no backend, no database, no network calls of any kind. A refresh clearing every listing is the intended behaviour of this build.
4. **Client-side routing only; the store is mounted above the router.** Navigation between screens must not cause a full page load, and must not reset the store. Anchor tags that trigger a browser navigation (`<a href>` to an in-app route, `window.location` assignment, a `<form>` whose default submit is not prevented) are defects, not style choices. The provider from Req 3 must sit above the router in the component tree so no route change can unmount it.
5. **Build Screen 1, "Create a Listing"** (PRD §4), at its own route. Eight fields: Listing Title, Neighbourhood, Price, Available From (date input), Available Until (date input), and three local tips. **The three tip fields carry their category labels on the form itself** — food/coffee, activity/place, neighbourhood tip — resolving the PRD's own §4/§6 contradiction in favour of §6's labels, per the user's decision. A single "Post Listing" action submits.
6. **Validate the form before it submits.** Title, Neighbourhood, Price, Available From, and Available Until are required and must be non-empty. Available Until must not be earlier than Available From. **The three tips are optional** — PRD §9 says "up to three local tips", so a listing with one tip or none must post successfully. On a validation failure, show the user which field is wrong, in the page, and do not add the listing. Do not use `alert()`.
7. **A successful submit adds the listing and lands the host on the listings page**, with the new listing visible there, without a full page load.
8. **Build Screen 2, "All Listings"** (PRD §5), at its own route, showing every listing in the store. Each row shows exactly the four fields §5 names: title, neighbourhood, price, and the available dates. Each row is clickable and reachable by keyboard. In this sprint the click target exists but its destination is sprint 2's; wire it to a route that does not 404, and do not build the detail page here.
9. **The listings page has a real empty state.** On first load the store is empty — the PRD never specifies this screen, so: a short line saying there are no listings yet, plus a link to the create-listing screen. An empty page, a bare `[]`, or a crash is a failure of this requirement.
10. **Dates render in one consistent format, identical everywhere they appear.** Pick a single human-readable format, apply it through one shared helper, and document the choice in a comment. Sprint 2 will reuse that helper — do not implement the formatting inline at each call site.

### Acceptance Criteria

QA1 verifies these by reading the diff. No browser — that is LiveQA's gate, and neither substitutes for the other.

- **Req 1:** `package.json` exists with `dev`, `build`, `preview`, lint and test scripts. Vite's boilerplate (counter state, logo assets, default CSS) is gone from the diff, not merely hidden. Confirm the build and test scripts actually run clean.
- **Req 2:** the `Listing` type exists in one shared module with exactly the nine named fields. `price` is typed `string`. `id` is generated per listing (e.g. `crypto.randomUUID()`), never derived from array position.
- **Req 3:** grep the diff for `localStorage`, `sessionStorage`, `indexedDB`, `fetch`, `axios` — any hit is a FAIL against this requirement. Store state is React state in a provider.
- **Req 4:** the provider wraps the router in the component tree, not the reverse. No `<a href>` pointing at an in-app route, no `window.location` navigation, and the create form calls `preventDefault()` on submit. This requirement is the one most likely to be satisfied *accidentally* — check the tree order explicitly rather than assuming it.
- **Req 5:** all eight fields present; the two date fields are date inputs; the three tip inputs carry visible category labels (food/coffee, activity/place, neighbourhood), not "Tip 1/2/3".
- **Req 6:** the five required fields are validated non-empty; `availableUntil >= availableFrom` is checked; the three tips are *not* required. Validation failure renders a message in the DOM — assert on the rendered error text itself, not only that submission was blocked. No `alert()` in the diff.
- **Req 7:** the submit handler adds to the store and navigates via the client-side router.
- **Req 8:** the listings page maps the store and renders exactly title, neighbourhood, price, dates per row. The row is clickable and keyboard-reachable; its target route resolves rather than 404ing.
- **Req 9:** an explicit empty-listings branch exists, rendering a message and a link to the create screen.
- **Req 10:** one shared date-formatting helper, used by every date render site in the diff. Inline `toLocaleDateString` calls scattered at call sites fail this.

**LiveQA live-test criteria** (after Pipeman pushes; real browser against `npm run build && npm run preview`):

- Post a listing with all eight fields filled. It appears on the listings page with title, neighbourhood, price and dates correct.
- Post a second listing with **zero** tips filled. It posts successfully and appears — this is the "up to three" behaviour, and a build that rejects it is a FAIL.
- Submit the form with Title empty. A visible error names the problem and no listing is added.
- Submit with Available Until earlier than Available From. A visible error appears and no listing is added.
- With listings in the store, navigate between the create screen and the listings screen and back. **The listings must still be there.** Store loss during in-app navigation is a FAIL against Req 4.
- Press browser refresh. **Listings disappearing here is expected and correct** — do not record it as a defect. If this is the only issue found, the verdict is PASS.
- Load the listings page in a fresh session with an empty store. The empty-state message and the link to the create screen both render.

### Out of Scope

- **The listing detail page (PRD §6)** — that is sprint 2. This sprint wires the click target only.
- **Persistence of any kind** — localStorage, a backend, a database. The user chose in-memory deliberately; revisit only as a future sprint.
- **Everything in PRD §7:** photos, maps, accounts/login, booking, payments, messaging, reviews, search filters, home exchange, availability calendars, notifications.
- **Everything in PRD §8's future list** — home exchange, profiles, verification, etc. Not this epic.
- **Editing or deleting a listing.** The PRD's flow is create-and-view only; neither screen has an edit or delete action.
- **Seed/demo listings.** The PRD doesn't ask for them, and Req 9's empty state is the honest first-load experience. Adding fake listings would also hide an empty-state bug from LiveQA.
- **Any npm publish or version bump.** This is a downstream install, not the framework's source repo. See the header.

### Dependencies

- **Blocks:** Sprint 2 — the detail page needs the `Listing` type (Req 2), the store (Req 3), the router (Req 4), and the date helper (Req 10) to exist first.
- **Blocked by:** nothing. This is the first sprint in the epic.
- **External:** none. Node v24.21.0 and npm 11.19.0 are installed and confirmed present on this machine. No hosting account, no API keys, no third-party service.

### Team Assignments

- **Dev Team 1:** the whole sprint — scaffold, type, store, both screens.
- **Dev Team 2:** not assigned. Sprint 2 is the only other sprint in this epic and it is **not** independent of this one: it reads the same `Listing` type, the same store, the same router, and the same date helper that this sprint creates. Per CLAUDE.md, that is a sequential dependency, not a parallel one, and Dev Team 2 exists for a genuinely separate sprint rather than for splitting one sprint's work. No worktree is needed for this epic as planned.

### Risks & Mitigations

- **A full page load during in-app navigation silently wipes the store** — the main flow, broken, and easy to introduce with one stray `<a href>`. Mitigated by Req 4 as a hard requirement, a QA1 criterion that checks component-tree order explicitly, and a LiveQA navigation test that would catch it live.
- **QA1 or LiveQA reads "refresh clears listings" as a defect and fails the sprint.** Mitigated by stating in Req 3, in the LiveQA criteria, and here that this is intended behaviour of the chosen design.
- **Vite's scaffold leaves boilerplate behind** that reads as sloppy and confuses the audit. Mitigated by making its removal an explicit clause of Req 1 and a QA1 criterion.
- **`price` gets "corrected" to a number** by an engineer reasonably assuming money should be numeric, breaking PRD §4's own `"$1,200/month"` example. Mitigated by the explicit note in Req 2 and the typed check in the acceptance criteria.
- **Date handling drifts between the two screens** and then between sprints. Mitigated by Req 10's single shared helper, which sprint 2 inherits rather than reinvents.
