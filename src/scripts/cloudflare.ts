// Suppress Cloudflare Insights errors during development
// This script prevents console errors when Cloudflare's auto-injected
// analytics script fails to load in local development environments

// Suppress Cloudflare Insights connection errors (common in local development)
window.addEventListener(
    "error",
    (event) => {
        if (
            event.message &&
            (event.message.includes("cloudflareinsights") ||
                event.message.includes("beacon.min.js") ||
                event.filename?.includes("cloudflareinsights") ||
                event.filename?.includes("beacon.min.js"))
        ) {
            event.preventDefault();
            return false;
        }
    },
    true,
);

// Also catch failed script loads
window.addEventListener(
    "error",
    (event) => {
        const target = event.target;
        if (
            target instanceof HTMLScriptElement &&
            target.src &&
            (target.src.includes("cloudflareinsights") ||
                target.src.includes("beacon.min.js"))
        ) {
            event.preventDefault();
            return false;
        }
    },
    true,
);
