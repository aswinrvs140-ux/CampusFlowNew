import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  DoorOpen,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Users,
  X,
  AlertTriangle,
  Trash2
} from "lucide-react";

const API = "/api";

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));

function App() {
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = async () => {
    try {
      setError("");
      const [f, c, r, t, d] = await Promise.all([
        api("/faculty"),
        api("/courses"),
        api("/rooms"),
        api("/timetable"),
        api("/dashboard")
      ]);
      setFaculty(f);
      setCourses(c);
      setRooms(r);
      setTimetable(t);
      setDashboard(d);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(timeout);
  }, [notice]);

  const navigate = (target) => {
    setPage(target);
    setMobileOpen(false);
  };

  const nav = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["timetable", "Timetable", CalendarDays],
    ["faculty", "Faculty", Users],
    ["courses", "Courses", BookOpen],
    ["rooms", "Rooms", DoorOpen]
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">C</div>
          <div>
            <strong>CampusFlow</strong>
            <span>Academic Operations</span>
          </div>
        </div>

        <nav className="nav">
          {nav.map(([key, label, Icon]) => (
            <button
              key={key}
              className={`nav-item ${page === key ? "active" : ""}`}
              onClick={() => navigate(key)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="side-note">
          <div className="pulse" />
          <div>
            <strong>Planning engine ready</strong>
            <span>Conflict checks enabled</span>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="backdrop" onClick={() => setMobileOpen(false)} />}

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)}>
            <Menu size={21} />
          </button>

          <div>
            <div className="kicker">ACADEMIC OPERATIONS</div>
            <h1>{nav.find(([key]) => key === page)?.[1]}</h1>
          </div>

          <div className="top-right">
            <div className="date-chip">
              {new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short"
              }).format(new Date())}
            </div>
            <div className="avatar">AR</div>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {notice && <div className="toast">{notice}</div>}

        {page === "dashboard" && (
          <Dashboard dashboard={dashboard} timetable={timetable} faculty={faculty} />
        )}

        {page === "timetable" && (
          <Timetable
            faculty={faculty}
            courses={courses}
            rooms={rooms}
            timetable={timetable}
            refresh={refresh}
            notify={setNotice}
          />
        )}

        {page === "faculty" && (
          <Faculty faculty={faculty} timetable={timetable} />
        )}

        {page === "courses" && <Courses courses={courses} faculty={faculty} />}

        {page === "rooms" && <Rooms rooms={rooms} timetable={timetable} />}
      </main>
    </div>
  );
}

function Dashboard({ dashboard, timetable, faculty }) {
  const upcoming = timetable.slice(0, 6);

  return (
    <section className="content">
      <div className="hero">
        <div>
          <div className="hero-overline">SMART SCHEDULING WORKSPACE</div>
          <h2>Plan classes before conflicts become problems.</h2>
          <p>
            CampusFlow connects courses, rooms and faculty into one
            scheduling workflow with automatic conflict validation.
          </p>
        </div>
        <div className="hero-symbol">
          <Activity size={56} strokeWidth={1.4} />
        </div>
      </div>

      <div className="stats">
        <Stat icon={<CalendarDays />} value={dashboard.totalClasses ?? 0} label="Scheduled classes" />
        <Stat icon={<Users />} value={dashboard.totalFaculty ?? 0} label="Faculty members" />
        <Stat icon={<DoorOpen />} value={dashboard.totalRooms ?? 0} label="Rooms" />
        <Stat icon={<AlertTriangle />} value={dashboard.conflicts ?? 0} label="Conflicts blocked" />
      </div>

      <div className="grid-2">
        <div className="card">
          <CardHeader title="Upcoming classes" subtitle="Latest entries from the timetable" />
          <div className="class-list">
            {upcoming.length ? (
              upcoming.map((item) => (
                <div className="class-row" key={item.id}>
                  <div className="day-box">
                    <strong>{item.day.slice(0, 3)}</strong>
                    <span>{item.period}</span>
                  </div>
                  <div className="class-main">
                    <strong>{item.course_code}  -  {item.course_name}</strong>
                    <span>{item.faculty_name}  -  {item.room_name}</span>
                  </div>
                  <ChevronRight size={16} className="muted-icon" />
                </div>
              ))
            ) : (
              <Empty text="No classes scheduled yet." />
            )}
          </div>
        </div>

        <div className="card">
          <CardHeader title="Faculty workload" subtitle="Scheduled classes per faculty" />
          <div className="workload-list">
            {faculty.slice(0, 6).map((person) => {
              const count = timetable.filter((x) => x.faculty_id === person.id).length;
              const width = Math.min(100, count * 18 + 8);
              return (
                <div key={person.id} className="workload">
                  <div className="workload-top">
                    <div className="person">
                      <div className="small-avatar">{initials(person.name)}</div>
                      <div>
                        <strong>{person.name}</strong>
                        <span>{person.department}</span>
                      </div>
                    </div>
                    <b>{count}</b>
                  </div>
                  <div className="bar"><i style={{ width: `${width}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <CardHeader title="What makes the project different" subtitle="A small product mindset, not just CRUD screens" />
        <div className="insight-grid">
          <Insight title="Constraint validation" text="The backend rejects faculty and room collisions before data is stored." />
          <Insight title="Relational model" text="Faculty, courses, rooms and timetable records are connected through foreign keys." />
          <Insight title="API-first flow" text="The React client consumes a clean REST API instead of manipulating the database directly." />
          <Insight title="Future-ready" text="The design can evolve into authentication, calendar drag-and-drop and automated scheduling." />
        </div>
      </div>
    </section>
  );
}

function Timetable({ faculty, courses, rooms, timetable, refresh, notify }) {
  const [day, setDay] = useState("Monday");
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    return timetable.filter((item) => {
      const matchesDay = item.day === day;
      const text = `${item.course_code} ${item.course_name} ${item.faculty_name} ${item.room_name}`.toLowerCase();
      return matchesDay && text.includes(query.toLowerCase());
    });
  }, [timetable, day, query]);

  const addClass = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await api("/timetable", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form.entries()))
      });

      setShowAdd(false);
      event.currentTarget.reset();
      notify("Class added successfully.");
      await refresh();
    } catch (err) {
      notify(err.message);
    }
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Remove this timetable entry?")) return;

    try {
      await api(`/timetable/${id}`, { method: "DELETE" });
      notify("Timetable entry removed.");
      await refresh();
    } catch (err) {
      notify(err.message);
    }
  };

  return (
    <section className="content">
      <div className="section-heading">
        <div>
          <h2>Weekly Timetable</h2>
          <p>Conflict-aware scheduling for rooms, courses and faculty.</p>
        </div>
        <button className="btn primary" onClick={() => setShowAdd(true)}>
          <Plus size={17} /> Add class
        </button>
      </div>

      <div className="toolbar">
        <div className="day-tabs">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((item) => (
            <button
              key={item}
              className={day === item ? "day-tab active" : "day-tab"}
              onClick={() => setDay(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="search-wrap">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search course, faculty or room"
          />
        </div>
      </div>

      <div className="timetable-grid">
        {filtered.length ? (
          filtered.map((item) => (
            <article className="schedule-card" key={item.id}>
              <div className="schedule-top">
                <span className="period">Period {item.period}</span>
                <button className="delete-btn" onClick={() => deleteClass(item.id)} title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>

              <h3>{item.course_code}</h3>
              <p>{item.course_name}</p>

              <div className="schedule-meta">
                <span><Users size={14} /> {item.faculty_name}</span>
                <span><DoorOpen size={14} /> {item.room_name}</span>
              </div>
            </article>
          ))
        ) : (
          <Empty text={`No classes for ${day}.`} />
        )}
      </div>

      {showAdd && (
        <Modal title="Add timetable class" onClose={() => setShowAdd(false)}>
          <form className="form-grid" onSubmit={addClass}>
            <Field label="Day">
              <select name="day" required defaultValue={day}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>

            <Field label="Period">
              <select name="period" required defaultValue="1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>

            <Field label="Course">
              <select name="course_id" required>
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} Ã¢â‚¬â€ {course.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Faculty">
              <select name="faculty_id" required>
                <option value="">Select faculty</option>
                {faculty.map((person) => (
                  <option key={person.id} value={person.id}>{person.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Room" full>
              <select name="room_id" required>
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} Ã¢â‚¬â€ {room.type} Ã¢â‚¬â€ capacity {room.capacity}
                  </option>
                ))}
              </select>
            </Field>

            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn primary" type="submit">Create schedule</button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

function Faculty({ faculty, timetable }) {
  const [search, setSearch] = useState("");

  const rows = faculty.filter((person) =>
    `${person.name} ${person.department} ${person.designation} ${person.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="content">
      <div className="section-heading">
        <div>
          <h2>Faculty Directory</h2>
          <p>Workload is derived from the timetable records.</p>
        </div>
        <div className="search-wrap wide">
          <Search size={17} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search faculty" />
        </div>
      </div>

      <div className="card table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Classes</th>
                <th>Workload</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((person) => {
                const classes = timetable.filter((x) => x.faculty_id === person.id).length;
                return (
                  <tr key={person.id}>
                    <td>
                      <div className="person">
                        <div className="small-avatar">{initials(person.name)}</div>
                        <div>
                          <strong>{person.name}</strong>
                          <span>{person.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{person.department}</td>
                    <td>{person.designation}</td>
                    <td>{classes}</td>
                    <td>
                      <span className={`status-pill ${classes >= 5 ? "high" : classes >= 3 ? "mid" : "low"}`}>
                        {classes >= 5 ? "High" : classes >= 3 ? "Moderate" : "Light"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Courses({ courses, faculty }) {
  return (
    <section className="content">
      <div className="section-heading">
        <div>
          <h2>Course Catalog</h2>
          <p>Academic subjects available for timetable planning.</p>
        </div>
      </div>

      <div className="course-grid">
        {courses.map((course) => (
          <article className="course-card" key={course.id}>
            <div className="course-code">{course.code}</div>
            <h3>{course.name}</h3>
            <p>{course.department}</p>
            <div className="course-foot">
              <span>{course.credits} credits</span>
              <span>{course.semester}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="callout">
        <strong>Data relationship:</strong> Courses are referenced by timetable entries, while faculty are assigned separately so that the same course can be delivered by different faculty across sections.
      </div>

      <div className="tiny-note">{faculty.length} faculty members currently available for scheduling.</div>
    </section>
  );
}

function Rooms({ rooms, timetable }) {
  const getCount = (id) => timetable.filter((item) => item.room_id === id).length;

  return (
    <section className="content">
      <div className="section-heading">
        <div>
          <h2>Room Inventory</h2>
          <p>Track room types, capacity and current schedule usage.</p>
        </div>
      </div>

      <div className="room-grid">
        {rooms.map((room) => {
          const count = getCount(room.id);
          const occupancy = Math.min(100, count * 14 + 6);
          return (
            <article className="room-card" key={room.id}>
              <div className="room-icon"><DoorOpen size={21} /></div>
              <div className="room-title">
                <h3>{room.name}</h3>
                <span>{room.type}</span>
              </div>
              <div className="room-meta">
                <span>Capacity</span><strong>{room.capacity}</strong>
              </div>
              <div className="room-meta">
                <span>Scheduled slots</span><strong>{count}</strong>
              </div>
              <div className="bar"><i style={{ width: `${occupancy}%` }} /></div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function CardHeader({ title, subtitle }) {
  return (
    <div className="card-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function Insight({ title, text }) {
  return (
    <div className="insight">
      <CheckCircle2 size={17} />
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Field({ label, children, full = false }) {
  return (
    <label className={full ? "field full" : "field"}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-layer">
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="kicker">SCHEDULING WORKFLOW</div>
            <h2>{title}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={19} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Empty({ text }) {
  return <div className="empty">{text}</div>;
}

export default App;


