export const projects = [
    {
        id: 'pos-dotnet',
        title: 'Desktop POS with WPF & Clean Architecture',
        description: 'A robust Point of Sale system focused on business rules, built with .NET 8 and WPF.',
        fullDescription: 'A comprehensive POS solution designed using Clean Architecture and DDD (Domain-Driven Design) principles to ensure high maintainability and scalability. The project features a robust REST API as the back-end and a modern WPF desktop client. It implements essential design patterns such as the Repository Pattern for data abstraction, Factory for database context creation, and the native .NET Builder pattern for application configuration. Security is handled via JWT authentication, and the system includes a custom automated audit engine built with Entity Framework Core to track all database changes in SQL Server.',
        tags: ['.NET 8', 'C#', 'WPF', 'SQL Server', 'Clean Architecture', 'DDD'],
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
        demoUrl: '#'
    },
    /*
    {
        id: 'task-manager',
        title: 'Task Manager App',
        description: 'Productivity tool for teams with real-time updates.',
        fullDescription: 'A collaborative task management tool that allows teams to organize their work in Kanban boards. Features include drag-and-drop interfaces, real-time notifications using WebSockets, and detailed productivity analytics.',
        tags: ['Vue.js', 'Firebase', 'Tailwind'],
        category: 'other',
        image: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800&q=80',
        repoUrl: 'https://github.com/GatesInDev',
        demoUrl: '#'
    },
    {
        id: 'weather-dashboard',
        title: 'Weather Dashboard',
        description: 'Real-time weather tracking with historical data visualization.',
        fullDescription: 'Accurate weather tracking application utilizing multiple weather APIs to provide precise forecasts. Includes interactive charts for temperature trends and severe weather alerts.',
        tags: ['JavaScript', 'D3.js', 'OpenWeatherAPI'],
        category: 'other',
        image: 'https://images.unsplash.com/photo-1592210454359-9043f967297e?w=800&q=80',
        repoUrl: 'https://github.com/GatesInDev',
        demoUrl: '#'
    }
    */
];

export const designs = [
    /*
    {
        id: 'finance-app-ui',
        title: 'Finance App Redesign',
        description: 'Modern, dark-mode interface for a personal finance tracker.',
        fullDescription: 'Redesign concept for a banking application focusing on accessibility and data visualization. The dark mode palette reduces eye strain while high-contrast elements ensure readability.',
        tags: ['Figma', 'UI/UX', 'Mobile Design'],
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
        link: '#'
    },
    {
        id: 'travel-agency-web',
        title: 'Travel Agency Web',
        description: 'Immersive landing page for a luxury travel brand.',
        fullDescription: 'Concept landing page designed to evoke a sense of wanderlust. Heavy use of full-screen imagery and elegant typography to convey a premium brand feel.',
        tags: ['Figma', 'Web Design', 'Prototype'],
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
        link: '#'
    },
    */
];
