const DB_NAME = "sky_observation_db";
const DB_VERSION = 1;

const STORES = {
    users: "users",
    observations: "observations",
    comments: "comments",
    ratings: "ratings",
    collections: "collections",
};

const SAMPLE_OBSERVATIONS = [
    {
        name: "Andromeda Galaxy (M31)",
        description:
            "Stunning view of the closest spiral galaxy, taken on a crisp autumn night with very low light pollution.",
        rightAscension: "00h 42m 44.3s",
        declination: "+41° 16' 09\"",
        locationName: "Oulu, Finland",
        locationLat: "65.0121",
        locationLng: "25.4651",
        observedAt: "2024-09-12",
    },
    {
        name: "Orion Nebula (M42)",
        description:
            "Breathtaking emission nebula in the sword of Orion. Pinkish hue clearly visible through 8\" Dobsonian.",
        rightAscension: "05h 35m 17.3s",
        declination: "-05° 23' 28\"",
        locationName: "Mauna Kea, Hawaii",
        locationLat: "19.8207",
        locationLng: "-155.4681",
        observedAt: "2024-12-04",
    },
    {
        name: "Pleiades Star Cluster (M45)",
        description:
            "The Seven Sisters glittering against a deep indigo sky. Faint nebulosity visible around Merope.",
        rightAscension: "03h 47m 24s",
        declination: "+24° 07' 00\"",
        locationName: "Atacama Desert, Chile",
        locationLat: "-23.6500",
        locationLng: "-69.0833",
        observedAt: "2024-11-21",
    },
    {
        name: "Saturn at opposition",
        description:
            "Sharp view of the rings near Cassini Division. Several moons visible: Titan, Rhea, Tethys.",
        rightAscension: "22h 30m 12s",
        declination: "-09° 45' 00\"",
        locationName: "Helsinki, Finland",
        locationLat: "60.1699",
        locationLng: "24.9384",
        observedAt: "2024-08-27",
    },
    {
        name: "Crab Nebula (M1)",
        description:
            "Supernova remnant in Taurus. Faint but unmistakable filamentary structure under high magnification.",
        rightAscension: "05h 34m 31.9s",
        declination: "+22° 00' 52\"",
        locationName: "Sierra Nevada, Spain",
        locationLat: "37.0641",
        locationLng: "-3.3856",
        observedAt: "2025-01-08",
    },
    {
        name: "Jupiter and Galilean Moons",
        description:
            "Great Red Spot transit across the disk. Io, Europa, Ganymede on one side; Callisto on the other.",
        rightAscension: "04h 12m 00s",
        declination: "+19° 30' 00\"",
        locationName: "Tromsø, Norway",
        locationLat: "69.6492",
        locationLng: "18.9553",
        observedAt: "2025-02-18",
    },
    {
        name: "Whirlpool Galaxy (M51)",
        description:
            "Beautiful interacting pair with companion NGC 5195. Spiral arms visible under dark Bortle 2 sky.",
        rightAscension: "13h 29m 52.7s",
        declination: "+47° 11' 43\"",
        locationName: "La Palma, Canary Islands",
        locationLat: "28.7569",
        locationLng: "-17.8849",
        observedAt: "2025-03-15",
    },
    {
        name: "Ring Nebula (M57)",
        description:
            "Compact planetary nebula in Lyra, looks like a tiny smoke ring. Central star not detected visually.",
        rightAscension: "18h 53m 35.1s",
        declination: "+33° 01' 45\"",
        locationName: "Rovaniemi, Finland",
        locationLat: "66.5039",
        locationLng: "25.7294",
        observedAt: "2025-03-22",
    },
    {
        name: "Hercules Globular Cluster (M13)",
        description:
            "Magnificent globular cluster, fully resolved at 200x. Hundreds of thousands of stars in a swarm.",
        rightAscension: "16h 41m 41.2s",
        declination: "+36° 27' 35\"",
        locationName: "Lapland Aurora Camp, Finland",
        locationLat: "67.9222",
        locationLng: "26.5046",
        observedAt: "2025-04-02",
    },
    {
        name: "Veil Nebula (NGC 6960)",
        description:
            "Supernova remnant in Cygnus. Stunning filamentary structure with OIII filter.",
        rightAscension: "20h 45m 38s",
        declination: "+30° 42' 30\"",
        locationName: "Tenerife, Spain",
        locationLat: "28.2916",
        locationLng: "-16.6291",
        observedAt: "2025-04-10",
    },
    {
        name: "Albireo (Beta Cygni)",
        description:
            "Gorgeous double star: gold primary, blue companion. Color contrast at its very best.",
        rightAscension: "19h 30m 43s",
        declination: "+27° 57' 35\"",
        locationName: "Joensuu, Finland",
        locationLat: "62.6010",
        locationLng: "29.7636",
        observedAt: "2025-04-19",
    },
    {
        name: "Total Lunar Eclipse",
        description:
            "Deep red blood moon at totality. Slight blue band along the edge from ozone refraction.",
        rightAscension: "12h 00m 00s",
        declination: "-05° 00' 00\"",
        locationName: "Reykjavik, Iceland",
        locationLat: "64.1466",
        locationLng: "-21.9426",
        observedAt: "2025-03-14",
    },
];

/* same password "password1111" */
const SAMPLE_USERS = [
    { username: "user1", nickname: "user1" },
    { username: "user2", nickname: "user2" },
    { username: "user3",  nickname: "user3" },
    { username: "user4",    nickname: "user4" },
    { username: "user5",   nickname: "user5" },
];

const SAMPLE_COMMENTS = [
    "Wonderful capture - the seeing must have been exceptional that night.",
    "I was watching from a different latitude on the same evening!",
    "Thanks for posting, the description matches what I saw too.",
    "The colours really stand out, what equipment did you use?",
    "Absolutely beautiful - adding to my collection.",
    "Gorgeous detail, especially the central region.",
];

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORES.users)) {
                const table = db.createObjectStore(STORES.users, { keyPath: "id" });
                table.createIndex("username", "username", { unique: true });
                table.createIndex("nickname", "nickname", { unique: false });
            }

            if (!db.objectStoreNames.contains(STORES.observations)) {
                const table = db.createObjectStore(STORES.observations, { keyPath: "id" });
                table.createIndex("ownerId", "ownerId", { unique: false });
                table.createIndex("ownerNickname", "ownerNickname", { unique: false });
                table.createIndex("name", "name", { unique: false });
                table.createIndex("createdAt", "createdAt", { unique: false });
                table.createIndex("viewCount", "viewCount", { unique: false });
            }

            if (!db.objectStoreNames.contains(STORES.comments)) {
                const table = db.createObjectStore(STORES.comments, { keyPath: "id" });
                table.createIndex("observationId", "observationId", { unique: false });
                table.createIndex("ownerId", "ownerId", { unique: false });
            }

            if (!db.objectStoreNames.contains(STORES.ratings)) {
                const table = db.createObjectStore(STORES.ratings, { keyPath: "id" });
                table.createIndex("observationId", "observationId", { unique: false });
                table.createIndex("ownerId", "ownerId", { unique: false });
            }

            if (!db.objectStoreNames.contains(STORES.collections)) {
                const table = db.createObjectStore(STORES.collections, { keyPath: "id" });
                table.createIndex("ownerId", "ownerId", { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function dbGetAll(tableName) {
    const db = await openDatabase();
    const transaction = db.transaction(tableName, "readonly");
    const table = transaction.objectStore(tableName);
    const result = await requestToPromise(table.getAll());
    db.close();
    return result;
}

async function loadSampleDataIfEmpty() {
    const observations = await dbGetAll(STORES.observations);
    if (observations.length > 0) return;

    // create the users
    const users = [];
    for (const sampleUser of SAMPLE_USERS) {
        let user = await DB.findUserByUsername(sampleUser.username);
        if (!user) {
            user = await DB.createUser({
                username: sampleUser.username,
                nickname: sampleUser.nickname,
                password: "password1111",
            });
        }
        users.push(user);
    }

    // add the existing observations list to DB
    for (let i = 0; i < SAMPLE_OBSERVATIONS.length; i++) {
        const sample = SAMPLE_OBSERVATIONS[i];
        const owner = users[i % users.length];
        await DB.addObservation({
            ...sample,
            ownerId: owner.id,
            ownerNickname: owner.nickname,
            viewCount: Math.floor(Math.random() * 80) + 5,
            createdAt: new Date(sample.observedAt + "T20:00:00Z").toISOString(),
        });
    }

    // add some ratings and comments to existing observations
    const allObservations = await dbGetAll(STORES.observations);
    for (let i = 0; i < allObservations.length; i++) {
        const observation = allObservations[i];
        const otherUsers = users.filter((user) => user.id !== observation.ownerId);
        
        // add ratings for each observation
        const numRatings = i % (otherUsers.length + 1); // assuming the number of ratings for existing observations
        for (let j = 0; j < numRatings; j++) {
            const rater = otherUsers[(i + j) % otherUsers.length]; // choose a different rater for each rating
            await DB.setRating({
                observationId: observation.id,
                ownerId: rater.id,
                value: 3 + ((i + j) % 3), 
            });
        }

        // add comments for each observation
        const numComments = i % 3;
        for (let j = 0; j < numComments; j++) {
            const commenter = otherUsers[(i + j + 1) % otherUsers.length];
            await DB.addComment({
                observationId: observation.id,
                ownerId: commenter.id,
                ownerNickname: commenter.nickname,
                text: SAMPLE_COMMENTS[(i + j) % SAMPLE_COMMENTS.length],
            });
        }
    }
}

// convert an IDBRequest (callback-based) into a Promise.
function requestToPromise(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function generateId(prefix = "") {
    return (
        prefix +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 8)
    );
}

async function hashPassword(text) {
    const buffer = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

// wait until an IndexedDB transaction completes
function waitForTransaction(transaction) {
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    });
}

async function dbAdd(tableName, value) {
    const db = await openDatabase();
    const transaction = db.transaction(tableName, "readwrite");
    const table = transaction.objectStore(tableName);
    await requestToPromise(table.add(value));
    await waitForTransaction(transaction);
    db.close();
    return value;
}

async function dbPut(tableName, value) {
    const db = await openDatabase();
    const transaction = db.transaction(tableName, "readwrite");
    const table = transaction.objectStore(tableName);
    await requestToPromise(table.put(value));
    await waitForTransaction(transaction);
    db.close();
    return value;
}

async function dbGet(tableName, key) {
    const db = await openDatabase();
    const transaction = db.transaction(tableName, "readonly");
    const table = transaction.objectStore(tableName);
    const result = await requestToPromise(table.get(key));
    db.close();
    return result;
}

async function dbDelete(tableName, key) {
    const db = await openDatabase();
    const transaction = db.transaction(tableName, "readwrite");
    const table = transaction.objectStore(tableName);
    await requestToPromise(table.delete(key));
    await waitForTransaction(transaction);
    db.close();
}

async function dbQueryByIndex(tableName, indexName, value) {
    const db = await openDatabase();
    const transaction = db.transaction(tableName, "readonly");
    const table = transaction.objectStore(tableName);
    const index = table.index(indexName);
    const result = await requestToPromise(index.getAll(value));
    db.close();
    return result;
}

const DB = {
    // ========== Users ==========
    async createUser({ username, nickname, password }) {
        const passwordHash = await hashPassword(password);
        const user = {
            id: generateId("u_"),
            username: username.trim(),
            nickname: nickname.trim(),
            passwordHash,
            createdAt: new Date().toISOString(),
        };
        return dbAdd(STORES.users, user);
    },

    async findUserByUsername(username) {
        const matches = await dbQueryByIndex(STORES.users, "username", username.trim());
        return matches[0] || null;
    },

    async getUserById(id) {
        return dbGet(STORES.users, id);
    },

    async authenticate(username, password) {
        const user = await this.findUserByUsername(username);
        if (!user) return null;
        const hash = await hashPassword(password);
        return hash === user.passwordHash ? user : null;
    },

    // ========== Observations ==========
    async listObservations() {
        return dbGetAll(STORES.observations);
    },

    async getObservation(id) {
        return dbGet(STORES.observations, id);
    },

    async addObservation(observation) {
        const record = {
            id: generateId("o_"),
            createdAt: new Date().toISOString(),
            edited: null,
            updateReason: null,
            viewCount: 0,
            ...observation,
        };
        return dbAdd(STORES.observations, record);
    },

    async updateObservation(id, changes, updateReason = "") {
        const existing = await dbGet(STORES.observations, id);
        if (!existing) throw new Error("Observation not found");
        const updated = {
            ...existing,
            ...changes,
            edited: new Date().toISOString(),
            updateReason: updateReason || "",
        };
        return dbPut(STORES.observations, updated);
    },

    async deleteObservation(id) {
        const comments = await dbQueryByIndex(STORES.comments, "observationId", id);
        for (const comment of comments) {
            await dbDelete(STORES.comments, comment.id);
        }
        const ratings = await dbQueryByIndex(STORES.ratings, "observationId", id);
        for (const rating of ratings) {
            await dbDelete(STORES.ratings, rating.id);
        }

        return dbDelete(STORES.observations, id);
    },

    async incrementViewCount(id) {
        const existing = await dbGet(STORES.observations, id);
        if (!existing) return null;
        existing.viewCount = (existing.viewCount || 0) + 1;
        existing.lastViewedAt = new Date().toISOString();
        return dbPut(STORES.observations, existing);
    },

    // ========== Comments ==========
    async listCommentsFor(observationId) {
        return dbQueryByIndex(STORES.comments, "observationId", observationId);
    },

    async addComment({ observationId, ownerId, ownerNickname, text }) {
        const record = {
            id: generateId("c_"),
            observationId,
            ownerId,
            ownerNickname,
            text,
            createdAt: new Date().toISOString(),
        };
        return dbAdd(STORES.comments, record);
    },

    // ========== Ratings ==========
    async listRatingsFor(observationId) {
        return dbQueryByIndex(STORES.ratings, "observationId", observationId);
    },

    async getUserRating(observationId, ownerId) {
        const all = await dbQueryByIndex(STORES.ratings, "observationId", observationId);
        return all.find((rating) => rating.ownerId === ownerId) || null;
    },

    async setRating({ observationId, ownerId, value }) {
        // one rating per (observation, user). Overwrite if exists.
        const existing = await this.getUserRating(observationId, ownerId);
        const record = existing
            ? { ...existing, value, updatedAt: new Date().toISOString() }
            : {
                  id: generateId("r_"),
                  observationId,
                  ownerId,
                  value,
                  createdAt: new Date().toISOString(),
              };
        return dbPut(STORES.ratings, record);
    },

    async ratingSummary(observationId) {
        const list = await this.listRatingsFor(observationId);
        if (list.length === 0) return { average: 0, count: 0 };
        const sum = list.reduce((total, rating) => total + rating.value, 0);
        return { average: sum / list.length, count: list.length };
    },

    // ========== Collections ==========
    async listCollectionsFor(ownerId) {
        return dbQueryByIndex(STORES.collections, "ownerId", ownerId);
    },

    async getCollection(id) {
        return dbGet(STORES.collections, id);
    },

    async createCollection({ ownerId, name, description = "" }) {
        const record = {
            id: generateId("col_"),
            ownerId,
            name,
            description,
            observationIds: [],
            createdAt: new Date().toISOString(),
        };
        return dbAdd(STORES.collections, record);
    },

    async updateCollection(id, changes) {
        const existing = await dbGet(STORES.collections, id);
        if (!existing) throw new Error("Collection not found");
        const updated = { 
            ...existing, 
            ...changes, 
            modifiedAt: new Date().toISOString() 
        };
        return dbPut(STORES.collections, updated);
    },

    async addObservationToCollection(collectionId, observationId) {
        const collection = await dbGet(STORES.collections, collectionId);
        if (collection.length === 0) throw new Error("Collection not found");
        if (!collection.observationIds.includes(observationId)) {
            collection.observationIds.push(observationId);
            return dbPut(STORES.collections, collection);
        }
        return collection;
    },

    async removeObservationFromCollection(collectionId, observationId) {
        const collection = await dbGet(STORES.collections, collectionId);
        if (collection.length === 0) return null;
        collection.observationIds = collection.observationIds.filter(
            (existingId) => existingId !== observationId
        );
        return dbPut(STORES.collections, collection);
    },

    async deleteCollection(id) {
        return dbDelete(STORES.collections, id);
    },
};


// expose globally for easy access in other modules without imports
window.DB = DB;
window.STORES = STORES;
window.loadSampleDataIfEmpty = loadSampleDataIfEmpty;
window.hashPassword = hashPassword;
window.generateId = generateId;
