/* Student OS — données mockées, partagées entre desktop/ et mobile/.
   Aucune donnée réelle : tout est fictif, pour la démo visuelle. */

const STUDENT_OS_DATA = {
  user: {
    name: 'Camille Bernard',
    initials: 'CB',
    school: 'Université Lyon 2 — L3 Économie',
  },

  home: {
    greeting: 'Salut Camille 👋',
    subtitle: "Voici où tu en es aujourd'hui.",
    cards: [
      { icon: 'wallet', label: 'Reste à vivre', value: '259 €', trend: "jusqu'au 30", tone: 'warning' },
      { icon: 'book', label: 'Prochain cours', value: 'Macro-éco', trend: '10h00 · Amphi B', tone: 'info' },
      { icon: 'route', label: 'Trajet du matin', value: '28 min', trend: 'RER B — à l’heure', tone: 'success' },
      { icon: 'moon', label: 'Sommeil cette nuit', value: '7h21', trend: '+12 min vs hier', tone: 'success' },
    ],
    aiTip: "Ton budget tient jusqu'au prochain versement, mais range les sorties : il te reste 34 € de marge après le loyer.",
  },

  studies: {
    schedule: [
      { time: '08:00', title: 'Statistiques appliquées', room: 'Salle 214', tag: 'TD' },
      { time: '10:00', title: 'Macro-économie', room: 'Amphi B', tag: 'CM' },
      { time: '14:00', title: 'Anglais des affaires', room: 'Salle 108', tag: 'TD' },
      { time: '16:00', title: 'Projet tutoré', room: 'Bibliothèque', tag: 'Travail perso' },
    ],
    grades: [
      { course: 'Micro-économie', grade: '15,5/20', date: '12 août' },
      { course: 'Statistiques', grade: '12/20', date: '5 août' },
      { course: 'Anglais', grade: '17/20', date: '29 juil.' },
    ],
    assignments: [
      { title: 'Dossier Macro-éco — croissance UE', due: 'Vendredi', progress: 60 },
      { title: 'Compte-rendu TD Stats', due: 'Lundi prochain', progress: 20 },
    ],
    notionNotes: [
      { course: 'Macro-économie', page: 'Notes de cours — croissance & inflation', updated: 'hier' },
      { course: 'Statistiques appliquées', page: 'Fiches de révision TD', updated: 'il y a 3 j' },
      { course: 'Anglais des affaires', page: 'Vocabulaire & expressions', updated: 'il y a 1 sem.' },
    ],
  },

  agenda: {
    week: 'Semaine du 25 au 31 août',
    googleCalendarSynced: true,
    days: [
      { day: 'Lun 25', events: [{ time: '10h', title: 'Macro-éco' }] },
      { day: 'Mar 26', events: [{ time: '14h', title: 'Anglais' }] },
      { day: 'Mer 27', events: [{ time: '09h', title: 'Sport universitaire' }] },
      { day: 'Jeu 28', events: [{ time: '18h', title: 'Révisions groupe' }] },
      { day: 'Ven 29', events: [{ time: '09h', title: 'Examen Macro-éco', highlight: true }] },
      { day: 'Sam 30', events: [] },
      { day: 'Dim 31', events: [{ time: '20h', title: 'Prélèvement loyer' }] },
    ],
  },

  inbox: [
    { icon: 'alert', title: 'Budget courses', body: 'Tu approches de la limite mensuelle (23 € restants).', time: 'il y a 1 h', tone: 'warning' },
    { icon: 'file', title: 'CAF', body: 'Un justificatif est encore attendu pour ton dossier.', time: 'il y a 3 h', tone: 'info' },
    { icon: 'check', title: 'Loyer', body: 'Prélèvement de 410 € confirmé pour le 1er septembre.', time: 'hier', tone: 'success' },
    { icon: 'book', title: 'Université', body: 'Note publiée pour Micro-économie : 15,5/20.', time: 'hier', tone: 'info' },
  ],

  money: {
    resteAVivre: 259,
    depense: 421,
    budgetTotal: 680,
    forecastAlertText: 'À ce rythme, dépassement estimé de 34 € avant le prochain versement.',
    nextIncomeDate: '1er septembre',
    categories: [
      { label: 'Loyer', spent: 410, budget: 410, icon: 'home' },
      { label: 'Courses', spent: 157, budget: 180, icon: 'cart' },
      { label: 'Transport', spent: 38, budget: 40, icon: 'route' },
      { label: 'Abonnements', spent: 24, budget: 25, icon: 'repeat' },
      { label: 'Sorties', spent: 52, budget: 30, icon: 'sparkles' },
      { label: 'Autres', spent: 18, budget: 45, icon: 'dots' },
    ],
    subscriptions: [
      { name: 'Spotify', price: '5,99 €', domain: 'spotify.com' },
      { name: 'Netflix', price: '7,99 €', domain: 'netflix.com' },
      { name: 'Salle de sport', price: '19,90 €', domain: 'basicfit.com' },
    ],
    savingsGoal: { label: 'Voyage fin d’année', current: 240, target: 600 },
    cashflow: [420, 380, 500, 300, 260, 259],
    unusualSpend: { label: 'Dépense inhabituelle détectée', detail: 'Sortie 52 € samedi — 2x ta moyenne habituelle.' },
  },

  logement: {
    rent: 410,
    charges: 48,
    roommates: 2,
    nextDebit: '1er septembre',
    contractEnd: 'Bail jusqu’au 31 août 2027',
    apl: 128,
    documents: ['Bail signé', 'Attestation assurance habitation', 'État des lieux'],
  },

  administratif: {
    thisWeek: ['Finaliser inscription universitaire', 'Envoyer justificatif CAF', 'Payer résidence'],
    in18Days: ['Dossier de bourse', 'Renouvellement mutuelle'],
    nextMonth: ['Assurance habitation', 'Carte de transport'],
  },

  transport: {
    from: 'Domicile',
    to: 'Université',
    duration: '28 min',
    recommendedDeparture: '08:07',
    line: 'RER B',
    disruption: 'Aucune perturbation signalée',
    subscription: 'Forfait Imagine R',
    cost: '38 €/mois',
    nextDepartures: ['08:07', '08:14', '08:22'],
    activeDestination: 'universite',
    destinations: [
      { id: 'universite', label: 'Université', icon: 'book', to: 'Université', duration: '28 min', recommendedDeparture: '08:07', line: 'RER B', nextDepartures: ['08:07', '08:14', '08:22'] },
      { id: 'bibliotheque', label: 'Bibliothèque', icon: 'folder', to: 'Bibliothèque universitaire', duration: '12 min', recommendedDeparture: '09:40', line: 'Tram T1', nextDepartures: ['09:40', '09:52', '10:05'] },
      { id: 'sport', label: 'Salle de sport', icon: 'activity', to: 'Salle de sport', duration: '18 min', recommendedDeparture: '17:30', line: 'Bus C7', nextDepartures: ['17:30', '17:45', '18:00'] },
      { id: 'domicile', label: 'Retour domicile', icon: 'home', to: 'Domicile', duration: '26 min', recommendedDeparture: '18:20', line: 'RER B', nextDepartures: ['18:20', '18:35', '18:50'] },
    ],
  },

  sante: {
    sleep: { value: '7h21', percent: 92, target: '8h' },
    steps: { value: 7421, percent: 74, target: 10000 },
    focus: { value: '3h10', percent: 63, target: '5h' },
    hydration: { value: 1.4, percent: 70, target: 2 },
  },

  courses: {
    budgetLeft: 23,
    inventory: ['Pâtes', 'Œufs', 'Riz', 'Lentilles', 'Oignons', 'Fromage râpé'],
    meals: [
      { name: 'Pâtes / œufs', cost: '2,10 €' },
      { name: 'Riz cantonais', cost: '3,40 €' },
      { name: 'Soupe de lentilles', cost: '1,80 €' },
      { name: 'Omelette', cost: '1,90 €' },
    ],
    shoppingList: ['Lait', 'Pain', 'Pommes', 'Yaourts', 'Poulet'],
    waste: 'Aucun gaspillage détecté cette semaine',
  },

  documents: [
    { name: 'Bail de résidence', type: 'PDF', date: '02 juil.' },
    { name: 'Attestation mutuelle', type: 'PDF', date: '18 juil.' },
    { name: 'Carte étudiante', type: 'Image', date: '01 sept.' },
    { name: 'Relevé de notes S1', type: 'PDF', date: '20 juin' },
    { name: 'Justificatif CAF', type: 'PDF', date: 'en attente' },
  ],

  driveSync: {
    connected: true,
    filesSynced: 128,
    storageUsed: '6,4 Go',
    storageTotal: '15 Go',
    lastSync: 'il y a 12 min',
  },

  ai: {
    suggestions: [
      "J'ai 150 € jusqu'à la fin du mois, mon loyer tombe dans 5 jours et j'ai un examen vendredi.",
      'Combien me reste-t-il pour les courses cette semaine ?',
      'Résume ma semaine.',
    ],
    defaultAnswer:
      "Ton budget est suffisant jusqu'au prochain versement, mais tu risques de dépasser ton budget courses de 27 €. Je te propose une liste de courses à 35 € pour tenir jusqu'à dimanche. Ton examen de vendredi nécessite encore environ 3 h de révision — je peux placer ces sessions dans ton calendrier.",
    answers: {
      "j'ai 150 € jusqu'à la fin du mois, mon loyer tombe dans 5 jours et j'ai un examen vendredi.":
        "Ton budget est suffisant jusqu'au prochain versement, mais tu risques de dépasser ton budget courses de 27 €. Je te propose une liste de courses à 35 € pour tenir jusqu'à dimanche. Ton examen de vendredi nécessite encore environ 3 h de révision — je peux placer ces sessions dans ton calendrier.",
      'combien me reste-t-il pour les courses cette semaine ?':
        "Il te reste 23 € sur ton budget courses. Avec ton inventaire actuel, tu peux tenir 4 repas sans acheter davantage — je peux te proposer une liste à moins de 10 € si besoin.",
      'résume ma semaine.':
        "Semaine chargée : examen de Macro-éco vendredi, loyer prélevé dimanche (410 €), et ton budget sorties est déjà dépassé de 22 €. Je te conseille de limiter les sorties et de caler 2 sessions de révision d'ici jeudi.",
    },
  },

  connections: {
    connected: ['n26', 'appleHealth', 'ratp', 'caf', 'googleDrive', 'googleCalendar'],
  },

  pricing: {
    currentTier: 'tier2',
    devicesNote: 'Un seul compte Student OS par formule — mais connecté sur autant d’appareils que tu veux (téléphone, tablette, PC) en même temps, avec le même identifiant.',
    tiers: [
      {
        key: 'tier0', yearly: 0, monthly: 0, storageGb: 1, featured: false,
        description: "La formule Gratuit te donne un aperçu de Student OS à vie, sans carte bancaire : suivi de budget basique, ton agenda et tes cours, et un accès limité à Student AI (3 questions par jour) pour tester l'assistant. Idéal pour découvrir l'application avant de passer à une formule payante. 1 Go de stockage pour tes documents essentiels.",
      },
      {
        key: 'tier1', yearly: 19.99, monthly: 2.49, storageGb: 10, featured: false,
        description: "Essentiel ajoute le module Vie complet (logement, administratif, transport, santé, courses) à ton budget et ton agenda, avec Student AI en illimité et jusqu'à 3 comptes externes connectés (banque, santé, transport...). 10 Go de stockage. Parfait pour un usage quotidien sans les extras.",
      },
      {
        key: 'tier2', yearly: 39.99, monthly: 4.49, storageGb: 50, featured: true,
        description: "Étudiant est notre formule la plus choisie : tout Essentiel, plus les Notes & cartes mentales, les documents illimités, des comptes externes connectés sans limite et 50 Go de stockage. Pensée pour accompagner un cursus complet, du premier cours à la dernière révision.",
      },
      {
        key: 'tier3', yearly: 79.99, monthly: 8.99, storageGb: 200, featured: false,
        description: "Premium débloque tout : 200 Go de stockage, groupes d'étude illimités dans Student AI, réductions partenaires exclusives (formules Réductions étudiantes en avant-première) et un support prioritaire. Pour celles et ceux qui veulent Student OS sans aucune limite.",
      },
    ],
    promoCodes: {
      etudiant10: 10,
      bienvenue20: 20,
    },
  },

  notes: [
    { id: 'n1', title: 'Révisions Macro-éco', body: "Croissance = PIB réel.\nInflation : IPC, effets sur le pouvoir d'achat.\nÀ revoir avant vendredi : politique monétaire BCE.", updated: 'il y a 2 h' },
    { id: 'n2', title: 'Idées de projet tutoré', body: "Sujet : impact du télétravail sur la consommation étudiante.\nPlan : intro, méthodo (sondage), analyse, conclusion.", updated: 'hier' },
    { id: 'n3', title: 'Colloc — répartition charges', body: "Loyer 410€ / 2 = 205€ chacun.\nCharges 48€ / 2 = 24€ chacun.\nInternet à ajouter le mois prochain.", updated: 'il y a 3 j' },
  ],

  mindmap: {
    nodes: [
      { id: 'root', label: 'Examen Macro-éco', x: 300, y: 210, root: true },
      { id: 'n1', label: 'Croissance', x: 150, y: 100, parent: 'root' },
      { id: 'n2', label: 'Inflation', x: 460, y: 90, parent: 'root' },
      { id: 'n3', label: 'Politique monétaire', x: 470, y: 300, parent: 'root' },
      { id: 'n4', label: 'Chômage', x: 130, y: 320, parent: 'root' },
      { id: 'n5', label: 'PIB réel', x: 60, y: 190, parent: 'n1' },
    ],
  },

  groups: [
    {
      id: 'g1', name: 'Macro-éco L3',
      members: [{ initials: 'CB' }, { initials: 'LT' }, { initials: 'MK' }],
      messages: [
        { sender: 'Léa T.', initials: 'LT', text: "Quelqu'un a les notes du dernier CM ?", time: '10:12' },
        { sender: 'Camille Bernard', initials: 'CB', text: 'Je les mets sur le drive du groupe ce soir', time: '10:15' },
        { sender: 'Marc K.', initials: 'MK', text: 'Merci ! On se cale une session de révision jeudi ?', time: '10:20' },
      ],
    },
    {
      id: 'g2', name: 'Révisions Stats',
      members: [{ initials: 'CB' }, { initials: 'SO' }],
      messages: [
        { sender: 'Sofia O.', initials: 'SO', text: "J'ai fait une fiche sur les tests d'hypothèses, je la partage ?", time: 'hier' },
      ],
    },
    {
      id: 'g3', name: 'Coloc — courses & compte commun',
      members: [{ initials: 'CB' }, { initials: 'JD' }],
      messages: [
        { sender: 'Jules D.', initials: 'JD', text: "J'ai payé les courses cette semaine, on partage ce soir ?", time: 'lundi' },
      ],
    },
  ],
};
