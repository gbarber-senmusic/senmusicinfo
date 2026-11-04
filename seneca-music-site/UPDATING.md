# Updating the Seneca Music website

## Every Monday (about 5 minutes)

Everything that changes week to week lives in one file: **updates.js**.

1. On GitHub, open your website repository and click **updates.js**.
2. Click the pencil icon (Edit this file).
3. Change the text between the quote marks:
   - `reminder`: this week's one reminder
   - `updated`: today's date
   - `events`: the next few events (copy a line to add one, delete a line to remove one)
4. Click **Commit changes**. The live site updates within a minute or two.

Rules that keep it working: keep the quote marks around text, keep the comma at the end
of each line inside a list, and don't delete the curly braces `{ }`.
If the page breaks after an edit, a missing quote or comma is almost always why.
Open the file's **History** to see or undo your last change.

## Twice a year: switch the Marching Band page

In updates.js, change `season` to:
- `"in-season"` in the fall (shows the competitions table and show title)
- `"recruiting"` in the spring and summer (shows summer dates, band camp and the member count)

Then update `competitions` or `summerDates`, `showTitle`, and `members`.

## Adding photos

1. Open the **images** folder on GitHub and choose **Add file › Upload files**.
2. Use short, simple names with no spaces, such as `hero.jpg` or `jazz.jpg`.
3. Replace the matching `<div class="photo">[Photo: …]</div>` in the page with:
   `<div class="photo"><img src="images/hero.jpg" alt="Describe the photo"></div>`

Before posting student photos, check your district's media release list.

## Putting the site online (one-time setup)

1. Create a free GitHub account and a new public repository, e.g. `seneca-music`.
2. Upload every file in this folder (Add file › Upload files).
3. In the repository, go to **Settings › Pages**. Under Source, choose **Deploy from a branch**,
   pick **main** and **/ (root)**, and save. Your site appears at
   `https://<your-username>.github.io/seneca-music/` within a few minutes.
4. To use senecamusic.info: under Settings › Pages, enter `senecamusic.info` as the custom domain,
   then change the domain's DNS records (at wherever senecamusic.info was registered) to point to
   GitHub Pages. GitHub's "Managing a custom domain" help page lists the exact records.
   This moves the address away from the Google Site, so only do it once the new site is ready,
   and check with your district first.

## What still links to the old Google Site

Pages not rebuilt yet (Wind Bands, Jazz, Choir, Orchestra, Music Classes, itineraries, calendar,
FAQs, show history, Tri-M, private lessons, gear guide) link to their existing Google Sites pages,
so nothing is broken in the meantime. Keep the Google Site published until those are rebuilt.
