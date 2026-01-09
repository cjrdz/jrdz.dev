/**
 * Auto-carousel utility for blog post carousels
 */

export class AutoCarousel {
    private container: HTMLElement;
    private readonly items: NodeListOf<HTMLElement>;
    private intervalId: number | undefined;
    private currentIndex: number = 0;
    private readonly interval: number;
    private isPaused: boolean = false;
    private isAutoScrolling: boolean = false;

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

        this.isAutoScrolling = true;
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        const nextItem = this.items[this.currentIndex];

        // Store current vertical scroll position to prevent page scrolling
        const currentScrollY = window.scrollY;

        // Calculate the horizontal scroll position for the next item
        const scrollLeft = nextItem.offsetLeft - this.container.offsetLeft;

        // Scroll horizontally only, using scrollTo with smooth behavior
        this.container.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
        });

        // Prevent any vertical scrolling that might have been triggered
        // Restore the vertical scroll position immediately and during animation
        const preventVerticalScroll = () => {
            if (this.isAutoScrolling) {
                window.scrollTo({
                    top: currentScrollY,
                    behavior: "auto",
                });
            }
        };

        // Immediately prevent vertical scroll
        preventVerticalScroll();

        // Continue preventing vertical scroll during animation
        const scrollCheckInterval = window.setInterval(() => {
            preventVerticalScroll();
        }, 10);

        // Update index after scroll (with a small delay to account for smooth scroll)
        setTimeout(() => {
            clearInterval(scrollCheckInterval);
            this.syncCurrentIndex();
            // Final check to ensure vertical position is maintained
            window.scrollTo({
                top: currentScrollY,
                behavior: "auto",
            });
            this.isAutoScrolling = false;
        }, 500); // Increased timeout to cover full smooth scroll duration
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
            link.addEventListener("click", (e) => {
                // Store current vertical scroll position
                const currentScrollY = window.scrollY;
                
                // Prevent default anchor behavior that might cause vertical scroll
                e.preventDefault();
                
                // Get the target slide number from href
                const href = link.getAttribute("href");
                if (href) {
                    const slideNumber = parseInt(href.replace("#slide", ""));
                    const targetIndex = slideNumber - 1; // Convert to 0-based index
                    
                    if (targetIndex >= 0 && targetIndex < this.items.length) {
                        const targetItem = this.items[targetIndex];
                        const scrollLeft = targetItem.offsetLeft - this.container.offsetLeft;
                        
                        // Prevent vertical scrolling during navigation
                        const preventVerticalScroll = () => {
                            window.scrollTo({
                                top: currentScrollY,
                                behavior: "auto",
                            });
                        };
                        
                        // Scroll horizontally only
                        this.container.scrollTo({
                            left: scrollLeft,
                            behavior: "smooth",
                        });
                        
                        // Prevent vertical scrolling immediately and during animation
                        preventVerticalScroll();
                        const scrollCheckInterval = window.setInterval(() => {
                            preventVerticalScroll();
                        }, 10);
                        
                        setTimeout(() => {
                            clearInterval(scrollCheckInterval);
                            this.syncCurrentIndex();
                            // Final check to ensure vertical position is maintained
                            window.scrollTo({
                                top: currentScrollY,
                                behavior: "auto",
                            });
                        }, 500); // Wait for scroll animation
                    }
                }
            });
        });
    }
}
