import { defineCollection, z } from 'astro:content';
// Blog collection
const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        updatedDate: z.date().optional(),
        category: z.string(),
        subcategory: z.string().optional(),
        tags: z.array(z.string()).optional(),
        image: z.string().optional(),
        video: z.string().optional(),
        draft: z.boolean().default(false),
        locale: z.string().default('en'), // Add locale support for blog posts
    }),
});

// CV collection with type discriminator for nested structure
const cvCollection = defineCollection({
    type: 'content',
    schema: z.discriminatedUnion('type', [
        // Personal type
        z.object({
            type: z.literal('personal'),
            name: z.string(),
            about: z.string(),
            location: z.string(),
            locationLink: z.string().optional(),
            email: z.string(),
            phone: z.string(),
            github: z.string(),
            linkedin: z.string(),
            website: z.string(),
            locale: z.string().default('en'),
        }),
        // Work type
        z.object({
            type: z.literal('work'),
            company: z.string(),
            link: z.string(),
            title: z.string(),
            start: z.string(),
            end: z.string().nullable(),
            description: z.string(),
            achievements: z.array(z.string()).optional(),
            badges: z.array(z.string()).optional(),
            order: z.number().default(0),
            locale: z.string().default('en'),
        }),
        // Education type
        z.object({
            type: z.literal('education'),
            school: z.string(),
            degree: z.string(),
            start: z.string(),
            end: z.string().nullable(),
            order: z.number().default(0),
            locale: z.string().default('en'),
        }),
        // Projects type
        z.object({
            type: z.literal('projects'),
            name: z.string(),
            description: z.string(),
            link: z.string().optional(),
            technologies: z.array(z.string()).optional(),
            order: z.number().default(0),
            locale: z.string().default('en'),
        }),
        // Certifications type
        z.object({
            type: z.literal('certifications'),
            name: z.string(),
            issuer: z.string(),
            link: z.string().optional(),
            date: z.string(),
            credentialId: z.string().optional(),
            order: z.number().default(0),
            locale: z.string().default('en'),
        }),
        // Skills type
        z.object({
            type: z.literal('skills'),
            skills: z.array(z.string()),
            locale: z.string().default('en'),
        }),
    ]),
});

export const collections = {
    blog: blogCollection,
    cv: cvCollection,
};