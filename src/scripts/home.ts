// Animation System
const setupAnimations = () => {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".anim-item").forEach((el) => {
        observer.observe(el);
    });
};

// Carousel System
class AutoCarousel {
    private container: HTMLElement;
    private readonly items: NodeListOf<HTMLElement>;
    private intervalId: number | undefined;
    private currentIndex: number = 0;
    private readonly interval: number;
    private isPaused: boolean = false;

    constructor(elementId: string, interval: number = 4000) {
        const el = document.getElementById(elementId);
        if (!el)
            throw new Error(`Carousel element #${elementId} not found`);

        this.container = el;
        this.items = this.container.querySelectorAll(".carousel-item");
        this.interval = interval;

        if (this.items.length === 0) return;

        this.init();
    }

    private init(): void {
        // Sync current index based on visible item
        this.syncCurrentIndex();
        this.start();
        this.setupEventListeners();
    }

    private syncCurrentIndex = (): void => {
        // Find which item is currently visible/centered
        const containerRect = this.container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        this.items.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(itemCenter - containerCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        this.currentIndex = closestIndex;
    };

    private scrollToNext = (): void => {
        if (this.isPaused) return;

        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        const nextItem = this.items[this.currentIndex];

        // Use scrollIntoView for better compatibility with DaisyUI carousels
        nextItem.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
        });

        // Update index after scroll (with a small delay to account for smooth scroll)
        setTimeout(() => {
            this.syncCurrentIndex();
        }, 100);
    };

    public start = (): void => {
        this.isPaused = false;
        // Clear existing interval just in case
        if (this.intervalId) this.stop();
        this.intervalId = window.setInterval(
            this.scrollToNext,
            this.interval,
        );
    };

    public stop = (): void => {
        this.isPaused = true;
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    };

    private setupEventListeners(): void {
        // Pause on hover
        this.container.addEventListener("mouseenter", this.stop);
        this.container.addEventListener("mouseleave", this.start);

        // Pause on touch/interaction
        this.container.addEventListener("touchstart", this.stop);
        this.container.addEventListener("touchend", () => {
            setTimeout(this.start, 2000); // Resume after 2 seconds
        });

        // Sync index when user manually navigates (clicking arrows)
        this.container.addEventListener("scroll", () => {
            this.syncCurrentIndex();
        });

        // Sync index when navigation links are clicked
        const navLinks = this.container.querySelectorAll('a[href^="#slide"]');
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                setTimeout(() => {
                    this.syncCurrentIndex();
                }, 300); // Wait for scroll animation
            });
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    setupAnimations();

    // Initialize blog carousel if it exists on the page
    const blogCarousel = document.getElementById("blog-carousel");
    if (blogCarousel) {
        new AutoCarousel("blog-carousel", 4000);
    }
});