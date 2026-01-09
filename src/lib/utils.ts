/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Format a date with short month format
 */
export function formatDateShort(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

/**
 * Get reading time estimate for content
 */
export function getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Sort posts by date (newest first)
 * Handles both direct pubDate and nested data.pubDate (for Astro collections)
 */
export function sortPostsByDate<T extends { pubDate: Date } | { data: { pubDate: Date } }>(posts: T[]): T[] {
    return posts.sort((a, b) => {
        const dateA = 'data' in a ? a.data.pubDate : a.pubDate;
        const dateB = 'data' in b ? b.data.pubDate : b.pubDate;
        return dateB.getTime() - dateA.getTime();
    });
}

/**
 * Generate JSON-LD structured data for blog page
 */
export function generateBlogStructuredData(posts: any[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'JRDZ Tech Blog',
        description: 'Articles about cloud computing, cybersecurity, networking, and development',
        url: 'https://jrdz.dev/blog',
        author: {
            '@type': 'Person',
            name: 'JRDZ',
            url: 'https://jrdz.dev'
        },
        blogPost: posts.slice(0, 10).map(post => ({
            '@type': 'BlogPosting',
            headline: post.data.title,
            description: post.data.description,
            url: `https://jrdz.dev/blog/${post.slug}`,
            datePublished: post.data.pubDate.toISOString(),
            author: {
                '@type': 'Person',
                name: 'JRDZ'
            },
            articleSection: post.data.category
        }))
    };
}

/**
 * Generate JSON-LD structured data for category pages
 */
export function generateCategoryStructuredData(category: any, posts: any[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: category.name,
        description: category.seoDescription || category.description,
        url: `https://jrdz.dev/blog/${category.id}`,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: posts.length,
            itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'BlogPosting',
                    headline: post.data.title,
                    description: post.data.description,
                    url: `https://jrdz.dev/blog/${post.slug}`,
                    datePublished: post.data.pubDate.toISOString(),
                    author: {
                        '@type': 'Person',
                        name: 'JRDZ'
                    }
                }
            }))
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://jrdz.dev'
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Blog',
                    item: 'https://jrdz.dev/blog'
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: category.name
                }
            ]
        }
    };
}

/**
 * Get a relative URL for a given locale and path
 * Based on Astro i18n config: defaultLocale is "en" with prefixDefaultLocale: false
 * So "en" URLs have no prefix, other locales get a prefix
 */
export function getRelativeLocaleUrl(locale: string, path: string): string {
    const defaultLocale = "en";
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    
    // If it's the default locale, return path without prefix
    if (locale === defaultLocale) {
        return normalizedPath;
    }
    
    // For other locales, add the locale prefix
    return `/${locale}${normalizedPath}`;
}
