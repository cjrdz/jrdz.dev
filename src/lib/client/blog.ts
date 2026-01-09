/**
 * Client-side initialization for blog pages
 */
import { initializeBlogAnimations } from './animations';

// Initialize animations
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeBlogAnimations);
} else {
    initializeBlogAnimations();
}
