import { getTranslationObject } from '../lib/i18n';

export interface CV {
  name: string;
  title: string;
  location: string;
  locationLink: string;
  about: string;
  summary: string;
  personalWebsiteUrl: string;
  contact: Contact;
  work: Work[];
  projects?: Project[];
  education: Education[];
  certifications: Certification[];
  skills: string[];
}

export interface Contact {
  email: string;
  tel: string;
  social: Social[];
}

export interface Social {
  name: string;
  url: string;
}

export interface Work {
  company: string;
  link: string;
  title: string;
  start: string;
  end: string | null;
  description: string;
  achievements?: string[];
  badges?: string[];
}

export interface Education {
  school: string;
  degree: string;
  start: string;
  end: string | null;
}

export interface Certification {
  name: string;
  issuer: string;
  link?: string;
  date: string;
  credentialId?: string;
}

export interface Project {
  name: string;
  description: string;
  link?: string;
  technologies?: string[];
}

// CV data will be loaded from i18n files
// This function will be used to get CV data for a specific locale
export function getCVData(locale: string = 'en'): CV {
  const cvData = getTranslationObject(locale, 'cv') as any;
  
  if (!cvData) {
    throw new Error(`CV data not found for locale: ${locale}`);
  }
  
  return {
    name: cvData.name || "Jonathan Rodriguez",
    title: cvData.title || "Software Engineer",
    location: cvData.location || "La Libertad, El Salvador",
    locationLink: cvData.locationLink || "https://maps.app.goo.gl/BUR3nRxeE9BoF56W9",
    about: cvData.about || "",
    summary: cvData.summary || "",
    personalWebsiteUrl: cvData.personalWebsiteUrl || "https://jrdz.dev/about/",
    contact: {
      email: cvData.contact?.email || "jonathanrdzdev@gmail.com",
      tel: cvData.contact?.tel || "+503 7056-5645",
      social: cvData.contact?.social || [
        { name: "GitHub", url: "https://github.com/cjrdz" },
        { name: "LinkedIn", url: "https://www.linkedin.com/in/jrdzt/" },
      ],
    },
    work: cvData.work || [],
    projects: cvData.projects || [],
    education: cvData.education || [],
    certifications: cvData.certifications || [],
    skills: cvData.skills || [],
  };
}
