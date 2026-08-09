# Day 16 Ticket Refactor Rationale

Two refactors were applied to the Support Desk project: one in the backend ticket service, one
in the frontend ticket form. Neither was allowed to change what the API returns or what the user
sees. This document explains what moved, why, and how that was proved.

## Files changed

```text
src/main/java/com/example/supportdesk/service/TicketService.java
frontend/support-desk-ui/src/components/TicketFormWizard.jsx
frontend/support-desk-ui/src/components/TicketSummaryCards.jsx
frontend/support-desk-ui/src/utils/ticketFormValidation.js          (new)
frontend/support-desk-ui/src/utils/ticketFormValidation.test.js     (new)
frontend/support-desk-ui/src/components/TicketFormWizard.test.jsx
frontend/support-desk-ui/src/components/TicketSummaryCards.test.jsx
requests/day16.http                                                 (new)
```

---

## 1. What the code looked like before

**Backend.** `updateTicket()` did four jobs in one block: load the ticket, trim five fields,
validate status and priority, then check the title was not already taken. The
`findById(...).orElseThrow(...)` lookup was written out twice, once here and once in
`getTicketById()`. `getAllTickets()` repeated `x != null && !x.trim().isEmpty()` three times.

**Frontend.** `TicketFormWizard.jsx` held a 40-line `validateStep()` function inside the
component. The rules could only be exercised by rendering the whole form and clicking through
three steps. The allowed status and priority lists were declared next to the JSX, and
`handleSubmit` repeated the same trimming the validation had already done.

---

## 2. What changed

### Logic extracted from `TicketService`

| Helper | Replaced |
|---|---|
| `findTicketOrThrow(String id)` | two copies of `findById().orElseThrow()` |
| `normalizeRequired(String)` | five separate `.trim()` calls |
| `normalizeStatus(String)` | `trim()` + `validateStatus()` |
| `normalizePriority(String)` | `trim()` + `validatePriority()` |
| `ensureTitleIsUniqueForUpdate(Ticket, String)` | inline two-condition duplicate check |
| `hasText(String)` | three copies of the null/blank filter check |

`validateStatus()` and `validatePriority()` were replaced rather than kept, because trimming and
checking always happened together. Merging them removes the chance of a later caller validating
an untrimmed value.

### Logic extracted from `TicketFormWizard`

| Function in `utils/ticketFormValidation.js` | Responsibility |
|---|---|
| `validateTicketFormStep(formValues, step, reviewConfirmed)` | all per-step rules; returns `{field: message}` |
| `isTicketFormStepValid(...)` | boolean wrapper |
| `normalizeTicketFormPayload(formValues)` | trims text, sends `null` for a blank `assignedTo` |
| `formatTicketFormLabel(key)` | the label shown on the review step |
| `TICKET_STATUS_OPTIONS`, `TICKET_PRIORITY_OPTIONS` | allowed values, now one source of truth |

`validateStep()` in the component went from 40 lines to 5. The `reviewCheckboxRef` stayed in the
component: a DOM ref cannot travel into a pure function, so the component reads the checkbox and
passes a plain boolean in.

`TicketSummaryCards.jsx` gained one line — `aria-label={label}` on each card — so a test can ask
for a card by name. See section 5.

---

## 3. Why the new version is easier to maintain

**The rules have names.** `ensureTitleIsUniqueForUpdate` states the rule and when it applies.
Previously you read a two-condition `if` and worked it out.

**The public methods read as workflows.** `updateTicket` is now: find it, clean it, check the
title is free, save it. The details sit below, in one place each.

**One source of truth for allowed values.** The `<select>` dropdown and the validation rule now
import the same array. Before, the same list existed twice in the same file and could drift.

**Validation is testable without a browser.** The 20 utility tests render nothing and run in
about 12ms. Previously the only way to test a rule was to render the form and click through it,
which is slower and couples the test to the layout.

**Changes have a single home.** Adding a status now means editing one array. Changing a review
label means editing one function instead of touching JSX.

---

## 4. What behaviour should remain unchanged

```text
Backend
- Endpoints /api/tickets and /api/v1/tickets, unchanged URLs
- DTO names and JSON response shape, field for field
- Exception types and exception message text
- Rule order: status is validated before priority, duplicate title checked after both
- Trimming behaviour on update
- createTicket still performs no validation and no trimming (see section 6)
- Filter behaviour, including blank filters being ignored

Frontend
- Three steps, same fields, same order
- CSS classes and JSX structure, so there is no visual change
- Validation message text, word for word
- Which step each rule belongs to
- Payload shape sent to onSubmit, including assignedTo: null when blank
- On submit, all three steps are re-validated and the user is sent back to the first failure
- Field ids and labels, so existing tests query the same way
```

---

## 5. What tests were run

**Backend — the same 15 HTTP requests run twice**, once against the original `TicketService`
(restored with `git stash`) and once against the refactored one, then diffed.

| Request | Before | After |
|---|---|---|
| Login | 200 | 200 |
| Create ticket | 201 | 201 |
| Get by id | 200 | 200 |
| Update ticket | 200 | 200 |
| Update with padded values | 200 | 200 |
| Invalid status | 500 | 500 |
| Invalid priority | 500 | 500 |
| Status **and** priority invalid | 500 | 500 |
| Update unknown id | 404 | 404 |
| Get unknown id | 404 | 404 |
| Duplicate title | 500 | 500 |
| Blank title (`@NotBlank`) | 400 | 400 |
| Filter `status=OPEN` | 200 | 200 |
| Blank filter `status=` | 200 | 200 |
| Paged list | 200 | 200 |

Every status and every message body matched. Two checks carry the most weight: with **both**
status and priority invalid the message still names *status*, proving the validation order
survived; and `"   CLOSED   "` was still stored as `"CLOSED"`, proving trimming survived. The
requests are saved in `requests/day16.http`. The only diffs in the transcript were `Set.of()`
iteration order, which reshuffles on every JVM start, and leftover rows from the first run.

**Frontend — Vitest**

```text
Before the refactor:  4 test files,  9 tests passed
After:                5 test files, 33 tests passed
```

The two pre-existing `TicketFormWizard` tests were **not modified** and still pass; they render
the real component and click all three steps. Added: 20 unit tests for the validation utility,
one edit-mode wizard test, and three more summary-card tests.

```text
ticketFormValidation.test.js   20
tickets.test.js                 4
TicketSummaryCards.test.jsx     4
TicketFormWizard.test.jsx       3
ProtectedRoute.test.jsx         2
```

**Frontend — Playwright, against the real backend**

```text
ok 1 [chromium] > admin can login and create a ticket through the protected UI (3.1s)
```

**Mutation check.** The hardened summary-card test was verified by deliberately swapping the
OPEN and CLOSED counts in the component. The old assertion — `getByText('3')` scoped to the
whole summary — passed against the broken component. The new assertion, which asks for a named
card and reads the number inside it, failed as it should. The swap was then reverted. A test
that cannot fail is not evidence.

All test tickets created during these runs were deleted afterwards; the collection is back to
its original 11 documents.

---

## 6. Risks and follow-ups

**1. Two error paths return the wrong status code.** `InvalidRequestException` and
`DuplicateResourceException` come back as **500** instead of 400 and 409, because
`GlobalExceptionHandler` has no `@ExceptionHandler` for either type — it only handles
`ResourceNotFoundException` and `MethodArgumentNotValidException`. This is **pre-existing**: the
before-run returned 500 as well, so it is not a regression from this refactor. It should be
fixed in its own change with its own evidence.

**2. `createTicket()` does not validate or trim.** `POST` with `"priority": "URGENT"` is accepted
and stored, while `PUT` with the same value is rejected. Adding validation here was deliberately
rejected during the refactor: a request that returns 201 today would start failing, and the
create form has never had to handle that error. It is a real inconsistency and deserves its own
change, not a quiet fix inside a cleanup.

**3. Review-step labels still show raw keys.** `formatTicketFormLabel` currently returns the key
unchanged, so the review step prints `assignedTo` rather than `Assigned To`. This preserves the
existing UI. The function is the seam: prettifying is now a one-line change in one file, with a
test already pointing at it.

**4. `npm run lint` does not run.** ESLint 10 cannot find an `eslint.config.js` and there is none
in the repo. Unrelated to this refactor and it does not affect the build or the tests, but it
means lint is not currently protecting any of this.

**5. Null handling differs in theory.** `normalizeRequired` and the frontend `readText` are
null-safe, where the old code called `.trim()` directly. Through the API and the UI this is
unreachable — `@Valid` plus `@NotBlank` rejects null with a 400 first, and the form always merges
values with `emptyTicketForm` — so no caller sees a difference. It only makes the functions safe
to call directly from tests.
