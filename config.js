// BinHub Cloud Configuration
const BinHubConfig = {
    appName: "BinHub",
    version: "2.5.0",
    theme: "cyber-neon",
    githubRepo: "https://github.com/petricaleonard263-svg/BinHub",
    rawBaseUrl: "https://raw.githubusercontent.com/petricaleonard263-svg/BinHub/main",
    
    // Feature toggles
    features: {
        fileUpload: true,
        zipSupport: true,
        publicSharing: true,
        deleteAction: true,
        notifications: true
    },
    
    // UI Branding & Colors
    branding: {
        logoText: "BinHub",
        primaryColor: "#00f2fe",
        secondaryColor: "#4facfe",
        accentColor: "#7f00ff"
    },

    // Maximum file limits (MB)
    maxFileSizeMB: 250
};
