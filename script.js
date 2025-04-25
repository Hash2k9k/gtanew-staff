const adminCode = "gtanewtop!";

function isAuthorized() {
  return prompt("Mot de passe administrateur ?") === adminCode;
}

function loadStaffData() {
  const data = JSON.parse(localStorage.getItem("staff")) || [];
  const tbody = document.getElementById("staff-list");
  tbody.innerHTML = "";
  const total = data.reduce((sum, s) => sum + s.tickets, 0);
  data.forEach((staff, i) => {
    const tr = document.createElement("tr");
    const progress = total > 0 ? (staff.tickets / total) * 100 : 0;
    tr.innerHTML = `
      <td>${staff.name}</td>
      <td>
        <input type="number" value="${staff.tickets}" data-index="${i}" class="tickets-input" />
        <div class="progress-bar"><div class="progress" style="width:${progress}%"></div></div>
      </td>
      <td><button onclick="deleteStaff(${i})">Supprimer</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".tickets-input").forEach(input => {
    input.addEventListener("input", e => updateTickets(e.target));
  });

  updateStats(data);
  loadLogs();
}

function updateTickets(input) {
  if (!isAuthorized()) return;
  const index = input.dataset.index;
  const staff = JSON.parse(localStorage.getItem("staff")) || [];
  staff[index].tickets = parseInt(input.value, 10);
  localStorage.setItem("staff", JSON.stringify(staff));
  logAction(`Mise à jour des tickets pour ${staff[index].name}`);
  loadStaffData();
}

function deleteStaff(index) {
  if (!isAuthorized()) return;
  const staff = JSON.parse(localStorage.getItem("staff")) || [];
  logAction(`Suppression de ${staff[index].name}`);
  staff.splice(index, 1);
  localStorage.setItem("staff", JSON.stringify(staff));
  loadStaffData();
}

function addStaff(e) {
  e.preventDefault();
  if (!isAuthorized()) return;
  const name = document.getElementById("staff-name").value;
  const tickets = parseInt(document.getElementById("staff-tickets").value, 10);
  const data = JSON.parse(localStorage.getItem("staff")) || [];
  data.push({ name, tickets });
  localStorage.setItem("staff", JSON.stringify(data));
  logAction(`Ajout de ${name} avec ${tickets} tickets`);
  e.target.reset();
  loadStaffData();
}

function updateStats(data) {
  const total = data.reduce((sum, s) => sum + s.tickets, 0);
  const moyenne = total / (data.length || 1);
  const best = data.reduce((a, b) => (b.tickets > a.tickets ? b : a), { name: '', tickets: 0 });
  document.getElementById("stats").innerHTML = `
    <h3>Statistiques</h3>
    <p>Total tickets traités : <strong>${total}</strong></p>
    <p>Moyenne par membre : <strong>${moyenne.toFixed(2)}</strong></p>
    <p>Top performer : <strong>${best.name} (${best.tickets} tickets)</strong></p>
  `;
}

function logAction(msg) {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  logs.unshift(`[${new Date().toLocaleString()}] ${msg}`);
  localStorage.setItem("logs", JSON.stringify(logs));
  loadLogs();
}

function loadLogs() {
  const logList = document.getElementById("log-list");
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  logList.innerHTML = logs.slice(0, 10).map(log => `<li>${log}</li>`).join("");
}

function sortStaff() {
  const staff = JSON.parse(localStorage.getItem("staff")) || [];
  staff.sort((a, b) => b.tickets - a.tickets);
  localStorage.setItem("staff", JSON.stringify(staff));
  loadStaffData();
}

document.getElementById("add-staff-form").addEventListener("submit", addStaff);
document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  document.querySelectorAll("#staff-list tr").forEach(row => {
    row.style.display = row.children[0].textContent.toLowerCase().includes(value) ? "" : "none";
  });
});

loadStaffData();
