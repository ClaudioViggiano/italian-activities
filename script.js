// Global variables
let activities = [];
let filteredActivities = [];
let currentPage = 1;
let isEditor = false;
let currentUser = null;
let autocompleteTimeout = null;

// DOM elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const exportBtn = document.getElementById('exportBtn');
const exportModal = new bootstrap.Modal(document.getElementById('exportModal'));
const exportExcelBtn = document.getElementById('exportExcelBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadActivities();
    restoreSession();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Login
    loginBtn.addEventListener('click', () => loginModal.show());
    loginSubmitBtn.addEventListener('click', handleLogin);
    
    // Logout (click sul pulsante login quando già loggato)
    loginBtn.addEventListener('click', handleLogout);

    // Export
    exportBtn.addEventListener('click', () => exportModal.show());
    exportExcelBtn.addEventListener('click', exportToExcel);
    exportPdfBtn.addEventListener('click', exportToPDF);

    // Filters
    document.getElementById('typeFilter').addEventListener('change', applyFilters);
    document.getElementById('cityFilter').addEventListener('input', applyFilters);
    document.getElementById('provinceFilter').addEventListener('input', applyFilters);
    document.getElementById('ratingFilter').addEventListener('change', applyFilters);

    // Add activity form
    const addActivityForm = document.getElementById('addActivityForm');
    if (addActivityForm) {
        addActivityForm.addEventListener('submit', handleAddActivity);
    }

    // Google Places autocomplete
    const activityNameInput = document.getElementById('activityName');
    if (activityNameInput) {
        activityNameInput.addEventListener('input', handleActivityNameInput);
    }
}

// Navigation handler
function handleNavigation(e) {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
    
    // Show/hide sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.querySelector(target);
    if (targetSection) {
        targetSection.style.display = 'flex';
    }
}

// Login handler per Gmail
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    
    // Verifica che sia un account Gmail
    if (!isGmailAccount(email)) {
        showAlert('Errore: Solo gli account Gmail sono supportati.', 'danger');
        return;
    }
    
    // Verifica che l'email sia autorizzata
    if (isAuthorizedEditor(email)) {
        isEditor = true;
        currentUser = email;
        loginModal.hide();
        
        // Update UI for editor
        document.querySelectorAll('.editor-only').forEach(el => {
            el.style.display = 'block';
        });
        
        // Salva la sessione in localStorage
        localStorage.setItem('italianActivitiesEditor', email);
        
        loginBtn.innerHTML = '<i class="fas fa-user"></i> ' + email.split('@')[0];
        loginBtn.classList.remove('btn-outline-light');
        loginBtn.classList.add('btn-light');
        
        showAlert('Login effettuato con successo! Ora puoi aggiungere attività.', 'success');
    } else {
        showAlert('Accesso negato. La tua email Gmail non è autorizzata come editor.', 'danger');
    }
}

// Ripristina la sessione dal localStorage
function restoreSession() {
    const savedEditor = localStorage.getItem('italianActivitiesEditor');
    if (savedEditor && isAuthorizedEditor(savedEditor)) {
        isEditor = true;
        currentUser = savedEditor;
        
        // Update UI for editor
        document.querySelectorAll('.editor-only').forEach(el => {
            el.style.display = 'block';
        });
        
        loginBtn.innerHTML = '<i class="fas fa-user"></i> ' + savedEditor.split('@')[0];
        loginBtn.classList.remove('btn-outline-light');
        loginBtn.classList.add('btn-light');
    }
}

// Logout handler
function handleLogout() {
    if (isEditor) {
        // Se già loggato, fai logout
        isEditor = false;
        currentUser = null;
        
        // Rimuovi dalla sessione
        localStorage.removeItem('italianActivitiesEditor');
        
        // Update UI
        document.querySelectorAll('.editor-only').forEach(el => {
            el.style.display = 'none';
        });
        
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        loginBtn.classList.remove('btn-light');
        loginBtn.classList.add('btn-outline-light');
        
        showAlert('Logout effettuato con successo.', 'info');
        
        // Torna alla sezione di ricerca
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('search').style.display = 'flex';
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('a[href="#search"]').classList.add('active');
    } else {
        // Se non loggato, mostra il modal di login
        loginModal.show();
    }
}

// Load activities from Google Sheets
async function loadActivities() {
    try {
        // Simulate loading from Google Sheets
        // In a real implementation, this would fetch from Google Sheets API
        activities = [
            {
                id: 1,
                name: 'Ristorante Da Mario',
                type: 'ristorante',
                city: 'Roma',
                province: 'RM',
                address: 'Via del Corso 123',
                phone: '+39 06 1234567',
                website: 'https://damario.it',
                rating: 4.5,
                comments: 'Ottimo ristorante tradizionale romano'
            },
            {
                id: 2,
                name: 'Hotel Bella Vista',
                type: 'hotel',
                city: 'Milano',
                province: 'MI',
                address: 'Via Montenapoleone 45',
                phone: '+39 02 9876543',
                website: 'https://bellavista.it',
                rating: 4.8,
                comments: 'Hotel di lusso nel centro di Milano'
            },
            {
                id: 3,
                name: 'B&B Casa Mia',
                type: 'bb',
                city: 'Firenze',
                province: 'FI',
                address: 'Via dei Calzaiuoli 67',
                phone: '+39 055 4567890',
                website: 'https://casamia.it',
                rating: 4.2,
                comments: 'Accogliente B&B nel centro storico'
            }
        ];
        
        filteredActivities = [...activities];
        renderActivities();
        
    } catch (error) {
        console.error('Errore nel caricamento delle attività:', error);
        showAlert('Errore nel caricamento delle attività', 'danger');
    }
}

// Render activities table
function renderActivities() {
    const tbody = document.getElementById('activitiesTableBody');
    const itemsPerPage = getAppSettings().ITEMS_PER_PAGE;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageActivities = filteredActivities.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    pageActivities.forEach(activity => {
        const row = createActivityRow(activity);
        tbody.appendChild(row);
    });
    
    renderPagination();
}

// Create activity table row
function createActivityRow(activity) {
    const row = document.createElement('tr');
    row.className = 'fade-in';
    
    const activityType = getActivityType(activity.type);
    
    row.innerHTML = `
        <td>
            <strong>${activity.name}</strong>
            ${activity.website ? `<br><small><a href="${activity.website}" target="_blank">${activity.website}</a></small>` : ''}
        </td>
        <td>
            <span class="badge bg-${activityType.color} activity-type-badge">
                <i class="${activityType.icon}"></i> ${activity.type}
            </span>
        </td>
        <td>${activity.city} (${activity.province})</td>
        <td>${activity.address}</td>
        <td>${activity.phone || '-'}</td>
        <td>
            <div class="rating-stars">
                ${'★'.repeat(Math.floor(activity.rating))}${'☆'.repeat(5 - Math.floor(activity.rating))}
                <small>(${activity.rating})</small>
            </div>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-outline-primary" onclick="viewActivity(${activity.id})">
                    <i class="fas fa-eye"></i>
                </button>
                ${isEditor ? `
                    <button class="btn btn-sm btn-outline-warning" onclick="editActivity(${activity.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteActivity(${activity.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        </td>
    `;
    
    return row;
}

// Render pagination
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const itemsPerPage = getAppSettings().ITEMS_PER_PAGE;
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Precedente</a>`;
    pagination.appendChild(prevLi);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${currentPage === i ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Successiva</a>`;
    pagination.appendChild(nextLi);
}

// Change page
function changePage(page) {
    const itemsPerPage = getAppSettings().ITEMS_PER_PAGE;
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderActivities();
    }
}

// Apply filters
function applyFilters() {
    const typeFilter = document.getElementById('typeFilter').value;
    const cityFilter = document.getElementById('cityFilter').value.toLowerCase();
    const provinceFilter = document.getElementById('provinceFilter').value.toLowerCase();
    const ratingFilter = document.getElementById('ratingFilter').value;
    
    filteredActivities = activities.filter(activity => {
        const typeMatch = !typeFilter || activity.type === typeFilter;
        const cityMatch = !cityFilter || activity.city.toLowerCase().includes(cityFilter);
        const provinceMatch = !provinceFilter || activity.province.toLowerCase().includes(provinceFilter);
        const ratingMatch = !ratingFilter || activity.rating >= parseInt(ratingFilter);
        
        return typeMatch && cityMatch && provinceMatch && ratingMatch;
    });
    
    currentPage = 1;
    renderActivities();
}



// Google Places autocomplete
function handleActivityNameInput(e) {
    const query = e.target.value;
    
    if (autocompleteTimeout) {
        clearTimeout(autocompleteTimeout);
    }
    
    if (query.length < 3) {
        hideGoogleResults();
        return;
    }
    
    autocompleteTimeout = setTimeout(() => {
        searchGooglePlaces(query);
    }, getAppSettings().AUTOCOMPLETE_DELAY);
}

// Search Google Places
async function searchGooglePlaces(query) {
    try {
        const config = getConfig();
        const apiKey = config.GOOGLE_PLACES_API_KEY;
        
        if (apiKey === 'YOUR_GOOGLE_PLACES_API_KEY') {
            // Simulate Google Places results for demo
            const mockResults = [
                {
                    name: `${query} - Ristorante`,
                    address: 'Via Roma 123, Milano, Italia',
                    place_id: 'mock_1'
                },
                {
                    name: `${query} - Hotel`,
                    address: 'Via Milano 456, Roma, Italia',
                    place_id: 'mock_2'
                },
                {
                    name: `${query} - B&B`,
                    address: 'Via Firenze 789, Firenze, Italia',
                    place_id: 'mock_3'
                }
            ];
            
            showGoogleResults(mockResults);
            return;
        }
        
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' Italia')}&key=${apiKey}&language=it`
        );
        
        if (response.ok) {
            const data = await response.json();
            showGoogleResults(data.results);
        }
        
    } catch (error) {
        console.error('Errore nella ricerca Google Places:', error);
        hideGoogleResults();
    }
}

// Show Google Places results
function showGoogleResults(results) {
    const resultsDiv = document.getElementById('googleResults');
    const placesList = document.getElementById('placesList');
    
    placesList.innerHTML = '';
    
    results.slice(0, getAppSettings().MAX_SEARCH_RESULTS).forEach(place => {
        const item = document.createElement('div');
        item.className = 'place-item p-3';
        item.innerHTML = `
            <div class="place-name">${place.name}</div>
            <div class="place-address">${place.address}</div>
        `;
        
        item.addEventListener('click', () => selectGooglePlace(place));
        placesList.appendChild(item);
    });
    
    resultsDiv.style.display = 'block';
}

// Hide Google Places results
function hideGoogleResults() {
    document.getElementById('googleResults').style.display = 'none';
}

// Select Google Place
function selectGooglePlace(place) {
    document.getElementById('activityName').value = place.name;
    document.getElementById('activityAddress').value = place.address;
    
    // Extract city from address
    const addressParts = place.address.split(', ');
    if (addressParts.length >= 2) {
        document.getElementById('activityCity').value = addressParts[addressParts.length - 2];
    }
    
    hideGoogleResults();
}

// Handle add activity
function handleAddActivity(e) {
    e.preventDefault();
    
    if (!isEditor) {
        showAlert('Devi essere loggato come editor per aggiungere attività', 'warning');
        return;
    }
    
    const formData = new FormData(e.target);
    const activity = {
        id: Date.now(),
        name: formData.get('activityName') || document.getElementById('activityName').value,
        type: document.getElementById('activityType').value,
        city: document.getElementById('activityCity').value,
        province: extractProvince(document.getElementById('activityCity').value),
        address: document.getElementById('activityAddress').value,
        phone: document.getElementById('activityPhone').value,
        website: document.getElementById('activityWebsite').value,
        rating: 0,
        comments: document.getElementById('activityComments').value,
        addedBy: currentUser,
        addedDate: new Date().toISOString()
    };
    
    // Add to activities array
    activities.push(activity);
    filteredActivities = [...activities];
    
    // Update UI
    renderActivities();
    updateStats();
    
    // Reset form
    e.target.reset();
    hideGoogleResults();
    
    showAlert('Attività aggiunta con successo!', 'success');
}

// Extract province from city
function extractProvince(city) {
    // Simple mapping - in a real app, you'd use a proper database
    const cityProvinceMap = {
        'Roma': 'RM',
        'Milano': 'MI',
        'Firenze': 'FI',
        'Napoli': 'NA',
        'Venezia': 'VE',
        'Torino': 'TO',
        'Bologna': 'BO',
        'Genova': 'GE',
        'Palermo': 'PA',
        'Bari': 'BA'
    };
    
    return cityProvinceMap[city] || 'XX';
}

// Export to Excel
function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(filteredActivities);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attività Italiane');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attivita_italiane_${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    exportModal.hide();
    showAlert('File Excel esportato con successo!', 'success');
}

// Export to PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Attività Italiane', 20, 20);
    
    // Add table
    const tableData = filteredActivities.map(activity => [
        activity.name,
        activity.type,
        activity.city,
        activity.address,
        activity.phone || '-',
        activity.rating.toString()
    ]);
    
    doc.autoTable({
        head: [['Nome', 'Tipo', 'Città', 'Indirizzo', 'Telefono', 'Valutazione']],
        body: tableData,
        startY: 30,
        styles: {
            fontSize: 8,
            cellPadding: 2
        }
    });
    
    doc.save(`attivita_italiane_${new Date().toISOString().split('T')[0]}.pdf`);
    exportModal.hide();
    showAlert('File PDF esportato con successo!', 'success');
}

// Activity actions
function viewActivity(id) {
    const activity = activities.find(a => a.id === id);
    if (activity) {
        showAlert(`Visualizzando: ${activity.name}`, 'info');
    }
}

function editActivity(id) {
    if (!isEditor) {
        showAlert('Devi essere loggato come editor per modificare attività', 'warning');
        return;
    }
    
    const activity = activities.find(a => a.id === id);
    if (activity) {
        showAlert(`Modificando: ${activity.name}`, 'info');
    }
}

function deleteActivity(id) {
    if (!isEditor) {
        showAlert('Devi essere loggato come editor per eliminare attività', 'warning');
        return;
    }
    
    if (confirm('Sei sicuro di voler eliminare questa attività?')) {
        activities = activities.filter(a => a.id !== id);
        filteredActivities = [...activities];
        renderActivities();
        updateStats();
        showAlert('Attività eliminata con successo!', 'success');
    }
}

// Utility functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}
