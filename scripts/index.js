async function loadHome() {
    const observations = await DB.listObservations();

    /* ---- MOST RATED OBSERVATION ---- */
    const summaries = [];
    for (const observation of observations) {
        const comments = await DB.listCommentsFor(observation.id);
        const ratings = await DB.listRatingsFor(observation.id);
        const totalRatingValue = ratings.reduce((total, rating) => total + rating.value, 0);
        const score = totalRatingValue + comments.length;
        const averageRating = ratings.length ? totalRatingValue / ratings.length : 0;
        summaries.push({ observation, comments, ratings, averageRating, score });
    }
    const winner = summaries
        .filter((entry) => entry.ratings.length || entry.comments.length)
        .sort((a, b) => b.score - a.score)[0];

    const card = document.getElementById("topRatedLink");
    const empty = document.getElementById("topRatedEmpty");

    if (!winner) {
        card.style.display = "none";
        empty.style.display = "";
        return;
    }
    card.style.display = "";
    empty.style.display = "none";
    card.href = "observation-detail.html?id=" + encodeURIComponent(winner.observation.id);
    document.getElementById("topRatedName").textContent = winner.observation.name;
    document.getElementById("topRatedDesc").textContent = winner.observation.description;
    document.getElementById("topRatedOwner").textContent = "@" + winner.observation.ownerNickname;
    document.getElementById("topRatedViews").textContent = winner.observation.viewCount || 0;
    document.getElementById("topRatedRating").textContent =
        formatStars(winner.averageRating) +
        "  " + winner.averageRating.toFixed(1) + " / 5 (" +
        winner.ratings.length + " rating" + (winner.ratings.length === 1 ? "" : "s") + ", " +
        winner.comments.length + " comment" + (winner.comments.length === 1 ? "" : "s") + ")";

    /* ---- 5 MOST POPULAR ---- */
    const mostPopular = [...observations]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5);

    const popularList = document.getElementById("popularList");
    const cardTemplate = document.getElementById("popularCardTemplate");
    popularList.innerHTML = "";
    for (const observation of mostPopular) {
        const card = cardTemplate.content.cloneNode(true);
        card.querySelector("a").href =
            "observation-detail.html?id=" + encodeURIComponent(observation.id);
        card.querySelector(".card-name").textContent = observation.name;
        card.querySelector(".card-meta").textContent =
            "by @" + observation.ownerNickname + " · " +
            formatDate(observation.observedAt);
        card.querySelector(".card-desc").textContent = observation.description;
        card.querySelector(".card-ra").textContent = observation.rightAscension;
        card.querySelector(".card-dec").textContent = observation.declination;
        card.querySelector(".card-views").textContent = observation.viewCount || 0;
        popularList.appendChild(card);
    }
}

window.loadHome = loadHome;
