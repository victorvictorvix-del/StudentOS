/* Student OS — nav commune + fragments de contenu réutilisés par desktop/js/desktop.js et mobile/js/mobile.js.
   Toutes les données viennent de STUDENT_OS_DATA (data.js), les icônes de svgIcon() (icons.js).
   Chaque app définit sa propre fonction setActiveView() (rendu spécifique sidebar vs bottom-bar) ;
   goTo(), RENDERERS et les render* ci-dessous sont partagés et l'appellent. */

const state = { view: 'home', vieTab: 'logement' };

const NAV_ITEMS = [
  { id: 'home', icon: 'home', labelKey: 'nav.home', color: '#8b6bff' },
  { id: 'studies', icon: 'book', labelKey: 'nav.studies', color: '#4f8cff' },
  { id: 'agenda', icon: 'calendar', labelKey: 'nav.agenda', color: '#f7b955' },
  { id: 'inbox', icon: 'inbox', labelKey: 'nav.inbox', color: '#fb7185' },
  { id: 'money', icon: 'wallet', labelKey: 'nav.money', color: '#38d99a' },
  { id: 'vie', icon: 'life', labelKey: 'nav.vie', color: '#c86bff' },
  { id: 'courses', icon: 'cart', labelKey: 'nav.courses', color: '#ff9f5a' },
  { id: 'documents', icon: 'folder', labelKey: 'nav.documents', color: '#4fd1ff' },
  { id: 'notes', icon: 'edit', labelKey: 'nav.notes', color: '#34d0b8' },
  { id: 'ai', icon: 'bot', labelKey: 'nav.ai', color: '#ff6bd6' },
  { id: 'connections', icon: 'plug', labelKey: 'nav.connections', color: '#9aa0c3' },
];

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function navIconTile(item) {
  return `<span class="nav-icon-tile" style="background:${hexToRgba(item.color, 0.16)};color:${item.color}">${svgIcon(item.icon)}</span>`;
}

const VIE_TABS = [
  { id: 'money', labelKey: 'vieTabs.money' },
  { id: 'logement', labelKey: 'vieTabs.logement' },
  { id: 'administratif', labelKey: 'vieTabs.administratif' },
  { id: 'transport', labelKey: 'vieTabs.transport' },
  { id: 'sante', labelKey: 'vieTabs.sante' },
  { id: 'courses', labelKey: 'vieTabs.courses' },
];

const VIE_CONTENT_FNS = () => ({
  money: moneyContent, logement: logementContent, administratif: administratifContent,
  transport: transportContent, sante: santeContent, courses: coursesContent,
});

/* ---------- personnalisation (démo) à partir du profil renseigné à l'onboarding ---------- */

function applyProfilePersonalization() {
  try {
    const raw = localStorage.getItem('studentos_profile');
    if (!raw) return;
    const p = JSON.parse(raw);
    if (p.level && p.field && p.school) {
      const place = p.city ? `${p.school}, ${p.city}` : p.school;
      STUDENT_OS_DATA.user.school = `${p.level} ${p.field} — ${place}`;
      if (p.city) STUDENT_OS_DATA.home.subtitle = `Voici où tu en es aujourd'hui à ${p.city}.`;
    }
  } catch (e) { /* localStorage indisponible : on garde les données par défaut */ }
}

/* ---------- helpers ---------- */

function viewHeader(title, subtitle) {
  return `<div class="view-header"><div><h1>${title}</h1><p>${subtitle || ''}</p></div></div>`;
}

function ringSvg(percent, size, stroke) {
  size = size || 84; stroke = stroke || 9;
  const r = (size / 2) - stroke / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, percent) / 100) * c;
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"/>
    <circle class="ring-value" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"
      stroke-dasharray="0 ${c}" data-dash="${dash} ${c}"/>
  </svg>`;
}

function progressBar(percent, tone) {
  const cls = tone ? ` ${tone}` : '';
  return `<div class="progress"><div class="progress-bar${cls}" data-w="${Math.min(100, percent)}" style="width:0%"></div></div>`;
}

function toneClass(tone) { return tone ? `badge-${tone}` : ''; }

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function logoImg(domain, name, size) {
  return `<img src="${favicon(domain, size || 64)}" alt="${name}">`;
}

function sparkline(values, w, h) {
  w = w || 220; h = h || 56;
  const max = Math.max(...values), min = Math.min(...values);
  const range = (max - min) || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / range) * (h - 10) - 5).toFixed(1)}`);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="sparkline">
    <polyline points="${pts.join(' ')}" fill="none" stroke="url(#ringGradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function animateIn(root) {
  root.querySelectorAll('.progress-bar[data-w]').forEach((el) => {
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = el.dataset.w + '%'; }));
  });
  root.querySelectorAll('.ring-value[data-dash]').forEach((el) => {
    requestAnimationFrame(() => requestAnimationFrame(() => { el.setAttribute('stroke-dasharray', el.dataset.dash); }));
  });
}

/* ---------- fragments de contenu (réutilisables en standalone ou dans le hub Vie) ---------- */

function moneyContent() {
  const m = STUDENT_OS_DATA.money;
  return `
    <div class="grid-3 stagger">
      <div class="card stat-card">
        <div class="stat-icon warning">${svgIcon('wallet')}</div>
        <p class="stat-label">Reste à vivre</p>
        <p class="stat-value">${m.resteAVivre} €</p>
        <p class="stat-trend">jusqu'au ${m.nextIncomeDate}</p>
      </div>
      <div class="card stat-card">
        <div class="stat-icon info">${svgIcon('trendingUp')}</div>
        <p class="stat-label">Dépensé ce mois-ci</p>
        <p class="stat-value">${m.depense} € <span class="muted-sm">/ ${m.budgetTotal} €</span></p>
        ${progressBar((m.depense / m.budgetTotal) * 100, m.depense > m.budgetTotal ? 'danger' : 'warning')}
      </div>
      <div class="card stat-card">
        <div class="stat-icon success">${svgIcon('piggy')}</div>
        <p class="stat-label">Objectif d'épargne</p>
        <p class="stat-value">${m.savingsGoal.current} € <span class="muted-sm">/ ${m.savingsGoal.target} €</span></p>
        ${progressBar((m.savingsGoal.current / m.savingsGoal.target) * 100)}
      </div>
    </div>

    <div class="alert-banner stagger" style="margin-top:16px">
      <div class="alert-banner-item warning">${svgIcon('alert')}<span>${m.forecastAlertText}</span></div>
      <div class="alert-banner-item danger">${svgIcon('sparkles')}<span><strong>${m.unusualSpend.label}.</strong> ${m.unusualSpend.detail}</span></div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card-title">Budget par catégorie <span class="muted">${m.categories.length} catégories</span></div>
      <div class="cat-grid">
        ${m.categories.map((c) => {
          const pct = (c.spent / c.budget) * 100;
          const over = c.spent > c.budget;
          return `<div class="cat-row">
            <div class="cat-icon">${svgIcon(c.icon)}</div>
            <div class="cat-info">
              <div class="cat-top"><span>${c.label}</span><span class="${over ? 'over' : ''}">${c.spent} € / ${c.budget} €</span></div>
              ${progressBar(pct, over ? 'danger' : pct > 85 ? 'warning' : '')}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="grid-2" style="margin-top:16px">
      <div class="card">
        <div class="card-title">Abonnements suivis</div>
        <div class="sub-list">
          ${m.subscriptions.map((s) => `<div class="sub-row">
            <span class="logo-chip">${logoImg(s.domain, s.name, 40)}</span>
            <span class="sub-name">${s.name}</span>
            <span class="sub-price">${s.price}/mois</span>
          </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-title">Prévision de trésorerie <span class="muted">6 dernières semaines</span></div>
        ${sparkline(m.cashflow)}
        <p class="hint">Tendance à la baisse — pense à ralentir les sorties avant le ${m.nextIncomeDate}.</p>
      </div>
    </div>`;
}

function logementContent() {
  const l = STUDENT_OS_DATA.logement;
  return `
    <div class="grid-3 stagger">
      <div class="card stat-card">
        <div class="stat-icon info">${svgIcon('key')}</div>
        <p class="stat-label">Loyer</p>
        <p class="stat-value">${l.rent} €<span class="muted-sm">/mois</span></p>
        <p class="stat-trend">Charges : ${l.charges} €</p>
      </div>
      <div class="card stat-card">
        <div class="stat-icon success">${svgIcon('user')}</div>
        <p class="stat-label">Colocation</p>
        <p class="stat-value">${l.roommates} <span class="muted-sm">personnes</span></p>
        <p class="stat-trend">${l.contractEnd}</p>
      </div>
      <div class="card stat-card">
        <div class="stat-icon warning">${svgIcon('calendar')}</div>
        <p class="stat-label">Prochain prélèvement</p>
        <p class="stat-value" style="font-size:22px">${l.nextDebit}</p>
        <p class="stat-trend">APL estimée : ${l.apl} €</p>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-title">Documents du logement</div>
      <div class="doc-list">
        ${l.documents.map((d) => `<div class="doc-row">${svgIcon('file')}<span>${d}</span><span class="badge badge-success">à jour</span></div>`).join('')}
      </div>
    </div>`;
}

function administratifContent() {
  const a = STUDENT_OS_DATA.administratif;
  const col = (title, items, tone) => `
    <div class="card">
      <div class="card-title">${title} <span class="badge ${toneClass(tone)}">${items.length}</span></div>
      <ul class="task-list">
        ${items.map((t) => `<li>${svgIcon('clipboard')}<span>${t}</span></li>`).join('')}
      </ul>
    </div>`;
  return `<div class="grid-3 stagger">
    ${col('Cette semaine', a.thisWeek, 'danger')}
    ${col('Dans 18 jours', a.in18Days, 'warning')}
    ${col('Le mois prochain', a.nextMonth, 'info')}
  </div>`;
}

function transportContent() {
  const tr = STUDENT_OS_DATA.transport;
  return `
    <div class="card stagger" style="margin-bottom:16px">
      <div class="card-title">${t('transport.whereTo')}</div>
      <div class="transport-dest-row">
        ${tr.destinations.map((d) => `<button type="button" class="transport-dest-chip${tr.activeDestination === d.id ? ' active' : ''}" onclick="selectTransportDestination('${d.id}')">${svgIcon(d.icon)}<span>${d.label}</span></button>`).join('')}
      </div>
    </div>
    <div class="card route-card stagger">
      <div class="route-line">
        <div class="route-point"><span class="dot"></span><span>${tr.from}</span></div>
        <div class="route-track">${svgIcon('route')}</div>
        <div class="route-point"><span class="dot end"></span><span>${tr.to}</span></div>
      </div>
      <div class="route-stats">
        <div><p class="stat-value">${tr.duration}</p><p class="stat-label">Durée estimée</p></div>
        <div><p class="stat-value">${tr.recommendedDeparture}</p><p class="stat-label">Départ recommandé</p></div>
        <div><p class="stat-value">${tr.line}</p><p class="stat-label">Ligne</p></div>
      </div>
      <div class="route-footer">
        <span class="badge badge-success">${svgIcon('check')} ${tr.disruption}</span>
        <span class="badge">${tr.subscription} · ${tr.cost}</span>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-title">Prochains départs</div>
      <div class="chips-row">${tr.nextDepartures.map((d) => `<span class="chip">${d}</span>`).join('')}</div>
    </div>`;
}

function selectTransportDestination(id) {
  const tr = STUDENT_OS_DATA.transport;
  const dest = tr.destinations.find((d) => d.id === id);
  if (!dest) return;
  tr.to = dest.to; tr.duration = dest.duration; tr.recommendedDeparture = dest.recommendedDeparture;
  tr.line = dest.line; tr.nextDepartures = dest.nextDepartures; tr.activeDestination = id;
  goTo('vie', 'transport');
}

function santeContent() {
  const s = STUDENT_OS_DATA.sante;
  const ring = (icon, label, obj) => `
    <div class="card ring-card">
      <div class="ring-wrap-inline">${ringSvg(obj.percent)}<div class="ring-center">${svgIcon(icon)}</div></div>
      <p class="stat-value">${obj.value}</p>
      <p class="stat-label">${label}</p>
      <p class="stat-trend">Objectif : ${obj.target}</p>
    </div>`;
  return `<div class="grid-4 stagger">
    ${ring('moon', 'Sommeil', s.sleep)}
    ${ring('footprints', 'Pas', s.steps)}
    ${ring('brain', 'Concentration', s.focus)}
    ${ring('droplet', 'Hydratation', s.hydration)}
  </div>
  <div class="card" style="margin-top:16px">
    <div class="card-title">Connecté via <span class="muted">démo</span></div>
    <div class="chips-row">
      <span class="chip"><span class="logo-chip dark" style="width:20px;height:20px;border-radius:6px"><img src="${STUDENT_OS_LOGOS.appleHealth.img}" alt="Apple Santé"></span> Apple Santé</span>
      <span class="chip"><span class="logo-chip" style="width:20px;height:20px;border-radius:6px"><img src="${STUDENT_OS_LOGOS.googleFit.img}" alt="Google Fit"></span> Google Fit</span>
    </div>
  </div>`;
}

function coursesContent() {
  const c = STUDENT_OS_DATA.courses;
  return `
    <div class="grid-3 stagger">
      <div class="card stat-card">
        <div class="stat-icon warning">${svgIcon('cart')}</div>
        <p class="stat-label">Budget courses restant</p>
        <p class="stat-value">${c.budgetLeft} €</p>
        <p class="stat-trend">${c.waste}</p>
      </div>
      <div class="card">
        <div class="card-title">Inventaire</div>
        <div class="chips-row">${c.inventory.map((i) => `<span class="chip">${i}</span>`).join('')}</div>
      </div>
      <div class="card">
        <div class="card-title">Liste de courses</div>
        <div class="chips-row">${c.shoppingList.map((i) => `<span class="chip">${i}</span>`).join('')}</div>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-title">Repas réalisables avec ton inventaire <span class="muted">${c.meals.length} recettes</span></div>
      <div class="meal-grid">
        ${c.meals.map((m) => `<div class="meal-card"><span class="meal-name">${m.name}</span><span class="meal-cost">${m.cost}</span></div>`).join('')}
      </div>
    </div>`;
}

/* ---------- vues principales (pages entières de la nav) ---------- */

function renderHome() {
  const d = STUDENT_OS_DATA.home;
  return viewHeader(d.greeting, d.subtitle) + `
    <div class="grid-4 stagger">
      ${d.cards.map((c) => `<div class="card stat-card">
        <div class="stat-icon ${c.tone}">${svgIcon(c.icon)}</div>
        <p class="stat-label">${c.label}</p>
        <p class="stat-value">${c.value}</p>
        <p class="stat-trend">${c.trend}</p>
      </div>`).join('')}
    </div>
    <div class="card ai-banner stagger" style="margin-top:16px">
      <div class="ai-banner-icon">${svgIcon('sparkles')}</div>
      <div><p class="ai-banner-title">Student AI</p><p class="ai-banner-text">${d.aiTip}</p></div>
      <button class="btn btn-ghost" onclick="goTo('ai')">Discuter <span>${svgIcon('chevronRight')}</span></button>
    </div>
    <div class="grid-2" style="margin-top:16px">
      <div class="card">
        <div class="card-title">Emploi du temps du jour</div>
        <ul class="task-list">
          ${STUDENT_OS_DATA.studies.schedule.slice(0, 3).map((s) => `<li>${svgIcon('calendar')}<span><strong>${s.time}</strong> — ${s.title} <span class="muted">(${s.room})</span></span></li>`).join('')}
        </ul>
      </div>
      <div class="card">
        <div class="card-title">Vie en bref</div>
        <div class="brief-list">
          <button class="brief-row" onclick="goTo('vie','logement')">${svgIcon('key')}<span>Logement — ${STUDENT_OS_DATA.logement.rent} €/mois</span>${svgIcon('chevronRight')}</button>
          <button class="brief-row" onclick="goTo('vie','transport')">${svgIcon('route')}<span>Trajet — ${STUDENT_OS_DATA.transport.duration} jusqu'à l'université</span>${svgIcon('chevronRight')}</button>
          <button class="brief-row" onclick="goTo('vie','sante')">${svgIcon('moon')}<span>Sommeil — ${STUDENT_OS_DATA.sante.sleep.value} cette nuit</span>${svgIcon('chevronRight')}</button>
        </div>
      </div>
    </div>`;
}

function renderStudies() {
  const s = STUDENT_OS_DATA.studies;
  return viewHeader(t('view.studies.title'), t('view.studies.subtitle')) + `
    <div class="grid-2 stagger">
      <div class="card">
        <div class="card-title">Emploi du temps</div>
        <ul class="task-list">
          ${s.schedule.map((c) => `<li>${svgIcon('book')}<span><strong>${c.time}</strong> — ${c.title} <span class="muted">${c.room} · ${c.tag}</span></span></li>`).join('')}
        </ul>
      </div>
      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-title">Devoirs à rendre</div>
          <div class="sub-list">
            ${s.assignments.map((a) => `<div class="assignment-row">
              <div class="assignment-top"><span>${a.title}</span><span class="muted">${a.due}</span></div>
              ${progressBar(a.progress, a.progress < 40 ? 'warning' : '')}
            </div>`).join('')}
          </div>
        </div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-title">Notes récentes</div>
          <ul class="task-list">
            ${s.grades.map((g) => `<li>${svgIcon('check')}<span>${g.course}</span><span class="muted" style="margin-left:auto">${g.grade}</span></li>`).join('')}
          </ul>
        </div>
        <div class="card">
          <div class="card-title">Notes de cours <span class="logo-chip dark notion-chip"><img src="${STUDENT_OS_LOGOS.notion.img}" alt="Notion"></span><span class="muted">synchronisé</span></div>
          <div class="sub-list">
            ${s.notionNotes.map((n) => `<a class="notion-row" href="#" onclick="return false">
              <span class="notion-row-text"><strong>${n.page}</strong><span class="muted">${n.course} · ${n.updated}</span></span>
              ${svgIcon('chevronRight')}
            </a>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function renderAgenda() {
  const a = STUDENT_OS_DATA.agenda;
  return viewHeader(t('view.agenda.title'), a.week) + `
    ${a.googleCalendarSynced ? `<div class="sync-banner stagger">
      <span class="logo-chip" style="width:22px;height:22px;border-radius:6px"><img src="${STUDENT_OS_LOGOS.googleCalendar.img}" alt="Google Calendar"></span>
      <span>Synchronisé avec Google Calendar</span>
      <span class="badge badge-success">${svgIcon('check')} à jour</span>
    </div>` : ''}
    <div class="agenda-row stagger">
      ${a.days.map((d) => `<div class="agenda-col ${d.events.some((e) => e.highlight) ? 'highlight' : ''}">
        <p class="agenda-day">${d.day}</p>
        ${d.events.length ? d.events.map((e) => `<div class="agenda-event ${e.highlight ? 'danger' : ''}"><span>${e.time}</span>${e.title}</div>`).join('') : '<p class="agenda-empty">—</p>'}
      </div>`).join('')}
    </div>`;
}

function renderInbox() {
  const items = STUDENT_OS_DATA.inbox;
  return viewHeader(t('view.inbox.title'), `${items.length} notifications`) + `
    <div class="inbox-list stagger">
      ${items.map((n) => `<div class="card inbox-row">
        <div class="stat-icon ${n.tone}">${svgIcon(n.icon)}</div>
        <div class="inbox-body"><p class="inbox-title">${n.title}</p><p class="inbox-text">${n.body}</p></div>
        <span class="inbox-time">${n.time}</span>
      </div>`).join('')}
    </div>`;
}

function renderMoney() { return viewHeader(t('view.money.title'), t('view.money.subtitle')) + moneyContent(); }
function renderCourses() { return viewHeader(t('view.courses.title'), t('view.courses.subtitle')) + coursesContent(); }

function renderDocuments() {
  const docs = STUDENT_OS_DATA.documents;
  const drive = STUDENT_OS_DATA.driveSync;
  const cloudChips = STUDENT_OS_CLOUD_KEYS.map((key) => {
    const logo = STUDENT_OS_LOGOS[key];
    return `<span class="logo-chip${logo.dark ? ' dark' : ''}" data-cloud="${key}" title="${logo.name}"><img src="${logo.img}" alt="${logo.name}"></span>`;
  }).join('');
  return viewHeader(t('view.documents.title'), t('view.documents.subtitle')) + `
    <div class="card drive-card stagger">
      <span class="logo-chip"><img src="${STUDENT_OS_LOGOS.googleDrive.img}" alt="Google Drive"></span>
      <div class="drive-info">
        <p class="drive-title">Google Drive ${drive.connected ? `<span class="badge badge-success">${t('documents.drive.connected')}</span>` : `<span class="badge">${t('documents.drive.notConnected')}</span>`}</p>
        <p class="drive-sub">${drive.filesSynced} fichiers synchronisés · ${drive.storageUsed} / ${drive.storageTotal} · ${drive.lastSync}</p>
      </div>
      <button class="btn btn-ghost" onclick="goTo('connections')">${t('common.manage')}</button>
    </div>

    <div class="card stagger" style="margin-top:16px">
      <div class="dropzone" id="dropzone">
        <div class="dropzone-icon">${svgIcon('upload')}</div>
        <p class="dropzone-title">${t('documents.dropzone')}</p>
        <p class="dropzone-sub">${t('documents.dropzone.sources')}</p>
        <div class="dropzone-sources">${cloudChips}</div>
      </div>
      <div class="dropped-files" id="droppedFiles"></div>
    </div>

    <div class="card stagger" style="margin-top:16px">
      <div class="doc-table">
        ${docs.map((d) => `<div class="doc-table-row">
          <div class="doc-table-name">${svgIcon('file')}<span>${d.name}</span></div>
          <span class="badge">${d.type}</span>
          <span class="muted">${d.date}</span>
        </div>`).join('')}
      </div>
    </div>`;
}

function renderConnections() {
  const connected = STUDENT_OS_DATA.connections.connected;
  return viewHeader(t('view.connections.title'), t('view.connections.subtitle')) + `
    <div class="stagger">
      ${STUDENT_OS_LOGO_GROUPS.map((g) => `<div class="card" style="margin-bottom:16px">
        <div class="card-title">${g.label}</div>
        <div class="conn-grid">
          ${g.items.map((key) => {
            const logo = STUDENT_OS_LOGOS[key];
            const isOn = connected.includes(key);
            return `<div class="conn-row">
              <span class="logo-chip${logo.dark ? ' dark' : ''}"><img src="${logo.img}" alt="${logo.name}"></span>
              <span class="conn-name">${logo.name}</span>
              <label class="switch"><input type="checkbox" ${isOn ? 'checked' : ''}><span class="slider"></span></label>
            </div>`;
          }).join('')}
        </div>
      </div>`).join('')}
    </div>`;
}

function renderVie() {
  const contentFns = VIE_CONTENT_FNS();
  return viewHeader(t('view.vie.title'), t('view.vie.subtitle')) + `
    <div class="tab-row">
      ${VIE_TABS.map((tab) => `<button class="tab-btn ${state.vieTab === tab.id ? 'active' : ''}" onclick="setVieTab('${tab.id}')">${t(tab.labelKey)}</button>`).join('')}
    </div>
    <div id="vieTabContent">${contentFns[state.vieTab]()}</div>`;
}

function renderAI() {
  const mode = state.aiMode || 'assistant';
  return viewHeader(t('view.ai.title'), t('view.ai.subtitle')) + `
    <div class="tab-row">
      <button class="tab-btn ${mode === 'assistant' ? 'active' : ''}" onclick="setAiMode('assistant')">${t('ai.modeAssistant')}</button>
      <button class="tab-btn ${mode === 'groups' ? 'active' : ''}" onclick="setAiMode('groups')">${t('ai.modeGroups')}</button>
    </div>
    <div id="aiModeContent">${mode === 'assistant' ? assistantChatContent() : groupsContent()}</div>`;
}

function assistantChatContent() {
  const ai = STUDENT_OS_DATA.ai;
  return `<div class="card chat-card stagger">
      <div class="chat-log" id="chatLog">
        <div class="chat-msg bot">
          <span class="chat-avatar">${svgIcon('bot')}</span>
          <div class="chat-bubble">Salut Camille. Pose-moi une question sur ton budget, ton logement ou tes révisions — je croise tes données pour te répondre.</div>
        </div>
      </div>
      <div class="chat-suggestions">
        ${ai.suggestions.map((s, i) => `<button class="chip" data-suggestion="${i}">${s}</button>`).join('')}
      </div>
      <div class="chat-input-row">
        <input type="text" id="chatInput" placeholder="Écris ta question...">
        <button class="btn btn-primary" id="chatSend">${svgIcon('send')}</button>
      </div>
    </div>`;
}

/* ---------- groupes d'étude (chat de groupe, démo) ---------- */

function groupsContent() {
  if (state.openGroupId) {
    const g = STUDENT_OS_DATA.groups.find((x) => x.id === state.openGroupId);
    if (g) return groupThreadContent(g);
  }
  return groupListContent();
}

function groupListContent() {
  const groups = STUDENT_OS_DATA.groups;
  return `<div class="notes-grid stagger">
    ${groups.map((g) => `<button class="card note-card group-card" onclick="openGroup('${g.id}')">
      <span class="note-card-title">${escapeHtml(g.name)}</span>
      <span class="group-members">${g.members.map((m) => `<span class="avatar sm">${m.initials}</span>`).join('')}</span>
      <span class="note-card-date">${g.messages.length ? g.messages[g.messages.length - 1].text.slice(0, 40) : t('notes.empty')}</span>
    </button>`).join('')}
    <button class="card note-card new-note" onclick="createGroup()">${svgIcon('plus')}<span>${t('ai.newGroup')}</span></button>
  </div>`;
}

function groupThreadContent(g) {
  return `<div class="card chat-card stagger">
    <div class="group-thread-head">
      <button class="icon-btn" onclick="closeGroup()">${svgIcon('chevronLeft')}</button>
      <div><p class="group-thread-name">${escapeHtml(g.name)}</p><p class="muted">${g.members.length} membres</p></div>
    </div>
    <div class="chat-log" id="groupLog">
      ${g.messages.map((m) => `<div class="chat-msg ${m.sender === STUDENT_OS_DATA.user.name ? 'user' : 'group'}">
        ${m.sender !== STUDENT_OS_DATA.user.name ? `<span class="chat-avatar group-avatar">${m.initials}</span>` : ''}
        <div class="chat-bubble">${m.sender !== STUDENT_OS_DATA.user.name ? `<strong class="group-sender">${escapeHtml(m.sender)}</strong>` : ''}${escapeHtml(m.text)}</div>
      </div>`).join('')}
    </div>
    <div class="chat-input-row">
      <input type="text" id="groupInput" placeholder="${t('ai.groupPlaceholder')}">
      <button class="btn btn-primary" id="groupSendBtn">${svgIcon('send')}</button>
    </div>
  </div>`;
}

function setAiMode(mode) {
  state.aiMode = mode;
  state.openGroupId = null;
  document.querySelectorAll('.tab-row .tab-btn')[0].classList.toggle('active', mode === 'assistant');
  document.querySelectorAll('.tab-row .tab-btn')[1].classList.toggle('active', mode === 'groups');
  const el = document.getElementById('aiModeContent');
  el.innerHTML = mode === 'assistant' ? assistantChatContent() : groupsContent();
  animateIn(el);
  if (mode === 'assistant') wireChat(); else wireGroups();
}

function openGroup(id) {
  state.openGroupId = id;
  const el = document.getElementById('aiModeContent');
  el.innerHTML = groupsContent();
  animateIn(el);
  wireGroups();
}
function closeGroup() {
  state.openGroupId = null;
  const el = document.getElementById('aiModeContent');
  el.innerHTML = groupsContent();
  animateIn(el);
}

function persistGroups() {
  try { localStorage.setItem('studentos_groups', JSON.stringify(STUDENT_OS_DATA.groups)); } catch (e) { /* stockage indisponible */ }
}
function loadPersistedGroups() {
  try {
    const raw = localStorage.getItem('studentos_groups');
    if (raw) STUDENT_OS_DATA.groups = JSON.parse(raw);
  } catch (e) { /* stockage indisponible */ }
}

function wireGroups() {
  const sendBtn = document.getElementById('groupSendBtn');
  if (!sendBtn) return;
  const input = document.getElementById('groupInput');
  const send = () => {
    const text = input.value.trim();
    if (!text || !state.openGroupId) return;
    const g = STUDENT_OS_DATA.groups.find((x) => x.id === state.openGroupId);
    g.messages.push({ sender: STUDENT_OS_DATA.user.name, initials: STUDENT_OS_DATA.user.initials, text, time: 'à l’instant' });
    input.value = '';
    persistGroups();
    const el = document.getElementById('aiModeContent');
    el.innerHTML = groupThreadContent(g);
    wireGroups();
    const log = document.getElementById('groupLog');
    if (log) log.scrollTop = log.scrollHeight;
  };
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
}

function createGroup() {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop open';
  backdrop.innerHTML = `<div class="modal card">
      <div class="modal-head"><h2>${t('ai.newGroup')}</h2><button class="icon-btn" id="closeGroupCreate">${svgIcon('close')}</button></div>
      <input class="note-title-input" id="newGroupName" placeholder="${t('ai.groupNamePlaceholder')}">
      <div class="note-editor-actions">
        <button class="btn btn-primary" id="saveGroupBtn">${t('common.save')}</button>
        <button class="btn btn-ghost" id="cancelGroupBtn">${t('common.back')}</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  const close = () => backdrop.remove();
  document.getElementById('closeGroupCreate').addEventListener('click', close);
  document.getElementById('cancelGroupBtn').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.getElementById('saveGroupBtn').addEventListener('click', () => {
    const name = document.getElementById('newGroupName').value.trim();
    if (!name) return;
    const g = { id: 'g' + Date.now(), name, members: [{ initials: STUDENT_OS_DATA.user.initials }], messages: [] };
    STUDENT_OS_DATA.groups.unshift(g);
    persistGroups();
    close();
    openGroup(g.id);
  });
}

function renderNotes() {
  const notes = STUDENT_OS_DATA.notes;
  const tab = state.notesTab || 'notes';
  return viewHeader(t('view.notes.title'), t('view.notes.subtitle')) + `
    <div class="tab-row">
      <button class="tab-btn ${tab === 'notes' ? 'active' : ''}" onclick="setNotesTab('notes')">${t('notes.tabNotes')}</button>
      <button class="tab-btn ${tab === 'mindmap' ? 'active' : ''}" onclick="setNotesTab('mindmap')">${t('notes.tabMindmap')}</button>
    </div>
    <div id="notesTabContent">${tab === 'notes' ? notesListContent(notes) : mindmapContent()}</div>`;
}

function notesListContent(notes) {
  if (!notes.length) {
    return `<p class="hint">${t('notes.empty')}</p><button class="btn btn-primary" onclick="createNote()">${svgIcon('plus')} ${t('notes.new')}</button>`;
  }
  return `<div class="notes-grid stagger">
    ${notes.map((n) => `<button class="card note-card" onclick="openNote('${n.id}')">
      <span class="note-card-title">${escapeHtml(n.title)}</span>
      <span class="note-card-preview">${escapeHtml(n.body.replace(/\n/g, ' '))}</span>
      <span class="note-card-date">${n.updated}</span>
    </button>`).join('')}
    <button class="card note-card new-note" onclick="createNote()">${svgIcon('plus')}<span>${t('notes.new')}</span></button>
  </div>`;
}

function mindmapContent() {
  const nodes = STUDENT_OS_DATA.mindmap.nodes;
  return `<div class="mindmap-wrap" id="mindmapWrap">
      <svg class="mindmap-svg" id="mindmapSvg"></svg>
      ${nodes.map((n) => `<div class="mindmap-node${n.root ? ' root' : ''}" id="node-${n.id}" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">${n.label}</div>`).join('')}
      <button class="mindmap-fab" id="mindmapAddBtn" title="${t('notes.addNode')}">${svgIcon('plus')}</button>
    </div>
    <p class="mindmap-hint">${t('notes.mindmapHint')}</p>`;
}

function renderPricing() {
  const period = state.pricingPeriod || 'yearly';
  const promo = state.promoApplied;
  return viewHeader(t('pricing.title'), t('pricing.subtitle')) + `
    <div class="pricing-devices-note stagger">${svgIcon('user')}<span>${STUDENT_OS_DATA.pricing.devicesNote}</span></div>

    <div class="pricing-toggle" id="pricingToggle">
      <button data-period="yearly" class="${period === 'yearly' ? 'active' : ''}">${t('pricing.yearly')}</button>
      <button data-period="monthly" class="${period === 'monthly' ? 'active' : ''}">${t('pricing.monthly')}</button>
    </div>
    <div class="pricing-grid stagger" id="pricingGrid">${pricingCards(period)}</div>

    <div class="card promo-card stagger" style="margin-top:16px">
      <div class="card-title">${svgIcon('sparkles')} ${t('pricing.promoCode')}</div>
      <div class="promo-row">
        <input type="text" id="promoInput" placeholder="${t('pricing.promoPlaceholder')}" value="${promo ? promo.code.toUpperCase() : ''}">
        <button class="btn btn-primary" id="promoApplyBtn">${t('pricing.promoApply')}</button>
      </div>
      <p class="promo-feedback${promo ? ' success' : ''}" id="promoFeedback">${promo ? `${svgIcon('check')} ${t('pricing.promoApplied').replace('{percent}', promo.percent)}` : ''}</p>
    </div>

    <div class="card stagger" style="margin-top:16px">
      <div class="card-title">${t('pricing.payment')}</div>
      <div class="chips-row">
        ${STUDENT_OS_PAYMENT_KEYS.map((key) => {
          const logo = STUDENT_OS_LOGOS[key];
          return `<span class="logo-chip${logo.dark ? ' dark' : ''}" title="${logo.name}"><img src="${logo.img}" alt="${logo.name}"></span>`;
        }).join('')}
      </div>
    </div>`;
}

function pricingCards(period) {
  const p = STUDENT_OS_DATA.pricing;
  const promo = state.promoApplied;
  return p.tiers.map((tier) => {
    const basePrice = period === 'yearly' ? tier.yearly : tier.monthly;
    const price = promo && basePrice > 0 ? basePrice * (1 - promo.percent / 100) : basePrice;
    const yearlyEquivalent = tier.monthly * 12;
    const savePct = tier.yearly > 0 ? Math.round((1 - tier.yearly / yearlyEquivalent) * 100) : 0;
    const isCurrent = p.currentTier === tier.key;
    const features = [1, 2, 3, 4].map((n) => t(`pricing.${tier.key}.f${n}`)).filter((f) => f && !f.startsWith('pricing.'));
    const storageLine = t('pricing.storage').replace('{gb}', tier.storageGb);
    return `<div class="card pricing-card${tier.featured ? ' featured' : ''}">
      ${tier.featured ? `<span class="pricing-badge">${t('pricing.' + tier.key)} ★</span>` : ''}
      <div class="pricing-name-row">
        <p class="pricing-name">${t('pricing.' + tier.key)}</p>
        <button type="button" class="pricing-info-btn" data-tier="${tier.key}" aria-label="${t('pricing.details')}">i</button>
      </div>
      <p class="pricing-price">
        ${promo && basePrice > 0 ? `<span class="pricing-price-strike">${basePrice.toFixed(2)} €</span>` : ''}
        ${basePrice === 0 ? '0 €' : `${price.toFixed(2)} €`}<span>${basePrice === 0 ? '' : (period === 'yearly' ? t('pricing.perYear') : t('pricing.perMonth'))}</span>
      </p>
      <p class="pricing-note">${period === 'yearly' && savePct > 0 ? `${svgIcon('sparkles', 'inline-icon')} ${t('pricing.save')} ${savePct}%` : ''}</p>
      <ul class="pricing-features">
        <li class="storage-line">${svgIcon('folder')}<span>${storageLine}</span></li>
        ${features.map((f) => `<li>${svgIcon('check')}<span>${f}</span></li>`).join('')}
      </ul>
      <button class="btn ${tier.featured ? 'btn-primary' : ''} btn-block" ${isCurrent ? 'disabled' : ''}>${isCurrent ? t('pricing.current') : t('pricing.choose')}</button>
    </div>`;
  }).join('');
}

function openTierInfo(tierKey) {
  const tier = STUDENT_OS_DATA.pricing.tiers.find((x) => x.key === tierKey);
  if (!tier) return;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop open';
  backdrop.innerHTML = `<div class="modal card">
      <div class="modal-head"><h2>${t('pricing.' + tier.key)}</h2><button class="icon-btn" id="closeTierInfo">${svgIcon('close')}</button></div>
      <p class="tier-info-desc">${escapeHtml(tier.description)}</p>
      <p class="tier-info-storage">${svgIcon('folder')} ${t('pricing.storage').replace('{gb}', tier.storageGb)}</p>
    </div>`;
  document.body.appendChild(backdrop);
  const close = () => backdrop.remove();
  document.getElementById('closeTierInfo').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
}

/* ---------- navigation & chat (partagés) ---------- */

function setVieTab(tab) {
  state.vieTab = tab;
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
  const idx = VIE_TABS.findIndex((vt) => vt.id === tab);
  document.querySelectorAll('.tab-btn')[idx].classList.add('active');
  const contentFns = VIE_CONTENT_FNS();
  const el = document.getElementById('vieTabContent');
  el.innerHTML = contentFns[tab]();
  animateIn(el);
}

function setNotesTab(tab) {
  state.notesTab = tab;
  document.querySelectorAll('.tab-row .tab-btn')[0].classList.toggle('active', tab === 'notes');
  document.querySelectorAll('.tab-row .tab-btn')[1].classList.toggle('active', tab === 'mindmap');
  const el = document.getElementById('notesTabContent');
  el.innerHTML = tab === 'notes' ? notesListContent(STUDENT_OS_DATA.notes) : mindmapContent();
  animateIn(el);
  if (tab === 'mindmap') wireMindmap();
}

const RENDERERS = {
  home: renderHome, studies: renderStudies, agenda: renderAgenda, inbox: renderInbox, money: renderMoney,
  vie: renderVie, courses: renderCourses, documents: renderDocuments, notes: renderNotes, ai: renderAI,
  connections: renderConnections, pricing: renderPricing,
};

function goTo(view, vieTab) {
  if (vieTab) state.vieTab = vieTab;
  setActiveView(view);
}

function wireChat() {
  const send = document.getElementById('chatSend');
  const input = document.getElementById('chatInput');
  const fire = () => { if (input.value.trim()) { askAI(input.value.trim()); input.value = ''; } };
  send.addEventListener('click', fire);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') fire(); });
  document.querySelectorAll('[data-suggestion]').forEach((btn) => {
    btn.addEventListener('click', () => askAI(STUDENT_OS_DATA.ai.suggestions[Number(btn.dataset.suggestion)]));
  });
}

function askAI(question) {
  const log = document.getElementById('chatLog');
  if (!log) return;
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<div class="chat-bubble">${escapeHtml(question)}</div>`;
  log.appendChild(userMsg);

  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.innerHTML = `<span class="chat-avatar">${svgIcon('bot')}</span><div class="chat-bubble typing"><span></span><span></span><span></span></div>`;
  log.appendChild(typing);
  log.scrollTop = log.scrollHeight;

  const answer = STUDENT_OS_DATA.ai.answers[question.toLowerCase()] || STUDENT_OS_DATA.ai.defaultAnswer;
  setTimeout(() => {
    typing.querySelector('.chat-bubble').classList.remove('typing');
    typing.querySelector('.chat-bubble').textContent = answer;
    log.scrollTop = log.scrollHeight;
  }, 900);
}

/* ---------- thème / police : getTheme/setTheme/getFont/setFont vivent dans shared/js/i18n.js
   (chargé aussi bien par l'onboarding que par l'app, contrairement à views.js) ---------- */

function applyThemeAndFont() {
  document.documentElement.dataset.theme = getTheme();
  document.documentElement.dataset.font = getFont();
}

function refreshLanguage() {
  applyI18n(document);
  if (typeof rebuildNav === 'function') rebuildNav();
  setActiveView(state.view);
}

function wireSettingsPreferences() {
  const themeButtons = document.querySelectorAll('.theme-opt');
  const syncTheme = () => {
    const cur = getTheme();
    themeButtons.forEach((b) => b.classList.toggle('active', b.dataset.theme === cur));
  };
  syncTheme();
  themeButtons.forEach((b) => b.addEventListener('click', () => { setTheme(b.dataset.theme); syncTheme(); }));
  const themeIconDark = document.getElementById('themeIconDark');
  const themeIconLight = document.getElementById('themeIconLight');
  if (themeIconDark) themeIconDark.innerHTML = svgIcon('moon');
  if (themeIconLight) themeIconLight.innerHTML = svgIcon('sparkles');

  const fontSelect = document.getElementById('fontSelect');
  if (fontSelect) {
    fontSelect.value = getFont();
    fontSelect.addEventListener('change', () => setFont(fontSelect.value));
  }

  buildLangPicker('langSelect', refreshLanguage);

  const seePricingBtn = document.getElementById('seePricingBtn');
  if (seePricingBtn) seePricingBtn.addEventListener('click', () => { closeSettings(); setActiveView('pricing'); });
}

/* ---------- tarifs ---------- */

function refreshPricingGrid() {
  const grid = document.getElementById('pricingGrid');
  if (!grid) return;
  grid.innerHTML = pricingCards(state.pricingPeriod || 'yearly');
  animateIn(grid);
  grid.querySelectorAll('.pricing-info-btn').forEach((btn) => {
    btn.addEventListener('click', () => openTierInfo(btn.dataset.tier));
  });
}

function wirePricing() {
  const toggle = document.getElementById('pricingToggle');
  if (!toggle) return;
  toggle.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.pricingPeriod = btn.dataset.period;
      toggle.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === btn));
      refreshPricingGrid();
    });
  });

  document.querySelectorAll('.pricing-info-btn').forEach((btn) => {
    btn.addEventListener('click', () => openTierInfo(btn.dataset.tier));
  });

  const promoBtn = document.getElementById('promoApplyBtn');
  if (promoBtn) {
    promoBtn.addEventListener('click', () => {
      const input = document.getElementById('promoInput');
      const code = input.value.trim().toLowerCase();
      const percent = STUDENT_OS_DATA.pricing.promoCodes[code];
      const feedback = document.getElementById('promoFeedback');
      if (percent) {
        state.promoApplied = { code, percent };
        feedback.innerHTML = `${svgIcon('check')} ${t('pricing.promoApplied').replace('{percent}', percent)}`;
        feedback.classList.remove('error');
        feedback.classList.add('success');
      } else {
        state.promoApplied = null;
        feedback.textContent = code ? t('pricing.promoInvalid') : '';
        feedback.classList.remove('success');
        feedback.classList.toggle('error', !!code);
      }
      refreshPricingGrid();
    });
  }
}

/* ---------- documents : dépôt de fichiers (démo, glisser-déposer + services cloud) ---------- */

function wireDropzone() {
  const zone = document.getElementById('dropzone');
  if (!zone) return;
  const list = document.getElementById('droppedFiles');

  const addFiles = (files) => {
    Array.from(files).forEach((f) => {
      const row = document.createElement('div');
      row.className = 'dropped-file';
      const kb = f.size ? Math.max(1, Math.round(f.size / 1024)) : 0;
      row.innerHTML = `${svgIcon('file')}<span>${escapeHtml(f.name)}</span><span class="file-size">${kb} Ko</span>`;
      list.prepend(row);
    });
  };

  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  });
  zone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.addEventListener('change', () => addFiles(input.files));
    input.click();
  });
  zone.querySelectorAll('.dropzone-sources .logo-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = chip.dataset.cloud;
      const name = STUDENT_OS_LOGOS[key].name;
      const demoFiles = ['Cours_Macro-eco.pdf', 'Notes_TD_Stats.docx', 'Planning_semestre.xlsx', 'Fiche_revision.pdf'];
      const pick = demoFiles[Math.floor(Math.random() * demoFiles.length)];
      addFiles([{ name: `${pick} · ${name}`, size: 128000 + Math.random() * 900000 }]);
    });
  });
}

/* ---------- notes ---------- */

function persistNotes() {
  try { localStorage.setItem('studentos_notes', JSON.stringify(STUDENT_OS_DATA.notes)); } catch (e) { /* stockage indisponible */ }
}
function loadPersistedNotes() {
  try {
    const raw = localStorage.getItem('studentos_notes');
    if (raw) STUDENT_OS_DATA.notes = JSON.parse(raw);
  } catch (e) { /* stockage indisponible */ }
}

function openNoteEditor(note) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop open';
  backdrop.innerHTML = `<div class="modal card note-editor">
      <div class="modal-head"><h2>${t('notes.new')}</h2><button class="icon-btn" id="closeNoteEditor">${svgIcon('close')}</button></div>
      <input class="note-title-input" id="noteTitleInput" value="${escapeHtml(note.title || '')}" placeholder="${t('notes.new')}">
      <textarea class="note-body-input" id="noteBodyInput" placeholder="...">${escapeHtml(note.body || '')}</textarea>
      <div class="note-editor-actions">
        <button class="btn btn-primary" id="saveNoteBtn">${t('common.save')}</button>
        <button class="btn btn-ghost" id="cancelNoteBtn">${t('common.back')}</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();
  document.getElementById('closeNoteEditor').addEventListener('click', close);
  document.getElementById('cancelNoteBtn').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.getElementById('saveNoteBtn').addEventListener('click', () => {
    const title = document.getElementById('noteTitleInput').value.trim() || t('notes.new');
    const body = document.getElementById('noteBodyInput').value;
    if (note.id) {
      const existing = STUDENT_OS_DATA.notes.find((n) => n.id === note.id);
      existing.title = title; existing.body = body; existing.updated = 'à l’instant';
    } else {
      STUDENT_OS_DATA.notes.unshift({ id: 'n' + Date.now(), title, body, updated: 'à l’instant' });
    }
    persistNotes();
    close();
    setNotesTab('notes');
  });
}
function createNote() { openNoteEditor({}); }
function openNote(id) {
  const n = STUDENT_OS_DATA.notes.find((x) => x.id === id);
  if (n) openNoteEditor(n);
}

/* ---------- carte mentale (nœuds déplaçables par glisser-déposer, SVG pour les liens) ---------- */

function persistMindmap() {
  try { localStorage.setItem('studentos_mindmap', JSON.stringify(STUDENT_OS_DATA.mindmap)); } catch (e) { /* stockage indisponible */ }
}
function loadPersistedMindmap() {
  try {
    const raw = localStorage.getItem('studentos_mindmap');
    if (raw) STUDENT_OS_DATA.mindmap = JSON.parse(raw);
  } catch (e) { /* stockage indisponible */ }
}

function wireMindmap() {
  const wrap = document.getElementById('mindmapWrap');
  if (!wrap) return;
  const svg = document.getElementById('mindmapSvg');
  const nodes = STUDENT_OS_DATA.mindmap.nodes;

  function drawLines() {
    svg.innerHTML = nodes.filter((n) => n.parent).map((n) => {
      const p = nodes.find((x) => x.id === n.parent);
      if (!p) return '';
      return `<line x1="${p.x}" y1="${p.y}" x2="${n.x}" y2="${n.y}"/>`;
    }).join('');
  }
  drawLines();

  let dragId = null, offsetX = 0, offsetY = 0;
  wrap.querySelectorAll('.mindmap-node').forEach((el) => {
    el.addEventListener('pointerdown', (e) => {
      dragId = el.dataset.id;
      const node = nodes.find((n) => n.id === dragId);
      const rect = wrap.getBoundingClientRect();
      offsetX = e.clientX - rect.left - node.x;
      offsetY = e.clientY - rect.top - node.y;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => {
      if (dragId !== el.dataset.id) return;
      const node = nodes.find((n) => n.id === dragId);
      const rect = wrap.getBoundingClientRect();
      node.x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left - offsetX));
      node.y = Math.max(24, Math.min(rect.height - 24, e.clientY - rect.top - offsetY));
      el.style.left = node.x + 'px';
      el.style.top = node.y + 'px';
      drawLines();
    });
    const release = () => { if (dragId) { persistMindmap(); dragId = null; } };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
  });

  const addBtn = document.getElementById('mindmapAddBtn');
  addBtn.addEventListener('click', () => {
    const root = nodes.find((n) => n.root) || nodes[0];
    const angle = Math.random() * Math.PI * 2;
    nodes.push({
      id: 'n' + Date.now(),
      label: t('notes.addNode'),
      x: Math.max(40, root.x + Math.cos(angle) * 130),
      y: Math.max(30, root.y + Math.sin(angle) * 130),
      parent: root.id,
    });
    persistMindmap();
    setNotesTab('mindmap');
  });
}
