async function initObservationForm({ mode }) {
    const form = document.getElementById("observationForm");
    const errorBox = document.getElementById("formError");
    const id = getQueryParams().get("id");
    const currentUser = Auth.currentUser();
    const isEditMode = mode === "edit";

    const today = new Date().toISOString().slice(0, 10);
    form["observed-at"].max = today;

    if (isEditMode) {
        if (!id) {
            showError("No observation id specified.");
            disableForm();
            return;
        }
        const existing = await DB.getObservation(id);
        if (!existing) {
            showError("Observation not found.");
            disableForm();
            return;
        }
        if (existing.ownerId !== currentUser.id) {
            showError("You can only edit your own observations.");
            disableForm();
            return;
        }
        form.name.value = existing.name || "";
        form.description.value = existing.description || "";
        form.ra.value = existing.rightAscension || "";
        form.dec.value = existing.declination || "";
        form.location.value = existing.locationName || "";
        form.latitude.value = existing.locationLat || "";
        form.longitude.value = existing.locationLng || "";
        form["observed-at"].value = (existing.observedAt || "").slice(0, 10);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorBox.style.display = "none";

        const values = {
            name: form.name.value.trim(),
            description: form.description.value.trim(),
            rightAscension: form.ra.value.trim(),
            declination: form.dec.value.trim(),
            locationName: form.location.value.trim(),
            locationLat: form.latitude.value.trim(),
            locationLng: form.longitude.value.trim(),
            observedAt: form["observed-at"].value || new Date().toISOString().slice(0, 10),
        };

        if (!values.name || !values.description || !values.rightAscension ||
            !values.declination || !values.locationName) {
            showError("Please fill in name, description, RA, Dec and location name.");
            return;
        }
        if (values.observedAt > today) {
            showError("Observation date cannot be in the future.");
            return;
        }

        try {
            if (isEditMode) {
                const reason = form["update-reason"].value.trim();
                await DB.updateObservation(id, values, reason);
                location.replace("observation-detail.html?id=" + encodeURIComponent(id));
            } else {
                const created = await DB.addObservation({
                    ...values,
                    ownerId: currentUser.id,
                    ownerNickname: currentUser.nickname,
                });
                location.replace("observation-detail.html?id=" + encodeURIComponent(created.id));
            }
        } catch (error) {
            showError(error.message || String(error));
        }
    });

    function showError(message) {
        errorBox.textContent = message;
        errorBox.style.display = "";
    }
    function disableForm() {
        form.querySelectorAll("input, textarea, button").forEach((el) => (el.disabled = true));
    }
}

window.initObservationForm = initObservationForm;
