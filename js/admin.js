/**
 * IMPACTHUB - ADMINISTRATIVE DASHBOARD CONTROLLER
 */

const AdminApp = (() => {
  let currentAdminSession = null;

  const init = () => {
    currentAdminSession = AuthService.requireAuth(CONFIG.ROLES.ADMIN);
    if (!currentAdminSession) return;

    setupAdminNav();
    renderOverview();
    renderStudentsTable();
    renderVolunteersTable();
    renderMentorAssignments();
    renderGuidanceRequests();
    renderActivitiesManagement();
    renderResourcesManagement();
    renderAnalytics();
    renderAnnouncements();
    setupAdminModals();
  };

  const setupAdminNav = () => {
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

        // Refresh views on tab change
        if (targetSection === 'sec-admin-overview') renderOverview();
        if (targetSection === 'sec-admin-students') renderStudentsTable();
        if (targetSection === 'sec-admin-volunteers') renderVolunteersTable();
        if (targetSection === 'sec-admin-assignments') renderMentorAssignments();
        if (targetSection === 'sec-admin-requests') renderGuidanceRequests();
        if (targetSection === 'sec-admin-activities') renderActivitiesManagement();
        if (targetSection === 'sec-admin-resources') renderResourcesManagement();
        if (targetSection === 'sec-admin-analytics') renderAnalytics();
        if (targetSection === 'sec-admin-announcements') renderAnnouncements();
      });
    });
  };

  // Section A: Overview Metrics (Calculated dynamically)
  const renderOverview = () => {
    const stats = StorageService.getPlatformStats();

    const stuEl = document.getElementById('stat-total-students');
    const volEl = document.getElementById('stat-total-volunteers');
    const pendEl = document.getElementById('stat-pending-volunteers');
    const asgEl = document.getElementById('stat-active-assignments');
    const reqEl = document.getElementById('stat-total-requests');
    const sesEl = document.getElementById('stat-completed-sessions');

    if (stuEl) stuEl.textContent = stats.totalStudents;
    if (volEl) volEl.textContent = stats.totalVolunteers;
    if (pendEl) pendEl.textContent = stats.pendingVolunteers;
    if (asgEl) asgEl.textContent = stats.activeAssignments;
    if (reqEl) reqEl.textContent = stats.totalRequests;
    if (sesEl) sesEl.textContent = stats.completedSessions;

    // Render Recent Activity Stream
    const streamContainer = document.getElementById('admin-activity-stream');
    if (streamContainer) {
      const recentSessions = StorageService.getSessions().slice(0, 3);
      const recentReqs = StorageService.getGuidanceRequests().slice(0, 2);

      let html = '';
      recentSessions.forEach(s => {
        const student = StorageService.getStudentById(s.studentId);
        const vol = StorageService.getVolunteerById(s.volunteerId);
        html += `
          <div style="padding:12px 0; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:var(--color-wenge);">${Utils.escapeHtml(s.topic)}</strong>
              <div style="font-size:0.82rem; color:var(--color-liver);">${student ? Utils.escapeHtml(student.name) : 'Student'} &amp; ${vol ? Utils.escapeHtml(vol.name) : 'Mentor'}</div>
            </div>
            <div>${Utils.renderStatusBadge(s.status)}</div>
          </div>
        `;
      });
      streamContainer.innerHTML = html || '<p class="text-muted">No recent activities recorded.</p>';
    }
  };

  // Section B: Student Management
  const renderStudentsTable = () => {
    const tableBody = document.getElementById('admin-students-table-body');
    const searchInput = document.getElementById('admin-student-search');
    const deptFilter = document.getElementById('admin-student-filter-dept');
    if (!tableBody) return;

    let students = StorageService.getStudents();
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const deptVal = deptFilter ? deptFilter.value : 'all';

    if (query) {
      students = students.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.regNumber.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query)
      );
    }

    if (deptVal !== 'all') {
      students = students.filter(s => s.department === deptVal);
    }

    if (students.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No student records found.</td></tr>';
      return;
    }

    let html = '';
    students.forEach(s => {
      const assignment = StorageService.getAssignmentByStudentId(s.id);
      const mentor = assignment ? StorageService.getVolunteerById(assignment.volunteerId) : null;
      const isActive = s.status === CONFIG.STATUS.ACTIVE;

      html += `
        <tr>
          <td><strong>${Utils.escapeHtml(s.name)}</strong></td>
          <td><code>${s.regNumber}</code></td>
          <td>${Utils.escapeHtml(s.department)}<br><small class="text-muted">${s.year}</small></td>
          <td>${mentor ? `<span style="color:var(--color-puce-red); font-weight:600;">${Utils.escapeHtml(mentor.name)}</span>` : '<span class="text-muted">Unassigned</span>'}</td>
          <td>${Utils.renderStatusBadge(s.status)}</td>
          <td>
            <div class="action-buttons-cell">
              <button class="btn btn-sm btn-outline" onclick="AdminApp.openEditStudentModal('${s.id}')">Edit</button>
              <button class="btn btn-sm ${isActive ? 'btn-soft' : 'btn-secondary'}" onclick="AdminApp.toggleStudentStatus('${s.id}')">
                ${isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button class="btn btn-sm btn-danger" onclick="AdminApp.deleteStudent('${s.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
  };

  const openEditStudentModal = (studentId) => {
    const student = StorageService.getStudentById(studentId);
    if (!student) return;

    document.getElementById('edit-stu-id').value = student.id;
    document.getElementById('edit-stu-name').value = student.name;
    document.getElementById('edit-stu-reg').value = student.regNumber;
    document.getElementById('edit-stu-dept').value = student.department;
    document.getElementById('edit-stu-year').value = student.year;
    document.getElementById('edit-stu-email').value = student.email || '';
    document.getElementById('edit-stu-phone').value = student.phone || '';
    document.getElementById('edit-stu-interests').value = student.interests || '';

    Utils.openModal('modal-edit-student');
  };

  const toggleStudentStatus = (studentId) => {
    const student = StorageService.getStudentById(studentId);
    if (!student) return;

    const newStatus = student.status === CONFIG.STATUS.ACTIVE ? CONFIG.STATUS.INACTIVE : CONFIG.STATUS.ACTIVE;
    StorageService.updateStudent(studentId, { status: newStatus });
    Utils.showToast('Student Updated', `${student.name} is now marked as ${newStatus}.`, 'info');
    renderStudentsTable();
    renderOverview();
  };

  const deleteStudent = (studentId) => {
    const student = StorageService.getStudentById(studentId);
    if (!student) return;

    Utils.showConfirmDialog(
      'Delete Student Record',
      `Are you sure you want to permanently delete student ${student.name} (${student.regNumber})? This will also remove associated active assignments.`,
      () => {
        StorageService.deleteStudent(studentId);
        Utils.showToast('Student Deleted', `${student.name} deleted successfully.`, 'info');
        renderStudentsTable();
        renderMentorAssignments();
        renderOverview();
      },
      'Delete Record',
      true
    );
  };

  // Section C: Volunteer Management
  const renderVolunteersTable = () => {
    const tableBody = document.getElementById('admin-volunteers-table-body');
    const searchInput = document.getElementById('admin-vol-search');
    const statusFilter = document.getElementById('admin-vol-filter-status');
    if (!tableBody) return;

    let volunteers = StorageService.getVolunteers();
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const statusVal = statusFilter ? statusFilter.value : 'all';

    if (query) {
      volunteers = volunteers.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.volunteerId.toLowerCase().includes(query) ||
        v.expertise.toLowerCase().includes(query)
      );
    }

    if (statusVal !== 'all') {
      volunteers = volunteers.filter(v => v.status === statusVal);
    }

    if (volunteers.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No volunteer records found.</td></tr>';
      return;
    }

    let html = '';
    volunteers.forEach(v => {
      const isPending = v.status === CONFIG.STATUS.PENDING;
      const isApproved = v.status === CONFIG.STATUS.APPROVED;
      const assignedCount = StorageService.getAssignmentsByVolunteerId(v.id).length;

      html += `
        <tr>
          <td><strong>${Utils.escapeHtml(v.name)}</strong><br><small class="text-muted"><code>${v.volunteerId}</code></small></td>
          <td>${Utils.escapeHtml(v.expertise)}<br><small class="text-muted">${Utils.escapeHtml(v.skills || '')}</small></td>
          <td>${Utils.escapeHtml(v.availability || 'Weekdays')}</td>
          <td><span style="font-weight:600; color:var(--color-wenge);">${assignedCount} students</span></td>
          <td>${Utils.renderStatusBadge(v.status)}</td>
          <td>
            <div class="action-buttons-cell">
              ${isPending ? `
                <button class="btn btn-sm btn-primary" onclick="AdminApp.approveVolunteer('${v.id}')">Approve</button>
                <button class="btn btn-sm btn-outline" onclick="AdminApp.rejectVolunteer('${v.id}')">Reject</button>
              ` : `
                <button class="btn btn-sm btn-outline" onclick="AdminApp.openEditVolunteerModal('${v.id}')">Edit</button>
                <button class="btn btn-sm ${isApproved ? 'btn-soft' : 'btn-secondary'}" onclick="AdminApp.toggleVolunteerStatus('${v.id}')">
                  ${isApproved ? 'Deactivate' : 'Activate'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="AdminApp.deleteVolunteer('${v.id}')">Delete</button>
              `}
            </div>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
  };

  const approveVolunteer = (volunteerId) => {
    const v = StorageService.updateVolunteer(volunteerId, { status: CONFIG.STATUS.APPROVED });
    Utils.showToast('Application Approved', `${v.name} has been approved and can now access the Volunteer portal.`, 'success');
    renderVolunteersTable();
    renderMentorAssignments();
    renderOverview();
  };

  const rejectVolunteer = (volunteerId) => {
    Utils.showConfirmDialog(
      'Reject Volunteer Application',
      'Are you sure you want to reject this volunteer application?',
      () => {
        const v = StorageService.updateVolunteer(volunteerId, { status: CONFIG.STATUS.REJECTED });
        Utils.showToast('Application Rejected', `${v.name} marked as rejected.`, 'info');
        renderVolunteersTable();
        renderOverview();
      },
      'Reject Application',
      true
    );
  };

  const toggleVolunteerStatus = (volunteerId) => {
    const v = StorageService.getVolunteerById(volunteerId);
    if (!v) return;
    const newStatus = v.status === CONFIG.STATUS.APPROVED ? CONFIG.STATUS.INACTIVE : CONFIG.STATUS.APPROVED;
    StorageService.updateVolunteer(volunteerId, { status: newStatus });
    Utils.showToast('Volunteer Updated', `${v.name} status updated to ${newStatus}.`, 'info');
    renderVolunteersTable();
    renderOverview();
  };

  const openEditVolunteerModal = (volunteerId) => {
    const v = StorageService.getVolunteerById(volunteerId);
    if (!v) return;

    document.getElementById('edit-vol-id').value = v.id;
    document.getElementById('edit-vol-name').value = v.name;
    document.getElementById('edit-vol-expertise').value = v.expertise;
    document.getElementById('edit-vol-skills').value = v.skills || '';
    document.getElementById('edit-vol-avail').value = v.availability || '';
    document.getElementById('edit-vol-email').value = v.email || '';

    Utils.openModal('modal-edit-volunteer');
  };

  const deleteVolunteer = (volunteerId) => {
    const v = StorageService.getVolunteerById(volunteerId);
    if (!v) return;

    Utils.showConfirmDialog(
      'Delete Volunteer Profile',
      `Are you sure you want to permanently delete volunteer ${v.name}? Any active mentee pairings will be unlinked.`,
      () => {
        StorageService.deleteVolunteer(volunteerId);
        Utils.showToast('Volunteer Deleted', `${v.name} deleted.`, 'info');
        renderVolunteersTable();
        renderMentorAssignments();
        renderOverview();
      },
      'Delete',
      true
    );
  };

  // Section D: Mentor Assignment
  const renderMentorAssignments = () => {
    const tableBody = document.getElementById('admin-assignments-table-body');
    const studentSelect = document.getElementById('asg-student-select');
    const volunteerSelect = document.getElementById('asg-volunteer-select');
    if (!tableBody) return;

    const students = StorageService.getStudents();
    const volunteers = StorageService.getVolunteers();
    const assignments = StorageService.getAssignments().filter(a => a.status === 'Active');

    // Populate assignment dropdowns
    if (studentSelect) {
      let stuOpts = '<option value="">-- Choose Student --</option>';
      students.forEach(s => {
        const curAsg = StorageService.getAssignmentByStudentId(s.id);
        const curMentor = curAsg ? StorageService.getVolunteerById(curAsg.volunteerId) : null;
        stuOpts += `<option value="${s.id}">${Utils.escapeHtml(s.name)} (${s.regNumber}) - ${curMentor ? 'Current: ' + curMentor.name : 'Unpaired'}</option>`;
      });
      studentSelect.innerHTML = stuOpts;
    }

    if (volunteerSelect) {
      let volOpts = '<option value="">-- Choose Approved Volunteer --</option>';
      volunteers.filter(v => v.status === CONFIG.STATUS.APPROVED).forEach(v => {
        const count = StorageService.getAssignmentsByVolunteerId(v.id).length;
        volOpts += `<option value="${v.id}">${Utils.escapeHtml(v.name)} (${Utils.escapeHtml(v.expertise)}) - ${count} active mentees</option>`;
      });
      volunteerSelect.innerHTML = volOpts;
    }

    // Populate assignments table
    if (assignments.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding:24px;">No active mentor assignments found.</td></tr>';
      return;
    }

    let html = '';
    assignments.forEach(asg => {
      const student = StorageService.getStudentById(asg.studentId);
      const volunteer = StorageService.getVolunteerById(asg.volunteerId);

      html += `
        <tr>
          <td><strong>${student ? Utils.escapeHtml(student.name) : 'Student'}</strong><br><small class="text-muted">${student ? student.regNumber : ''} &bull; ${student ? student.department : ''}</small></td>
          <td><strong>${volunteer ? Utils.escapeHtml(volunteer.name) : 'Volunteer'}</strong><br><small class="text-muted">${volunteer ? Utils.escapeHtml(volunteer.expertise) : ''}</small></td>
          <td>${Utils.formatDate(asg.assignedDate)}</td>
          <td>${Utils.renderStatusBadge(asg.status)}</td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="AdminApp.quickReassign('${asg.studentId}')">Reassign</button>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
  };

  const quickReassign = (studentId) => {
    const studentSelect = document.getElementById('asg-student-select');
    if (studentSelect) {
      studentSelect.value = studentId;
      studentSelect.scrollIntoView({ behavior: 'smooth' });
      studentSelect.focus();
    }
  };

  // Section E: Guidance Requests Management
  const renderGuidanceRequests = () => {
    const tableBody = document.getElementById('admin-requests-table-body');
    const filterStatus = document.getElementById('admin-req-filter-status');
    if (!tableBody) return;

    let requests = StorageService.getGuidanceRequests();
    const filter = filterStatus ? filterStatus.value : 'all';

    if (filter !== 'all') {
      requests = requests.filter(r => r.status.toLowerCase() === filter.toLowerCase());
    }

    if (requests.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No guidance requests found.</td></tr>';
      return;
    }

    let html = '';
    requests.forEach(req => {
      const student = StorageService.getStudentById(req.studentId);
      const volunteer = StorageService.getVolunteerById(req.volunteerId);

      html += `
        <tr>
          <td><strong>${student ? Utils.escapeHtml(student.name) : 'Student'}</strong></td>
          <td>${volunteer ? Utils.escapeHtml(volunteer.name) : 'Volunteer'}</td>
          <td><strong>${Utils.escapeHtml(req.topic)}</strong></td>
          <td>${Utils.formatDate(req.preferredDate)}</td>
          <td>${Utils.renderStatusBadge(req.status)}</td>
          <td>${Utils.formatDate(req.submittedAt)}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
  };

  // Section F: Activity Management
  const renderActivitiesManagement = () => {
    const container = document.getElementById('admin-activities-table-body');
    if (!container) return;

    const activities = StorageService.getActivities();
    if (activities.length === 0) {
      container.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No activities created yet.</td></tr>';
      return;
    }

    let html = '';
    activities.forEach(act => {
      html += `
        <tr>
          <td><strong>${Utils.escapeHtml(act.title)}</strong></td>
          <td><span class="status-pill status-scheduled">${Utils.escapeHtml(act.category)}</span></td>
          <td>${Utils.formatDate(act.date)} (${act.time})</td>
          <td>${Utils.escapeHtml(act.location)}</td>
          <td>${act.enrolledCount} / ${act.capacity}</td>
          <td>
            <div class="action-buttons-cell">
              <button class="btn btn-sm btn-outline" onclick="AdminApp.openEditActivityModal('${act.id}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="AdminApp.deleteActivity('${act.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    container.innerHTML = html;
  };

  const openEditActivityModal = (activityId) => {
    const act = StorageService.getActivities().find(a => a.id === activityId);
    if (!act) return;

    document.getElementById('edit-act-id').value = act.id;
    document.getElementById('edit-act-title').value = act.title;
    document.getElementById('edit-act-category').value = act.category;
    document.getElementById('edit-act-date').value = act.date;
    document.getElementById('edit-act-time').value = act.time;
    document.getElementById('edit-act-location').value = act.location;
    document.getElementById('edit-act-capacity').value = act.capacity;
    document.getElementById('edit-act-desc').value = act.description;

    Utils.openModal('modal-edit-activity');
  };

  const deleteActivity = (activityId) => {
    Utils.showConfirmDialog(
      'Delete Activity',
      'Are you sure you want to delete this activity? It will be removed from all student views.',
      () => {
        StorageService.deleteActivity(activityId);
        Utils.showToast('Activity Deleted', 'Activity removed from system.', 'info');
        renderActivitiesManagement();
        renderOverview();
      },
      'Delete',
      true
    );
  };

  // Section G: Learning Resource Management
  const renderResourcesManagement = () => {
    const container = document.getElementById('admin-resources-table-body');
    if (!container) return;

    const resources = StorageService.getResources();
    if (resources.length === 0) {
      container.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding:24px;">No learning resources created yet.</td></tr>';
      return;
    }

    let html = '';
    resources.forEach(r => {
      html += `
        <tr>
          <td><strong>${Utils.escapeHtml(r.title)}</strong><br><small class="text-muted">${Utils.escapeHtml(r.description.slice(0, 70))}...</small></td>
          <td><span class="status-pill status-pending">${Utils.escapeHtml(r.category)}</span></td>
          <td>${Utils.escapeHtml(r.author || 'Academic Advisory')}</td>
          <td>${r.url ? `<a href="${Utils.escapeHtml(r.url)}" target="_blank" rel="noopener">Link &rarr;</a>` : 'None'}</td>
          <td>
            <div class="action-buttons-cell">
              <button class="btn btn-sm btn-outline" onclick="AdminApp.openEditResourceModal('${r.id}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="AdminApp.deleteResource('${r.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    container.innerHTML = html;
  };

  const openEditResourceModal = (resourceId) => {
    const res = StorageService.getResources().find(r => r.id === resourceId);
    if (!res) return;

    document.getElementById('edit-res-id').value = res.id;
    document.getElementById('edit-res-title').value = res.title;
    document.getElementById('edit-res-category').value = res.category;
    document.getElementById('edit-res-author').value = res.author || '';
    document.getElementById('edit-res-url').value = res.url || '';
    document.getElementById('edit-res-desc').value = res.description;

    Utils.openModal('modal-edit-resource');
  };

  const deleteResource = (resourceId) => {
    Utils.showConfirmDialog(
      'Delete Learning Resource',
      'Are you sure you want to delete this resource?',
      () => {
        StorageService.deleteResource(resourceId);
        Utils.showToast('Resource Deleted', 'Resource removed from library.', 'info');
        renderResourcesManagement();
        renderOverview();
      },
      'Delete',
      true
    );
  };

  // Section H: Analytics & Visual Reports
  const renderAnalytics = () => {
    const students = StorageService.getStudents();
    const volunteers = StorageService.getVolunteers();
    const sessions = StorageService.getSessions();

    // 1. Department Breakdown (Horizontal bars)
    const deptCounts = {};
    students.forEach(s => {
      deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
    });
    const deptData = Object.keys(deptCounts).map(dept => ({
      label: dept,
      value: deptCounts[dept],
      subtext: `${deptCounts[dept]} students`,
      variant: 'default'
    }));
    Charts.renderHorizontalBars('chart-students-dept', deptData);

    // 2. Session Status Distribution (SVG Donut Chart)
    const scheduled = sessions.filter(s => s.status === CONFIG.STATUS.SCHEDULED).length;
    const completed = sessions.filter(s => s.status === CONFIG.STATUS.COMPLETED).length;
    const cancelled = sessions.filter(s => s.status === CONFIG.STATUS.CANCELLED).length;

    Charts.renderDonutChart('chart-sessions-donut', [
      { label: 'Completed', value: completed, color: '#1E6B3A' },
      { label: 'Scheduled', value: scheduled, color: '#762E3F' },
      { label: 'Cancelled', value: cancelled, color: '#8E2332' }
    ]);

    // 3. Volunteer Status Breakdown
    const approved = volunteers.filter(v => v.status === CONFIG.STATUS.APPROVED).length;
    const pending = volunteers.filter(v => v.status === CONFIG.STATUS.PENDING).length;
    const inactive = volunteers.filter(v => v.status === CONFIG.STATUS.INACTIVE || v.status === CONFIG.STATUS.REJECTED).length;

    Charts.renderHorizontalBars('chart-volunteer-status', [
      { label: 'Approved & Active Mentors', value: approved, variant: 'default' },
      { label: 'Pending Application Review', value: pending, variant: 'accent' },
      { label: 'Inactive / Declined', value: inactive, variant: 'dark' }
    ]);
  };

  // Section I: Announcements
  const renderAnnouncements = () => {
    const container = document.getElementById('admin-announcements-list');
    if (!container) return;

    const notifs = StorageService.getNotifications();
    if (notifs.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No platform announcements active.</p></div>';
      return;
    }

    let html = '';
    notifs.forEach(n => {
      html += `
        <div class="card" style="margin-bottom:12px;">
          <div class="card-body" style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="status-pill status-pending">${Utils.escapeHtml(n.targetRole)}</span>
                <strong style="color:var(--color-wenge);">${Utils.escapeHtml(n.title)}</strong>
              </div>
              <p style="font-size:0.88rem; color:var(--text-primary); margin-top:6px;">${Utils.escapeHtml(n.message)}</p>
              <small class="text-muted">${Utils.formatDate(n.createdAt)}</small>
            </div>
            <button class="btn btn-sm btn-danger" onclick="AdminApp.deleteAnnouncement('${n.id}')">Delete</button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  const deleteAnnouncement = (notifId) => {
    Utils.showConfirmDialog(
      'Remove Announcement',
      'Are you sure you want to remove this platform announcement?',
      () => {
        StorageService.deleteNotification(notifId);
        Utils.showToast('Announcement Removed', 'Broadcast removed.', 'info');
        renderAnnouncements();
      },
      'Delete',
      true
    );
  };

  // Setup Admin Modals & Forms
  const setupAdminModals = () => {
    // Edit Student Form
    const editStuForm = document.getElementById('form-edit-student');
    if (editStuForm) {
      editStuForm.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-stu-id').value;
        StorageService.updateStudent(id, {
          name: document.getElementById('edit-stu-name').value.trim(),
          department: document.getElementById('edit-stu-dept').value,
          year: document.getElementById('edit-stu-year').value,
          email: document.getElementById('edit-stu-email').value.trim(),
          phone: document.getElementById('edit-stu-phone').value.trim(),
          interests: document.getElementById('edit-stu-interests').value.trim()
        });
        Utils.closeModal('modal-edit-student');
        Utils.showToast('Student Saved', 'Student profile updated.', 'success');
        renderStudentsTable();
      };
    }

    // Edit Volunteer Form
    const editVolForm = document.getElementById('form-edit-volunteer');
    if (editVolForm) {
      editVolForm.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-vol-id').value;
        StorageService.updateVolunteer(id, {
          name: document.getElementById('edit-vol-name').value.trim(),
          expertise: document.getElementById('edit-vol-expertise').value.trim(),
          skills: document.getElementById('edit-vol-skills').value.trim(),
          availability: document.getElementById('edit-vol-avail').value.trim(),
          email: document.getElementById('edit-vol-email').value.trim()
        });
        Utils.closeModal('modal-edit-volunteer');
        Utils.showToast('Volunteer Saved', 'Volunteer details updated.', 'success');
        renderVolunteersTable();
      };
    }

    // Create Assignment Form
    const assignForm = document.getElementById('form-create-assignment');
    if (assignForm) {
      assignForm.onsubmit = (e) => {
        e.preventDefault();
        const stuId = document.getElementById('asg-student-select').value;
        const volId = document.getElementById('asg-volunteer-select').value;
        const notes = document.getElementById('asg-notes').value.trim();

        if (!stuId || !volId) {
          Utils.showToast('Selection Required', 'Please select both a student and an approved volunteer mentor.', 'danger');
          return;
        }

        StorageService.createOrUpdateAssignment(stuId, volId, notes);
        Utils.showToast('Mentor Assigned', 'Pairing saved and synchronized across both student and volunteer dashboards.', 'success');
        assignForm.reset();
        renderMentorAssignments();
        renderStudentsTable();
        renderOverview();
      };
    }

    // Create Activity Form
    const createActForm = document.getElementById('form-create-activity');
    if (createActForm) {
      createActForm.onsubmit = (e) => {
        e.preventDefault();
        StorageService.createActivity({
          title: document.getElementById('act-title').value.trim(),
          category: document.getElementById('act-category').value,
          date: document.getElementById('act-date').value,
          time: document.getElementById('act-time').value.trim(),
          location: document.getElementById('act-location').value.trim(),
          capacity: document.getElementById('act-capacity').value,
          description: document.getElementById('act-desc').value.trim()
        });
        Utils.closeModal('modal-create-activity');
        createActForm.reset();
        Utils.showToast('Activity Created', 'Activity published for students.', 'success');
        renderActivitiesManagement();
        renderOverview();
      };
    }

    // Edit Activity Form
    const editActForm = document.getElementById('form-edit-activity');
    if (editActForm) {
      editActForm.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-act-id').value;
        StorageService.updateActivity(id, {
          title: document.getElementById('edit-act-title').value.trim(),
          category: document.getElementById('edit-act-category').value,
          date: document.getElementById('edit-act-date').value,
          time: document.getElementById('edit-act-time').value.trim(),
          location: document.getElementById('edit-act-location').value.trim(),
          capacity: document.getElementById('edit-act-capacity').value,
          description: document.getElementById('edit-act-desc').value.trim()
        });
        Utils.closeModal('modal-edit-activity');
        Utils.showToast('Activity Updated', 'Changes saved.', 'success');
        renderActivitiesManagement();
      };
    }

    // Create Resource Form
    const createResForm = document.getElementById('form-create-resource');
    if (createResForm) {
      createResForm.onsubmit = (e) => {
        e.preventDefault();
        StorageService.createResource({
          title: document.getElementById('res-title').value.trim(),
          category: document.getElementById('res-category').value.trim(),
          author: document.getElementById('res-author').value.trim(),
          url: document.getElementById('res-url').value.trim(),
          description: document.getElementById('res-desc').value.trim()
        });
        Utils.closeModal('modal-create-resource');
        createResForm.reset();
        Utils.showToast('Resource Created', 'New learning guide published.', 'success');
        renderResourcesManagement();
        renderOverview();
      };
    }

    // Edit Resource Form
    const editResForm = document.getElementById('form-edit-resource');
    if (editResForm) {
      editResForm.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-res-id').value;
        StorageService.updateResource(id, {
          title: document.getElementById('edit-res-title').value.trim(),
          category: document.getElementById('edit-res-category').value.trim(),
          author: document.getElementById('edit-res-author').value.trim(),
          url: document.getElementById('edit-res-url').value.trim(),
          description: document.getElementById('edit-res-desc').value.trim()
        });
        Utils.closeModal('modal-edit-resource');
        Utils.showToast('Resource Updated', 'Resource updated.', 'success');
        renderResourcesManagement();
      };
    }

    // Create Announcement Form
    const annForm = document.getElementById('form-create-announcement');
    if (annForm) {
      annForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('ann-title').value.trim();
        const targetRole = document.getElementById('ann-target').value;
        const message = document.getElementById('ann-message').value.trim();

        StorageService.createNotification({
          targetRole,
          title,
          message
        });

        Utils.closeModal('modal-create-announcement');
        annForm.reset();
        Utils.showToast('Announcement Published', 'Notification sent to specified roles.', 'success');
        renderAnnouncements();
      };
    }
  };

  // Reset Demonstration Dataset with Confirmation
  const confirmResetDemoData = () => {
    Utils.showConfirmDialog(
      'Reset Demo Data',
      'Are you sure you want to reset all browser demonstration data back to default sample state? All custom edits will be reverted.',
      () => {
        StorageService.resetDemoData();
        Utils.showToast('Demo Data Reset', 'Initial sample data restored successfully.', 'success');
        setTimeout(() => window.location.reload(), 800);
      },
      'Reset Data',
      true
    );
  };

  return {
    init,
    openEditStudentModal,
    toggleStudentStatus,
    deleteStudent,
    approveVolunteer,
    rejectVolunteer,
    toggleVolunteerStatus,
    openEditVolunteerModal,
    deleteVolunteer,
    quickReassign,
    openEditActivityModal,
    deleteActivity,
    openEditResourceModal,
    deleteResource,
    deleteAnnouncement,
    confirmResetDemoData,
    renderStudentsTable,
    renderVolunteersTable,
    renderGuidanceRequests
  };
})();
