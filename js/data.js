// ══════════════════════════════════════════════════
//  Portfolio Data — GatesInDev / Vitor Altmann
//  All public GitHub repositories mapped here.
//  Categories: dotnet | java | infra | web | linux
// ══════════════════════════════════════════════════

export const projects = [

    // ── .NET / C# ────────────────────────────────

    {
        id: 'pos-dotnet',
        title: 'Desktop POS — WPF & Clean Architecture',
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
        id: 'financial-wizard',
        title: 'FinancialWizard — ERP Finance Module',
        description: 'A C#-based financial management system inspired by ERP architecture, for tracking revenues, expenses, and business cash flow.',
        fullDescription: 'FinancialWizard is a desktop financial management application built in C# with a structured ERP-inspired approach. Designed to simplify the tracking of business finances, it enables users to register income and expense transactions, categorize them, and visualize running balances. The system follows clean separation of concerns and provides a straightforward interface for small business financial control.',
        tags: ['C#', '.NET', 'ERP', 'Desktop', 'Finance'],
        category: 'dotnet',
        image: null,
        gallery: null,
        features: [
            'Income and expense transaction management',
            'Category-based transaction classification',
            'Running balance visualization',
            'ERP-inspired module architecture',
            'MIT Licensed open source project'
        ],
        repoUrl: 'https://github.com/GatesInDev/FinancialWizard',
        demoUrl: null
    },

    {
        id: 'gest-agro',
        title: 'GestAgro — Agricultural Management System',
        description: 'A C# agricultural management system for tracking farm operations, stock, and field management.',
        fullDescription: 'GestAgro is a C# desktop application designed for agricultural business management. Built to address the specific needs of agricultural operations, it provides tools for managing farm stock, tracking field activities, and organizing operational data. The system reflects experience applying software engineering principles to domain-specific, real-world business problems.',
        tags: ['C#', '.NET', 'Desktop', 'Agriculture', 'ERP'],
        category: 'dotnet',
        image: null,
        gallery: null,
        features: [
            'Agricultural inventory and stock control',
            'Field operation tracking',
            'Domain-specific business logic for farming',
            'Desktop-first interface'
        ],
        repoUrl: 'https://github.com/GatesInDev/GestAgro',
        demoUrl: null
    },

    // ── Infrastructure / Full-Stack ──────────────

    {
        id: 'web-dictionary',
        title: 'Web Dictionary — Serverless API',
        description: 'A full-stack technical dictionary deployed on Vercel with a Node.js serverless backend and MongoDB Atlas database.',
        fullDescription: 'Built to demonstrate end-to-end deployment on modern cloud infrastructure. The frontend is a static Single Page Application served by Vercel CDN, while the backend consists of Node.js serverless API functions — no traditional server required. Data is persisted in a MongoDB Atlas cluster, offering flexible schema design perfect for dictionary terms with rich markdown content. Features an admin dashboard for managing terms and a public search interface. Deployed at dictionary.vitoraltmann.dev.',
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
        repoUrl: 'https://github.com/GatesInDev/dictionary',
        demoUrl: 'https://dictionary.vitoraltmann.dev'
    },

    // ── TypeScript / Web ─────────────────────────

    {
        id: 'hyrule-compendium',
        title: 'Hyrule Compendium',
        description: 'A TypeScript web app and Python scraper that aggregates and displays Zelda compendium data. Live on Vercel.',
        fullDescription: 'HyruleCompendium is a full-stack web project combining a TypeScript frontend with a Python data scraper that collects compendium entries from the Zelda universe. The application is deployed on Vercel at hyrule-compendium-zeta.vercel.app and serves as a living encyclopedia of Hyrule creatures, items, and equipment. A personal passion project that also demonstrates multi-language development, API integration, and static deployment capabilities.',
        tags: ['TypeScript', 'Python', 'Vercel', 'Web App', 'Zelda', 'Scraping'],
        category: 'infra',
        image: null,
        gallery: null,
        features: [
            'TypeScript frontend with modern component architecture',
            'Python scraper for automated data collection',
            'Full compendium of Zelda creatures, items, and equipment',
            'Deployed on Vercel with custom routing (vercel.json)',
            'Responsive web design with CSS'
        ],
        repoUrl: 'https://github.com/GatesInDev/HyruleCompendium',
        demoUrl: 'https://hyrule.vitoraltmann.dev'
    },

    // ── Java ─────────────────────────────────────

    {
        id: 'market-manager',
        title: 'MarketManager — Business ERP',
        description: 'A Java Swing desktop ERP for small businesses — managing clients, products, orders, and financial transactions.',
        fullDescription: 'MarketManager is a full-featured Java Swing desktop application that functions as an ERP system for small businesses. It handles customer and product registration, order management with automatic total calculation, and financial transaction tracking with dynamic balance visualization. The system follows MVC architecture with a MySQL backend and is imported/run via NetBeans. It demonstrates strong object-oriented design and database-driven UI development in Java.',
        tags: ['Java', 'Swing', 'MySQL', 'ERP', 'Desktop', 'MVC'],
        category: 'java',
        image: null,
        gallery: null,
        features: [
            'Order management with automatic total calculation',
            'Revenue and expense transaction tracking',
            'Dynamic balance visualization with color-coded indicators',
            'Customer and product CRUD with combobox population',
            'MVC architecture (models, views, controllers, database layers)',
            'MySQL backend with SQL dump included'
        ],
        repoUrl: 'https://github.com/GatesInDev/MarketManager',
        demoUrl: null
    },

    {
        id: 'vinyl-records-erp',
        title: 'VinylRecordsERP — Record Store ERP',
        description: 'A Java-based Enterprise Resource Planning system for vinyl record stores, built collaboratively with team pull requests.',
        fullDescription: 'VinylRecordsERP is a Java ERP application specifically designed for vinyl record retail businesses. The project showcases collaborative development with 7 active pull requests from team members, demonstrating real-world team workflow and code review practices. It handles the specialized inventory, sales, and operational needs of a niche retail business — vinyl record stores — with domain-driven business logic.',
        tags: ['Java', 'ERP', 'Retail', 'Collaborative', 'Business Logic'],
        category: 'java',
        image: null,
        gallery: null,
        features: [
            'Domain-specific ERP for vinyl record retail',
            'Collaborative development with team pull requests',
            'Inventory and sales management',
            'Business-specific domain modeling'
        ],
        repoUrl: 'https://github.com/GatesInDev/VinylRecordsERP',
        demoUrl: null
    },

    // ── Linux / DevOps ───────────────────────────

    {
        id: 'gates-os',
        title: 'GatesOS — Custom Arch Linux Distro',
        description: 'A personal Arch Linux-based operating system built as a hobby project, with custom shell scripts for full system configuration.',
        fullDescription: 'GatesOS is a custom operating system distribution based on Arch Linux, built entirely as a personal hobby project. It consists of shell scripts that automate the installation, configuration, and customization of a complete Linux desktop environment. The project demonstrates deep Linux system knowledge, shell scripting, and the ability to build from the ground up — from kernel to desktop environment — using only configuration scripts.',
        tags: ['Shell', 'Arch Linux', 'Linux', 'DevOps', 'Scripting'],
        category: 'linux',
        image: null,
        gallery: null,
        features: [
            'Full Arch Linux-based OS from scratch',
            'Automated installation via shell scripts',
            'Custom desktop environment configuration',
            'Personal dotfiles and system preferences baked in'
        ],
        repoUrl: 'https://github.com/GatesInDev/GatesOS',
        demoUrl: null
    },

    {
        id: 'gatesindev-setup',
        title: 'GatesInDev Setup — Desktop Environment',
        description: 'Shell scripts for automating a complete Arch Linux desktop environment setup. Reproducible dev workstation from scratch.',
        fullDescription: 'A collection of shell scripts that fully automate the setup of a personalized Arch Linux desktop environment. This setup script installs packages, configures dotfiles, sets up window managers, and applies personal productivity preferences in a single run. It represents a DevOps mindset applied to personal workstation management — infrastructure as code for the desktop.',
        tags: ['Shell', 'Arch Linux', 'Automation', 'Dotfiles', 'DevOps'],
        category: 'linux',
        image: null,
        gallery: null,
        features: [
            'Single-script Arch Linux desktop setup',
            'Package installation and configuration automation',
            'Reproducible workstation environment',
            'DevOps mindset applied to personal infrastructure'
        ],
        repoUrl: 'https://github.com/GatesInDev/gatesindev-setup',
        demoUrl: null
    },

];

export const designs = [];
