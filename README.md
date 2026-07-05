# Voidwalkers Archive

A found-footage / classified-document site for Project Voidwalkers — codex,
field log, and a correspondence point, all framed as a recovered archive
terminal. No build step: plain HTML, CSS, and JS, deployable as-is on
GitHub Pages.

## Structure

```
voidwalkers-archive/
├── index.html              home / archive entry point
├── codex.html               entity dossiers (Towers, factions, apex, characters)
├── devlog.html               field log
├── assets/css/main.css       full design system
└── assets/js/
    ├── render.js              rendering logic (redaction, stamps, filters)
    ├── towers-data.js          codex content
    └── devlog-data.js          field log content
```

## How the content pipeline works

This is the "generate first, approve second" workflow: new entries start as
plain data, get reviewed, then get flagged approved. Nothing about the page
layout or code needs to change at any step.

**Adding a field-log entry** — open `assets/js/devlog-data.js` and add an
object to the array:

```js
{ id: "LOG-002", date: "2026-07-10", title: "YOUR TITLE", body: "Update text." }
```

Entries sort by date automatically, newest first.

**Adding or editing a codex entry** — open `assets/js/towers-data.js`. Each
entry follows this shape:

```js
{
  id: "tower-example",
  category: "tower",        // tower | faction | apex | character
  designation: "TOWER-07",
  name: "NAME",
  objectClass: "...",
  anchorEmotion: "...",      // leave as null to render redacted
  function: "...",
  oversight: "...",
  threatAssessment: "...",
  fieldNotes: "...",
  status: "draft",           // "draft" → PENDING REVIEW stamp
}                             // "approved" → DECLASSIFIED stamp
```

Any field left as `null` renders as a black redacted bar automatically —
useful for anything you haven't locked in yet, and it fits the archive
conceit rather than looking like a placeholder.

**Approving an entry** — change `status: "draft"` to `status: "approved"`.
That flips the stamp from PENDING REVIEW to DECLASSIFIED. Nothing is
deleted or restructured either way.

**Need something more custom for one entry?** The data-driven cards cover
the common case, but if one dossier needs bespoke layout, write it directly
in `codex.html` as its own block instead of forcing it through the data
system — the two approaches can coexist.

## What's seeded vs. what's yours to fill in

The nine dossiers currently in `towers-data.js` include only what's
confirmed: the six Towers by name, the Mechanized as a border-enforcement
faction, the Director of Aeons as oversight authority, and Kaelen with his
confirmed anchor emotion (Tranquil Horror). Anchor emotions for the Towers,
threat assessments, and field notes are left redacted deliberately — those
are calls only you should make. Fill them in whenever you're ready; they'll
declassify on their own.

The correspondence email on the homepage is a placeholder — swap in a real
address whenever you're ready to take inquiries.

## Deploying to GitHub Pages

1. Create a GitHub repo (or reuse one).
2. Push everything in this folder to the repo root.
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment," set the source to your default branch and
   the folder to `/ (root)`.
5. Save. GitHub publishes at `https://<username>.github.io/<repo-name>/`.

Nothing here needs compiling — whatever you push is what deploys.

## Not built yet (next candidates)

- Dimensional Registry (8D–10D strata) as its own codex category
- Periodic Table of Anchors / the ten-element system
- Additional character dossiers
- A dedicated correspondence page instead of a homepage section
