// BinHub Application Logic
document.addEventListener("DOMContentLoaded", () => {
    console.log("BinHub Engine Loaded. Version:", BinHubConfig.version);

    // Dynamic UI Updates from Config
    const logoEl = document.getElementById("brand-title");
    if (logoEl) logoEl.textContent = BinHubConfig.branding.logoText;

    // Toast Notification Utility
    window.showToast = function(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // Global Action Handlers
    window.copyShareLink = function(fileId) {
        const link = `${window.location.origin}${window.location.pathname}?file=${fileId}`;
        navigator.clipboard.writeText(link).then(() => {
            showToast(" Link copiat cu succes!", "success");
        });
    };
});
