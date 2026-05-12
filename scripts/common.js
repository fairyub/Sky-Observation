// replace dangerous HTML characters so user-supplied text is safe to insert
function escapeHtml(text) {
    if (text === null || text === undefined) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// format an ISO timestamp as YYYY-MM-DD / UTC "2025-04-19T13:00:00.000Z"
function formatDate(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? isoString : date.toISOString().slice(0, 10);
}

//format an ISO timestamp as a localised date + time string
function formatDateTime(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? isoString : date.toLocaleString();
}

function formatStars(value) {
    const rounded = Math.round(value || 0);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function getQueryParams() {
    return new URLSearchParams(location.search);
}

function showCurrentUserInHeader() {
    const user = Auth.currentUser();
    const nicknameSpan = document.getElementById("navNickname");
    if (nicknameSpan) nicknameSpan.textContent = user ? "@" + user.nickname : "";
}

function wireLogoutButton() {
    const logoutButton = document.getElementById("logoutBtn");
    if (logoutButton) logoutButton.addEventListener("click", () => Auth.logout());
}

function setupHeaderForCurrentUser() {
    showCurrentUserInHeader();
    wireLogoutButton();
}

window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.formatStars = formatStars;
window.getQueryParams = getQueryParams;
window.showCurrentUserInHeader = showCurrentUserInHeader;
window.wireLogoutButton = wireLogoutButton;
window.setupHeaderForCurrentUser = setupHeaderForCurrentUser;
