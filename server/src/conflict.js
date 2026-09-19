export function findConflicts(existingEntries, candidate) {
  return existingEntries.filter((entry) => {
    if (entry.day !== candidate.day || String(entry.period) !== String(candidate.period)) {
      return false;
    }

    const facultyConflict =
      Number(entry.faculty_id) === Number(candidate.faculty_id);

    const roomConflict =
      Number(entry.room_id) === Number(candidate.room_id);

    return facultyConflict || roomConflict;
  }).map((entry) => ({
    id: entry.id,
    facultyConflict: Number(entry.faculty_id) === Number(candidate.faculty_id),
    roomConflict: Number(entry.room_id) === Number(candidate.room_id)
  }));
}
