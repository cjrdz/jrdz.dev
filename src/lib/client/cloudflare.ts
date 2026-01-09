/**
 * Suppress Cloudflare Insights errors
 * This script prevents console errors when Cloudflare's auto-injected
 * analytics script fails to load (e.g., blocked by ad blockers)
 */

(function() {
    'use strict';
    
    const isCloudflareInsights = (str: string | null | undefined): boolean => {
        if (!str) return false;
        const lower = str.toLowerCase();
        return lower.includes('cloudflareinsights') || 
               lower.includes('beacon.min.js') ||
               lower.includes('static.cloudflareinsights.com');
    };

    // Suppress error events for Cloudflare Insights
    window.addEventListener(
        "error",
        (event) => {
            if (
                (event.message && isCloudflareInsights(event.message)) ||
                (event.filename && isCloudflareInsights(event.filename)) ||
                (event.target instanceof HTMLScriptElement && 
                 event.target.src && 
                 isCloudflareInsights(event.target.src))
            ) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        },
        true
    );

    // Suppress unhandled promise rejections
    window.addEventListener(
        "unhandledrejection",
        (event) => {
            const reason = event.reason;
            if (
                (typeof reason === 'string' && isCloudflareInsights(reason)) ||
                (reason?.message && isCloudflareInsights(reason.message)) ||
                (reason?.stack && isCloudflareInsights(reason.stack))
            ) {
                event.preventDefault();
                return false;
            }
        },
        true
    );

    // Intercept console.error to suppress Cloudflare Insights errors
    const originalConsoleError = console.error;
    console.error = function(...args: any[]) {
        const message = args.join(' ');
        if (isCloudflareInsights(message)) {
            return; // Suppress the error
        }
        originalConsoleError.apply(console, args);
    };

    // Intercept console.warn for Cloudflare Insights warnings
    const originalConsoleWarn = console.warn;
    console.warn = function(...args: any[]) {
        const message = args.join(' ');
        if (isCloudflareInsights(message)) {
            return; // Suppress the warning
        }
        originalConsoleWarn.apply(console, args);
    };
})();
