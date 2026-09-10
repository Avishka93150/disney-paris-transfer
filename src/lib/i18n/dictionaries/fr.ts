import type { Dictionary } from '../types';
import { legalDocs } from '../legalDocs';

/**
 * French — the copy the client validated during the design phase.
 * Every dictionary, this one included, is typed against `Dictionary`.
 */
export const fr: Dictionary = {
  common: {
    brand: 'Disney Paris',
    brandAccent: 'Transfers',
    tagline: 'Chauffeur privé VTC · Paris',
    langLabel: 'Langue',
    menu: 'Menu',
    book: 'Réserver',
    bookTransfer: 'Réserver mon transfert',
    whatsappQuote: 'Devis WhatsApp immédiat',
    callNow: 'Appeler maintenant',
    writeWhatsapp: 'Écrire sur WhatsApp',
    approx: '≈',
    minutes: 'min',
    hour: 'h',
    km: 'km',
    from: 'dès',
    quoteOnly: 'Sur devis',
    perDay: 'À la journée',
    availability: '7 j/7 · 24 h/24',
    replyUnder2h: 'réponse sous 2 h',
    skipToContent: 'Aller au contenu',
  },
  nav: {
    home: 'Accueil',
    routes: 'Trajets',
    prices: 'Tarifs',
    about: 'À propos',
    faq: 'FAQ',
    contact: 'Contact',
    parisTransfers: 'Transferts Paris',
    disneyTransfers: 'Transferts Disneyland',
    viewAll: 'Tous les transferts',
    more: 'Plus',
    groups: {
      airports: 'Transferts aéroports de Paris',
      city: 'Paris et alentours',
      disney: 'Transferts Disneyland Paris',
      versailles: 'Transferts Versailles',
    },
  },
  footer: {
    blurb:
      'Chauffeur privé VTC à Paris, spécialiste des transferts aéroport et Disneyland® Paris. Berlines et vans premium, suivi des vols, accueil personnalisé, sièges enfants offerts.',
    disclaimer: 'Service indépendant, non affilié à The Walt Disney Company.',
    colRoutes: 'Trajets',
    colSite: 'Le site',
    colContact: 'Contact',
    whatsappLine: 'WhatsApp — réponse rapide',
    booking: 'Réservation',
    rights: '© 2026 disneyparistransfers.com — Tous droits réservés',
    seoLine: 'VTC Paris · Transfert aéroport CDG, Orly, Beauvais · Disneyland Paris',
    colLegal: 'Mentions légales',
    terms: 'Conditions générales',
    privacy: 'Confidentialité',
    cookies: 'Cookies',
  },
  home: {
    badge: 'Spécialiste des transferts Disneyland® Paris',
    h1: 'Votre chauffeur privé entre les aéroports de Paris et Disneyland Paris',
    lead: "Transferts CDG, Orly, Beauvais et Paris en berline ou van premium. Suivi de votre vol, accueil avec pancarte, sièges enfants offerts — commencez vos vacances dès l'aéroport.",
    ctaPrimary: 'Réserver mon transfert',
    ctaSecondary: 'Devis WhatsApp immédiat',
    perks: ['Annulation gratuite', 'Suivi des vols', 'Paiement CB à bord', '7 j/7 · 24 h/24'],
    calc: {
      title: 'Votre prix en direct',
      fromLabel: 'Départ',
      toLabel: 'Arrivée',
      paxLabel: 'Passagers',
      tripLabel: 'Trajet',
      oneWay: 'Aller simple',
      roundTrip: 'Aller-retour',
      vehicleLabel: 'Véhicule',
      roundTripSuffix: ' · aller-retour',
      priceNote: 'Prix fixe — péages, bagages et sièges enfants inclus',
      confirmWhatsapp: 'Confirmer sur WhatsApp',
      book: 'Réserver',
      samePlace: 'Choisissez deux lieux différents',
      custom: 'Trajet sur mesure — réponse sous 2 h',
      loading: 'Calcul du tarif…',
      whatsappMessage:
        'Bonjour, je souhaite réserver : {from} → {to}, {pax} passager(s), {vehicle}, {trip}.',
    },
    routesTitle: 'Nos trajets les plus demandés',
    routesLead: 'Prix fixe confirmé à la réservation, selon passagers, bagages et véhicule.',
    seeRoute: 'Voir ce trajet →',
    excursionsCard: {
      title: 'Excursions : Versailles, Mont Saint-Michel…',
      duration: 'À la journée',
      note: 'Devis sous 2 h',
    },
    stepsTitle: "Réserver, c'est simple",
    steps: [
      {
        title: 'Demandez votre devis',
        text: 'Par formulaire, WhatsApp ou téléphone. Réponse en quelques minutes avec un prix fixe garanti.',
      },
      {
        title: 'On vous attend',
        text: 'Votre chauffeur suit votre vol et vous accueille avec une pancarte à votre nom, même en cas de retard.',
      },
      {
        title: 'Profitez du voyage',
        text: 'Eau fraîche, chargeurs, sièges enfants installés. Paiement en espèces ou CB à bord.',
      },
    ],
    familyTitle: 'Pensé pour les familles',
    familyPhoto: 'photo : intérieur du véhicule / sièges enfants',
    services: [
      {
        title: 'Suivi des vols',
        text: "votre chauffeur adapte l'heure de prise en charge en cas de retard, sans frais.",
      },
      {
        title: 'Accueil pancarte',
        text: 'à la sortie des arrivées, avec votre nom, aide aux bagages incluse.',
      },
      {
        title: 'Sièges enfants offerts',
        text: 'cosy, rehausseur ou siège bébé, installés avant votre arrivée.',
      },
      {
        title: 'Paiement flexible',
        text: 'CB à bord, espèces ou lien de paiement — au choix.',
      },
      {
        title: 'Annulation gratuite',
        text: "jusqu'à 24 h avant le transfert, sans justification.",
      },
      {
        title: 'Confort à bord',
        text: 'eau fraîche, chargeurs, wifi, chauffeur francophone et anglophone.',
      },
    ],
    fleetTitle: 'Une flotte adaptée à votre groupe',
    fleetLead:
      'Le tarif dépend du véhicule, du nombre de passagers et des bagages — indiquez tout au devis.',
    fleetPhoto: 'photo : {vehicle}',
    reviewsTitle: 'Ils ont voyagé avec nous',
    reviewsNote: '— vos avis Google / TripAdvisor viendront ici —',
    reviews: [
      {
        name: '— Avis Google nº1',
        text: 'Emplacement réservé : collez ici un avis client réel (Google ou TripAdvisor).',
      },
      {
        name: '— Avis Google nº2',
        text: 'Emplacement réservé : collez ici un avis client réel (Google ou TripAdvisor).',
      },
      {
        name: '— Avis TripAdvisor nº1',
        text: 'Emplacement réservé : collez ici un avis client réel (Google ou TripAdvisor).',
      },
    ],
    finalTitle: 'Prêt pour la magie ? Réservez votre transfert.',
    finalLead: 'Devis gratuit et sans engagement, réponse en quelques minutes.',
    finalBook: 'Réserver en ligne',
  },
  routes: {
    h1: 'Tous nos trajets',
    lead: 'Transferts privés entre les aéroports parisiens, Paris et Disneyland Paris. Prix fixe confirmé au devis, selon nombre de passagers, bagages et véhicule choisi.',
    see: 'Voir ce trajet',
    askQuote: 'Demander un devis',
    otherLead: 'Autre destination ?',
    otherLink: "Demandez sur WhatsApp — nous couvrons toute l'Île-de-France.",
    descriptionTemplate:
      'Chauffeur privé entre {from} et {to}. Prix fixe, accueil personnalisé, sièges enfants offerts.',
    descriptions: {
      'cdg-disneyland':
        'Notre trajet le plus demandé. Accueil pancarte à la sortie des arrivées, dépose directe à votre hôtel Disney ou partenaire.',
      'orly-disneyland':
        "Prise en charge à Orly 1-2-3-4, trajet direct par l'A86/A4 jusqu'à Marne-la-Vallée.",
      'beauvais-disneyland':
        'Évitez les 2 navettes et le RER : trajet direct porte à porte depuis Beauvais-Tillé.',
      'paris-disneyland':
        "De votre hôtel ou adresse à Paris jusqu'aux parcs ou hôtels Disney, à l'heure qui vous arrange.",
      'cdg-paris':
        "Transfert privé entre Roissy et votre adresse à Paris, sans attente ni surprise.",
      'orly-paris':
        "Prise en charge à Orly et dépose devant votre hôtel ou votre porte, à Paris intra-muros.",
      'paris-beauvais':
        'Départ de votre adresse à Paris, dépose devant le terminal de Beauvais-Tillé.',
      'paris-versailles':
        "Château de Versailles, tour de Paris, mise à disposition à l'heure ou à la journée avec chauffeur.",
    },
  },
  routeDetail: {
    breadcrumb: 'Trajets',
    h1: 'Transfert {from} ↔ {to} en chauffeur privé',
    leadTemplate:
      'Trajet privé porte à porte entre {from} et {to}. Votre chauffeur suit le vol, vous accueille avec une pancarte et confirme un prix fixe avant le départ.',
    lead: {
      'cdg-disneyland':
        'Trajet direct entre Roissy Charles-de-Gaulle et les hôtels Disney en 45 minutes environ. Votre chauffeur suit votre vol, vous accueille avec une pancarte et installe les sièges enfants avant votre arrivée.',
      'orly-disneyland':
        "Liaison directe entre Orly et Marne-la-Vallée par l'A86 et l'A4, environ 50 minutes. Prise en charge à Orly 1, 2, 3 ou 4, sans changement ni attente.",
      'beauvais-disneyland':
        "Beauvais-Tillé est à 120 km de Disneyland : le transfert privé vous évite la navette, la gare et le RER, avec un trajet direct porte à porte.",
      'paris-disneyland':
        "De votre hôtel parisien aux parcs ou aux hôtels Disney en 45 minutes environ, à l'heure que vous choisissez, bagages et poussettes embarqués.",
      'cdg-paris':
        'Transfert privé entre Roissy Charles-de-Gaulle et votre adresse parisienne, avec accueil en salle des arrivées et prix fixe connu à la réservation.',
      'orly-paris':
        "Transfert privé entre Orly et Paris intra-muros, à toute heure, sans file d'attente ni supplément de dernière minute.",
      'paris-beauvais':
        "Départ de votre adresse à Paris, dépose devant le terminal de Beauvais-Tillé, avec une marge calculée sur l'heure de votre vol.",
      'paris-versailles':
        "Aller-retour ou mise à disposition entre Paris et le château de Versailles, avec un chauffeur qui vous attend pendant la visite.",
    },
    ctaBook: 'Réserver ce transfert',
    livePriceTitle: 'Votre prix, en direct',
    relatedTitle: 'Autres transferts',
    imageAlt: 'Transfert en chauffeur privé de {from} vers {to}',
    statDuration: 'Durée du trajet',
    statDistance: 'Distance',
    statHours: 'Tous les vols, tous les terminaux',
    statHoursValue: '24 h/24',
    statPrice: 'Confirmé au devis, sans surprise',
    statPriceValue: 'Prix fixe',
    howTitle: 'Comment se passe votre transfert ?',
    stepPickupTitle: 'À votre arrivée',
    stepPickupAirport:
      "votre chauffeur suit votre vol en temps réel. Retard, avance : il est là au bon moment, sans frais supplémentaires. Il vous attend à la sortie des arrivées de votre terminal, avec une pancarte à votre nom.",
    stepPickupCity:
      "votre chauffeur vous attend devant votre hôtel ou votre adresse à l'heure convenue, et vous prévient par SMS ou WhatsApp dès qu'il est sur place.",
    stepDriveTitle: 'En route',
    stepDrive:
      "aide aux bagages, sièges enfants déjà installés, eau fraîche et chargeurs à bord. Trajet direct, sans arrêt ni détour.",
    stepArrivalTitle: "À l'arrivée",
    stepArrivalDisney:
      "dépose directe devant votre hôtel Disney (Disneyland Hotel, Newport Bay Club, Sequoia Lodge, Cheyenne, Santa Fe, Davy Crockett Ranch) ou tout hôtel partenaire de Val d'Europe et Magny-le-Hongre.",
    stepArrivalOther:
      'dépose à votre adresse exacte, devant la porte, avec aide aux bagages jusqu’au hall.',
    stepReturnTitle: 'Au retour',
    stepReturn:
      "prise en charge à l'heure convenue, calculée pour arriver sereinement à votre terminal d'embarquement.",
    photo: 'photo : accueil pancarte',
    priceBoxTitle: 'Le tarif dépend de :',
    priceFactors: [
      'Nombre de passagers (1 à 8)',
      'Nombre et taille des bagages',
      'Véhicule : berline, SUV, van ou premium',
    ],
    priceBoxCta: 'Obtenir mon prix fixe',
    tableTitle: 'Tarifs {from} ↔ {to}',
    faqTitle: 'Questions fréquentes — {from} ↔ {to}',
    faq: [
      {
        q: 'Que se passe-t-il si mon vol est en retard ?',
        a: 'Rien à faire de votre côté : nous suivons votre numéro de vol en temps réel et ajustons la prise en charge, sans frais supplémentaires, même la nuit.',
      },
      {
        q: 'Où retrouve-t-on le chauffeur ?',
        a: "À la sortie des arrivées de votre terminal, pancarte à votre nom en main. Vous recevez son numéro par SMS/WhatsApp avant l'atterrissage.",
      },
      {
        q: 'Les sièges enfants sont-ils payants ?',
        a: "Non, ils sont offerts. Indiquez l'âge des enfants à la réservation : siège bébé, cosy ou rehausseur seront installés avant votre arrivée.",
      },
      {
        q: 'Comment payer ?',
        a: 'En carte bancaire à bord, en espèces, ou par lien de paiement à l’avance — au choix. Le prix confirmé au devis est fixe, péages et attente inclus.',
      },
      {
        q: 'Est-ce vraiment plus pratique que la navette ou le RER ?',
        a: "Le transfert privé est porte à porte, sans arrêts multiples, sans correspondance avec bagages et poussettes, et à l'horaire exact de votre vol.",
      },
    ],
  },
  prices: {
    h1: 'Tarifs — prix fixes et transparents',
    lead: "Choisissez votre point de départ : tous les prix s'affichent par nombre de passagers, aller simple ou aller-retour. Péages, bagages, attente et sièges enfants toujours inclus.",
    departLabel: 'Départ :',
    colPax: 'Passagers',
    colOneWay: 'Aller simple',
    colRoundTrip: 'Aller-retour',
    bookThis: 'Réserver ce trajet',
    noRoute: 'Aucune liaison au départ de ce point dans la grille — demandez un devis, réponse sous 2 h.',
    toursTitle: 'Excursions & journées avec chauffeur',
    toursLead:
      'Versailles, Mont Saint-Michel, châteaux de la Loire… Chaque excursion est sur devis personnalisé selon votre groupe et votre programme — réponse garantie sous 2 h.',
    tourCta: 'Demander un devis →',
    customBadge: '⏱ Réponse sous 2 h — 7 j/7',
    customTitle: "Besoin d'un devis personnalisé ?",
    customLead:
      'Groupe de plus de 8 personnes, trajet hors grille, excursion sur mesure, mise à disposition à la journée : décrivez votre besoin, nous répondons en moins de 2 heures.',
    customWhatsapp: 'Devis WhatsApp',
    customForm: 'Formulaire de devis',
    whatsappRoute: 'Bonjour, je souhaite réserver : {from} → {to}.',
    whatsappTour: "Bonjour, je souhaite un devis pour l'excursion : {tour}.",
  },
  booking: {
    h1: 'Réservez votre transfert',
    lead: 'Remplissez le formulaire : nous répondons avec un prix fixe garanti en quelques minutes. Ou plus rapide encore : WhatsApp ou téléphone.',
    fromLabel: 'Départ',
    toLabel: 'Arrivée',
    dateLabel: 'Date',
    timeLabel: 'Heure (vol ou prise en charge)',
    paxLabel: 'Passagers',
    bagsLabel: 'Bagages',
    vehicleLabel: 'Véhicule souhaité',
    seatsLabel: 'Sièges enfants',
    flightLabel: 'Nº de vol (si aéroport)',
    flightPlaceholder: 'ex : AF 1234',
    nameLabel: 'Nom complet',
    namePlaceholder: 'Votre nom',
    emailLabel: 'Email',
    emailPlaceholder: 'vous@email.com',
    phoneLabel: 'Téléphone / WhatsApp',
    phonePlaceholder: '+33 …',
    messageLabel: 'Message (adresse précise, retour, demandes particulières…)',
    tripLabel: 'Type de trajet',
    oneWay: 'Aller simple',
    roundTrip: 'Aller-retour',
    bagOptions: ['0–2', '3–4', '5–6', '7 et plus'],
    seatOptions: [
      'Aucun',
      'Siège bébé (0–12 mois)',
      'Siège enfant (1–4 ans)',
      'Rehausseur (4–10 ans)',
      'Plusieurs (préciser en message)',
    ],
    vehicleAdvise: 'Conseillez-moi',
    otherPlace: 'Autre (préciser en message)',
    submit: 'Envoyer ma demande de devis',
    submitting: 'Envoi en cours…',
    success: 'Demande envoyée !',
    successLead: 'Nous revenons vers vous très vite avec votre prix fixe.',
    error: "L'envoi a échoué. Réessayez, ou contactez-nous directement par WhatsApp.",
    note: 'Devis gratuit, sans engagement — réponse sous 2 h. Annulation gratuite jusqu’à 24 h avant le transfert.',
    estimateLabel: 'Estimation pour ce trajet',
    estimateCustom: 'Trajet sur mesure — prix confirmé sous 2 h',
    payTitle: 'Payer en ligne dès maintenant',
    payLead:
      'Vous pouvez régler votre transfert par carte dès à présent : votre créneau est bloqué immédiatement. Sinon, le paiement se fait à bord.',
    payCta: 'Payer {price} € par carte',
    paySkip: 'Je paierai à bord',
    paySuccess: 'Paiement reçu — merci ! Votre transfert est confirmé.',
    payCancelled: 'Paiement annulé. Votre demande reste enregistrée, vous pouvez payer à bord.',
    sidebarWhatsapp: 'WhatsApp',
    sidebarWhatsappNote: 'Le plus rapide — envoyez votre trajet, recevez le prix en direct.',
    sidebarPhoneNote: '7 j/7, 24 h/24 — français & english spoken.',
    includedTitle: 'Toujours inclus',
    included: [
      'Suivi du vol & attente',
      'Accueil pancarte',
      'Sièges enfants offerts',
      'Péages inclus, prix fixe',
    ],
    required: 'Ce champ est obligatoire.',
    invalidEmail: 'Adresse email invalide.',
    stepJourney: 'Trajet',
    stepParty: 'Passagers',
    stepContact: 'Contact',
    next: 'Continuer',
    back: 'Retour',
    trustSeats: 'Sièges enfants offerts',
    trustFixed: 'Prix fixe, sans surprise',
    trustHours: 'Service 24 h/24',
    noCard: 'Pas de carte pour le devis',
    liveTitle: 'Prix estimé',
  },
  about: {
    h1: 'Votre chauffeur, pas une plateforme',
    lead: "Disney Paris Transfers, c'est un service de chauffeur privé VTC indépendant, spécialisé dans les trajets entre les aéroports parisiens et Disneyland Paris.",
    h2: 'Un métier : que votre trajet soit le moment le plus simple de vos vacances',
    paragraphs: [
      "Chauffeur VTC professionnel, carte en règle, véhicules assurés et entretenus. Je connais chaque terminal de CDG et d'Orly, chaque hôtel Disney, et les meilleures routes à chaque heure de la journée.",
      "Mes clients sont surtout des familles qui arrivent de loin — parfois après un long vol, avec des enfants fatigués et beaucoup de bagages. Mon travail : que tout soit prêt à votre descente d'avion. Pancarte, sièges enfants installés, coffre spacieux, et un trajet calme jusqu'à la magie.",
    ],
    editorNote:
      "✎ Remplacez ce texte par votre présentation personnelle : prénom, années d'expérience, langues parlées…",
    photo: 'photo : portrait du chauffeur',
    stats: [
      { value: '100 %', label: 'Trajets assurés, licence VTC' },
      { value: '7 j/7', label: 'Disponible jour et nuit' },
      { value: 'FR · EN', label: 'Chauffeur bilingue' },
      { value: '0 €', label: 'Frais cachés — prix fixe garanti' },
    ],
    ctaTitle: 'Faisons connaissance',
    ctaLead: 'Une question, un trajet particulier ? Écrivez-moi, je réponds personnellement.',
    ctaContact: 'Me contacter',
    ctaBook: 'Réserver un transfert',
  },
  faq: {
    h1: 'Questions fréquentes',
    lead: 'Tout ce qu’il faut savoir avant de réserver votre transfert aéroport ↔ Disneyland Paris.',
    items: [
      {
        q: 'Comment est calculé le prix de mon transfert ?',
        a: 'Le prix est fixe et confirmé avant la réservation. Il dépend du nombre de passagers, du nombre de bagages et du véhicule choisi (berline, SUV, van ou premium). Péages, attente et sièges enfants sont toujours inclus.',
      },
      {
        q: 'Que se passe-t-il si mon vol est retardé ?',
        a: 'Nous suivons votre numéro de vol en temps réel. Votre chauffeur adapte l’heure de prise en charge automatiquement, sans frais supplémentaires, même la nuit.',
      },
      {
        q: 'Où retrouve-t-on le chauffeur à l’aéroport ?',
        a: 'À la sortie des arrivées de votre terminal, avec une pancarte à votre nom. Vous recevez son numéro de téléphone par SMS ou WhatsApp avant votre atterrissage.',
      },
      {
        q: 'Les sièges enfants sont-ils fournis ?',
        a: 'Oui, gratuitement. Indiquez l’âge de vos enfants à la réservation : siège bébé, cosy ou rehausseur seront installés avant la prise en charge.',
      },
      {
        q: 'Combien de personnes et de bagages pouvez-vous transporter ?',
        a: 'Jusqu’à 4 passagers et 3 bagages en berline, jusqu’à 8 passagers et 8 bagages en van. Poussettes et équipements bienvenus — signalez-les au devis.',
      },
      {
        q: 'Comment payer ?',
        a: 'Carte bancaire à bord, espèces, ou lien de paiement à l’avance. Aucun acompte n’est demandé pour la plupart des trajets.',
      },
      {
        q: 'Puis-je annuler ou modifier ma réservation ?',
        a: 'Oui, gratuitement jusqu’à 24 h avant le transfert. Contactez-nous simplement par WhatsApp ou téléphone.',
      },
      {
        q: 'Le chauffeur parle-t-il anglais ?',
        a: 'Oui — français et anglais. Nous accueillons régulièrement des familles venues du monde entier pour Disneyland Paris.',
      },
      {
        q: 'Desservez-vous tous les hôtels Disney et partenaires ?',
        a: 'Oui : hôtels Disney (Disneyland Hotel, Newport Bay, Sequoia, Cheyenne, Santa Fe, Davy Crockett Ranch), hôtels partenaires de Val d’Europe, Magny-le-Hongre, Bailly-Romainvilliers et Serris.',
      },
      {
        q: 'Faites-vous d’autres trajets que Disney ?',
        a: 'Oui : transferts CDG/Orly/Beauvais ↔ Paris, gares parisiennes, excursions Versailles, et mise à disposition à l’heure. Demandez un devis.',
      },
      {
        q: 'Le service fonctionne-t-il la nuit et les jours fériés ?',
        a: 'Oui, 7 j/7 et 24 h/24, y compris pour les vols très matinaux ou tardifs. Réservez à l’avance pour garantir la disponibilité.',
      },
    ],
    moreTitle: 'Une autre question ?',
  },
  contact: {
    h1: 'Contact',
    lead: 'Disponible 7 j/7 et 24 h/24 — nous répondons en quelques minutes.',
    phoneTitle: 'Téléphone',
    phoneNote: 'Appel direct, 7 j/7 · 24 h/24',
    whatsappTitle: 'WhatsApp',
    whatsappNote: 'Le plus rapide pour un devis',
    emailTitle: 'Email',
    emailNote: 'Réponse sous quelques heures',
    ctaTitle: "Besoin d'un prix tout de suite ?",
    ctaLead: 'Le formulaire de réservation vous donne un devis fixe en quelques minutes.',
    ctaBtn: 'Demander mon devis',
  },
  pricing: {
    timeLabel: 'Heure de prise en charge',
    nightNote: 'Tarif de nuit : +{percent} % entre {start} et {end}',
    nightLine: 'Supplément de nuit (+{percent} %)',
    baseLine: 'Transfert',
    totalLine: 'Total estimé',
    packagesTitle: 'Forfaits',
    packagesLead: 'Des offres à prix fixe, tout compris. Choisissez-en un au moment de réserver.',
    packageLabel: 'Forfait',
    packageNone: 'Sans forfait — tarifer mon trajet',
    packageUpTo: "Jusqu'à {pax} passagers",
    extrasTitle: 'Options',
    extrasLead: 'Ajoutées au prix de votre transfert.',
    extrasEach: "l'unité",
  },
  cookieBanner: {
    message:
      'Nous utilisons quelques cookies essentiels (langue, session admin et cet avis). Pas de cookies publicitaires.',
    accept: 'J’ai compris',
    more: 'Politique des cookies',
  },
  legal: legalDocs.fr,
  destinationKinds: {
    airport: 'Aéroports',
    city: 'Villes',
    castle: 'Châteaux & parcs',
    tours: 'Excursions',
  },
  zones: {
    cdg: 'Aéroport CDG',
    orly: 'Aéroport Orly',
    beauvais: 'Aéroport Beauvais',
    disney: 'Disneyland Paris',
    paris: 'Paris',
    versailles: 'Château de Versailles',
    ladefense: 'La Défense',
    valeurope: "Val d'Europe",
  },
  vehicles: {
    saloon: {
      label: 'Berline',
      short: 'Berline',
      desc: 'Idéale pour un couple ou une petite famille. Confort et discrétion.',
      pax: '1–4 passagers',
      bags: '3 bagages',
    },
    suv: {
      label: 'SUV',
      short: 'SUV',
      desc: 'Plus de place pour les bagages, même confort qu’une berline.',
      pax: '1–4 passagers',
      bags: '4 bagages',
    },
    van: {
      label: 'Van',
      short: 'Van',
      desc: 'Parfait pour les familles nombreuses et les groupes avec poussettes.',
      pax: '5–8 passagers',
      bags: '8 bagages',
    },
    premium: {
      label: 'Premium — Mercedes Classe E/S',
      short: 'Premium',
      desc: 'Pour un trajet haut de gamme : cuir, silence, service attentionné.',
      pax: '1–3 passagers',
      bags: '3 bagages',
    },
  },
  tours: {
    parisCityTour: {
      name: 'Paris City Tour',
      dur: '2 h à 4 h',
      desc: 'Tour privé des monuments : Tour Eiffel, Champs-Élysées, Louvre, Montmartre…',
    },
    versailles: {
      name: 'Château de Versailles',
      dur: 'Demi-journée',
      desc: 'Aller-retour ou mise à disposition depuis Paris ou Disneyland.',
    },
    montSaintMichel: {
      name: 'Mont Saint-Michel',
      dur: 'Journée',
      desc: 'Départ matinal, journée complète sur place, retour en soirée.',
    },
    normandie: {
      name: 'Normandie & plages du Débarquement',
      dur: 'Journée',
      desc: 'Omaha Beach, cimetière américain, Arromanches…',
    },
    loire: {
      name: 'Châteaux de la Loire',
      dur: 'Journée',
      desc: 'Chambord, Chenonceau, Amboise — circuit sur mesure.',
    },
    fontainebleau: {
      name: 'Fontainebleau',
      dur: 'Demi-journée',
      desc: 'Château et forêt de Fontainebleau, dès Paris ou Disney.',
    },
    giverny: {
      name: 'Giverny — Jardins de Monet',
      dur: 'Demi-journée',
      desc: 'Maison et jardins de Claude Monet (avril–octobre).',
    },
    parcAsterix: {
      name: 'Parc Astérix',
      dur: 'Transfert',
      desc: 'Aller simple ou aller-retour depuis Paris, CDG ou Disney.',
    },
    valleeVillage: {
      name: 'La Vallée Village — shopping',
      dur: 'Transfert',
      desc: 'Outlet de luxe à 5 min de Disneyland, attente possible.',
    },
  },
  seo: {
    home: {
      title: 'Transfert CDG ↔ Disneyland Paris — Chauffeur privé VTC | Disney Paris Transfers',
      description:
        'Chauffeur privé VTC pour vos transferts entre CDG, Orly, Beauvais, Paris et Disneyland Paris. Prix fixe dès 70 €, suivi des vols, accueil pancarte, sièges enfants offerts. 7 j/7, 24 h/24.',
    },
    routes: {
      title: 'Tous nos trajets — Transferts aéroports Paris & Disneyland | Disney Paris Transfers',
      description:
        'CDG, Orly, Beauvais, Paris, Versailles : tous nos transferts privés vers Disneyland Paris et l’Île-de-France, avec durées, distances et prix fixes.',
    },
    prices: {
      title: 'Tarifs transferts VTC Paris & Disneyland — prix fixes | Disney Paris Transfers',
      description:
        'Grille tarifaire complète par nombre de passagers, aller simple et aller-retour. Péages, bagages et sièges enfants inclus. Excursions sur devis, réponse sous 2 h.',
    },
    booking: {
      title: 'Réserver un transfert VTC Paris ↔ Disneyland | Disney Paris Transfers',
      description:
        'Réservez votre chauffeur privé en 2 minutes : devis gratuit avec prix fixe garanti, réponse sous 2 h, annulation gratuite jusqu’à 24 h avant le transfert.',
    },
    about: {
      title: 'À propos — Votre chauffeur VTC à Paris | Disney Paris Transfers',
      description:
        'Chauffeur VTC indépendant spécialisé dans les transferts aéroport ↔ Disneyland Paris. Licence VTC, véhicules assurés, service bilingue français-anglais.',
    },
    faq: {
      title: 'Questions fréquentes — Transfert Disneyland Paris | Disney Paris Transfers',
      description:
        'Retard de vol, sièges enfants, paiement, annulation, bagages : toutes les réponses avant de réserver votre transfert aéroport ↔ Disneyland Paris.',
    },
    contact: {
      title: 'Contact — Chauffeur privé VTC Paris | Disney Paris Transfers',
      description:
        'Joignez-nous 7 j/7 et 24 h/24 par téléphone, WhatsApp ou email pour votre transfert entre les aéroports parisiens et Disneyland Paris.',
    },
    terms: {
      title: 'Conditions générales | Disney Paris Transfers',
      description:
        'Conditions de réservation Disney Paris Transfers : devis, paiement, annulation, tarif de nuit et obligations du passager.',
    },
    privacy: {
      title: 'Politique de confidentialité | Disney Paris Transfers',
      description:
        'Comment Disney Paris Transfers collecte, conserve et utilise les données personnelles pour les réservations, e-mails et paiements.',
    },
    cookies: {
      title: 'Politique des cookies | Disney Paris Transfers',
      description:
        'Cookies essentiels sur disneyparistransfers.com : langue, session admin et cet avis. Pas de cookies publicitaires.',
    },
    routeDetail: {
      title: 'Transfert {from} ↔ {to} — chauffeur privé dès {price} € | Disney Paris Transfers',
      description:
        'Transfert privé {from} ↔ {to} en {duration} environ. Prix fixe dès {price} €, suivi des vols, accueil pancarte, sièges enfants offerts. Réservation en ligne.',
    },
  },
};
