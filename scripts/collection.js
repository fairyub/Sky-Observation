let myCollections = [];

async function loadCollectionsPage() {
    const currentUser = Auth.currentUser();
    myCollections = await DB.listCollectionsFor(currentUser.id);

    renderCollectionsGrid();
    wireCreateForm();
}

function renderCollectionsGrid() {
    const grid = document.getElementById("collectionsGrid");
    const emptyMessage = document.getElementById("noCollections");
    const cardTemplate = document.getElementById("collectionCardTemplate");

    grid.innerHTML = "";
    if (!myCollections.length) {
        emptyMessage.style.display = "";
        return;
    }
    emptyMessage.style.display = "none";

    for (const collection of myCollections) {
        const card = cardTemplate.content.cloneNode(true);
        card.querySelector(".col-link").href =
            "collection-detail.html?id=" + encodeURIComponent(collection.id);
        card.querySelector(".col-name").textContent = collection.name;
        if (collection.description) {
            const descriptionEl = card.querySelector(".col-desc");
            descriptionEl.style.display = "";
            descriptionEl.textContent = collection.description;
        }
        const count = collection.observationIds.length;
        card.querySelector(".col-count").textContent =
            count + " observation" + (count === 1 ? "" : "s");
        grid.appendChild(card);
    }
}

function wireCreateForm() {
    const form = document.getElementById("createCollectionForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = form.name.value.trim();
        if (!name) return;
        const currentUser = Auth.currentUser();
        const created = await DB.createCollection({
            ownerId: currentUser.id,
            name,
            description: form.description.value.trim(),
        });
        myCollections.push(created);
        form.reset();
        renderCollectionsGrid();
    });
}

window.loadCollectionsPage = loadCollectionsPage;
