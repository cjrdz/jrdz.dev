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
