import type { Dictionary } from '../types';

export const en: Dictionary = {
  common: {
    brand: 'Disney Paris',
    brandAccent: 'Transfers',
    tagline: 'Private chauffeur · Paris',
    langLabel: 'Language',
    menu: 'Menu',
    book: 'Book',
    bookTransfer: 'Book my transfer',
    whatsappQuote: 'Instant WhatsApp quote',
    callNow: 'Call now',
    writeWhatsapp: 'Message on WhatsApp',
    approx: '≈',
    minutes: 'min',
    hour: 'h',
    km: 'km',
    from: 'from',
    quoteOnly: 'On request',
    perDay: 'Full day',
    availability: '7 days a week · 24/7',
    replyUnder2h: 'reply within 2 hours',
    skipToContent: 'Skip to content',
  },
  nav: {
    home: 'Home',
    routes: 'Transfers',
    prices: 'Prices',
    about: 'About',
    faq: 'FAQ',
    contact: 'Contact',
  },
  footer: {
    blurb:
      'Private chauffeur service in Paris, specialising in airport and Disneyland® Paris transfers. Premium saloons and vans, flight tracking, personal meet and greet, free child seats.',
    disclaimer: 'Independent service, not affiliated with The Walt Disney Company.',
    colRoutes: 'Transfers',
    colSite: 'The site',
    colContact: 'Contact',
    whatsappLine: 'WhatsApp — fast reply',
    booking: 'Booking',
    rights: '© 2026 disneyparistransfers.com — All rights reserved',
    seoLine: 'Paris chauffeur · CDG, Orly, Beauvais airport transfers · Disneyland Paris',
  },
  home: {
    badge: 'Disneyland® Paris transfer specialists',
    h1: 'Your private chauffeur between the Paris airports and Disneyland Paris',
    lead: 'Transfers from CDG, Orly, Beauvais and Paris in a premium saloon or van. We track your flight, meet you with a name board and provide free child seats — your holiday starts at the airport.',
    ctaPrimary: 'Book my transfer',
    ctaSecondary: 'Instant WhatsApp quote',
    perks: ['Free cancellation', 'Flight tracking', 'Card payment on board', '24/7, all year'],
    calc: {
      title: 'Your price, live',
      fromLabel: 'From',
      toLabel: 'To',
      paxLabel: 'Passengers',
      tripLabel: 'Trip',
      oneWay: 'One way',
      roundTrip: 'Return',
      vehicleLabel: 'Vehicle',
      roundTripSuffix: ' · return',
      priceNote: 'Fixed price — tolls, luggage and child seats included',
      confirmWhatsapp: 'Confirm on WhatsApp',
      book: 'Book',
      samePlace: 'Please choose two different places',
      custom: 'Custom route — reply within 2 hours',
      loading: 'Calculating your price…',
      whatsappMessage:
        'Hello, I would like to book: {from} → {to}, {pax} passenger(s), {vehicle}, {trip}.',
    },
    routesTitle: 'Our most requested transfers',
    routesLead: 'Fixed price confirmed at booking, based on passengers, luggage and vehicle.',
    seeRoute: 'View this transfer →',
    excursionsCard: {
      title: 'Day trips: Versailles, Mont Saint-Michel…',
      duration: 'Full day',
      note: 'Quote within 2 h',
    },
    stepsTitle: 'Booking is simple',
    steps: [
      {
        title: 'Ask for your quote',
        text: 'By form, WhatsApp or phone. Answer within minutes, with a guaranteed fixed price.',
      },
      {
        title: 'We wait for you',
        text: 'Your driver tracks your flight and meets you with a name board, even if you land late.',
      },
      {
        title: 'Enjoy the ride',
        text: 'Chilled water, chargers, child seats already fitted. Pay by card or cash on board.',
      },
    ],
    familyTitle: 'Built around families',
    familyPhoto: 'photo: vehicle interior / child seats',
    services: [
      {
        title: 'Flight tracking',
        text: 'your driver adjusts the pick-up time if your flight is delayed, at no extra cost.',
      },
      {
        title: 'Meet and greet',
        text: 'in the arrivals hall, name board in hand, luggage assistance included.',
      },
      {
        title: 'Free child seats',
        text: 'infant carrier, child seat or booster, fitted before you land.',
      },
      {
        title: 'Flexible payment',
        text: 'card on board, cash or a payment link — your choice.',
      },
      {
        title: 'Free cancellation',
        text: 'up to 24 hours before the transfer, no reason needed.',
      },
      {
        title: 'Comfort on board',
        text: 'chilled water, chargers, wifi, English- and French-speaking driver.',
      },
    ],
    fleetTitle: 'A fleet that fits your group',
    fleetLead:
      'The fare depends on the vehicle, the number of passengers and the luggage — tell us everything in your quote request.',
    fleetPhoto: 'photo: {vehicle}',
    reviewsTitle: 'They travelled with us',
    reviewsNote: '— your Google / TripAdvisor reviews will appear here —',
    reviews: [
      {
        name: '— Google review no. 1',
        text: 'Placeholder: paste a genuine customer review here (Google or TripAdvisor).',
      },
      {
        name: '— Google review no. 2',
        text: 'Placeholder: paste a genuine customer review here (Google or TripAdvisor).',
      },
      {
        name: '— TripAdvisor review no. 1',
        text: 'Placeholder: paste a genuine customer review here (Google or TripAdvisor).',
      },
    ],
    finalTitle: 'Ready for the magic? Book your transfer.',
    finalLead: 'Free quote, no commitment, answer within minutes.',
    finalBook: 'Book online',
  },
  routes: {
    h1: 'All our transfers',
    lead: 'Private transfers between the Paris airports, central Paris and Disneyland Paris. Fixed price confirmed with your quote, based on passengers, luggage and the vehicle you choose.',
    see: 'View this transfer',
    askQuote: 'Request a quote',
    otherLead: 'Another destination?',
    otherLink: 'Ask us on WhatsApp — we cover the whole Île-de-France region.',
    descriptions: {
      'cdg-disneyland':
        'Our most requested transfer. Meet and greet in the arrivals hall, direct drop-off at your Disney or partner hotel.',
      'orly-disneyland':
        'Pick-up at Orly 1-2-3-4, direct run along the A86 and A4 to Marne-la-Vallée.',
      'beauvais-disneyland':
        'Skip the two shuttles and the RER: a direct door-to-door drive from Beauvais-Tillé.',
      'paris-disneyland':
        'From your Paris hotel or address to the parks or Disney hotels, at the time that suits you.',
      'cdg-paris':
        'Private transfer between Roissy and your Paris address, with no queueing and no surprises.',
      'orly-paris': 'Pick-up at Orly and drop-off at your hotel or front door in central Paris.',
      'paris-beauvais':
        'Departure from your Paris address, drop-off right outside the Beauvais-Tillé terminal.',
      'paris-versailles':
        'Palace of Versailles, Paris sightseeing, hourly or full-day hire with your driver.',
    },
  },
  routeDetail: {
    breadcrumb: 'Transfers',
    h1: 'Private chauffeur transfer {from} ↔ {to}',
    lead: {
      'cdg-disneyland':
        'A direct drive between Roissy Charles-de-Gaulle and the Disney hotels in about 45 minutes. Your driver tracks your flight, meets you with a name board and fits the child seats before you land.',
      'orly-disneyland':
        'A direct link between Orly and Marne-la-Vallée along the A86 and A4, about 50 minutes. Pick-up at Orly 1, 2, 3 or 4, with no changes and no waiting.',
      'beauvais-disneyland':
        'Beauvais-Tillé is 120 km from Disneyland: a private transfer saves you the shuttle, the station and the RER, with one direct door-to-door drive.',
      'paris-disneyland':
        'From your Paris hotel to the parks or Disney hotels in about 45 minutes, at the time you choose, with luggage and pushchairs on board.',
      'cdg-paris':
        'Private transfer between Roissy Charles-de-Gaulle and your Paris address, with a meet and greet in arrivals and a fixed price known at booking.',
      'orly-paris':
        'Private transfer between Orly and central Paris, at any hour, with no queueing and no last-minute supplements.',
      'paris-beauvais':
        'Departure from your Paris address, drop-off outside the Beauvais-Tillé terminal, with the timing worked out around your flight.',
      'paris-versailles':
        'Return trip or hourly hire between Paris and the Palace of Versailles, with a driver who waits while you visit.',
    },
    ctaBook: 'Book this transfer',
    statDuration: 'Journey time',
    statDistance: 'Distance',
    statHours: 'Every flight, every terminal',
    statHoursValue: '24/7',
    statPrice: 'Confirmed with your quote, no surprises',
    statPriceValue: 'Fixed price',
    howTitle: 'How your transfer works',
    stepPickupTitle: 'When you arrive',
    stepPickupAirport:
      'your driver tracks your flight in real time. Early or late, he is there at the right moment at no extra cost. He waits in the arrivals hall of your terminal with a name board.',
    stepPickupCity:
      'your driver waits outside your hotel or address at the agreed time, and texts you on SMS or WhatsApp as soon as he is there.',
    stepDriveTitle: 'On the way',
    stepDrive:
      'luggage assistance, child seats already fitted, chilled water and chargers on board. A direct drive, with no stops and no detours.',
    stepArrivalTitle: 'On arrival',
    stepArrivalDisney:
      'direct drop-off outside your Disney hotel (Disneyland Hotel, Newport Bay Club, Sequoia Lodge, Cheyenne, Santa Fe, Davy Crockett Ranch) or any partner hotel in Val d’Europe and Magny-le-Hongre.',
    stepArrivalOther:
      'drop-off at your exact address, right outside the door, with luggage carried to the lobby.',
    stepReturnTitle: 'Coming back',
    stepReturn:
      'pick-up at the agreed time, calculated so you reach your departure terminal without any rush.',
    photo: 'photo: meet and greet with name board',
    priceBoxTitle: 'The fare depends on:',
    priceFactors: [
      'Number of passengers (1 to 8)',
      'Number and size of bags',
      'Vehicle: saloon, SUV, van or premium',
    ],
    priceBoxCta: 'Get my fixed price',
    tableTitle: 'Fares {from} ↔ {to}',
    faqTitle: 'Frequently asked questions — {from} ↔ {to}',
    faq: [
      {
        q: 'What happens if my flight is delayed?',
        a: 'Nothing for you to do: we track your flight number in real time and adjust the pick-up at no extra cost, even at night.',
      },
      {
        q: 'Where do I meet the driver?',
        a: 'In the arrivals hall of your terminal, name board in hand. You receive his number by SMS or WhatsApp before you land.',
      },
      {
        q: 'Do child seats cost extra?',
        a: 'No, they are free. Just tell us the children’s ages when you book: infant carrier, child seat or booster will be fitted before you arrive.',
      },
      {
        q: 'How do I pay?',
        a: 'By card on board, in cash, or through a payment link in advance — your choice. The price confirmed in your quote is fixed, tolls and waiting included.',
      },
      {
        q: 'Is it really easier than the shuttle or the RER?',
        a: 'A private transfer is door to door, with no multiple stops, no changes with luggage and pushchairs, and it runs to your exact flight time.',
      },
    ],
  },
  prices: {
    h1: 'Prices — fixed and transparent',
    lead: 'Pick your departure point: every price is shown by number of passengers, one way or return. Tolls, luggage, waiting time and child seats are always included.',
    departLabel: 'From:',
    colPax: 'Passengers',
    colOneWay: 'One way',
    colRoundTrip: 'Return',
    bookThis: 'Book this transfer',
    noRoute:
      'No route from this point in our published grid — ask for a quote, we reply within 2 hours.',
    toursTitle: 'Day trips & chauffeur hire',
    toursLead:
      'Versailles, Mont Saint-Michel, the Loire châteaux… Every excursion is quoted individually, based on your group and your plans — guaranteed answer within 2 hours.',
    tourCta: 'Request a quote →',
    customBadge: '⏱ Reply within 2 h — 7 days a week',
    customTitle: 'Need a tailored quote?',
    customLead:
      'Groups of more than 8, a route outside the grid, a bespoke day trip, hourly hire: tell us what you need and we answer in under 2 hours.',
    customWhatsapp: 'WhatsApp quote',
    customForm: 'Quote form',
    whatsappRoute: 'Hello, I would like to book: {from} → {to}.',
    whatsappTour: 'Hello, I would like a quote for the {tour} excursion.',
  },
  booking: {
    h1: 'Book your transfer',
    lead: 'Fill in the form and we reply with a guaranteed fixed price within minutes. Or, even faster: WhatsApp or phone.',
    fromLabel: 'From',
    toLabel: 'To',
    dateLabel: 'Date',
    timeLabel: 'Time (flight or pick-up)',
    paxLabel: 'Passengers',
    bagsLabel: 'Luggage',
    vehicleLabel: 'Preferred vehicle',
    seatsLabel: 'Child seats',
    flightLabel: 'Flight number (if airport)',
    flightPlaceholder: 'e.g. AF 1234',
    nameLabel: 'Full name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@email.com',
    phoneLabel: 'Phone / WhatsApp',
    phonePlaceholder: '+44 …',
    messageLabel: 'Message (exact address, return trip, special requests…)',
    tripLabel: 'Trip type',
    oneWay: 'One way',
    roundTrip: 'Return',
    bagOptions: ['0–2', '3–4', '5–6', '7 or more'],
    seatOptions: [
      'None',
      'Infant carrier (0–12 months)',
      'Child seat (1–4 years)',
      'Booster (4–10 years)',
      'Several (please specify in the message)',
    ],
    vehicleAdvise: 'Advise me',
    otherPlace: 'Other (specify in the message)',
    submit: 'Send my quote request',
    submitting: 'Sending…',
    success: 'Request sent!',
    successLead: 'We will get back to you very shortly with your fixed price.',
    error: 'Sending failed. Please try again, or contact us directly on WhatsApp.',
    note: 'Free quote, no commitment — reply within 2 hours. Free cancellation up to 24 hours before the transfer.',
    estimateLabel: 'Estimate for this transfer',
    estimateCustom: 'Custom route — price confirmed within 2 hours',
    payTitle: 'Pay online now',
    payLead:
      'You can pay for your transfer by card straight away and lock in your slot immediately. Otherwise, payment is taken on board.',
    payCta: 'Pay €{price} by card',
    paySkip: 'I will pay on board',
    paySuccess: 'Payment received — thank you! Your transfer is confirmed.',
    payCancelled: 'Payment cancelled. Your request is still saved, and you can pay on board.',
    sidebarWhatsapp: 'WhatsApp',
    sidebarWhatsappNote: 'The fastest way — send your route, get the price straight back.',
    sidebarPhoneNote: '24/7, all year — English and French spoken.',
    includedTitle: 'Always included',
    included: [
      'Flight tracking & waiting time',
      'Meet and greet',
      'Free child seats',
      'Tolls included, fixed price',
    ],
    required: 'This field is required.',
    invalidEmail: 'Invalid email address.',
  },
  about: {
    h1: 'Your driver, not a platform',
    lead: 'Disney Paris Transfers is an independent private chauffeur service, specialising in journeys between the Paris airports and Disneyland Paris.',
    h2: 'One job: making your journey the easiest part of your holiday',
    paragraphs: [
      'Professional licensed chauffeur, valid permit, insured and maintained vehicles. I know every terminal at CDG and Orly, every Disney hotel, and the best routes at every hour of the day.',
      'Most of my customers are families arriving from far away — sometimes after a long flight, with tired children and plenty of luggage. My job is to have everything ready the moment you step off the plane: name board, child seats fitted, a big boot and a calm drive all the way to the magic.',
    ],
    editorNote:
      '✎ Replace this text with your own introduction: first name, years of experience, languages spoken…',
    photo: 'photo: portrait of the driver',
    stats: [
      { value: '100%', label: 'Insured journeys, licensed chauffeur' },
      { value: '24/7', label: 'Available day and night' },
      { value: 'FR · EN', label: 'Bilingual driver' },
      { value: '€0', label: 'Hidden fees — fixed price guaranteed' },
    ],
    ctaTitle: 'Let’s get acquainted',
    ctaLead: 'A question, an unusual journey? Write to me — I answer personally.',
    ctaContact: 'Contact me',
    ctaBook: 'Book a transfer',
  },
  faq: {
    h1: 'Frequently asked questions',
    lead: 'Everything worth knowing before you book your airport ↔ Disneyland Paris transfer.',
    items: [
      {
        q: 'How is the price of my transfer calculated?',
        a: 'The price is fixed and confirmed before you book. It depends on the number of passengers, the amount of luggage and the vehicle you choose (saloon, SUV, van or premium). Tolls, waiting time and child seats are always included.',
      },
      {
        q: 'What happens if my flight is delayed?',
        a: 'We track your flight number in real time. Your driver adjusts the pick-up time automatically, at no extra cost, even at night.',
      },
      {
        q: 'Where do I meet the driver at the airport?',
        a: 'In the arrivals hall of your terminal, with a name board. You receive his phone number by SMS or WhatsApp before you land.',
      },
      {
        q: 'Are child seats provided?',
        a: 'Yes, free of charge. Tell us your children’s ages when booking: infant carrier, child seat or booster will be fitted before pick-up.',
      },
      {
        q: 'How many people and bags can you carry?',
        a: 'Up to 4 passengers and 3 bags in a saloon, up to 8 passengers and 8 bags in a van. Pushchairs and equipment are welcome — mention them in your quote request.',
      },
      {
        q: 'How do I pay?',
        a: 'Card on board, cash, or a payment link in advance. No deposit is required for most transfers.',
      },
      {
        q: 'Can I cancel or change my booking?',
        a: 'Yes, free of charge up to 24 hours before the transfer. Just contact us on WhatsApp or by phone.',
      },
      {
        q: 'Does the driver speak English?',
        a: 'Yes — French and English. We regularly welcome families travelling to Disneyland Paris from all over the world.',
      },
      {
        q: 'Do you serve all Disney and partner hotels?',
        a: 'Yes: Disney hotels (Disneyland Hotel, Newport Bay, Sequoia, Cheyenne, Santa Fe, Davy Crockett Ranch) and partner hotels in Val d’Europe, Magny-le-Hongre, Bailly-Romainvilliers and Serris.',
      },
      {
        q: 'Do you do journeys other than Disney?',
        a: 'Yes: CDG/Orly/Beauvais ↔ Paris transfers, Paris railway stations, Versailles day trips and hourly hire. Just ask for a quote.',
      },
      {
        q: 'Do you operate at night and on public holidays?',
        a: 'Yes, 24/7 all year, including very early and very late flights. Book ahead to guarantee availability.',
      },
    ],
    moreTitle: 'Another question?',
  },
  contact: {
    h1: 'Contact',
    lead: 'Available 24/7, all year — we answer within minutes.',
    phoneTitle: 'Phone',
    phoneNote: 'Direct call, 24/7 all year',
    whatsappTitle: 'WhatsApp',
    whatsappNote: 'The fastest way to get a quote',
    emailTitle: 'Email',
    emailNote: 'Answer within a few hours',
    ctaTitle: 'Need a price right now?',
    ctaLead: 'The booking form gives you a fixed quote within minutes.',
    ctaBtn: 'Request my quote',
  },
  pricing: {
    timeLabel: 'Pickup time',
    nightNote: 'Night rate: +{percent} % between {start} and {end}',
    nightLine: 'Night supplement (+{percent} %)',
    baseLine: 'Transfer',
    totalLine: 'Estimated total',
    packagesTitle: 'Packages',
    packagesLead: 'Fixed-price offers, everything included. Pick one when you book.',
    packageLabel: 'Package',
    packageNone: 'No package — price my route',
    packageUpTo: 'Up to {pax} passengers',
    extrasTitle: 'Optional extras',
    extrasLead: 'Added to the price of your transfer.',
    extrasEach: 'each',
  },
  destinationKinds: {
    airport: 'Airports',
    city: 'Cities',
    castle: 'Castles & parks',
    tours: 'Tours',
  },
  zones: {
    cdg: 'CDG Airport',
    orly: 'Orly Airport',
    beauvais: 'Beauvais Airport',
    disney: 'Disneyland Paris',
    paris: 'Paris',
    versailles: 'Palace of Versailles',
    ladefense: 'La Défense',
    valeurope: 'Val d’Europe',
  },
  vehicles: {
    saloon: {
      label: 'Saloon',
      short: 'Saloon',
      desc: 'Ideal for a couple or a small family. Comfortable and discreet.',
      pax: '1–4 passengers',
      bags: '3 bags',
    },
    suv: {
      label: 'SUV',
      short: 'SUV',
      desc: 'More room for luggage, with the same comfort as a saloon.',
      pax: '1–4 passengers',
      bags: '4 bags',
    },
    van: {
      label: 'Van',
      short: 'Van',
      desc: 'Perfect for larger families and groups travelling with pushchairs.',
      pax: '5–8 passengers',
      bags: '8 bags',
    },
    premium: {
      label: 'Premium — Mercedes E/S-Class',
      short: 'Premium',
      desc: 'For a high-end journey: leather, quiet and attentive service.',
      pax: '1–3 passengers',
      bags: '3 bags',
    },
  },
  tours: {
    parisCityTour: {
      name: 'Paris City Tour',
      dur: '2 to 4 hours',
      desc: 'Private tour of the landmarks: Eiffel Tower, Champs-Élysées, Louvre, Montmartre…',
    },
    versailles: {
      name: 'Palace of Versailles',
      dur: 'Half day',
      desc: 'Return trip or hourly hire from Paris or Disneyland.',
    },
    montSaintMichel: {
      name: 'Mont Saint-Michel',
      dur: 'Full day',
      desc: 'Early start, a full day on site, back in the evening.',
    },
    normandie: {
      name: 'Normandy & the D-Day beaches',
      dur: 'Full day',
      desc: 'Omaha Beach, the American cemetery, Arromanches…',
    },
    loire: {
      name: 'Loire Valley châteaux',
      dur: 'Full day',
      desc: 'Chambord, Chenonceau, Amboise — an itinerary built around you.',
    },
    fontainebleau: {
      name: 'Fontainebleau',
      dur: 'Half day',
      desc: 'The château and forest of Fontainebleau, from Paris or Disney.',
    },
    giverny: {
      name: 'Giverny — Monet’s gardens',
      dur: 'Half day',
      desc: 'Claude Monet’s house and gardens (April–October).',
    },
    parcAsterix: {
      name: 'Parc Astérix',
      dur: 'Transfer',
      desc: 'One way or return from Paris, CDG or Disney.',
    },
    valleeVillage: {
      name: 'La Vallée Village — shopping',
      dur: 'Transfer',
      desc: 'Luxury outlet 5 minutes from Disneyland, waiting time available.',
    },
  },
  seo: {
    home: {
      title: 'CDG ↔ Disneyland Paris Transfer — Private Chauffeur | Disney Paris Transfers',
      description:
        'Private chauffeur for your transfers between CDG, Orly, Beauvais, Paris and Disneyland Paris. Fixed price from €70, flight tracking, meet and greet, free child seats. 24/7.',
    },
    routes: {
      title: 'All our transfers — Paris airports & Disneyland | Disney Paris Transfers',
      description:
        'CDG, Orly, Beauvais, Paris, Versailles: all our private transfers to Disneyland Paris and across Île-de-France, with journey times, distances and fixed prices.',
    },
    prices: {
      title: 'Paris & Disneyland transfer prices — fixed fares | Disney Paris Transfers',
      description:
        'Full price list by number of passengers, one way and return. Tolls, luggage and child seats included. Day trips quoted individually, reply within 2 hours.',
    },
    booking: {
      title: 'Book a Paris ↔ Disneyland transfer | Disney Paris Transfers',
      description:
        'Book your private chauffeur in 2 minutes: free quote with a guaranteed fixed price, reply within 2 hours, free cancellation up to 24 hours before the transfer.',
    },
    about: {
      title: 'About — Your private chauffeur in Paris | Disney Paris Transfers',
      description:
        'Independent licensed chauffeur specialising in airport ↔ Disneyland Paris transfers. Licensed, insured vehicles, bilingual French-English service.',
    },
    faq: {
      title: 'FAQ — Disneyland Paris transfers | Disney Paris Transfers',
      description:
        'Delayed flights, child seats, payment, cancellation, luggage: every answer before you book your airport ↔ Disneyland Paris transfer.',
    },
    contact: {
      title: 'Contact — Private chauffeur Paris | Disney Paris Transfers',
      description:
        'Reach us 24/7 by phone, WhatsApp or email for your transfer between the Paris airports and Disneyland Paris.',
    },
    routeDetail: {
      title: '{from} ↔ {to} transfer — private chauffeur from €{price} | Disney Paris Transfers',
      description:
        'Private {from} ↔ {to} transfer in around {duration}. Fixed price from €{price}, flight tracking, meet and greet, free child seats. Book online.',
    },
  },
};
