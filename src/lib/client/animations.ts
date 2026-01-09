/**
 * Animation utilities for client-side animations
 */

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

/**
 * Initialize animations for elements with the specified selector
 */
export function initializeAnimations(selector: string = ".anim-item"): void {
    const observer = new IntersectionObserver(
        handleIntersection,
        OBSERVER_CONFIG,
    );

    const animatableElements = document.querySelectorAll<HTMLElement>(selector);
    animatableElements.forEach((element) => {
        observer.observe(element);
    });
}

/**
 * Initialize animations for blog cards and category cards
 */
export function initializeBlogAnimations(): void {
    const observer = new IntersectionObserver(
        handleIntersection,
        OBSERVER_CONFIG,
    );

    const animatableElements = document.querySelectorAll<HTMLElement>(
        ".category-card, .blog-card",
    );

    animatableElements.forEach((element) => {
        observer.observe(element);
    });
}
