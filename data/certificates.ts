export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  imagePath: string;
}

export const certificates: Certificate[] = [
  // Row 1
  {
    id: "dsa",
    name: "Mastering Data Structures & Algorithms using C and C++",
    issuer: "Udemy",
    date: "Dec 2025",
    imagePath: "/certificates/DSA (Udemy).pdf"
  },
  {
    id: "fullstack",
    name: "The Complete Full-Stack Web Development Bootcamp",
    issuer: "Udemy",
    date: "Nov 2025",
    imagePath: "/certificates/Full_Stack (Udemy).pdf"
  },
  {
    id: "aws",
    name: "AWS For Everyone",
    issuer: "Udemy",
    date: "Oct 2025",
    imagePath: "/certificates/AWS (Udemy).pdf"
  },
  // Row 2
  {
    id: "deep-learning",
    name: "Introduction to Deep Learning with Keras",
    issuer: "Great Learning",
    date: "Nov 2025",
    imagePath: "/certificates/Deep-Learning Certificate.pdf"
  },
  {
    id: "cns",
    name: "Introduction to the Computer Networking",
    issuer: "Great Learning",
    date: "Nov 2025",
    imagePath: "/certificates/CNS_Certificate.pdf"
  },
  {
    id: "ml",
    name: "Machine Learning Using Python",
    issuer: "Great Learning",
    date: "Nov 2025",
    imagePath: "/certificates/ML_Certificate.pdf"
  },
  // Row 3
  {
    id: "python-scaler",
    name: "Python Course for Beginners With Certification: Mastering the Essentials",
    issuer: "Scaler Topics",
    date: "Mar 2025",
    imagePath: "/certificates/Python (Scaler).png"
  },
  {
    id: "powerbi",
    name: "Power BI for Beginners",
    issuer: "Great Learning",
    date: "Nov 2025",
    imagePath: "/certificates/PowerBi_Certificate.pdf"
  },
  {
    id: "python-cert",
    name: "Data Analysis with Python",
    issuer: "freeCodeCamp",
    date: "Nov 2024",
    imagePath: "/certificates/Python Certification.pdf"
  },
  // Row 4
  {
    id: "ibm-uiux",
    name: "User Experience Design Fundamentals",
    issuer: "IBM SkillsBuild",
    date: "Apr 2026",
    imagePath: "/certificates/IBM_UIUX.pdf"
  },
  {
    id: "digital-marketing",
    name: "Fundamentals of digital marketing",
    issuer: "Google",
    date: "Oct 2025",
    imagePath: "/certificates/Fundamentals of digital marketing _ Google.pdf"
  }
];
