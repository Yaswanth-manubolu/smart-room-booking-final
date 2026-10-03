# What changed in this update

Frontend-only changes, as requested — backend and database untouched.

## 1. College logo
Your uploaded banner (`public/mits-college-banner.png`) was added as a letterhead
strip at the very top of the shared `Navbar` component (`src/components/Navbar.jsx`),
so it shows on every page, for both the admin and the faculty/user views, and stays
visible (sticky) while scrolling.

## 2. White background
The entire dark theme was converted to a white/light theme — every component file
(Navbar, Booking Form, Calendar, Availability Matrix, Approvals Queue, Room
Management, Analytics, Notifications, Auth, 3D Floorplan panels). This included:
- All backgrounds: dark slate → white / light slate
- All text, borders, and hover states re-tuned for readable contrast on white
  (plain dark-to-light swaps would have left several headings and hover states
  invisible — those were fixed individually)
- The colored header banner on each page (Calendar, Approvals, Booking, Room
  Management, Reports, Availability) was redesigned with a light tint instead of
  the old dark gradient

## 3. Font
Changed to **Poppins** (Google Font) — the closest widely-available font to "Pip",
since no font by that exact name exists on Google Fonts. Loaded in `index.html` and
set as the default in `src/index.css`. If you meant a different/specific font,
tell me its exact name and I'll swap it (two-line change).

## Files touched
`index.html`, `src/index.css`, `src/App.jsx`, `src/components/Navbar.jsx`,
`src/components/Calendar/CalendarView.jsx`, `src/components/Booking/BookingForm.jsx`,
`src/components/Booking/ConflictModal.jsx`, `src/components/Availability/AvailabilityChecker.jsx`,
`src/components/Approvals/AdminApprovals.jsx`, `src/components/RoomManagement/RoomListAdmin.jsx`,
`src/components/Analytics/ReportsDashboard.jsx`, `src/components/Notifications/NotificationPanel.jsx`,
`src/components/Notifications/QRTicketModal.jsx`, `src/components/Auth/AuthModal.jsx`,
`src/components/3D/RoomVisualizer3D.jsx`, `src/components/common/DayTimeline.jsx`,
`src/utils/conflictDetector.js`, `public/mits-college-banner.png` (new)

Backend (`backend/`) and the database schema/queries were not touched at all.
The `*-Madhava.*` files were left as-is (not imported by the app).
