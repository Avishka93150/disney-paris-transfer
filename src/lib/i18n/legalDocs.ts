import type { Locale } from './config';
import type { Dictionary } from './types';

type Legal = Dictionary['legal'];

const UPDATED = '10 September 2026';

function pack(
  updated: string,
  terms: Legal['terms'],
  privacy: Legal['privacy'],
  cookies: Legal['cookies'],
): Legal {
  return { updated, terms, privacy, cookies };
}

const en = pack(
  `Last updated: ${UPDATED}`,
  {
    h1: 'Terms and conditions',
    lead: 'These terms govern bookings made with Disney Paris Transfers, an independent private chauffeur (VTC) service. By sending a quote request or paying a fare you accept them.',
    sections: [
      {
        title: '1. The service',
        paragraphs: [
          'Disney Paris Transfers provides private, non-shared chauffeur transfers between the Paris airports (CDG, Orly, Beauvais), central Paris, Disneyland Paris and other destinations shown on this website. We are not affiliated with The Walt Disney Company.',
          'A booking is a contract of carriage, not a shared shuttle. Only your party travels in the vehicle.',
        ],
      },
      {
        title: '2. Quotes and booking',
        paragraphs: [
          'Prices displayed on the site are estimates recalculated server-side when you submit. A connection missing from the rate grid is quoted by hand, usually within two hours.',
          'Your booking is confirmed when you receive our email (and, if you pay online, when Stripe confirms the payment). Please check names, flight numbers, dates and addresses as soon as you receive it.',
        ],
      },
      {
        title: '3. Price, extras and night hours',
        paragraphs: [
          'The fare includes tolls, luggage, meet-and-greet waiting time at airports and child seats requested at booking. Paid add-ons chosen on the form are extra. A night supplement may apply when the pickup falls inside the hours published in the admin settings.',
          'We never invent a price for a route that is not on the grid.',
        ],
      },
      {
        title: '4. Payment',
        paragraphs: [
          'You may pay on board (card or cash) or online by card when that option is switched on. Online payment is processed by Stripe; we do not store card numbers.',
          'A deposit, when offered, is stated before you pay. The balance is due to the driver.',
        ],
      },
      {
        title: '5. Cancellation and changes',
        paragraphs: [
          'Free cancellation or a change of time up to 24 hours before the pickup. After that the fare may be charged in full, except where the law requires otherwise.',
          'Tell us as soon as a flight is delayed: we track published flight numbers and wait at no extra charge when we have the number.',
        ],
      },
      {
        title: '6. Passenger duties',
        paragraphs: [
          'Provide a reachable phone number, the correct terminal or address, and the ages of children if a seat is needed. Seatbelts must be worn. Child seats are free when requested in advance.',
          'We may refuse a passenger who is violent, unsafe or whose luggage cannot be carried legally.',
        ],
      },
      {
        title: '7. Liability',
        paragraphs: [
          'The chauffeur holds the licences and insurance required for VTC work in France. Liability for the journey follows that insurance and applicable transport law. We are not liable for delays caused by traffic, weather, strikes or airport queues beyond our control.',
        ],
      },
      {
        title: '8. Law',
        paragraphs: [
          'These terms are governed by French law. The consumer-mediation and court rules that apply to a customer in the EU remain available.',
        ],
      },
    ],
  },
  {
    h1: 'Privacy policy',
    lead: 'This policy explains how Disney Paris Transfers processes personal data when you use the website or book a transfer, in line with the GDPR.',
    sections: [
      {
        title: '1. Who is responsible',
        paragraphs: [
          'The data controller is the operator of disneyparistransfers.com. Contact: the email address published on the site (NEXT_PUBLIC_EMAIL / contact form).',
        ],
      },
      {
        title: '2. What we collect',
        paragraphs: [
          'When you book: name, email, phone, pickup and drop-off, date and time, passenger count, luggage, vehicle preference, child seats, flight number, message, language, and the price breakdown we calculated.',
          'When you pay online: Stripe processes the card. We store the payment status, amount and Stripe session id — not the card number.',
          'Technically: a language cookie, an admin session cookie (back office only), and the IP used for anti-spam rate limiting on the booking API.',
        ],
      },
      {
        title: '3. Why we use it',
        paragraphs: [
          'To provide the transfer (contract), to email confirmations, to prevent spam (legitimate interest), and to meet accounting and legal duties. We do not sell your data.',
        ],
      },
      {
        title: '4. How long we keep it',
        paragraphs: [
          'Bookings are kept for the time needed to run the journey and for the statutory accounting period in France. Spam logs are short-lived and reset when the server restarts unless moved to a store.',
        ],
      },
      {
        title: '5. Your rights',
        paragraphs: [
          'You may access, correct, delete or limit your data, object to processing based on legitimate interest, and lodge a complaint with the CNIL (cnil.fr). Write to us using the contact email on this site.',
        ],
      },
      {
        title: '6. Transfers',
        paragraphs: [
          'Hosting is on a classic Node server chosen by the operator. Stripe (payments) and the mailbox provider (SMTP) act as processors. They may process data outside the EU under their own safeguards (SCCs).',
        ],
      },
    ],
  },
  {
    h1: 'Cookie policy',
    lead: 'This site uses a small number of cookies so it can remember your language and keep the admin signed in. We do not run advertising cookies.',
    sections: [
      {
        title: '1. What is a cookie',
        paragraphs: [
          'A cookie is a small file stored by your browser. You can delete or block cookies in the browser settings; essential cookies may then stop the language choice or the admin login from working.',
        ],
      },
      {
        title: '2. Cookies we set',
        paragraphs: [
          'dpt_locale — remembers the language you picked (up to 12 months). Essential for a multilingual site.',
          'dpt_admin — HTTP-only session cookie for the back office, 12 hours. Never set for ordinary visitors.',
          'dpt_cookies — stores that you have seen this notice.',
        ],
      },
      {
        title: '3. Third parties',
        paragraphs: [
          'If you pay online, Stripe may set its own cookies on checkout.stripe.com. We do not embed Google Analytics or advertising pixels by default.',
        ],
      },
      {
        title: '4. Your choice',
        paragraphs: [
          'The banner on the first visit records that you have read this policy. Continuing to browse with the language cookie is required to serve the page in your language. See also the privacy policy.',
        ],
      },
    ],
  },
);

const fr = pack(
  `Dernière mise à jour : ${UPDATED}`,
  {
    h1: 'Conditions générales',
    lead: 'Ces conditions s’appliquent aux réservations auprès de Disney Paris Transfers, service VTC indépendant. En envoyant une demande ou en payant une course, vous les acceptez.',
    sections: [
      {
        title: '1. Le service',
        paragraphs: [
          'Disney Paris Transfers assure des transferts privés (non partagés) entre les aéroports parisiens (CDG, Orly, Beauvais), Paris, Disneyland Paris et les autres destinations affichées. Service indépendant, non affilié à The Walt Disney Company.',
          'Une réservation est un contrat de transport privé : seul votre groupe voyage dans le véhicule.',
        ],
      },
      {
        title: '2. Devis et réservation',
        paragraphs: [
          'Les prix affichés sont des estimations recalculées côté serveur à l’envoi. Une liaison absente de la grille est chiffrée à la main, en général sous deux heures.',
          'La réservation est confirmée à la réception de notre e-mail (et, en cas de paiement en ligne, à la confirmation Stripe). Vérifiez noms, vol, dates et adresses dès réception.',
        ],
      },
      {
        title: '3. Prix, options et horaires de nuit',
        paragraphs: [
          'Le tarif inclut péages, bagages, attente d’accueil à l’aéroport et sièges enfants demandés à la réservation. Les options payantes du formulaire s’ajoutent. Un supplément nuit peut s’appliquer selon les horaires publiés.',
          'Nous n’inventons jamais un prix pour une liaison hors grille.',
        ],
      },
      {
        title: '4. Paiement',
        paragraphs: [
          'Paiement à bord (carte ou espèces) ou en ligne lorsque l’option est activée. Le paiement en ligne passe par Stripe ; nous ne stockons pas les numéros de carte.',
          'Un acompte, s’il est proposé, est indiqué avant le paiement. Le solde est dû au chauffeur.',
        ],
      },
      {
        title: '5. Annulation et modifications',
        paragraphs: [
          'Annulation ou changement d’horaire gratuits jusqu’à 24 h avant la prise en charge. Au-delà, la course peut être facturée, sauf obligation légale contraire.',
          'Prévenez-nous d’un retard de vol : nous suivons le numéro de vol et attendons sans supplément lorsqu’il nous a été communiqué.',
        ],
      },
      {
        title: '6. Obligations du passager',
        paragraphs: [
          'Indiquez un téléphone joignable, le bon terminal ou la bonne adresse, et l’âge des enfants si un siège est nécessaire. La ceinture est obligatoire. Les sièges enfants sont gratuits s’ils sont demandés à l’avance.',
        ],
      },
      {
        title: '7. Responsabilité',
        paragraphs: [
          'Le chauffeur dispose des licences et assurances VTC. La responsabilité du trajet suit cette assurance et le droit des transports. Nous ne sommes pas responsables des retards dus au trafic, à la météo, aux grèves ou aux files aéroportuaires hors de notre contrôle.',
        ],
      },
      {
        title: '8. Droit applicable',
        paragraphs: [
          'Droit français. Les voies de médiation et les tribunaux ouverts au consommateur dans l’UE restent disponibles.',
        ],
      },
    ],
  },
  {
    h1: 'Politique de confidentialité',
    lead: 'Cette politique décrit le traitement des données personnelles lorsque vous utilisez le site ou réservez un transfert, conformément au RGPD.',
    sections: [
      {
        title: '1. Responsable',
        paragraphs: [
          'Le responsable de traitement est l’exploitant de disneyparistransfers.com. Contact : l’e-mail publié sur le site.',
        ],
      },
      {
        title: '2. Données collectées',
        paragraphs: [
          'À la réservation : nom, e-mail, téléphone, départ et arrivée, date et heure, passagers, bagages, véhicule, sièges enfants, numéro de vol, message, langue, et le détail du prix calculé.',
          'En paiement en ligne : Stripe traite la carte. Nous enregistrons le statut, le montant et l’identifiant de session — pas le numéro de carte.',
          'Techniquement : cookie de langue, cookie de session admin (back-office uniquement), et l’IP pour le anti-spam de l’API de réservation.',
        ],
      },
      {
        title: '3. Finalités',
        paragraphs: [
          'Exécuter le transfert (contrat), envoyer les confirmations, limiter le spam (intérêt légitime), et respecter les obligations comptables. Nous ne vendons pas vos données.',
        ],
      },
      {
        title: '4. Durée',
        paragraphs: [
          'Les dossiers sont conservés le temps du trajet puis pour la durée comptable légale en France.',
        ],
      },
      {
        title: '5. Vos droits',
        paragraphs: [
          'Accès, rectification, effacement, limitation, opposition, réclamation auprès de la CNIL (cnil.fr). Écrivez-nous via l’e-mail de contact du site.',
        ],
      },
      {
        title: '6. Prestataires',
        paragraphs: [
          'Hébergement Node classique, Stripe (paiement) et le prestataire SMTP. Des transferts hors UE peuvent avoir lieu sous leurs clauses types.',
        ],
      },
    ],
  },
  {
    h1: 'Politique des cookies',
    lead: 'Ce site n’utilise que quelques cookies : langue, session admin, et le souvenir de ce bandeau. Pas de cookies publicitaires.',
    sections: [
      {
        title: '1. Qu’est-ce qu’un cookie',
        paragraphs: [
          'Petit fichier déposé par le navigateur. Vous pouvez le supprimer dans les réglages ; les cookies essentiels servent à la langue et à la connexion admin.',
        ],
      },
      {
        title: '2. Cookies déposés',
        paragraphs: [
          'dpt_locale — langue choisie (12 mois).',
          'dpt_admin — session HTTP-only du back-office, 12 h. Jamais pour un visiteur public.',
          'dpt_cookies — mémorise que vous avez vu ce bandeau.',
        ],
      },
      {
        title: '3. Tiers',
        paragraphs: [
          'Si vous payez en ligne, Stripe peut déposer ses cookies sur checkout.stripe.com. Pas d’Analytics ni de publicité par défaut.',
        ],
      },
      {
        title: '4. Votre choix',
        paragraphs: [
          'Le bandeau enregistre que vous avez lu cette politique. Le cookie de langue est nécessaire pour afficher le site dans votre langue. Voir aussi la confidentialité.',
        ],
      },
    ],
  },
);

function fromEnglish(updated: string, t: (s: string) => string): Legal {
  return {
    updated,
    terms: {
      h1: t(en.terms.h1),
      lead: t(en.terms.lead),
      sections: en.terms.sections.map((s) => ({
        title: t(s.title),
        paragraphs: s.paragraphs.map(t),
      })),
    },
    privacy: {
      h1: t(en.privacy.h1),
      lead: t(en.privacy.lead),
      sections: en.privacy.sections.map((s) => ({
        title: t(s.title),
        paragraphs: s.paragraphs.map(t),
      })),
    },
    cookies: {
      h1: t(en.cookies.h1),
      lead: t(en.cookies.lead),
      sections: en.cookies.sections.map((s) => ({
        title: t(s.title),
        paragraphs: s.paragraphs.map(t),
      })),
    },
  };
}

/** Full originals for EN/FR; other locales keep the English legal text (operator can replace). */
export const legalDocs: Record<Locale, Legal> = {
  en,
  fr,
  es: fromEnglish(`Última actualización: ${UPDATED}`, (s) => s),
  it: fromEnglish(`Ultimo aggiornamento: ${UPDATED}`, (s) => s),
  de: pack(
    `Zuletzt aktualisiert: ${UPDATED}`,
    {
      h1: 'Allgemeine Geschäftsbedingungen',
      lead: 'Diese Bedingungen gelten für Buchungen bei Disney Paris Transfers, einem unabhängigen Mietwagen-Service mit Fahrer (VTC). Mit einer Anfrage oder Zahlung erkennen Sie sie an.',
      sections: [
        {
          title: '1. Leistung',
          paragraphs: [
            'Disney Paris Transfers führt private, nicht geteilte Transfers zwischen den Pariser Flughäfen (CDG, Orly, Beauvais), Paris, Disneyland Paris und den auf der Website genannten Zielen durch. Keine Verbindung zur Walt Disney Company.',
            'Eine Buchung ist ein privater Beförderungsvertrag: nur Ihre Gruppe fährt im Fahrzeug.',
          ],
        },
        {
          title: '2. Angebot und Buchung',
          paragraphs: [
            'Angezeigte Preise werden beim Absenden serverseitig neu berechnet. Verbindungen außerhalb der Preistabelle werden in der Regel innerhalb von zwei Stunden manuell angeboten.',
            'Die Buchung gilt mit unserer E-Mail als bestätigt (und bei Online-Zahlung mit der Stripe-Bestätigung). Prüfen Sie Namen, Flugnummer, Datum und Adressen sofort.',
          ],
        },
        {
          title: '3. Preis, Extras und Nachtzeiten',
          paragraphs: [
            'Im Fahrpreis enthalten: Maut, Gepäck, Begrüßungszeit am Flughafen und bei Buchung angegebene Kindersitze. Bezahlte Extras kommen hinzu. Ein Nachtzuschlag kann in den veröffentlichten Stunden anfallen.',
          ],
        },
        {
          title: '4. Zahlung',
          paragraphs: [
            'Zahlung im Fahrzeug (Karte oder bar) oder online, wenn die Option aktiv ist. Online-Zahlungen laufen über Stripe; wir speichern keine Kartennummern.',
          ],
        },
        {
          title: '5. Stornierung',
          paragraphs: [
            'Kostenlose Stornierung oder Zeitänderung bis 24 Stunden vor der Abholung. Danach kann der Fahrpreis fällig werden, soweit das Gesetz nichts anderes verlangt.',
          ],
        },
        {
          title: '6. Pflichten der Fahrgäste',
          paragraphs: [
            'Erreichbare Telefonnummer, richtiges Terminal bzw. Adresse, Alter der Kinder bei Sitzbedarf. Gurte sind Pflicht. Kindersitze sind kostenlos, wenn sie vorab angefragt werden.',
          ],
        },
        {
          title: '7. Haftung',
          paragraphs: [
            'Der Fahrer verfügt über die für VTC in Frankreich erforderlichen Lizenzen und Versicherungen. Haftung folgt dieser Versicherung und dem Beförderungsrecht.',
          ],
        },
        {
          title: '8. Recht',
          paragraphs: [
            'Es gilt französisches Recht. EU-Verbraucherrechte und Mediation bleiben unberührt.',
          ],
        },
      ],
    },
    {
      h1: 'Datenschutz',
      lead: 'Diese Erklärung beschreibt die Verarbeitung personenbezogener Daten nach der DSGVO, wenn Sie die Website nutzen oder einen Transfer buchen.',
      sections: [
        {
          title: '1. Verantwortlicher',
          paragraphs: [
            'Verantwortlich ist der Betreiber von disneyparistransfers.com. Kontakt: die auf der Website veröffentlichte E-Mail.',
          ],
        },
        {
          title: '2. Welche Daten',
          paragraphs: [
            'Bei der Buchung: Name, E-Mail, Telefon, Start und Ziel, Datum und Uhrzeit, Personen, Gepäck, Fahrzeug, Kindersitze, Flugnummer, Nachricht, Sprache und die Preisaufstellung.',
            'Bei Online-Zahlung verarbeitet Stripe die Karte. Wir speichern Status, Betrag und Session-ID — nicht die Kartennummer.',
          ],
        },
        {
          title: '3. Zwecke',
          paragraphs: [
            'Durchführung des Transfers (Vertrag), Bestätigungsmails, Spam-Schutz (berechtigtes Interesse), Buchhaltung. Kein Verkauf von Daten.',
          ],
        },
        {
          title: '4. Speicherdauer',
          paragraphs: ['So lange wie für Fahrt und gesetzliche Aufbewahrung in Frankreich nötig.'],
        },
        {
          title: '5. Ihre Rechte',
          paragraphs: [
            'Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Beschwerde bei einer Aufsichtsbehörde. Schreiben Sie uns über die Kontakt-E-Mail.',
          ],
        },
        {
          title: '6. Auftragsverarbeiter',
          paragraphs: ['Node-Hosting, Stripe und der SMTP-Anbieter.'],
        },
      ],
    },
    {
      h1: 'Cookie-Richtlinie',
      lead: 'Wir setzen nur wenige Cookies: Sprache, Admin-Sitzung und diesen Hinweis. Keine Werbe-Cookies.',
      sections: [
        {
          title: '1. Was ist ein Cookie',
          paragraphs: [
            'Eine kleine Datei im Browser. Sie können Cookies löschen; essenzielle Cookies braucht die Sprachwahl und der Admin-Login.',
          ],
        },
        {
          title: '2. Gesetzte Cookies',
          paragraphs: [
            'dpt_locale — gewählte Sprache (12 Monate).',
            'dpt_admin — HTTP-only Admin-Sitzung, 12 Stunden.',
            'dpt_cookies — speichert, dass Sie diesen Hinweis gesehen haben.',
          ],
        },
        {
          title: '3. Dritte',
          paragraphs: [
            'Bei Online-Zahlung kann Stripe Cookies auf checkout.stripe.com setzen. Standardmäßig kein Analytics und keine Werbung.',
          ],
        },
        {
          title: '4. Ihre Wahl',
          paragraphs: [
            'Das Banner dokumentiert, dass Sie diese Richtlinie gelesen haben. Das Sprach-Cookie ist nötig, um die Seite in Ihrer Sprache zu zeigen.',
          ],
        },
      ],
    },
  ),
  pt: pack(
    `Última atualização: ${UPDATED}`,
    {
      h1: 'Termos e condições',
      lead: 'Estes termos aplicam-se às reservas na Disney Paris Transfers, serviço VTC independente. Ao enviar um pedido ou pagar uma viagem, aceita-os.',
      sections: [
        {
          title: '1. O serviço',
          paragraphs: [
            'A Disney Paris Transfers realiza transfers privados (não partilhados) entre os aeroportos de Paris (CDG, Orly, Beauvais), Paris, Disneyland Paris e os destinos indicados no site. Serviço independente, sem ligação à The Walt Disney Company.',
          ],
        },
        {
          title: '2. Orçamento e reserva',
          paragraphs: [
            'Os preços apresentados são estimativas recalculadas no servidor. Uma ligação fora da grelha é orçamentada à mão, em geral em duas horas.',
            'A reserva confirma-se com o nosso e-mail (e, no pagamento online, com a confirmação Stripe).',
          ],
        },
        {
          title: '3. Preço e suplemento noturno',
          paragraphs: [
            'O preço inclui portagens, bagagem, espera no aeroporto e cadeiras de criança pedidas na reserva. Extras pagos somam-se. Pode aplicar-se suplemento noturno.',
          ],
        },
        {
          title: '4. Pagamento',
          paragraphs: [
            'Pagamento a bordo (cartão ou numerário) ou online quando a opção estiver ativa. O Stripe trata o cartão; não guardamos o número.',
          ],
        },
        {
          title: '5. Cancelamento',
          paragraphs: [
            'Cancelamento ou alteração gratuitos até 24 horas antes. Depois, a viagem pode ser cobrada, salvo lei em contrário.',
          ],
        },
        {
          title: '6. Deveres do passageiro',
          paragraphs: [
            'Telefone contactável, terminal ou morada corretos, idades das crianças se for preciso cadeira. Cintos obrigatórios.',
          ],
        },
        {
          title: '7. Responsabilidade',
          paragraphs: [
            'O motorista tem as licenças e seguros VTC em França. A responsabilidade segue esse seguro e o direito dos transportes.',
          ],
        },
        {
          title: '8. Lei',
          paragraphs: ['Lei francesa. Os direitos do consumidor na UE mantêm-se.'],
        },
      ],
    },
    {
      h1: 'Política de privacidade',
      lead: 'Esta política descreve o tratamento de dados pessoais ao usar o site ou reservar um transfer, em conformidade com o RGPD.',
      sections: [
        {
          title: '1. Responsável',
          paragraphs: ['O responsável é o operador de disneyparistransfers.com. Contacto: o e-mail publicado no site.'],
        },
        {
          title: '2. Dados recolhidos',
          paragraphs: [
            'Na reserva: nome, e-mail, telefone, origem e destino, data e hora, passageiros, bagagem, veículo, cadeiras, voo, mensagem, língua e o detalhe do preço.',
            'No pagamento online o Stripe trata o cartão. Guardamos estado, montante e id de sessão — não o número do cartão.',
          ],
        },
        {
          title: '3. Finalidades',
          paragraphs: ['Executar o transfer (contrato), confirmações, anti-spam e contabilidade. Não vendemos dados.'],
        },
        {
          title: '4. Conservação',
          paragraphs: ['Pelo tempo da viagem e o prazo contabilístico legal em França.'],
        },
        {
          title: '5. Os seus direitos',
          paragraphs: ['Acesso, retificação, apagamento, limitação, oposição e reclamação a uma autoridade de controlo.'],
        },
        {
          title: '6. Subcontratantes',
          paragraphs: ['Alojamento Node, Stripe e o fornecedor SMTP.'],
        },
      ],
    },
    {
      h1: 'Política de cookies',
      lead: 'Usamos poucos cookies: língua, sessão de administração e este aviso. Sem cookies publicitários.',
      sections: [
        {
          title: '1. O que é um cookie',
          paragraphs: ['Pequeno ficheiro no browser. Pode apagá-lo nas definições; os essenciais servem a língua e o login admin.'],
        },
        {
          title: '2. Cookies definidos',
          paragraphs: [
            'dpt_locale — língua escolhida (12 meses).',
            'dpt_admin — sessão HTTP-only do back-office, 12 horas.',
            'dpt_cookies — memoriza que viu este aviso.',
          ],
        },
        {
          title: '3. Terceiros',
          paragraphs: ['No pagamento online o Stripe pode definir cookies em checkout.stripe.com. Sem Analytics por omissão.'],
        },
        {
          title: '4. A sua escolha',
          paragraphs: ['A faixa regista que leu esta política. O cookie de língua é necessário para mostrar o site no seu idioma.'],
        },
      ],
    },
  ),
  ru: fromEnglish(`Дата обновления: ${UPDATED}`, (s) => s),
  zh: fromEnglish(`最近更新：${UPDATED}`, (s) => s),
  ja: fromEnglish(`最終更新：${UPDATED}`, (s) => s),
};
