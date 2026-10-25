/**
 * IMPACTHUB - CONFIGURATION & CONSTANTS
 * College Software Engineering Project
 */

const CONFIG = {
  APP_NAME: 'ImpactHub',
  TAGLINE: 'Guidance Today. Brighter Tomorrows.',
  MISSION_STATEMENT: 'Connecting caring volunteers with students to create opportunities for learning, confidence, and growth.',
  VERSION: '1.0.0',
  DEMO_DISCLAIMER: 'Demo Prototype: Runs entirely in browser localStorage without an external server or production database.',

  // Storage Keys
  STORAGE_KEYS: {
    STUDENTS: 'impacthub_students',
    VOLUNTEERS: 'impacthub_volunteers',
    ADMIN: 'impacthub_admin',
    ASSIGNMENTS: 'impacthub_assignments',
    GUIDANCE_REQUESTS: 'impacthub_guidance_requests',
    SESSIONS: 'impacthub_sessions',
    RESOURCES: 'impacthub_resources',
    ACTIVITIES: 'impacthub_activities',
    NOTIFICATIONS: 'impacthub_notifications',
    NOTES: 'impacthub_notes',
    CURRENT_SESSION: 'impacthub_current_session',
    INITIALIZED: 'impacthub_demo_initialized_v1'
  },

  // Role Definitions
  ROLES: {
    STUDENT: 'student',
    VOLUNTEER: 'volunteer',
    ADMIN: 'admin'
  },

  // Status Definitions
  STATUS: {
    // User Account
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    PENDING: 'Pending',
    
    // Volunteer Application
    APPROVED: 'Approved',
    REJECTED: 'Rejected',

    // Guidance Requests
    REQUESTED: 'Requested',
    ACCEPTED: 'Accepted',
    DECLINED: 'Declined',
    SCHEDULED: 'Scheduled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  },

  // Demo Credentials for Evaluators & Reviewers
  DEMO_ACCOUNTS: {
    ADMIN: {
      username: 'admin',
      password: 'adminpassword123',
      name: 'Dr. Sarah Sterling',
      role: 'admin',
      title: 'Platform Director & Dean of Guidance'
    },
    STUDENT: {
      regNumber: 'STU2024001',
      password: 'studentpassword123',
      name: 'Elena Vance',
      role: 'student',
      department: 'Computer Science & Engineering',
      year: '3rd Year'
    },
    VOLUNTEER: {
      volunteerId: 'VOL2024001',
      password: 'volunteerpassword123',
      name: 'Dr. Evelyn Reed',
      role: 'volunteer',
      expertise: 'Software Architecture & Distributed Systems'
    }
  }
};

// Freeze configuration to prevent accidental modification
Object.freeze(CONFIG);
