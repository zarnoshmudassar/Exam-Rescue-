/* ==========================================================
   Exam Rescue — script.js
   Vanilla JS: navigation, modals, planner, checklists, tools
========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------
     MOBILE NAVIGATION
  --------------------------------------------------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---------------------------------------------------
     SMOOTH SCROLL (native CSS scroll-behavior handles most,
     this ensures anchor clicks account for sticky navbar)
  --------------------------------------------------- */
  var navbarHeight = document.getElementById('navbar').offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------------------------------------------------
     MODAL HANDLING
  --------------------------------------------------- */
  var overlay = document.getElementById('modalOverlay');
  var exploreButtons = document.querySelectorAll('.btn-explore');
  var closeButtons = document.querySelectorAll('[data-close]');

  function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;
    document.querySelectorAll('.modal.active').forEach(function (m) { m.classList.remove('active'); });
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.querySelectorAll('.modal.active').forEach(function (m) { m.classList.remove('active'); });
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  exploreButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.getAttribute('data-modal'));
    });
  });

  closeButtons.forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------------------------------------------------
     STUDY PLANNER
  --------------------------------------------------- */
  var PLANNER_KEY = 'examRescue_plannerTasks';

  function getPlannerTasks() {
    try {
      var raw = localStorage.getItem(PLANNER_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function savePlannerTasks(tasks) {
    try {
      localStorage.setItem(PLANNER_KEY, JSON.stringify(tasks));
    } catch (err) { /* localStorage unavailable — fail silently */ }
  }

  function renderPlanner() {
    var tasks = getPlannerTasks();
    var list = document.getElementById('plannerList');
    list.innerHTML = '';

    if (tasks.length === 0) {
      list.innerHTML = '<p class="empty-state">No tasks yet. Add your first study task above.</p>';
    } else {
      tasks.forEach(function (task) {
        var card = document.createElement('div');
        card.className = 'task-card' + (task.completed ? ' completed' : '');
        card.innerHTML =
          '<input type="checkbox" ' + (task.completed ? 'checked' : '') + ' data-id="' + task.id + '" class="task-check">' +
          '<div class="task-info">' +
            '<p class="task-title">' + escapeHtml(task.subject) + ' — ' + escapeHtml(task.topic) + '</p>' +
            '<div class="task-meta">' +
              '<span>' + escapeHtml(task.date || '') + '</span>' +
              '<span>' + escapeHtml(task.start) + ' - ' + escapeHtml(task.end) + '</span>' +
              '<span class="priority-badge priority-' + task.priority + '">' + task.priority + '</span>' +
            '</div>' +
          '</div>' +
          '<button class="task-delete" data-id="' + task.id + '" title="Delete task">&times;</button>';
        list.appendChild(card);
      });
    }

    // progress
    var completed = tasks.filter(function (t) { return t.completed; }).length;
    var pending = tasks.length - completed;
    var percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

    document.getElementById('plannerCompleted').textContent = 'Completed Tasks: ' + completed;
    document.getElementById('plannerPending').textContent = 'Pending Tasks: ' + pending;
    document.getElementById('plannerPercent').textContent = 'Progress: ' + percent + '%';
    document.getElementById('plannerBar').style.width = percent + '%';

    // bind events
    list.querySelectorAll('.task-check').forEach(function (cb) {
      cb.addEventListener('change', function () {
        toggleTask(cb.getAttribute('data-id'));
      });
    });
    list.querySelectorAll('.task-delete').forEach(function (btn) {
      btn.addEventListener('click', function () {
        deleteTask(btn.getAttribute('data-id'));
      });
    });
  }

  function toggleTask(id) {
    var tasks = getPlannerTasks();
    tasks = tasks.map(function (t) {
      if (t.id === id) t.completed = !t.completed;
      return t;
    });
    savePlannerTasks(tasks);
    renderPlanner();
  }

  function deleteTask(id) {
    var tasks = getPlannerTasks().filter(function (t) { return t.id !== id; });
    savePlannerTasks(tasks);
    renderPlanner();
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
  }

  var plannerForm = document.getElementById('plannerForm');
  plannerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var subject = document.getElementById('pSubject').value.trim();
    var topic = document.getElementById('pTopic').value.trim();
    var date = document.getElementById('pDate').value;
    var start = document.getElementById('pStart').value;
    var end = document.getElementById('pEnd').value;
    var priority = document.getElementById('pPriority').value;

    if (!subject || !topic || !date || !start || !end) return;

    var tasks = getPlannerTasks();
    tasks.push({
      id: 't-' + Date.now(),
      subject: subject,
      topic: topic,
      date: date,
      start: start,
      end: end,
      priority: priority,
      completed: false
    });
    savePlannerTasks(tasks);
    plannerForm.reset();
    document.getElementById('pPriority').value = 'Medium';
    renderPlanner();
  });

  renderPlanner();

  /* ---------------------------------------------------
     GENERIC CHECKLIST HANDLER
     (used for Revision Checklist, Exam Prep Guide, Daily Checklist)
  --------------------------------------------------- */
  function setupChecklist(storageKey, checkboxSelector, percentElId, barElId) {
    var checkboxes = document.querySelectorAll(checkboxSelector);
    if (!checkboxes.length) return;

    var saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (err) { saved = {}; }

    checkboxes.forEach(function (cb) {
      var key = cb.getAttribute('data-item');
      if (saved[key]) cb.checked = true;
    });

    function update() {
      var state = {};
      var checkedCount = 0;
      checkboxes.forEach(function (cb) {
        var key = cb.getAttribute('data-item');
        state[key] = cb.checked;
        if (cb.checked) checkedCount++;
      });
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (err) {}
      var percent = Math.round((checkedCount / checkboxes.length) * 100);
      var percentEl = document.getElementById(percentElId);
      var barEl = document.getElementById(barElId);
      if (percentEl) percentEl.textContent = percent + '%';
      if (barEl) barEl.style.width = percent + '%';
    }

    checkboxes.forEach(function (cb) {
      cb.addEventListener('change', update);
    });

    update();
    return { checkboxes: checkboxes, update: update };
  }

  setupChecklist('examRescue_revisionChecklist', '#modal-revision [data-item]', 'revisionPercent', 'revisionBar');
  setupChecklist('examRescue_guideChecklist', '#modal-guide [data-item]', 'guidePercent', 'guideBar');
  var dailyChecklist = setupChecklist('examRescue_dailyChecklist', '#modal-daily [data-item]', 'dailyPercent', 'dailyBar');

  var resetDailyBtn = document.getElementById('resetDailyBtn');
  if (resetDailyBtn) {
    resetDailyBtn.addEventListener('click', function () {
      if (!dailyChecklist) return;
      dailyChecklist.checkboxes.forEach(function (cb) { cb.checked = false; });
      dailyChecklist.update();
    });
  }

  /* ---------------------------------------------------
     TIME MANAGEMENT — STUDY SESSION PLANNER
  --------------------------------------------------- */
  var createSessionBtn = document.getElementById('createSessionBtn');
  if (createSessionBtn) {
    createSessionBtn.addEventListener('click', function () {
      var studyDuration = parseInt(document.getElementById('studyDuration').value, 10) || 25;
      var breakDuration = parseInt(document.getElementById('breakDuration').value, 10) || 5;
      var sessionCount = parseInt(document.getElementById('sessionCount').value, 10) || 1;

      studyDuration = Math.max(studyDuration, 5);
      breakDuration = Math.max(breakDuration, 1);
      sessionCount = Math.max(sessionCount, 1);

      var output = document.getElementById('sessionOutput');
      output.innerHTML = '';

      var totalStudy = 0;
      var totalBreak = 0;

      for (var i = 1; i <= sessionCount; i++) {
        var studyItem = document.createElement('div');
        studyItem.className = 'session-item';
        studyItem.innerHTML = '<span>Session ' + i + '</span><span>' + studyDuration + ' min study</span>';
        output.appendChild(studyItem);
        totalStudy += studyDuration;

        if (i < sessionCount) {
          var breakItem = document.createElement('div');
          breakItem.className = 'session-item break-item';
          breakItem.innerHTML = '<span>Break</span><span>' + breakDuration + ' min</span>';
          output.appendChild(breakItem);
          totalBreak += breakDuration;
        }
      }

      var totalItem = document.createElement('div');
      totalItem.className = 'session-item';
      totalItem.style.fontWeight = '600';
      totalItem.innerHTML = '<span>Total Time</span><span>' + (totalStudy + totalBreak) + ' minutes (' + totalStudy + ' study / ' + totalBreak + ' break)</span>';
      output.appendChild(totalItem);
    });
  }

  /* ---------------------------------------------------
     CONTACT FORM VALIDATION
  --------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  function setError(fieldId, message) {
    var errEl = document.getElementById('err-' + fieldId);
    var inputEl = document.getElementById(fieldId);
    if (errEl) errEl.textContent = message || '';
    if (inputEl) inputEl.classList.toggle('invalid', !!message);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[0-9+\-\s]{10,15}$/.test(value);
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    formSuccess.classList.remove('show');

    var fullName = document.getElementById('fullName').value.trim();
    var age = document.getElementById('age').value.trim();
    var educationLevel = document.getElementById('educationLevel').value;
    var subject = document.getElementById('subject').value.trim();
    var helpRequired = document.getElementById('helpRequired').value.trim();
    var whatsapp = document.getElementById('whatsapp').value.trim();
    var email = document.getElementById('email').value.trim();

    var valid = true;

    if (fullName.length < 2) { setError('fullName', 'Please enter your full name.'); valid = false; }
    else setError('fullName', '');

    if (!age || parseInt(age, 10) < 10 || parseInt(age, 10) > 30) { setError('age', 'Please enter a valid age (10-30).'); valid = false; }
    else setError('age', '');

    if (!educationLevel) { setError('educationLevel', 'Please select your education level.'); valid = false; }
    else setError('educationLevel', '');

    if (subject.length < 2) { setError('subject', 'Please enter a subject.'); valid = false; }
    else setError('subject', '');

    if (helpRequired.length < 5) { setError('helpRequired', 'Please tell us what you need help with.'); valid = false; }
    else setError('helpRequired', '');

    if (!isValidPhone(whatsapp)) { setError('whatsapp', 'Please enter a valid WhatsApp number.'); valid = false; }
    else setError('whatsapp', '');

    if (!isValidEmail(email)) { setError('email', 'Please enter a valid email address.'); valid = false; }
    else setError('email', '');

    if (!valid) return;

    var WHATSAPP_NUMBER = '923455407001';
    var message =
      'New Study Help Request:\n' +
      'Name: ' + fullName + '\n' +
      'Age: ' + age + '\n' +
      'Education Level: ' + educationLevel + '\n' +
      'Subject: ' + subject + '\n' +
      'Help Required: ' + helpRequired + '\n' +
      'WhatsApp: ' + whatsapp + '\n' +
      'Email: ' + email;

    var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    window.open(waUrl, '_blank');

    formSuccess.classList.add('show');
    contactForm.reset();

    setTimeout(function () {
      formSuccess.classList.remove('show');
    }, 6000);
  });

});
