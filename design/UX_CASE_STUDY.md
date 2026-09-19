# CampusFlow â€” UI/UX Case Study

## 1. Problem
University scheduling information is often scattered across timetables, spreadsheets, room lists and faculty availability. Users need to answer simple questions quickly:

- Which class is happening when?
- Is a room available?
- Which faculty member is scheduled?
- Can a timetable entry create a conflict?

## 2. Target Users

### Academic coordinator
Needs fast overview, schedule visibility and conflict prevention.

### Faculty member
Needs an easy-to-scan timetable and workload visibility.

### Student / student project coordinator
Needs clear room and schedule information with minimal navigation.

## 3. Information Architecture

```text
Dashboard
â”œâ”€â”€ Today / summary
â”œâ”€â”€ Upcoming classes
â”œâ”€â”€ Faculty workload
â””â”€â”€ Design decisions

Timetable
â”œâ”€â”€ Day selection
â”œâ”€â”€ Search
â”œâ”€â”€ Schedule cards
â””â”€â”€ Conflict-aware add flow

Faculty
â”œâ”€â”€ Search
â”œâ”€â”€ Department
â””â”€â”€ Workload

Courses
â””â”€â”€ Course cards

Rooms
â””â”€â”€ Capacity + occupancy
```

## 4. UX Decisions

- **Progressive disclosure:** summary information appears first; details are available when needed.
- **Visual scanning:** timetable cards use strong course codes, smaller metadata and spacing between items.
- **Consistent states:** status, buttons and alerts use one visual language.
- **Responsive behavior:** navigation and grids adapt to smaller screens instead of simply shrinking desktop content.
- **Error prevention:** scheduling conflicts are checked before a timetable record is created.

## 5. Design System

### Typography
- Display: Space Grotesk
- UI/body: DM Sans

### Components
- Sidebar navigation
- Top navigation
- Stat cards
- Schedule cards
- Search controls
- Status pills
- Modal forms
- Data tables
- Empty/error states

### Visual tokens
- Primary accent: indigo
- Success: green
- Warning: amber
- Error: rose
- Surface: white
- Background: soft neutral

## 6. Accessibility Intent

- semantic buttons and form controls
- visible focus styles
- readable contrast between text and surfaces
- responsive layout
- status communicated with text, not color alone

## 7. What I would improve next

- Create a high-fidelity Figma prototype
- Run usability testing with 3â€“5 students/coordinators
- Add keyboard-only navigation audit
- Add a calendar drag-and-drop interaction
- Measure task completion time for schedule creation
