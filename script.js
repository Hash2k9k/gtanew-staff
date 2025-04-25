// Vérifie le mot de passe et charge le contenu principal
function checkPassword() {
  const password = document.getElementById('password-input').value;
  const correctPassword = '1234'; // Mot de passe fictif, à changer
  if (password === correctPassword) {
    sessionStorage.setItem('loggedIn', 'true');
    loadStaffData();
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
  } else {
    alert('Mot de passe incorrect');
  }
}

// Déconnexion
function logout() {
  sessionStorage.removeItem('loggedIn');
  document.getElementById('auth-screen').style.display = 'block';
  document.getElementById('main-content').style.display = 'none';
}

// Chargement des données du staff depuis le localStorage
function loadStaffData() {
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  const staffList = document.getElementById('staff-list');
  staffList.innerHTML = '';

  staffData.forEach((staff, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${staff.name}</td>
      <td>${staff.role}</td>
      <td><input type="number" value="${staff.tickets}" class="tickets-input" data-index="${index}" /></td>
      <td><button class="delete-btn" data-index="${index}">Supprimer</button></td>
    `;
    staffList.appendChild(row);
  });

  // Ajouter des événements pour la modification des tickets et la suppression des membres
  document.querySelectorAll('.tickets-input').forEach(input => {
    input.addEventListener('input', (e) => updateTickets(e.target));
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => deleteStaff(e.target));
  });
}

// Fonction pour mettre à jour le nombre de tickets d'un membre
function updateTickets(input) {
  const index = input.getAttribute('data-index');
  const newValue = parseInt(input.value, 10);
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  staffData[index].tickets = newValue;
  localStorage.setItem('staff', JSON.stringify(staffData));
  logActivity(`Modifié les tickets de ${staffData[index].name} à ${newValue}`);
}

// Fonction pour supprimer un membre
function deleteStaff(button) {
  const index = button.getAttribute('data-index');
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  staffData.splice(index, 1);
  localStorage.setItem('staff', JSON.stringify(staffData));
  loadStaffData(); // Recharge les données après suppression
  logActivity(`Suppression de ${staffData[index].name}`);
}

// Fonction pour ajouter un nouveau membre avec rôle
function addStaff(event) {
  event.preventDefault();

  const nameInput = document.getElementById('staff-name');
  const roleInput = document.getElementById('staff-role');
  const ticketsInput = document.getElementById('staff-tickets');

  const newStaff = {
    name: nameInput.value,
    role: roleInput.value,
    tickets: parseInt(ticketsInput.value, 10),
    dateAdded: new Date().toISOString() // Ajoute la date de création du membre
  };

  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  staffData.push(newStaff);

  localStorage.setItem('staff', JSON.stringify(staffData));

  // Réinitialise le formulaire et recharge les données
  nameInput.value = '';
  ticketsInput.value = '0';
  loadStaffData();
  logActivity(`Ajout de ${newStaff.name} en tant que ${newStaff.role}`);
}

// Fonction pour enregistrer une activité dans les logs
function logActivity(message) {
  const logList = document.getElementById('log-list');
  const logItem = document.createElement('li');
  logItem.textContent = `${new Date().toLocaleString()}: ${message}`;
  logList.appendChild(logItem);
}

// Fonction de tri par tickets
function sortByTickets() {
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  staffData.sort((a, b) => b.tickets - a.tickets); // Tri par tickets de manière décroissante
  localStorage.setItem('staff', JSON.stringify(staffData));
  loadStaffData();
}

// Filtrage des membres selon la période choisie
function filterByDateRange() {
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];
  const filterValue = document.getElementById('time-filter').value;
  const currentDate = new Date();
  let filteredData = [];

  if (filterValue === '7') {
    filteredData = staffData.filter(staff => {
      const dateAdded = new Date(staff.dateAdded);
      const diffDays = (currentDate - dateAdded) / (1000 * 3600 * 24);
      return diffDays <= 7;
    });
  } else if (filterValue === '30') {
    filteredData = staffData.filter(staff => {
      const dateAdded = new Date(staff.dateAdded);
      const diffDays = (currentDate - dateAdded) / (1000 * 3600 * 24);
      return diffDays <= 30;
    });
  } else {
    filteredData = staffData;
  }

  // Recharge les données filtrées
  const staffList = document.getElementById('staff-list');
  staffList.innerHTML = '';
  filteredData.forEach((staff, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${staff.name}</td>
      <td>${staff.role}</td>
      <td><input type="number" value="${staff.tickets}" class="tickets-input" data-index="${index}" /></td>
      <td><button class="delete-btn" data-index="${index}">Supprimer</button></td>
    `;
    staffList.appendChild(row);
  });
}

// Ajouter un événement pour le formulaire
document.getElementById('add-staff-form').addEventListener('submit', addStaff);

// Charger les données du staff si l'utilisateur est authentifié
if (sessionStorage.getItem('loggedIn') === 'true') {
  loadStaffData();
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';
} else {
  document.getElementById('auth-screen').style.display = 'block';
  document.getElementById('main-content').style.display = 'none';
}
