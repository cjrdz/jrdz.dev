/**
 * Client-side scripts for category pages
 * - Category index: Blog card animations
 * - Category slug (article): Video placeholder replacement
 */

/* ===== CATEGORY INDEX - Blog Card Animations ===== */

interface ObserverConfig {
    threshold: number;
    rootMargin: string;
}

const OBSERVER_CONFIG: ObserverConfig = {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
};

const handleCategoryCardIntersection = (
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
 * Initialize animations for blog cards on category index page
 */
export function initializeCategoryIndexAnimations(): void {
    const observer = new IntersectionObserver(
        handleCategoryCardIntersection,
        OBSERVER_CONFIG,
    );

    const blogCards = document.querySelectorAll<HTMLElement>(".blog-card");
    blogCards.forEach((item) => {
        observer.observe(item);
    });
}

/**
 * Initialize category index page scripts (blog card animations)
 * Call this from category index.astro - handles DOM ready state
 */
export function initCategoryIndex(): void {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeCategoryIndexAnimations);
    } else {
        initializeCategoryIndexAnimations();
    }
}

/* ===== CATEGORY SLUG - Video Placeholder Replacement ===== */

const BLOG_CONTENT_ID = "blog-content";

/**
 * Convert YouTube URL to embed URL (privacy-enhanced)
 */
function convertToEmbedUrl(url: string): string {
    if (url.includes("/embed/")) {
        return url.replace("youtube.com", "youtube-nocookie.com");
    }

    const watchMatch = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?#]+)/,
    );
    return watchMatch
        ? `https://www.youtube-nocookie.com/embed/${watchMatch[1]}`
        : url;
}

/**
 * Generate video embed HTML
 */
function createVideoEmbedHtml(videoUrl: string, videoTitle: string): string {
    const embedUrl = convertToEmbedUrl(videoUrl);
    return `<div class="flex my-6 justify-start">
  <div class="w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
    <div class="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-md">
      <iframe 
        class="absolute top-0 left-0 w-full h-full border-0"
        src="${embedUrl}" 
        title="${videoTitle}" 
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen
      ></iframe>
    </div>
  </div>
</div>`;
}

/**
 * Replace {{video}} placeholder in blog content with video embed
 * Used on category slug (article) pages
 */
export function replaceVideoPlaceholders(): void {
    const content = document.getElementById(BLOG_CONTENT_ID);
    if (!content) return;

    const videoUrl = content.getAttribute("data-video-url");
    const videoTitle = content.getAttribute("data-video-title") || "Video";

    if (!videoUrl) return;

    const videoHtml = createVideoEmbedHtml(videoUrl, videoTitle);
    content.innerHTML = content.innerHTML.replace(/\{\{video\}\}/g, videoHtml);
}

/**
 * Initialize category slug (article) page scripts
 * Handles video placeholder replacement - call from [...slug].astro
 */
export function initCategorySlug(): void {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", replaceVideoPlaceholders);
    } else {
        replaceVideoPlaceholders();
    }
}
