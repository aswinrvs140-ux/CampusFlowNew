import express from "express";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { findConflicts } from "./conflict.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const db = new Database(path.join(__dirname, "../CampusFlow.db"));
db.pragma("foreign_keys = ON");

app.use(express.json());

db.exec(`
  CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    credits INTEGER NOT NULL,
    semester TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    capacity INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    faculty_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    day TEXT NOT NULL,
    period INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY(faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    UNIQUE(day, period, room_id)
  );
`);

const todaySeed = {
  faculty: [
    ["Dr. Ananya Raman", "Computer Science", "Professor", "ananya@demo.edu"],
    ["Prof. Karthik S", "Information Technology", "Associate Professor", "karthik@demo.edu"],
    ["Dr. Meera Krishnan", "Artificial Intelligence", "Assistant Professor", "meera@demo.edu"],
    ["Prof. Arjun Kumar", "Mathematics", "Assistant Professor", "arjun@demo.edu"],
    ["Dr. Nivetha Raj", "Computer Science", "Assistant Professor", "nivetha@demo.edu"],
    ["Prof. Rohan Dev", "Electronics", "Associate Professor", "rohan@demo.edu"]
  ],
  courses: [
    ["CS201", "Data Structures", "Computer Science", 4, "II Semester"],
    ["CS302", "Database Systems", "Computer Science", 4, "III Semester"],
    ["AI310", "Machine Learning", "Artificial Intelligence", 4, "IV Semester"],
    ["IT215", "Web Engineering", "Information Technology", 3, "II Semester"],
    ["MA210", "Discrete Mathematics", "Mathematics", 4, "II Semester"],
    ["EC220", "Digital Systems", "Electronics", 3, "II Semester"]
  ],
  rooms: [
    ["C-201", "Lecture Hall", 60],
    ["C-204", "Lecture Hall", 50],
    ["A-102", "Computer Lab", 40],
    ["AI-Lab", "AI Lab", 36],
    ["M-301", "Tutorial Room", 30],
    ["E-110", "Electronics Lab", 36]
  ]
};

function seed() {
  const count = db.prepare("SELECT COUNT(*) AS count FROM faculty").get().count;
  if (count) return;

  const facultyInsert = db.prepare(`
    INSERT INTO faculty (name, department, designation, email)
    VALUES (?, ?, ?, ?)
  `);
  const courseInsert = db.prepare(`
    INSERT INTO courses (code, name, department, credits, semester)
    VALUES (?, ?, ?, ?, ?)
  `);
  const roomInsert = db.prepare(`
    INSERT INTO rooms (name, type, capacity)
    VALUES (?, ?, ?)
  `);

  const run = db.transaction(() => {
    for (const row of todaySeed.faculty) facultyInsert.run(...row);
    for (const row of todaySeed.courses) courseInsert.run(...row);
    for (const row of todaySeed.rooms) roomInsert.run(...row);
  });

  run();

  const faculty = db.prepare("SELECT id FROM faculty ORDER BY id").all();
  const courses = db.prepare("SELECT id FROM courses ORDER BY id").all();
  const rooms = db.prepare("SELECT id FROM rooms ORDER BY id").all();

  const demo = [
    [courses[0].id, faculty[0].id, rooms[0].id, "Monday", 1],
    [courses[1].id, faculty[1].id, rooms[1].id, "Monday", 2],
    [courses[2].id, faculty[2].id, rooms[3].id, "Monday", 3],
    [courses[3].id, faculty[4].id, rooms[2].id, "Tuesday", 1],
    [courses[4].id, faculty[3].id, rooms[4].id, "Tuesday", 2],
    [courses[5].id, faculty[5].id, rooms[5].id, "Tuesday", 3],
    [courses[0].id, faculty[0].id, rooms[0].id, "Wednesday", 1],
    [courses[1].id, faculty[1].id, rooms[1].id, "Wednesday", 2],
    [courses[2].id, faculty[2].id, rooms[3].id, "Wednesday", 4],
    [courses[3].id, faculty[4].id, rooms[2].id, "Thursday", 1],
    [courses[4].id, faculty[3].id, rooms[4].id, "Thursday", 3],
    [courses[5].id, faculty[5].id, rooms[5].id, "Friday", 2]
  ];

  const insert = db.prepare(`
    INSERT INTO timetable
      (course_id, faculty_id, room_id, day, period, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const addDemo = db.transaction(() => {
    for (const row of demo) {
      insert.run(...row, new Date().toISOString());
    }
  });

  addDemo();
}

seed();

function facultyWithStats() {
  return db.prepare(`
    SELECT
      f.*,
      COUNT(t.id) AS scheduled_classes
    FROM faculty f
    LEFT JOIN timetable t ON t.faculty_id = f.id
    GROUP BY f.id
    ORDER BY f.name
  `).all();
}

function timetableRows() {
  return db.prepare(`
    SELECT
      t.id,
      t.course_id,
      t.faculty_id,
      t.room_id,
      t.day,
      t.period,
      c.code AS course_code,
      c.name AS course_name,
      f.name AS faculty_name,
      r.name AS room_name,
      r.type AS room_type
    FROM timetable t
    JOIN courses c ON c.id = t.course_id
    JOIN faculty f ON f.id = t.faculty_id
    JOIN rooms r ON r.id = t.room_id
    ORDER BY
      CASE t.day
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
        ELSE 6
      END,
      t.period,
      r.name
  `).all();
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "CampusFlow API" });
});

app.get("/api/faculty", (req, res) => {
  res.json(facultyWithStats());
});

app.post("/api/faculty", (req, res) => {
  const { name, department, designation, email } = req.body;

  if (!name || !department || !designation || !email) {
    return res.status(400).json({ error: "All faculty fields are required." });
  }

  try {
    const result = db.prepare(`
      INSERT INTO faculty (name, department, designation, email)
      VALUES (?, ?, ?, ?)
    `).run(name.trim(), department.trim(), designation.trim(), email.trim());

    res.status(201).json(
      db.prepare("SELECT * FROM faculty WHERE id = ?").get(result.lastInsertRowid)
    );
  } catch {
    res.status(409).json({ error: "Faculty email already exists." });
  }
});

app.get("/api/courses", (req, res) => {
  res.json(db.prepare("SELECT * FROM courses ORDER BY code").all());
});

app.post("/api/courses", (req, res) => {
  const { code, name, department, credits, semester } = req.body;

  if (!code || !name || !department || !credits || !semester) {
    return res.status(400).json({ error: "All course fields are required." });
  }

  try {
    const result = db.prepare(`
      INSERT INTO courses (code, name, department, credits, semester)
      VALUES (?, ?, ?, ?, ?)
    `).run(code.trim(), name.trim(), department.trim(), Number(credits), semester.trim());

    res.status(201).json(
      db.prepare("SELECT * FROM courses WHERE id = ?").get(result.lastInsertRowid)
    );
  } catch {
    res.status(409).json({ error: "Course code already exists." });
  }
});

app.get("/api/rooms", (req, res) => {
  res.json(db.prepare("SELECT * FROM rooms ORDER BY name").all());
});

app.post("/api/rooms", (req, res) => {
  const { name, type, capacity } = req.body;

  if (!name || !type || !capacity) {
    return res.status(400).json({ error: "All room fields are required." });
  }

  try {
    const result = db.prepare(`
      INSERT INTO rooms (name, type, capacity)
      VALUES (?, ?, ?)
    `).run(name.trim(), type.trim(), Number(capacity));

    res.status(201).json(
      db.prepare("SELECT * FROM rooms WHERE id = ?").get(result.lastInsertRowid)
    );
  } catch {
    res.status(409).json({ error: "Room name already exists." });
  }
});

app.get("/api/timetable", (req, res) => {
  res.json(timetableRows());
});

app.post("/api/timetable", (req, res) => {
  const {
    course_id,
    faculty_id,
    room_id,
    day,
    period
  } = req.body;

  if (!course_id || !faculty_id || !room_id || !day || !period) {
    return res.status(400).json({ error: "All timetable fields are required." });
  }

  const existing = db.prepare(`
    SELECT id, faculty_id, room_id, day, period
    FROM timetable
  `).all();

  const conflicts = findConflicts(existing, {
    faculty_id,
    room_id,
    day,
    period
  });

  if (conflicts.length) {
    const reasons = [];
    if (conflicts.some((x) => x.facultyConflict)) reasons.push("faculty already has a class in this slot");
    if (conflicts.some((x) => x.roomConflict)) reasons.push("room is already occupied in this slot");

    return res.status(409).json({
      error: `Scheduling conflict: ${reasons.join(" and ")}.`
    });
  }

  const result = db.prepare(`
    INSERT INTO timetable
      (course_id, faculty_id, room_id, day, period, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    course_id,
    faculty_id,
    room_id,
    day,
    Number(period),
    new Date().toISOString()
  );

  res.status(201).json({
    id: result.lastInsertRowid,
    message: "Timetable entry created."
  });
});

app.delete("/api/timetable/:id", (req, res) => {
  const result = db.prepare(`
    DELETE FROM timetable
    WHERE id = ?
  `).run(req.params.id);

  if (!result.changes) {
    return res.status(404).json({ error: "Timetable entry not found." });
  }

  res.json({ message: "Timetable entry removed." });
});

app.get("/api/dashboard", (req, res) => {
  const totalClasses = db.prepare(
    "SELECT COUNT(*) AS count FROM timetable"
  ).get().count;

  const totalFaculty = db.prepare(
    "SELECT COUNT(*) AS count FROM faculty"
  ).get().count;

  const totalRooms = db.prepare(
    "SELECT COUNT(*) AS count FROM rooms"
  ).get().count;

  // Because the POST endpoint blocks collisions, this normally remains zero.
  // The query is useful as a monitoring metric.
  const collisions = db.prepare(`
    SELECT COUNT(*) AS count
    FROM timetable a
    JOIN timetable b
      ON a.id < b.id
     AND a.day = b.day
     AND a.period = b.period
     AND (a.room_id = b.room_id OR a.faculty_id = b.faculty_id)
  `).get().count;

  res.json({
    totalClasses,
    totalFaculty,
    totalRooms,
    conflicts: collisions
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`CampusFlow API running on http://localhost:${PORT}`);
});
