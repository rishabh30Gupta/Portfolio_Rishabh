/**
 * Portfolio Data
 * 
 * Contains all content for the portfolio website including
 * hero, education, experience, achievements, projects, and contact info.
 */

export const portfolioData = {
  hero: {
    name: "Nandani Hada",
    title: "AI Engineer · Agentic Developer · Prompt Engineer",
    introText: "A Software Developer and AI Engineer who doesn't just write code  I orchestrate it. I specialize in prompt engineering and production-ready AI integration, turning client ideas into working products at rocket speed.",
    profileImage: "https://i.postimg.cc/D0j9tncG/nan-image.jpg",
  },

  education: [
    {
      id: "edu-1",
      title: "Master's of Computer Application (MCA)",
      organization: "Birla Institute of Technology, Mesra · 7.75 CGPA",
      date: "Aug 2023 - May 2025",
      description: "Specialized in Artificial Intelligence, Machine Learning, and Natural Language Processing.",
      highlights: [],
    },
    {
      id: "edu-2",
      title: "Bachelor's of Computer Application (BCA)",
      organization: "Devi Ahilya University, Indore · 73.33%",
      date: "Jun 2020 - Jun 2023",
      description: "Built a strong foundation in core computer science — programming, networking, and systems architecture.",
      highlights: [],
    },
  ],

  experience: [
    {
      id: "exp-1",
      title: "Junior Software Developer",
      organization: "SURVTIT Research LLP",
      date: "Oct 2025 - Present",
      description: "Promoted from intern — now owning production-level features end to end.",
      highlights: [
        "Built and maintained a fraud detection & tracking system, improving data accuracy and platform reliability",
        "Developed a postback system connecting 20+ platforms with real-time data exchange",
        "Created a comprehensive admin panel with 19+ modules, each with dedicated sub-functions for full operational control",
        "Integrated Gemini API to power intelligent, AI-driven features across the platform",
        "Automated email workflows across 10+ touchpoints per user and partner — scheduling, promotional, and engagement campaigns",
        "Worked across a broad stack — React, TypeScript, Python, Spring Boot, Flutter, Tailwind, and more",
      ],
    },
    {
      id: "exp-2",
      title: "Full Stack Developer Intern",
      organization: "SURVTIT Research LLP",
      date: "Apr 2025 - Oct 2025",
      description: "Developed full-stack features for AI-powered platforms",
      highlights: [
        "Designed and developed 30+ responsive React.js pages and Python-based backend services for PepperAds platform",
        "Achieved ~25% higher user engagement through improved usability and performance",
        "Integrated OpenAI and Gemini APIs to power AI-driven survey features, automating user insights by ~20%",
        "Leveraged AI coding agents (Kiro, Antigravity, Warp) to rapidly prototype and deploy full-stack features, achieving 30% faster delivery",
      ],
    },
  ],

  achievements: [
    {
      id: "ach-1",
      title: "Top 10 Finalist — Unstoppable Hackathon",
      description: "LNMIIT Jaipur — Selected among 200+ teams; identified and resolved 7 real issues in a production repository under competition pressure.",
      date: "2024",
    },
    {
      id: "ach-2",
      title: "Competitive Programming",
      description: "Solved 200+ problems on LeetCode (50-Day Badge) · 4★ Java · 3★ SQL on HackerRank",
      date: "Ongoing",
    },
    {
      id: "ach-3",
      title: "Oracle Cloud Infrastructure — Generative AI Professional & AI Foundations Associate",
      description: "Certified in designing and deploying generative AI solutions on Oracle Cloud Infrastructure.",
      date: "2025",
    },
    {
      id: "ach-4",
      title: "HackerRank Problem Solving — Intermediate",
      description: "Certified for proficiency in algorithms and data structures.",
      date: "2024",
    },
  ],

  projects: [
    {
      id: "proj-1",
      title: "Lado The Beauty Salon",
      description: "A modern salon website where the owner can showcase their work, display a beautiful gallery, and let clients book appointments online — all in one place. Clean UI, smooth experience, and built to make a real business look its best.",
      image: "https://i.postimg.cc/qvyD03V0/Untitled-design.gif",
      tags: ["React", "TypeScript", "Firebase"],
      liveUrl: "https://ladothebeautysalon.web.app",
      featured: true,
    },
    {
      id: "proj-2",
      title: "MoustacheLeads",
      description: "The full-stack platform I help build and maintain at work. Handles everything from survey distribution and postback tracking across 20+ platforms, to fraud detection, admin operations, and automated email campaigns — all running in production.",
      image: "https://i.postimg.cc/MGjQgyh3/Untitled-design-(2).gif",
      tags: ["React", "Python", "Node.js", "Spring Boot", "Gemini API"],
      liveUrl: "https://moustacheleads.com",
      featured: true,
    },
    {
      id: "proj-3",
      title: "PepperAds",
      description: "Landing website for PepperAds — a platform built to promote the product and communicate its value clearly to potential clients and partners. Focused on performance, clarity, and strong first impressions.",
      image: "https://i.postimg.cc/SsC0JNvt/Pepperads.gif",
      tags: ["React", "TypeScript", "Tailwind"],
      liveUrl: "https://pepperads.in",
      featured: true,
    },
    {
      id: "proj-4",
      title: "TimeBank ⚡ Built overnight at a hackathon",
      description: "A work-exchange platform where people trade skills instead of money — one hour of your work for one hour of someone else's. Built in a single night at Unstoppable Hackathon, LNMIIT Jaipur. Top 10 among 200+ teams.",
      image: "https://i.postimg.cc/pdy9zD2c/timebank.gif",
      tags: ["React", "Blockchain", "Web3 Wallet Integration"],
      liveUrl: "https://time-bank-eosin.vercel.app",
      featured: true,
    },
    {
      id: "proj-5",
      title: "TinyLink",
      description: "A clean, minimal URL shortener — paste a long link, get a short one. Built solo to sharpen my full-stack fundamentals. Simple idea, solid execution.",
      image: "https://i.postimg.cc/HkY3GP2k/Untitled-design-(1).gif",
      tags: ["Solo Project", "React", "Node.js"],
      liveUrl: "https://tinylink-topaz-theta.vercel.app",
      featured: false,
    },
    {
      id: "proj-6",
      title: "Curvora",
      description: "A stylish clothing brand website built to give a fashion business a strong online presence. Showcases collections, communicates brand identity, and delivers a smooth shopping-feel experience.",
      image: "https://i.postimg.cc/mkgKg23y/curvora.gif",
      tags: ["React", "Tailwind"],
      liveUrl: "https://radiate-your-curve.vercel.app",
      featured: false,
    },
    {
      id: "proj-7",
      title: "Gift Cards",
      description: "A dedicated website for someone special — where clients can browse and send beautifully designed digital gift cards for special occasions. A complete, client-ready product built to make gifting feel personal and effortless.",
      image: "https://i.postimg.cc/25p6bgK1/Untitled-design-(3).gif",
      tags: ["React", "TypeScript"],
      liveUrl: "https://ramyanigift.vercel.app",
      featured: false,
    },
  ],

  skills: {
    languages: ["Java", "Python", "JavaScript", "SQL"],
    ai_ml: ["Machine Learning", "Deep Learning", "NLP", "Generative AI", "Prompt Engineering", "LlamaIndex", "TensorFlow"],
    tools: ["Git", "Postman", "MongoDB", "Vector Databases", "Firebase"],
    ai_agents: ["Cursor", "Windsurf", "Bolt", "Kiro", "Antigravity", "Warp"],
  },

  contact: {
    email: "nandanihada2003@gmail.com",
    phone: "+91 7489277279",
    location: "Shujalpur, India",
    socialLinks: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/nandani-hada-618b33285",
      },
      {
        platform: "GitHub",
        url: "https://github.com/nandanihada",
      },
      {
        platform: "Instagram",
        url: "https://www.instagram.com/nandanihada14?igsh=MTg1b2o4NjAzN2x5dQ==",
      },
    ],
  },
};

export type PortfolioData = typeof portfolioData;
