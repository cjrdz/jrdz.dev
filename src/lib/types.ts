export interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    iconComponent?: any;
    colorClass?: string;
    bgColorClass?: string;
    seoDescription?: string;
    keywords?: string[];
    subcategories?: Subcategory[];
}

export interface Subcategory {
    id: string;
    name: string;
    description: string;
}

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    category: string;
    subcategory?: string;
    tags?: string[];
    draft?: boolean;
}
