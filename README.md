# Suman Duru — Beyond the Code

Standalone static portfolio. No build step or runtime package is required.

## Publish with GitHub Pages

The included GitHub Actions workflow publishes the repository root whenever
changes are pushed to `main`. In the repository settings, set **Pages → Build
and deployment → Source** to **GitHub Actions**. The first successful workflow
run will provide the public Pages URL.

## Preview locally

Serve this folder over HTTP, then open the local address in a browser. For example:

```powershell
python -m http.server 8000
```

The site entry point is `index.html`. Keep `Profile.pdf`, the CSS and JavaScript files, and `assets/suman-story-character.webp` beside it in their current paths.

## Experience notes

- The seven-act canvas story advances as visitors scroll. Previous/Next, Replay and Skip controls are available.
- Browser narration and the synthesized ambient score start only after the visitor turns them on.
- With reduced motion enabled, the story becomes a still scene sequence controlled with Previous/Next.
- Story scenes are illustrative, not a documentary or a claim of specific project results. AI-related items are labeled as exploration.
- Google Fonts are optional; local system fonts provide the fallback.
