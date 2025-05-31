Βεβαίως! Παρακάτω είναι το ίδιο περιεχόμενο, βελτιωμένο οπτικά με κατάλληλα εικονίδια για να γίνει πιο ευανάγνωστο και ελκυστικό — **χωρίς καμία αλλαγή στο περιεχόμενο**:

---

## 🔧 1. Backend (`reservations-api`)

### 📥 1.1 Κλωνοποίηση ή Κατέβασμα του Repo

```bash
git clone https://github.com/gmariakakis/restaurant-app-backend.git reservations-api
```

📁 Εναλλακτικά, αντιγράψτε το φάκελο `reservations-api` αν τον έχετε τοπικά.

---

### 🛠️ 1.2 Άνοιγμα στον IDE

Ανοίξτε τον φάκελο `reservations-api` σε IDE όπως VS Code, WebStorm, NetBeans κ.λπ.

---

### ⚙️ 1.3 Κατανόηση των Ρυθμίσεων Περιβάλλοντος

📂 Αρχεία:

* `config/index.js` → διαχειρίζεται το `NODE_ENV`.
* `config/env/*.js` → περιέχουν περιβάλλοντα (`development`, `production` κ.λπ.).
* `.env.*` (αν υπάρχουν) → αυτόματα φορτωμένα από `dotenv`.

🔍 Προεπιλογή: **development**

🗂️ Ρυθμίσεις development:

* `DB_HOST`: `ipv4.kosmidis.me`
* `DB_PORT`: `33066`
* `DB_USER`: `gmariakakis22b`
* `DB_PASSWORD`: `dc307208`
* `DB_NAME`: `gmariakakis22b_db2`
* `PORT`: `3000`
* `JWT_SECRET`: `devSuperSecretKey`

ℹ️ Αν θέλετε να τρέξετε άλλο περιβάλλον, ορίστε `NODE_ENV=production` κ.λπ.

---

### 📦 1.4 Εγκατάσταση Dependencies

```bash
cd reservations-api
npm install
```

---

### 🗃️ 1.5 Βάση Δεδομένων

🟢 Εκκίνηση MariaDB:

* Linux: `sudo systemctl start mariadb`
* Windows: XAMPP / WAMP / MySQL Workbench

🛠️ Δημιουργία Βάσης:

```sql
CREATE DATABASE IF NOT EXISTS gmariakakis22b_db2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gmariakakis22b_db2;

-- Πίνακες: accounts, restaurants, reservations
```

📥 Εισαγωγή dump:

```bash
mysql -h ipv4.kosmidis.me -P 33066 -u gmariakakis22b -p gmariakakis22b_db2 < path/to/dump.sql
```

---

### ▶️ 1.6 Εκκίνηση του Server

🔁 Προαιρετικά:

```bash
export NODE_ENV=development   # Linux/macOS
$env:NODE_ENV = "development" # Windows
```

🚀 Εκτέλεση:

```bash
node server.js
# ή
npx nodemon server.js
```

✅ Επιτυχής εκκίνηση:

```
🌐 App ready at: http://localhost:3000
```

🧪 Δοκιμή (π.χ. Postman):

```
GET http://localhost:3000/api/restaurants
```

---

## 📱 2. Frontend (`ReservationsFrontendExpo`)

### 📥 2.1 Κλωνοποίηση ή Κατέβασμα του Repo

```bash
git clone https://github.com/gmariakakis/restaurant-app-frontend.git ReservationsFrontendExpo
```

---

### 🛠️ 2.2 Άνοιγμα στον IDE

Ανοίξτε τον φάκελο `ReservationsFrontendExpo`.

---

### ⚙️ 2.3 Εγκατάσταση Expo CLI

```bash
npm install --global expo-cli
# ή
yarn global add expo-cli
```

---

### 📦 2.4 Εγκατάσταση Εξαρτήσεων

```bash
cd ReservationsFrontendExpo
npm install
```

---

### 🔗 2.5 Ρύθμιση API Base URL

📁 Στο `config.js` ή `.env`:

```js
// Για Android emulator
export const API_BASE_URL = 'http://10.0.2.2:3000/api';
// Για iOS/πραγματική συσκευή
export const API_BASE_URL = 'http://localhost:3000/api';
```

---

### ▶️ 2.6 Εκκίνηση Expo

```bash
npx expo start -c
```

🌐 Το Expo DevTools ανοίγει στο browser → `http://localhost:19002`

---

### 📱 2.7 Εκτέλεση στον Emulator

🟢 **Android Emulator:**

1. Ανοίξτε AVD (Android Studio → AVD Manager)
2. Πατήστε **`a`** στο terminal

🍏 **iOS Simulator:**

1. Xcode → Open Simulator
2. Πατήστε **`i`**

📱 **Φυσική Συσκευή:**

1. Εγκαταστήστε **Expo Go**
2. Σαρώστε το QR code
3. Βεβαιωθείτε ότι είστε στο ίδιο Wi-Fi

---

## 🧪 3. Δοκιμές & Χρήση

### 🔐 Login

* **Email:** `gc@gc.com`
* **Password:** `gc`

✔️ Login → `POST /api/login`
📦 Λαμβάνεται `accessToken` & `refreshToken` → αποθήκευση σε AsyncStorage

---

### 🍽️ Περιήγηση Εστιατορίων

```
GET /api/restaurants
```

📋 Εμφανίζονται σε `FlatList`
🔍 Αναζήτηση μέσω `TextInput`

---

### 📆 Κράτηση Τραπεζιού

```json
POST /api/reservations
{
  "restaurant_id": <restaurant_id>,
  "reservation_datetime": "2025-06-15T20:00:00Z",
  "guests": 4
}
```

✅ Λαμβάνεται επιβεβαίωση: “Η κράτηση έγινε!”

---

### 📋 Οι Κρατήσεις Μου

```
GET /api/reservations/me
```

✏️ Δυνατότητα επεξεργασίας ή ακύρωσης κράτησης

---

### 🔓 Logout

```
POST /api/logout
```

🧹 Καθαρισμός tokens → επιστροφή στην Login

---

## 🗂️ 4. Συνοπτικά Βήματα

### ⚙️ Backend

```bash
cd reservations-api
npm install
export NODE_ENV=development
node server.js
```

### 📱 Frontend

```bash
cd ReservationsFrontendExpo
npm install
npx expo start -c
```

➡️ Πατήστε **`a`** για Android ή **`i`** για iOS
📱 Ή χρησιμοποιήστε Expo Go σε φυσική συσκευή

---

✅ **Backend**: `http://localhost:3000`
✅ **Frontend**: Emulator ή κινητό μέσω Expo

🧠 Για άλλες ρυθμίσεις: αλλάξτε `NODE_ENV` και χρησιμοποιήστε `.env.production`, `.env.staging` κ.λπ.

---

Καλή επιτυχία με την εφαρμογή σας! 🎉
