document.addEventListener("DOMContentLoaded", () => {
    console.log("BinHub Engine Active:", BinHubConfig.version);

    const logo = document.getElementById("brand-name");
    if (logo) logo.textContent = BinHubConfig.branding.logoText;

    const badge = document.getElementById("brand-badge");
    if (badge) badge.textContent = BinHubConfig.branding.badgeText;

    window.notify = function(msg) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    window.triggerUpload = function() {
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.click();
    };

    window.handleFiles = function(files) {
        if (!files.length) return;
        const fileName = files[0].name;
        notify(`Fișierul "${fileName}" este pregătit pentru generare link public!`);
    };
});
