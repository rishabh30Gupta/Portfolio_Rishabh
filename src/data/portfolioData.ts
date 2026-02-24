/**
 * Portfolio Data
 * 
 * Contains all content for the portfolio website including
 * hero, education, experience, achievements, projects, and contact info.
 */

export const portfolioData = {
  hero: {
    name: "Rishabh Gupta",
    title: "Software Engineer · DevOps Engineer · Cloud Specialist",
    introText: "A Software Engineer specializing in DevOps, cloud infrastructure, and automation. I build robust CI/CD pipelines, manage scalable cloud systems, and solve complex infrastructure challenges with precision and reliability.",
    profileImage: "https://i.postimg.cc/tgYvk9ds/Poco-F5-Humans01012025-153035713-8-4-3.jpg",
  },

  education: [
    {
      id: "edu-1",
      title: "Master's of Computer Application (MCA)",
      organization: "Birla Institute of Technology, Mesra · 8.25 CGPA",
      date: "Aug 2023 - May 2025",
      description: "Specialized in software engineering, cloud computing, and system design with focus on DevOps practices.",
      highlights: [],
    },
    {
      id: "edu-2",
      title: "Bachelor's of Computer Application (BCA)",
      organization: "Makhanlal Chaturvedi University · 8.95 CGPA",
      date: "Jun 2020 - Aug 2023",
      description: "Built a strong foundation in core computer science — programming, data structures, algorithms, and networking.",
      highlights: [],
    },
  ],

  experience: [
    {
      id: "exp-1",
      title: "Software Engineer",
      organization: "VETTY",
      date: "Sep 2025 - Present",
      description: "Managing production infrastructure and ensuring system reliability across cloud platforms.",
      highlights: [
        "Monitored and maintained CI/CD pipelines across production environments, ensuring high availability and zero critical downtime",
        "Managed AWS & GCP infrastructure (VMs, networking, scaling) to maintain system reliability and compliance",
        "Strengthened patch management processes to reduce security vulnerabilities and operational risks",
        "Implemented automated monitoring and alerting systems for proactive issue detection",
      ],
    },
    {
      id: "exp-2",
      title: "DevOps Engineer Intern",
      organization: "VETTY",
      date: "Mar 2025 - Sep 2025",
      description: "Built automation pipelines and optimized deployment processes",
      highlights: [
        "Built an automated quality gate pipeline using SonarQube and Jenkins, reducing manual verification effort by 40%",
        "Optimized ClamAV Helm deployments on Kubernetes, improving deployment speed by 40% and configuration consistency by 50%",
        "Reduced notification costs by 30% while maintaining 90%+ delivery reliability for critical alerts",
        "Implemented infrastructure as code practices for consistent environment provisioning",
      ],
    },
  ],

  achievements: [
    {
      id: "ach-1",
      title: "Top 10 Finalist — Unstoppable Hackathon",
      description: "Selected among 200+ teams; resolved 7 production-level issues in a live repository under competition pressure.",
      date: "2025",
    },
    {
      id: "ach-2",
      title: "LeetCode Problem Solver",
      description: "Solved 350+ problems with a rating of 1548, ranking in the Top 32% globally. Demonstrates strong algorithmic thinking and problem-solving skills.",
      date: "Ongoing",
    },
    {
      id: "ach-3",
      title: "Open Source Contributor",
      description: "Fixed critical script bug in Win-Debloat-Tools, contributing to a widely-used Windows optimization project.",
      date: "2025",
    },
  ],

  projects: [
    {
      id: "proj-1",
      title: "FRIDAY - Task Automation Bot",
      description: "An AI-driven voice automation system that integrates Google Gemini with speech-to-text and NLP pipelines to execute real-time tasks. Built to automate daily workflows through natural voice commands.",
      image: "https://i.postimg.cc/qvyD03V0/Untitled-design.gif",
      tags: ["Python", "Google Gemini", "NLP", "Speech-to-Text"],
      githubUrl: "https://github.com/rishabh30Gupta",
      featured: true,
    },
    {
      id: "proj-2",
      title: "TimeBank - Decentralized P2P Labor Exchange",
      description: "A decentralized peer-to-peer labor exchange platform using smart contracts to manage task lifecycle, payments, and dispute handling securely. Features a reputation system for transparent and fair collaboration.",
      image: "https://i.postimg.cc/pdy9zD2c/timebank.gif",
      tags: ["Blockchain", "Smart Contracts", "Web3", "React"],
      githubUrl: "https://github.com/rishabh30Gupta",
      featured: true,
    },
    {
      id: "proj-3",
      title: "CI/CD Pipeline Automation",
      description: "Automated quality gate pipeline using SonarQube and Jenkins for continuous integration and deployment. Reduced manual verification effort by 40% while maintaining code quality standards.",
      image: "https://i.postimg.cc/MGjQgyh3/Untitled-design-(2).gif",
      tags: ["Jenkins", "SonarQube", "CI/CD", "DevOps"],
      featured: true,
    },
    {
      id: "proj-4",
      title: "Kubernetes Deployment Optimization",
      description: "Optimized ClamAV Helm deployments on Kubernetes, improving deployment speed by 40% and configuration consistency by 50%. Implemented best practices for container orchestration.",
      image: "https://i.postimg.cc/SsC0JNvt/Pepperads.gif",
      tags: ["Kubernetes", "Helm", "Docker", "Cloud Infrastructure"],
      featured: true,
    },
  ],

  skills: {
    languages: ["Java", "Python", "JavaScript", "TypeScript"],
    frameworks: ["Spring Boot", "Node.js", "React.js", "REST APIs", "Microservices"],
    devops_cloud: ["Jenkins", "Docker", "CI/CD", "Kubernetes", "AWS", "GCP", "Linux"],
    databases: ["MySQL", "MongoDB", "Snowflake", "PostgreSQL"],
    core: ["Data Structures & Algorithms", "System Design", "Networking"],
  },

  contact: {
    email: "rishabhgupta200230@gmail.com",
    phone: "+91 8359834412",
    location: "India",
    socialLinks: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/rishabhgupta30",
      },
      {
        platform: "GitHub",
        url: "https://github.com/rishabh30Gupta",
      },
    ],
  },
};

export type PortfolioData = typeof portfolioData;
