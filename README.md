

## 1. Backend (reservations‐api)

### 1.1 Κλωνοποίηση ή Κατέβασμα του Repo

```bash
git clone https://github.com/gmariakakis/restaurant-app-backend.git reservations-api
```

(ή αντιγράψτε το φάκελο `reservations-api` εάν τον έχετε ήδη τοπικά).

### 1.2 Άνοιγμα στον IDE

* Ανοίξτε τον φάκελο `reservations-api` στο IDE σας (π.χ. VS Code, WebStorm, NetBeans κ.λπ.).

### 1.3 Κατανόηση των Ρυθμίσεων Περιβάλλοντος

* Υπάρχουν φάκελοι/αρχεία:

  * `config/index.js`: φορτώνει το σωστό αρχείο ρυθμίσεων ανάλογα με το `NODE_ENV`.
  * `config/env/development.js`, `production.js`, `staging.js`, `test.js`: ορίζουν DB credentials, port, JWT μυστικά κ.λπ.
  * `.env.development`, `.env.production` κ.α. (αν υπάρχουν): θα φορτωθούν αυτόματα από το `config/index.js`.

* Από προεπιλογή, αν δεν ορίσετε `NODE_ENV`, θα χρησιμοποιηθεί το **development**:

  * DB host: `ipv4.kosmidis.me`, port `33066`, user `gmariakakis22b`, password `dc307208`, database `gmariakakis22b_db2`.
  * Server listening port: `3000`.
  * JWT secret: `devSuperSecretKey`, expiresIn `1h`.

> **Σημείωση:** Εάν θέλετε να τρέξετε σε άλλο περιβάλλον (π.χ. production), φροντίστε να βάλετε το αρχείο `.env.production` στην ρίζα του backend ή να ορίσετε περιβαλλοντικές μεταβλητές. Το `index.js` θα διαβάσει αυτόματα `.env.production` όταν `NODE_ENV=production`.

---

### 1.4 Εγκατάσταση Dependencies

```bash
cd reservations-api
npm install
```

* Αυτό θα εγκαταστήσει όλα τα πακέτα από το `package.json` (Express, MySQL2, bcrypt, jsonwebtoken, κ.λπ.).

### 1.5 Βάση Δεδομένων

1. **Εκκίνηση MariaDB**

   * Linux: `sudo systemctl start mariadb`
   * Windows: XAMPP/WAMP control panel ή MySQL Workbench

2. **Δημιουργία Βάσης & Πινάκων**
   Χρησιμοποιήστε τα credentials του `development.js` (ή όποιου αρχείου περιβάλλοντος επιλέξατε). Π.χ., με `mysql -u gmariakakis22b -p -h ipv4.kosmidis.me -P 33066` εισέλθετε και τρέξτε:

   ```sql
   CREATE DATABASE IF NOT EXISTS gmariakakis22b_db2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE gmariakakis22b_db2;

   -- accounts
   CREATE TABLE IF NOT EXISTS accounts (
     id INT AUTO_INCREMENT PRIMARY KEY,
     uuid VARCHAR(36) NOT NULL UNIQUE,
     username VARCHAR(100) NOT NULL,
     email VARCHAR(150) NOT NULL UNIQUE,
     password_hash VARCHAR(255) NOT NULL,
     role VARCHAR(20) NOT NULL DEFAULT 'user',
     token_version INT NOT NULL DEFAULT 0,
     refresh_token TEXT,
     email_verified TINYINT(1) NOT NULL DEFAULT 0,
     is_active TINYINT(1) NOT NULL DEFAULT 1,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     last_login_at DATETIME
   );

   -- restaurants
   CREATE TABLE IF NOT EXISTS restaurants (
     restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
     restaurant_uuid VARCHAR(36) NOT NULL UNIQUE,
     name VARCHAR(200) NOT NULL,
     address VARCHAR(300) NOT NULL,
     phone VARCHAR(30) NOT NULL,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
   );

   -- reservations
   CREATE TABLE IF NOT EXISTS reservations (
     reservation_id INT AUTO_INCREMENT PRIMARY KEY,
     reservation_uuid VARCHAR(36) NOT NULL UNIQUE,
     user_id INT NOT NULL,
     restaurant_id INT NOT NULL,
     reservation_datetime DATETIME NOT NULL,
     guests INT NOT NULL,
     status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
     FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
     FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
   );
   ```

   Αν έχετε dump αρχείο, μπορείτε να εισάγετε απευθείας:

   ```bash
   mysql -h ipv4.kosmidis.me -P 33066 -u gmariakakis22b -p gmariakakis22b_db2 < path/to/dump.sql
   ```

---

### 1.6 Εκκίνηση του Server

1. **Εξασφαλίστε** ότι βρίσκεστε στον φάκελο `reservations-api`.

2. **Ορίστε** (προαιρετικά) μεταβλητή περιβάλλοντος αν θέλετε να αλλάξετε το `NODE_ENV`:

   * **Linux/macOS**:

     ```bash
     export NODE_ENV=development
     ```
   * **Windows (PowerShell)**:

     ```powershell
     $env:NODE_ENV = "development"
     ```

   Αν δεν το ορίσετε, θα χρησιμοποιηθεί από προεπιλογή το `development`.

3. **Τρέξτε** τον server:

   ```bash
   node server.js
   ```

   ή, για αυτόματη επανεκκίνηση στις αλλαγές:

   ```bash
   npx nodemon server.js
   ```

4. **Επιβεβαίωση**

   * Στο τερματικό θα δείτε:

     ```
     ✅ Environment variables loaded from /path/to/.env.development
     📦 Starting Book API...
     ⚙️  Loading configuration...
     ✅ Config loaded
     📝 Loading logger...
     ✅ Logger loaded
     🚀 Loading Express app...
     ✅ Express app loaded
     🌐 App ready at: http://localhost:3000
     🌍 Environment: development
     ```
   * Αν δείτε `App ready at: http://localhost:3000`, σημαίνει ότι όλα λειτουργούν σωστά (στο development περιβάλλον).

5. **Ελέγξτε ένα endpoint** (π.χ. στο Postman):

   ```
   GET http://localhost:3000/api/restaurants
   ```

   Αναμένετε ένα JSON αποτέλεσμα (πιθανόν `[]` αν δεν υπάρχουν καταχωρημένα εστιατόρια).

---

## 2. Frontend (ReservationsFrontendExpo)

### 2.1 Κλωνοποίηση ή Κατέβασμα του Repo

```bash
git clone https://github.com/gmariakakis/restaurant-app-frontend.git ReservationsFrontendExpo
```

(ή αντιγράψτε τον τοπικό φάκελο `ReservationsFrontendExpo`).

### 2.2 Άνοιγμα στον IDE

* Ανοίξτε τον φάκελο `ReservationsFrontendExpo` στο IDE σας.

### 2.3 Εγκατάσταση Expo CLI (εάν δεν είναι ήδη εγκατεστημένο)

```bash
npm install --global expo-cli
```

ή

```bash
yarn global add expo-cli
```

### 2.4 Εγκατάσταση Εξαρτήσεων

```bash
cd ReservationsFrontendExpo
npm install
```

* Αυτό θα εγκαταστήσει όλα τα πακέτα από το `package.json` (React Native, Expo, React Navigation, Axios κ.λπ.).

### 2.5 Ρύθμιση Βασικής Διεύθυνσης API

Ανοίξτε το αρχείο όπου ορίζεται το base URL (π.χ. `src/config.js` ή `app.json`/`.env`). Προσαρμόστε το έτσι ώστε το frontend να «δείχνει» στον σωστό server:

* **Android emulator**: `http://10.0.2.2:3000/api`
* **iOS simulator ή πραγματικό iPhone μέσω LAN**: `http://localhost:3000/api`

Για παράδειγμα, αν στο `config.js` έχετε:

```js
export const API_BASE_URL = 'http://localhost:3000/api';
```

* Σε Android emulator, αντικαταστήστε το με:

  ```js
  export const API_BASE_URL = 'http://10.0.2.2:3000/api';
  ```

### 2.6 Εκκίνηση Expo

1. **Ανοίξτε** ένα νέο τερματικό εντός του φακέλου `ReservationsFrontendExpo`.

2. **Τρέξτε**:

   ```bash
   npx expo start -c
   ```

   * Το `-c` (clear) καθαρίζει την cache ώστε να αποφευχθούν τυχόν προβλήματα με παλιές μεταγλωττίσεις.

3. **Ανοίγει** αυτόματα το Expo DevTools στον browser (`http://localhost:19002`).

### 2.7 Εκτέλεση στον Emulator

* **Android Emulator**

  1. Βεβαιωθείτε ότι ο Android emulator είναι ήδη εκκινήσει (Android Studio → AVD Manager → Start a Virtual Device).
  2. Στο τερματικό με τρέχον `expo start`, πατήστε **`a`**.

     * Το Expo θα «σπρώξει» την εφαρμογή στο Android VM χρησιμοποιώντας το Metro bundler.

* **iOS Simulator** (μόνο σε macOS)

  1. Εκκινήστε το Simulator από το Xcode → Open Developer Tool → Simulator (π.χ. iPhone 12).
  2. Στο τερματικό με `expo start`, πατήστε **`i`**.

     * Η εφαρμογή θα ανοίξει στο iOS Simulator.

* **Φυσική Συσκευή (iOS/Android)**

  1. Εγκαταστήστε την εφαρμογή Expo Go στο κινητό σας (από App Store / Play Store).
  2. Σαρώστε το QR code που εμφανίζεται στο Expo DevTools με την Expo Go.

     * Θα φορτωθεί η εφαρμογή μέσω LAN/Wi-Fi.
  3. (Προσοχή: βεβαιωθείτε ότι η κινητή συσκευή και ο υπολογιστής βρίσκονται στο ίδιο δίκτυο.)

---

## 3. Δοκιμές & Χρήση

1. **Login**

   * Στον emulator, μόλις φορτώσει η εφαρμογή, θα εμφανιστεί η οθόνη **Login** (ή **Register** αν δεν έχετε κάνει login προηγουμένως).
   * Χρησιμοποιήστε τα έτοιμα credentials:

     * **Email:** `gc@gc.com`
     * **Password:** `gc`
   * Πατήστε **Login** → θα στείλει `POST /api/login` στον backend με αυτά τα στοιχεία.
   * Αν είναι επιτυχημένα, λαμβάνετε `accessToken` & `refreshToken` και αποθηκεύονται στο `AsyncStorage`. Μετά, μεταβαίνετε στη λίστα εστιατορίων.

2. **Περιήγηση Εστιατορίων**

   * `GET /api/restaurants` → φορτώνει δεδομένα και τα εμφανίζει σε `FlatList`.
   * Δοκιμάστε αναζήτηση (TextInput πάνω-πάνω).
   * Αν δεν υφίστανται ήδη εγγραφές στον πίνακα `restaurants`, χρησιμοποιήστε Postman ή Admin UI για να προσθέσετε ένα εστιατόριο:

     ```json
     POST http://localhost:3000/api/restaurants
     Headers: { Authorization: "Bearer <accessToken>" }
     Body (JSON):
     {
       "name": "La Trattoria",
       "address": "Οδός Αγαθαγγέλου 15, Αθήνα",
       "phone": "2101234567",
       "created_at": "2025-06-01T12:00:00Z"
     }
     ```

3. **Κράτηση Τραπεζιού**

   * Πατήστε ένα εστιατόριο, στην **RestaurantDetailScreen** πατήστε **“Κράτηση”**, επιλέξτε ημερομηνία/ώρα/άτομα.
   * Πατήστε **“Επιβεβαίωση”** → στέλνεται `POST /api/reservations` με:

     ```json
     {
       "restaurant_id": <restaurant_id>,
       "reservation_datetime": "2025-06-15T20:00:00Z",
       "guests": 4
     }
     ```
   * Σε επιτυχία, θα δείτε μήνυμα “Η κράτηση έγινε!”.

4. **Οι Κρατήσεις Μου**

   * Από το μενού επιλέξετε “Οι Κρατήσεις Μου” (ή πατήσετε στο εικονίδιο), φορτώνει `GET /api/reservations/me`.
   * Βλέπετε επερχόμενες / προηγούμενες.
   * Πατήστε **“Επεξεργασία”** ή **“Ακύρωση”** σε οποιαδήποτε κράτηση.

5. **Logout**

   * Πατήστε **Logout** → στέλνει `POST /api/logout` → διαγράφει το refresh token στο backend και παύει το JWT στο frontend.
   * Επιστρέφετε στην αρχική οθόνη σύνδεσης.

---

## 4. Συνοπτικά Βήματα

1. **Backend**

   ```bash
   cd reservations-api
   npm install
   # (προαιρετικά) export NODE_ENV=development
   node server.js      # ή npx nodemon server.js
   ```

   * Βεβαιωθείτε ότι η MariaDB τρέχει και ότι οι πίνακες έχουν δημιουργηθεί (χρησιμοποιώντας τα credentials από το `development.js`).

2. **Frontend**

   ```bash
   cd ReservationsFrontendExpo
   npm install
   # εγκατάσταση expo-cli αν χρειάζεται: npm install --global expo-cli
   npx expo start -c
   ```

   * Πατήστε **`a`** για Android emulator ή **`i`** για iOS simulator.
   * Ή σαρώστε το QR code με Expo Go για να τρέξετε σε πραγματική συσκευή.

---

Εάν ακολουθήσετε ακριβώς τα παραπάνω βήματα, θα έχετε σε πλήρη λειτουργία:

* Το **Backend** στα `http://localhost:3000` (development).
* Το **Frontend** στο Expo emulator (Android/iOS) ή σε πραγματική συσκευή.

Αυτό το setup βασίζεται στα αρχεία ρυθμίσεων που παρείχατε (`development.js` κ.λπ.). Για να αλλάξετε περιβάλλον, απλώς ορίστε `NODE_ENV=staging` ή `production` και δημιουργήστε το αντίστοιχο `.env.staging`/`.env.production`, ή βεβαιωθείτε ότι οι μεταβλητές περιβάλλοντος (π.χ. `DB_HOST`, `DB_USER` κ.λπ.) υπάρχουν στο σύστημά σας.

Καλή επιτυχία στην εκτέλεση της εφαρμογής!

