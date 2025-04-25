// Chargement initial
document.addEventListener('DOMContentLoaded', () => {
  loadStaffData();
});

// Fonction pour charger les données du staff depuis le localStorage
function loadStaffData() {
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  const staffList = document.getElementById('staff-list');
  staffList.innerHTML = '';

  staffData.forEach((staff, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${staff.name}</td>
      <td><input type="number" value="${staff.tickets}" class="tickets-input" data-index="${index}" /></td>
      <td><button class="delete-btn" data-index="${index}">Supprimer</button></td>
    `;
    staffList.appendChild(row);
  });

  // Lier les événements
  document.querySelectorAll('.tickets-input').forEach(input => {
    input.addEventListener('input', (e) => updateTickets(e.target));
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => deleteStaff(e.target));
  });

  updateStats();
}

// Mettre à jour le nombre de tickets
function updateTickets(input) {
  const index = input.getAttribute('data-index');
  const newValue = parseInt(input.value, 10);
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  const oldValue = staffData[index].tickets;

  staffData[index].tickets = newValue;
  localStorage.setItem('staff', JSON.stringify(staffData));
  addLog(`${staffData[index].name} modifié : ${oldValue} → ${newValue} tickets`);
  updateStats();
}

// Supprimer un membre du staff
function deleteStaff(button) {
  const index = button.getAttribute('data-index');
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  const name = staffData[index].name;

  staffData.splice(index, 1);
  localStorage.setItem('staff', JSON.stringify(staffData));
  addLog(`${name} supprimé du staff`);
  loadStaffData();
}

// Ajouter un nouveau membre
document.getElementById('add-staff-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const nameInput = document.getElementById('staff-name');
  const ticketsInput = document.getElementById('staff-tickets');

  const newStaff = {
    name: nameInput.value.trim(),
    tickets: parseInt(ticketsInput.value, 10)
  };

  if (newStaff.name === '' || isNaN(newStaff.tickets)) return;

  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  staffData.push(newStaff);
  localStorage.setItem('staff', JSON.stringify(staffData));

  addLog(`${newStaff.name} ajouté avec ${newStaff.tickets} tickets`);
  nameInput.value = '';
  ticketsInput.value = '0';
  loadStaffData();
});

// Rechercher un membre
document.getElementById('search').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#staff-list tr');

  rows.forEach(row => {
    const name = row.querySelector('td').textContent.toLowerCase();
    row.style.display = name.includes(query) ? '' : 'none';
  });
});

// Trier par nombre de tickets
function sortStaff() {
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  staffData.sort((a, b) => b.tickets - a.tickets);
  localStorage.setItem('staff', JSON.stringify(staffData));
  loadStaffData();
}

// Logs
function addLog(message) {
  const logs = JSON.parse(localStorage.getItem('logs')) || [];
  const time = new Date().toLocaleString();
  logs.unshift(`[${time}] ${message}`);
  localStorage.setItem('logs', JSON.stringify(logs));
  updateLogs();
}

// Afficher l'historique
function updateLogs() {
  const logs = JSON.parse(localStorage.getItem('logs')) || [];
  const logList = document.getElementById('log-list');
  logList.innerHTML = '';
  logs.slice(0, 20).forEach(log => {
    const li = document.createElement('li');
    li.textContent = log;
    logList.appendChild(li);
  });
}

// Statistiques
function updateStats() {
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  const total = staffData.reduce((sum, s) => sum + s.tickets, 0);
  const top = staffData.reduce((prev, curr) => curr.tickets > prev.tickets ? curr : prev, { name: '-', tickets: 0 });

  document.getElementById('stats').innerHTML = `
    <h3>Statistiques</h3>
    <p>Total de tickets traités : <strong>${total}</strong></p>
    <p>Meilleur staff : <strong>${top.name}</strong> (${top.tickets} tickets)</p>
  `;

  updateLogs();
}
