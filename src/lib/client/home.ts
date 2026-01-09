/**
 * Client-side initialization for home page
 */
import { initializeAnimations } from './animations';
import { AutoCarousel } from './carousel';

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initializeAnimations();

    // Initialize blog carousel if it exists on the page
    const blogCarousel = document.getElementById("blog-carousel");
    if (blogCarousel) {
        new AutoCarousel("blog-carousel", 4000);
    }
});
