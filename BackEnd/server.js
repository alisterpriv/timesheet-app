const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../FrontEnd")));

const DB_FILE = path.join(__dirname, "data.json");

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Employer register (run once to create employer)
app.post("/employer/register", (req, res) => {
  const db = readDB();
  db.employers.push(req.body);
  writeDB(db);
  res.json({ message: "Employer registered" });
});

// Employer login
app.post("/employer/login", (req, res) => {
  const db = readDB();
  const employer = db.employers.find(
    e => e.email === req.body.email && e.password === req.body.password
  );
  if (!employer) return res.status(401).json({ message: "Invalid login" });
  res.json(employer);
});

// Add employee
app.post("/employee/add", (req, res) => {
  const db = readDB();
  db.employees.push(req.body);
  writeDB(db);
  res.json({ message: "Employee added" });
});

// Employee login
app.post("/employee/login", (req, res) => {
  const db = readDB();
  const user = db.employees.find(
    e => e.email === req.body.email && e.password === req.body.password
  );
  if (!user) return res.status(401).json({ message: "Invalid login" });
  res.json(user);
});

// Add timesheet
app.post("/timesheet/add", (req, res) => {
  const db = readDB();
  db.timesheets.push(req.body);
  writeDB(db);
  res.json({ message: "Time added" });
});

// Excel-style table for employer
app.get("/report/all", (req, res) => {
  const db = readDB();

  const rows = db.timesheets.map(t => {
    const emp = db.employees.find(e => e.email === t.employeeId);
    return {
      name: emp ? emp.name : "Unknown",
      email: t.employeeId,
      date: t.date,
      hours: t.hours
    };
  });

  res.json(rows);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});