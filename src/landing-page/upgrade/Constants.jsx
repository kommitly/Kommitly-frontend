const  Constants = {
    id: 249,
    title: "Launching an Online Tailored Design Boutique",
    description: "I want to create an online store for a tailored design boutique",
    progress: 45, // Set progress for the bar
    ai_tasks: [
        {
            id: 798,
            title: "📣 Content Creation and Marketing",
            timeline: "2-4 months",
            status: "completed",
            ai_subtasks: [
                {
                    id: 666,
                    title: "✅ Product Photography",
                    description: "Create high-quality product photos and videos.",
                    timeline: "2-4 weeks",
                    status: "completed",
                },
                {
                    id: 667,
                    title: "✅ Content Writing",
                    description: "Develop engaging product descriptions and blog posts.",
                    timeline: "2-4 weeks",
                    status: "completed",
                },
            ],
        },
        {
            id: 799,
            title: "💻 E-commerce Setup and Design", // Changed title for variety
            timeline: "3-5 weeks", // Changed timeline for variety
            status: "in-progress", // This will be the active task
            ai_subtasks: [
                {
                    id: 672,
                    title: "🛒 Choose E-commerce Platform",
                    description: "Select the best platform (Shopify, WooCommerce, etc.).",
                    timeline: "1 week",
                    status: "in-progress",
                },
                {
                    id: 673,
                    title: "🎨 Implement Custom Theme",
                    description: "Tailor the design to match the boutique's branding.",
                    timeline: "2 weeks",
                    status: "pending",
                },
            ],
        },
        {
            id: 800,
            title: "🚀 Launch and Maintenance",
            timeline: "1-3 months",
            status: "pending",
            ai_subtasks: [
                {
                    id: 674,
                    title: "🧪 Testing and Quality Assurance",
                    description: "Conduct thorough testing and quality assurance.",
                    timeline: "2-4 weeks",
                    status: "pending",
                },
            ],
        },
    ],
};


export default Constants;