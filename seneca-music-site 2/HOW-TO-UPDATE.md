# How to update the Seneca Music website

**The short version:** everything that changes week to week lives in **one file, `updates.txt`**. Edit it on GitHub, click **Commit changes**, and the website updates itself within about 2 minutes.

---

## Your Monday routine (about 5 minutes)

1. Go to your repository on **github.com** and click **`updates.txt`**.
2. Click the **pencil icon** (✏️ "Edit this file") at the top right of the file.
3. Make your changes (see below).
4. Click the green **Commit changes…** button, then **Commit changes** again. You can type a note like "Week of Nov 9", but you don't have to.
5. Wait 1–2 minutes, then open your website and refresh.
6. **Double-check:** open **`check.html`** on your site (for example `https://YOUR-NAME.github.io/seneca-music/check.html`). It says "Looks good!" or lists any line it couldn't read, with the line number.

### What to change each week

| Section in `updates.txt` | Where it shows up | What to do |
|---|---|---|
| `=== WEEKLY REMINDER ===` | Yellow box on the home page | Replace the text. Start a line with `- ` for a bullet. |
| `=== THIS WEEK ===` | Calendar → Weekly itinerary | Change the `Week of:` date and the day-by-day lines. |
| `=== UPCOMING EVENTS ===` | Home ("What's coming up") and Calendar | Add new events. Past events hide themselves, so delete old lines whenever you like. |
| `=== COMPETITIONS ===` | Marching Band page, Calendar, home page | Add or adjust competitions. Don't also list them under events, because they're added automatically. |

### A few times a year

| Section | When |
|---|---|
| `Season:` (in `=== SETTINGS ===`) | Type `off-season` when marching season ends and `in-season` when it starts. That swaps the competition table for summer dates and band camp on the Marching Band page. |
| `=== SUMMER DATES ===` and `=== BAND CAMP ===` | Each spring, before switching to off-season. |
| `Google Calendar link:` and `Member Google Drive link:` | Once. Paste the links after the colon. |

---

## The rules (there are only five)

1. **Lines starting with `#` are notes for you.** The website ignores them.
2. **Don't change the `=== SECTION NAME ===` lines.**
3. **Columns are separated by `|`**, the "pipe" key (Shift + backslash, above Enter). Keep the columns in the order shown in the note above each section. Example:
   `Dec 10, 2026 | 7:00 PM | Winter concert | Seneca auditorium | Symphonic Band`
4. **Write dates like `Dec 10, 2026`.** `2026-12-10` and `12/10/2026` also work. The year matters!
5. **One event per line.**

**Links:** paste any link that starts with `https://`. For a competition itinerary, a Google Doc or PDF link works. (In Google Drive, set sharing to "Anyone with the link can view.")

**The `[square brackets]`** mark placeholder text I didn't have. Replace each one with real information and delete the brackets.

---

## Oops! How to undo a mistake

Every save is kept. On GitHub, open `updates.txt` and click **History**, open the version that worked, and copy its text back in. If the site looks wrong, `check.html` will usually tell you exactly which line to fix.

---

## Adding photos

The site shows striped placeholder boxes where photos go. To fill one, upload a photo with the **exact file name** below into the `images` folder (in the repository: open `images` → **Add file** → **Upload files** → **Commit changes**). It appears automatically.

| File name | Where it appears |
|---|---|
| `hero.jpg` | Home page, top |
| `join.jpg` | Home page, "Thinking about joining us?" |
| `marching.jpg`, `marching-show.jpg`, `color-guard.jpg` | Programs and Marching Band pages |
| `symphonic.jpg`, `jazz.jpg`, `guitar.jpg`, `choir.jpg`, `orchestra.jpg`, `tri-m.jpg` | Programs page |
| `band-of-the-future.jpg` | Join Music page |
| `boosters.jpg` | Resources page |

Tips: use landscape photos and shrink them to about 1600 pixels wide first (phone photos are huge, which makes the site slow). File names must be lowercase and end in `.jpg`. Follow district rules about student photos.

---

## Changing other words on the site

Text that rarely changes, like program descriptions, FAQs, private lesson teachers and class lists, lives in the `.html` files (`programs.html`, `marching-faq.html`, `resources.html`, `join.html`, and so on). You can edit them with the same pencil icon: find the words between the tags and change only the words. Leave anything inside `< >` alone.

---

## One-time setup: putting the site online (about 15 minutes)

1. Create a free account at **github.com** (your school email is fine).
2. Click **+** (top right) → **New repository**. Name it something like `seneca-music`, choose **Public**, and click **Create repository**.
3. On the new page, click **uploading an existing file**. Unzip the website folder on your computer, then drag **everything inside it** (all the `.html` files, `updates.txt`, and the `css`, `js` and `images` folders) into the browser. Click **Commit changes**.
   *Note:* there's a hidden file called `.nojekyll`. If your computer hides it, that's fine; the site works without it.
4. Go to **Settings** → **Pages** (left side). Under "Branch", choose **main** and **/ (root)**, then click **Save**.
5. After a minute or two, the Pages screen shows your address, like `https://YOUR-NAME.github.io/seneca-music/`. That's your website!

**Want a nicer web address** (like `senecamusic.org`)? You can buy one and connect it under Settings → Pages → Custom domain. Ask your district tech department first.

**Preview note:** if you double-click an `.html` file on your own computer, the events and reminder sections will say they "couldn't load". That's normal: browsers block that on local files. Everything works once it's on GitHub.
