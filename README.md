# Ale Consiglia - Sistema Consigli

Un sito web semplice per gestire e condividere consigli di attività italiane.

## 🚀 Funzionalità

### **📝 Inserimento Consigli**
- **Modal form**: Clicca il pulsante "+" nell'header
- **Campi obbligatori**: Nome attività, Città, Tipo attività
- **Tipi disponibili**: Ristorazione, Esperienziale, Pernottamento, Pernotto + Cibo
- **Consigli multipli**: Aggiungi più consigli in una volta
- **Editor**: Inserisci nome editor (ale.vi o cla.vi)

### **📊 Visualizzazione**
- **Tabella dinamica**: Tutti i consigli inseriti
- **Colonne**: Nome, Città, Tipo, Editor, Data, Azioni
- **Azioni**: Condividi singolo consiglio, Elimina

### **💾 Sistema Database**
- **Salvataggio automatico**: In localStorage del browser
- **Export JSON**: File database.json scaricato automaticamente
- **Upload JSON**: Carica database esistente tramite pulsante "Carica JSON"

### **📤 Export**
- **PDF**: Scarica tutta la tabella in formato PDF
- **Condivisione**: Condividi singoli consigli

## 🔧 Come Usare

### **1. Inserimento Consigli**
1. Clicca il pulsante "+" nell'header
2. Compila i campi obbligatori
3. (Opzionale) Clicca "Aggiungi altro consiglio" per inserirne più di uno
4. Inserisci il nome editor (ale.vi o cla.vi)
5. Clicca "Salva Consigli"

### **2. Caricamento Database**
1. Clicca "Carica JSON" nella tabella
2. Seleziona il file database.json
3. Il database verrà caricato automaticamente

### **3. Export**
- **PDF**: Clicca "PDF" per scaricare tutta la tabella
- **Condivisione**: Clicca l'icona share per condividere un singolo consiglio

## 📁 Struttura File

```
italian-activities/
├── index.html          # Pagina principale
├── styles.css          # Stili CSS
├── script.js           # Logica JavaScript
├── config.js           # Configurazione
├── database.json       # Database di esempio
└── README.md           # Questo file
```

## 🌐 Hosting

### **Locale**
```bash
# Apri il file index.html nel browser
open index.html
```

### **GitHub Pages**
1. Carica tutti i file su GitHub
2. Abilita GitHub Pages nelle impostazioni
3. Il sito sarà disponibile su `https://username.github.io/repository`

## 📊 Formato Database JSON

```json
{
  "lastUpdate": "2024-08-04T12:00:00.000Z",
  "totalActivities": 2,
  "activities": [
    {
      "id": 1722777600000,
      "name": "Ristorante Da Mario",
      "city": "Roma",
      "type": "ristorazione",
      "editor": "ale.vi",
      "date": "04/08/2024",
      "timestamp": "2024-08-04T12:00:00.000Z"
    }
  ]
}
```

## 🛠️ Tecnologie

- **HTML5**: Struttura semantica
- **CSS3**: Stili moderni e responsive
- **JavaScript ES6+**: Logica dell'applicazione
- **Bootstrap 5**: Framework CSS
- **Font Awesome**: Icone
- **jsPDF**: Generazione PDF
- **SheetJS**: (Rimosso) Non più utilizzato

## 🔐 Editor Autorizzati

- `ale.vi`
- `cla.vi`

## 📱 Responsive

Il sito è completamente responsive e funziona su:
- Desktop
- Tablet
- Mobile

## 🚀 Deploy

### **GitHub Pages (Raccomandato)**
1. Crea repository su GitHub
2. Carica tutti i file
3. Abilita GitHub Pages in Settings → Pages
4. Il sito sarà disponibile su `https://username.github.io/repository`

### **Altri Hosting**
- Netlify
- Vercel
- Qualsiasi hosting statico

---

**Sviluppato per gestire i consigli di Ale in modo semplice e efficace!** 🚀
