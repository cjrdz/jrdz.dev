import type { Category } from './types';
import CloudIcon from 'astro-heroicons/solid/Cloud.astro';
import ShieldCheckIcon from 'astro-heroicons/solid/ShieldCheck.astro';
import GlobeAltIcon from 'astro-heroicons/solid/GlobeAlt.astro';
import CodeBracketIcon from 'astro-heroicons/solid/CodeBracket.astro';

export const categories: Category[] = [
    {
        id: 'cloud',
        name: 'Cloud Computing',
        description: 'Learn about Microsoft Azure, AWS, and cloud infrastructure management.',
        icon: '☁️',
        iconComponent: CloudIcon,
        colorClass: 'bg-primary',
        bgColorClass: 'bg-primary',
        seoDescription: 'Explore cloud computing tutorials, guides, and best practices for Microsoft Azure, AWS, and cloud infrastructure management.',
        keywords: ['cloud computing', 'azure', 'aws', 'cloud infrastructure', 'devops', 'cloud services'],
        subcategories: [
            {
                id: 'azure',
                name: 'Microsoft Azure',
                description: 'Azure services and infrastructure'
            },
            {
                id: 'aws',
                name: 'Amazon Web Services',
                description: 'AWS cloud platform and services'
            }
        ]
    },
    {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        description: 'Security best practices, threat analysis, and secure development.',
        icon: '🔒',
        iconComponent: ShieldCheckIcon,
        colorClass: 'bg-primary',
        bgColorClass: 'bg-primary',
        seoDescription: 'Learn cybersecurity fundamentals, threat analysis, penetration testing, and secure development practices.',
        keywords: ['cybersecurity', 'security', 'penetration testing', 'ethical hacking', 'threat analysis', 'secure development'],
        subcategories: [
            {
                id: 'defensive',
                name: 'Defensive Security',
                description: 'Protecting systems and networks'
            },
            {
                id: 'offensive',
                name: 'Offensive Security',
                description: 'Ethical hacking and penetration testing'
            }
        ]
    },
    {
        id: 'networking',
        name: 'Networking',
        description: 'Network architecture, protocols, and cloud networking solutions.',
        icon: '🌐',
        iconComponent: GlobeAltIcon,
        colorClass: 'bg-primary',
        bgColorClass: 'bg-primary',
        seoDescription: 'Master networking fundamentals, protocols, network architecture, and cloud networking solutions.',
        keywords: ['networking', 'network protocols', 'network architecture', 'tcp/ip', 'routing', 'switching'],
        subcategories: [
            {
                id: 'fundamentals',
                name: 'Fundamentals',
                description: 'Basic networking concepts'
            },
            {
                id: 'intermediate',
                name: 'Intermediate',
                description: 'Advanced networking topics'
            }
        ]
    },
    {
        id: 'dev',
        name: 'Development',
        description: 'Programming tutorials, development best practices, and code reviews.',
        icon: '💻',
        iconComponent: CodeBracketIcon,
        colorClass: 'bg-primary',
        bgColorClass: 'bg-primary',
        seoDescription: 'Learn programming with tutorials on Python, C/C++, web development, and software development best practices.',
        keywords: ['programming', 'development', 'python', 'c++', 'web development', 'coding', 'software engineering'],
        subcategories: [
            {
                id: 'python',
                name: 'Python',
                description: 'Python programming and frameworks'
            },
            {
                id: 'c',
                name: 'C/C++',
                description: 'Systems programming with C/C++'
            },
            {
                id: 'web',
                name: 'Web Development',
                description: 'Frontend and backend web development'
            }
        ]
    }
];

export function getCategoryById(id: string): Category | undefined {
    return categories.find(cat => cat.id === id);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string) {
    const category = getCategoryById(categoryId);
    return category?.subcategories?.find(sub => sub.id === subcategoryId);
}

// Localized category translations
const categoryTranslations: Record<string, Record<string, { name: string; description: string; seoDescription?: string }>> = {
    en: {
        cloud: {
            name: 'Cloud Computing',
            description: 'Learn about Microsoft Azure, AWS, and cloud infrastructure management.',
            seoDescription: 'Explore cloud computing tutorials, guides, and best practices for Microsoft Azure, AWS, and cloud infrastructure management.',
        },
        cybersecurity: {
            name: 'Cybersecurity',
            description: 'Security best practices, threat analysis, and secure development.',
            seoDescription: 'Learn cybersecurity fundamentals, threat analysis, penetration testing, and secure development practices.',
        },
        networking: {
            name: 'Networking',
            description: 'Network architecture, protocols, and cloud networking solutions.',
            seoDescription: 'Master networking fundamentals, protocols, network architecture, and cloud networking solutions.',
        },
        dev: {
            name: 'Development',
            description: 'Programming tutorials, development best practices, and code reviews.',
            seoDescription: 'Learn programming with tutorials on Python, C/C++, web development, and software development best practices.',
        },
    },
    es: {
        cloud: {
            name: 'Computación en la Nube',
            description: 'Aprende sobre Microsoft Azure, AWS y gestión de infraestructura en la nube.',
            seoDescription: 'Explora tutoriales de computación en la nube, guías y mejores prácticas para Microsoft Azure, AWS y gestión de infraestructura en la nube.',
        },
        cybersecurity: {
            name: 'Ciberseguridad',
            description: 'Mejores prácticas de seguridad, análisis de amenazas y desarrollo seguro.',
            seoDescription: 'Aprende fundamentos de ciberseguridad, análisis de amenazas, pruebas de penetración y prácticas de desarrollo seguro.',
        },
        networking: {
            name: 'Redes',
            description: 'Arquitectura de redes, protocolos y soluciones de redes en la nube.',
            seoDescription: 'Domina los fundamentos de redes, protocolos, arquitectura de redes y soluciones de redes en la nube.',
        },
        dev: {
            name: 'Desarrollo',
            description: 'Tutoriales de programación, mejores prácticas de desarrollo y revisiones de código.',
            seoDescription: 'Aprende programación con tutoriales sobre Python, C/C++, desarrollo web y mejores prácticas de desarrollo de software.',
        },
    },
};

// Subcategory translations
const subcategoryTranslations: Record<string, Record<string, Record<string, { name: string; description: string }>>> = {
    en: {
        cloud: {
            azure: { name: 'Microsoft Azure', description: 'Azure services and infrastructure' },
            aws: { name: 'Amazon Web Services', description: 'AWS cloud platform and services' },
        },
        cybersecurity: {
            defensive: { name: 'Defensive Security', description: 'Protecting systems and networks' },
            offensive: { name: 'Offensive Security', description: 'Ethical hacking and penetration testing' },
        },
        networking: {
            fundamentals: { name: 'Fundamentals', description: 'Basic networking concepts' },
            intermediate: { name: 'Intermediate', description: 'Advanced networking topics' },
        },
        dev: {
            python: { name: 'Python', description: 'Python programming and frameworks' },
            c: { name: 'C/C++', description: 'Systems programming with C/C++' },
            web: { name: 'Web Development', description: 'Frontend and backend web development' },
        },
    },
    es: {
        cloud: {
            azure: { name: 'Microsoft Azure', description: 'Servicios e infraestructura de Azure' },
            aws: { name: 'Amazon Web Services', description: 'Plataforma y servicios en la nube de AWS' },
        },
        cybersecurity: {
            defensive: { name: 'Seguridad Defensiva', description: 'Protección de sistemas y redes' },
            offensive: { name: 'Seguridad Ofensiva', description: 'Hacking ético y pruebas de penetración' },
        },
        networking: {
            fundamentals: { name: 'Fundamentos', description: 'Conceptos básicos de redes' },
            intermediate: { name: 'Intermedio', description: 'Temas avanzados de redes' },
        },
        dev: {
            python: { name: 'Python', description: 'Programación y frameworks de Python' },
            c: { name: 'C/C++', description: 'Programación de sistemas con C/C++' },
            web: { name: 'Desarrollo Web', description: 'Desarrollo web frontend y backend' },
        },
    },
};

// Get localized categories
export function getLocalizedCategories(locale: string = 'en'): Category[] {
    const translations = categoryTranslations[locale] || categoryTranslations.en;
    const subTranslations = subcategoryTranslations[locale] || subcategoryTranslations.en;
    
    return categories.map(category => {
        const translation = translations[category.id] || { name: category.name, description: category.description };
        const subTrans = subTranslations[category.id] || {};
        
        return {
            ...category,
            name: translation.name,
            description: translation.description,
            seoDescription: translation.seoDescription || category.seoDescription,
            subcategories: category.subcategories?.map(sub => {
                const subTransItem = subTrans[sub.id];
                return subTransItem ? { ...sub, ...subTransItem } : sub;
            }),
        };
    });
}

// Get localized category by ID
export function getLocalizedCategoryById(id: string, locale: string = 'en'): Category | undefined {
    const localizedCategories = getLocalizedCategories(locale);
    return localizedCategories.find(cat => cat.id === id);
}
