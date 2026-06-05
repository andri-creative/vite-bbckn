export const PROJECTS = [
    {
        title: 'E-Commerce Platform',
        slug: 'e-commerce-platform',
        category: 'Professional',
        summary: 'Full-stack marketplace with real-time inventory, Midtrans payment gateway, and seller dashboard built with Laravel & React.',
        content: `
            <h3>Project Overview</h3>
            <p>This e-commerce platform was built to handle high-volume transactions and real-time inventory management. It serves as a centralized marketplace connecting thousands of sellers with buyers.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Real-time inventory sync using WebSockets</li>
                <li>Seamless payment integration with Midtrans</li>
                <li>Comprehensive seller dashboard with analytics</li>
            </ul>
        `,
        company: 'PT Maju Bersama',
        duration: '8 Months',
        location: 'Jakarta, Indonesia',
        workType: 'On-site',
        tags: ['Laravel', 'React', 'MySQL', 'Midtrans'],
        icon: 'ph:storefront-bold',
        image: [
            'https://images.unsplash.com/photo-1557821552-1710515302a9?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000'
        ],
        color: 'from-cyan-500/20 to-blue-500/20',
        accent: 'text-cyan-400',
        border: 'hover:border-cyan-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'Task Management App',
        slug: 'task-management-app',
        category: 'Professional',
        summary: 'Collaborative project management tool with real-time updates via WebSocket, drag-and-drop boards, and role-based permissions.',
        content: `
            <h3>Project Overview</h3>
            <p>A highly collaborative tool designed for modern remote teams. It simplifies task tracking with an intuitive kanban board interface.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Live updates and collaborative editing</li>
                <li>Customizable workflows and drag-and-drop kanban boards</li>
                <li>Granular role-based access control (RBAC)</li>
            </ul>
        `,
        company: 'Tech Solutions Inc.',
        duration: '4 Months',
        workType: 'Remote',
        tags: ['Next.js', 'Express.js', 'PostgreSQL', 'Socket.io'],
        icon: 'ph:kanban-bold',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1000',
        color: 'from-emerald-500/20 to-teal-500/20',
        accent: 'text-emerald-400',
        border: 'hover:border-emerald-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'Portfolio CMS',
        slug: 'portfolio-cms',
        category: 'Open Source',
        summary: 'Headless CMS for portfolio management with image optimization, markdown editor, and static site generation.',
        content: `
            <h3>Project Overview</h3>
            <p>An open-source headless CMS tailored for developers and designers to easily manage and deploy their portfolios.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Built-in Markdown editor with live preview</li>
                <li>Automatic image optimization and CDN delivery</li>
                <li>1-click deployment to Vercel</li>
            </ul>
        `,
        tags: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
        icon: 'ph:layout-bold',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
        color: 'from-violet-500/20 to-purple-500/20',
        accent: 'text-violet-400',
        border: 'hover:border-violet-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'Real-Estate Directory',
        slug: 'real-estate-directory',
        category: 'Freelance',
        summary: 'A modern directory for finding properties with interactive maps, advanced filtering, and virtual tour integrations.',
        content: `
            <h3>Project Overview</h3>
            <p>A comprehensive property directory offering advanced search capabilities and an immersive property viewing experience.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Interactive property maps powered by Mapbox</li>
                <li>360-degree virtual tour integrations</li>
                <li>Advanced multi-parameter search filters</li>
            </ul>
        `,
        company: 'PropertyLand',
        location: 'Bandung, Indonesia',
        tags: ['React', 'Node.js', 'MongoDB', 'Mapbox'],
        icon: 'ph:buildings-bold',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
        color: 'from-orange-500/20 to-red-500/20',
        accent: 'text-orange-400',
        border: 'hover:border-orange-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'AI Content Generator',
        slug: 'ai-content-generator',
        category: 'Freelance',
        summary: 'SaaS application leveraging OpenAI API to generate marketing copy, blog posts, and social media captions automatically.',
        content: `
            <h3>Project Overview</h3>
            <p>A SaaS platform that acts as an AI-powered copywriting assistant, helping businesses scale their content creation efforts.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Integration with OpenAI's latest GPT models</li>
                <li>Custom templates for ads, blogs, and social media</li>
                <li>Export and formatting options for immediate use</li>
            </ul>
        `,
        duration: '3 Months',
        workType: 'Hybrid',
        tags: ['Vue.js', 'Python', 'FastAPI', 'OpenAI'],
        icon: 'ph:robot-bold',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
        color: 'from-pink-500/20 to-rose-500/20',
        accent: 'text-pink-400',
        border: 'hover:border-pink-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'Finance Dashboard',
        slug: 'finance-dashboard',
        category: 'Personal',
        summary: 'Comprehensive financial analytics dashboard with interactive charts, transaction tracking, and goal management.',
        content: `
            <h3>Project Overview</h3>
            <p>A personal finance tool that aggregates data to provide visual insights into spending habits and financial goals.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Interactive, drill-down charts using Chart.js</li>
                <li>Automated expense categorization</li>
                <li>Custom financial goal trackers</li>
            </ul>
        `,
        tags: ['React', 'Chart.js', 'Firebase', 'Tailwind'],
        icon: 'ph:chart-line-up-bold',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
        color: 'from-blue-500/20 to-indigo-500/20',
        accent: 'text-blue-400',
        border: 'hover:border-blue-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'E-Commerce Platform V2',
        slug: 'e-commerce-platform-v2',
        category: 'Professional',
        summary: 'Next-generation marketplace with AI product recommendations, advanced analytics, and multi-currency support.',
        content: `
            <h3>Project Overview</h3>
            <p>The highly anticipated sequel to the original platform, completely rewritten to support global scaling and AI-driven features.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Machine learning-based product recommendations</li>
                <li>Global multi-currency and multi-language support</li>
                <li>ElasticSearch integration for lightning-fast queries</li>
            </ul>
        `,
        company: 'PT Maju Bersama',
        duration: '6 Months',
        location: 'Jakarta, Indonesia',
        workType: 'On-site',
        tags: ['Laravel', 'React', 'ElasticSearch'],
        icon: 'ph:storefront-bold',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000',
        color: 'from-cyan-500/20 to-blue-500/20',
        accent: 'text-cyan-400',
        border: 'hover:border-cyan-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'Task Management App V2',
        slug: 'task-management-app-v2',
        category: 'Professional',
        summary: 'Enterprise-grade project management with time tracking, resource allocation, and automated reporting features.',
        content: `
            <h3>Project Overview</h3>
            <p>Upgraded to meet enterprise demands, this version focuses on resource management and automated compliance reporting.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Advanced resource allocation and capacity planning</li>
                <li>Automated time tracking and invoicing generation</li>
                <li>Deep integration with enterprise SSO</li>
            </ul>
        `,
        company: 'Tech Solutions Inc.',
        duration: '5 Months',
        workType: 'Remote',
        tags: ['Next.js', 'NestJS', 'PostgreSQL'],
        icon: 'ph:kanban-bold',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000',
        color: 'from-emerald-500/20 to-teal-500/20',
        accent: 'text-emerald-400',
        border: 'hover:border-emerald-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'Portfolio CMS Pro',
        slug: 'portfolio-cms-pro',
        category: 'Open Source',
        summary: 'Advanced headless CMS with multi-language support, custom fields builder, and API-first architecture.',
        content: `
            <h3>Project Overview</h3>
            <p>The Pro version introduces dynamic data structuring and localization for international users.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Fully customizable content schemas</li>
                <li>Out-of-the-box i18n support</li>
                <li>High-performance GraphQL API</li>
            </ul>
        `,
        tags: ['Next.js', 'TypeScript', 'Prisma', 'Docker'],
        icon: 'ph:layout-bold',
        image: 'https://images.unsplash.com/photo-1557821552-1710515302a9?auto=format&fit=crop&q=80&w=1000',
        color: 'from-violet-500/20 to-purple-500/20',
        accent: 'text-violet-400',
        border: 'hover:border-violet-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'Real-Estate Analytics',
        slug: 'real-estate-analytics',
        category: 'Freelance',
        summary: 'Data analytics platform for real estate agents providing market trends, pricing predictions, and neighborhood stats.',
        content: `
            <h3>Project Overview</h3>
            <p>A B2B data analytics platform empowering real estate agents with predictive models and neighborhood insights.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Predictive pricing models using historical data</li>
                <li>Interactive demographic maps</li>
                <li>Automated PDF report generation for clients</li>
            </ul>
        `,
        company: 'PropertyLand',
        location: 'Bandung, Indonesia',
        tags: ['React', 'Python', 'Pandas'],
        icon: 'ph:buildings-bold',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
        color: 'from-orange-500/20 to-red-500/20',
        accent: 'text-orange-400',
        border: 'hover:border-orange-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'AI Image Generator',
        slug: 'ai-image-generator',
        category: 'Freelance',
        summary: 'Web application that integrates with Stable Diffusion models to generate high-quality custom artwork.',
        content: `
            <h3>Project Overview</h3>
            <p>An accessible interface for interacting with complex Stable Diffusion models, making AI art generation easy for anyone.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Custom model fine-tuning interface</li>
                <li>High-resolution upscaling built-in</li>
                <li>Community gallery and prompt sharing</li>
            </ul>
        `,
        duration: '2 Months',
        workType: 'Hybrid',
        tags: ['React', 'Node.js', 'Stable Diffusion'],
        icon: 'ph:robot-bold',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1000',
        color: 'from-pink-500/20 to-rose-500/20',
        accent: 'text-pink-400',
        border: 'hover:border-pink-500/40',
        live: '#',
        repo: '#',
    },
    {
        title: 'Crypto Dashboard',
        slug: 'crypto-dashboard',
        category: 'Personal',
        summary: 'Real-time cryptocurrency portfolio tracker with candlestick charts, price alerts, and market sentiment analysis.',
        content: `
            <h3>Project Overview</h3>
            <p>A specialized dashboard for crypto enthusiasts to monitor their holdings and analyze market sentiment in real time.</p>
            <h4>Key Features</h4>
            <ul>
                <li>Real-time candlestick charts with technical indicators</li>
                <li>Push notifications for price thresholds</li>
                <li>Twitter sentiment analysis overlay</li>
            </ul>
        `,
        tags: ['React', 'D3.js', 'WebSocket'],
        icon: 'ph:chart-line-up-bold',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
        color: 'from-blue-500/20 to-indigo-500/20',
        accent: 'text-blue-400',
        border: 'hover:border-blue-500/40',
        live: '#',
        repo: '#',
    },
];
