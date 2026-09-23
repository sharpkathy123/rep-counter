# Rep Counter

A voice-guided rep/set counter and exercise library for phone or iPad, built as a plain static site — no build step, no server, no framework. Installs to the Home Screen and works fully offline in Airplane Mode after the first online visit.

**Live app:** https://sharpkathy123.github.io/rep-counter/

## Using it

- Open the live link, browse/filter/sort exercises (alphabetical, last done, category, equipment, or time), check the ones you want and tap **Run Selected** — or open one exercise and tap **Start Counting**. Checked cards show a numbered badge for the order they'll actually run in.
- **Speak aloud** turns on voice cues: "Starting set N in" plus a 3-2-1-Go countdown before every set, "Rep N"/"Last rep!" cues, per-second counting, and a single "Rest N seconds" announcement (no per-second ticking during rest). Finishing a multi-exercise run also speaks how long the whole thing took.
- During a run: **Pause**, **Reset** (single exercise) or **Restart All** (start the whole sequence over) and, mid-sequence, **Repeat Exercise** (redo just the current exercise — handy for a one-sided exercise) and **Skip**.
- The **Voice settings & test** page (linked at the bottom of the exercise list) is also where a single exercise runs if reached from a Siri Shortcut or a bookmark with `?sets=&reps=&seconds=&rest=&voice=` in the URL.
- When a run finishes, a **❤️ Log to Health** button appears — tap it to add that session to Apple Health as a workout, with its real duration. See [Log your workouts to Apple Health](#4-log-your-workouts-to-apple-health) below for the (one-time) setup this needs.

## Making it your own — no coding, no account needed

Four things anyone can do right from their phone, no GitHub account or coding involved:

### 1. Install it to your Home Screen

This gives it a full-screen app icon like a real app, and — after that first visit — lets it keep working with **no internet connection at all** (Airplane Mode included).

- **iPhone / iPad (Safari):** open the [live link](https://sharpkathy123.github.io/rep-counter/) → tap the **Share** button (square with an arrow pointing up) → **Add to Home Screen** → **Add**.
- **Android (Chrome):** open the [live link](https://sharpkathy123.github.io/rep-counter/) → tap the **⋮** menu in the top corner → **Add to Home screen** (or **Install app**) → **Add**/**Install**.

Then launch it from the icon on your Home Screen, same as any other app.

### 2. Bring your own exercise list

Scroll to the very bottom of the exercise list and you'll see **Import exercises.txt or .csv**. Tap it and pick a file from your device to replace the built-in list with your own — your own exercises, your own numbers, kept completely private to your device.

- **Nothing is uploaded anywhere.** The file is read right there on your phone/tablet and saved in that browser's own storage, so your list keeps working offline from then on, exactly like the built-in one.
- **The file needs a specific format.** Open **[`exercises.txt`](exercises.txt)** in this repo to see it — the format is explained in plain English right at the top of that file. The easiest way to get started: open that file, select all the text, copy it into a new document on your computer or phone, edit it to match your own exercises, save it as a `.txt` file, then import that. Importing a `.csv` instead works too (see below) — matched by column name, so reordering or dropping a column in your spreadsheet app is fine, and it doesn't need to be one this app exported (a "Slug" and "Name" column header is all it looks for).
- **Switch back anytime** with the **Use built-in list** button that appears once you've imported something — your imported file stays saved, so switching back and forth doesn't mean re-importing every time.
- **📷 Photos won't show up in your imported list.** Two fields in the format, `StartImage` and `FinishImage`, point to photo files that live inside this app itself — there's no way to bring your own photos along through Import. Leave those two fields blank for every exercise in your file (any filename you put there just won't load a picture). With no images anywhere in your list, the app just skips the icon/photo space entirely rather than showing a placeholder — everything still works perfectly fine, your cards and exercise details just go straight to the text.

### 3. Export your list as a spreadsheet — and bring it back in

Underneath Import, at the very bottom of the exercise list, **Export as CSV** downloads whichever list is currently active (built-in or your own imported one) as a `.csv` file, with the same fields as `exercises.txt` — one exercise per row. Open it in Excel, Google Sheets, Numbers, or any spreadsheet app to review, sort, or print your list, or to make bulk edits somewhere more comfortable than a phone keyboard — sorting, filling a value down a whole column, find-and-replace across many exercises at once.

- **Nothing is uploaded here either** — the file is built and downloaded entirely on your device.
- **It's a round trip.** Once you're done editing, import that same `.csv` straight back in through **Import exercises.txt or .csv** — no need to retype anything into `.txt` format by hand. A cell with a line break typed into it (e.g. Alt+Enter in Excel) gets flattened to a single space on the way back in, since the underlying format is one line per field.

### 4. Log your workouts to Apple Health

A web app has no way to write to Health directly — Apple only allows that from a native app. The **❤️ Log to Health** button that appears when a run finishes works around that by handing off to a Shortcut, which *can* write to Health. This needs a one-time setup:

**Grant Health permissions first**, or the next part fails with a confusing error (or silently doesn't save anything):

1. Open **Settings** → **Health** → **Data Access & Devices** → **Shortcuts**.
2. Turn on all three toggles offered there: **Workouts**, **Walking + Running Distance**, and **Active Energy**. Rep Counter only ever sends a duration, but the Log Workout action still needs all three switched on before it'll even show its options, and it errors out otherwise.

**Then build the shortcut:**

1. Open the **Shortcuts** app, tap **+** to create a new shortcut.
2. Add the **Get Numbers from Input** action (search for it). Leave its input as **Shortcut Input** — that's the duration Rep Counter passes it.
3. Add the **Log Workout** action underneath it.
4. In Log Workout, set **Activity Type** to whatever fits best — **Other** is a fine, simple default.
5. Tap the **Duration** field, tap the variable-insert icon in the keyboard toolbar (a small purple pill), and choose the **Numbers** value from step 2. Set its unit to **sec**.
6. Fill in **Calories** and **Distance** with **0** each rather than leaving them blank — leaving them empty makes the action fail.
7. Rename the shortcut (tap its name, or the settings/info button) to exactly: **Log Rep Counter Workout** — the button looks it up by this exact name, so it has to match.
8. Tap **Done**.

The workout is logged as ending right when you tap the button, starting however many seconds earlier the session actually took — real elapsed time, pauses excluded, not the estimate shown before you start.

If you'd rather name your shortcut something else, look for `HEALTH_SHORTCUT_NAME` near the top of the script in `index.html` and `counter.html` and change both to match.

The button stays active (and visible) after you tap it, rather than disabling itself — on purpose, since this app has no way to know whether the Shortcut actually finished writing to Health (opening `shortcuts://` is fire-and-forget), so treating one tap as "done" could block a legitimate retry after a permission hiccup or a cancelled run. It goes back to hidden the next time you start a run, or if you tap Exit.

## Editing exercises — no code needed

If you're working directly in this repo (rather than importing your own file as above): all exercise content lives in **[`exercises.txt`](exercises.txt)**: one exercise per block, plain `Field: value` lines, with the format documented in a comment header at the top of that file itself. Edit it directly on GitHub (or any text editor) — no need to touch any `.html` file. Covers name, category, equipment, sets/reps/seconds/rest, description/setup/movement/tip text, and optional `StartImage`/`FinishImage` photo filenames — drop a `.jpeg`/`.png` in **[`images/`](images/)** named after that exercise's `Slug` (e.g. `images/bridge.jpeg` for `Slug: bridge`) so it's easy to tell which photo belongs to which exercise; a single photo already showing both positions works too, just leave `FinishImage` blank.

Category and equipment aren't a fixed list — typing a new one into the file gets it its own filter chip automatically.

**Tags** work the same way, but an exercise can have more than one (comma-separated in the `Tags` field) — useful for anything that cuts across categories, like "band-optional" (exercises that still work with no band, e.g. away from home) or "hip-flexor" (exercises that may aggravate a sore hip flexor). Each tag gets its own filter chip, same as Category/Equipment. Give a tag an icon by adding a colon and an emoji right after it (e.g. `hip-flexor:⚠️`) — that icon then shows up on the filter chip, on every card with that tag, and on the detail page; you only need to write it once, on any single exercise that uses the tag.

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
