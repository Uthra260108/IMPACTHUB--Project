# ImpactHub — Volunteer Management and Student Guidance Platform
> **College Software Engineering Project Prototype**  
> *"Guidance Today. Brighter Tomorrows."*

---

## 1. Project Overview
**ImpactHub** is an accessible, responsive, multipage web application engineered to bridge university undergraduates seeking academic and career direction with dedicated volunteer mentors, alumni, and educators. An administrative portal oversees the entire system — approving volunteer applications, matching students to mentors, managing developmental activities, and analyzing platform engagement.

Built entirely using clean semantic **HTML5**, modern **CSS3**, and **Vanilla JavaScript (ES6+)**, the platform utilizes the browser's persistent **localStorage** to maintain realistic demonstration state without requiring backend servers or database installations.

---

## 2. Problem Statement
Many university students face challenges in navigating complex degree curricula, preparing for technical interviews, seeking research fellowships, and balancing extracurricular commitments. Simultaneously, qualified alumni and industry specialists are eager to volunteer guidance, but lack a structured, non-bureaucratic medium to manage their availability, mentor assignments, and developmental session summaries. 

ImpactHub solves this problem by offering three dedicated interfaces that streamline mentorship pairing, session booking, and student milestone tracking.

---

## 3. Objectives
- **Role-Separated User Experience**: Provide three distinct login portals and dedicated dashboard environments for Students, Volunteers, and Administrators.
- **Persistent Demonstration State**: Emulate a full CRUD lifecycle within browser `localStorage`, ensuring sample records persist across page reloads.
- **Responsive & Accessible Design**: Deliver an editorial-grade, warm aesthetic with responsive navigation drawers, clear keyboard focus indicators, and accessible contrast ratios.
- **Zero-Dependency Execution**: Ensure the prototype runs instantly in any modern browser by opening `index.html` directly or via VS Code Live Server.

---

## 4. Key Features

### For Students
- **Personalized Welcome & Metrics**: Summary cards displaying active mentor, session tallies, resource completion, and workshop enrollments.
- **My Mentor Profile**: View assigned mentor's bio, credentials, weekly availability, and private developmental guidance notes.
- **Guidance Sessions**: Review past and upcoming sessions, or submit a session request with custom topic, date, and preferred time.
- **Learning Resources Library**: Categorized academic, career, technical, and wellbeing resources with one-click completion tracking.
- **Community Activities**: RSVP to campus workshops, hackathons, and panel clinics with real-time capacity trackers.
- **Profile Management**: Update contact details and career focus statements.

### For Volunteers
- **Mentee Oversight**: Access dossiers for assigned students, including degree, year, and focus areas.
- **Request Triage**: Accept incoming student guidance requests and directly convert them into scheduled sessions, or decline with constructive feedback.
- **Session Management**: Conclude completed meetings with comprehensive summaries and action items.
- **Confidential Guidance Notes**: Create student-specific developmental notes that are only visible to the respective mentee.
- **Availability Editor**: Set weekly mentoring availability windows.

### For Administrators
- **Dynamic Platform Overview**: Real-time statistics derived directly from stored data arrays (total students, volunteer approval pipeline, active pairings).
- **Student Management**: Search, filter by department, edit profile fields, toggle active/inactive status, or delete accounts with confirmation.
- **Volunteer Application Approval**: Review pending applications, verify skills, and approve or reject candidates with immediate status synchronization.
- **Mentor Assignment Engine**: Match approved volunteers with students, reassign mentors, and enforce rules preventing duplicate active mentors.
- **Activity & Resource Publishing**: Full CRUD control to publish, edit, or remove workshops and learning resources.
- **Interactive Visual Reports**: Pure SVG/CSS visualizations for department distribution, session completion ratios, and volunteer approval pipelines.
- **Platform Announcements**: Broadcast messages targeted to all users or specific roles.
- **Demonstration State Management**: One-click **Reset Demo Data** function with confirmation modal, plus **Export Demo Data as JSON** to download state snapshots.

---

## 5. Three User Roles & Portals

| Role | Portal File | Core Responsibility |
| :--- | :--- | :--- |
| **Student** | `student-login.html` &rarr; `student-dashboard.html` | Requests guidance, completes resources, tracks milestones |
| **Volunteer** | `volunteer-login.html` &rarr; `volunteer-dashboard.html` | Evaluates requests, conducts sessions, publishes feedback |
| **Admin** | `admin-login.html` &rarr; `admin-dashboard.html` | Approves volunteers, assigns mentors, oversees analytics |

*Note: Role-based session guards prevent students or volunteers from accessing unauthorized portals.*

---

## 6. Technology Stack
- **HTML5**: Semantic document structure, accessible ARIA attributes, modal dialogs, and native form inputs.
- **CSS3**: Custom design tokens (CSS variables), CSS Grid, Flexbox, responsive media queries, and animations adhering to `prefers-reduced-motion`.
- **Vanilla JavaScript (ES6+)**: Modular IIFE architecture, centralized storage management, event delegation, and DOM manipulation.
- **Browser localStorage**: Client-side persistence simulating database collections.
- **SVG / Canvas**: Lightweight custom vector icons and pure CSS/SVG visual analytics.

---

## 7. Architecture Overview
```
┌────────────────────────────────────────────────────────┐
│                      Client Browser                    │
│                                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐  │
│  │ Student Portal  │ │Volunteer Portal │ │  Admin   │  │
│  │ (student.js)    │ │(volunteer.js)   │ │(admin.js)│  │
│  └────────┬────────┘ └────────┬────────┘ └────┬─────┘  │
│           │                   │               │        │
│           ▼                   ▼               ▼        │
│  ┌──────────────────────────────────────────────────┐  │
│  │               Auth Service (auth.js)             │  │
│  │  - Session checking & role routing               │  │
│  │  - Login verification & registration             │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│                           ▼                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Storage Service (storage.js)           │  │
│  │  - CRUD operations for all entities              │  │
│  │  - ID generation & demonstration sample seed     │  │
│  │  - Live platform statistics calculator           │  │
│  │  - JSON export & state reset                     │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│                           ▼                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Browser Window localStorage           │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 8. Project Folder Structure
```
ImpactHub/
├── index.html                  # Landing page with hero, live stats, & portal cards
├── student-login.html          # Student authentication screen
├── student-register.html       # Student registration form
├── volunteer-login.html        # Volunteer authentication screen
├── volunteer-register.html     # Volunteer application form (Pending status)
├── admin-login.html            # Administrator authentication screen
├── student-dashboard.html      # Complete student portal interface
├── volunteer-dashboard.html    # Complete volunteer mentor interface
├── admin-dashboard.html        # Central administrative console
├── README.md                   # Software engineering project documentation
├── css/
│   ├── variables.css           # Color tokens, typography, shadows, spacing
│   ├── global.css              # Typography, buttons, forms, tables, modals, toasts
│   ├── landing.css             # Landing page layout & editorial showcase
│   ├── auth.css                # Split-screen authentication layouts
│   ├── dashboard.css           # Sidebar, topbar, cards, and tab styles
│   └── responsive.css          # Mobile drawer & adaptive breakpoints
├── js/
│   ├── config.js               # Application constants, role keys, demo logins
│   ├── storage.js              # Centralized localStorage CRUD & seed dataset
│   ├── auth.js                 # Authentication logic & role access guards
│   ├── utils.js                # Toasts, modals, date formatting, HTML escaping
│   ├── charts.js               # SVG donut charts & horizontal bar visualizers
│   ├── student.js              # Student dashboard controller & event handlers
│   ├── volunteer.js            # Volunteer dashboard controller & event handlers
│   └── admin.js                # Administrator dashboard controller & actions
└── assets/
    └── icons/
        └── favicon.svg         # Platform vector logo & favicon
```

---

## 9. Instructions to Run Locally
Because this project does not rely on backend dependencies, it can be launched immediately using any standard web browser:

### Option A: Direct Browser Launch
1. Download or clone this repository.
2. Locate `index.html` in your file explorer.
3. Double-click `index.html` to open it in Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.

### Option B: VS Code Live Server
1. Open the project folder in Visual Studio Code.
2. If installed, right-click `index.html` and select **"Open with Live Server"**.
3. The platform will open automatically at `http://127.0.0.1:5500/index.html`.

---

## 10. Demo Account Credentials

Every login screen includes a visible **"Fill Demo"** button to automatically populate credentials for evaluators.

| Role | Username / ID | Password | Account Details |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `adminpassword123` | Dr. Sarah Sterling (Dean of Guidance) |
| **Student** | `STU2024001` | `studentpassword123` | Elena Vance (Computer Science, 3rd Year) |
| **Volunteer** | `VOL2024001` | `volunteerpassword123` | Dr. Evelyn Reed (Software Architecture) |

*Alternative sample accounts initialized in demonstration storage:*
- Student: `STU2024002` (Marcus Thorne), `STU2024003` (Priya Sharma)
- Volunteer: `VOL2024002` (Julian Patel), `VOL2024003` (Clara O'Connor)
- Pending Volunteer Application: `VOL2024004` (Ryan Zhao — approve in Admin Console)

---

## 11. localStorage Architecture & Explanation
All persistent state is stored in the browser's `window.localStorage` under the following namespace keys:

- `impacthub_students`: Array of registered student objects.
- `impacthub_volunteers`: Array of volunteer mentor records and pending applicants.
- `impacthub_assignments`: Relational pairing records between students and volunteers.
- `impacthub_guidance_requests`: Guidance session requests submitted by students.
- `impacthub_sessions`: Calendar appointments with statuses, meeting locations, and summary notes.
- `impacthub_notes`: Confidential mentor feedback notes scoped to specific students.
- `impacthub_resources`: Curated academic and career development guides.
- `impacthub_activities`: Campus seminars, workshops, and competitions.
- `impacthub_notifications`: Announcements and targeted alerts.
- `impacthub_current_session`: Active login session object storing user role and ID.

### Seed Initialization Logic
On initial visit, `storage.js` verifies whether the dataset has been seeded. If uninitialized, it populates 6 fictional students, 4 volunteers, 3 active pairings, 5 guidance requests, 4 sessions, 6 learning resources, 4 activities, and platform announcements.

---

## 12. Limitations of Frontend-Only Prototype
1. **Local Scope**: Data is stored exclusively within the local browser instance and does not synchronize across different devices or separate browser profiles.
2. **Security & Authentication**: Authentication is simulated for presentation purposes; passwords and data can be inspected in browser developer tools.
3. **Storage Caps**: Typical browser `localStorage` is capped at approximately 5MB per origin.

---

## 13. Future Enhancements
- Integration with a Node.js / Express backend with JWT session tokens and bcrypt password hashing.
- Persistent database migration to PostgreSQL with relational foreign keys.
- Real-time WebRTC or Zoom integration for embedded guidance video conferences.
- Automated calendar synchronization via Google Calendar and Outlook APIs.
- Automated email / SMS reminders for upcoming guidance sessions.

---

## 14. Academic Project Disclaimer
This web application is developed strictly as a college Software Engineering project prototype for demonstration and evaluation. It does not process real personal data or represent an operational university guidance platform.
