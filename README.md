# 18plus

Berufs- und Studienorientierungsplattform (Diplomarbeit). Students work through
career/study-orientation worksheets ("Arbeitsblätter") organized into modules; teachers manage
classes ("Gruppen"), control which modules are unlocked for each group, and see completion
status (never the answers themselves).

## Features

- Passwordless student login via one-time email code
- Student self-registration via a teacher-generated group join code (typed in, or scanned from
  a QR code)
- Auto-saving worksheet progress, with an explicit submit step per worksheet
- Teacher dashboard: manage groups/students, generate join-code QR codes, control which modules
  are unlocked per group, view student completion status
- Installable as a PWA (Add to Home Screen)

## Tech stack

- **Backend**: ASP.NET Core (.NET 10), Entity Framework Core, SQLite
- **Frontend**: React 19, Vite, Tailwind CSS v4, shadcn/radix-ui

## Project structure

```
backend/18plus/Application   ASP.NET Core Web API
frontend                     React + Vite single-page app
```

## Getting started

### Prerequisites

- .NET 10 SDK
- Node.js 20+ and npm

### Backend

```bash
cd backend/18plus/Application
dotnet user-secrets set "Jwt:Key" "<a long random string>"
dotnet user-secrets set "Otp:SecretKey" "<a long random string>"
dotnet run
```

Listens on `http://localhost:5000`. The SQLite database (`eighteenplus.db`) and demo seed data
(teachers, students, groups) are created automatically the first time it runs. The schema is
only (re)created when that file doesn't exist yet — delete `eighteenplus.db` to force a clean
reseed after a data-model change.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173` and proxies `/api/*` requests to the backend (see
`vite.config.js`) — both need to be running at the same time.

### Trying it on your phone / another device

The dev server listens on all network interfaces (`server.host: true` in `vite.config.js`), so
with both servers running, open `http://<your-pc's-LAN-IP>:5173` from any device on the same
WiFi or hotspot. Find your LAN IP with `ipconfig` (Windows) — look for the address under your
WiFi/hotspot adapter, not `127.0.0.1`.

## Seeded demo accounts

From `Application/Infrastructure/DatabaseSeeder.cs`:

| Role | Email | Password |
|---|---|---|
| Teacher | `eder.johannes@18plus.local` | `Hashed-Teacher2-Password` |
| Teacher | `puehringer.Michael@18plus.local` | `Hashed-Teacher3-Password` |

Students log in passwordlessly: request a one-time code from the login screen, which is emailed
via the configured SMTP account. Several seeded students exist (see `DatabaseSeeder.cs`) but
their pre-seeded one-time codes don't actually work (see Known limitations) — request a fresh
code instead.

## Known limitations

- SMTP credentials for sending one-time login codes are currently hardcoded in
  `Application/Models/Services/EmailSender.cs` rather than read from configuration/user-secrets —
  move these out before any real deployment.
- The one-time codes seeded for the first four demo students in `DatabaseSeeder.cs` are stored
  as raw plaintext instead of a properly hashed value, so they won't pass verification — use the
  real "request code" flow to get a working code.
- A group's join code is a random 6-digit string with no collision retry on creation; a
  collision is extremely unlikely but not explicitly handled.
