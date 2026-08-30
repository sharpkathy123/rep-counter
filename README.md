# Rep Counter

A voice-guided rep/set counter and exercise library for phone or iPad, built as a plain static site — no build step, no server, no framework. Installs to the Home Screen and works fully offline in Airplane Mode after the first online visit.

**Live app:** https://sharpkathy123.github.io/rep-counter/

## Using it

- Open the live link, browse/filter exercises, check the ones you want and tap **Run Selected** — or open one exercise and tap **Start Counting**.
- **Add to Home Screen** (Safari Share sheet) for a full-screen app icon. Visit once while online first so it can cache itself; after that it keeps working with no network at all.
- **Speak aloud** turns on voice cues: a 3-2-1-Go countdown before every set, "Rep N"/"Last rep!" cues, per-second counting, and rest countdowns.
- The **Voice settings & test** page (linked at the bottom of the exercise list) is also where a single exercise runs if reached from a Siri Shortcut or a bookmark with `?sets=&reps=&seconds=&rest=&voice=` in the URL.

## Editing exercises — no code needed

All exercise content lives in **[`exercises.txt`](exercises.txt)**: one exercise per block, plain `Field: value` lines, with the format documented in a comment header at the top of that file itself. Edit it directly on GitHub (or any text editor) — no need to touch any `.html` file. Covers name, category, equipment, sets/reps/seconds/rest, description/setup/movement/tip text, and optional `StartImage`/`FinishImage` photo filenames (drop a `.jpeg`/`.png` in this same folder and reference it by filename — a single photo already showing both positions works too, just leave `FinishImage` blank).

Category and equipment aren't a fixed list — typing a new one into the file gets it its own filter chip automatically.

## What's in this repo

| File | What it's for |
|---|---|
| `index.html` | Landing page: exercise list, category/equipment filters, multi-select, Run Selected, exercise detail view |
| `counter.html` | Single-exercise counter, voice settings/test, and the target for Siri Shortcuts / silent-mode links |
| `exercises.txt` | All exercise content — the file you actually edit day to day |
| `*.jpeg` / `*.png` | Exercise photos referenced from `exercises.txt`, plus the app icon source images |
| `manifest.json`, `icon-*.png` | Home Screen install metadata and icon |
| `sw.js` | Service worker — caches everything needed for offline/Airplane Mode use |
| `.github/workflows/deploy.yml` | Deploys `main` to the live site and posts a preview link on every PR (see below) |

## Deployment

Pushing to `main` deploys the live site. Every pull request also gets its own preview under `.../test-env/pr-<number>/`, posted as a comment on the PR automatically — no need to merge first to see a change live. The workflow also stamps the real deploy time into the small "Updated" line at the bottom of the exercise list, so you can tell whether what's on screen is current.

## Local testing

No build step — just serve the folder and open it:

```
python3 -m http.server 8000
```

Note: the service worker requires an `http(s)` origin, so offline caching only activates when served this way (or via the live site) — not when opening `index.html` directly as a `file://` URL.
