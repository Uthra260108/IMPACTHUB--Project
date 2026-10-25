/**
 * IMPACTHUB - AUTHENTICATION & SESSION MANAGEMENT
 * Pure client-side simulation for academic prototype evaluation.
 */

const AuthService = (() => {
  // Check if current user is logged in with expected role
  const requireAuth = (allowedRole) => {
    const session = StorageService.getCurrentSession();
    if (!session) {
      // Redirect to appropriate login page
      let targetLogin = 'index.html';
      if (allowedRole === CONFIG.ROLES.STUDENT) targetLogin = 'student-login.html';
      else if (allowedRole === CONFIG.ROLES.VOLUNTEER) targetLogin = 'volunteer-login.html';
      else if (allowedRole === CONFIG.ROLES.ADMIN) targetLogin = 'admin-login.html';

      window.location.href = targetLogin;
      return null;
    }

    if (session.role !== allowedRole) {
      alert(`Unauthorized Access: Your active session (${session.role}) does not have permission to view the ${allowedRole} portal.`);
      let targetDashboard = 'index.html';
      if (session.role === CONFIG.ROLES.STUDENT) targetDashboard = 'student-dashboard.html';
      else if (session.role === CONFIG.ROLES.VOLUNTEER) targetDashboard = 'volunteer-dashboard.html';
      else if (session.role === CONFIG.ROLES.ADMIN) targetDashboard = 'admin-dashboard.html';
      window.location.href = targetDashboard;
      return null;
    }

    return session;
  };

  // Student Login
  const loginStudent = (regNumber, password) => {
    if (!regNumber || !password) {
      throw new Error('Please enter both your Student Registration Number and Password.');
    }

    const cleanReg = regNumber.trim().toUpperCase();
    const students = StorageService.getStudents();
    const student = students.find(s => s.regNumber.toUpperCase() === cleanReg);

    if (!student) {
      throw new Error('No student found matching this Registration Number. Please verify or register.');
    }

    if (student.status === CONFIG.STATUS.INACTIVE) {
      throw new Error('This student account is currently deactivated by the administrator.');
    }

    // In this frontend demo, verify password
    if (password !== 'studentpassword123' && password !== 'password123' && password.length < 4) {
      throw new Error('Invalid demo password. (Evaluator Hint: use studentpassword123)');
    }

    const sessionData = {
      userId: student.id,
      regNumber: student.regNumber,
      name: student.name,
      department: student.department,
      role: CONFIG.ROLES.STUDENT,
      loginTime: new Date().toISOString()
    };

    StorageService.setCurrentSession(sessionData);
    return sessionData;
  };

  // Volunteer Login
  const loginVolunteer = (volunteerId, password) => {
    if (!volunteerId || !password) {
      throw new Error('Please enter both your Volunteer ID and Password.');
    }

    const cleanId = volunteerId.trim().toUpperCase();
    const volunteers = StorageService.getVolunteers();
    const volunteer = volunteers.find(v => v.volunteerId.toUpperCase() === cleanId);

    if (!volunteer) {
      throw new Error('No volunteer account found with this Volunteer ID.');
    }

    if (volunteer.status === CONFIG.STATUS.PENDING) {
      throw new Error('Your volunteer application is currently pending administrative review.');
    }

    if (volunteer.status === CONFIG.STATUS.REJECTED || volunteer.status === CONFIG.STATUS.INACTIVE) {
      throw new Error('This volunteer account is currently inactive. Please contact the administrator.');
    }

    if (password !== 'volunteerpassword123' && password !== 'password123' && password.length < 4) {
      throw new Error('Invalid demo password. (Evaluator Hint: use volunteerpassword123)');
    }

    const sessionData = {
      userId: volunteer.id,
      volunteerId: volunteer.volunteerId,
      name: volunteer.name,
      expertise: volunteer.expertise,
      role: CONFIG.ROLES.VOLUNTEER,
      loginTime: new Date().toISOString()
    };

    StorageService.setCurrentSession(sessionData);
    return sessionData;
  };

  // Admin Login
  const loginAdmin = (username, password) => {
    if (!username || !password) {
      throw new Error('Please enter administrator credentials.');
    }

    const demoAdmin = CONFIG.DEMO_ACCOUNTS.ADMIN;
    if (username.trim().toLowerCase() !== demoAdmin.username || password !== demoAdmin.password) {
      throw new Error('Invalid administrator credentials. (Demo hint: admin / adminpassword123)');
    }

    const sessionData = {
      userId: 'admin_root',
      username: demoAdmin.username,
      name: demoAdmin.name,
      title: demoAdmin.title,
      role: CONFIG.ROLES.ADMIN,
      loginTime: new Date().toISOString()
    };

    StorageService.setCurrentSession(sessionData);
    return sessionData;
  };

  // Logout
  const logout = () => {
    StorageService.clearCurrentSession();
    window.location.href = 'index.html';
  };

  return {
    requireAuth,
    loginStudent,
    loginVolunteer,
    loginAdmin,
    logout
  };
})();
