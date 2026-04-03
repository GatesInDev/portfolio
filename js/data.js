export const projects = [
    {
        id: 'pos-dotnet',
        title: 'Desktop POS with WPF & Clean Architecture',
        description: 'A robust Point of Sale system built with .NET 8 and WPF, focused on business rules and Clean Architecture.',
        fullDescription: 'A comprehensive POS solution designed using Clean Architecture and DDD (Domain-Driven Design) principles to ensure high maintainability and scalability. The project features a robust REST API as the back-end and a modern WPF desktop client. It implements essential design patterns such as the Repository Pattern for data abstraction, Factory for database context creation, and the native .NET Builder pattern for application configuration. Security is handled via JWT authentication, and the system includes a custom automated audit engine built with Entity Framework Core to track all database changes in SQL Server.',
        tags: ['.NET 8', 'C#', 'WPF', 'SQL Server', 'Clean Architecture', 'DDD', 'EF Core', 'JWT'],
        category: 'dotnet',
        image: '../img/POS/Dashboard.webp',
        gallery: [
            '../img/POS/LoginPage.webp',
            '../img/POS/ReportPage.webp',
            '../img/POS/Report.webp',
            '../img/POS/CashierPage.webp',
            '../img/POS/Dashboard.webp',
            '../img/POS/SettingsPage.webp',
            '../img/POS/CustomerPage.webp',
            '../img/POS/Swagger.webp'
        ],
        features: [
            'Layered Architecture (Core, Infrastructure, Application, API)',
            'Complex object mapping with AutoMapper',
            'Modern Desktop Interface using the WPF-UI library',
            'Integrated automatic audit system (Logs) within the DbContext',
            'Data reporting and export capabilities using ClosedXML',
            'Persistence layer with Entity Framework Core and SQL Server'
        ],
        repoUrl: 'https://github.com/GatesInDev/PDV',
        demoUrl: null
    },
    {
        id: 'web-dictionary',
        title: 'Web Dictionary — Serverless API',
        description: 'A full-stack technical dictionary app deployed on Vercel with a Node.js serverless backend and MongoDB Atlas database.',
        fullDescription: 'Built to demonstrate end-to-end deployment on modern infrastructure. The frontend is a static Single Page Application served by Vercel CDN, while the backend consists of Node.js serverless API functions — no traditional server required. Data is persisted in a MongoDB Atlas cluster, offering flexible schema design perfect for dictionary terms with rich markdown content. Features an admin dashboard for managing terms and a public search interface. Deployed at dictionary.vitoraltmann.dev.',
        tags: ['Node.js', 'MongoDB', 'Vercel', 'Serverless', 'JavaScript', 'REST API'],
        category: 'infra',
        image: null,
        gallery: null,
        features: [
            'Serverless API functions deployed on Vercel',
            'MongoDB Atlas for persistent cloud storage',
            'Markdown-powered term descriptions',
            'Admin dashboard with CRUD operations',
            'Static CDN-served frontend (zero cold-start for UI)',
            'Custom subdomain: dictionary.vitoraltmann.dev'
        ],
        repoUrl: 'https://github.com/GatesInDev',
        demoUrl: 'https://dictionary.vitoraltmann.dev'
    }
];

export const designs = [];
