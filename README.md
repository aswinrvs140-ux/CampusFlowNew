# CampusFlow â€” UI/UX-first Academic Scheduling System

CampusFlow is a **UI/UX-first full-stack university scheduling prototype** that demonstrates how I approach information architecture, interaction design, responsive frontend development, REST APIs and relational data.

> This is an independent student portfolio project using fictional/demo data. It is not an official university system.

## Why I built it

I wanted a project where **UI/UX and frontend engineering are visible parts of the work**, while still demonstrating that I can connect a real interface to a backend and database.

The product solves a university scheduling problem: planning classes while preventing room and faculty collisions.

## What the project demonstrates

### UI/UX
- Information architecture
- Visual hierarchy
- Responsive layouts
- Component consistency
- Search/filter interactions
- Empty, success and error states
- Modal/form interaction patterns
- Accessibility-minded controls
- Design system documentation

### Frontend
- React
- JavaScript
- Reusable components
- API-driven UI
- Responsive CSS

### Backend
- Node.js
- Express
- REST API
- SQLite persistence
- Scheduling validation

### Testing
- Automated conflict-detection tests using Node's built-in test runner

## Main Features

- Dashboard with operational overview
- Timetable with day filtering and search
- Faculty workload view
- Course catalog
- Room inventory
- Conflict detection for faculty and room allocation
- SQLite persistence
- Responsive interface

## Architecture

```text
                React UI
                   |
                   | REST / JSON
                   v
              Express API
                   |
            validation logic
                   |
                   v
                SQLite
```

## Project structure

```text
CampusFlow/
â”œâ”€â”€ client/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ App.jsx
â”‚   â”‚   â”œâ”€â”€ main.jsx
â”‚   â”‚   â””â”€â”€ styles.css
â”‚   â”œâ”€â”€ index.html
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ vite.config.js
â”œâ”€â”€ server/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ conflict.js
â”‚   â”‚   â””â”€â”€ server.js
â”‚   â”œâ”€â”€ test/
â”‚   â”‚   â””â”€â”€ conflict.test.js
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ design/
â”‚   â””â”€â”€ UX_CASE_STUDY.md
â”œâ”€â”€ github-profile-readme/
â”œâ”€â”€ .gitignore
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

## Run locally

Requirements:

- Node.js 20+
- npm
- VS Code
- Git

Install dependencies:

```bash
npm install
```

Run frontend + backend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Run tests:

```bash
npm test
```

## Resume description

**CampusFlow â€” UI/UX-first Academic Scheduling System | React, JavaScript, Node.js, Express, SQLite**

> Designed and developed a responsive academic scheduling application focused on information architecture, visual hierarchy and interaction design. Built timetable, faculty workload and room interfaces with reusable React components, while integrating a REST API and SQLite backend with conflict-detection logic.

## How I would present my contribution

> â€œMy main interest is UI/UX and frontend development, so I focused on the information architecture, visual hierarchy, responsive interface and interaction states. I also connected the UI to a Node/Express API and SQLite database so the project works as a real application rather than a static design.â€

## Design case study

See [`design/UX_CASE_STUDY.md`](design/UX_CASE_STUDY.md) for the project rationale, target users, information architecture, UX decisions, design system and accessibility intent.

## Future improvements

- High-fidelity Figma prototype
- Usability testing
- Accessibility audit
- Drag-and-drop calendar interaction
- Role-based authentication
- PostgreSQL deployment
- Notifications and calendar integration
- Flutter mobile client
