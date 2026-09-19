import test from "node:test";
import assert from "node:assert/strict";
import { findConflicts } from "../src/conflict.js";

test("detects a faculty collision", () => {
  const existing = [
    { id: 1, faculty_id: 10, room_id: 20, day: "Monday", period: 2 }
  ];

  const result = findConflicts(existing, {
    faculty_id: 10,
    room_id: 21,
    day: "Monday",
    period: 2
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].facultyConflict, true);
  assert.equal(result[0].roomConflict, false);
});

test("detects a room collision", () => {
  const existing = [
    { id: 1, faculty_id: 10, room_id: 20, day: "Tuesday", period: 3 }
  ];

  const result = findConflicts(existing, {
    faculty_id: 11,
    room_id: 20,
    day: "Tuesday",
    period: 3
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].facultyConflict, false);
  assert.equal(result[0].roomConflict, true);
});

test("allows a valid schedule", () => {
  const existing = [
    { id: 1, faculty_id: 10, room_id: 20, day: "Friday", period: 1 }
  ];

  const result = findConflicts(existing, {
    faculty_id: 11,
    room_id: 21,
    day: "Friday",
    period: 1
  });

  assert.equal(result.length, 0);
});
