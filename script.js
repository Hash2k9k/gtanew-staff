let sortDescending = true;

function loadStaffData() {
  let staffData = JSON.parse(localStorage.getItem('staff')) || [];
  const searchTerm = document.getElementById('search-input').value.toLowerCase();

  if (sortDescending) {
    staffData.sort((a, b) => b.tickets - a.tickets);
  } else {
    staffData.sort((a, b) => a.tickets - b.tickets);
  }

  const staffList = document.getElementById('staff-list');
  staffList.innerHTML = '';

  const filtered = staffData.filter(member => member.name.toLowerCase().includes(searchTerm));

  const maxTickets = Math.max(...staffData.map(s => s.tickets), 1);

  let totalTickets = 0;

  filtered.forEach((staff, index) => {
    totalTickets += staff.tickets;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${staff.name}</td>
      <td><input type="number" value="${staff.tickets}" class="tickets-input" data-index="${index}" /></td>
      <td>
        <div class="progress-bar">
          <div class="progress" style="width: ${Math.round((staff.tickets / maxTickets) * 100)}%"></div>
        </div>
      </td>
      <td><button class="delete-btn" data-index="${index}">Supprimer</button></td>
    `;
    staffList.appendChild(row);
  });

  document.getElementById('total-tickets').textContent = `Total des tickets : ${totalTickets}`;

  document.querySelectorAll('.tickets-input').forEach(input => {
    input.addEventListener('input', (e) => updateTickets(e.target));
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => deleteStaff(e.target));
  });
}

function updateTickets(input) {
  const index = input.getAttribute('data-index');
  const value = parseInt(input.value, 10);
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];

  if (!isNaN(value)) {
    staffData[index].tickets = value;
    localStorage.setItem('staff', JSON.stringify(staffData));
    loadStaffData();
  }
}

function deleteStaff(button) {
  const index = button.getAttribute('data-index');
  const staffData = JSON.parse(localStorage.getItem('staff')) || [];

  if (confirm(`Supprimer ${staffData[index].name} ?`)) {
    staffData.splice(index, 1);
    localStorage.setItem('staff', JSON.stringify(staffData));
    loadStaffData();
  }
}

function addStaff(event) {
  event.preventDefault();
  const nameInput = document.getElementById('staff-name');
  const ticketsInput = document.getElementById('staff-tickets');
  const name = nameInput.value.trim();
  const tickets = parseInt(ticketsInput.value, 10);

  if (!name) return alert("Nom requis.");

  let staffData = JSON.parse(localStorage.getItem('staff')) || [];

  if (staffData.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    return alert("Ce membre existe déjà !");
  }

  staffData.push({ name, tickets });
  localStorage.setItem('staff', JSON.stringify(staffData));

  nameInput.value = '';
  ticketsInput.value = '0';
  loadStaffData();
}

document.getElementById('add-staff-form').addEventListener('submit', addStaff);
document.getElementById('search-input').addEventListener('input', loadStaffData);
document.getElementById('sort-btn').addEventListener('click', () => {
  sortDescending = !sortDescending;
  loadStaffData();
});

loadStaffData();
