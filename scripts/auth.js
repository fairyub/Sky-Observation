const SESSION_KEY = "sky_obs_session";

const Auth = {
    currentUser() {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    isLoggedIn() {
        return !!this.currentUser();
    },

    requireLogin() {
        if (!this.isLoggedIn()) {
            const next = encodeURIComponent(location.pathname.split("/").pop() || "index.html");
            location.replace(`login.html?next=${next}`);
            return false;
        }
        return true;
    },

    redirectIfLoggedIn() {
        if (this.isLoggedIn()) {
            const params = new URLSearchParams(location.search);
            const next = params.get("next") || "index.html";
            location.replace(next);
        }
    },

    async login(username, password) {
        if (!username || !password) {
            throw new Error("Please enter both username and password.");
        }
        const user = await DB.authenticate(username.trim(), password);
        if (!user) {
            throw new Error("Invalid username or password.");
        }
        sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                id: user.id,
                username: user.username,
                nickname: user.nickname,
            })
        );
        return user;
    },

    async register(username, nickname, password, confirmPassword) {
        username = (username || "").trim();
        nickname = (nickname || "").trim();
        if (!username || !nickname || !password) {
            throw new Error("All fields are required.");
        }
        if (username.length < 3) throw new Error("Username must be at least 3 characters.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");

        const existing = await DB.findUserByUsername(username);
        if (existing) throw new Error("Username is already taken.");

        const user = await DB.createUser({ username, nickname, password });

        // auto-login after register
        sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                id: user.id,
                username: user.username,
                nickname: user.nickname,
            })
        );
        return user;
    },

    logout() {
        sessionStorage.removeItem(SESSION_KEY);
        location.replace("login.html");
    },
};

window.Auth = Auth;
