let currentUser = null;
let userFiles = [];

function generateAutoPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < BinHubConfig.autoPasswordLength; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
}

document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("binhub_user");
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        initDashboard();
    } else {
        checkPublicLinkOrRequireAuth();
    }
    loadFiles();
});

function checkPublicLinkOrRequireAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const fileId = urlParams.get('file');

    if (fileId) {
        document.getElementById("auth-wall").style.display = "none";
        document.getElementById("app-dashboard").style.display = "none";
        document.getElementById("public-download-view").style.display = "block";
        
        document.getElementById("dl-file-name").textContent = urlParams.get('name') || "Arhivă / Fișier BinHub";
        document.getElementById("dl-file-size").textContent = "Mărime: " + (urlParams.get('size') || "Necunoscut");
    } else {
        document.getElementById("auth-wall").style.display = "flex";
        document.getElementById("app-dashboard").style.display = "none";
    }
}

function handleEmailAuth(e) {
    if(e) e.preventDefault();
    const email = document.getElementById("auth-email").value;
    let password = document.getElementById("auth-password").value;

    if (!password) {
        password = generateAutoPassword();
        document.getElementById("auth-password").value = password;
        notify("🔑 Parolă generată automat: " + password);
    }

    currentUser = {
        email: email,
        name: email ? email.split("@")[0] : "Utilizator",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email || 'user'}`
    };

    localStorage.setItem("binhub_user", JSON.stringify(currentUser));
    initDashboard();
}

function handleGoogleLogin() {
    currentUser = {
        email: "user.google@gmail.com",
        name: "Google User",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Google"
    };

    localStorage.setItem("binhub_user", JSON.stringify(currentUser));
    initDashboard();
    notify("✅ Conectat cu succes prin Google!");
}

function initDashboard() {
    document.getElementById("auth-wall").style.display = "none";
    document.getElementById("public-download-view").style.display = "none";
    document.getElementById("app-dashboard").style.display = "block";
    document.getElementById("user-display-name").textContent = currentUser.name;
    document.getElementById("user-avatar").src = currentUser.avatar;
    renderFileList();
}

function logout() {
    localStorage.removeItem("binhub_user");
    window.location.href = window.location.pathname;
}

function handleFileUpload(files) {
    if (!files.length) return;
    for (let file of files) {
        const fileData = {
            id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            date: new Date().toLocaleDateString("ro-RO")
        };
        userFiles.unshift(fileData);
    }
    saveFiles();
    renderFileList();
    notify("🚀 Fișier încărcat și salvat cu succes!");
}

function removeFile(fileId) {
    userFiles = userFiles.filter(f => f.id !== fileId);
    saveFiles();
    renderFileList();
    notify("🗑️ Fișierul a fost șters!");
}

function copyPublicLink(fileId, name, size) {
    const link = `${window.location.origin}${window.location.pathname}?file=${fileId}&name=${encodeURIComponent(name)}&size=${encodeURIComponent(size)}`;
    navigator.clipboard.writeText(link).then(() => {
        notify("🔗 Link direct copiat în clipboard!");
    });
}

function saveFiles() {
    localStorage.setItem("binhub_saved_files", JSON.stringify(userFiles));
}

function loadFiles() {
    const saved = localStorage.getItem("binhub_saved_files");
    if (saved) userFiles = JSON.parse(saved);
}

function renderFileList() {
    const container = document.getElementById("file-list-container");
    if (!container) return;

    if (userFiles.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Nu ai fișiere încărcate încă.</p>`;
        return;
    }

    container.innerHTML = userFiles.map(file => `
        <div class="file-item">
            <div style="display: flex; align-items: center; gap: 15px;">
                <i class="fa-solid fa-file-zipper" style="font-size: 1.8rem; color: var(--accent-cyan);"></i>
                <div>
                    <strong style="display: block; color: #fff;">${file.name}</strong>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${file.size} • Încărcat pe ${file.date}</span>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="copyPublicLink('${file.id}', '${file.name}', '${file.size}')">
                    <i class="fa-solid fa-link"></i> Link Direct
                </button>
                <button class="btn-danger" onclick="removeFile('${file.id}')">
                    <i class="fa-solid fa-trash"></i> Șterge
                </button>
            </div>
        </div>
    `).join('');
}

function triggerDownload() {
    notify("⬇️ Descărcarea fișierului a început!");
}

function notify(msg) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}
