/**
 * IMPACTHUB - LOCALSTORAGE DATA MANAGEMENT SERVICE
 * Handles client-side persistent state for demonstration purposes.
 */

const StorageService = (() => {
  const KEYS = CONFIG.STORAGE_KEYS;

  // Initial Sample Demonstration Dataset
  const INITIAL_DATA = {
    students: [
      {
        id: 'stu_1',
        regNumber: 'STU2024001',
        name: 'Elena Vance',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        email: 'elena.vance@campus.edu',
        phone: '+1 (555) 234-5678',
        interests: 'Full-stack Web Dev, Cloud Architecture, Technical Interview Prep',
        bio: 'Passionate about building scalable web tools and seeking guidance for senior capstone and internship readiness.',
        status: 'Active',
        registeredAt: '2026-09-01T10:00:00.000Z',
        completedResources: ['res_1', 'res_2', 'res_4'],
        enrolledActivities: ['act_1', 'act_3']
      },
      {
        id: 'stu_2',
        regNumber: 'STU2024002',
        name: 'Marcus Thorne',
        department: 'Mechanical Engineering',
        year: '2nd Year',
        email: 'marcus.thorne@campus.edu',
        phone: '+1 (555) 345-6789',
        interests: 'Robotics Kinematics, CAD Modeling, Study Scheduling',
        bio: 'Balancing rigorous STEM curriculum with robotics club commitments.',
        status: 'Active',
        registeredAt: '2026-09-03T11:30:00.000Z',
        completedResources: ['res_3'],
        enrolledActivities: ['act_1']
      },
      {
        id: 'stu_3',
        regNumber: 'STU2024003',
        name: 'Priya Sharma',
        department: 'Data Science & Analytics',
        year: '4th Year',
        email: 'priya.sharma@campus.edu',
        phone: '+1 (555) 456-7890',
        interests: 'Machine Learning, NLP, Graduate Fellowship Applications',
        bio: 'Preparing applications for international graduate fellowships and drafting research papers.',
        status: 'Active',
        registeredAt: '2026-09-04T09:15:00.000Z',
        completedResources: ['res_1', 'res_5'],
        enrolledActivities: ['act_2', 'act_3']
      },
      {
        id: 'stu_4',
        regNumber: 'STU2024004',
        name: 'Devante Cole',
        department: 'Business Administration',
        year: '1st Year',
        email: 'devante.cole@campus.edu',
        phone: '+1 (555) 567-8901',
        interests: 'Public Speaking, Career Pathways, Tech Minor Exploration',
        bio: 'Freshman student looking for direction in combining business strategy with software development skills.',
        status: 'Active',
        registeredAt: '2026-09-10T14:20:00.000Z',
        completedResources: ['res_3', 'res_6'],
        enrolledActivities: ['act_1', 'act_4']
      },
      {
        id: 'stu_5',
        regNumber: 'STU2024005',
        name: 'Sophia Lin',
        department: 'Electrical Engineering',
        year: '3rd Year',
        email: 'sophia.lin@campus.edu',
        phone: '+1 (555) 678-9012',
        interests: 'Embedded Systems, IoT, Undergraduate Research Lab',
        bio: 'Conducting smart sensor research; eager to learn industry-grade hardware validation techniques.',
        status: 'Active',
        registeredAt: '2026-09-12T16:00:00.000Z',
        completedResources: ['res_1'],
        enrolledActivities: ['act_2']
      },
      {
        id: 'stu_6',
        regNumber: 'STU2024006',
        name: 'Tariq Al-Mansoor',
        department: 'Information Technology',
        year: '2nd Year',
        email: 'tariq.mansoor@campus.edu',
        phone: '+1 (555) 789-0123',
        interests: 'Cybersecurity, Cloud Operations, Certification Prep',
        bio: 'Working toward industry security certifications while maintaining academic excellence.',
        status: 'Active',
        registeredAt: '2026-09-15T12:00:00.000Z',
        completedResources: ['res_4'],
        enrolledActivities: []
      }
    ],

    volunteers: [
      {
        id: 'vol_1',
        volunteerId: 'VOL2024001',
        name: 'Dr. Evelyn Reed',
        email: 'evelyn.reed@impacthub-demo.org',
        phone: '+1 (555) 890-1234',
        expertise: 'Software Architecture & Cloud Systems',
        skills: 'Python, System Design, Career Mentoring, Capstone Guidance',
        availability: 'Tuesdays & Thursdays, 2:00 PM – 5:30 PM',
        bio: 'Senior Technical Director with 14 years of industry and academic mentoring experience. Passionate about empowering future software engineers.',
        status: 'Approved',
        registeredAt: '2026-08-15T08:00:00.000Z'
      },
      {
        id: 'vol_2',
        volunteerId: 'VOL2024002',
        name: 'Julian Patel',
        email: 'julian.patel@impacthub-demo.org',
        phone: '+1 (555) 901-2345',
        expertise: 'Data Science & Applied Machine Learning',
        skills: 'Python, PyTorch, Statistical Modeling, Research Proposal Writing',
        availability: 'Mondays & Wednesdays, 10:00 AM – 1:00 PM',
        bio: 'Lead Data Scientist at a civic technology lab and adjunct instructor. Enjoys helping students navigate graduate research and technical portfolios.',
        status: 'Approved',
        registeredAt: '2026-08-18T10:00:00.000Z'
      },
      {
        id: 'vol_3',
        volunteerId: 'VOL2024003',
        name: 'Clara O\'Connor',
        email: 'clara.oconnor@impacthub-demo.org',
        phone: '+1 (555) 012-3456',
        expertise: 'Robotics Engineering & Project Leadership',
        skills: 'CAD, Mechatronics, Agile Project Management, Team Leadership',
        availability: 'Fridays, 1:00 PM – 4:00 PM',
        bio: 'Senior Mechatronics Lead. Mentoring student teams in hardware prototyping and effective time allocation.',
        status: 'Approved',
        registeredAt: '2026-08-20T11:00:00.000Z'
      },
      {
        id: 'vol_4',
        volunteerId: 'VOL2024004',
        name: 'Ryan Zhao',
        email: 'ryan.zhao@impacthub-demo.org',
        phone: '+1 (555) 123-4567',
        expertise: 'Cybersecurity & Infrastructure Defense',
        skills: 'Threat Analysis, Network Security, Ethical Hacking, Security Audits',
        availability: 'Wednesdays & Thursdays, 4:00 PM – 6:00 PM',
        bio: 'Cyber defense specialist looking to join the ImpactHub volunteer network to support information technology undergraduates.',
        status: 'Pending',
        registeredAt: '2026-10-18T14:30:00.000Z'
      }
    ],

    assignments: [
      {
        id: 'asg_1',
        studentId: 'stu_1',
        volunteerId: 'vol_1',
        assignedDate: '2026-09-08T09:00:00.000Z',
        status: 'Active',
        notes: 'Paired for senior capstone architecture and full-stack industry preparation.'
      },
      {
        id: 'asg_2',
        studentId: 'stu_3',
        volunteerId: 'vol_2',
        assignedDate: '2026-09-10T10:30:00.000Z',
        status: 'Active',
        notes: 'Paired for graduate research fellowship guidance and thesis outline.'
      },
      {
        id: 'asg_3',
        studentId: 'stu_2',
        volunteerId: 'vol_3',
        assignedDate: '2026-09-14T11:00:00.000Z',
        status: 'Active',
        notes: 'Paired for robotics engineering design and academic time management.'
      }
    ],

    guidanceRequests: [
      {
        id: 'req_1',
        studentId: 'stu_1',
        volunteerId: 'vol_1',
        topic: 'Full-Stack Architecture & Portfolio Review',
        preferredDate: '2026-11-05',
        preferredTime: '14:00',
        message: 'Would like feedback on my microservices portfolio project before upcoming career fair.',
        status: 'Scheduled',
        submittedAt: '2026-10-15T10:00:00.000Z',
        responseMessage: 'Accepted and scheduled for our regular Thursday slot.'
      },
      {
        id: 'req_2',
        studentId: 'stu_3',
        volunteerId: 'vol_2',
        topic: 'Graduate Fellowship Research Statement Review',
        preferredDate: '2026-10-18',
        preferredTime: '11:00',
        message: 'Drafted 2-page research proposal on generative NLP benchmarks and need critical review.',
        status: 'Completed',
        submittedAt: '2026-10-12T13:45:00.000Z',
        responseMessage: 'Completed review during office hours session.'
      },
      {
        id: 'req_3',
        studentId: 'stu_4',
        volunteerId: 'vol_1',
        topic: 'Navigating Tech Electives as a Business Major',
        preferredDate: '2026-11-08',
        preferredTime: '15:00',
        message: 'Need advice on which computer science courses are most valuable for tech product management.',
        status: 'Requested',
        submittedAt: '2026-10-22T16:10:00.000Z',
        responseMessage: null
      },
      {
        id: 'req_4',
        studentId: 'stu_6',
        volunteerId: 'vol_2',
        topic: 'Choosing between Data Engineering and Security Career Paths',
        preferredDate: '2026-11-10',
        preferredTime: '10:30',
        message: 'Looking for perspective on industry demand between cloud security vs data pipelines.',
        status: 'Accepted',
        submittedAt: '2026-10-23T11:20:00.000Z',
        responseMessage: 'Glad to discuss! Let us finalize a date once calendar confirms.'
      },
      {
        id: 'req_5',
        studentId: 'stu_5',
        volunteerId: 'vol_3',
        topic: 'Robotics Hardware Lab Preparation',
        preferredDate: '2026-10-20',
        preferredTime: '15:00',
        message: 'Seeking guidance on microcontroller selection for autonomous drone build.',
        status: 'Declined',
        submittedAt: '2026-10-16T12:00:00.000Z',
        responseMessage: 'Currently at full student capacity for hardware labs this term; recommended checking Resource #5.'
      }
    ],

    sessions: [
      {
        id: 'ses_1',
        studentId: 'stu_1',
        volunteerId: 'vol_1',
        topic: 'System Architecture & Portfolio Review',
        sessionDate: '2026-11-05',
        sessionTime: '14:00',
        location: 'Virtual Guidance Room A',
        status: 'Scheduled',
        meetingNotes: 'Agenda: 1. Architecture diagram review, 2. Database schema normalization, 3. Mock behavioral question.'
      },
      {
        id: 'ses_2',
        studentId: 'stu_3',
        volunteerId: 'vol_2',
        topic: 'Graduate Fellowship Statement Review',
        sessionDate: '2026-10-18',
        sessionTime: '11:00',
        location: 'Science Library Consultation Pod 3',
        status: 'Completed',
        summary: 'Priya presented a well-researched proposal. Recommended quantifying experimental benchmarks and connecting prior publications to proposed methodology.',
        actionItems: '1. Revise abstract section, 2. Secure second recommendation letter by Nov 1.'
      },
      {
        id: 'ses_3',
        studentId: 'stu_2',
        volunteerId: 'vol_3',
        topic: 'CAD Modeling & Project Milestones',
        sessionDate: '2026-11-12',
        sessionTime: '16:30',
        location: 'Engineering Hall Lab 204',
        status: 'Scheduled',
        meetingNotes: 'Bring Autodesk Inventor assemblies and BOM cost spreadsheet.'
      },
      {
        id: 'ses_4',
        studentId: 'stu_1',
        volunteerId: 'vol_1',
        topic: 'Introduction & Semester Goal Setting',
        sessionDate: '2026-10-10',
        sessionTime: '10:00',
        location: 'Virtual Guidance Room A',
        status: 'Completed',
        summary: 'Established target milestones for fall semester. Student is highly self-motivated with strong technical fundamentals.',
        actionItems: 'Complete GitHub portfolio cleanup and resume iteration.'
      }
    ],

    notes: [
      {
        id: 'note_1',
        volunteerId: 'vol_1',
        studentId: 'stu_1',
        title: 'Capstone Design Feedback & Database Design',
        content: 'Elena has shown remarkable growth in relational modeling. Suggested adopting PostgreSQL indexing best practices for her search endpoints. Keep up the high standard!',
        createdAt: '2026-10-11T11:30:00.000Z'
      },
      {
        id: 'note_2',
        volunteerId: 'vol_2',
        studentId: 'stu_3',
        title: 'Research Proposal Feedback',
        content: 'Impressive literature synthesis on transformer models. Advised Priya to place emphasis on ablation studies in her research plan. This will distinguish her fellowship package.',
        createdAt: '2026-10-19T14:15:00.000Z'
      },
      {
        id: 'note_3',
        volunteerId: 'vol_3',
        studentId: 'stu_2',
        title: 'Time Allocation Guidance',
        content: 'Discussed blocking dedicated morning study hours prior to afternoon laboratory sessions. Marcus reported feeling significantly less overwhelmed after applying this schedule.',
        createdAt: '2026-10-15T16:00:00.000Z'
      }
    ],

    resources: [
      {
        id: 'res_1',
        title: 'Academic Research & Citation Standards Handbook',
        category: 'Academic Writing',
        description: 'Comprehensive guidelines for IEEE, APA, and ACM citation styles, literature review framing, and avoiding inadvertent plagiarism.',
        url: 'https://owl.purdue.edu/owl/research_and_citation/resources.html',
        author: 'ImpactHub Academic Board',
        addedAt: '2026-09-01'
      },
      {
        id: 'res_2',
        title: 'Navigating Technical Interviews: Algorithms & Communication',
        category: 'Career Development',
        description: 'Step-by-step strategies for articulating data structure tradeoffs, whiteboard problem decomposition, and asking clarifying questions.',
        url: 'https://github.com/jwasham/coding-interview-university',
        author: 'Volunteer Engineering Network',
        addedAt: '2026-09-05'
      },
      {
        id: 'res_3',
        title: 'Effective Time Management & Focused Study Blocks for STEM',
        category: 'Personal Development',
        description: 'Proven time blocking techniques, spaced repetition schedules, and burnout mitigation strategies tailored for demanding university programs.',
        url: 'https://learningcenter.unc.edu/tips-and-tools/time-management/',
        author: 'Student Success Advisory',
        addedAt: '2026-09-08'
      },
      {
        id: 'res_4',
        title: 'Crafting High-Impact Engineering & Technical Resumes',
        category: 'Career Development',
        description: 'Action-verb frameworks, quantifying project metrics, and formatting technical skills for university recruiters and ATS parsers.',
        url: 'https://careereducation.columbia.edu/resources/resumes-impact',
        author: 'Dean of Career Guidance',
        addedAt: '2026-09-12'
      },
      {
        id: 'res_5',
        title: 'Introduction to Machine Learning Frameworks & Clean Code',
        category: 'Technical Skills',
        description: 'Practical guide to structuring machine learning experiments, writing reproducible notebooks, and managing dependencies cleanly.',
        url: 'https://scikit-learn.org/stable/tutorial/index.html',
        author: 'Dr. Evelyn Reed & Julian Patel',
        addedAt: '2026-09-15'
      },
      {
        id: 'res_6',
        title: 'Mental Wellbeing & Stress Reduction During Exam Periods',
        category: 'Wellbeing',
        description: 'Practical self-care exercises, mindfulness habits, and campus counseling contact resources for high-pressure academic weeks.',
        url: 'https://www.activeminds.org/about-mental-health/self-care/',
        author: 'Campus Wellness Alliance',
        addedAt: '2026-09-20'
      }
    ],

    activities: [
      {
        id: 'act_1',
        title: 'Fall 2026 Mentorship Community Kickoff',
        category: 'Workshop',
        date: '2026-11-02',
        time: '17:00 - 18:30',
        location: 'Student Union Hall & Streamed Live',
        description: 'Welcome gathering connecting newly enrolled students with volunteer mentors. Includes lightning presentations and breakout networking.',
        capacity: 80,
        enrolledCount: 42
      },
      {
        id: 'act_2',
        title: 'Industry Panel: Transitioning from University to Tech',
        category: 'Seminar',
        date: '2026-11-15',
        time: '18:00 - 19:30',
        location: 'Virtual Auditorium B',
        description: 'Distinguished volunteer mentors discuss career navigation, early workplace communication, and building long-term professional relationships.',
        capacity: 120,
        enrolledCount: 78
      },
      {
        id: 'act_3',
        title: 'Social Good Hackathon & Collaborative Build',
        category: 'Competition',
        date: '2026-11-20',
        time: '09:00 - 18:00',
        location: 'Engineering Building Collaborative Commons',
        description: 'Day-long collaborative innovation event where students build accessibility tools guided by volunteer mentors.',
        capacity: 50,
        enrolledCount: 36
      },
      {
        id: 'act_4',
        title: 'Resume & Portfolio Feedback Clinic',
        category: 'Career Clinic',
        date: '2026-11-28',
        time: '14:00 - 17:00',
        location: 'Guidance Center Consultation Pods',
        description: 'One-on-one rapid 15-minute resume reviews and GitHub portfolio critiques with volunteer mentors.',
        capacity: 35,
        enrolledCount: 22
      }
    ],

    notifications: [
      {
        id: 'notif_1',
        targetRole: 'all',
        title: 'Welcome to ImpactHub',
        message: 'The Fall Guidance Platform is live. Explore mentorship pairings, schedule sessions, and access curated resources.',
        createdAt: '2026-10-01T08:00:00.000Z',
        readBy: []
      },
      {
        id: 'notif_2',
        targetRole: 'all',
        title: 'November Mentorship Check-ins Open',
        message: 'Students and volunteers are encouraged to review pending guidance requests and confirm November meeting schedules.',
        createdAt: '2026-10-20T09:30:00.000Z',
        readBy: []
      },
      {
        id: 'notif_3',
        targetRole: 'student',
        studentId: 'stu_1',
        title: 'Guidance Session Confirmed',
        message: 'Your session on System Architecture with Dr. Evelyn Reed is confirmed for November 5 at 14:00.',
        createdAt: '2026-10-22T10:15:00.000Z',
        readBy: []
      },
      {
        id: 'notif_4',
        targetRole: 'all',
        title: 'New Resources Added',
        message: 'Six new academic and career development guides are now available in the Learning Resources library.',
        createdAt: '2026-10-24T12:00:00.000Z',
        readBy: []
      }
    ]
  };

  // Helper Methods for Reading & Writing JSON from localStorage
  const getRaw = (key, defaultVal = []) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultVal;
    }
  };

  const setRaw = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error saving ${key} to localStorage:`, e);
      return false;
    }
  };

  // ID Generator
  const generateId = (prefix) => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  };

  // Initialize Demonstration Dataset (only if not already set)
  const initDemoData = (forceReset = false) => {
    const isInitialized = localStorage.getItem(KEYS.INITIALIZED);
    if (!isInitialized || forceReset) {
      setRaw(KEYS.STUDENTS, INITIAL_DATA.students);
      setRaw(KEYS.VOLUNTEERS, INITIAL_DATA.volunteers);
      setRaw(KEYS.ASSIGNMENTS, INITIAL_DATA.assignments);
      setRaw(KEYS.GUIDANCE_REQUESTS, INITIAL_DATA.guidanceRequests);
      setRaw(KEYS.SESSIONS, INITIAL_DATA.sessions);
      setRaw(KEYS.NOTES, INITIAL_DATA.notes);
      setRaw(KEYS.RESOURCES, INITIAL_DATA.resources);
      setRaw(KEYS.ACTIVITIES, INITIAL_DATA.activities);
      setRaw(KEYS.NOTIFICATIONS, INITIAL_DATA.notifications);
      localStorage.setItem(KEYS.INITIALIZED, 'true');
      console.log('ImpactHub demo dataset successfully initialized in localStorage.');
    }
  };

  // Automatically ensure sample demo data exists
  initDemoData(false);

  return {
    // Re-initialize demo data on command
    resetDemoData: () => {
      initDemoData(true);
      return true;
    },

    // Session Management
    getCurrentSession: () => getRaw(KEYS.CURRENT_SESSION, null),
    setCurrentSession: (session) => setRaw(KEYS.CURRENT_SESSION, session),
    clearCurrentSession: () => {
      localStorage.removeItem(KEYS.CURRENT_SESSION);
    },

    // Students
    getStudents: () => getRaw(KEYS.STUDENTS, []),
    saveStudents: (students) => setRaw(KEYS.STUDENTS, students),
    getStudentById: (id) => {
      return getRaw(KEYS.STUDENTS, []).find(s => s.id === id || s.regNumber === id);
    },
    createStudent: (studentData) => {
      const students = getRaw(KEYS.STUDENTS, []);
      // Check for duplicate regNumber
      if (students.some(s => s.regNumber.toUpperCase() === studentData.regNumber.trim().toUpperCase())) {
        throw new Error('A student with this Registration Number already exists.');
      }
      const newStudent = {
        id: generateId('stu'),
        regNumber: studentData.regNumber.trim().toUpperCase(),
        name: studentData.name.trim(),
        department: studentData.department,
        year: studentData.year,
        email: studentData.email || '',
        phone: studentData.phone || '',
        interests: studentData.interests || '',
        bio: studentData.bio || '',
        status: CONFIG.STATUS.ACTIVE,
        registeredAt: new Date().toISOString(),
        completedResources: [],
        enrolledActivities: []
      };
      students.unshift(newStudent);
      setRaw(KEYS.STUDENTS, students);
      return newStudent;
    },
    updateStudent: (id, updates) => {
      const students = getRaw(KEYS.STUDENTS, []);
      const index = students.findIndex(s => s.id === id);
      if (index === -1) return null;
      students[index] = { ...students[index], ...updates };
      setRaw(KEYS.STUDENTS, students);
      return students[index];
    },
    deleteStudent: (id) => {
      let students = getRaw(KEYS.STUDENTS, []);
      students = students.filter(s => s.id !== id);
      setRaw(KEYS.STUDENTS, students);

      // Clean up linked assignments
      let assignments = getRaw(KEYS.ASSIGNMENTS, []);
      assignments = assignments.filter(a => a.studentId !== id);
      setRaw(KEYS.ASSIGNMENTS, assignments);
      return true;
    },

    // Volunteers
    getVolunteers: () => getRaw(KEYS.VOLUNTEERS, []),
    saveVolunteers: (volunteers) => setRaw(KEYS.VOLUNTEERS, volunteers),
    getVolunteerById: (id) => {
      return getRaw(KEYS.VOLUNTEERS, []).find(v => v.id === id || v.volunteerId === id);
    },
    createVolunteer: (volunteerData) => {
      const volunteers = getRaw(KEYS.VOLUNTEERS, []);
      if (volunteers.some(v => v.volunteerId.toUpperCase() === volunteerData.volunteerId.trim().toUpperCase())) {
        throw new Error('A volunteer with this ID already exists.');
      }
      const newVolunteer = {
        id: generateId('vol'),
        volunteerId: volunteerData.volunteerId.trim().toUpperCase(),
        name: volunteerData.name.trim(),
        email: volunteerData.email || '',
        phone: volunteerData.phone || '',
        expertise: volunteerData.expertise,
        skills: volunteerData.skills || '',
        availability: volunteerData.availability || 'Weekdays (Simulated)',
        bio: volunteerData.bio || '',
        status: CONFIG.STATUS.PENDING, // New volunteers require admin approval
        registeredAt: new Date().toISOString()
      };
      volunteers.unshift(newVolunteer);
      setRaw(KEYS.VOLUNTEERS, volunteers);
      return newVolunteer;
    },
    updateVolunteer: (id, updates) => {
      const volunteers = getRaw(KEYS.VOLUNTEERS, []);
      const index = volunteers.findIndex(v => v.id === id);
      if (index === -1) return null;
      volunteers[index] = { ...volunteers[index], ...updates };
      setRaw(KEYS.VOLUNTEERS, volunteers);
      return volunteers[index];
    },
    deleteVolunteer: (id) => {
      let volunteers = getRaw(KEYS.VOLUNTEERS, []);
      volunteers = volunteers.filter(v => v.id !== id);
      setRaw(KEYS.VOLUNTEERS, volunteers);

      // Clean up linked assignments
      let assignments = getRaw(KEYS.ASSIGNMENTS, []);
      assignments = assignments.filter(a => a.volunteerId !== id);
      setRaw(KEYS.ASSIGNMENTS, assignments);
      return true;
    },

    // Mentor Assignments
    getAssignments: () => getRaw(KEYS.ASSIGNMENTS, []),
    getAssignmentByStudentId: (studentId) => {
      return getRaw(KEYS.ASSIGNMENTS, []).find(a => a.studentId === studentId && a.status === 'Active');
    },
    getAssignmentsByVolunteerId: (volunteerId) => {
      return getRaw(KEYS.ASSIGNMENTS, []).filter(a => a.volunteerId === volunteerId && a.status === 'Active');
    },
    createOrUpdateAssignment: (studentId, volunteerId, notes = '') => {
      let assignments = getRaw(KEYS.ASSIGNMENTS, []);
      // Deactivate any prior active assignment for this student to prevent duplicate active mentors
      assignments = assignments.map(a => {
        if (a.studentId === studentId && a.status === 'Active') {
          return { ...a, status: 'Reassigned', endedAt: new Date().toISOString() };
        }
        return a;
      });

      const newAssignment = {
        id: generateId('asg'),
        studentId,
        volunteerId,
        assignedDate: new Date().toISOString(),
        status: 'Active',
        notes
      };
      assignments.unshift(newAssignment);
      setRaw(KEYS.ASSIGNMENTS, assignments);

      // Create notification for student
      const student = StorageService.getStudentById(studentId);
      const volunteer = StorageService.getVolunteerById(volunteerId);
      if (student && volunteer) {
        StorageService.createNotification({
          targetRole: 'student',
          studentId: student.id,
          title: 'Mentor Assigned',
          message: `${volunteer.name} has been assigned as your guidance mentor.`
        });
      }

      return newAssignment;
    },

    // Guidance Requests
    getGuidanceRequests: () => getRaw(KEYS.GUIDANCE_REQUESTS, []),
    createGuidanceRequest: (requestData) => {
      const requests = getRaw(KEYS.GUIDANCE_REQUESTS, []);
      const newReq = {
        id: generateId('req'),
        studentId: requestData.studentId,
        volunteerId: requestData.volunteerId,
        topic: requestData.topic,
        preferredDate: requestData.preferredDate,
        preferredTime: requestData.preferredTime,
        message: requestData.message || '',
        status: CONFIG.STATUS.REQUESTED,
        submittedAt: new Date().toISOString(),
        responseMessage: null
      };
      requests.unshift(newReq);
      setRaw(KEYS.GUIDANCE_REQUESTS, requests);

      // Notify Volunteer
      StorageService.createNotification({
        targetRole: 'volunteer',
        title: 'New Guidance Request',
        message: `A new session request for "${newReq.topic}" has been submitted.`
      });

      return newReq;
    },
    updateGuidanceRequest: (id, updates) => {
      const requests = getRaw(KEYS.GUIDANCE_REQUESTS, []);
      const index = requests.findIndex(r => r.id === id);
      if (index === -1) return null;
      requests[index] = { ...requests[index], ...updates };
      setRaw(KEYS.GUIDANCE_REQUESTS, requests);
      return requests[index];
    },

    // Sessions
    getSessions: () => getRaw(KEYS.SESSIONS, []),
    createSession: (sessionData) => {
      const sessions = getRaw(KEYS.SESSIONS, []);
      const newSession = {
        id: generateId('ses'),
        studentId: sessionData.studentId,
        volunteerId: sessionData.volunteerId,
        topic: sessionData.topic,
        sessionDate: sessionData.sessionDate,
        sessionTime: sessionData.sessionTime,
        location: sessionData.location || 'Virtual Guidance Room A',
        status: CONFIG.STATUS.SCHEDULED,
        meetingNotes: sessionData.meetingNotes || '',
        summary: '',
        actionItems: ''
      };
      sessions.unshift(newSession);
      setRaw(KEYS.SESSIONS, sessions);

      // Notify Student
      StorageService.createNotification({
        targetRole: 'student',
        studentId: sessionData.studentId,
        title: 'Guidance Session Scheduled',
        message: `Your session on "${sessionData.topic}" has been scheduled for ${sessionData.sessionDate} at ${sessionData.sessionTime}.`
      });

      return newSession;
    },
    updateSession: (id, updates) => {
      const sessions = getRaw(KEYS.SESSIONS, []);
      const index = sessions.findIndex(s => s.id === id);
      if (index === -1) return null;
      sessions[index] = { ...sessions[index], ...updates };
      setRaw(KEYS.SESSIONS, sessions);
      return sessions[index];
    },

    // Guidance Notes
    getNotes: () => getRaw(KEYS.NOTES, []),
    getNotesByStudentId: (studentId) => {
      return getRaw(KEYS.NOTES, []).filter(n => n.studentId === studentId);
    },
    getNotesByVolunteerId: (volunteerId) => {
      return getRaw(KEYS.NOTES, []).filter(n => n.volunteerId === volunteerId);
    },
    createNote: (noteData) => {
      const notes = getRaw(KEYS.NOTES, []);
      const newNote = {
        id: generateId('note'),
        volunteerId: noteData.volunteerId,
        studentId: noteData.studentId,
        title: noteData.title,
        content: noteData.content,
        createdAt: new Date().toISOString()
      };
      notes.unshift(newNote);
      setRaw(KEYS.NOTES, notes);
      return newNote;
    },
    updateNote: (id, updates) => {
      const notes = getRaw(KEYS.NOTES, []);
      const index = notes.findIndex(n => n.id === id);
      if (index === -1) return null;
      notes[index] = { ...notes[index], ...updates };
      setRaw(KEYS.NOTES, notes);
      return notes[index];
    },
    deleteNote: (id) => {
      let notes = getRaw(KEYS.NOTES, []);
      notes = notes.filter(n => n.id !== id);
      setRaw(KEYS.NOTES, notes);
      return true;
    },

    // Learning Resources
    getResources: () => getRaw(KEYS.RESOURCES, []),
    createResource: (resData) => {
      const resources = getRaw(KEYS.RESOURCES, []);
      const newRes = {
        id: generateId('res'),
        title: resData.title,
        category: resData.category || 'General',
        description: resData.description,
        url: resData.url || '',
        author: resData.author || 'ImpactHub Resource Board',
        addedAt: new Date().toISOString().split('T')[0]
      };
      resources.unshift(newRes);
      setRaw(KEYS.RESOURCES, resources);
      return newRes;
    },
    updateResource: (id, updates) => {
      const resources = getRaw(KEYS.RESOURCES, []);
      const index = resources.findIndex(r => r.id === id);
      if (index === -1) return null;
      resources[index] = { ...resources[index], ...updates };
      setRaw(KEYS.RESOURCES, resources);
      return resources[index];
    },
    deleteResource: (id) => {
      let resources = getRaw(KEYS.RESOURCES, []);
      resources = resources.filter(r => r.id !== id);
      setRaw(KEYS.RESOURCES, resources);
      return true;
    },
    toggleResourceCompleted: (studentId, resourceId) => {
      const students = getRaw(KEYS.STUDENTS, []);
      const student = students.find(s => s.id === studentId);
      if (!student) return false;
      student.completedResources = student.completedResources || [];
      const hasCompleted = student.completedResources.includes(resourceId);
      if (hasCompleted) {
        student.completedResources = student.completedResources.filter(id => id !== resourceId);
      } else {
        student.completedResources.push(resourceId);
      }
      setRaw(KEYS.STUDENTS, students);
      return !hasCompleted;
    },

    // Activities
    getActivities: () => getRaw(KEYS.ACTIVITIES, []),
    createActivity: (actData) => {
      const activities = getRaw(KEYS.ACTIVITIES, []);
      const newAct = {
        id: generateId('act'),
        title: actData.title,
        category: actData.category || 'Workshop',
        date: actData.date,
        time: actData.time || 'TBD',
        location: actData.location || 'Campus Center',
        description: actData.description,
        capacity: parseInt(actData.capacity, 10) || 50,
        enrolledCount: 0
      };
      activities.unshift(newAct);
      setRaw(KEYS.ACTIVITIES, activities);
      return newAct;
    },
    updateActivity: (id, updates) => {
      const activities = getRaw(KEYS.ACTIVITIES, []);
      const index = activities.findIndex(a => a.id === id);
      if (index === -1) return null;
      activities[index] = { ...activities[index], ...updates };
      setRaw(KEYS.ACTIVITIES, activities);
      return activities[index];
    },
    deleteActivity: (id) => {
      let activities = getRaw(KEYS.ACTIVITIES, []);
      activities = activities.filter(a => a.id !== id);
      setRaw(KEYS.ACTIVITIES, activities);
      return true;
    },
    toggleActivityEnrollment: (studentId, activityId) => {
      const students = getRaw(KEYS.STUDENTS, []);
      const student = students.find(s => s.id === studentId);
      const activities = getRaw(KEYS.ACTIVITIES, []);
      const activity = activities.find(a => a.id === activityId);
      if (!student || !activity) return false;

      student.enrolledActivities = student.enrolledActivities || [];
      const isEnrolled = student.enrolledActivities.includes(activityId);
      if (isEnrolled) {
        student.enrolledActivities = student.enrolledActivities.filter(id => id !== activityId);
        activity.enrolledCount = Math.max(0, (activity.enrolledCount || 1) - 1);
      } else {
        student.enrolledActivities.push(activityId);
        activity.enrolledCount = (activity.enrolledCount || 0) + 1;
      }
      setRaw(KEYS.STUDENTS, students);
      setRaw(KEYS.ACTIVITIES, activities);
      return !isEnrolled;
    },

    // Notifications & Announcements
    getNotifications: () => getRaw(KEYS.NOTIFICATIONS, []),
    createNotification: (notifData) => {
      const notifications = getRaw(KEYS.NOTIFICATIONS, []);
      const newNotif = {
        id: generateId('notif'),
        targetRole: notifData.targetRole || 'all',
        studentId: notifData.studentId || null,
        title: notifData.title,
        message: notifData.message,
        createdAt: new Date().toISOString(),
        readBy: []
      };
      notifications.unshift(newNotif);
      setRaw(KEYS.NOTIFICATIONS, notifications);
      return newNotif;
    },
    markNotificationRead: (notifId, userId) => {
      const notifications = getRaw(KEYS.NOTIFICATIONS, []);
      const notif = notifications.find(n => n.id === notifId);
      if (notif) {
        notif.readBy = notif.readBy || [];
        if (!notif.readBy.includes(userId)) {
          notif.readBy.push(userId);
          setRaw(KEYS.NOTIFICATIONS, notifications);
        }
      }
      return true;
    },
    deleteNotification: (id) => {
      let notifications = getRaw(KEYS.NOTIFICATIONS, []);
      notifications = notifications.filter(n => n.id !== id);
      setRaw(KEYS.NOTIFICATIONS, notifications);
      return true;
    },

    // Dynamic Platform Statistics Calculation
    getPlatformStats: () => {
      const students = getRaw(KEYS.STUDENTS, []);
      const volunteers = getRaw(KEYS.VOLUNTEERS, []);
      const assignments = getRaw(KEYS.ASSIGNMENTS, []);
      const requests = getRaw(KEYS.GUIDANCE_REQUESTS, []);
      const sessions = getRaw(KEYS.SESSIONS, []);
      const resources = getRaw(KEYS.RESOURCES, []);
      const activities = getRaw(KEYS.ACTIVITIES, []);

      const approvedVolunteers = volunteers.filter(v => v.status === CONFIG.STATUS.APPROVED);
      const pendingVolunteers = volunteers.filter(v => v.status === CONFIG.STATUS.PENDING);
      const activeAssignments = assignments.filter(a => a.status === 'Active');
      const completedSessions = sessions.filter(s => s.status === CONFIG.STATUS.COMPLETED);
      const scheduledSessions = sessions.filter(s => s.status === CONFIG.STATUS.SCHEDULED);

      return {
        totalStudents: students.length,
        totalVolunteers: volunteers.length,
        approvedVolunteers: approvedVolunteers.length,
        pendingVolunteers: pendingVolunteers.length,
        activeAssignments: activeAssignments.length,
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === CONFIG.STATUS.REQUESTED).length,
        scheduledSessions: scheduledSessions.length,
        completedSessions: completedSessions.length,
        totalResources: resources.length,
        totalActivities: activities.length
      };
    },

    // JSON Backup / Export
    exportDataAsJSON: () => {
      const backup = {
        platform: CONFIG.APP_NAME,
        exportedAt: new Date().toISOString(),
        students: getRaw(KEYS.STUDENTS, []),
        volunteers: getRaw(KEYS.VOLUNTEERS, []),
        assignments: getRaw(KEYS.ASSIGNMENTS, []),
        guidanceRequests: getRaw(KEYS.GUIDANCE_REQUESTS, []),
        sessions: getRaw(KEYS.SESSIONS, []),
        notes: getRaw(KEYS.NOTES, []),
        resources: getRaw(KEYS.RESOURCES, []),
        activities: getRaw(KEYS.ACTIVITIES, []),
        notifications: getRaw(KEYS.NOTIFICATIONS, [])
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `impacthub_demo_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };
})();
