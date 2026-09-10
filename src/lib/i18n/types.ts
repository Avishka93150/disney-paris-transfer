import type { TourId, VehicleId, ZoneId } from '@/lib/prices';

type Entry = { title: string; text: string };
type Question = { q: string; a: string };
type Seo = { title: string; description: string };

/**
 * The complete shape of the site's copy. Every string a visitor can see goes
 * through here — except the admin, which is English only and untranslated, and
 * the package and add-on names the admin types itself.
 *
 * Templates use `{from}`, `{to}`, `{price}`… placeholders, filled in by
 * `fill()` (see `src/lib/i18n/index.ts`).
 */
export type Dictionary = {
  common: {
    brand: string;
    brandAccent: string;
    tagline: string;
    langLabel: string;
    menu: string;
    book: string;
    bookTransfer: string;
    whatsappQuote: string;
    callNow: string;
    writeWhatsapp: string;
    approx: string;
    minutes: string;
    hour: string;
    km: string;
    from: string;
    quoteOnly: string;
    perDay: string;
    availability: string;
    replyUnder2h: string;
    skipToContent: string;
  };
  nav: {
    home: string;
    routes: string;
    prices: string;
    about: string;
    faq: string;
    contact: string;
  };
  footer: {
    blurb: string;
    disclaimer: string;
    colRoutes: string;
    colSite: string;
    colContact: string;
    whatsappLine: string;
    booking: string;
    rights: string;
    seoLine: string;
  };
  home: {
    badge: string;
    h1: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    perks: string[];
    calc: {
      title: string;
      fromLabel: string;
      toLabel: string;
      paxLabel: string;
      tripLabel: string;
      oneWay: string;
      roundTrip: string;
      vehicleLabel: string;
      roundTripSuffix: string;
      priceNote: string;
      confirmWhatsapp: string;
      book: string;
      samePlace: string;
      custom: string;
      loading: string;
      whatsappMessage: string;
    };
    routesTitle: string;
    routesLead: string;
    seeRoute: string;
    excursionsCard: { title: string; duration: string; note: string };
    stepsTitle: string;
    steps: Entry[];
    familyTitle: string;
    familyPhoto: string;
    services: Entry[];
    fleetTitle: string;
    fleetLead: string;
    fleetPhoto: string;
    reviewsTitle: string;
    reviewsNote: string;
    reviews: { name: string; text: string }[];
    finalTitle: string;
    finalLead: string;
    finalBook: string;
  };
  routes: {
    h1: string;
    lead: string;
    see: string;
    askQuote: string;
    otherLead: string;
    otherLink: string;
    /** One strapline per route page, keyed by slug. */
    descriptions: Record<string, string>;
  };
  routeDetail: {
    breadcrumb: string;
    h1: string;
    lead: Record<string, string>;
    ctaBook: string;
    statDuration: string;
    statDistance: string;
    statHours: string;
    statHoursValue: string;
    statPrice: string;
    statPriceValue: string;
    howTitle: string;
    stepPickupTitle: string;
    stepPickupAirport: string;
    stepPickupCity: string;
    stepDriveTitle: string;
    stepDrive: string;
    stepArrivalTitle: string;
    stepArrivalDisney: string;
    stepArrivalOther: string;
    stepReturnTitle: string;
    stepReturn: string;
    photo: string;
    priceBoxTitle: string;
    priceFactors: string[];
    priceBoxCta: string;
    tableTitle: string;
    faqTitle: string;
    faq: Question[];
  };
  prices: {
    h1: string;
    lead: string;
    departLabel: string;
    colPax: string;
    colOneWay: string;
    colRoundTrip: string;
    bookThis: string;
    noRoute: string;
    toursTitle: string;
    toursLead: string;
    tourCta: string;
    customBadge: string;
    customTitle: string;
    customLead: string;
    customWhatsapp: string;
    customForm: string;
    whatsappRoute: string;
    whatsappTour: string;
  };
  booking: {
    h1: string;
    lead: string;
    fromLabel: string;
    toLabel: string;
    dateLabel: string;
    timeLabel: string;
    paxLabel: string;
    bagsLabel: string;
    vehicleLabel: string;
    seatsLabel: string;
    flightLabel: string;
    flightPlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    messageLabel: string;
    tripLabel: string;
    oneWay: string;
    roundTrip: string;
    bagOptions: string[];
    seatOptions: string[];
    vehicleAdvise: string;
    otherPlace: string;
    submit: string;
    submitting: string;
    success: string;
    successLead: string;
    error: string;
    note: string;
    estimateLabel: string;
    estimateCustom: string;
    payTitle: string;
    payLead: string;
    payCta: string;
    paySkip: string;
    paySuccess: string;
    payCancelled: string;
    sidebarWhatsapp: string;
    sidebarWhatsappNote: string;
    sidebarPhoneNote: string;
    includedTitle: string;
    included: string[];
    required: string;
    invalidEmail: string;
  };
  about: {
    h1: string;
    lead: string;
    h2: string;
    paragraphs: string[];
    editorNote: string;
    photo: string;
    stats: { value: string; label: string }[];
    ctaTitle: string;
    ctaLead: string;
    ctaContact: string;
    ctaBook: string;
  };
  faq: {
    h1: string;
    lead: string;
    items: Question[];
    moreTitle: string;
  };
  contact: {
    h1: string;
    lead: string;
    phoneTitle: string;
    phoneNote: string;
    whatsappTitle: string;
    whatsappNote: string;
    emailTitle: string;
    emailNote: string;
    ctaTitle: string;
    ctaLead: string;
    ctaBtn: string;
  };
  /**
   * Copy for the parts of the offer the admin manages itself: night
   * supplement, packages and paid add-ons.
   *
   * Only the surrounding wording is translated here. The package and add-on
   * names themselves are typed by the admin in one language and shown as-is in
   * all seven — there is no way to translate a string that does not exist yet
   * at build time.
   */
  pricing: {
    /** Pickup time field, the input the night rule depends on. */
    timeLabel: string;
    /** `{percent}`, `{start}`, `{end}`. */
    nightNote: string;
    /** Line item on an estimate, `{percent}`. */
    nightLine: string;
    baseLine: string;
    totalLine: string;
    packagesTitle: string;
    packagesLead: string;
    packageLabel: string;
    /** The "no package, price my route normally" option. */
    packageNone: string;
    /** `{pax}`. */
    packageUpTo: string;
    extrasTitle: string;
    extrasLead: string;
    /** Suffix on a per-unit add-on price, e.g. "10 € each". */
    extrasEach: string;
  };
  /**
   * Labels for grouping departure/arrival places: airports, cities,
   * castles/parks, and chauffeur-driven tours.
   */
  destinationKinds: {
    airport: string;
    city: string;
    castle: string;
    tours: string;
  };
  zones: Record<ZoneId, string>;
  vehicles: Record<VehicleId, { label: string; short: string; desc: string; pax: string; bags: string }>;
  tours: Record<TourId, { name: string; dur: string; desc: string }>;
  seo: {
    home: Seo;
    routes: Seo;
    prices: Seo;
    booking: Seo;
    about: Seo;
    faq: Seo;
    contact: Seo;
    /** `{from}` / `{to}` templates for the route pages. */
    routeDetail: Seo;
  };
};
