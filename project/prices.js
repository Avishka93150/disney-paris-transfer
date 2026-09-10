// Grille tarifaire Disney Paris Transfers — modifiable librement.
// Paliers passagers : [1-3, 4, 5, 6, 7, 8] — prix aller simple en €. Aller-retour = ×2.
export const ZONES = {
  cdg: 'Aéroport CDG', orly: 'Aéroport Orly', beauvais: 'Aéroport Beauvais',
  disney: 'Disneyland Paris', paris: 'Paris', versailles: 'Château de Versailles',
  ladefense: 'La Défense', valeurope: "Val d'Europe",
};
export const TIERS = ['1 – 3', '4', '5', '6', '7', '8'];
// Véhicules : multiplicateur sur le prix de base, et capacité max passagers.
export const VEHICLES = [
  {id: 'berline', label: 'Berline', desc: '1–4 pax · 3 bagages', maxPax: 4, mult: 1},
  {id: 'suv', label: 'SUV', desc: '1–4 pax · 4 bagages', maxPax: 4, mult: 1.1},
  {id: 'van', label: 'Van', desc: '5–8 pax · 8 bagages', maxPax: 8, mult: 1},
  {id: 'premium', label: 'Premium — Mercedes Classe E/S', desc: '1–3 pax · 3 bagages', maxPax: 3, mult: 1.5},
];
export const RATES = {
  'cdg-disney':        [70, 80, 85, 90, 90, 105],
  'cdg-valeurope':     [70, 80, 85, 90, 90, 105],
  'cdg-paris':         [80, 90, 95, 100, 110, 125],
  'cdg-orly':          [100, 100, 110, 115, 120, 140],
  'cdg-beauvais':      [150, 150, 155, 155, 160, 175],
  'cdg-ladefense':     [100, 100, 110, 120, 130, 145],
  'cdg-versailles':    [130, 130, 135, 135, 140, 155],
  'orly-disney':       [80, 90, 95, 100, 100, 115],
  'orly-paris':        [70, 80, 85, 90, 100, 115],
  'orly-beauvais':     [160, 160, 165, 165, 170, 185],
  'orly-versailles':   [110, 110, 115, 115, 120, 135],
  'orly-ladefense':    [90, 90, 100, 110, 120, 135],
  'orly-valeurope':    [80, 90, 95, 100, 100, 115],
  'beauvais-disney':   [160, 170, 175, 180, 180, 195],
  'beauvais-paris':    [150, 160, 165, 170, 175, 190],
  'paris-disney':      [70, 80, 85, 90, 90, 105],
  'paris-versailles':  [90, 90, 95, 95, 100, 115],
  'paris-valeurope':   [70, 80, 85, 90, 90, 105],
  'disney-versailles': [130, 130, 135, 135, 140, 155],
  'disney-valeurope':  [40, 45, 50, 55, 55, 65],
};
export function findRate(from, to) {
  return RATES[from + '-' + to] || RATES[to + '-' + from] || null;
}
export function tierIndex(pax) {
  const p = parseInt(pax, 10);
  return p <= 3 ? 0 : p - 3;
}
// Excursions & mises à disposition — sur devis personnalisé, réponse sous 2 h.
export const TOURS = [
  {name: 'Paris City Tour', dur: '2 h à 4 h', desc: 'Tour privé des monuments : Tour Eiffel, Champs-Élysées, Louvre, Montmartre…'},
  {name: 'Château de Versailles', dur: 'Demi-journée', desc: 'Aller-retour ou mise à disposition depuis Paris ou Disneyland.'},
  {name: 'Mont Saint-Michel', dur: 'Journée', desc: 'Départ matinal, journée complète sur place, retour en soirée.'},
  {name: 'Normandie & plages du Débarquement', dur: 'Journée', desc: 'Omaha Beach, cimetière américain, Arromanches…'},
  {name: 'Châteaux de la Loire', dur: 'Journée', desc: 'Chambord, Chenonceau, Amboise — circuit sur mesure.'},
  {name: 'Fontainebleau', dur: 'Demi-journée', desc: 'Château et forêt de Fontainebleau, dès Paris ou Disney.'},
  {name: 'Giverny — Jardins de Monet', dur: 'Demi-journée', desc: 'Maison et jardins de Claude Monet (avril–octobre).'},
  {name: 'Parc Astérix', dur: 'Transfert', desc: 'Aller simple ou aller-retour depuis Paris, CDG ou Disney.'},
  {name: 'La Vallée Village — shopping', dur: 'Transfert', desc: 'Outlet de luxe à 5 min de Disneyland, attente possible.'},
];
