
## Deliverable

A full Product Manager spec PRD for TribeMint, delivered as three downloadable artifacts in `/mnt/documents/`:

- `TribeMint-PRD-v1.pdf`
- `TribeMint-PRD-v1.docx`
- `TribeMint-PRD-v1.md` (also rendered inline in chat)

No application source code will be touched — this is a documentation-only deliverable.

## PRD outline (19 sections)

1. Executive Summary — vision, positioning vs. Impact/Rakuten/CJ/ShareASale, OTAs, Shopify Collabs/TikTok Shop/Amazon Associates; business model (commission-only); north-star metric (a-GBV per active creator).
2. Goals, Non-Goals, Success Criteria — 12-month targets, retention, payout latency, dispute rate.
3. Personas — 3 creator, 3 business, 3 platform/admin.
4. Glossary.
5. System Overview & Architecture — services diagram (Identity/AuraLink, Offers, Tracking, Ledger, Gift Cards, Integrations Bus, Notifications) + recommended tech.
6. Data Model — User, CreatorProfile, Business, Campaign, Link, Event, GiftCard, PayoutRun, LedgerEntry, IntegrationAccount.
7. End-to-End User Flows — onboarding, campaign creation, click→conversion→payout, gift-card purchase (the 10-step flow), payouts management, disputes/refunds.
8. Functional Requirements — user stories with acceptance criteria for Creator, Business, Admin.
9. Non-Functional Requirements — performance, availability, security (SOC 2/OWASP), privacy (GDPR/CCPA/NDPR), accessibility (WCAG 2.1 AA), i18n, auditability.
10. Interoperability with Other Affiliate Programs (deep dive) — adapter contract; per-partner sections for Booking.com / Expedia / Airbnb, Impact / Rakuten / CJ / ShareASale, Shopify Collabs / TikTok Shop / Amazon Associates; outbound publishing; conflict & precedence rules; tax/KYC; reliability SLOs.
11. Analytics & Reporting — dashboards + CSV/PDF exports.
12. Notifications — email, in-app toasts, push, outbound webhooks.
13. Security & Privacy — AuraLink SSO, RBAC, `user_roles` + `has_role()` pattern, PCI scope.
14. Rollout Plan — 6 phases over ~26 weeks.
15. Risks & Mitigations — table.
16. Open Questions.
17. Appendix A — Sample API sketches.
18. Appendix B — Event normalization schema.
19. Appendix C — Settlement statement line items.

## How it will be generated

1. Write the PRD content as a single Markdown file under `/mnt/documents/TribeMint-PRD-v1.md`.
2. Convert to DOCX with `pandoc` (Arial body, headings styled, TOC enabled).
3. Convert to PDF with `pandoc` + LaTeX (or Chromium fallback) at letter size, 1" margins.
4. Visually QA every page of the PDF (render pages to images, inspect for overflow/typos/broken layout); fix and re-render until clean.
5. Emit `<presentation-artifact>` tags for all three files plus the inline Markdown.

## Notes

- No project source files will be modified.
- Content is grounded in existing project memory (Ibloov ownership, commission-only model, Stripe Connect Express, gift-card flow already specified, dual-funnel design).
- External integrations are described at the level of adapter contracts, OAuth/postback patterns, attribution precedence, settlement, and ToS guardrails — appropriate for a Full PM Spec depth.

Approve to generate the three artifacts.
