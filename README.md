# ClassBridge — UI/UX-first Academic Scheduling System

ClassBridge is a **UI/UX-first full-stack university scheduling prototype** that demonstrates how I approach information architecture, interaction design, responsive frontend development, REST APIs and relational data.

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
classbridge/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── conflict.js
│   │   └── server.js
│   ├── test/
│   │   └── conflict.test.js
│   └── package.json
├── design/
│   └── UX_CASE_STUDY.md
├── github-profile-readme/
├── .gitignore
├── package.json
└── README.md
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

**ClassBridge — UI/UX-first Academic Scheduling System | React, JavaScript, Node.js, Express, SQLite**

> Designed and developed a responsive academic scheduling application focused on information architecture, visual hierarchy and interaction design. Built timetable, faculty workload and room interfaces with reusable React components, while integrating a REST API and SQLite backend with conflict-detection logic.

## How I would present my contribution

> “My main interest is UI/UX and frontend development, so I focused on the information architecture, visual hierarchy, responsive interface and interaction states. I also connected the UI to a Node/Express API and SQLite database so the project works as a real application rather than a static design.”

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
