async function loadCollectionDetail() {
    const id = getQueryParams().get("id");
    if (!id) {
        showNotFound();
        return;
    }

    const collection = await DB.getCollection(id);
    const currentUser = Auth.currentUser();

    if (!collection || collection.ownerId !== currentUser.id) {
        showNotFound();
        return;
    }

    renderHeader(collection);
    wirePrintButton();
    wireDeleteCollectionButton(collection);

    const allObservations = await DB.listObservations();
    renderObservations(collection, allObservations);
}

function showNotFound() {
    document.getElementById("notFound").style.display = "";
    document.getElementById("detailContainer").style.display = "none";
}

function renderHeader(collection) {
    document.getElementById("viewName").textContent = collection.name;
    const descriptionEl = document.getElementById("viewDesc");
    descriptionEl.textContent = collection.description || "";
    descriptionEl.style.display = collection.description ? "" : "none";
    document.getElementById("viewCount").textContent = collection.observationIds.length;
    document.getElementById("viewDate").textContent = formatDate(collection.createdAt);
}

function wirePrintButton() {
    document.getElementById("printBtn").addEventListener("click", () => window.print());
}

function wireDeleteCollectionButton(collection) {
    document.getElementById("deleteCollectionBtn").addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this collection?")) return;
        await DB.deleteCollection(collection.id);
        location.replace("collection.html");
    });
}

function renderObservations(collection, allObservations) {
    const items = collection.observationIds
        .map((observationId) => allObservations.find((o) => o.id === observationId))
        .filter(Boolean);

    const listRoot = document.getElementById("collectionItems");
    const emptyMessage = document.getElementById("emptyCollection");
    const itemTemplate = document.getElementById("collectionItemTemplate");

    listRoot.innerHTML = "";

    if (!items.length) {
        emptyMessage.style.display = "";
        return;
    }
    emptyMessage.style.display = "none";

    for (const observation of items) {
        const card = itemTemplate.content.cloneNode(true);
        card.querySelector(".ci-name").textContent = observation.name;
        card.querySelector(".ci-desc").textContent = observation.description;
        card.querySelector(".ci-ra").textContent = observation.rightAscension;
        card.querySelector(".ci-dec").textContent = observation.declination;
        card.querySelector(".ci-loc").textContent =
            observation.locationName +
            (observation.locationLat
                ? " (" + observation.locationLat + ", " + observation.locationLng + ")"
                : "");
        card.querySelector(".ci-owner").textContent = observation.ownerNickname;
        card.querySelector(".ci-date").textContent = formatDate(observation.observedAt);
        card.querySelector(".ci-view").href =
            "observation-detail.html?id=" + encodeURIComponent(observation.id);

        const removeButton = card.querySelector(".ci-remove");
        removeButton.addEventListener("click", async () => {
            if (!confirm("Remove this observation from the collection?")) return;
            await DB.removeObservationFromCollection(collection.id, observation.id);
            location.reload();
        });

        listRoot.appendChild(card);
    }
}

window.loadCollectionDetail = loadCollectionDetail;
