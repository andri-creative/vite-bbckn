export interface Certificate {
    id: string;
    title: string;
    description: string;
    image: string;
    issuer: string;
    issueDate: string;
    label: string;
    tags: string[];
    status: boolean;
    pinned: boolean;
    category: 'Sertifikat' | 'Penghargaan' | 'Lainnya';
    level: 'Nasional' | 'Internasional' | 'Regional';
}

export const CERTIFICATES: Certificate[] = [
    {
        id: 'cert-1',
        title: 'AWS Certified Solutions Architect',
        description: 'Mendemonstrasikan keahlian tingkat lanjut dalam merancang sistem terdistribusi di platform Amazon Web Services (AWS).',
        image: 'https://images.unsplash.com/photo-1523289217630-0dd16184af8e?auto=format&fit=crop&q=80&w=1000',
        issuer: 'Amazon Web Services',
        issueDate: 'Oktober 2023',
        label: 'Cloud Architecture',
        tags: ['AWS', 'Cloud', 'Architecture'],
        status: true,
        pinned: true,
        category: 'Sertifikat',
        level: 'Internasional'
    },
    {
        id: 'cert-2',
        title: 'Juara 1 Nasional Web Design Competition',
        description: 'Penghargaan atas desain web paling inovatif dan aksesibel dalam kompetisi tahunan yang diselenggarakan oleh Kementerian Kominfo.',
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000',
        issuer: 'Kementerian Kominfo',
        issueDate: 'Agustus 2023',
        label: 'Web Design',
        tags: ['UI/UX', 'Figma', 'Frontend'],
        status: true,
        pinned: true,
        category: 'Penghargaan',
        level: 'Nasional'
    },
    {
        id: 'cert-3',
        title: 'Google Professional Cloud Developer',
        description: 'Sertifikasi profesional untuk pengembangan dan deployment aplikasi yang sangat skalabel di Google Cloud Platform.',
        image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000',
        issuer: 'Google',
        issueDate: 'Maret 2024',
        label: 'GCP Cloud',
        tags: ['GCP', 'DevOps', 'Kubernetes'],
        status: true,
        pinned: false,
        category: 'Sertifikat',
        level: 'Internasional'
    },
    {
        id: 'cert-4',
        title: 'Meta Front-End Developer Professional',
        description: 'Program sertifikasi intensif mencakup React.js, UI/UX tingkat lanjut, dan pengembangan aplikasi mobile web.',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000',
        issuer: 'Meta / Coursera',
        issueDate: 'Januari 2024',
        label: 'Frontend',
        tags: ['React', 'JavaScript', 'Web'],
        status: true,
        pinned: false,
        category: 'Sertifikat',
        level: 'Internasional'
    },
    {
        id: 'cert-5',
        title: 'Peserta Terbaik Hackathon Regional Jabar',
        description: 'Meraih predikat tim dengan solusi perangkat lunak paling berdampak di tingkat provinsi Jawa Barat.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000',
        issuer: 'Pemerintah Provinsi Jabar',
        issueDate: 'November 2023',
        label: 'Hackathon',
        tags: ['Hackathon', 'Problem Solving', 'Teamwork'],
        status: true,
        pinned: false,
        category: 'Penghargaan',
        level: 'Regional'
    },
    {
        id: 'cert-6',
        title: 'Bootcamp Fullstack Developer',
        description: 'Lulusan terbaik dari program bootcamp intensif 6 bulan yang mempelajari MERN stack secara mendalam.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000',
        issuer: 'Tech Academy Indonesia',
        issueDate: 'Desember 2022',
        label: 'Bootcamp',
        tags: ['MERN', 'Node.js', 'MongoDB'],
        status: true,
        pinned: false,
        category: 'Lainnya',
        level: 'Nasional'
    }
];
