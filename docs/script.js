const API = "https://timesheet-app-8cmu.onrender.com";

let loggedEmployer = null;
let loggedEmployee = null;

// Cache DOM elements (IMPORTANT FIX)
const employerAuth = document.getElementById("employer-auth");
const employeeAuth = document.getElementById("employee-auth");
const employerPanel = document.getElementById("employer-panel");
const employeePanel = document.getElementById("employee-panel");

function showEmployer() {
  employerAuth.style.display = "block";
  employeeAuth.style.display = "none";
}

function showEmployee() {
  employerAuth.style.display = "none";
  employeeAuth.style.display = "block";
}

function loginEmployer() {
  fetch(API + "/employer/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: em_login_email.value,
      password: em_login_password.value
    })
  })
  .then(r => r.json())
  .then(d => {
    if (!d.email) return alert("Invalid employer login");
    loggedEmployer = d;
    employerAuth.style.display = "none";
    employerPanel.style.display = "block";
    loadTable();
  })
  .catch(() => alert("Employer login failed"));
}

function loginEmployee() {
  fetch(API + "/employee/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: el_email.value,
      password: el_password.value
    })
  })
  .then(r => r.json())
  .then(d => {
    if (!d.email) return alert("Invalid employee login");
    loggedEmployee = d;
    employeeAuth.style.display = "none";
    employeePanel.style.display = "block";
  })
  .catch(() => alert("Employee login failed"));
}

function logoutEmployer() {
  loggedEmployer = null;
  employerPanel.style.display = "none";
  employerAuth.style.display = "block";
}

function logoutEmployee() {
  loggedEmployee = null;
  employeePanel.style.display = "none";
  employeeAuth.style.display = "block";
}

function addEmployee() {
  if (!loggedEmployer) return alert("Login as employer");

  fetch(API + "/employee/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: ae_name.value,
      email: ae_email.value,
      password: ae_password.value
    })
  })
  .then(r => r.json())
  .then(() => {
    alert("Employee added");
    ae_name.value = ae_email.value = ae_password.value = "";
  })
  .catch(() => alert("Failed to add employee"));
}

function addTime() {
  if (!loggedEmployee) return alert("Login as employee");

  fetch(API + "/timesheet/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      employeeId: loggedEmployee.email,
      date: new Date().toISOString().split("T")[0],
      hours: hours.value
    })
  })
  .then(r => r.json())
  .then(() => alert("Time added"))
  .catch(() => alert("Failed to add time"));
}

function loadTable() {
  fetch(API + "/report/all")
    .then(r => r.json())
    .then(rows => {
      const tbody = document.querySelector("#reportTable tbody");
      tbody.innerHTML = "";

      if (!rows.length) {
        tbody.innerHTML = "<tr><td colspan='4'>No entries yet</td></tr>";
        return;
      }

      rows.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${r.name}</td>
          <td>${r.email}</td>
          <td>${r.date}</td>
          <td>${r.hours}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(() => alert("Table load failed"));
}
