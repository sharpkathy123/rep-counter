# Rep Counter

A voice-guided rep/set counter and exercise library for phone or iPad, built as a plain static site — no build step, no server, no framework. Installs to the Home Screen and works fully offline in Airplane Mode after the first online visit.

**Live app:** https://sharpkathy123.github.io/rep-counter/

## Using it

- Open the live link, browse/filter/sort exercises (alphabetical, last done, category, equipment, or time), check the ones you want and tap **Run Selected** — or open one exercise and tap **Start Counting**. Checked cards show a numbered badge for the order they'll actually run in.
- **Speak aloud** turns on voice cues: "Starting set N in" plus a 3-2-1-Go countdown before every set, "Rep N"/"Last rep!" cues, per-second counting, and a single "Rest N seconds" announcement (no per-second ticking during rest). Finishing a multi-exercise run also speaks how long the whole thing took.
- During a run: **Pause**, **Reset** (single exercise) or **Restart All** (start the whole sequence over) and, mid-sequence, **Repeat Exercise** (redo just the current exercise — handy for a one-sided exercise) and **Skip**.
- The **Voice settings & test** page (linked at the bottom of the exercise list) is also where a single exercise runs if reached from a Siri Shortcut or a bookmark with `?sets=&reps=&seconds=&rest=&voice=` in the URL.

## Making it your own — no coding, no account needed

Two things anyone can do right from their phone, no GitHub account or coding involved:

### 1. Install it to your Home Screen

This gives it a full-screen app icon like a real app, and — after that first visit — lets it keep working with **no internet connection at all** (Airplane Mode included).

- **iPhone / iPad (Safari):** open the [live link](https://sharpkathy123.github.io/rep-counter/) → tap the **Share** button (square with an arrow pointing up) → **Add to Home Screen** → **Add**.
- **Android (Chrome):** open the [live link](https://sharpkathy123.github.io/rep-counter/) → tap the **⋮** menu in the top corner → **Add to Home screen** (or **Install app**) → **Add**/**Install**.

Then launch it from the icon on your Home Screen, same as any other app.

### 2. Bring your own exercise list

Scroll to the very bottom of the exercise list and you'll see **Import exercises.txt**. Tap it and pick a plain text file from your device to replace the built-in list with your own — your own exercises, your own numbers, kept completely private to your device.

- **Nothing is uploaded anywhere.** The file is read right there on your phone/tablet and saved in that browser's own storage, so your list keeps working offline from then on, exactly like the built-in one.
- **The file needs a specific format.** Open **[`exercises.txt`](exercises.txt)** in this repo to see it — the format is explained in plain English right at the top of that file. The easiest way to get started: open that file, select all the text, copy it into a new document on your computer or phone, edit it to match your own exercises, save it as a `.txt` file, then import that.
- **Switch back anytime** with the **Use built-in list** button that appears once you've imported something — your imported file stays saved, so switching back and forth doesn't mean re-importing every time.
- **📷 Photos won't show up in your imported list.** Two fields in the format, `StartImage` and `FinishImage`, point to photo files that live inside this app itself — there's no way to bring your own photos along through Import. Leave those two fields blank for every exercise in your file (any filename you put there just won't load a picture). The app will automatically show a simple line-drawing icon instead, which still works perfectly fine — you just won't get your own photos.

## Editing exercises — no code needed

If you're working directly in this repo (rather than importing your own file as above): all exercise content lives in **[`exercises.txt`](exercises.txt)**: one exercise per block, plain `Field: value` lines, with the format documented in a comment header at the top of that file itself. Edit it directly on GitHub (or any text editor) — no need to touch any `.html` file. Covers name, category, equipment, sets/reps/seconds/rest, description/setup/movement/tip text, and optional `StartImage`/`FinishImage` photo filenames — drop a `.jpeg`/`.png` in **[`images/`](images/)** named after that exercise's `Slug` (e.g. `images/bridge.jpeg` for `Slug: bridge`) so it's easy to tell which photo belongs to which exercise; a single photo already showing both positions works too, just leave `FinishImage` blank.

Category and equipment aren't a fixed list — typing a new one into the file gets it its own filter chip automatically.

**Setting a run order:** when you check off several exercises and tap **Run Selected**, they run in the same order their blocks appear in `exercises.txt` — not the order you tapped them in. So if one exercise should always happen before another whenever both are picked (a basic version before a harder progression, say), just put its block earlier in the file. `exercises.txt` already does this for a few groups (the Bridge variants, the Scapular Retraction I/T/Y progression, and TA Activation before 90/90 Lower Trunk Rotation) — look for a comment above those blocks.

## What's in this repo

| File | What it's for |
|---|---|
| `index.html` | Landing page: exercise list, category/equipment filters, multi-select, Run Selected, exercise detail view |
| `counter.html` | Single-exercise counter, voice settings/test, and the target for Siri Shortcuts / silent-mode links |
| `exercises.txt` | All exercise content — the file you actually edit day to day |
| `images/` | Exercise photos and hand-drawn start/finish SVG diagrams referenced from `exercises.txt` |
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
