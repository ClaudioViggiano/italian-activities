// Global variables
let activities = [];
let tempActivities = []; // Per i consigli temporanei nel form
let activityToDelete = null; // Per l'eliminazione

// DOM elements
const addBtn = document.getElementById('addBtn');
const addModal = new bootstrap.Modal(document.getElementById('addModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const activityForm = document.getElementById('activityForm');
const activitiesTableBody = document.getElementById('activitiesTableBody');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const sharePdfBtn = document.getElementById('sharePdfBtn');
const reloadBtn = document.getElementById('reloadBtn');
const addAnotherLink = document.getElementById('addAnotherLink');
const additionalActivities = document.getElementById('additionalActivities');
const deleteEditorName = document.getElementById('deleteEditorName');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteActivityName = document.getElementById('deleteActivityName');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadActivities();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Modal trigger
    addBtn.addEventListener('click', () => addModal.show());
    
    // Form submission
    activityForm.addEventListener('submit', handleAddActivity);
    
    // Add another activity link
    addAnotherLink.addEventListener('click', addAnotherActivity);
    
    // Export buttons
    exportPdfBtn.addEventListener('click', exportToPDF);
    sharePdfBtn.addEventListener('click', sharePDF);
    
    // Reload button
    reloadBtn.addEventListener('click', reloadDatabase);
    
    // Delete modal
    confirmDeleteBtn.addEventListener('click', confirmDeleteActivity);
}

// Add another activity to the form
function addAnotherActivity(e) {
    e.preventDefault();
    
    const currentActivity = getCurrentActivityFromForm();
    if (currentActivity) {
        tempActivities.push(currentActivity);
        clearForm();
        updateTempActivitiesDisplay();
    }
}

// Get current activity from form
function getCurrentActivityFromForm() {
    const name = document.getElementById('activityName').value.trim();
    const city = document.getElementById('activityCity').value.trim();
    const type = document.getElementById('activityType').value;
    const comment = document.getElementById('activityComment').value.trim();
    
    if (!name || !city || !type || !comment) {
        showAlert('Compila tutti i campi obbligatori!', 'danger');
        return null;
    }
    
    return {
        name: name,
        city: city,
        type: type,
        comment: comment
    };
}

// Clear form
function clearForm() {
    document.getElementById('activityName').value = '';
    document.getElementById('activityCity').value = '';
    document.getElementById('activityType').value = '';
    document.getElementById('activityComment').value = '';
}

// Update temporary activities display
function updateTempActivitiesDisplay() {
    if (tempActivities.length === 0) {
        additionalActivities.innerHTML = '';
        return;
    }
    
    let html = '<div class="mb-3"><h6>Consigli temporanei:</h6>';
    tempActivities.forEach((activity, index) => {
        html += `
            <div class="temp-activity p-2 mb-2 bg-light rounded">
                <strong>${activity.name}</strong> - ${activity.city} (${activity.type})
                <br><small class="text-muted">"${activity.comment}"</small>
                <button type="button" class="btn btn-sm btn-outline-danger float-end" onclick="removeTempActivity(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    html += '</div>';
    additionalActivities.innerHTML = html;
}

// Remove temporary activity
function removeTempActivity(index) {
    tempActivities.splice(index, 1);
    updateTempActivitiesDisplay();
}

// Handle add activity
function handleAddActivity(e) {
    e.preventDefault();
    
    const currentActivity = getCurrentActivityFromForm();
    if (!currentActivity) return;
    
    const editorName = document.getElementById('editorName').value.trim();
    if (!editorName) {
        showAlert('Inserisci il nome dell\'editor!', 'danger');
        return;
    }
    
    // Verifica che l'editor sia autorizzato
    if (!isAuthorizedEditor(editorName)) {
        showAlert('Editor non autorizzato!', 'danger');
        return;
    }
    
    // Combina attività corrente con quelle temporanee
    const allActivities = [currentActivity, ...tempActivities];
    
            // Salva tutte le attività
        allActivities.forEach(activity => {
            const newActivity = {
                id: Date.now() + Math.random(), // ID univoco
                name: activity.name,
                city: activity.city,
                type: activity.type,
                comment: activity.comment,
                editor: editorName,
                date: new Date().toLocaleDateString('it-IT'),
                timestamp: new Date().toISOString()
            };
            
            activities.unshift(newActivity); // Aggiungi all'inizio
        });
    
    // Salva in localStorage
    saveActivities();
    

    
    // Aggiorna tabella
    renderActivities();
    
    // Reset form e modal
    activityForm.reset();
    tempActivities = [];
    updateTempActivitiesDisplay();
    addModal.hide();
    
    // Mostra conferma
    showAlert(`${allActivities.length} consiglio/i aggiunto/i con successo!`, 'success');
}

// Load activities from JSON file or localStorage
async function loadActivities() {
    try {
        // Prima prova a caricare da database.json
        const response = await fetch('database.json');
        if (response.ok) {
            const data = await response.json();
            activities = data.activities || [];
            console.log('Caricato da database.json:', activities.length, 'attività');
            
            // Salva anche in localStorage come backup
            localStorage.setItem('italianActivities', JSON.stringify(activities));
        } else {
            // Fallback: prova localStorage
            const saved = localStorage.getItem('italianActivities');
            if (saved) {
                activities = JSON.parse(saved);
                console.log('Caricato da localStorage:', activities.length, 'attività');
            } else {
                console.log('Nessun database trovato, iniziando con database vuoto');
                activities = [];
            }
        }
        renderActivities();
        
        // Mostra messaggio di stato
        if (activities.length > 0) {
            showAlert(`Database caricato: ${activities.length} consigli trovati.`, 'info');
        }
    } catch (error) {
        console.error('Errore nel caricamento attività:', error);
        // Fallback finale: localStorage
        try {
            const saved = localStorage.getItem('italianActivities');
            if (saved) {
                activities = JSON.parse(saved);
                console.log('Caricato da localStorage (fallback):', activities.length, 'attività');
                showAlert(`Database caricato da backup: ${activities.length} consigli trovati.`, 'warning');
            } else {
                activities = [];
                showAlert('Nessun database trovato. Inizia ad aggiungere consigli!', 'info');
            }
        } catch (localError) {
            console.error('Errore anche nel localStorage:', localError);
            activities = [];
            showAlert('Nessun database trovato. Inizia ad aggiungere consigli!', 'info');
        }
        renderActivities();
    }
}

// Save activities to localStorage and create JSON file
function saveActivities() {
    try {
        // Salva in localStorage
        localStorage.setItem('italianActivities', JSON.stringify(activities));
        
        // Crea file JSON per download
        const databaseData = {
            lastUpdate: new Date().toISOString(),
            totalActivities: activities.length,
            activities: activities
        };
        
        // Creiamo un blob con i dati JSON
        const blob = new Blob([JSON.stringify(databaseData, null, 2)], {
            type: 'application/json'
        });
        
        // Creiamo un link per il download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'database.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Database salvato in localStorage e JSON scaricato');
        
        // Mostra messaggio di successo
        showAlert('Database aggiornato! File database.json scaricato.', 'success');
    } catch (error) {
        console.error('Errore nel salvataggio attività:', error);
        showAlert('Errore nel salvataggio del database.', 'danger');
    }
}

// Render activities table
function renderActivities() {
    const tbody = document.getElementById('activitiesTableBody');
    tbody.innerHTML = '';
    
    if (activities.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-2x mb-3"></i>
                    <br>Nessun consiglio inserito
                </td>
            </tr>
        `;
        return;
    }
    
    activities.forEach(activity => {
        const row = createActivityRow(activity);
        tbody.appendChild(row);
    });
}

// Create activity table row
function createActivityRow(activity) {
    const row = document.createElement('tr');
    row.className = 'activity-row fade-in';
    
    const typeLabels = {
        'ristorazione': '🍽️ Ristorazione',
        'esperienziale': '🎯 Esperienziale',
        'pernottamento': '🛏️ Pernottamento',
        'pernotto+cibo': '🏨 Pernotto + Cibo'
    };
    
    row.innerHTML = `
        <td>
            <strong>${activity.name}</strong>
        </td>
        <td>${activity.city}</td>
        <td>
            <span class="badge bg-primary">${typeLabels[activity.type] || activity.type}</span>
        </td>
        <td>
            <em>"${activity.comment || 'Nessun commento'}"</em>
        </td>
        <td>
            <span class="editor-badge">${activity.editor}</span>
        </td>
        <td>
            <span class="date-badge">${activity.date}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-outline-success" onclick="shareActivity(${activity.id})" title="Condividi">
                    <i class="fas fa-share"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteActivity(${activity.id})" title="Elimina">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Delete activity - opens modal
function deleteActivity(id) {
    const activity = activities.find(a => a.id === id);
    if (activity) {
        activityToDelete = activity;
        deleteActivityName.textContent = `Elimina definitivamente "${activity.name}"`;
        deleteEditorName.value = '';
        deleteModal.show();
    }
}

// Share activity
function shareActivity(id) {
    const activity = activities.find(a => a.id === id);
    if (activity) {
        const text = `Consiglio di Ale: ${activity.name} - ${activity.city} (${activity.type})\nCommento: "${activity.comment}"`;
        if (navigator.share) {
            navigator.share({
                title: 'Consiglio di Ale',
                text: text
            });
        } else {
            // Fallback: copia negli appunti
            navigator.clipboard.writeText(text).then(() => {
                showAlert('Consiglio copiato negli appunti!', 'success');
            });
        }
    }
}

// Create database JSON file
function createDatabaseJSON() {
    try {
        const databaseData = {
            metadata: {
                created: new Date().toISOString(),
                totalActivities: activities.length,
                lastUpdate: new Date().toISOString()
            },
            activities: activities
        };
        
        // Crea blob del JSON
        const jsonString = JSON.stringify(databaseData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Crea link per download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ale-consiglia-database-${new Date().toISOString().split('T')[0]}.json`;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('Database JSON creato con successo');
    } catch (error) {
        console.error('Errore nella creazione del database JSON:', error);
    }
}

// Export to PDF
function exportToPDF() {
    if (activities.length === 0) {
        showAlert('Nessun consiglio da esportare!', 'warning');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Titolo
        doc.setFontSize(20);
        doc.text('Consigli di Ale', 20, 20);
        
        // Data
        doc.setFontSize(12);
        doc.text(`Generato il: ${new Date().toLocaleDateString('it-IT')}`, 20, 30);
        
        // Tabella
        const tableData = activities.map(activity => [
            activity.name,
            activity.city,
            activity.type,
            activity.comment || 'Nessun commento',
            activity.editor,
            activity.date
        ]);
        
        doc.autoTable({
            head: [['Nome', 'Città', 'Tipo', 'Commenti', 'Editor', 'Data']],
            body: tableData,
            startY: 40,
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [102, 126, 234]
            }
        });
        
        // Salva file
        const fileName = `consigli-ale-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        showAlert('File PDF scaricato con successo!', 'success');
    } catch (error) {
        console.error('Errore nell\'esportazione PDF:', error);
        showAlert('Errore nell\'esportazione del PDF!', 'danger');
    }
}

// Share PDF
function sharePDF() {
    if (activities.length === 0) {
        showAlert('Nessun consiglio da condividere!', 'warning');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Titolo
        doc.setFontSize(20);
        doc.text('Consigli di Ale', 20, 20);
        
        // Data
        doc.setFontSize(12);
        doc.text(`Generato il: ${new Date().toLocaleDateString('it-IT')}`, 20, 30);
        
        // Tabella
        const tableData = activities.map(activity => [
            activity.name,
            activity.city,
            activity.type,
            activity.comment || 'Nessun commento',
            activity.editor,
            activity.date
        ]);
        
        doc.autoTable({
            head: [['Nome', 'Città', 'Tipo', 'Commenti', 'Editor', 'Data']],
            body: tableData,
            startY: 40,
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [102, 126, 234]
            }
        });
        
        // Converti in blob per condivisione
        const pdfBlob = doc.output('blob');
        
        if (navigator.share) {
            const file = new File([pdfBlob], `consigli-ale-${new Date().toISOString().split('T')[0]}.pdf`, {
                type: 'application/pdf'
            });
            
            navigator.share({
                title: 'Consigli di Ale',
                text: 'Ecco i consigli di Ale in formato PDF',
                files: [file]
            }).then(() => {
                showAlert('PDF condiviso con successo!', 'success');
            }).catch((error) => {
                console.error('Errore nella condivisione:', error);
                showAlert('Errore nella condivisione del PDF', 'danger');
            });
        } else {
            // Fallback: download
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `consigli-ale-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showAlert('PDF scaricato (condivisione non supportata)', 'info');
        }
    } catch (error) {
        console.error('Errore nella condivisione PDF:', error);
        showAlert('Errore nella condivisione del PDF!', 'danger');
    }
}



// Reload database from file
async function reloadDatabase() {
    showAlert('Ricaricamento database in corso...', 'info');
    await loadActivities();
}

// Confirm delete activity
function confirmDeleteActivity() {
    const editorName = deleteEditorName.value.trim();
    
    if (!editorName) {
        showAlert('Inserisci il nome dell\'editor!', 'danger');
        return;
    }
    
    if (!isAuthorizedEditor(editorName)) {
        showAlert('Editor non autorizzato!', 'danger');
        return;
    }
    
    if (activityToDelete) {
        // Rimuovi l'attività
        activities = activities.filter(activity => activity.id !== activityToDelete.id);
        
        // Salva e ricarica
        saveActivities();
        renderActivities();
        
        // Chiudi modal
        deleteModal.hide();
        activityToDelete = null;
        
        showAlert(`Consiglio "${activityToDelete.name}" eliminato definitivamente!`, 'success');
    }
}

// Show alert
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}
