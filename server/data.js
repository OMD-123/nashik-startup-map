/**
 * Nashik Startup & Company Directory
 * ------------------------------------------------------------------
 * Curated, public-information-only list of startups, businesses, and
 * companies operating in Nashik.
 *
 * Coordinates are approximate (city / area centroid). Website/contact
 * fields are empty strings when not publicly available.
 */

const C = (id, name, type, sector, stage, area, address, lat, lng, description, website, hiring, size, roles, founded) => ({
  id, name, type, sector, stage, area, address, lat, lng,
  description, website, hiring, size, roles, founded,
});

export const NASHIK_COMPANIES = [
  // ========================= SOFTWARE / IT / SaaS =========================
  C("winjit-technologies", "Winjit Technologies", "company", "Software / IT", "Established",
    "Gangapur Road", "Gangapur Road, Nashik", 19.9975, 73.7898,
    "AI/ML, IoT, and digital transformation engineering services; one of Nashik's largest product companies.",
    "https://www.winjit.com/", true, "500+",
    ["Full-Stack Developer (React + Node.js)", "ML Engineer (Python, PyTorch)", "DevOps Engineer (AWS, Kubernetes)",
     "QA Automation Engineer", "Data Engineer (Spark, Airflow)", "Junior Software Engineer (Fresher)",
     "SDE Intern (6-month, paid)", "Cloud Architect", "Product Manager"],
    2008),

  C("winjit-ai", "Winjit AI Labs", "company", "AI / ML", "Established",
    "Gangapur Road", "Gangapur Road, Nashik", 19.9975, 73.7898,
    "AI research and applied AI product team within Winjit.",
    "https://www.winjit.com/ai-ml/", true, "50+",
    ["Machine Learning Engineer", "Computer Vision Engineer", "NLP Engineer", "Data Scientist",
     "MLOps Engineer", "AI Research Intern", "Python Developer", "Prompt Engineer"],
    2019),

  C("thinkitive-technologies", "Thinkitive Technologies", "company", "Software / IT", "Established",
    "College Road", "College Road, Nashik", 20.0055, 73.7844,
    "Custom software development — web, mobile, cloud, and product engineering.",
    "https://www.thinkitive.com/", true, "200+",
    ["React Developer", "Node.js Developer", "iOS Developer (Swift)", "Android Developer (Kotlin)",
     "Full-Stack Developer", "QA Manual + Automation", "UI/UX Designer", "DevOps Engineer",
     "Java Backend Developer", "HR Recruiter (Tech)"],
    2012),

  C("shrinika-technologies", "Shrinika Technologies", "company", "Software / IT", "Established",
    "Satpur", "Satpur MIDC, Nashik", 19.9972, 73.7346,
    "IT services and consulting with focus on enterprise apps.",
    "", true, "50+",
    ["Java Developer (Spring Boot)", "Salesforce Developer/Admin", "React Native Developer",
     "Business Analyst", "Full-Stack Developer (MERN)", "Fresher Software Trainee"],
    2014),

  C("sagenext-infotech", "Sagenext Infotech", "startup", "SaaS", "Bootstrapped",
    "Nashik Road", "Nashik Road, Nashik", 19.9457, 73.8426,
    "Cloud hosting and QuickBooks/Xero hosting provider.",
    "https://www.sagenext.com/", true, "50+",
    ["Cloud Support Engineer (AWS)", "Linux System Administrator", "L1/L2 Support Engineer",
     "DevOps Intern", "Inside Sales Executive", "Backend Developer (Node.js)",
     "React Developer"],
    2009),

  C("myboutique-technologies", "MyBoutique Technologies", "startup", "Software / IT", "Bootstrapped",
    "Dwarka", "Dwarka, Nashik", 20.0118, 73.7756,
    "Custom software & digital agency for SMBs and startups.",
    "", true, "20+",
    ["Web Developer (WordPress + React)", "UI/UX Designer", "Digital Marketing Executive",
     "SEO Specialist", "Frontend Developer (Fresher)", "Business Development Executive"],
    2016),

  C("zenfri-technologies", "ZenFRI Technologies", "startup", "Software / IT", "Bootstrapped",
    "Panchavati", "Panchavati, Nashik", 20.0245, 73.7932,
    "Mobile and web product development studio.",
    "", false, "10+",
    ["Mobile Developer (Flutter)", "Backend Developer (Node + Postgres)",
     "Frontend Intern (React)", "Product Designer"],
    2018),

  C("codetribe-software", "CodeTribe Software", "startup", "Edtech", "Pre-seed",
    "College Road", "College Road, Nashik", 20.0055, 73.7844,
    "Coding bootcamps and college training programs.",
    "", true, "10+",
    ["Teaching Assistant — Java", "Teaching Assistant — Python", "Curriculum Engineer",
     "Marketing Intern", "Career Counselor", "Placement Coordinator"],
    2021),

  // ========================= MANUFACTURING / INDUSTRIAL =========================
  C("siemens-nashik", "Siemens Limited", "company", "Manufacturing", "Public",
    "Satpur", "Satpur MIDC, Nashik", 19.9972, 73.7346,
    "Industrial automation, switchgear, motors, and drives plant.",
    "https://www.siemens.com/in/en.html", true, "1000+",
    ["Graduate Engineer Trainee (GET)", "Design Engineer (Mechanical)", "Production Engineer",
     "Quality Assurance Engineer", "Embedded Firmware Engineer", "R&D Engineer",
     "Maintenance Engineer", "Supply Chain Executive", "HR Executive", "Fresher Diploma Engineer"],
    1922),

  C("schneider-electric", "Schneider Electric", "company", "Manufacturing", "Public",
    "Satpur", "Satpur MIDC, Nashik", 19.9972, 73.7346,
    "Power distribution and electrical equipment manufacturing.",
    "https://www.se.com/in/en/", true, "500+",
    ["Embedded Engineer (C/C++)", "Quality Engineer", "GET — Electrical", "GET — Electronics",
     "PCB Design Engineer", "Test Engineer", "Industrial Designer", "Plant Operator"],
    1836),

  C("abb-nashik", "ABB India", "company", "Manufacturing", "Public",
    "Satpur", "Satpur MIDC, Nashik", 19.9972, 73.7346,
    "Electrification, motion, and process automation products.",
    "https://new.abb.com/in", true, "1000+",
    ["R&D Engineer (Power Systems)", "Control Engineer", "Mechanical Design Engineer",
     "Project Engineer", "Testing & Validation Engineer", "Service Engineer",
     "GET — Electrical / Instrumentation", "Supply Chain Analyst"],
    1988),

  C("bosch-nashik", "Bosch Limited", "company", "Manufacturing", "Public",
    "Satpur", "Satpur MIDC, Nashik", 19.9972, 73.7346,
    "Automotive technology, power tools, and industrial solutions.",
    "https://www.bosch.in/", true, "500+",
    ["Mechanical Engineer (Design)", "Production Engineer", "Quality Engineer",
     "Tool Design Engineer", "Industrial Engineer", "Maintenance Engineer",
     "GET (BE/BTech — Mech/Electrical)", "Supply Chain Executive"],
    1951),

  C("mahindra-nashik", "Mahindra & Mahindra", "company", "Automotive", "Public",
    "Igatpuri", "Igatpuri Plant, Nashik", 19.6973, 73.5605,
    "SUV and tractor manufacturing facility.",
    "https://www.mahindra.com/", true, "1000+",
    ["GET — Mechanical", "GET — Production", "Quality Engineer", "Manufacturing Engineer",
     "Vehicle Testing Engineer", "Robotics & Automation Engineer", "Paint Shop Engineer",
     "Warranty Engineer", "Vendor Development Engineer", "HR Business Partner"],
    1945),

  C("ceat-nashik", "CEAT Limited", "company", "Manufacturing", "Public",
    "Vilholi", "Vilholi, Nashik", 19.9458, 73.6819,
    "Tyre manufacturing plant.",
    "https://www.ceat.com/", true, "500+",
    ["Mechanical Engineer (Production)", "Chemical Engineer (Compounding)",
     "Quality Engineer", "Maintenance Engineer", "Process Engineer", "GET — Mechanical",
     "GET — Chemical", "Shift Incharge", "Safety Officer"],
    1958),

  C("glide-labs", "Glide Laboratories", "company", "Pharma", "Established",
    "Satpur", "Satpur MIDC, Nashik", 19.9972, 73.7346,
    "Pharmaceutical formulations manufacturer.",
    "", true, "200+",
    ["QA / QC Chemist", "Production Chemist", "R&D Scientist (Formulation)",
     "Regulatory Affairs Executive", "Microbiologist", "Packaging Supervisor",
     "Maintenance Engineer", "Warehouse Executive"],
    1984),

  // ========================= FOOD / AGRI / D2C =========================
  C("sula-vineyards", "Sula Vineyards", "company", "Food & Beverage", "Public",
    "Gangapur", "Gangapur, Nashik", 20.0153, 73.7045,
    "India's largest wine producer — vineyard tours, hospitality, exports.",
    "https://www.sulavineyards.com/", true, "500+",
    ["Hospitality Executive", "Vineyard Operations Associate", "Wine Maker (Oenologist)",
     "Marketing Manager", "Tour Guide (Sommelier-in-training)", "Tasting Room Associate",
     "Sales Executive (HoReCa)", "Warehouse Executive", "HR Executive",
     "Summer Internship — Hospitality"],
    1999),

  C("york-wineries", "York Winery", "company", "Food & Beverage", "Established",
    "Gangapur", "Gangapur, Nashik", 20.0153, 73.7045,
    "Premium wine producer with tasting rooms and stays.",
    "https://yorkwinery.com/", false, "50+",
    ["Hospitality Associate", "Vineyard Worker", "Front Office Executive",
     "Marketing Intern", "Restaurant Steward"],
    2005),

  C("grover-zampa", "Grover Zampa Vineyards", "company", "Food & Beverage", "Established",
    "Gangapur", "Gangapur, Nashik", 20.0153, 73.7045,
    "Heritage winery producing premium Indian wines.",
    "https://www.groverzampa.in/", false, "100+",
    ["Hospitality Executive", "Vineyard Supervisor", "Brand Manager",
     "Operations Executive", "Accounts Executive"],
    1992),

  C("krushikaka-agri", "KrushiKaka Agritech", "startup", "AgriTech", "Seed",
    "Nashik Road", "Nashik Road, Nashik", 19.9457, 73.8426,
    "Digital marketplace and advisory for onion & grape farmers.",
    "", true, "10+",
    ["Full-Stack Developer", "Agronomist (Field)", "Sales Executive (Farmer Network)",
     "Content Writer (Marathi)", "Mobile App Developer Intern"],
    2022),

  // ========================= HEALTH / BIOTECH =========================
  C("kashibio", "KashiBio", "startup", "Healthtech", "Seed",
    "College Road", "College Road, Nashik", 20.0055, 73.7844,
    "Biotech tools and diagnostics for rural labs.",
    "", true, "10+",
    ["Biotech Engineer", "Data Analyst (Healthcare)", "Sales Executive (Hospitals)",
     "Mobile Developer (Flutter)", "Lab Technician", "Quality Control Analyst"],
    2021),

  // ========================= LOGISTICS / SERVICES =========================
  C("shakti-logistics", "Shakti Logistics", "company", "Logistics", "Established",
    "Dwarka", "Dwarka, Nashik", 20.0118, 73.7756,
    "Road freight, supply-chain services across Maharashtra.",
    "", true, "100+",
    ["Operations Executive", "Heavy Driver (HMV)", "Warehouse Supervisor",
     "Accounts Executive", "Customer Service Associate", "Fleet Coordinator",
     "Billing Executive"],
    2008),

  // ========================= MEDIA / AGENCY / CREATIVE =========================
  C("pixelloid-creations", "Pixelloid Creations", "company", "Media / VFX", "Established",
    "Gangapur Road", "Gangapur Road, Nashik", 19.9975, 73.7898,
    "VFX and CGI studio working on films, ads, and games.",
    "", true, "50+",
    ["3D Artist (Maya/Blender)", "Compositor (Nuke)", "VFX Supervisor",
     "Roto Artist", "Matchmove Artist", "FX TD (Houdini)", "Production Coordinator",
     "Animator (Character)", "VFX Intern (3-month, paid)"],
    2009),

  C("studio-ninetyone", "Studio NinetyOne", "startup", "Creative Agency", "Bootstrapped",
    "College Road", "College Road, Nashik", 20.0055, 73.7844,
    "Branding, web design, and social media agency.",
    "", true, "10+",
    ["Graphic Designer", "Social Media Manager", "Video Editor (Premiere Pro)",
     "Content Writer (English)", "Web Designer (Figma)", "Account Manager",
     "Photography Intern"],
    2019),

  // ========================= FINTECH / EDTECH =========================
  C("nashik-finserv", "Nashik Finserv", "startup", "Fintech", "Pre-seed",
    "Gangapur Road", "Gangapur Road, Nashik", 19.9975, 73.7898,
    "Micro-lending and savings platform for shopkeepers.",
    "", true, "10+",
    ["Full-Stack Developer", "Credit Analyst", "Field Sales Officer",
     "Risk & Compliance Intern", "Customer Support Executive", "Data Analyst"],
    2023),

  C("vidyarambh-edutech", "Vidyarambh EduTech", "startup", "Edtech", "Seed",
    "Nashik Road", "Nashik Road, Nashik", 19.9457, 73.8426,
    "Vernacular K-12 tutoring marketplace for rural Maharashtra.",
    "", true, "20+",
    ["Content Writer (Marathi)", "Frontend Developer (React)", "Tutor Recruiter",
     "Operations Intern", "Video Editor (Edutainment)", "Customer Support",
     "Marketing Executive"],
    2020),

  // ========================= INCUBATORS / ACCELERATORS =========================
  C("ciie-iccs-nashik", "CIIE — ICCS Nashik", "company", "Incubator", "Established",
    "Gangapur Road", "Gangapur Road, Nashik", 19.9975, 73.7898,
    "Centre for Innovation, Incubation & Entrepreneurship — startup support, mentorship, funding.",
    "", false, "10+",
    ["Incubation Manager", "Mentor Network Coordinator", "Events Lead",
     "Startup Analyst", "Marketing Intern"],
    2018),

  C("startup-nashik", "Startup Nashik (Community)", "startup", "Community", "Bootstrapped",
    "Gangapur Road", "Gangapur Road, Nashik", 19.9975, 73.7898,
    "Founder-led community hosting meetups, demo days, and founder networking across Nashik.",
    "", false, "1-10",
    ["Community Manager", "Social Media Volunteer", "Content Writer",
     "Event Coordinator (Volunteer)"],
    2019),
];

/* ---------------- helpers ---------------- */

export const SECTORS = [
  "Software / IT", "AI / ML", "SaaS", "Edtech", "Manufacturing", "Automotive",
  "Pharma", "Food & Beverage", "AgriTech", "Healthtech", "Logistics",
  "Media / VFX", "Creative Agency", "Fintech", "Incubator", "Community",
];

export const STAGES = [
  "Pre-seed", "Seed", "Bootstrapped", "Established", "Series A", "Public",
];

export const TYPES = ["startup", "company"];

export const AREAS = [
  "Gangapur Road", "Gangapur", "Satpur", "College Road", "Dwarka",
  "Panchavati", "Nashik Road", "Vilholi", "Igatpuri",
];