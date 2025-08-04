# Italian Activities - Database Attività Italiane

Un sito web gratuito basato sui prodotti Google per gestire attività italiane (ristoranti, B&B, etc.) con autenticazione Gmail e hosting su Google.

## 🚀 Hosting su Google

### Opzione 1: Google Sites (Raccomandato)

#### Passi per l'Hosting:
1. **Vai su [Google Sites](https://sites.google.com)**
2. **Crea un nuovo sito**
3. **Carica i file HTML/CSS/JS**
4. **Configura le autorizzazioni:**
   - **Visibilità**: "Chiunque abbia il link può visualizzare"
   - **Editori**: Solo utenti Gmail specifici

#### Vantaggi:
- ✅ Hosting gratuito
- ✅ Integrazione nativa con Google
- ✅ SSL automatico
- ✅ Dominio personalizzato possibile
- ✅ Backup automatico

### Opzione 2: Google Cloud Platform (Avanzato)

#### Passi:
1. **Crea progetto su [Google Cloud Console](https://console.cloud.google.com)**
2. **Abilita Google Sites API**
3. **Deploy su Google App Engine**
4. **Configura dominio personalizzato**

## 🔐 Autenticazione Gmail

### Configurazione Editori:

```javascript
// In config.js - Sostituisci con le email Gmail degli editori
AUTHORIZED_EDITORS: [
    'tuo.nome@gmail.com',
    'altro.editor@gmail.com',
    'admin@gmail.com'
]
```

### Funzionalità:
- **Login**: Solo con account Gmail
- **Autorizzazione**: Solo editori specificati
- **Visibilità**: Pubblica (chiunque con il link)
- **Sicurezza**: Gestita da Google

## 📋 Setup Completo

### 1. Preparazione File
```bash
# Struttura finale per Google Sites
italian-activities/
├── index.html
├── styles.css
├── script.js
├── config.js
└── README.md
```

### 2. Configurazione Google APIs
- **Google Places API**: Per autocompletamento
- **Google Sheets API**: Per database
- **Google Sites API**: Per hosting

### 3. Deploy
1. **Google Sites**: Carica tutti i file
2. **Configura autorizzazioni**
3. **Testa funzionalità**
4. **Condividi link**

## 🔧 Configurazione Dettagliata

### Google Sites Setup:
1. **Accedi a [Google Sites](https://sites.google.com)**
2. **Crea nuovo sito**
3. **Vai su "Impostazioni" → "Autorizzazioni"**
4. **Configura:**
   - **Visualizzatori**: "Chiunque abbia il link"
   - **Editori**: Solo email Gmail specifiche
   - **Proprietari**: La tua email Gmail

### Google APIs Setup:
1. **Google Cloud Console**
2. **Crea progetto**
3. **Abilita APIs:**
   - Google Places API
   - Google Sheets API
4. **Genera chiavi API**
5. **Configura in `config.js`**

## 📱 Funzionalità Finali

### Per Editori (Gmail):
- ✅ Login con account Gmail
- ✅ Aggiunta attività con autocompletamento Google
- ✅ Modifica/eliminazione attività
- ✅ Gestione database

### Per Visitatori:
- ✅ Visualizzazione attività
- ✅ Filtri avanzati
- ✅ Esportazione Excel/PDF
- ✅ Ricerca per città/tipo

## 🛡️ Sicurezza

### Autenticazione:
- **Provider**: Google OAuth
- **Utenti**: Solo Gmail autorizzati
- **Sessione**: Gestita da Google
- **Logout**: Automatico su Google

### Autorizzazioni:
- **Editori**: Modifica completa
- **Visitatori**: Solo lettura
- **Admin**: Gestione editori

## 📞 Supporto

Per problemi con:
- **Hosting**: Google Sites Help
- **APIs**: Google Cloud Console
- **Autenticazione**: Google OAuth Docs

---

**Nota**: Questo setup garantisce massima sicurezza e integrazione con l'ecosistema Google, mantenendo la gratuità e la semplicità d'uso.
