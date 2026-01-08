const OBSERVER_CONFIG = {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
};

const handleIntersection = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
): void => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add("animate-in");
            observer.unobserve(target);
        }
    });
};

const initializeAnimations = (): void => {
    const observer = new IntersectionObserver(
        handleIntersection,
        OBSERVER_CONFIG,
    );

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll<HTMLElement>(
        ".category-card, .blog-card",
    );

    animatableElements.forEach((element) => {
        observer.observe(element);
    });
};

// Initialize animations
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAnimations);
} else {
    initializeAnimations();
}