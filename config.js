// Configurazione dell'applicazione
const CONFIG = {
    // Google Sheets API (database gratuito)
    GOOGLE_SHEETS: {
        SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID', // ID del foglio Google Sheets
        API_KEY: 'YOUR_GOOGLE_SHEETS_API_KEY' // Chiave API per Google Sheets
    },
    
    // Editor autorizzati
    AUTHORIZED_EDITORS: [
        'ale.vi',
        'cla.vi'
    ],
    
    // Impostazioni dell'applicazione
    APP: {
        ITEMS_PER_PAGE: 20,
        MAX_SEARCH_RESULTS: 5,
        AUTOCOMPLETE_DELAY: 500 // millisecondi
    },
    
    // Tipi di attività supportati
    ACTIVITY_TYPES: {
        'ristorante': { icon: 'fas fa-utensils', color: 'primary' },
        'hotel': { icon: 'fas fa-bed', color: 'success' },
        'bb': { icon: 'fas fa-home', color: 'info' },
        'bar': { icon: 'fas fa-glass-martini', color: 'warning' },
        'pizzeria': { icon: 'fas fa-pizza-slice', color: 'danger' },
        'gelateria': { icon: 'fas fa-ice-cream', color: 'secondary' },
        'altro': { icon: 'fas fa-store', color: 'dark' }
    }
};

// Funzione per ottenere la configurazione
function getConfig() {
    return CONFIG;
}

// Funzione per verificare se un utente è autorizzato (Gmail)
function isAuthorizedEditor(email) {
    return CONFIG.AUTHORIZED_EDITORS.includes(email);
}

// Funzione per ottenere le impostazioni dell'app
function getAppSettings() {
    return CONFIG.APP;
}
