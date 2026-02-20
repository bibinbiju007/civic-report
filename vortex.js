let map;
let currentUser = null;

let reports = JSON.parse(localStorage.getItem("reports")) || [];

const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");
const userLabel = document.getElementById("userLabel");

/* LOGIN */
function login() {
    const name = document.getElementById("usernameInput").value.trim();
    if (!name) {
        alert("Please enter your name");
        return;
    }
    localStorage.setItem("user", name);
    startApp(name);
}

function startApp(name) {
    currentUser = name;
    loginScreen.style.display = "none";
    app.style.display = "block";
    userLabel.innerText = "👤 " + name;

    setTimeout(() => {
        if (!map) {
            map = L.map("map").setView([10.0, 76.3], 6);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
                .addTo(map);
        }
        map.invalidateSize();
    }, 200);

    renderReports();
}

function logout() {
    localStorage.removeItem("user");
    location.reload();
}

/* MODAL */
function openModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

/* SUBMIT REPORT */
function submitReport() {
    const category = document.getElementById("category");
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const location = document.getElementById("location");

    if (!category.value || !title.value || !description.value || !location.value) {
        alert("Please fill all fields");
        return;
    }

    const report = {
        id: Date.now(),
        category: category.value,
        title: title.value,
        description: description.value,
        location: location.value,
        status: "pending",
        user: currentUser
    };

    reports.push(report);
    localStorage.setItem("reports", JSON.stringify(reports));

    category.value = "";
    title.value = "";
    description.value = "";
    location.value = "";

    closeModal();
    renderReports();
}

/* RENDER REPORTS */
function renderReports() {
    const container = document.getElementById("reportCards");
    container.innerHTML = "";

    const filter = document.getElementById("filter").value;

    if (reports.length === 0) {
        container.innerHTML = "<p>No issues reported yet.</p>";
        return;
    }

    reports
        .filter(r => filter === "all" || r.status === filter)
        .forEach(r => {
            const div = document.createElement("div");
            div.className = "report-card";
            div.innerHTML = `
                <h4>${r.title}</h4>
                <p>${r.category} • ${r.location}</p>
                <p class="${r.status}">${r.status.toUpperCase()}</p>
                ${r.status === "pending"
                    ? `<button onclick="resolve(${r.id})">Resolve</button>`
                    : ""}
            `;
            container.appendChild(div);
        });
}

/* RESOLVE */
function resolve(id) {
    const report = reports.find(r => r.id === id);
    if (report) {
        report.status = "resolved";
        localStorage.setItem("reports", JSON.stringify(reports));
        renderReports();
    }
}

/* AUTO LOGIN */
const savedUser = localStorage.getItem("user");
if (savedUser) startApp(savedUser);