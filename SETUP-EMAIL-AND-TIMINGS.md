# What's new: college-hours booking, working calendar, e-mail notifications

## 1. One-time setup (backend)

```bash
cd backend
npm install            # installs the new dependency: nodemailer
copy .env.example .env # Windows   (Mac/Linux: cp .env.example .env)
```

Open `backend/.env` and fill in the e-mail section:

| Setting        | Meaning                                                                 |
|----------------|-------------------------------------------------------------------------|
| `SMTP_SERVICE` | `gmail` (or remove it and use `SMTP_HOST` / `SMTP_PORT` for other mail servers) |
| `SMTP_USER`    | the mailbox that SENDS the notifications                                |
| `SMTP_PASS`    | Gmail **App password** (Google Account → Security → 2-Step Verification → App passwords) |
| `ADMIN_EMAIL`  | mailbox(es) that receive the admin e-mails (comma separated). If empty, all users with the Administrator role are used – the seeded admin is `admin@gmail.com`, so set a real address here |

Start the backend (`node server.js`). The console prints either
`📧 E-mail: SMTP ready` or a clear error. Until SMTP is configured, the e-mails are
printed in the backend console instead, so nothing breaks.

Then start the frontend as usual (`npm install`, `npm run dev`).

## 2. What happens when someone clicks **Book Room**

1. The server checks: college hours, working day, not in the past, room not under
   maintenance, and **no overlap** with any approved/pending booking.
   If any check fails, nothing is saved and the user sees the reason.
2. The booking is saved as **Pending**.
3. E-mail to the **user**: *"Your request has been sent to the admin. After confirmation,
   your room will be booked."* (with room, date, time, booking id)
4. E-mail to the **admin**: *"Booking request for <room> by <user e-mail> at <time>"*
   (plus event, purpose, participants, equipment, requested slot).
5. When the admin approves / rejects, the user gets a third e-mail with the decision.
6. The same messages also appear in the in-app 🔔 notification panel (user and admin).

## 3. Changing the college timings

Edit **both** files (keep them identical):

* `src/config/collegeTimings.js`   (frontend – pickers, calendar, matrix)
* `backend/config/collegeTimings.js` (backend – the final safety check)

Defaults: **9:00 AM – 5:00 PM, Monday–Saturday** (Sunday closed).

## 4. Files changed / added

Added: `src/config/collegeTimings.js`, `src/components/common/DayTimeline.jsx`,
`backend/config/collegeTimings.js`, `backend/services/mailer.js`, `backend/.env.example`

Changed: `src/components/Calendar/CalendarView.jsx` (rewritten),
`src/components/Booking/BookingForm.jsx`, `src/components/Availability/AvailabilityChecker.jsx`,
`src/components/Notifications/NotificationPanel.jsx`, `src/components/Navbar.jsx`,
`src/App.jsx`, `src/utils/conflictDetector.js`, `src/components/Booking/ConflictModal.jsx`,
`backend/routes/api.js`, `backend/server.js`, `backend/package.json`, `.gitignore`

The `*-Madhava.*` files were left untouched (they are not imported by the app).

---

## 5. Frontend restyle: white theme, college logo, Poppins font

- **Theme:** The whole frontend was converted from the dark theme to a white/light
  theme (backgrounds, text, borders, hover states, and the 6 page header banners),
  on both the user side and the admin side — they share the same components, so
  one set of changes covers both.
- **Logo:** Your MITS letterhead banner (`public/mits-college-banner.png`) is now
  shown at the very top of the shared `Navbar` component, above the menu, sticky
  on every page for both roles.
- **Font:** You asked for the "Pip" font. I couldn't find a real, publicly available
  font by that exact name, so I used **Poppins** (a clean, popular Google Font) as
  the closest reasonable match — set in `index.html` (font link) and
  `src/index.css` (`--font-sans`). If you meant a different font, tell me its exact
  name and I'll swap it in those two spots.
- Backend and database code were **not touched**, as requested.

---

## 6. Logo banner sizing (full-width strip, compact height)

The college logo sits in a **full-width white strip** right at the very top of
the page, above the navigation menu — on every screen, for both the user side
and the admin side (they share the same `Navbar` component). It's the first
thing visible when the site loads.

This went through a couple of rounds of feedback, so here's the final
approach and why:

- Your logo image (`public/mits-college-banner.png`) is wide and short
  (about 6.4:1 — width to height), with almost no blank margin around the
  crest/text, so it can't be trimmed to change that ratio.
- Stretching it to literally touch both edges of the page (edge-to-edge)
  forces its height up a lot too — on a wide screen that worked out to a very
  tall banner, which is what made it feel like it was "filling half the
  screen."
- So instead, the **outer strip stays full-width** (`w-full`, spanning the
  page edge-to-edge, white background, bottom border), but the **logo image
  itself is centered inside it at a fixed, moderate height**
  (`h-16 sm:h-20 md:h-28`, i.e. 64px tall on phones, up to 112px on desktop)
  using `object-contain`, so it scales up on larger screens without ever
  being cropped, and never grows tall enough to dominate the page. On wide
  screens you'll see some white space to either side of the logo within the
  strip — that's expected, and is what keeps the height under control.
- File: `public/mits-college-banner.png`, used in `src/components/Navbar.jsx`.

If you'd still like it a bit bigger or smaller, the only thing to change is
the `h-16 sm:h-20 md:h-28` classes on the `<img>` tag in `Navbar.jsx` —
bump each number up or down (Tailwind's scale: 12, 14, 16, 20, 24, 28, 32...
in quarter-rem steps, so e.g. `md:h-28` → `md:h-32` makes the desktop logo
noticeably taller).
