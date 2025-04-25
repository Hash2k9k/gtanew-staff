// Fonction pour charger les données du staff depuis le LocalStorage
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

    // Ajouter des événements pour les modifications de tickets
    document.querySelectorAll('.tickets-input').forEach(input => {
        input.addEventListener('input', (e) => updateTickets(e.target));
    });

    // Ajouter des événements pour supprimer un membre
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => deleteStaff(e.target));
    });
}

// Fonction pour mettre à jour le nombre de tickets
function updateTickets(input) {
    const index = input.getAttribute('data-index');
    const newValue = parseInt(input.value, 10);
    const staffData = JSON.parse(localStorage.getItem('staff')) || [];
    staffData[index].tickets = newValue;
    localStorage.setItem('staff', JSON.stringify(staffData));
}

// Fonction pour supprimer un membre du staff
function deleteStaff(button) {
    const index = button.getAttribute('data-index');
    const staffData = JSON.parse(localStorage.getItem('staff')) || [];
    staffData.splice(index, 1);
    localStorage.setItem('staff', JSON.stringify(staffData));
    loadStaffData(); // Recharge les données après suppression
}

// Fonction pour ajouter un nouveau membre
function addStaff(event) {
    event.preventDefault();

    const nameInput = document.getElementById('staff-name');
    const ticketsInput = document.getElementById('staff-tickets');

    const newStaff = {
        name: nameInput.value,
        tickets: parseInt(ticketsInput.value, 10)
    };

    const staffData = JSON.parse(localStorage.getItem('staff')) || [];
    staffData.push(newStaff);

    localStorage.setItem('staff', JSON.stringify(staffData));

    // Réinitialise le formulaire et recharge les données
    nameInput.value = '';
    ticketsInput.value = '0';
    loadStaffData();
}

// Événement pour ajouter un membre
document.getElementById('add-staff-form').addEventListener('submit', addStaff);

// Charger les données du staff lorsque la page est chargée
loadStaffData();
