/* Student OS — logique d'onboarding partagée (login démo + connexion services + confirmation).
   Utilisée par desktop/index.html et mobile/index.html. Rien n'est fonctionnel : tout mène au dashboard. */

(function () {
  let current = 1;
  let total = 3;
  let selectedSchool = null;

  function escSchool(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function wireSchoolSearch() {
    const input = document.getElementById('profileSchoolInput');
    const results = document.getElementById('schoolResults');
    if (!input) return;
    let debounceTimer = null;
    let requestId = 0;

    function search(q) {
      const myRequest = ++requestId;
      results.innerHTML = `<div class="school-loading">…</div>`;
      results.classList.add('open');
      const url = `https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-principaux-etablissements-enseignement-superieur&q=${encodeURIComponent(q)}&rows=8`;
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          if (myRequest !== requestId) return;
          const records = json.records || [];
          if (!records.length) {
            results.innerHTML = `<div class="school-empty">${t('onboarding.profile.schoolEmpty')}</div>`;
            return;
          }
          results.innerHTML = records.map((r, i) => {
            const f = r.fields;
            const name = f.nom_court || f.champ_recherche || '';
            return `<button type="button" class="school-result" data-idx="${i}">
              <span class="school-result-name">${escSchool(name)}</span>
              <span class="school-result-meta">${escSchool(f.type_d_etablissement || '')}${f.com_nom ? ' · ' + escSchool(f.com_nom) : ''}</span>
            </button>`;
          }).join('');
          results.querySelectorAll('.school-result').forEach((btn, i) => {
            btn.addEventListener('click', () => {
              const f = records[i].fields;
              selectedSchool = { name: f.nom_court || f.champ_recherche || '', type: f.type_d_etablissement || '', city: f.com_nom || '', region: f.reg_nom || '' };
              input.value = selectedSchool.city ? `${selectedSchool.name} — ${selectedSchool.city}` : selectedSchool.name;
              results.classList.remove('open');
            });
          });
        })
        .catch(() => {
          if (myRequest !== requestId) return;
          results.innerHTML = `<div class="school-empty">${t('onboarding.profile.schoolOffline')}</div>`;
        });
    }

    input.addEventListener('input', () => {
      selectedSchool = null;
      const q = input.value.trim();
      clearTimeout(debounceTimer);
      if (q.length < 2) { results.classList.remove('open'); results.innerHTML = ''; return; }
      debounceTimer = setTimeout(() => search(q), 300);
    });

    document.addEventListener('click', (e) => {
      if (!document.getElementById('schoolSearch').contains(e.target)) results.classList.remove('open');
    });
  }

  function saveProfile() {
    const schoolInput = document.getElementById('profileSchoolInput');
    const field = document.getElementById('profileField');
    const level = document.getElementById('profileLevel');
    if (!schoolInput) return;
    const school = selectedSchool || { name: schoolInput.value.trim(), type: '', city: '', region: '' };
    try {
      localStorage.setItem('studentos_profile', JSON.stringify({
        school: school.name, schoolType: school.type, city: school.city, region: school.region,
        field: field.value, level: level.value,
      }));
    } catch (e) { /* stockage indisponible, tant pis pour la personnalisation */ }
  }

  function renderConnectGrid() {
    const grid = document.getElementById('connectGrid');
    if (!grid) return;
    grid.innerHTML = STUDENT_OS_LOGO_GROUPS.map((group) => `
      <div class="connect-group">
        <p class="connect-group-label">${group.label}</p>
        <div class="connect-group-items">
          ${group.items.map((key) => {
            const logo = STUDENT_OS_LOGOS[key];
            const connected = STUDENT_OS_DATA.connections.connected.includes(key);
            return `
              <button type="button" class="connect-tile${connected ? ' active' : ''}" data-key="${key}">
                <span class="logo-chip${logo.dark ? ' dark' : ''}"><img src="${logo.img}" alt="${logo.name}" loading="lazy"></span>
                <span class="connect-tile-name">${logo.name}</span>
                <span class="connect-tile-state">${svgIcon('check', 'connect-check')}</span>
              </button>`;
          }).join('')}
        </div>
      </div>`).join('');

    grid.querySelectorAll('.connect-tile').forEach((tile) => {
      tile.addEventListener('click', () => tile.classList.toggle('active'));
    });
  }

  function wirePreferences() {
    const themeButtons = document.querySelectorAll('#onboardThemeSwitch .theme-opt');
    const syncTheme = () => {
      const cur = getTheme();
      themeButtons.forEach((b) => b.classList.toggle('active', b.dataset.theme === cur));
    };
    if (themeButtons.length) {
      syncTheme();
      themeButtons.forEach((b) => b.addEventListener('click', () => { setTheme(b.dataset.theme); syncTheme(); }));
      const iconDark = document.getElementById('onbThemeIconDark');
      const iconLight = document.getElementById('onbThemeIconLight');
      if (iconDark) iconDark.innerHTML = svgIcon('moon');
      if (iconLight) iconLight.innerHTML = svgIcon('sparkles');
    }

    const fontSelect = document.getElementById('onboardFont');
    if (fontSelect) {
      fontSelect.value = getFont();
      fontSelect.addEventListener('change', () => setFont(fontSelect.value));
    }

    buildLangPicker('onboardLang', () => applyI18n(document));
  }

  function goTo(step) {
    step = Math.min(total, Math.max(1, step));
    current = step;
    document.querySelectorAll('.step').forEach((el) => {
      const n = Number(el.dataset.step);
      el.classList.toggle('active', n === step);
      el.classList.toggle('done', n < step);
    });
    document.querySelectorAll('.onboard-dots .dot').forEach((el, i) => {
      el.classList.toggle('active', i === step - 1);
      el.classList.toggle('done', i < step - 1);
    });
  }

  function init() {
    total = document.querySelectorAll('.step').length;
    document.documentElement.dataset.theme = getTheme();
    document.documentElement.dataset.font = getFont();
    renderConnectGrid();
    wirePreferences();
    wireSchoolSearch();
    applyI18n(document);
    goTo(1);

    document.querySelectorAll('[data-next]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(current + 1);
      });
    });
    document.querySelectorAll('[data-prev]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(current - 1);
      });
    });
    document.querySelectorAll('[data-enter]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        saveProfile();
        btn.classList.add('loading');
        setTimeout(() => { window.location.href = btn.dataset.enter; }, 650);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
