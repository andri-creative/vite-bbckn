import type { ApiTool } from '@/hooks/useAdminTools';

export interface Project {
    _id: string;
    title: string;
    slug: string;
    category?: string;
    summary: string;
    content?: string;
    company?: string;
    duration?: string;
    location?: string;
    workType?: string;
    icon?: string;
    status: boolean;
    sort: number;
    color?: string;
    accent?: string;
    border?: string;
    demoUrl?: string;
    live?: string;
    githubUrl?: string;
    repo?: string;
    techStack?: (string | ApiTool)[];
    tools?: (string | ApiTool)[];
    image?: string | string[];
    imageUrls?: string[];
}
