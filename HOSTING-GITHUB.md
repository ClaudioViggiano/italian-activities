# 🚀 Hosting su GitHub Pages - Guida Completa

## 📋 Panoramica

GitHub Pages è perfetto per siti HTML/CSS/JS come il tuo. È gratuito, sicuro e supporta domini personalizzati.

## 🌐 Vantaggi GitHub Pages

- ✅ **Gratuito** - Hosting illimitato
- ✅ **SSL automatico** - Sicurezza garantita
- ✅ **Dominio personalizzato** - Possibile
- ✅ **Versioning** - Controllo versioni
- ✅ **Integrazione Google** - OAuth possibile
- ✅ **CDN globale** - Velocità ottimale

## 📋 Passi per il Deploy

### **1. Crea Repository GitHub**

1. **Vai su [GitHub](https://github.com)**
2. **Clicca "New repository"**
3. **Nome:** `italian-activities`
4. **Pubblica** (Public)
5. **Crea repository**

### **2. Carica i File**

#### **Metodo A: Via Web (Semplice)**
1. **Vai nel repository**
2. **Clicca "Add file" → "Upload files"**
3. **Trascina tutti i file:**
   - `index.html`
   - `styles.css`
   - `script.js`
   - `config.js`
   - `README.md`
4. **Commit "Initial commit"**

#### **Metodo B: Via Terminal (Avanzato)**
```bash
# Nel terminal del Mac
cd /Users/cla/italian-activities

# Inizializza git
git init
git add .
git commit -m "Initial commit"

# Aggiungi remote GitHub
git remote add origin https://github.com/TUOUSERNAME/italian-activities.git
git branch -M main
git push -u origin main
```

### **3. Abilita GitHub Pages**

1. **Vai su "Settings" del repository**
2. **Scorri fino a "Pages"**
3. **Source**: "Deploy from a branch"
4. **Branch**: "main"
5. **Folder**: "/ (root)"
6. **Save**

### **4. Configura Dominio (Opzionale)**

1. **In "Pages" settings**
2. **Custom domain**: `tuodominio.com`
3. **Save**
4. **Aggiungi file `CNAME`** con il dominio

## 🔐 Autenticazione Gmail

### **1. Google Cloud Console**

1. **Vai su [Google Cloud Console](https://console.cloud.google.com)**
2. **Crea progetto**
3. **Abilita APIs:**
   - Google Places API
   - Google Sheets API
4. **Crea credenziali OAuth 2.0**

### **2. Configura OAuth**

```javascript
// In config.js
GOOGLE_OAUTH: {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID',
    SCOPES: ['profile', 'email'],
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest']
}
```

### **3. Configura Editori**

```javascript
// In config.js
AUTHORIZED_EDITORS: [
    'tuo.nome@gmail.com',
    'altro.editor@gmail.com',
    'admin@gmail.com'
]
```

## 📱 Funzionalità Finali

### **Per Editori (Gmail):**
- ✅ **Login con Gmail** - Autenticazione sicura
- ✅ **Autorizzazione automatica** - Solo email autorizzate
- ✅ **Sessione persistente** - Login mantenuto
- ✅ **Gestione completa** - Aggiunta/modifica/eliminazione

### **Per Visitatori:**
- ✅ **Accesso pubblico** - Chiunque con il link
- ✅ **Visualizzazione attività** - Nessun login richiesto
- ✅ **Filtri avanzati** - Ricerca per tipo/città
- ✅ **Esportazione dati** - Excel/PDF

## 🛡️ Sicurezza

### **Autenticazione:**
- **Provider**: Google OAuth 2.0
- **Utenti**: Solo Gmail autorizzati
- **Sessione**: Gestita da Google
- **Logout**: Automatico su Google

### **Autorizzazioni:**
- **Editori**: Modifica completa
- **Visitatori**: Solo lettura
- **Admin**: Gestione editori

## 🔧 Configurazione Dettagliata

### **GitHub Pages Setup:**

1. **Repository pubblico**
2. **Branch main**
3. **File index.html nella root**
4. **Abilita Pages in Settings**

### **Google APIs Setup:**

1. **Google Cloud Console**
2. **Crea progetto**
3. **Abilita APIs:**
   ```
   - Google Places API
   - Google Sheets API
   ```
4. **Genera chiavi API**
5. **Configura in config.js**

## 📊 Monitoraggio

### **GitHub Analytics:**
1. **Vai su "Insights" del repository**
2. **Traffic** - Visualizzazioni
3. **Contributors** - Chi contribuisce

### **Google Analytics:**
1. **Crea proprietà Google Analytics**
2. **Aggiungi tracking code**
3. **Monitora traffico e utenti**

## 🚨 Troubleshooting

### **Problemi Comuni:**

#### **1. Sito non si carica**
- ✅ Verifica che GitHub Pages sia abilitato
- ✅ Controlla che index.html sia nella root
- ✅ Aspetta 5-10 minuti per il deploy

#### **2. Login non funziona**
- ✅ Verifica email in `AUTHORIZED_EDITORS`
- ✅ Controlla che sia Gmail
- ✅ Verifica OAuth config

#### **3. API non funzionano**
- ✅ Verifica chiavi API in `config.js`
- ✅ Controlla limiti di quota
- ✅ Abilita le API necessarie

## 📞 Supporto

### **Risorse:**
- **GitHub Pages Help**: https://docs.github.com/en/pages
- **Google Cloud Console**: https://console.cloud.google.com
- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2

### **Community:**
- **Stack Overflow**: Tag `github-pages`, `google-oauth`
- **GitHub Discussions**: Forum ufficiali

---

## 🎯 Risultato Finale

Con questa configurazione avrai:
- 🌐 **Sito hostato gratuitamente su GitHub Pages**
- 🔐 **Autenticazione sicura con Gmail**
- 👥 **Editori autorizzati con controllo accesso**
- 🌍 **Visibilità pubblica per tutti**
- 📱 **Design responsive e moderno**
- 📊 **Database integrato con Google Sheets**

**URL finale:** `https://TUOUSERNAME.github.io/italian-activities`

**Tutto gratuito e sicuro!** 🚀 