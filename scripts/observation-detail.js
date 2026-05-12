async function loadDetail() {
    const id = getQueryParams().get("id");
    if (!id) {
        document.getElementById("notFound").style.display = "";
        document.getElementById("detailContainer").style.display = "none";
        return;
    }

    const observation = await DB.getObservation(id);
    if (!observation) {
        document.getElementById("notFound").style.display = "";
        document.getElementById("detailContainer").style.display = "none";
        return;
    }

    // increment the view counter 
    await DB.incrementViewCount(id);
    observation.viewCount = (observation.viewCount || 0) + 1;

    const currentUser = Auth.currentUser();

    // fill main info
    document.getElementById("obsName").textContent = observation.name;
    document.getElementById("obsOwner").textContent = "@" + observation.ownerNickname;
    document.getElementById("obsDate").textContent =
        formatDate(observation.observedAt);
    document.getElementById("obsDesc").textContent = observation.description;
    document.getElementById("obsRA").textContent = observation.rightAscension;
    document.getElementById("obsDec").textContent = observation.declination;
    document.getElementById("obsLocName").textContent = observation.locationName;
    document.getElementById("obsLat").textContent = observation.locationLat || "-";
    document.getElementById("obsLng").textContent = observation.locationLng || "-";
    document.getElementById("obsViews").textContent = observation.viewCount;

    if (observation.edited) {
        document.getElementById("obsEdited").style.display = "";
        document.getElementById("obsEditedInfo").style.display = "";
        document.getElementById("obsEditedInfo").textContent =
            " · modified " + formatDateTime(observation.edited) +
            (observation.updateReason ? " (reason: " + observation.updateReason + ")" : "");
    }

    // only owner action
    if (currentUser && observation.ownerId === currentUser.id) {
        document.getElementById("ownerActions").style.display = "";
        document.getElementById("editLink").href =
            "observation-edit.html?id=" + encodeURIComponent(observation.id);
        document.getElementById("deleteBtn").addEventListener("click", async () => {
            if (!confirm("Are you sure you want to delete this observation?")) return;
            await DB.deleteObservation(observation.id);
            location.replace("observation.html");
        });
    }

    // comments
    await renderComments(observation.id);
    document.getElementById("commentForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target;
        const text = form.text.value.trim();
        if (!text) return;
        await DB.addComment({
            observationId: observation.id,
            ownerId: currentUser.id,
            ownerNickname: currentUser.nickname,
            text,
        });
        form.reset();
        await renderComments(observation.id);
    });

    // rating
    await renderRatingSummary(observation.id);
    const existingRating = await DB.getUserRating(observation.id, currentUser.id);
    if (existingRating) {
        const radio = document.getElementById("star" + existingRating.value);
        if (radio) radio.checked = true;
    }
    document.getElementById("ratingForm").addEventListener("change", async (event) => {
        if (event.target.name !== "rating") return;
        await DB.setRating({
            observationId: observation.id,
            ownerId: currentUser.id,
            value: parseInt(event.target.value, 10),
        });
        await renderRatingSummary(observation.id);
    });

    // collections 
    await populateCollectionSelect(observation.id);
    document.getElementById("addToColBtn").addEventListener("click", async () => {
        const select = document.getElementById("collectionSelect");
        const message = document.getElementById("colMsg");
        if (!select.value) {
            message.textContent = "Pick a collection first.";
            message.style.display = "";
            return;
        }
        await DB.addObservationToCollection(select.value, observation.id);
        message.textContent = "Added to collection.";
        message.style.display = "";
        await populateCollectionSelect(observation.id);
    });
}

async function renderComments(observationId) {
    const comments = await DB.listCommentsFor(observationId);
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const listRoot = document.getElementById("commentsList");
    const emptyMessage = document.getElementById("noComments");
    const commentTemplate = document.getElementById("commentTemplate");

    listRoot.innerHTML = "";
    if (!comments.length) {
        emptyMessage.style.display = "";
        return;
    }
    emptyMessage.style.display = "none";
    for (const comment of comments) {
        const card = commentTemplate.content.cloneNode(true);
        card.querySelector(".cm-author").textContent = "@" + comment.ownerNickname;
        card.querySelector(".cm-date").textContent = formatDateTime(comment.createdAt);
        card.querySelector(".cm-text").textContent = comment.text;
        listRoot.appendChild(card);
    }
}

async function renderRatingSummary(observationId) {
    const summary = await DB.ratingSummary(observationId);
    const summaryEl = document.getElementById("ratingSummary");
    if (summary.count === 0) {
        summaryEl.textContent = "No ratings yet.";
    } else {
        summaryEl.textContent =
            formatStars(summary.average) + "  " + summary.average.toFixed(1) + " / 5 (" +
            summary.count + " rating" + (summary.count === 1 ? "" : "s") + ")";
    }
}

async function populateCollectionSelect(observationId) {
    const currentUser = Auth.currentUser();
    const collections = await DB.listCollectionsFor(currentUser.id);
    const select = document.getElementById("collectionSelect");
    select.innerHTML = '<option value="">- select -</option>';
    for (const collection of collections) {
        const option = document.createElement("option");
        option.value = collection.id;
        const alreadyAdded = collection.observationIds.includes(observationId);
        option.textContent = collection.name + (alreadyAdded ? " (already added)" : "");
        if (alreadyAdded) option.disabled = true;
        select.appendChild(option);
    }
}

window.loadDetail = loadDetail;
