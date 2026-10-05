export type Subject = {
  id: string;
  name: string;
  code: string;
};

export type Branch = {
  name: string;
  semesters: Record<string, Subject[]>;
};

/*
  StudyPlanner Subject Catalog

  Structure:
  Branch
    -> Semester
      -> Subjects

  Important:
  This is an editable academic catalog.
  University curricula can change by academic year.
*/

export const subjectCatalog: Branch[] = [
  {
    name: "Information Technology",

    semesters: {
      "Semester 1": [
        { id: "it-s1-1", name: "Engineering Mathematics I", code: "EM-I" },
        { id: "it-s1-2", name: "Engineering Physics", code: "PHY" },
        { id: "it-s1-3", name: "Engineering Chemistry", code: "CHEM" },
        { id: "it-s1-4", name: "Engineering Graphics", code: "EG" },
        { id: "it-s1-5", name: "Basic Electrical Engineering", code: "BEE" },
        { id: "it-s1-6", name: "Programming Fundamentals", code: "PF" },
      ],

      "Semester 2": [
        { id: "it-s2-1", name: "Engineering Mathematics II", code: "EM-II" },
        { id: "it-s2-2", name: "Engineering Mechanics", code: "EM" },
        { id: "it-s2-3", name: "Basic Electronics Engineering", code: "BEE" },
        { id: "it-s2-4", name: "Communication Skills", code: "CS" },
        { id: "it-s2-5", name: "Data Structures", code: "DS" },
        { id: "it-s2-6", name: "Object Oriented Programming", code: "OOP" },
      ],

      "Semester 3": [
        { id: "it-s3-1", name: "Engineering Mathematics III", code: "EM-III" },
        { id: "it-s3-2", name: "Data Structures", code: "DS" },
        { id: "it-s3-3", name: "Database Management Systems", code: "DBMS" },
        { id: "it-s3-4", name: "Computer Organization and Architecture", code: "COA" },
        { id: "it-s3-5", name: "Discrete Mathematics", code: "DM" },
        { id: "it-s3-6", name: "Object Oriented Programming", code: "OOP" },
      ],

      "Semester 4": [
        { id: "it-s4-1", name: "Engineering Mathematics IV", code: "EM-IV" },
        { id: "it-s4-2", name: "Operating Systems", code: "OS" },
        { id: "it-s4-3", name: "Computer Networks", code: "CN" },
        { id: "it-s4-4", name: "Web Programming", code: "WP" },
        { id: "it-s4-5", name: "Software Engineering", code: "SE" },
        { id: "it-s4-6", name: "Analysis of Algorithms", code: "AOA" },
      ],

      "Semester 5": [
        { id: "it-s5-1", name: "Advanced Data Structures", code: "ADS" },
        { id: "it-s5-2", name: "Computer Network Security", code: "CNS" },
        { id: "it-s5-3", name: "Software Engineering", code: "SE" },
        { id: "it-s5-4", name: "Web Application Development", code: "WAD" },
        { id: "it-s5-5", name: "Data Mining and Business Intelligence", code: "DMBI" },
        { id: "it-s5-6", name: "Artificial Intelligence", code: "AI" },
      ],

      "Semester 6": [
        { id: "it-s6-1", name: "Machine Learning", code: "ML" },
        { id: "it-s6-2", name: "Cloud Computing", code: "CC" },
        { id: "it-s6-3", name: "Big Data Analytics", code: "BDA" },
        { id: "it-s6-4", name: "Information and Cyber Security", code: "ICS" },
        { id: "it-s6-5", name: "Internet of Things", code: "IOT" },
        { id: "it-s6-6", name: "Mobile Application Development", code: "MAD" },
      ],

      "Semester 7": [
        { id: "it-s7-1", name: "Artificial Intelligence", code: "AI" },
        { id: "it-s7-2", name: "Machine Learning", code: "ML" },
        { id: "it-s7-3", name: "Cloud Computing", code: "CC" },
        { id: "it-s7-4", name: "Information and Cyber Security", code: "ICS" },
        { id: "it-s7-5", name: "Big Data Analytics", code: "BDA" },
        { id: "it-s7-6", name: "Major Project Phase I", code: "MP-I" },
      ],

      "Semester 8": [
        { id: "it-s8-1", name: "Internet of Things", code: "IOT" },
        { id: "it-s8-2", name: "Mobile Application Development", code: "MAD" },
        { id: "it-s8-3", name: "Natural Language Processing", code: "NLP" },
        { id: "it-s8-4", name: "Blockchain Technology", code: "BT" },
        { id: "it-s8-5", name: "Professional Elective", code: "PE" },
        { id: "it-s8-6", name: "Major Project Phase II", code: "MP-II" },
      ],
    },
  },

  {
    name: "Computer Science",

    semesters: {
      "Semester 1": [
        { id: "cs-s1-1", name: "Engineering Mathematics I", code: "EM-I" },
        { id: "cs-s1-2", name: "Engineering Physics", code: "PHY" },
        { id: "cs-s1-3", name: "Engineering Chemistry", code: "CHEM" },
        { id: "cs-s1-4", name: "Engineering Graphics", code: "EG" },
        { id: "cs-s1-5", name: "Basic Electrical Engineering", code: "BEE" },
        { id: "cs-s1-6", name: "Programming Fundamentals", code: "PF" },
      ],

      "Semester 2": [
        { id: "cs-s2-1", name: "Engineering Mathematics II", code: "EM-II" },
        { id: "cs-s2-2", name: "Engineering Mechanics", code: "EM" },
        { id: "cs-s2-3", name: "Basic Electronics Engineering", code: "BEE" },
        { id: "cs-s2-4", name: "Communication Skills", code: "CS" },
        { id: "cs-s2-5", name: "Data Structures", code: "DS" },
        { id: "cs-s2-6", name: "Object Oriented Programming", code: "OOP" },
      ],

      "Semester 3": [
        { id: "cs-s3-1", name: "Data Structures", code: "DS" },
        { id: "cs-s3-2", name: "Database Management Systems", code: "DBMS" },
        { id: "cs-s3-3", name: "Computer Organization", code: "CO" },
        { id: "cs-s3-4", name: "Discrete Mathematics", code: "DM" },
        { id: "cs-s3-5", name: "Object Oriented Programming", code: "OOP" },
        { id: "cs-s3-6", name: "Digital Logic Design", code: "DLD" },
      ],

      "Semester 4": [
        { id: "cs-s4-1", name: "Operating Systems", code: "OS" },
        { id: "cs-s4-2", name: "Computer Networks", code: "CN" },
        { id: "cs-s4-3", name: "Analysis of Algorithms", code: "AOA" },
        { id: "cs-s4-4", name: "Software Engineering", code: "SE" },
        { id: "cs-s4-5", name: "Web Programming", code: "WP" },
        { id: "cs-s4-6", name: "Theory of Computation", code: "TOC" },
      ],

      "Semester 5": [
        { id: "cs-s5-1", name: "Artificial Intelligence", code: "AI" },
        { id: "cs-s5-2", name: "Machine Learning", code: "ML" },
        { id: "cs-s5-3", name: "Compiler Design", code: "CD" },
        { id: "cs-s5-4", name: "Computer Graphics", code: "CG" },
        { id: "cs-s5-5", name: "Advanced Database Systems", code: "ADBMS" },
        { id: "cs-s5-6", name: "Information Security", code: "IS" },
      ],

      "Semester 6": [
        { id: "cs-s6-1", name: "Cloud Computing", code: "CC" },
        { id: "cs-s6-2", name: "Big Data Analytics", code: "BDA" },
        { id: "cs-s6-3", name: "Distributed Systems", code: "DS" },
        { id: "cs-s6-4", name: "Cyber Security", code: "CY" },
        { id: "cs-s6-5", name: "Natural Language Processing", code: "NLP" },
        { id: "cs-s6-6", name: "Mobile Application Development", code: "MAD" },
      ],

      "Semester 7": [
        { id: "cs-s7-1", name: "Deep Learning", code: "DL" },
        { id: "cs-s7-2", name: "Blockchain Technology", code: "BT" },
        { id: "cs-s7-3", name: "Cloud Security", code: "CS" },
        { id: "cs-s7-4", name: "Advanced Machine Learning", code: "AML" },
        { id: "cs-s7-5", name: "Professional Elective", code: "PE" },
        { id: "cs-s7-6", name: "Major Project Phase I", code: "MP-I" },
      ],

      "Semester 8": [
        { id: "cs-s8-1", name: "Advanced AI", code: "AAI" },
        { id: "cs-s8-2", name: "Generative AI", code: "GENAI" },
        { id: "cs-s8-3", name: "Cyber Security", code: "CY" },
        { id: "cs-s8-4", name: "Professional Elective", code: "PE" },
        { id: "cs-s8-5", name: "Project Management", code: "PM" },
        { id: "cs-s8-6", name: "Major Project Phase II", code: "MP-II" },
      ],
    },
  },

  {
    name: "Artificial Intelligence & Data Science",

    semesters: {
      "Semester 1": [
        { id: "aids-s1-1", name: "Engineering Mathematics I", code: "EM-I" },
        { id: "aids-s1-2", name: "Engineering Physics", code: "PHY" },
        { id: "aids-s1-3", name: "Engineering Chemistry", code: "CHEM" },
        { id: "aids-s1-4", name: "Engineering Graphics", code: "EG" },
        { id: "aids-s1-5", name: "Programming Fundamentals", code: "PF" },
        { id: "aids-s1-6", name: "Basic Electrical Engineering", code: "BEE" },
      ],

      "Semester 2": [
        { id: "aids-s2-1", name: "Engineering Mathematics II", code: "EM-II" },
        { id: "aids-s2-2", name: "Data Structures", code: "DS" },
        { id: "aids-s2-3", name: "Object Oriented Programming", code: "OOP" },
        { id: "aids-s2-4", name: "Database Fundamentals", code: "DB" },
        { id: "aids-s2-5", name: "Statistics", code: "STAT" },
        { id: "aids-s2-6", name: "Communication Skills", code: "CS" },
      ],

      "Semester 3": [
        { id: "aids-s3-1", name: "Probability and Statistics", code: "PS" },
        { id: "aids-s3-2", name: "Data Structures", code: "DS" },
        { id: "aids-s3-3", name: "Database Management Systems", code: "DBMS" },
        { id: "aids-s3-4", name: "Python Programming", code: "PY" },
        { id: "aids-s3-5", name: "Data Visualization", code: "DV" },
        { id: "aids-s3-6", name: "Discrete Mathematics", code: "DM" },
      ],

      "Semester 4": [
        { id: "aids-s4-1", name: "Machine Learning Fundamentals", code: "ML" },
        { id: "aids-s4-2", name: "Operating Systems", code: "OS" },
        { id: "aids-s4-3", name: "Computer Networks", code: "CN" },
        { id: "aids-s4-4", name: "Data Mining", code: "DM" },
        { id: "aids-s4-5", name: "Software Engineering", code: "SE" },
        { id: "aids-s4-6", name: "Artificial Intelligence", code: "AI" },
      ],

      "Semester 5": [
        { id: "aids-s5-1", name: "Machine Learning", code: "ML" },
        { id: "aids-s5-2", name: "Deep Learning", code: "DL" },
        { id: "aids-s5-3", name: "Big Data Analytics", code: "BDA" },
        { id: "aids-s5-4", name: "Natural Language Processing", code: "NLP" },
        { id: "aids-s5-5", name: "Computer Vision", code: "CV" },
        { id: "aids-s5-6", name: "Data Engineering", code: "DE" },
      ],

      "Semester 6": [
        { id: "aids-s6-1", name: "Advanced Machine Learning", code: "AML" },
        { id: "aids-s6-2", name: "Generative AI", code: "GENAI" },
        { id: "aids-s6-3", name: "Cloud Computing", code: "CC" },
        { id: "aids-s6-4", name: "Data Mining and Warehousing", code: "DMW" },
        { id: "aids-s6-5", name: "Natural Language Processing", code: "NLP" },
        { id: "aids-s6-6", name: "AI Ethics", code: "AIE" },
      ],

      "Semester 7": [
        { id: "aids-s7-1", name: "Advanced Deep Learning", code: "ADL" },
        { id: "aids-s7-2", name: "Generative AI", code: "GENAI" },
        { id: "aids-s7-3", name: "Reinforcement Learning", code: "RL" },
        { id: "aids-s7-4", name: "Big Data Engineering", code: "BDE" },
        { id: "aids-s7-5", name: "Professional Elective", code: "PE" },
        { id: "aids-s7-6", name: "Major Project Phase I", code: "MP-I" },
      ],

      "Semester 8": [
        { id: "aids-s8-1", name: "Advanced Generative AI", code: "AGAI" },
        { id: "aids-s8-2", name: "AI in Industry", code: "AII" },
        { id: "aids-s8-3", name: "Data Science Applications", code: "DSA" },
        { id: "aids-s8-4", name: "Professional Elective", code: "PE" },
        { id: "aids-s8-5", name: "Project Management", code: "PM" },
        { id: "aids-s8-6", name: "Major Project Phase II", code: "MP-II" },
      ],
    },
  },

  {
    name: "Electronics & Computer",

    semesters: {
      "Semester 1": [
        { id: "ecs-s1-1", name: "Engineering Mathematics I", code: "EM-I" },
        { id: "ecs-s1-2", name: "Engineering Physics", code: "PHY" },
        { id: "ecs-s1-3", name: "Engineering Chemistry", code: "CHEM" },
        { id: "ecs-s1-4", name: "Engineering Graphics", code: "EG" },
        { id: "ecs-s1-5", name: "Basic Electrical Engineering", code: "BEE" },
        { id: "ecs-s1-6", name: "Programming Fundamentals", code: "PF" },
      ],

      "Semester 2": [
        { id: "ecs-s2-1", name: "Engineering Mathematics II", code: "EM-II" },
        { id: "ecs-s2-2", name: "Basic Electronics", code: "BE" },
        { id: "ecs-s2-3", name: "Data Structures", code: "DS" },
        { id: "ecs-s2-4", name: "Object Oriented Programming", code: "OOP" },
        { id: "ecs-s2-5", name: "Digital Logic", code: "DL" },
        { id: "ecs-s2-6", name: "Communication Skills", code: "CS" },
      ],

      "Semester 3": [
        { id: "ecs-s3-1", name: "Digital Electronics", code: "DE" },
        { id: "ecs-s3-2", name: "Data Structures", code: "DS" },
        { id: "ecs-s3-3", name: "Database Management Systems", code: "DBMS" },
        { id: "ecs-s3-4", name: "Computer Organization", code: "CO" },
        { id: "ecs-s3-5", name: "Electronic Devices", code: "ED" },
        { id: "ecs-s3-6", name: "Discrete Mathematics", code: "DM" },
      ],

      "Semester 4": [
        { id: "ecs-s4-1", name: "Microprocessors", code: "MP" },
        { id: "ecs-s4-2", name: "Operating Systems", code: "OS" },
        { id: "ecs-s4-3", name: "Computer Networks", code: "CN" },
        { id: "ecs-s4-4", name: "Web Programming", code: "WP" },
        { id: "ecs-s4-5", name: "Software Engineering", code: "SE" },
        { id: "ecs-s4-6", name: "Signals and Systems", code: "SS" },
      ],

      "Semester 5": [
        { id: "ecs-s5-1", name: "Embedded Systems", code: "ES" },
        { id: "ecs-s5-2", name: "Computer Architecture", code: "CA" },
        { id: "ecs-s5-3", name: "Internet of Things", code: "IOT" },
        { id: "ecs-s5-4", name: "Artificial Intelligence", code: "AI" },
        { id: "ecs-s5-5", name: "Digital Signal Processing", code: "DSP" },
        { id: "ecs-s5-6", name: "Communication Systems", code: "CS" },
      ],

      "Semester 6": [
        { id: "ecs-s6-1", name: "Advanced Embedded Systems", code: "AES" },
        { id: "ecs-s6-2", name: "Machine Learning", code: "ML" },
        { id: "ecs-s6-3", name: "Robotics", code: "ROB" },
        { id: "ecs-s6-4", name: "Cloud Computing", code: "CC" },
        { id: "ecs-s6-5", name: "Cyber Security", code: "CY" },
        { id: "ecs-s6-6", name: "IoT Applications", code: "IOTA" },
      ],

      "Semester 7": [
        { id: "ecs-s7-1", name: "Advanced IoT", code: "AIOT" },
        { id: "ecs-s7-2", name: "Robotics and Automation", code: "RA" },
        { id: "ecs-s7-3", name: "Edge Computing", code: "EC" },
        { id: "ecs-s7-4", name: "Embedded AI", code: "EAI" },
        { id: "ecs-s7-5", name: "Professional Elective", code: "PE" },
        { id: "ecs-s7-6", name: "Major Project Phase I", code: "MP-I" },
      ],

      "Semester 8": [
        { id: "ecs-s8-1", name: "Advanced Robotics", code: "AR" },
        { id: "ecs-s8-2", name: "Industrial IoT", code: "IIOT" },
        { id: "ecs-s8-3", name: "Edge AI", code: "EAI" },
        { id: "ecs-s8-4", name: "Professional Elective", code: "PE" },
        { id: "ecs-s8-5", name: "Project Management", code: "PM" },
        { id: "ecs-s8-6", name: "Major Project Phase II", code: "MP-II" },
      ],
    },
  },

  {
    name: "Mechanical Engineering",

    semesters: {
      "Semester 1": [
        { id: "me-s1-1", name: "Engineering Mathematics I", code: "EM-I" },
        { id: "me-s1-2", name: "Engineering Physics", code: "PHY" },
        { id: "me-s1-3", name: "Engineering Chemistry", code: "CHEM" },
        { id: "me-s1-4", name: "Engineering Graphics", code: "EG" },
        { id: "me-s1-5", name: "Basic Electrical Engineering", code: "BEE" },
        { id: "me-s1-6", name: "Engineering Mechanics", code: "EM" },
      ],

      "Semester 2": [
        { id: "me-s2-1", name: "Engineering Mathematics II", code: "EM-II" },
        { id: "me-s2-2", name: "Thermodynamics", code: "THERMO" },
        { id: "me-s2-3", name: "Engineering Materials", code: "MAT" },
        { id: "me-s2-4", name: "Manufacturing Processes", code: "MP" },
        { id: "me-s2-5", name: "Programming Fundamentals", code: "PF" },
        { id: "me-s2-6", name: "Communication Skills", code: "CS" },
      ],

      "Semester 3": [
        { id: "me-s3-1", name: "Engineering Mathematics III", code: "EM-III" },
        { id: "me-s3-2", name: "Strength of Materials", code: "SOM" },
        { id: "me-s3-3", name: "Thermodynamics", code: "THERMO" },
        { id: "me-s3-4", name: "Manufacturing Technology", code: "MT" },
        { id: "me-s3-5", name: "Fluid Mechanics", code: "FM" },
        { id: "me-s3-6", name: "Machine Drawing", code: "MD" },
      ],

      "Semester 4": [
        { id: "me-s4-1", name: "Engineering Mathematics IV", code: "EM-IV" },
        { id: "me-s4-2", name: "Theory of Machines", code: "TOM" },
        { id: "me-s4-3", name: "Heat Transfer", code: "HT" },
        { id: "me-s4-4", name: "Machine Design", code: "MD" },
        { id: "me-s4-5", name: "Metrology", code: "MET" },
        { id: "me-s4-6", name: "Production Engineering", code: "PE" },
      ],

      "Semester 5": [
        { id: "me-s5-1", name: "Dynamics of Machinery", code: "DOM" },
        { id: "me-s5-2", name: "Internal Combustion Engines", code: "ICE" },
        { id: "me-s5-3", name: "CAD/CAM", code: "CAD" },
        { id: "me-s5-4", name: "Industrial Engineering", code: "IE" },
        { id: "me-s5-5", name: "Refrigeration and Air Conditioning", code: "RAC" },
        { id: "me-s5-6", name: "Mechanical Vibrations", code: "MV" },
      ],

      "Semester 6": [
        { id: "me-s6-1", name: "Robotics", code: "ROB" },
        { id: "me-s6-2", name: "Finite Element Analysis", code: "FEA" },
        { id: "me-s6-3", name: "Automobile Engineering", code: "AUTO" },
        { id: "me-s6-4", name: "Mechatronics", code: "MECH" },
        { id: "me-s6-5", name: "Operations Research", code: "OR" },
        { id: "me-s6-6", name: "Renewable Energy", code: "RE" },
      ],

      "Semester 7": [
        { id: "me-s7-1", name: "Advanced Machine Design", code: "AMD" },
        { id: "me-s7-2", name: "Industrial Automation", code: "IA" },
        { id: "me-s7-3", name: "Advanced Manufacturing", code: "AM" },
        { id: "me-s7-4", name: "Robotics", code: "ROB" },
        { id: "me-s7-5", name: "Professional Elective", code: "PE" },
        { id: "me-s7-6", name: "Major Project Phase I", code: "MP-I" },
      ],

      "Semester 8": [
        { id: "me-s8-1", name: "Advanced Robotics", code: "AR" },
        { id: "me-s8-2", name: "Smart Manufacturing", code: "SM" },
        { id: "me-s8-3", name: "Industrial IoT", code: "IIOT" },
        { id: "me-s8-4", name: "Professional Elective", code: "PE" },
        { id: "me-s8-5", name: "Project Management", code: "PM" },
        { id: "me-s8-6", name: "Major Project Phase II", code: "MP-II" },
      ],
    },
  },

  {
    name: "Civil Engineering",

    semesters: {
      "Semester 1": [
        { id: "ce-s1-1", name: "Engineering Mathematics I", code: "EM-I" },
        { id: "ce-s1-2", name: "Engineering Physics", code: "PHY" },
        { id: "ce-s1-3", name: "Engineering Chemistry", code: "CHEM" },
        { id: "ce-s1-4", name: "Engineering Graphics", code: "EG" },
        { id: "ce-s1-5", name: "Engineering Mechanics", code: "EM" },
        { id: "ce-s1-6", name: "Basic Electrical Engineering", code: "BEE" },
      ],

      "Semester 2": [
        { id: "ce-s2-1", name: "Engineering Mathematics II", code: "EM-II" },
        { id: "ce-s2-2", name: "Surveying", code: "SUR" },
        { id: "ce-s2-3", name: "Building Materials", code: "BM" },
        { id: "ce-s2-4", name: "Engineering Geology", code: "GEO" },
        { id: "ce-s2-5", name: "Programming Fundamentals", code: "PF" },
        { id: "ce-s2-6", name: "Communication Skills", code: "CS" },
      ],

      "Semester 3": [
        { id: "ce-s3-1", name: "Engineering Mathematics III", code: "EM-III" },
        { id: "ce-s3-2", name: "Strength of Materials", code: "SOM" },
        { id: "ce-s3-3", name: "Fluid Mechanics", code: "FM" },
        { id: "ce-s3-4", name: "Surveying", code: "SUR" },
        { id: "ce-s3-5", name: "Building Construction", code: "BC" },
        { id: "ce-s3-6", name: "Engineering Geology", code: "GEO" },
      ],

      "Semester 4": [
        { id: "ce-s4-1", name: "Engineering Mathematics IV", code: "EM-IV" },
        { id: "ce-s4-2", name: "Structural Analysis", code: "SA" },
        { id: "ce-s4-3", name: "Geotechnical Engineering", code: "GE" },
        { id: "ce-s4-4", name: "Hydraulics", code: "HYD" },
        { id: "ce-s4-5", name: "Concrete Technology", code: "CT" },
        { id: "ce-s4-6", name: "Transportation Engineering", code: "TE" },
      ],

      "Semester 5": [
        { id: "ce-s5-1", name: "Structural Design", code: "SD" },
        { id: "ce-s5-2", name: "Environmental Engineering", code: "EE" },
        { id: "ce-s5-3", name: "Foundation Engineering", code: "FE" },
        { id: "ce-s5-4", name: "Transportation Engineering", code: "TE" },
        { id: "ce-s5-5", name: "Construction Management", code: "CM" },
        { id: "ce-s5-6", name: "Hydrology", code: "HYDRO" },
      ],

      "Semester 6": [
        { id: "ce-s6-1", name: "Advanced Structural Design", code: "ASD" },
        { id: "ce-s6-2", name: "Advanced Geotechnical Engineering", code: "AGE" },
        { id: "ce-s6-3", name: "Environmental Engineering", code: "ENV" },
        { id: "ce-s6-4", name: "Water Resources Engineering", code: "WRE" },
        { id: "ce-s6-5", name: "Quantity Surveying", code: "QS" },
        { id: "ce-s6-6", name: "Construction Technology", code: "CT" },
      ],

      "Semester 7": [
        { id: "ce-s7-1", name: "Advanced Structural Engineering", code: "ASE" },
        { id: "ce-s7-2", name: "Smart Infrastructure", code: "SI" },
        { id: "ce-s7-3", name: "Advanced Construction Management", code: "ACM" },
        { id: "ce-s7-4", name: "Environmental Management", code: "EM" },
        { id: "ce-s7-5", name: "Professional Elective", code: "PE" },
        { id: "ce-s7-6", name: "Major Project Phase I", code: "MP-I" },
      ],

      "Semester 8": [
        { id: "ce-s8-1", name: "Advanced Construction Technology", code: "ACT" },
        { id: "ce-s8-2", name: "Smart Cities", code: "SC" },
        { id: "ce-s8-3", name: "Infrastructure Management", code: "IM" },
        { id: "ce-s8-4", name: "Professional Elective", code: "PE" },
        { id: "ce-s8-5", name: "Project Management", code: "PM" },
        { id: "ce-s8-6", name: "Major Project Phase II", code: "MP-II" },
      ],
    },
  },

  {
    name: "Electrical Engineering",

    semesters: {
      "Semester 1": [
        { id: "ee-s1-1", name: "Engineering Mathematics I", code: "EM-I" },
        { id: "ee-s1-2", name: "Engineering Physics", code: "PHY" },
        { id: "ee-s1-3", name: "Engineering Chemistry", code: "CHEM" },
        { id: "ee-s1-4", name: "Engineering Graphics", code: "EG" },
        { id: "ee-s1-5", name: "Basic Electrical Engineering", code: "BEE" },
        { id: "ee-s1-6", name: "Engineering Mechanics", code: "EM" },
      ],

      "Semester 2": [
        { id: "ee-s2-1", name: "Engineering Mathematics II", code: "EM-II" },
        { id: "ee-s2-2", name: "Circuit Theory", code: "CT" },
        { id: "ee-s2-3", name: "Electronic Devices", code: "ED" },
        { id: "ee-s2-4", name: "Programming Fundamentals", code: "PF" },
        { id: "ee-s2-5", name: "Digital Logic", code: "DL" },
        { id: "ee-s2-6", name: "Communication Skills", code: "CS" },
      ],

      "Semester 3": [
        { id: "ee-s3-1", name: "Engineering Mathematics III", code: "EM-III" },
        { id: "ee-s3-2", name: "Electrical Machines I", code: "EM-I" },
        { id: "ee-s3-3", name: "Power Systems I", code: "PS-I" },
        { id: "ee-s3-4", name: "Network Theory", code: "NT" },
        { id: "ee-s3-5", name: "Electronic Devices", code: "ED" },
        { id: "ee-s3-6", name: "Electrical Measurements", code: "MEAS" },
      ],

      "Semester 4": [
        { id: "ee-s4-1", name: "Engineering Mathematics IV", code: "EM-IV" },
        { id: "ee-s4-2", name: "Electrical Machines II", code: "EM-II" },
        { id: "ee-s4-3", name: "Power Systems II", code: "PS-II" },
        { id: "ee-s4-4", name: "Power Electronics", code: "PE" },
        { id: "ee-s4-5", name: "Control Systems", code: "CS" },
        { id: "ee-s4-6", name: "Microprocessors", code: "MP" },
      ],

      "Semester 5": [
        { id: "ee-s5-1", name: "Power System Analysis", code: "PSA" },
        { id: "ee-s5-2", name: "Electrical Machines III", code: "EM-III" },
        { id: "ee-s5-3", name: "Power Electronics", code: "PE" },
        { id: "ee-s5-4", name: "Digital Signal Processing", code: "DSP" },
        { id: "ee-s5-5", name: "Electrical Drives", code: "ED" },
        { id: "ee-s5-6", name: "High Voltage Engineering", code: "HVE" },
      ],

      "Semester 6": [
        { id: "ee-s6-1", name: "Renewable Energy Systems", code: "RES" },
        { id: "ee-s6-2", name: "Smart Grid", code: "SG" },
        { id: "ee-s6-3", name: "Power System Protection", code: "PSP" },
        { id: "ee-s6-4", name: "Electric Drives", code: "ED" },
        { id: "ee-s6-5", name: "Control Engineering", code: "CE" },
        { id: "ee-s6-6", name: "Electrical Design", code: "EDES" },
      ],

      "Semester 7": [
        { id: "ee-s7-1", name: "Advanced Power Systems", code: "APS" },
        { id: "ee-s7-2", name: "Smart Grid Technologies", code: "SGT" },
        { id: "ee-s7-3", name: "Renewable Energy", code: "RE" },
        { id: "ee-s7-4", name: "Power Quality", code: "PQ" },
        { id: "ee-s7-5", name: "Professional Elective", code: "PE" },
        { id: "ee-s7-6", name: "Major Project Phase I", code: "MP-I" },
      ],

      "Semester 8": [
        { id: "ee-s8-1", name: "Electric Vehicle Technology", code: "EV" },
        { id: "ee-s8-2", name: "Advanced Control Systems", code: "ACS" },
        { id: "ee-s8-3", name: "Energy Management", code: "EM" },
        { id: "ee-s8-4", name: "Professional Elective", code: "PE" },
        { id: "ee-s8-5", name: "Project Management", code: "PM" },
        { id: "ee-s8-6", name: "Major Project Phase II", code: "MP-II" },
      ],
    },
  },
];

export function getBranches() {
  return subjectCatalog.map((branch) => branch.name);
}

export function getSubjects(
  branchName: string,
  semester: string
): Subject[] {
  const branch = subjectCatalog.find(
    (item) => item.name === branchName
  );

  if (!branch) return [];

  return branch.semesters[semester] || [];
}