import type { Dictionary } from '../types';
import { legalDocs } from '../legalDocs';

export const de: Dictionary = {
  common: {
    brand: 'Disney Paris',
    brandAccent: 'Transfers',
    tagline: 'Privatchauffeur · Paris',
    langLabel: 'Sprache',
    menu: 'Menü',
    book: 'Buchen',
    bookTransfer: 'Transfer buchen',
    whatsappQuote: 'Sofortangebot per WhatsApp',
    callNow: 'Jetzt anrufen',
    writeWhatsapp: 'Nachricht auf WhatsApp',
    approx: '≈',
    minutes: 'min',
    hour: 'h',
    km: 'km',
    from: 'ab',
    quoteOnly: 'Auf Anfrage',
    perDay: 'Ganztags',
    availability: '7 Tage die Woche · rund um die Uhr',
    replyUnder2h: 'Antwort innerhalb von 2 Stunden',
    skipToContent: 'Zum Inhalt springen',
  },
  nav: {
    home: 'Start',
    routes: 'Transfers',
    prices: 'Preise',
    about: 'Über uns',
    faq: 'FAQ',
    contact: 'Kontakt',
    parisTransfers: 'Paris Transfers',
    disneyTransfers: 'Disneyland Transfers',
    viewAll: 'Alle Transfers',
    groups: {
      airports: 'Pariser Flughafentransfers',
      city: 'Paris und Umgebung',
      disney: 'Disneyland-Paris-Transfers',
      versailles: 'Versailles-Transfers',
    },
  },
  footer: {
    blurb:
      'Privatchauffeur in Paris, spezialisiert auf Flughafen- und Disneyland®-Paris-Transfers. Premium-Limousinen und Vans, Flugverfolgung, persönlicher Empfang, kostenlose Kindersitze.',
    disclaimer: 'Unabhängiger Service, nicht mit The Walt Disney Company verbunden.',
    colRoutes: 'Transfers',
    colSite: 'Die Website',
    colContact: 'Kontakt',
    whatsappLine: 'WhatsApp — schnelle Antwort',
    booking: 'Buchung',
    rights: '© 2026 disneyparistransfers.com — Alle Rechte vorbehalten',
    seoLine: 'Chauffeur Paris · Flughafentransfers CDG, Orly, Beauvais · Disneyland Paris',
    colLegal: 'Rechtliches',
    terms: 'AGB',
    privacy: 'Datenschutz',
    cookies: 'Cookies',
  },
  home: {
    badge: 'Spezialisten für Transfers nach Disneyland® Paris',
    h1: 'Ihr Privatchauffeur zwischen den Pariser Flughäfen und Disneyland Paris',
    lead: 'Transfers ab CDG, Orly, Beauvais und Paris in einer Premium-Limousine oder einem Van. Wir verfolgen Ihren Flug, empfangen Sie mit Namensschild und stellen kostenlose Kindersitze — Ihr Urlaub beginnt am Flughafen.',
    ctaPrimary: 'Transfer buchen',
    ctaSecondary: 'Sofortangebot per WhatsApp',
    perks: ['Kostenlose Stornierung', 'Flugverfolgung', 'Kartenzahlung an Bord', '365 Tage, rund um die Uhr'],
    calc: {
      title: 'Ihr Preis, live',
      fromLabel: 'Von',
      toLabel: 'Nach',
      paxLabel: 'Passagiere',
      tripLabel: 'Fahrt',
      oneWay: 'Einfach',
      roundTrip: 'Hin und zurück',
      vehicleLabel: 'Fahrzeug',
      roundTripSuffix: ' · hin und zurück',
      priceNote: 'Festpreis — Maut, Gepäck und Kindersitze inklusive',
      confirmWhatsapp: 'Per WhatsApp bestätigen',
      book: 'Buchen',
      samePlace: 'Bitte zwei verschiedene Orte wählen',
      custom: 'Individuelle Strecke — Antwort in 2 Stunden',
      loading: 'Preis wird berechnet…',
      whatsappMessage:
        'Hallo, ich möchte buchen: {from} → {to}, {pax} Passagier(e), {vehicle}, {trip}.',
    },
    routesTitle: 'Unsere beliebtesten Transfers',
    routesLead: 'Festpreis bei der Buchung bestätigt, je nach Passagieren, Gepäck und Fahrzeug.',
    seeRoute: 'Diesen Transfer ansehen →',
    excursionsCard: {
      title: 'Tagesausflüge: Versailles, Mont-Saint-Michel…',
      duration: 'Ganztags',
      note: 'Angebot in 2 Std.',
    },
    stepsTitle: 'So einfach buchen Sie',
    steps: [
      {
        title: 'Angebot anfragen',
        text: 'Per Formular, WhatsApp oder Telefon. Antwort in Minuten, mit garantiertem Festpreis.',
      },
      {
        title: 'Wir warten auf Sie',
        text: 'Ihr Fahrer verfolgt den Flug und empfängt Sie mit Namensschild, auch bei verspäteter Landung.',
      },
      {
        title: 'Genießen Sie die Fahrt',
        text: 'Kühles Wasser, Ladegeräte, Kindersitze bereits eingebaut. Zahlung per Karte oder bar an Bord.',
      },
    ],
    familyTitle: 'Für Familien gedacht',
    familyPhoto: 'Foto: Fahrzeuginnenraum / Kindersitze',
    services: [
      {
        title: 'Flugverfolgung',
        text: 'passt Ihr Fahrer die Abholzeit bei Verspätung kostenlos an.',
      },
      {
        title: 'Empfang mit Namensschild',
        text: 'in der Ankunftshalle, Namensschild in der Hand, Gepäckhilfe inklusive.',
      },
      {
        title: 'Kostenlose Kindersitze',
        text: 'Babyschale, Kindersitz oder Sitzerhöhung, vor der Landung eingebaut.',
      },
      {
        title: 'Flexible Zahlung',
        text: 'Karte an Bord, bar oder Zahlungslink — Ihre Wahl.',
      },
      {
        title: 'Kostenlose Stornierung',
        text: 'bis 24 Stunden vor dem Transfer, ohne Begründung.',
      },
      {
        title: 'Komfort an Bord',
        text: 'kühles Wasser, Ladegeräte, WLAN, deutsch-, englisch- und französischsprachiger Fahrer.',
      },
    ],
    fleetTitle: 'Eine Flotte, die zu Ihrer Gruppe passt',
    fleetLead:
      'Der Preis hängt vom Fahrzeug, der Passagierzahl und dem Gepäck ab — nennen Sie uns alles in der Anfrage.',
    fleetPhoto: 'Foto: {vehicle}',
    reviewsTitle: 'Sie sind mit uns gefahren',
    reviewsNote: '— your Google / TripAdvisor reviews will appear here —',
    reviews: [
      {
        name: '— Google-Bewertung Nr. 1',
        text: 'Placeholder: paste a genuine customer review here (Google or TripAdvisor).',
      },
      {
        name: '— Google-Bewertung Nr. 2',
        text: 'Placeholder: paste a genuine customer review here (Google or TripAdvisor).',
      },
      {
        name: '— TripAdvisor review no. 1',
        text: 'Placeholder: paste a genuine customer review here (Google or TripAdvisor).',
      },
    ],
    finalTitle: 'Bereit für die Magie? Buchen Sie Ihren Transfer.',
    finalLead: 'Kostenloses Angebot, unverbindlich, Antwort in Minuten.',
    finalBook: 'Buchen online',
  },
  routes: {
    h1: 'Alle Transfers',
    lead: 'Private Transfers zwischen den Pariser Flughäfen, Paris und Disneyland Paris. Festpreis mit dem Angebot bestätigt, je nach Passagieren, Gepäck und Fahrzeug.',
    see: 'Diesen Transfer ansehen',
    askQuote: 'Angebot anfragen',
    otherLead: 'Ein anderes Ziel?',
    otherLink: 'Fragen Sie uns auf WhatsApp — wir fahren in der gesamten Île-de-France.',
    descriptionTemplate:
      'Privatchauffeur zwischen {from} und {to}. Festpreis, Empfang mit Namensschild, Kindersitze inklusive.',
    descriptions: {
      'cdg-disneyland':
        'Unser meistgebuchter Transfer. Empfang in der Ankunftshalle, direkte Fahrt zu Ihrem Disney- oder Partnerhotel.',
      'orly-disneyland':
        'Abholung an Orly 1-2-3-4, direkte Fahrt über A86 und A4 nach Marne-la-Vallée.',
      'beauvais-disneyland':
        'Ohne zwei Shuttles und RER: direkte Tür-zu-Tür-Fahrt ab Beauvais-Tillé.',
      'paris-disneyland':
        'Von Ihrem Pariser Hotel oder Ihrer Adresse zu den Parks oder Disney-Hotels, zur Uhrzeit Ihrer Wahl.',
      'cdg-paris':
        'Privater Transfer zwischen Roissy und Ihrer Pariser Adresse, ohne Schlange und ohne Überraschungen.',
      'orly-paris': 'Abholung in Orly und Absetzen vor Ihrem Hotel oder Ihrer Tür in Paris.',
      'paris-beauvais':
        'Abfahrt von Ihrer Pariser Adresse, Absetzen direkt vor dem Terminal Beauvais-Tillé.',
      'paris-versailles':
        'Schloss Versailles, Paris-Rundfahrt, stunden- oder tagesweise mit Ihrem Fahrer.',
    },
  },
  routeDetail: {
    breadcrumb: 'Transfers',
    h1: 'Privatchauffeur-Transfer {from} ↔ {to}',
    leadTemplate:
      'Privater Tür-zu-Tür-Transfer zwischen {from} und {to}. Ihr Fahrer verfolgt den Flug, empfängt Sie mit Namensschild und bestätigt den Festpreis vor der Fahrt.',
    lead: {
      'cdg-disneyland':
        'Direkte Fahrt zwischen Roissy Charles-de-Gaulle und den Disney-Hotels in etwa 45 Minuten. Ihr Fahrer verfolgt den Flug, empfängt Sie mit Namensschild und baut die Kindersitze vor der Landung ein.',
      'orly-disneyland':
        'Direkte Verbindung zwischen Orly und Marne-la-Vallée über A86 und A4, etwa 50 Minuten. Abholung an Orly 1, 2, 3 oder 4, ohne Umsteigen und ohne Warten.',
      'beauvais-disneyland':
        'Beauvais-Tillé liegt 120 km von Disneyland: ein privater Transfer erspart Shuttle, Bahnhof und RER — eine direkte Tür-zu-Tür-Fahrt.',
      'paris-disneyland':
        'Von Ihrem Pariser Hotel zu den Parks oder Disney-Hotels in etwa 45 Minuten, zur Uhrzeit Ihrer Wahl, mit Gepäck und Kinderwagen an Bord.',
      'cdg-paris':
        'Privater Transfer zwischen Roissy Charles-de-Gaulle und Ihrer Pariser Adresse, Empfang in der Ankunftshalle und Festpreis bei der Buchung.',
      'orly-paris':
        'Privater Transfer zwischen Orly und Paris, zu jeder Stunde, ohne Schlange und ohne Last-Minute-Zuschläge.',
      'paris-beauvais':
        'Abfahrt von Ihrer Pariser Adresse, Absetzen vor dem Terminal Beauvais-Tillé, zeitlich auf Ihren Flug abgestimmt.',
      'paris-versailles':
        'Hin und zurück oder stundenweise zwischen Paris und Schloss Versailles, mit einem Fahrer der während des Besuchs wartet.',
    },
    ctaBook: 'Diesen Transfer buchen',
    livePriceTitle: 'Ihr Preis, live',
    relatedTitle: 'Weitere Transfers',
    imageAlt: 'Privatchauffeur-Transfer von {from} nach {to}',
    statDuration: 'Fahrtdauer',
    statDistance: 'Entfernung',
    statHours: 'Jeder Flug, jedes Terminal',
    statHoursValue: '24/7',
    statPrice: 'Mit dem Angebot bestätigt, ohne Überraschungen',
    statPriceValue: 'Festpreis',
    howTitle: 'So läuft Ihr Transfer',
    stepPickupTitle: 'Bei Ihrer Ankunft',
    stepPickupAirport:
      'verfolgt Ihr Fahrer den Flug in Echtzeit. Zu früh oder zu spät: er ist zur richtigen Zeit da, ohne Aufpreis. Er wartet in der Ankunftshalle Ihres Terminals mit Namensschild.',
    stepPickupCity:
      'wartet Ihr Fahrer zur vereinbarten Zeit vor Hotel oder Adresse und schreibt per SMS oder WhatsApp, sobald er da ist.',
    stepDriveTitle: 'Unterwegs',
    stepDrive:
      'Hilfe mit dem Gepäck, Kindersitze bereits eingebaut, kühles Wasser und Ladegeräte an Bord. Direkte Fahrt ohne Umwege.',
    stepArrivalTitle: 'Bei der Ankunft',
    stepArrivalDisney:
      'direkte Ankunft vor Ihrem Disney-Hotel (Disneyland Hotel, Newport Bay Club, Sequoia Lodge, Cheyenne, Santa Fe, Davy Crockett Ranch) oder einem Partnerhotel in Val d’Europe und Magny-le-Hongre.',
    stepArrivalOther:
      'Absetzen an Ihrer genauen Adresse, direkt vor der Tür, Gepäck bis in die Lobby.',
    stepReturnTitle: 'Rückfahrt',
    stepReturn:
      'Abholung zur vereinbarten Zeit, so berechnet, dass Sie ohne Hetze am Abflugterminal sind.',
    photo: 'Foto: Empfang mit Namensschild',
    priceBoxTitle: 'Der Preis hängt ab von:',
    priceFactors: [
      'Anzahl der Passagiere (1 bis 8)',
      'Anzahl und Größe des Gepäcks',
      'Fahrzeug: Limousine, SUV, Van oder Premium',
    ],
    priceBoxCta: 'Meinen Festpreis erhalten',
    tableTitle: 'Tarife {from} ↔ {to}',
    faqTitle: 'Häufige Fragen — {from} ↔ {to}',
    faq: [
      {
        q: 'Was passiert bei Flugverspätung?',
        a: 'Sie müssen nichts tun: wir verfolgen Ihre Flugnummer in Echtzeit und passen die Abholung kostenlos an, auch nachts.',
      },
      {
        q: 'Wo treffe ich den Fahrer?',
        a: 'In der Ankunftshalle Ihres Terminals, Namensschild in der Hand. Sie erhalten seine Nummer per SMS oder WhatsApp vor der Landung.',
      },
      {
        q: 'Kosten Kindersitze extra?',
        a: 'Nein, sie sind kostenlos. Nennen Sie uns beim Buchen das Alter der Kinder: Babyschale, Kindersitz oder Sitzerhöhung werden vor Ihrer Ankunft eingebaut.',
      },
      {
        q: 'Wie zahle ich?',
        a: 'Mit Karte an Bord, bar oder per vorausgehendem Zahlungslink — Ihre Wahl. Der im Angebot bestätigte Preis ist fest, Maut und Wartezeit inklusive.',
      },
      {
        q: 'Ist es wirklich einfacher als Shuttle oder RER?',
        a: 'Ein privater Transfer fährt Tür zu Tür, ohne mehrere Stopps, ohne Umsteigen mit Gepäck und Kinderwagen, und richtet sich nach Ihrer Flugzeit.',
      },
    ],
  },
  prices: {
    h1: 'Preise — fest und transparent',
    lead: 'Wählen Sie den Abfahrtsort: jeder Preis nach Passagierzahl, einfach oder hin und zurück. Maut, Gepäck, Wartezeit und Kindersitze sind immer inklusive.',
    departLabel: 'Von:',
    colPax: 'Passagiere',
    colOneWay: 'Einfach',
    colRoundTrip: 'Hin und zurück',
    bookThis: 'Diesen Transfer buchen',
    noRoute:
      'Keine Strecke ab diesem Punkt in unserer Preistabelle — fragen Sie ein Angebot an, wir antworten in 2 Stunden.',
    toursTitle: 'Tagesausflüge & Chauffeur mieten',
    toursLead:
      'Versailles, Mont-Saint-Michel, Loire-Schlösser… Jede Tour wird individuell nach Gruppe und Plänen kalkuliert — Antwort garantiert in 2 Stunden.',
    tourCta: 'Angebot anfragen →',
    customBadge: '⏱ Antwort in 2 Std. — 7 Tage die Woche',
    customTitle: 'Individuelles Angebot nötig?',
    customLead:
      'Gruppen über 8, Strecke außerhalb der Tabelle, maßgeschneiderter Tagesausflug, stundenweise: sagen Sie uns, was Sie brauchen, Antwort unter 2 Stunden.',
    customWhatsapp: 'WhatsApp-Angebot',
    customForm: 'Anfrageformular',
    whatsappRoute: 'Hallo, ich möchte buchen: {from} → {to}.',
    whatsappTour: 'Hallo, ich möchte ein Angebot für den Ausflug {tour}.',
  },
  booking: {
    h1: 'Buchen Sie Ihren Transfer',
    lead: 'Füllen Sie das Formular aus — wir antworten in Minuten mit einem garantierten Festpreis. Noch schneller: WhatsApp oder Telefon.',
    fromLabel: 'Von',
    toLabel: 'Nach',
    dateLabel: 'Datum',
    timeLabel: 'Uhrzeit (Flug oder Abholung)',
    paxLabel: 'Passagiere',
    bagsLabel: 'Gepäck',
    vehicleLabel: 'Bevorzugtes Fahrzeug',
    seatsLabel: 'Kindersitze',
    flightLabel: 'Flugnummer (am Flughafen)',
    flightPlaceholder: 'z. B. AF 1234',
    nameLabel: 'Vollständiger Name',
    namePlaceholder: 'Ihr Name',
    emailLabel: 'E-Mail',
    emailPlaceholder: 'sie@email.com',
    phoneLabel: 'Telefon / WhatsApp',
    phonePlaceholder: '+44 …',
    messageLabel: 'Nachricht (genaue Adresse, Rückfahrt, besondere Wünsche…)',
    tripLabel: 'Fahrtart',
    oneWay: 'Einfach',
    roundTrip: 'Hin und zurück',
    bagOptions: ['0–2', '3–4', '5–6', '7 oder mehr'],
    seatOptions: [
      'Keine',
      'Babyschale (0–12 Monate)',
      'Kindersitz (1–4 Jahre)',
      'Sitzerhöhung (4–10 Jahre)',
      'Mehrere (bitte in der Nachricht angeben)',
    ],
    vehicleAdvise: 'Bitte beraten',
    otherPlace: 'Andere (in der Nachricht angeben)',
    submit: 'Anfrage senden',
    submitting: 'Wird gesendet…',
    success: 'Anfrage gesendet!',
    successLead: 'Wir melden uns in Kürze mit Ihrem Festpreis.',
    error: 'Senden fehlgeschlagen. Bitte erneut versuchen oder uns direkt auf WhatsApp schreiben.',
    note: 'Kostenloses Angebot, unverbindlich — Antwort in 2 Stunden. Kostenlose Stornierung bis 24 Stunden vor dem Transfer.',
    estimateLabel: 'Schätzung für diesen Transfer',
    estimateCustom: 'Individuelle Strecke — Preis in 2 Stunden bestätigt',
    payTitle: 'Jetzt online zahlen',
    payLead:
      'Sie können den Transfer sofort per Karte zahlen und den Termin sichern. Sonst zahlen Sie an Bord.',
    payCta: '{price} € per Karte zahlen',
    paySkip: 'Ich zahle an Bord',
    paySuccess: 'Zahlung eingegangen — danke! Ihr Transfer ist bestätigt.',
    payCancelled: 'Zahlung abgebrochen. Ihre Anfrage bleibt gespeichert, Sie können an Bord zahlen.',
    sidebarWhatsapp: 'WhatsApp',
    sidebarWhatsappNote: 'Der schnellste Weg — Strecke senden, Preis sofort zurück.',
    sidebarPhoneNote: 'Rund um die Uhr, ganzjährig — Deutsch, Englisch und Französisch.',
    includedTitle: 'Immer inklusive',
    included: [
      'Flugverfolgung & Wartezeit',
      'Empfang mit Namensschild',
      'Kostenlose Kindersitze',
      'Maut inklusive, Festpreis',
    ],
    required: 'Dieses Feld ist Pflicht.',
    invalidEmail: 'Ungültige E-Mail-Adresse.',
    stepJourney: 'Fahrt',
    stepParty: 'Passagiere',
    stepContact: 'Kontakt',
    next: 'Weiter',
    back: 'Zurück',
    trustSeats: 'Kostenlose Kindersitze',
    trustFixed: 'Festpreis, keine Überraschungen',
    trustHours: 'Service rund um die Uhr',
    noCard: 'Keine Karte für das Angebot nötig',
    liveTitle: 'Geschätzter Preis',
  },
  about: {
    h1: 'Ihr Fahrer, keine Plattform',
    lead: 'Disney Paris Transfers ist ein unabhängiger Privatchauffeur-Service, spezialisiert auf Fahrten zwischen den Pariser Flughäfen und Disneyland Paris.',
    h2: 'Eine Aufgabe: Ihre Fahrt zum einfachsten Teil des Urlaubs machen',
    paragraphs: [
      'Lizenzierter Berufschauffeur, gültige Genehmigung, versicherte und gepflegte Fahrzeuge. Ich kenne jedes Terminal in CDG und Orly, jedes Disney-Hotel und die besten Strecken zu jeder Stunde.',
      'Die meisten Gäste sind Familien, oft nach einem langen Flug, mit müden Kindern und viel Gepäck. Mein Job: alles bereit, wenn Sie das Flugzeug verlassen — Namensschild, Kindersitze, großer Kofferraum und eine ruhige Fahrt bis zur Magie.',
    ],
    editorNote:
      '✎ Ersetzen Sie diesen Text durch Ihre Vorstellung: Vorname, Berufserfahrung, Sprachen…',
    photo: 'Foto: Porträt des Fahrers',
    stats: [
      { value: '100%', label: 'Versicherte Fahrten, lizenzierter Chauffeur' },
      { value: '24/7', label: 'Tag und Nacht erreichbar' },
      { value: 'FR · EN', label: 'Mehrsprachiger Fahrer' },
      { value: '€0', label: 'Keine versteckten Gebühren — Festpreis garantiert' },
    ],
    ctaTitle: 'Lernen wir uns kennen',
    ctaLead: 'Eine Frage, eine ungewöhnliche Strecke? Schreiben Sie mir — ich antworte persönlich.',
    ctaContact: 'Kontakt aufnehmen',
    ctaBook: 'Einen Transfer buchen',
  },
  faq: {
    h1: 'Häufige Fragen',
    lead: 'Alles Wissenswerte vor der Buchung Ihres Flughafen-↔-Disneyland-Paris-Transfers.',
    items: [
      {
        q: 'Wie wird der Transferpreis berechnet?',
        a: 'Der Preis ist fest und vor der Buchung bestätigt. Er hängt von Passagieren, Gepäck und Fahrzeug ab (Limousine, SUV, Van oder Premium). Maut, Wartezeit und Kindersitze sind immer inklusive.',
      },
      {
        q: 'Was passiert bei Flugverspätung?',
        a: 'Wir verfolgen Ihre Flugnummer in Echtzeit. Der Fahrer passt die Abholung automatisch an, ohne Aufpreis, auch nachts.',
      },
      {
        q: 'Wo treffe ich den Fahrer am Flughafen?',
        a: 'In der Ankunftshalle Ihres Terminals, mit Namensschild. Sie erhalten seine Nummer per SMS oder WhatsApp vor der Landung.',
      },
      {
        q: 'Gibt es Kindersitze?',
        a: 'Ja, kostenlos. Nennen Sie uns beim Buchen das Alter der Kinder: Babyschale, Kindersitz oder Sitzerhöhung werden vor der Abholung eingebaut.',
      },
      {
        q: 'Wie viele Personen und Koffer nehmen Sie mit?',
        a: 'Bis zu 4 Passagiere und 3 Koffer in der Limousine, bis zu 8 Passagiere und 8 Koffer im Van. Kinderwagen willkommen — bitte in der Anfrage erwähnen.',
      },
      {
        q: 'Wie zahle ich?',
        a: 'Karte an Bord, bar oder vorausgehender Zahlungslink. Für die meisten Transfers ist keine Anzahlung nötig.',
      },
      {
        q: 'Kann ich stornieren oder ändern?',
        a: 'Ja, kostenlos bis 24 Stunden vor dem Transfer. Einfach per WhatsApp oder Telefon.',
      },
      {
        q: 'Spricht der Fahrer Englisch?',
        a: 'Ja — Deutsch, Französisch und Englisch. Wir empfangen regelmäßig Familien aus der ganzen Welt auf dem Weg nach Disneyland Paris.',
      },
      {
        q: 'Fahren Sie alle Disney- und Partnerhotels an?',
        a: 'Ja: Disney-Hotels (Disneyland Hotel, Newport Bay, Sequoia, Cheyenne, Santa Fe, Davy Crockett Ranch) und Partnerhotels in Val d’Europe, Magny-le-Hongre, Bailly-Romainvilliers und Serris.',
      },
      {
        q: 'Fahren Sie auch andere Strecken als Disney?',
        a: 'Ja: Transfers CDG/Orly/Beauvais ↔ Paris, Pariser Bahnhöfe, Versailles-Tagesausflüge und stundenweise Miete. Einfach anfragen.',
      },
      {
        q: 'Fahren Sie nachts und an Feiertagen?',
        a: 'Ja, rund um die Uhr das ganze Jahr, auch sehr frühe und späte Flüge. Bitte früh buchen, um die Verfügbarkeit zu sichern.',
      },
    ],
    moreTitle: 'Noch eine Frage?',
  },
  contact: {
    h1: 'Kontakt',
    lead: 'Rund um die Uhr, ganzjährig — wir antworten in Minuten.',
    phoneTitle: 'Telefon',
    phoneNote: 'Direktanruf, rund um die Uhr',
    whatsappTitle: 'WhatsApp',
    whatsappNote: 'Der schnellste Weg zum Angebot',
    emailTitle: 'E-Mail',
    emailNote: 'Antwort innerhalb weniger Stunden',
    ctaTitle: 'Sofort einen Preis?',
    ctaLead: 'Das Buchungsformular liefert in Minuten ein festes Angebot.',
    ctaBtn: 'Mein Angebot anfragen',
  },
  pricing: {
    timeLabel: 'Abholzeit',
    nightNote: 'Nachttarif: +{percent} % zwischen {start} und {end}',
    nightLine: 'Nachtzuschlag (+{percent} %)',
    baseLine: 'Transfer',
    totalLine: 'Geschätzte Summe',
    packagesTitle: 'Pakete',
    packagesLead: 'Festpreisangebote, alles inklusive. Bei der Buchung wählen.',
    packageLabel: 'Paket',
    packageNone: 'Kein Paket — Strecke berechnen',
    packageUpTo: 'Bis zu {pax} Passagiere',
    extrasTitle: 'Optionale Extras',
    extrasLead: 'Kommt zum Transferpreis hinzu.',
    extrasEach: 'pro Stück',
  },
  cookieBanner: {
    message:
      'Wir verwenden wenige notwendige Cookies (Sprache, Admin-Sitzung und dieser Hinweis). Keine Werbe-Cookies.',
    accept: 'Verstanden',
    more: 'Cookie-Richtlinie',
  },
  legal: legalDocs.de,
  destinationKinds: {
    airport: 'Flughäfen',
    city: 'Städte',
    castle: 'Schlösser & Parks',
    tours: 'Touren',
  },
  zones: {
    cdg: 'Flughafen CDG',
    orly: 'Flughafen Orly',
    beauvais: 'Flughafen Beauvais',
    disney: 'Disneyland Paris',
    paris: 'Paris',
    versailles: 'Schloss Versailles',
    ladefense: 'La Défense',
    valeurope: 'Val d’Europe',
  },
  vehicles: {
    saloon: {
      label: 'Limousine',
      short: 'Limousine',
      desc: 'Ideal für Paare oder kleine Familien. Bequem und dezent.',
      pax: '1–4 Passagiere',
      bags: '3 Koffer',
    },
    suv: {
      label: 'SUV',
      short: 'SUV',
      desc: 'Mehr Platz für Gepäck, gleicher Komfort wie eine Limousine.',
      pax: '1–4 Passagiere',
      bags: '4 Koffer',
    },
    van: {
      label: 'Van',
      short: 'Van',
      desc: 'Perfekt für größere Familien und Gruppen mit Kinderwagen.',
      pax: '5–8 Passagiere',
      bags: '8 Koffer',
    },
    premium: {
      label: 'Premium — Mercedes E-/S-Klasse',
      short: 'Premium',
      desc: 'Für eine erstklassige Fahrt: Leder, Ruhe und aufmerksamer Service.',
      pax: '1–3 Passagiere',
      bags: '3 Koffer',
    },
  },
  tours: {
    parisCityTour: {
      name: 'Paris-Stadtrundfahrt',
      dur: '2 bis 4 Stunden',
      desc: 'Private Tour zu den Sehenswürdigkeiten: Eiffelturm, Champs-Élysées, Louvre, Montmartre…',
    },
    versailles: {
      name: 'Schloss Versailles',
      dur: 'Halbtags',
      desc: 'Hin und zurück oder stundenweise ab Paris oder Disneyland.',
    },
    montSaintMichel: {
      name: 'Mont Saint-Michel',
      dur: 'Ganztags',
      desc: 'Früher Start, ganzer Tag vor Ort, abends zurück.',
    },
    normandie: {
      name: 'Normandie & D-Day-Strände',
      dur: 'Ganztags',
      desc: 'Omaha Bpro Stück, der amerikanische Friedhof, Arromanches…',
    },
    loire: {
      name: 'Schlösser der Loire',
      dur: 'Ganztags',
      desc: 'Chambord, Chenonceau, Amboise — eine Route um Sie herum.',
    },
    fontainebleau: {
      name: 'Fontainebleau',
      dur: 'Halbtags',
      desc: 'Schloss und Wald von Fontainebleau, ab Paris oder Disney.',
    },
    giverny: {
      name: 'Giverny — Monets Gärten',
      dur: 'Halbtags',
      desc: 'Haus und Gärten von Claude Monet (April–Oktober).',
    },
    parcAsterix: {
      name: 'Parc Astérix',
      dur: 'Transfer',
      desc: 'Einfach oder hin und zurück ab Paris, CDG oder Disney.',
    },
    valleeVillage: {
      name: 'La Vallée Village — Shopping',
      dur: 'Transfer',
      desc: 'Luxus-Outlet 5 Minuten von Disneyland, Wartezeit möglich.',
    },
  },
  seo: {
    home: {
      title: 'CDG ↔ Disneyland Paris Transfer — Privatchauffeur | Disney Paris Transfers',
      description:
        'Privatchauffeur für Transfers zwischen CDG, Orly, Beauvais, Paris und Disneyland Paris. Festpreis ab 70 €, Flugverfolgung, Empfang, kostenlose Kindersitze. Rund um die Uhr.',
    },
    routes: {
      title: 'Alle Transfers — Pariser Flughäfen & Disneyland | Disney Paris Transfers',
      description:
        'CDG, Orly, Beauvais, Paris, Versailles: alle privaten Transfers nach Disneyland Paris und in der Île-de-France, mit Fahrzeiten, Entfernungen und Festpreisen.',
    },
    prices: {
      title: 'Preise Paris- & Disneyland-Transfers — Festtarife | Disney Paris Transfers',
      description:
        'Vollständige Preisliste nach Passagierzahl, einfach und hin und zurück. Maut, Gepäck und Kindersitze inklusive. Tagesausflüge individuell, Antwort in 2 Stunden.',
    },
    booking: {
      title: 'Paris ↔ Disneyland Transfer buchen | Disney Paris Transfers',
      description:
        'Privatchauffeur in 2 Minuten buchen: kostenloses Angebot mit Festpreis, Antwort in 2 Stunden, kostenlose Stornierung bis 24 Stunden vorher.',
    },
    about: {
      title: 'Über uns — Ihr Privatchauffeur in Paris | Disney Paris Transfers',
      description:
        'Unabhängiger lizenzierter Chauffeur, spezialisiert auf Flughafen-↔-Disneyland-Paris-Transfers. Versicherte Fahrzeuge, deutsch-, englisch- und französischsprachiger Service.',
    },
    faq: {
      title: 'FAQ — Disneyland-Paris-Transfers | Disney Paris Transfers',
      description:
        'Verspätete Flüge, Kindersitze, Zahlung, Stornierung, Gepäck: alle Antworten vor der Buchung Ihres Flughafen-↔-Disneyland-Paris-Transfers.',
    },
    contact: {
      title: 'Kontakt — Privatchauffeur Paris | Disney Paris Transfers',
      description:
        'Erreichen Sie uns rund um die Uhr per Telefon, WhatsApp oder E-Mail für Ihren Transfer zwischen den Pariser Flughäfen und Disneyland Paris.',
    },
    terms: {
      title: 'Allgemeine Geschäftsbedingungen | Disney Paris Transfers',
      description:
        'Buchungsbedingungen von Disney Paris Transfers: Angebote, Zahlung, Stornierung, Nachtzuschlag und Pflichten der Fahrgäste.',
    },
    privacy: {
      title: 'Datenschutzerklärung | Disney Paris Transfers',
      description:
        'Wie Disney Paris Transfers personenbezogene Datumn für Buchungen, E-Mails und Zahlungen erhebt, speichert und nutzt.',
    },
    cookies: {
      title: 'Cookie-Richtlinie | Disney Paris Transfers',
      description:
        'Notwendige Cookies auf disneyparistransfers.com: Sprache, Admin-Sitzung und dieser Hinweis. Keine Werbe-Cookies.',
    },
    routeDetail: {
      title: 'Transfer {from} ↔ {to} — Privatchauffeur ab {price} € | Disney Paris Transfers',
      description:
        'Privater Transfer {from} ↔ {to} in etwa {duration}. Festpreis ab {price} €, Flugverfolgung, Empfang, kostenlose Kindersitze. Online buchen.',
    },
  },
};
