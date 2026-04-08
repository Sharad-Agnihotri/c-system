export const ROADMAP_TEMPLATES: Record<string, any> = {
  "React": {
    totalDuration: "14 weeks",
    beginner: [
      {
        title: "React Core Concepts",
        duration: "3 weeks",
        topics: ["JSX & Virtual DOM", "Components & Props", "useState & useEffect", "Event Handling & Forms", "Conditional Rendering & Lists"],
        project: "Build a task manager app with add, delete, and filter functionality",
      },
      {
        title: "Component Patterns & Styling",
        duration: "2 weeks",
        topics: ["CSS Modules & Styled Components", "Component Composition", "Children & Render Props", "Controlled vs Uncontrolled Inputs"],
        project: "Build a responsive dashboard UI with reusable card components",
      },
    ],
    intermediate: [
      {
        title: "State Management & Data Fetching",
        duration: "3 weeks",
        topics: ["useContext & useReducer", "React Query / TanStack Query", "SWR for Data Fetching", "Zustand / Redux Toolkit", "Optimistic Updates"],
        project: "E-commerce product catalog with cart, filters, and API integration",
      },
      {
        title: "Routing & Forms",
        duration: "2 weeks",
        topics: ["React Router v6 (Loaders & Actions)", "Protected Routes & Auth Guards", "React Hook Form + Zod Validation", "File Uploads & Multi-step Forms"],
        project: "Multi-page app with auth, protected routes, and profile settings",
      },
    ],
    advanced: [
      {
        title: "Performance & Architecture",
        duration: "2 weeks",
        topics: ["React.memo & useMemo & useCallback", "Code Splitting & React.lazy", "Concurrent Features & Suspense", "Custom Hooks Architecture", "Error Boundaries"],
        project: "Optimize a large app — achieve <100ms interaction, <2s LCP",
      },
      {
        title: "Testing & Production Readiness",
        duration: "2 weeks",
        topics: ["React Testing Library", "Component Unit Testing", "Integration Tests with MSW", "Cypress E2E Testing", "Accessibility (a11y) Auditing"],
        project: "Add comprehensive test suite (90%+ coverage) to an existing React app",
      },
    ],
  },

  "Node.js": {
    totalDuration: "16 weeks",
    beginner: [
      {
        title: "Node.js Fundamentals",
        duration: "3 weeks",
        topics: ["Event Loop & Async Model", "Modules (CommonJS & ESM)", "File System & Streams", "Buffer & Path APIs", "NPM & Package Management"],
        project: "CLI tool that reads, transforms, and writes CSV files",
      },
      {
        title: "Building HTTP Servers",
        duration: "2 weeks",
        topics: ["http module & Request/Response", "Express.js Setup & Middleware", "Routing & Route Parameters", "Error Handling Middleware", "Serving Static Files"],
        project: "REST API for a notes application with Express",
      },
    ],
    intermediate: [
      {
        title: "Database Integration & Auth",
        duration: "3 weeks",
        topics: ["PostgreSQL with pg / Prisma ORM", "MongoDB with Mongoose", "JWT Authentication & bcrypt", "Session Management", "Input Validation (Joi/Zod)"],
        project: "Full auth system with user registration, login, password reset",
      },
      {
        title: "Advanced API Patterns",
        duration: "3 weeks",
        topics: ["RESTful API Design Best Practices", "File Upload with Multer", "Rate Limiting & CORS", "WebSocket with Socket.io", "API Versioning & Documentation"],
        project: "Real-time chat application with rooms and private messaging",
      },
    ],
    advanced: [
      {
        title: "Microservices & Message Queues",
        duration: "3 weeks",
        topics: ["Microservice Architecture Patterns", "RabbitMQ / Bull Queue", "gRPC Communication", "Service Discovery", "Event-Driven Architecture"],
        project: "Order processing system with separate auth, order, and notification services",
      },
      {
        title: "Production Deployment",
        duration: "2 weeks",
        topics: ["PM2 Process Management", "Docker Containerization", "CI/CD with GitHub Actions", "Logging (Winston/Pino)", "APM & Health Monitoring"],
        project: "Dockerized Node.js API deployed with CI/CD and monitoring",
      },
    ],
  },

  "Python": {
    totalDuration: "16 weeks",
    beginner: [
      {
        title: "Python Core Language",
        duration: "3 weeks",
        topics: ["Variables, Types & Operators", "Control Flow & Loops", "Functions & Decorators", "Lists, Dicts, Sets, Tuples", "File I/O & Exception Handling"],
        project: "Personal finance tracker that reads/writes transaction data",
      },
      {
        title: "Object-Oriented Python",
        duration: "2 weeks",
        topics: ["Classes & Objects", "Inheritance & Polymorphism", "Magic Methods (__str__, __repr__)", "Properties & Descriptors", "Modules & Packages"],
        project: "Library management system with OOP design",
      },
    ],
    intermediate: [
      {
        title: "Web Development with Python",
        duration: "3 weeks",
        topics: ["Flask / FastAPI Fundamentals", "Request Handling & Routing", "SQLAlchemy ORM & Alembic Migrations", "Authentication (JWT/OAuth)", "REST API Design"],
        project: "Blog API with FastAPI, PostgreSQL, and JWT auth",
      },
      {
        title: "Data Handling & Automation",
        duration: "3 weeks",
        topics: ["Pandas DataFrames", "Web Scraping (BeautifulSoup, Scrapy)", "Regular Expressions", "Working with APIs (requests)", "Task Automation with Python"],
        project: "Web scraper that collects job listings and exports to Excel",
      },
    ],
    advanced: [
      {
        title: "Advanced Python Patterns",
        duration: "3 weeks",
        topics: ["Generators & Iterators", "Async/Await (asyncio)", "Context Managers", "Metaprogramming & Metaclasses", "Type Hints & mypy"],
        project: "Async web crawler that processes 1000+ pages concurrently",
      },
      {
        title: "Testing & Packaging",
        duration: "2 weeks",
        topics: ["pytest & Fixtures", "Mocking with unittest.mock", "Code Coverage & CI", "Building Python Packages (setuptools)", "Virtual Environments & Poetry"],
        project: "Open-source Python package with full test suite published to PyPI",
      },
    ],
  },

  "Docker": {
    totalDuration: "10 weeks",
    beginner: [
      {
        title: "Docker Fundamentals",
        duration: "2 weeks",
        topics: ["Containers vs VMs", "Docker CLI & Images", "Dockerfile Syntax", "docker run, build, pull, push", "Port Mapping & Volumes"],
        project: "Containerize a simple Node.js or Python web app",
      },
      {
        title: "Building Custom Images",
        duration: "2 weeks",
        topics: ["Multi-stage Builds", "Layer Caching Optimization", "ENV & ARG Instructions", ".dockerignore Best Practices", "Image Tagging & Registry"],
        project: "Optimized production image for a React + Node.js app (<100MB)",
      },
    ],
    intermediate: [
      {
        title: "Docker Compose & Networking",
        duration: "3 weeks",
        topics: ["docker-compose.yml Syntax", "Multi-container Applications", "Docker Networking (Bridge, Host, Overlay)", "Named Volumes & Bind Mounts", "Health Checks & Restart Policies"],
        project: "Full-stack app with separate web, API, and database containers",
      },
    ],
    advanced: [
      {
        title: "Production Docker & Orchestration",
        duration: "3 weeks",
        topics: ["Docker Swarm Basics", "Container Security & Scanning", "Resource Limits (CPU, Memory)", "Logging Drivers & Monitoring", "CI/CD Pipeline with Docker"],
        project: "Automated CI/CD pipeline that builds, tests, and deploys Docker containers",
      },
    ],
  },

  "TypeScript": {
    totalDuration: "10 weeks",
    beginner: [
      {
        title: "TypeScript Basics",
        duration: "2 weeks",
        topics: ["Type Annotations & Inference", "Primitive & Object Types", "Arrays, Tuples & Enums", "Union & Intersection Types", "Type Aliases vs Interfaces"],
        project: "Convert a JavaScript utility library to TypeScript",
      },
      {
        title: "Functions & Object Types",
        duration: "2 weeks",
        topics: ["Function Signatures & Overloads", "Optional & Default Parameters", "Readonly & Partial Types", "Index Signatures", "Type Guards & Narrowing"],
        project: "Type-safe form validator library",
      },
    ],
    intermediate: [
      {
        title: "Generics & Advanced Types",
        duration: "3 weeks",
        topics: ["Generic Functions & Constraints", "Generic Interfaces & Classes", "Mapped Types & Template Literals", "Conditional Types", "Utility Types (Pick, Omit, Record)"],
        project: "Generic data fetching hook with full type safety for React",
      },
    ],
    advanced: [
      {
        title: "TypeScript in Production",
        duration: "3 weeks",
        topics: ["Declaration Files (.d.ts)", "Module Augmentation", "Strict Mode Deep Dive", "TypeScript Compiler API", "Monorepo Setups with tsc"],
        project: "Published npm package with full TypeScript support and generated docs",
      },
    ],
  },

  "AWS": {
    totalDuration: "16 weeks",
    beginner: [
      {
        title: "AWS Core Services",
        duration: "3 weeks",
        topics: ["IAM Users, Roles & Policies", "EC2 Instances & Key Pairs", "S3 Buckets & Object Storage", "VPC, Subnets & Security Groups", "AWS CLI & CloudShell"],
        project: "Deploy a static website on S3 with CloudFront CDN",
      },
      {
        title: "Compute & Databases",
        duration: "3 weeks",
        topics: ["Elastic Beanstalk", "RDS (PostgreSQL/MySQL)", "DynamoDB Basics", "Lambda Functions", "API Gateway"],
        project: "Serverless REST API with Lambda + API Gateway + DynamoDB",
      },
    ],
    intermediate: [
      {
        title: "Architecture & Scalability",
        duration: "4 weeks",
        topics: ["Auto Scaling Groups & Load Balancers", "SQS & SNS Messaging", "CloudWatch Monitoring & Alarms", "ElastiCache (Redis)", "Route 53 DNS"],
        project: "Scalable web app with ALB, ASG, RDS, and CloudWatch dashboards",
      },
    ],
    advanced: [
      {
        title: "Infrastructure as Code & DevOps",
        duration: "4 weeks",
        topics: ["CloudFormation Templates", "Terraform with AWS Provider", "ECS & Fargate Containers", "CodePipeline CI/CD", "AWS Well-Architected Framework"],
        project: "Full infrastructure-as-code deployment with blue/green deployment strategy",
      },
      {
        title: "AWS Solutions Architect Prep",
        duration: "2 weeks",
        topics: ["Multi-Region Architecture", "Disaster Recovery Patterns", "Cost Optimization Strategies", "Security Best Practices (KMS, WAF)", "SAA-C03 Exam Preparation"],
        project: "Design a multi-region, fault-tolerant architecture documentation",
      },
    ],
  },

  "Machine Learning": {
    totalDuration: "20 weeks",
    beginner: [
      {
        title: "Math & Python for ML",
        duration: "3 weeks",
        topics: ["Linear Algebra (Vectors, Matrices)", "Probability & Statistics", "NumPy & Pandas", "Matplotlib & Seaborn Visualization", "Jupyter Notebooks"],
        project: "Exploratory data analysis on a real-world dataset (Titanic/Boston Housing)",
      },
      {
        title: "Supervised Learning Foundations",
        duration: "4 weeks",
        topics: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "K-Nearest Neighbors", "Cross-Validation & Train/Test Split", "Scikit-learn Pipeline"],
        project: "House price prediction model with feature engineering",
      },
    ],
    intermediate: [
      {
        title: "Advanced ML Algorithms",
        duration: "4 weeks",
        topics: ["Support Vector Machines", "Gradient Boosting (XGBoost, LightGBM)", "Unsupervised Learning (K-Means, PCA)", "Ensemble Methods", "Hyperparameter Tuning (GridSearch, Optuna)"],
        project: "Customer segmentation system using clustering and dimensionality reduction",
      },
      {
        title: "Feature Engineering & Evaluation",
        duration: "3 weeks",
        topics: ["Feature Selection Techniques", "Handling Missing Data & Outliers", "Encoding Categorical Variables", "Precision, Recall, F1, ROC-AUC", "Bias-Variance Tradeoff"],
        project: "Fraud detection classifier with imbalanced data handling",
      },
    ],
    advanced: [
      {
        title: "Deep Learning Introduction",
        duration: "4 weeks",
        topics: ["Neural Network Architecture", "Backpropagation & Gradient Descent", "PyTorch / TensorFlow Basics", "CNNs for Image Classification", "Transfer Learning (ResNet, VGG)"],
        project: "Image classification model for medical X-rays using transfer learning",
      },
      {
        title: "MLOps & Model Deployment",
        duration: "2 weeks",
        topics: ["Model Serialization (pickle, ONNX)", "FastAPI for ML Serving", "MLflow Experiment Tracking", "Docker for ML Pipelines", "AWS SageMaker / GCP Vertex AI"],
        project: "End-to-end ML pipeline: train, evaluate, package, and deploy as API",
      },
    ],
  },

  "System Design": {
    totalDuration: "12 weeks",
    beginner: [
      {
        title: "System Design Fundamentals",
        duration: "3 weeks",
        topics: ["Client-Server Architecture", "HTTP/HTTPS & DNS", "Load Balancing (L4 vs L7)", "Caching Strategies (CDN, Redis)", "Database Basics (SQL vs NoSQL)"],
        project: "Design a URL shortener (like bit.ly) — document the full architecture",
      },
    ],
    intermediate: [
      {
        title: "Scalability Patterns",
        duration: "4 weeks",
        topics: ["Horizontal vs Vertical Scaling", "Database Sharding & Replication", "Message Queues (Kafka, RabbitMQ)", "CAP Theorem & Consistency Models", "Rate Limiting & Circuit Breakers"],
        project: "Design a Twitter-like social feed with fan-out architecture",
      },
      {
        title: "Data & Storage Systems",
        duration: "2 weeks",
        topics: ["Blob Storage & Object Stores", "Search Engines (Elasticsearch)", "Time-Series Databases", "Data Warehousing Concepts", "Event Sourcing & CQRS"],
        project: "Design a YouTube-like video streaming platform architecture",
      },
    ],
    advanced: [
      {
        title: "Distributed Systems & Interview Prep",
        duration: "3 weeks",
        topics: ["Distributed Consensus (Raft, Paxos)", "Microservices Communication Patterns", "Observability (Metrics, Traces, Logs)", "Chaos Engineering", "System Design Interview Framework"],
        project: "Design WhatsApp / Slack messaging platform — full architecture document",
      },
    ],
  },

  "Data Structures & Algorithms": {
    totalDuration: "16 weeks",
    beginner: [
      {
        title: "Arrays, Strings & Hashing",
        duration: "3 weeks",
        topics: ["Array Manipulation & Two Pointers", "String Operations & Pattern Matching", "Hash Maps & Hash Sets", "Frequency Counting", "Sliding Window Technique"],
        project: "Solve 30 LeetCode Easy problems (Arrays + Strings + HashMap)",
      },
      {
        title: "Linked Lists, Stacks & Queues",
        duration: "2 weeks",
        topics: ["Singly & Doubly Linked Lists", "Stack Operations & Applications", "Queue & Deque", "Monotonic Stack", "Implement LRU Cache"],
        project: "Build a browser history manager using stacks and linked lists",
      },
    ],
    intermediate: [
      {
        title: "Trees & Graphs",
        duration: "4 weeks",
        topics: ["Binary Trees & BST", "Tree Traversals (BFS, DFS)", "Graph Representations (Adjacency List/Matrix)", "Dijkstra's & BFS Shortest Path", "Topological Sort"],
        project: "Solve 40 LeetCode Medium problems (Trees + Graphs)",
      },
      {
        title: "Sorting, Searching & Recursion",
        duration: "2 weeks",
        topics: ["Merge Sort & Quick Sort", "Binary Search Variations", "Recursion & Backtracking", "Divide and Conquer", "Bit Manipulation"],
        project: "Build a search-autocomplete system using tries and binary search",
      },
    ],
    advanced: [
      {
        title: "Dynamic Programming & Advanced Patterns",
        duration: "5 weeks",
        topics: ["1D & 2D DP Problems", "Knapsack Variants", "Interval DP & String DP", "Greedy Algorithms", "Advanced Graph Algorithms (Union-Find, MST)"],
        project: "Solve 30 LeetCode Hard problems + mock coding interviews",
      },
    ],
  },

  "Next.js": {
    totalDuration: "12 weeks",
    beginner: [
      {
        title: "Next.js Fundamentals",
        duration: "3 weeks",
        topics: ["App Router & File-Based Routing", "Server Components vs Client Components", "Layouts, Loading & Error States", "Link & Navigation", "Metadata & SEO"],
        project: "Personal blog with dynamic routes and markdown rendering",
      },
    ],
    intermediate: [
      {
        title: "Data Fetching & Server Actions",
        duration: "3 weeks",
        topics: ["Server-Side Data Fetching", "Server Actions & Form Handling", "Caching & Revalidation (ISR)", "Route Handlers (API Routes)", "Middleware & Authentication"],
        project: "Full-stack SaaS dashboard with auth, CRUD operations, and real-time data",
      },
      {
        title: "Database & ORM Integration",
        duration: "2 weeks",
        topics: ["Prisma ORM Setup", "Database Migrations", "Server-Side Rendering with DB", "Optimistic UI Updates", "Pagination & Infinite Scroll"],
        project: "Project management tool (like Trello) with Prisma and PostgreSQL",
      },
    ],
    advanced: [
      {
        title: "Production Next.js",
        duration: "4 weeks",
        topics: ["Edge Runtime & Streaming", "Image & Font Optimization", "Internationalization (i18n)", "Testing with Playwright", "Deployment (Vercel, Docker, Self-hosted)"],
        project: "Production-grade e-commerce store with payments, auth, and admin panel",
      },
    ],
  },

  "Frontend Development": {
    totalDuration: "16 weeks",
    beginner: [
      {
        title: "HTML & CSS Fundamentals",
        duration: "2 weeks",
        topics: ["Semantic HTML5 Elements", "CSS Box Model & Positioning", "Flexbox & Grid Layout", "Responsive Design & Media Queries"],
        project: "Build a responsive portfolio website",
      },
      {
        title: "JavaScript Essentials",
        duration: "3 weeks",
        topics: ["Variables, Scoping & Hoisting", "Functions, Closures & 'this'", "DOM Manipulation & Events", "ES6+ (Arrow Functions, Destructuring, Spread)", "Promises & Async/Await"],
        project: "Interactive to-do app with local storage persistence",
      },
    ],
    intermediate: [
      {
        title: "React & Component Architecture",
        duration: "3 weeks",
        topics: ["Components, Props & JSX", "State Management (useState, useReducer)", "Hooks (useEffect, useMemo, useCallback)", "React Router & Navigation"],
        project: "Movie search app with TMDb API integration",
      },
      {
        title: "TypeScript & Tooling",
        duration: "2 weeks",
        topics: ["TypeScript Types & Interfaces", "Generics & Utility Types", "Webpack / Vite Configuration", "ESLint & Prettier Setup"],
        project: "Refactor the movie app to TypeScript with strict mode",
      },
    ],
    advanced: [
      {
        title: "Next.js & Full-Stack Frontend",
        duration: "3 weeks",
        topics: ["Next.js App Router & SSR", "Server Components & Actions", "Data Fetching Patterns", "API Routes"],
        project: "Full-stack blog with Next.js, Prisma, and PostgreSQL",
      },
      {
        title: "Testing, Performance & Deployment",
        duration: "3 weeks",
        topics: ["React Testing Library & Jest", "Cypress E2E Tests", "Core Web Vitals Optimization", "Code Splitting & Lazy Loading", "CI/CD & Vercel Deployment"],
        project: "Deploy a production-ready application with 90%+ test coverage",
      },
    ],
  },

  "Backend Development": {
    totalDuration: "20 weeks",
    beginner: [
      {
        title: "Language Fundamentals & Environment",
        duration: "3 weeks",
        topics: ["Syntax & Core Data Types", "Package Management (npm/pip)", "Async Programming Patterns", "File Systems & I/O"],
        project: "Command-line tool for file organization",
      },
      {
        title: "HTTP & REST APIs",
        duration: "3 weeks",
        topics: ["HTTP Methods & Status Codes", "RESTful API Principles", "Express.js / FastAPI Setup", "JSON Handling & Validation"],
        project: "REST API for a task manager application",
      },
    ],
    intermediate: [
      {
        title: "Databases & Persistence",
        duration: "4 weeks",
        topics: ["SQL Fundamentals & Joins", "PostgreSQL / MySQL", "ORM (Prisma / SQLAlchemy)", "Database Migrations & Indexing"],
        project: "Database-driven e-commerce backend with 10+ endpoints",
      },
      {
        title: "Authentication & Security",
        duration: "3 weeks",
        topics: ["JWT & Session-Based Auth", "OAuth2 & Social Login", "Password Hashing (bcrypt)", "CORS, CSRF & Security Headers"],
        project: "Secure auth system with role-based access control",
      },
    ],
    advanced: [
      {
        title: "Architecture & Scaling",
        duration: "4 weeks",
        topics: ["Caching (Redis)", "Microservices vs Monolith", "Docker & Containerization", "Message Queues (RabbitMQ/Kafka)"],
        project: "Real-time chat app with WebSockets and Redis pub/sub",
      },
      {
        title: "Deployment & Monitoring",
        duration: "3 weeks",
        topics: ["CI/CD Pipelines", "Logging & Error Tracking", "Cloud Deployment (AWS/GCP)", "Database Replication & Scaling"],
        project: "Auto-deployed microservice with monitoring on cloud",
      },
    ],
  },

  "Data Science": {
    totalDuration: "24 weeks",
    beginner: [
      {
        title: "Python for Data Science",
        duration: "4 weeks",
        topics: ["Python Data Types & Structures", "NumPy Arrays & Operations", "Pandas DataFrames & Series", "Jupyter Notebooks & Environments"],
        project: "Exploratory data analysis on a CSV dataset",
      },
      {
        title: "Mathematics & Statistics",
        duration: "4 weeks",
        topics: ["Probability Distributions", "Descriptive & Inferential Statistics", "Linear Algebra Essentials", "Hypothesis Testing"],
        project: "Statistical analysis report of a real-world dataset",
      },
    ],
    intermediate: [
      {
        title: "Data Visualization",
        duration: "3 weeks",
        topics: ["Matplotlib & Seaborn", "Plotly Interactive Charts", "Dashboard Design Principles", "Storytelling with Data"],
        project: "Interactive dashboard visualizing global climate data",
      },
      {
        title: "Machine Learning Foundations",
        duration: "5 weeks",
        topics: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "Scikit-learn Pipeline", "Feature Engineering & Selection"],
        project: "Predicting house prices with ensemble methods",
      },
    ],
    advanced: [
      {
        title: "Deep Learning & NLP",
        duration: "5 weeks",
        topics: ["Neural Networks & Backpropagation", "TensorFlow / PyTorch", "Text Processing & Word Embeddings", "Transformer Models & Fine-tuning"],
        project: "Sentiment analysis tool using a fine-tuned transformer model",
      },
      {
        title: "MLOps & Deployment",
        duration: "3 weeks",
        topics: ["Model Serialization & Serving", "FastAPI for ML APIs", "MLflow Experiment Tracking", "AWS SageMaker / Vertex AI"],
        project: "Deployed ML model with API endpoint and monitoring",
      },
    ],
  },
};

export function getFallbackRoadmap(skill: string) {
  // Exact match first
  if (ROADMAP_TEMPLATES[skill]) {
    return { ...ROADMAP_TEMPLATES[skill], skill, isFallback: true };
  }

  // Fuzzy match: find best matching template
  const keys = Object.keys(ROADMAP_TEMPLATES);
  const skillLower = skill.toLowerCase();

  // Check if any template key is contained in the skill or vice versa
  const match = keys.find(
    (k) =>
      skillLower.includes(k.toLowerCase()) ||
      k.toLowerCase().includes(skillLower)
  );

  if (match) {
    return { ...ROADMAP_TEMPLATES[match], skill, isFallback: true };
  }

  // Keyword matching
  const keywordMap: Record<string, string> = {
    react: "React",
    "next.js": "Next.js",
    nextjs: "Next.js",
    node: "Node.js",
    "node.js": "Node.js",
    nodejs: "Node.js",
    python: "Python",
    django: "Python",
    flask: "Python",
    fastapi: "Python",
    docker: "Docker",
    container: "Docker",
    typescript: "TypeScript",
    aws: "AWS",
    amazon: "AWS",
    cloud: "AWS",
    ml: "Machine Learning",
    "machine learning": "Machine Learning",
    "deep learning": "Machine Learning",
    ai: "Machine Learning",
    "artificial intelligence": "Machine Learning",
    "data science": "Data Science",
    pandas: "Data Science",
    numpy: "Data Science",
    "system design": "System Design",
    architecture: "System Design",
    dsa: "Data Structures & Algorithms",
    "data structures": "Data Structures & Algorithms",
    algorithms: "Data Structures & Algorithms",
    leetcode: "Data Structures & Algorithms",
    frontend: "Frontend Development",
    "front end": "Frontend Development",
    "front-end": "Frontend Development",
    backend: "Backend Development",
    "back end": "Backend Development",
    "back-end": "Backend Development",
  };

  for (const [keyword, templateKey] of Object.entries(keywordMap)) {
    if (skillLower.includes(keyword)) {
      return { ...ROADMAP_TEMPLATES[templateKey], skill, isFallback: true };
    }
  }

  // Ultimate fallback — use Frontend Development as base
  return { ...ROADMAP_TEMPLATES["Frontend Development"], skill, isFallback: true };
}
