/**
 * IMPACTHUB - STUDENT DASHBOARD CONTROLLER
 */

const StudentApp = (() => {
  let currentStudent = null;
  let currentSession = null;

  // Initialize Student Portal
  const init = () => {
    currentSession = AuthService.requireAuth(CONFIG.ROLES.STUDENT);
    if (!currentSession) return;

    currentStudent = StorageService.getStudentById(currentSession.userId);
    if (!currentStudent) {
      alert('Student record could not be loaded. Please log in again.');
      AuthService.logout();
      return;
    }

    setupStudentNav();
    renderStudentHeader();
    renderOverview();
    renderMyMentor();
    renderSessions();
    renderResources();
    renderActivities();
    renderNotifications();
    renderProfile();
    setupRequestModal();
  };

  // Setup tab navigation
  const setupStudentNav = () => {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-target');
        if (!targetSection) return;

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
        const activeSec = document.getElementById(targetSection);
        if (activeSec) {
          activeSec.classList.add('active');
        }

        // Close mobile drawer if open
        document.body.classList.remove('sidebar-open');

        // Refresh relevant views on tab switch
        if (targetSection === 'sec-overview') renderOverview();
        if (targetSection === 'sec-mentor') renderMyMentor();
        if (targetSection === 'sec-sessions') renderSessions();
        if (targetSection === 'sec-resources') renderResources();
        if (targetSection === 'sec-activities') renderActivities();
        if (targetSection === 'sec-notifications') renderNotifications();
      });
    });
  };

  // Render header / user chips
  const renderStudentHeader = () => {
    const nameEl = document.getElementById('student-topbar-name');
    const avatarEl = document.getElementById('student-topbar-avatar');
    const welcomeEl = document.getElementById('student-welcome-name');

    if (nameEl) nameEl.textContent = currentStudent.name;
    if (avatarEl) avatarEl.textContent = currentStudent.name.charAt(0);
    if (welcomeEl) welcomeEl.textContent = currentStudent.name;

    // Update sidebar profile
    const sideName = document.getElementById('sidebar-user-name');
    const sideSub = document.getElementById('sidebar-user-sub');
    const sideAvatar = document.getElementById('sidebar-user-avatar');
    if (sideName) sideName.textContent = currentStudent.name;
    if (sideSub) sideSub.textContent = `${currentStudent.department} (${currentStudent.year})`;
    if (sideAvatar) sideAvatar.textContent = currentStudent.name.charAt(0);
  };

  // Section A: Overview
  const renderOverview = () => {
    // Refresh student data
    currentStudent = StorageService.getStudentById(currentStudent.id);

    // Summary statistics
    const assignment = StorageService.getAssignmentByStudentId(currentStudent.id);
    const mentor = assignment ? StorageService.getVolunteerById(assignment.volunteerId) : null;
    const allSessions = StorageService.getSessions().filter(s => s.studentId === currentStudent.id);
    const completedSessions = allSessions.filter(s => s.status === CONFIG.STATUS.COMPLETED);
    const completedResources = currentStudent.completedResources || [];
    const enrolledActivities = currentStudent.enrolledActivities || [];

    const mentorNameEl = document.getElementById('overview-mentor-name');
    const sessionsCountEl = document.getElementById('overview-sessions-count');
    const completedResCountEl = document.getElementById('overview-resources-count');
    const activitiesCountEl = document.getElementById('overview-activities-count');

    if (mentorNameEl) mentorNameEl.textContent = mentor ? mentor.name : 'Unassigned';
    if (sessionsCountEl) sessionsCountEl.textContent = allSessions.length;
    if (completedResCountEl) completedResCountEl.textContent = completedResources.length;
    if (activitiesCountEl) activitiesCountEl.textContent = enrolledActivities.length;

    // Upcoming sessions table / list in overview
    const upcomingContainer = document.getElementById('overview-upcoming-sessions');
    if (upcomingContainer) {
      const upcoming = allSessions.filter(s => s.status === CONFIG.STATUS.SCHEDULED);
      if (upcoming.length === 0) {
        upcomingContainer.innerHTML = `
          <div class="empty-state" style="padding: 24px;">
            <p>No upcoming guidance sessions scheduled right now.</p>
            <button class="btn btn-primary btn-sm" onclick="StudentApp.openNewRequestModal()">Request Guidance Session</button>
          </div>
        `;
      } else {
        let html = '';
        upcoming.forEach(ses => {
          const v = StorageService.getVolunteerById(ses.volunteerId);
          const dateInfo = Utils.formatMonthAndDay(ses.sessionDate);
          html += `
            <div class="session-card">
              <div class="session-date-badge">
                <div class="session-month">${dateInfo.month}</div>
                <div class="session-day">${dateInfo.day}</div>
              </div>
              <div class="session-details">
                <div class="session-topic">${Utils.escapeHtml(ses.topic)}</div>
                <div class="session-sub">
                  <span>Mentor: <strong>${v ? Utils.escapeHtml(v.name) : 'Volunteer'}</strong></span>
                  <span>Time: <strong>${ses.sessionTime}</strong></span>
                  <span>Location: <strong>${Utils.escapeHtml(ses.location)}</strong></span>
                </div>
              </div>
              <div>${Utils.renderStatusBadge(ses.status)}</div>
            </div>
          `;
        });
        upcomingContainer.innerHTML = html;
      }
    }

    // Progress Bar in overview
    const totalResources = StorageService.getResources().length;
    const progressPercent = totalResources > 0 ? Math.round((completedResources.length / totalResources) * 100) : 0;
    const progBar = document.getElementById('overview-progress-bar');
    const progText = document.getElementById('overview-progress-text');
    if (progBar) progBar.style.width = `${progressPercent}%`;
    if (progText) progText.textContent = `${progressPercent}% Curriculum & Resources Explored`;
  };

  // Section B: My Mentor
  const renderMyMentor = () => {
    const container = document.getElementById('my-mentor-container');
    if (!container) return;

    const assignment = StorageService.getAssignmentByStudentId(currentStudent.id);
    if (!assignment) {
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </div>
            <h4>Mentor Assignment Pending</h4>
            <p>Our platform administrator will pair you with a dedicated mentor aligned with your academic department (${Utils.escapeHtml(currentStudent.department)}). You can still browse resources and join community workshops!</p>
          </div>
        </div>
      `;
      return;
    }

    const mentor = StorageService.getVolunteerById(assignment.volunteerId);
    if (!mentor) {
      container.innerHTML = '<p class="text-muted">Assigned mentor information unavailable.</p>';
      return;
    }

    // Guidance notes left by mentor for this student
    const studentNotes = StorageService.getNotesByStudentId(currentStudent.id);

    let notesHtml = '';
    if (studentNotes.length === 0) {
      notesHtml = '<p class="text-muted" style="font-size: 0.9rem;">No mentoring notes recorded yet. Notes from your one-on-one sessions will appear here.</p>';
    } else {
      studentNotes.forEach(note => {
        notesHtml += `
          <div class="guidance-note-card">
            <div class="note-header">
              <div class="note-student-tag">${Utils.escapeHtml(note.title)}</div>
              <div class="note-date">${Utils.formatDate(note.createdAt)}</div>
            </div>
            <div class="note-body">${Utils.escapeHtml(note.content)}</div>
          </div>
        `;
      });
    }

    container.innerHTML = `
      <div class="mentor-hero-card">
        <div class="mentor-hero-avatar">${mentor.name.charAt(0)}</div>
        <div class="mentor-hero-info">
          <div class="mentor-hero-name">${Utils.escapeHtml(mentor.name)}</div>
          <div class="mentor-hero-expertise">${Utils.escapeHtml(mentor.expertise)}</div>
          <div class="mentor-hero-meta">
            <div class="mentor-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Availability: <strong>${Utils.escapeHtml(mentor.availability)}</strong></span>
            </div>
            <div class="mentor-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>Status: <strong style="color:var(--status-active-text);">Assigned &amp; Active</strong></span>
            </div>
          </div>
        </div>
        <div>
          <button class="btn btn-primary" onclick="StudentApp.openNewRequestModal('${mentor.id}')">Request Guidance</button>
        </div>
      </div>

      <div class="dashboard-grid-equal">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Mentor Profile &amp; Focus Areas</h3>
          </div>
          <div class="card-body">
            <p style="font-size:0.95rem; line-height:1.6; margin-bottom: 16px;">${Utils.escapeHtml(mentor.bio || 'Dedicated guidance volunteer helping students realize their full potential.')}</p>
            <h5 style="margin-bottom: 8px;">Key Competencies &amp; Guidance Topics</h5>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${mentor.skills.split(',').map(s => `<span class="status-pill status-pending">${Utils.escapeHtml(s.trim())}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Developmental Notes from Mentor</h3>
          </div>
          <div class="card-body">
            ${notesHtml}
          </div>
        </div>
      </div>
    `;
  };

  // Section C: Guidance Sessions
  const renderSessions = () => {
    const listContainer = document.getElementById('student-sessions-list');
    const requestsContainer = document.getElementById('student-requests-list');
    if (!listContainer) return;

    const sessions = StorageService.getSessions().filter(s => s.studentId === currentStudent.id);
    const requests = StorageService.getGuidanceRequests().filter(r => r.studentId === currentStudent.id);

    if (sessions.length === 0) {
      listContainer.innerHTML = '<div class="empty-state"><p>No session records found.</p></div>';
    } else {
      let sHtml = '';
      sessions.forEach(ses => {
        const v = StorageService.getVolunteerById(ses.volunteerId);
        const dateInfo = Utils.formatMonthAndDay(ses.sessionDate);
        sHtml += `
          <div class="session-card">
            <div class="session-date-badge">
              <div class="session-month">${dateInfo.month}</div>
              <div class="session-day">${dateInfo.day}</div>
            </div>
            <div class="session-details">
              <div class="session-topic">${Utils.escapeHtml(ses.topic)}</div>
              <div class="session-sub">
                <span>Mentor: <strong>${v ? Utils.escapeHtml(v.name) : 'Volunteer'}</strong></span>
                <span>Time: <strong>${ses.sessionTime}</strong></span>
                <span>Location: <strong>${Utils.escapeHtml(ses.location)}</strong></span>
              </div>
              ${ses.summary ? `<div style="margin-top:6px; font-size:0.83rem; color:var(--text-primary); background:#FAF5F6; padding:8px 12px; border-radius:6px;"><strong>Summary Note:</strong> ${Utils.escapeHtml(ses.summary)}</div>` : ''}
            </div>
            <div>${Utils.renderStatusBadge(ses.status)}</div>
          </div>
        `;
      });
      listContainer.innerHTML = sHtml;
    }

    if (requestsContainer) {
      if (requests.length === 0) {
        requestsContainer.innerHTML = '<p class="text-muted" style="padding:16px;">No submitted requests.</p>';
      } else {
        let rHtml = '<div class="table-responsive"><table class="data-table"><thead><tr><th>Topic</th><th>Preferred Date</th><th>Status</th><th>Submitted</th></tr></thead><tbody>';
        requests.forEach(req => {
          rHtml += `
            <tr>
              <td><strong>${Utils.escapeHtml(req.topic)}</strong></td>
              <td>${Utils.formatDate(req.preferredDate)} (${req.preferredTime || 'Flexible'})</td>
              <td>${Utils.renderStatusBadge(req.status)}</td>
              <td>${Utils.formatDate(req.submittedAt)}</td>
            </tr>
          `;
        });
        rHtml += '</tbody></table></div>';
        requestsContainer.innerHTML = rHtml;
      }
    }
  };

  // Open Guidance Request Modal
  const openNewRequestModal = (volunteerId = null) => {
    const assignment = StorageService.getAssignmentByStudentId(currentStudent.id);
    let targetVolunteerId = volunteerId || (assignment ? assignment.volunteerId : null);

    // If still no volunteer, pick the first approved volunteer in system
    if (!targetVolunteerId) {
      const approved = StorageService.getVolunteers().find(v => v.status === CONFIG.STATUS.APPROVED);
      if (approved) targetVolunteerId = approved.id;
    }

    const hiddenVolInput = document.getElementById('req-volunteer-id');
    if (hiddenVolInput) hiddenVolInput.value = targetVolunteerId || '';

    Utils.openModal('modal-guidance-request');
  };

  const setupRequestModal = () => {
    const form = document.getElementById('form-guidance-request');
    if (!form) return;

    form.onsubmit = (e) => {
      e.preventDefault();
      const topic = document.getElementById('req-topic').value.trim();
      const preferredDate = document.getElementById('req-date').value;
      const preferredTime = document.getElementById('req-time').value;
      const message = document.getElementById('req-message').value.trim();
      const volunteerId = document.getElementById('req-volunteer-id').value;

      if (!topic || !preferredDate) {
        Utils.showToast('Missing Fields', 'Please specify a guidance topic and preferred date.', 'danger');
        return;
      }

      StorageService.createGuidanceRequest({
        studentId: currentStudent.id,
        volunteerId: volunteerId || 'vol_1',
        topic,
        preferredDate,
        preferredTime,
        message
      });

      Utils.closeModal('modal-guidance-request');
      form.reset();
      Utils.showToast('Request Created', 'Your guidance session request has been submitted to your volunteer mentor.', 'success');
      renderSessions();
      renderOverview();
    };
  };

  // Section D: Learning Resources
  const renderResources = (categoryFilter = 'all') => {
    const container = document.getElementById('resources-list-container');
    if (!container) return;

    let resources = StorageService.getResources();
    if (categoryFilter !== 'all') {
      resources = resources.filter(r => r.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    const completed = currentStudent.completedResources || [];

    let html = '';
    resources.forEach(res => {
      const isCompleted = completed.includes(res.id);
      html += `
        <div class="resource-card">
          <div class="resource-category">${Utils.escapeHtml(res.category)}</div>
          <div class="resource-title">${Utils.escapeHtml(res.title)}</div>
          <div class="resource-desc">${Utils.escapeHtml(res.description)}</div>
          <div class="resource-footer">
            ${res.url ? `<a href="${Utils.escapeHtml(res.url)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">External Link &rarr;</a>` : '<span></span>'}
            <button class="btn btn-sm ${isCompleted ? 'btn-secondary' : 'btn-soft'}" onclick="StudentApp.toggleResource('${res.id}')">
              ${isCompleted ? '✓ Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  const toggleResource = (resourceId) => {
    const isNowCompleted = StorageService.toggleResourceCompleted(currentStudent.id, resourceId);
    currentStudent = StorageService.getStudentById(currentStudent.id);
    renderResources();
    renderOverview();
    Utils.showToast(
      isNowCompleted ? 'Progress Updated' : 'Marked Incomplete',
      isNowCompleted ? 'Resource marked as completed!' : 'Resource removed from completed list.',
      'success'
    );
  };

  // Section E: Activities
  const renderActivities = () => {
    const container = document.getElementById('activities-list-container');
    if (!container) return;

    const activities = StorageService.getActivities();
    const enrolled = currentStudent.enrolledActivities || [];

    let html = '';
    activities.forEach(act => {
      const isEnrolled = enrolled.includes(act.id);
      html += `
        <div class="card" style="margin-bottom: 16px;">
          <div class="card-body">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
              <div>
                <span class="status-pill status-scheduled">${Utils.escapeHtml(act.category)}</span>
                <h4 style="margin-top:6px; color:var(--color-wenge);">${Utils.escapeHtml(act.title)}</h4>
              </div>
              <button class="btn btn-sm ${isEnrolled ? 'btn-secondary' : 'btn-primary'}" onclick="StudentApp.toggleActivity('${act.id}')">
                ${isEnrolled ? '✓ Enrolled' : 'Register / RSVP'}
              </button>
            </div>
            <p style="font-size:0.9rem; color:var(--color-liver); margin-bottom:12px;">${Utils.escapeHtml(act.description)}</p>
            <div style="display:flex; gap:16px; font-size:0.82rem; color:var(--color-liver); flex-wrap:wrap;">
              <span>📅 <strong>${Utils.formatDate(act.date)}</strong> (${act.time})</span>
              <span>📍 <strong>${Utils.escapeHtml(act.location)}</strong></span>
              <span>👥 <strong>${act.enrolledCount} / ${act.capacity}</strong> attendees</span>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  const toggleActivity = (activityId) => {
    const isEnrolled = StorageService.toggleActivityEnrollment(currentStudent.id, activityId);
    currentStudent = StorageService.getStudentById(currentStudent.id);
    renderActivities();
    renderOverview();
    Utils.showToast(
      isEnrolled ? 'RSVP Confirmed' : 'Registration Cancelled',
      isEnrolled ? 'You are registered for this activity!' : 'You have unregistered from this activity.',
      'info'
    );
  };

  // Section F: Notifications
  const renderNotifications = () => {
    const container = document.getElementById('student-notif-list');
    const badge = document.getElementById('notif-badge-count');
    if (!container) return;

    const allNotifs = StorageService.getNotifications();
    const relevantNotifs = allNotifs.filter(n => n.targetRole === 'all' || (n.targetRole === 'student' && (!n.studentId || n.studentId === currentStudent.id)));

    const unreadCount = relevantNotifs.filter(n => !(n.readBy || []).includes(currentStudent.id)).length;
    if (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    if (relevantNotifs.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No notifications.</p></div>';
      return;
    }

    let html = '';
    relevantNotifs.forEach(notif => {
      const isRead = (notif.readBy || []).includes(currentStudent.id);
      html += `
        <div class="card" style="margin-bottom:12px; border-left: 4px solid ${isRead ? 'var(--border-subtle)' : 'var(--color-puce-red)'};">
          <div class="card-body" style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700; color:var(--color-wenge); font-size:0.95rem;">${Utils.escapeHtml(notif.title)}</div>
              <div style="font-size:0.88rem; color:var(--text-primary); margin-top:4px;">${Utils.escapeHtml(notif.message)}</div>
              <div style="font-size:0.75rem; color:var(--color-liver); margin-top:6px;">${Utils.formatDate(notif.createdAt)}</div>
            </div>
            <div>
              ${!isRead ? `<button class="btn btn-sm btn-soft" onclick="StudentApp.markNotificationRead('${notif.id}')">Mark Read</button>` : '<span style="font-size:0.78rem; color:var(--color-liver);">Read</span>'}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  const markNotificationRead = (notifId) => {
    StorageService.markNotificationRead(notifId, currentStudent.id);
    renderNotifications();
  };

  // Section G: Profile
  const renderProfile = () => {
    const regEl = document.getElementById('profile-reg-number');
    const nameInput = document.getElementById('profile-name');
    const deptInput = document.getElementById('profile-department');
    const yearInput = document.getElementById('profile-year');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const interestsInput = document.getElementById('profile-interests');
    const bioInput = document.getElementById('profile-bio');

    if (regEl) regEl.textContent = currentStudent.regNumber;
    if (nameInput) nameInput.value = currentStudent.name;
    if (deptInput) deptInput.value = currentStudent.department;
    if (yearInput) yearInput.value = currentStudent.year;
    if (emailInput) emailInput.value = currentStudent.email || '';
    if (phoneInput) phoneInput.value = currentStudent.phone || '';
    if (interestsInput) interestsInput.value = currentStudent.interests || '';
    if (bioInput) bioInput.value = currentStudent.bio || '';

    const form = document.getElementById('form-student-profile');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const updates = {
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          interests: interestsInput.value.trim(),
          bio: bioInput.value.trim()
        };
        StorageService.updateStudent(currentStudent.id, updates);
        currentStudent = StorageService.getStudentById(currentStudent.id);
        Utils.showToast('Profile Saved', 'Your profile details have been saved in browser storage.', 'success');
        renderStudentHeader();
      };
    }
  };

  return {
    init,
    openNewRequestModal,
    toggleResource,
    toggleActivity,
    markNotificationRead
  };
})();
