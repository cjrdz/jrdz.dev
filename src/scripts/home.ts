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
        this.start();
        this.setupEventListeners();
    }

    private scrollToNext = (): void => {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        const nextItem = this.items[this.currentIndex];

        // Calculate position to scroll to
        const itemWidth = nextItem.clientWidth;
        this.container.scrollTo({
            left: itemWidth * this.currentIndex,
            behavior: "smooth",
        });
    };

    public start = (): void => {
        // Clear existing interval just in case
        if (this.intervalId) this.stop();
        this.intervalId = window.setInterval(
            this.scrollToNext,
            this.interval,
        );
    };

    public stop = (): void => {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    };

    private setupEventListeners(): void {
        // Pause on hover
        this.container.addEventListener("mouseenter", this.stop);
        this.container.addEventListener("mouseleave", this.start);

        // Pause on touch
        this.container.addEventListener("touchstart", this.stop);
        this.container.addEventListener("touchend", this.start);
    }
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    setupAnimations();

    // Initialize carousel if it exists on the page
    if (document.getElementById("tech-carousel")) {
        new AutoCarousel("tech-carousel", 4000);
    }
});