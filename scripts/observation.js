let allObservations = [];

function applyFilters(state) {
    const nameQuery = (state.q || "").trim().toLowerCase();
    const ownerQuery = (state.owner || "").trim().toLowerCase();

    return allObservations.filter((observation) => {
        const name = (observation.name || "").toLowerCase();
        const ownerNickname = (observation.ownerNickname || "").toLowerCase();

        if (nameQuery && !name.includes(nameQuery)) return false;
        if (ownerQuery && !ownerNickname.includes(ownerQuery)) return false;
        if (state.from && observation.observedAt < state.from) return false;
        if (state.to && observation.observedAt > state.to) return false;
        return true;
    });
}

function renderList(state) {
    const filtered = applyFilters(state);
    const listRoot = document.getElementById("observationList");
    const emptyMessage = document.getElementById("emptyMessage");
    const rowTemplate = document.getElementById("observationRowTemplate");

    listRoot.innerHTML = "";
    if (!filtered.length) {
        emptyMessage.style.display = "";
        return;
    }
    emptyMessage.style.display = "none";

    for (const observation of filtered) {
        const row = rowTemplate.content.cloneNode(true);
        const link = row.querySelector(".row-link");
        link.href = "observation-detail.html?id=" + encodeURIComponent(observation.id);
        row.querySelector(".row-name").textContent = observation.name;
        row.querySelector(".row-desc").textContent = observation.description;
        row.querySelector(".row-ra").textContent = observation.rightAscension;
        row.querySelector(".row-dec").textContent = observation.declination;
        row.querySelector(".row-loc").textContent = observation.locationName;
        row.querySelector(".row-owner").textContent = observation.ownerNickname;
        row.querySelector(".row-date").textContent = formatDate(observation.observedAt);
        row.querySelector(".row-views").textContent = observation.viewCount || 0;
        if (observation.edited) {
            const tag = row.querySelector(".row-edited");
            tag.style.display = "";
            tag.title =
                "Edited " + formatDateTime(observation.edited) +
                (observation.updateReason ? " - reason: " + observation.updateReason : "");
        }
        listRoot.appendChild(row);
    }
}

async function loadObservations() {
    allObservations = await DB.listObservations();
    allObservations.sort(
        (a, b) => new Date(b.observedAt) - new Date(a.observedAt)
    );

    const filterState = { q: "", from: "", to: "", owner: "" };
    const filterForm = document.getElementById("filterForm");

    filterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        filterState.q = filterForm.name.value;
        filterState.from = filterForm["from-date"].value;
        filterState.to = filterForm["to-date"].value;
        filterState.owner = filterForm.owner.value;
        renderList(filterState);
    });

    document.getElementById("clearFilters").addEventListener("click", () => {
        filterForm.reset();
        filterState.q = filterState.from = filterState.to = filterState.owner = "";
        renderList(filterState);
    });

    renderList(filterState);
}

window.loadObservations = loadObservations;
