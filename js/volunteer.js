/**
 * IMPACTHUB - VOLUNTEER DASHBOARD CONTROLLER
 */

const VolunteerApp = (() => {
  let currentVolunteer = null;
  let currentSession = null;

  const init = () => {
    currentSession = AuthService.requireAuth(CONFIG.ROLES.VOLUNTEER);
    if (!currentSession) return;

    currentVolunteer = StorageService.getVolunteerById(currentSession.userId);
    if (!currentVolunteer) {
      alert('Volunteer record not found. Please log in again.');
      AuthService.logout();
      return;
    }

    setupVolunteerNav();
    renderVolunteerHeader();
    renderOverview();
    renderMyStudents();
    renderGuidanceRequests();
    renderSessions();
    renderGuidanceNotes();
    renderAvailability();
    renderProfile();
    renderNotifications();
    setupModals();
  };

  const setupVolunteerNav = () => {
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

        // Close mobile drawer
        document.body.classList.remove('sidebar-open');

        // Refresh views
        if (targetSection === 'sec-vol-overview') renderOverview();
        if (targetSection === 'sec-vol-students') renderMyStudents();
        if (targetSection === 'sec-vol-requests') renderGuidanceRequests();
        if (targetSection === 'sec-vol-sessions') renderSessions();
        if (targetSection === 'sec-vol-notes') renderGuidanceNotes();
        if (targetSection === 'sec-vol-availability') renderAvailability();
        if (targetSection === 'sec-vol-notifications') renderNotifications();
      });
    });
  };

  const renderVolunteerHeader = () => {
    const nameEl = document.getElementById('volunteer-topbar-name');
    const avatarEl = document.getElementById('volunteer-topbar-avatar');
    const welcomeEl = document.getElementById('volunteer-welcome-name');

    if (nameEl) nameEl.textContent = currentVolunteer.name;
    if (avatarEl) avatarEl.textContent = currentVolunteer.name.charAt(0);
    if (welcomeEl) welcomeEl.textContent = currentVolunteer.name;

    const sideName = document.getElementById('sidebar-user-name');
    const sideSub = document.getElementById('sidebar-user-sub');
    const sideAvatar = document.getElementById('sidebar-user-avatar');
    if (sideName) sideName.textContent = currentVolunteer.name;
    if (sideSub) sideSub.textContent = currentVolunteer.expertise;
    if (sideAvatar) sideAvatar.textContent = currentVolunteer.name.charAt(0);
  };

  // Section A: Overview
  const renderOverview = () => {
    currentVolunteer = StorageService.getVolunteerById(currentVolunteer.id);

    const assignments = StorageService.getAssignmentsByVolunteerId(currentVolunteer.id);
    const allSessions = StorageService.getSessions().filter(s => s.volunteerId === currentVolunteer.id);
    const scheduled = allSessions.filter(s => s.status === CONFIG.STATUS.SCHEDULED);
    const completed = allSessions.filter(s => s.status === CONFIG.STATUS.COMPLETED);
    const requests = StorageService.getGuidanceRequests().filter(r => r.volunteerId === currentVolunteer.id && r.status === CONFIG.STATUS.REQUESTED);

    const stuCountEl = document.getElementById('vol-stat-students');
    const schedCountEl = document.getElementById('vol-stat-scheduled');
    const compCountEl = document.getElementById('vol-stat-completed');
    const reqCountEl = document.getElementById('vol-stat-requests');

    if (stuCountEl) stuCountEl.textContent = assignments.length;
    if (schedCountEl) schedCountEl.textContent = scheduled.length;
    if (compCountEl) compCountEl.textContent = completed.length;
    if (reqCountEl) reqCountEl.textContent = requests.length;

    // Upcoming sessions table in overview
    const upcomingContainer = document.getElementById('vol-overview-sessions');
    if (upcomingContainer) {
      if (scheduled.length === 0) {
        upcomingContainer.innerHTML = '<div class="empty-state" style="padding:24px;"><p>No sessions scheduled this week.</p></div>';
      } else {
        let html = '';
        scheduled.forEach(ses => {
          const student = StorageService.getStudentById(ses.studentId);
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
                  <span>Student: <strong>${student ? Utils.escapeHtml(student.name) : 'Student'}</strong> (${student ? student.year : ''})</span>
                  <span>Time: <strong>${ses.sessionTime}</strong></span>
                  <span>Location: <strong>${Utils.escapeHtml(ses.location)}</strong></span>
                </div>
              </div>
              <div>
                <button class="btn btn-sm btn-primary" onclick="VolunteerApp.openCompleteSessionModal('${ses.id}')">Complete</button>
              </div>
            </div>
          `;
        });
        upcomingContainer.innerHTML = html;
      }
    }
  };

  // Section B: My Students
  const renderMyStudents = () => {
    const container = document.getElementById('vol-students-container');
    if (!container) return;

    const assignments = StorageService.getAssignmentsByVolunteerId(currentVolunteer.id);
    if (assignments.length === 0) {
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h4>No Assigned Students Yet</h4>
            <p>The administrator assigns students based on your expertise. When paired, their profiles will appear here.</p>
          </div>
        </div>
      `;
      return;
    }

    let html = '<div class="dashboard-grid-equal">';
    assignments.forEach(asg => {
      const student = StorageService.getStudentById(asg.studentId);
      if (!student) return;
      const notes = StorageService.getNotesByStudentId(student.id).filter(n => n.volunteerId === currentVolunteer.id);

      html += `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${Utils.escapeHtml(student.name)}</h3>
            <span class="status-pill status-active">Active Mentee</span>
          </div>
          <div class="card-body">
            <div style="font-size:0.88rem; color:var(--color-liver); margin-bottom:12px;">
              <div><strong>Registration:</strong> ${student.regNumber}</div>
              <div><strong>Department:</strong> ${Utils.escapeHtml(student.department)}</div>
              <div><strong>Year:</strong> ${student.year}</div>
              <div><strong>Email:</strong> ${Utils.escapeHtml(student.email || 'N/A')}</div>
            </div>
            <div style="margin-bottom:14px;">
              <strong style="font-size:0.82rem; text-transform:uppercase; color:var(--color-wenge);">Guidance Interests:</strong>
              <p style="font-size:0.86rem; color:var(--text-primary); margin-top:2px;">${Utils.escapeHtml(student.interests || 'General Academic Guidance')}</p>
            </div>
            <div style="font-size:0.82rem; color:var(--color-liver); margin-bottom:16px;">
              <strong>Active Notes:</strong> ${notes.length} guidance notes recorded
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-outline btn-sm" onclick="VolunteerApp.openNewNoteModal('${student.id}', '${Utils.escapeHtml(student.name)}')">+ Add Note</button>
              <button class="btn btn-primary btn-sm" onclick="VolunteerApp.openScheduleSessionModal('${student.id}')">Schedule Session</button>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  };

  // Section C: Guidance Requests
  const renderGuidanceRequests = () => {
    const container = document.getElementById('vol-requests-table-body');
    if (!container) return;

    const requests = StorageService.getGuidanceRequests().filter(r => r.volunteerId === currentVolunteer.id);

    if (requests.length === 0) {
      container.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No guidance requests found.</td></tr>';
      return;
    }

    let html = '';
    requests.forEach(req => {
      const student = StorageService.getStudentById(req.studentId);
      const isPending = req.status === CONFIG.STATUS.REQUESTED;

      html += `
        <tr>
          <td><strong>${student ? Utils.escapeHtml(student.name) : 'Student'}</strong><br><small class="text-muted">${student ? student.regNumber : ''}</small></td>
          <td><strong>${Utils.escapeHtml(req.topic)}</strong><br><small class="text-muted">${Utils.escapeHtml(req.message || '')}</small></td>
          <td>${Utils.formatDate(req.preferredDate)} (${req.preferredTime || 'Flexible'})</td>
          <td>${Utils.renderStatusBadge(req.status)}</td>
          <td>${Utils.formatDate(req.submittedAt)}</td>
          <td>
            ${isPending ? `
              <div class="action-buttons-cell">
                <button class="btn btn-sm btn-primary" onclick="VolunteerApp.acceptAndScheduleRequest('${req.id}', '${req.studentId}', '${Utils.escapeHtml(req.topic)}', '${req.preferredDate}', '${req.preferredTime || '14:00'}')">Accept &amp; Schedule</button>
                <button class="btn btn-sm btn-outline" onclick="VolunteerApp.declineRequest('${req.id}')">Decline</button>
              </div>
            ` : `<span class="text-muted" style="font-size:0.8rem;">Processed</span>`}
          </td>
        </tr>
      `;
    });

    container.innerHTML = html;
  };

  const acceptAndScheduleRequest = (reqId, studentId, topic, date, time) => {
    document.getElementById('sched-req-id').value = reqId;
    document.getElementById('sched-student-id').value = studentId;
    document.getElementById('sched-topic').value = topic;
    document.getElementById('sched-date').value = date;
    document.getElementById('sched-time').value = time;
    Utils.openModal('modal-schedule-session');
  };

  const declineRequest = (reqId) => {
    Utils.showConfirmDialog(
      'Decline Guidance Request',
      'Are you sure you want to decline this request? The student will be notified respectfully.',
      () => {
        StorageService.updateGuidanceRequest(reqId, {
          status: CONFIG.STATUS.DECLINED,
          responseMessage: 'Declined due to scheduling constraints.'
        });
        Utils.showToast('Request Declined', 'Guidance request updated.', 'info');
        renderGuidanceRequests();
        renderOverview();
      },
      'Decline',
      true
    );
  };

  // Section D: Manage Sessions
  const renderSessions = () => {
    const container = document.getElementById('vol-sessions-table-body');
    if (!container) return;

    const sessions = StorageService.getSessions().filter(s => s.volunteerId === currentVolunteer.id);

    if (sessions.length === 0) {
      container.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No guidance sessions recorded.</td></tr>';
      return;
    }

    let html = '';
    sessions.forEach(ses => {
      const student = StorageService.getStudentById(ses.studentId);
      const isScheduled = ses.status === CONFIG.STATUS.SCHEDULED;

      html += `
        <tr>
          <td><strong>${student ? Utils.escapeHtml(student.name) : 'Student'}</strong></td>
          <td><strong>${Utils.escapeHtml(ses.topic)}</strong></td>
          <td>${Utils.formatDate(ses.sessionDate)} at ${ses.sessionTime}</td>
          <td>${Utils.escapeHtml(ses.location || 'Virtual Pod')}</td>
          <td>${Utils.renderStatusBadge(ses.status)}</td>
          <td>
            ${isScheduled ? `
              <div class="action-buttons-cell">
                <button class="btn btn-sm btn-primary" onclick="VolunteerApp.openCompleteSessionModal('${ses.id}')">Complete</button>
                <button class="btn btn-sm btn-outline" onclick="VolunteerApp.cancelSession('${ses.id}')">Cancel</button>
              </div>
            ` : `<small class="text-muted">${ses.summary ? 'Summary logged' : 'Concluded'}</small>`}
          </td>
        </tr>
      `;
    });

    container.innerHTML = html;
  };

  const openCompleteSessionModal = (sessionId) => {
    const ses = StorageService.getSessions().find(s => s.id === sessionId);
    if (!ses) return;

    document.getElementById('complete-session-id').value = sessionId;
    document.getElementById('complete-session-topic').textContent = ses.topic;
    document.getElementById('complete-session-summary').value = ses.summary || '';
    document.getElementById('complete-session-actions').value = ses.actionItems || '';
    Utils.openModal('modal-complete-session');
  };

  const cancelSession = (sessionId) => {
    Utils.showConfirmDialog(
      'Cancel Session',
      'Are you sure you want to cancel this scheduled guidance session?',
      () => {
        StorageService.updateSession(sessionId, { status: CONFIG.STATUS.CANCELLED });
        Utils.showToast('Session Cancelled', 'Session status updated.', 'info');
        renderSessions();
        renderOverview();
      },
      'Cancel Session',
      true
    );
  };

  // Section E: Guidance Notes
  const renderGuidanceNotes = () => {
    const container = document.getElementById('vol-notes-container');
    if (!container) return;

    const notes = StorageService.getNotesByVolunteerId(currentVolunteer.id);
    if (notes.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No developmental notes created yet.</p></div>';
      return;
    }

    let html = '';
    notes.forEach(note => {
      const student = StorageService.getStudentById(note.studentId);
      html += `
        <div class="guidance-note-card">
          <div class="note-header">
            <div>
              <span class="note-student-tag">${Utils.escapeHtml(note.title)}</span>
              <span style="font-size:0.8rem; color:var(--color-liver); margin-left:8px;">(Mentee: ${student ? Utils.escapeHtml(student.name) : 'Student'})</span>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="note-date">${Utils.formatDate(note.createdAt)}</span>
              <button class="btn btn-sm btn-outline" style="padding:2px 8px;" onclick="VolunteerApp.deleteNote('${note.id}')">&times;</button>
            </div>
          </div>
          <div class="note-body">${Utils.escapeHtml(note.content)}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  const openNewNoteModal = (studentId = '', studentName = '') => {
    const studentSelect = document.getElementById('note-student-select');
    if (studentSelect) {
      const assignments = StorageService.getAssignmentsByVolunteerId(currentVolunteer.id);
      let options = '';
      assignments.forEach(asg => {
        const s = StorageService.getStudentById(asg.studentId);
        if (s) {
          const selected = s.id === studentId ? 'selected' : '';
          options += `<option value="${s.id}" ${selected}>${Utils.escapeHtml(s.name)} (${s.regNumber})</option>`;
        }
      });
      studentSelect.innerHTML = options || '<option value="">No assigned students</option>';
    }

    Utils.openModal('modal-add-note');
  };

  const deleteNote = (noteId) => {
    Utils.showConfirmDialog(
      'Delete Guidance Note',
      'Are you sure you want to delete this developmental note?',
      () => {
        StorageService.deleteNote(noteId);
        Utils.showToast('Note Deleted', 'The note has been removed.', 'info');
        renderGuidanceNotes();
      },
      'Delete',
      true
    );
  };

  // Section F: Availability
  const renderAvailability = () => {
    const input = document.getElementById('vol-avail-text');
    if (input) input.value = currentVolunteer.availability || '';

    const form = document.getElementById('form-vol-availability');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const updatedAvail = input.value.trim();
        StorageService.updateVolunteer(currentVolunteer.id, { availability: updatedAvail });
        currentVolunteer = StorageService.getVolunteerById(currentVolunteer.id);
        Utils.showToast('Availability Saved', 'Your available days and hours have been updated in storage.', 'success');
      };
    }
  };

  // Section G: Profile
  const renderProfile = () => {
    const idEl = document.getElementById('vol-profile-id');
    const nameInput = document.getElementById('vol-profile-name');
    const expInput = document.getElementById('vol-profile-expertise');
    const skillsInput = document.getElementById('vol-profile-skills');
    const emailInput = document.getElementById('vol-profile-email');
    const phoneInput = document.getElementById('vol-profile-phone');
    const bioInput = document.getElementById('vol-profile-bio');

    if (idEl) idEl.textContent = currentVolunteer.volunteerId;
    if (nameInput) nameInput.value = currentVolunteer.name;
    if (expInput) expInput.value = currentVolunteer.expertise;
    if (skillsInput) skillsInput.value = currentVolunteer.skills || '';
    if (emailInput) emailInput.value = currentVolunteer.email || '';
    if (phoneInput) phoneInput.value = currentVolunteer.phone || '';
    if (bioInput) bioInput.value = currentVolunteer.bio || '';

    const form = document.getElementById('form-vol-profile');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const updates = {
          skills: skillsInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          bio: bioInput.value.trim()
        };
        StorageService.updateVolunteer(currentVolunteer.id, updates);
        currentVolunteer = StorageService.getVolunteerById(currentVolunteer.id);
        Utils.showToast('Profile Updated', 'Profile information updated successfully.', 'success');
        renderVolunteerHeader();
      };
    }
  };

  // Section H: Notifications
  const renderNotifications = () => {
    const container = document.getElementById('vol-notif-list');
    const badge = document.getElementById('notif-badge-count');
    if (!container) return;

    const notifs = StorageService.getNotifications().filter(n => n.targetRole === 'all' || n.targetRole === 'volunteer');
    const unread = notifs.filter(n => !(n.readBy || []).includes(currentVolunteer.id)).length;
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'flex' : 'none';
    }

    if (notifs.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No announcements or alerts.</p></div>';
      return;
    }

    let html = '';
    notifs.forEach(n => {
      html += `
        <div class="card" style="margin-bottom:12px;">
          <div class="card-body" style="padding:16px 20px;">
            <div style="font-weight:700; color:var(--color-wenge);">${Utils.escapeHtml(n.title)}</div>
            <div style="font-size:0.88rem; color:var(--text-primary); margin-top:4px;">${Utils.escapeHtml(n.message)}</div>
            <div style="font-size:0.75rem; color:var(--color-liver); margin-top:6px;">${Utils.formatDate(n.createdAt)}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  // Setup Modals
  const setupModals = () => {
    // Complete Session form
    const compForm = document.getElementById('form-complete-session');
    if (compForm) {
      compForm.onsubmit = (e) => {
        e.preventDefault();
        const sesId = document.getElementById('complete-session-id').value;
        const summary = document.getElementById('complete-session-summary').value.trim();
        const actions = document.getElementById('complete-session-actions').value.trim();

        StorageService.updateSession(sesId, {
          status: CONFIG.STATUS.COMPLETED,
          summary,
          actionItems: actions
        });

        Utils.closeModal('modal-complete-session');
        Utils.showToast('Session Completed', 'Session marked as completed with summary notes.', 'success');
        renderSessions();
        renderOverview();
      };
    }

    // Schedule Session form (from request or direct)
    const schedForm = document.getElementById('form-schedule-session');
    if (schedForm) {
      schedForm.onsubmit = (e) => {
        e.preventDefault();
        const reqId = document.getElementById('sched-req-id').value;
        const studentId = document.getElementById('sched-student-id').value;
        const topic = document.getElementById('sched-topic').value.trim();
        const date = document.getElementById('sched-date').value;
        const time = document.getElementById('sched-time').value;
        const location = document.getElementById('sched-location').value.trim();

        // Create session
        StorageService.createSession({
          studentId,
          volunteerId: currentVolunteer.id,
          topic,
          sessionDate: date,
          sessionTime: time,
          location: location || 'Virtual Guidance Room A'
        });

        // Update request status if linked
        if (reqId) {
          StorageService.updateGuidanceRequest(reqId, {
            status: CONFIG.STATUS.SCHEDULED,
            responseMessage: `Scheduled for ${date} at ${time}`
          });
        }

        Utils.closeModal('modal-schedule-session');
        schedForm.reset();
        Utils.showToast('Session Scheduled', 'Session scheduled and reflected in student portal.', 'success');
        renderSessions();
        renderGuidanceRequests();
        renderOverview();
      };
    }

    // Add note form
    const noteForm = document.getElementById('form-add-note');
    if (noteForm) {
      noteForm.onsubmit = (e) => {
        e.preventDefault();
        const studentId = document.getElementById('note-student-select').value;
        const title = document.getElementById('note-title-input').value.trim();
        const content = document.getElementById('note-content-input').value.trim();

        if (!studentId || !title || !content) {
          Utils.showToast('Required Fields', 'Please complete all note fields.', 'danger');
          return;
        }

        StorageService.createNote({
          volunteerId: currentVolunteer.id,
          studentId,
          title,
          content
        });

        Utils.closeModal('modal-add-note');
        noteForm.reset();
        Utils.showToast('Note Added', 'Developmental note linked to student.', 'success');
        renderGuidanceNotes();
      };
    }
  };

  const openScheduleSessionModal = (studentId) => {
    document.getElementById('sched-req-id').value = '';
    document.getElementById('sched-student-id').value = studentId;
    document.getElementById('sched-topic').value = 'One-on-One Mentoring Session';
    document.getElementById('sched-date').value = '';
    document.getElementById('sched-time').value = '14:00';
    Utils.openModal('modal-schedule-session');
  };

  return {
    init,
    openCompleteSessionModal,
    cancelSession,
    acceptAndScheduleRequest,
    declineRequest,
    openNewNoteModal,
    deleteNote,
    openScheduleSessionModal
  };
})();
