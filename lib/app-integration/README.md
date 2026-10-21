# App integration seam

Not used at launch. Nothing imports this module yet.

It holds the `PlanProgress` and `ProgressProvider` interfaces from SPEC-v3
section 9 and a `NoopProgressProvider` that returns an empty list. When the
website links to the House of Bread app, a real provider replaces the no-op
in `index.ts`, and pages read progress only through `progressProvider`.

Rules (CLAUDE.md section 5):

- Calls to the app happen on the server. No app credential or token reaches
  the browser.
- Sign in uses a standard such as OAuth or OIDC, against whatever the app
  already uses. No custom auth scheme.
- Scope is read only, and the visitor consents explicitly. Reading plan
  progress can reveal religious belief, special category data under UK GDPR.
- The app's URL scheme and API shape are open items. Do not invent them.
- No user tables, sessions or auth routes until the spec stage calls for them.
