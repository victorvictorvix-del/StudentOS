/* Student OS — registre des logos externes (démo).
   Les logos sont chargés en ligne depuis des sources publiques réelles :
   - Simple Icons (cdn.simpleicons.org/{slug}) : pictos vectoriels officiels des grandes marques tech.
   - Google Favicon service (google.com/s2/favicons?domain=...) : vrai favicon scrapé du site officiel
     de la marque — utilisé pour les services (banques, transport, administratif) absents de Simple Icons.
   (L'ancienne API logo.clearbit.com a été fermée par Clearbit/HubSpot — remplacée ici par ces deux sources,
   vérifiées disponibles.) Nécessite une connexion internet au rendu ; pas de fichier à héberger. */

function simpleIcon(slug, hex) {
  return `https://cdn.simpleicons.org/${slug}${hex ? '/' + hex : ''}`;
}
function favicon(domain, size) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size || 128}`;
}
function ddgFavicon(domain) {
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

const STUDENT_OS_LOGOS = {
  google: { name: 'Google', img: simpleIcon('google'), dark: false },
  apple: { name: 'Apple', img: simpleIcon('apple', 'ffffff'), dark: true },
  appleHealth: { name: 'Apple Santé', img: simpleIcon('apple', 'ffffff'), dark: true },
  googleFit: { name: 'Google Fit', img: favicon('fit.google.com'), dark: false },

  n26: { name: 'N26', img: favicon('n26.com'), dark: false },
  boursorama: { name: 'Boursorama Banque', img: favicon('boursorama-banque.com'), dark: false },
  revolut: { name: 'Revolut', img: simpleIcon('revolut'), dark: false },
  bnpParibas: { name: 'BNP Paribas', img: favicon('bnpparibas.fr'), dark: false },
  societeGenerale: { name: 'Société Générale', img: ddgFavicon('societegenerale.com'), dark: false },
  creditAgricole: { name: 'Crédit Agricole', img: favicon('credit-agricole.fr'), dark: false },

  ratp: { name: 'IDF Mobilités', img: favicon('iledefrance-mobilites.fr'), dark: false },
  sncfConnect: { name: 'SNCF Connect', img: favicon('sncf-connect.com'), dark: false },
  citymapper: { name: 'Citymapper', img: favicon('citymapper.com'), dark: false },
  googleMaps: { name: 'Google Maps', img: simpleIcon('googlemaps'), dark: false },

  caf: { name: 'CAF', img: favicon('caf.fr'), dark: false },
  ameli: { name: 'Ameli', img: favicon('ameli.fr'), dark: false },
  parcoursup: { name: 'Parcoursup / ENT', img: favicon('parcoursup.fr'), dark: false },

  notion: { name: 'Notion', img: simpleIcon('notion', 'ffffff'), dark: true },
  googleDrive: { name: 'Google Drive', img: simpleIcon('googledrive'), dark: false },
  dropbox: { name: 'Dropbox', img: simpleIcon('dropbox'), dark: false },
  icloud: { name: 'iCloud', img: simpleIcon('icloud'), dark: false },
  googleCalendar: { name: 'Google Calendar', img: simpleIcon('googlecalendar'), dark: false },

  unidays: { name: 'UNiDAYS', img: ddgFavicon('unidays.com'), dark: false },
  studentbeans: { name: 'Student Beans', img: favicon('studentbeans.com'), dark: false },
  toogoodtogo: { name: 'Too Good To Go', img: favicon('toogoodtogo.com'), dark: false },
  crous: { name: 'Les Crous', img: favicon('lescrous.fr'), dark: false },
  isic: { name: 'ISIC', img: favicon('isic.org'), dark: false },

  visa: { name: 'Visa', img: simpleIcon('visa'), dark: false },
  mastercard: { name: 'Mastercard', img: simpleIcon('mastercard'), dark: false },
  paypal: { name: 'PayPal', img: simpleIcon('paypal'), dark: false },
  applepay: { name: 'Apple Pay', img: simpleIcon('applepay'), dark: false },
  googlepay: { name: 'Google Pay', img: simpleIcon('googlepay'), dark: false },
};

const STUDENT_OS_CLOUD_KEYS = ['googleDrive', 'dropbox', 'icloud'];
const STUDENT_OS_PAYMENT_KEYS = ['visa', 'mastercard', 'paypal', 'applepay', 'googlepay'];

const STUDENT_OS_LOGO_GROUPS = [
  {
    label: 'Banques',
    items: ['n26', 'boursorama', 'revolut', 'bnpParibas', 'societeGenerale', 'creditAgricole'],
  },
  {
    label: 'Santé',
    items: ['appleHealth', 'googleFit'],
  },
  {
    label: 'Transport',
    items: ['ratp', 'sncfConnect', 'citymapper', 'googleMaps'],
  },
  {
    label: 'Administratif',
    items: ['caf', 'ameli', 'parcoursup'],
  },
  {
    label: 'Cours & productivité',
    items: ['googleCalendar', 'notion', 'googleDrive', 'dropbox', 'icloud'],
  },
  {
    label: 'Réductions étudiantes',
    items: ['unidays', 'studentbeans', 'toogoodtogo', 'crous', 'isic'],
  },
];
