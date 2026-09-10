import type { Dictionary } from '../types';
import { legalDocs } from '../legalDocs';

export const pt: Dictionary = {
  common: {
    brand: 'Disney Paris',
    brandAccent: 'Transfers',
    tagline: 'Motorista particular · Paris',
    langLabel: 'Idioma',
    menu: 'Menu',
    book: 'Reservar',
    bookTransfer: 'Reservar o meu transfer',
    whatsappQuote: 'Orçamento imediato no WhatsApp',
    callNow: 'Ligar agora',
    writeWhatsapp: 'Mensagem no WhatsApp',
    approx: '≈',
    minutes: 'min',
    hour: 'h',
    km: 'km',
    from: 'desde',
    quoteOnly: 'Sob consulta',
    perDay: 'Dia inteiro',
    availability: '7 dias por semana · 24 h',
    replyUnder2h: 'resposta em 2 horas',
    skipToContent: 'Saltar para o conteúdo',
  },
  nav: {
    home: 'Início',
    routes: 'Transfers',
    prices: 'Preços',
    about: 'Sobre nós',
    faq: 'FAQ',
    contact: 'Contacto',
    parisTransfers: 'Transfers Paris',
    disneyTransfers: 'Transfers Disneyland',
    viewAll: 'Ver todos os transfers',
    more: 'Mais',
    groups: {
      airports: 'Transfers aeroportos de Paris',
      city: 'Paris e arredores',
      disney: 'Transfers Disneyland Paris',
      versailles: 'Transfers Versalhes',
    },
  },
  footer: {
    blurb:
      'Motorista particular em Paris, especializado em transfers de aeroporto e Disneyland® Paris. Berlins e vans premium, seguimento de voo, receção personalizada, cadeiras de criança gratuitas.',
    disclaimer: 'Serviço independente, sem ligação à The Walt Disney Company.',
    colRoutes: 'Transfers',
    colSite: 'O site',
    colContact: 'Contacto',
    whatsappLine: 'WhatsApp — resposta rápida',
    booking: 'Reserva',
    rights: '© 2026 disneyparistransfers.com — Todos os direitos reservados',
    seoLine: 'Motorista em Paris · Transfers aeroporto CDG, Orly, Beauvais · Disneyland Paris',
    colLegal: 'Informação legal',
    terms: 'Termos',
    privacy: 'Privacidade',
    cookies: 'Cookies',
  },
  home: {
    badge: 'Especialistas em transfers para a Disneyland® Paris',
    h1: 'O seu motorista particular entre os aeroportos de Paris e a Disneyland Paris',
    lead: 'Transfers a partir de CDG, Orly, Beauvais e Paris num berlin ou van premium. Seguimos o voo, recebemos com placa e oferecemos cadeiras de criança — as férias começam no aeroporto.',
    ctaPrimary: 'Reservar o meu transfer',
    ctaSecondary: 'Orçamento imediato no WhatsApp',
    perks: ['Cancelamento gratuito', 'Seguimento de voo', 'Pagamento com cartão a bordo', '24 h, todo o ano'],
    calc: {
      title: 'O seu preço, em direto',
      fromLabel: 'De',
      toLabel: 'Para',
      paxLabel: 'Passageiros',
      tripLabel: 'Viagem',
      oneWay: 'Ida',
      roundTrip: 'Ida e volta',
      vehicleLabel: 'Veículo',
      roundTripSuffix: ' · ida e volta',
      priceNote: 'Preço fixo — portagens, bagagem e cadeiras de criança incluídas',
      confirmWhatsapp: 'Confirmar no WhatsApp',
      book: 'Reservar',
      samePlace: 'Escolha dois locais diferentes',
      custom: 'Percurso à medida — resposta em 2 horas',
      loading: 'A calcular o preço…',
      whatsappMessage:
        'Olá, gostaria de reservar: {from} → {to}, {pax} passageiro(s), {vehicle}, {trip}.',
    },
    routesTitle: 'Os transfers mais pedidos',
    routesLead: 'Preço fixo confirmado na reserva, consoante passageiros, bagagem e veículo.',
    seeRoute: 'Ver este transfer →',
    excursionsCard: {
      title: 'Passeios de um dia: Versalhes, Mont-Saint-Michel…',
      duration: 'Dia inteiro',
      note: 'Orçamento em 2 h',
    },
    stepsTitle: 'Reservar é simples',
    steps: [
      {
        title: 'Peça o seu orçamento',
        text: 'Por formulário, WhatsApp ou telefone. Resposta em minutos, com preço fixo garantido.',
      },
      {
        title: 'Esperamos por si',
        text: 'O motorista segue o voo e recebe-o com placa, mesmo em caso de atraso.',
      },
      {
        title: 'Aproveite a viagem',
        text: 'Água fresca, carregadores, cadeiras já instaladas. Pague com cartão ou numerário a bordo.',
      },
    ],
    familyTitle: 'Pensado para famílias',
    familyPhoto: 'foto: interior do veículo / cadeiras de criança',
    services: [
      {
        title: 'Seguimento de voo',
        text: 'o motorista ajusta a hora de recolha se o voo atrasar, sem custo extra.',
      },
      {
        title: 'Receção com placa',
        text: 'no desembarque, placa na mão, ajuda com a bagagem incluída.',
      },
      {
        title: 'Cadeiras de criança gratuitas',
        text: 'ovo, cadeira ou banco elevatório, instalados antes de aterrar.',
      },
      {
        title: 'Pagamento flexível',
        text: 'cartão a bordo, numerário ou ligação de pagamento — à sua escolha.',
      },
      {
        title: 'Cancelamento gratuito',
        text: 'até 24 horas antes do transfer, sem justificação.',
      },
      {
        title: 'Conforto a bordo',
        text: 'água fresca, carregadores, wifi, motorista de português, inglês e francês.',
      },
    ],
    fleetTitle: 'Uma frota à medida do grupo',
    fleetLead:
      'A tarifa depende do veículo, do número de passageiros e da bagagem — diga-nos tudo no pedido de orçamento.',
    fleetPhoto: 'foto: {vehicle}',
    reviewsTitle: 'Viajaram connosco',
    reviewsNote: '— your Google / TripAdvisor reviews will appear here —',
    reviews: [
      {
        name: '— Avaliação Google n.º 1',
        text: 'Placeholder: paste a genuine customer review here (Google or TripAdvisor).',
      },
      {
        name: '— Avaliação Google n.º 2',
        text: 'Placeholder: paste a genuine customer review here (Google or TripAdvisor).',
      },
      {
        name: '— TripAdvisor review no. 1',
        text: 'Placeholder: paste a genuine customer review here (Google or TripAdvisor).',
      },
    ],
    finalTitle: 'Pronto para a magia? Reserve o seu transfer.',
    finalLead: 'Orçamento gratuito, sem compromisso, resposta em minutos.',
    finalBook: 'Reservar online',
  },
  routes: {
    h1: 'Todos os transfers',
    lead: 'Transfers privados entre os aeroportos de Paris, o centro e a Disneyland Paris. Preço fixo confirmado no orçamento, consoante passageiros, bagagem e veículo.',
    see: 'Ver este transfer',
    askQuote: 'Pedir orçamento',
    otherLead: 'Outro destino?',
    otherLink: 'Pergunte-nos no WhatsApp — cobrimos toda a Île-de-France.',
    descriptionTemplate:
      'Motorista particular entre {from} e {to}. Tarifa fixa, receção com placa, cadeiras de criança incluídas.',
    descriptions: {
      'cdg-disneyland':
        'O nosso transfer mais pedido. Receção no desembarque e entrega direta no hotel Disney ou parceiro.',
      'orly-disneyland':
        'Recolha em Orly 1-2-3-4 e percurso direto pela A86 e A4 até Marne-la-Vallée.',
      'beauvais-disneyland':
        'Evite os dois shuttles e o RER: viagem direta porta a porta desde Beauvais-Tillé.',
      'paris-disneyland':
        'Do seu hotel ou morada em Paris até aos parques ou hotéis Disney, à hora que lhe convier.',
      'cdg-paris':
        'Transfer privado entre Roissy e a sua morada em Paris, sem filas nem surpresas.',
      'orly-paris': 'Recolha em Orly e entrega à porta do hotel ou da morada em Paris.',
      'paris-beauvais':
        'Partida da sua morada em Paris, entrega à porta do terminal de Beauvais-Tillé.',
      'paris-versailles':
        'Palácio de Versalhes, visita a Paris, aluguer à hora ou ao dia com o seu motorista.',
    },
  },
  routeDetail: {
    breadcrumb: 'Transfers',
    h1: 'Transfer com motorista particular {from} ↔ {to}',
    leadTemplate:
      'Transfer privado porta a porta entre {from} e {to}. O motorista segue o voo, recebe-o com placa e confirma um preço fixo antes da viagem.',
    lead: {
      'cdg-disneyland':
        'Viagem direta entre Roissy Charles-de-Gaulle e os hotéis Disney em cerca de 45 minutos. O motorista segue o voo, recebe-o com placa e instala as cadeiras de criança antes de aterrar.',
      'orly-disneyland':
        'Ligação direta entre Orly e Marne-la-Vallée pela A86 e A4, cerca de 50 minutos. Recolha em Orly 1, 2, 3 ou 4, sem transbordos nem espera.',
      'beauvais-disneyland':
        'Beauvais-Tillé fica a 120 km da Disneyland: um transfer privado poupa-lhe o shuttle, a estação e o RER — uma viagem porta a porta.',
      'paris-disneyland':
        'Do seu hotel em Paris até aos parques ou hotéis Disney em cerca de 45 minutos, à hora que escolher, com bagagem e carrinhos a bordo.',
      'cdg-paris':
        'Transfer privado entre Roissy Charles-de-Gaulle e a sua morada em Paris, com receção no desembarque e preço fixo na reserva.',
      'orly-paris':
        'Transfer privado entre Orly e Paris, a qualquer hora, sem filas nem suplementos de última hora.',
      'paris-beauvais':
        'Partida da sua morada em Paris, entrega à porta do terminal de Beauvais-Tillé, com horário calculado para o voo.',
      'paris-versailles':
        'Ida e volta ou aluguer à hora entre Paris e o Palácio de Versalhes, com um motorista que espera durante a visita.',
    },
    ctaBook: 'Reservar este transfer',
    livePriceTitle: 'O seu preço, em direto',
    relatedTitle: 'Outros transfers',
    imageAlt: 'Transfer com motorista particular de {from} para {to}',
    statDuration: 'Duração',
    statDistance: 'Distância',
    statHours: 'Todos os voos, todos os terminais',
    statHoursValue: '24/7',
    statPrice: 'Confirmado no orçamento, sem surpresas',
    statPriceValue: 'Preço fixo',
    howTitle: 'Como funciona o seu transfer',
    stepPickupTitle: 'À chegada',
    stepPickupAirport:
      'o motorista segue o voo em tempo real. Adiantado ou atrasado, está lá na hora certa, sem custo extra. Espera no desembarque do terminal com uma placa.',
    stepPickupCity:
      'o motorista espera à porta do hotel ou da morada à hora combinada e avisa por SMS ou WhatsApp.',
    stepDriveTitle: 'No caminho',
    stepDrive:
      'ajuda com a bagagem, cadeiras já instaladas, água fresca e carregadores a bordo. Viagem direta, sem paragens nem desvios.',
    stepArrivalTitle: 'No destino',
    stepArrivalDisney:
      'entrega direta à porta do hotel Disney (Disneyland Hotel, Newport Bay Club, Sequoia Lodge, Cheyenne, Santa Fe, Davy Crockett Ranch) ou de um hotel parceiro em Val d’Europe e Magny-le-Hongre.',
    stepArrivalOther:
      'entrega na morada exata, à porta, com a bagagem levada até ao lobby.',
    stepReturnTitle: 'No regresso',
    stepReturn:
      'recolha à hora combinada, calculada para chegar ao terminal de partida sem pressa.',
    photo: 'foto: receção com placa',
    priceBoxTitle: 'A tarifa depende de:',
    priceFactors: [
      'Número de passageiros (1 a 8)',
      'Número e tamanho das malas',
      'Veículo: berlin, SUV, van ou premium',
    ],
    priceBoxCta: 'Obter o meu preço fixo',
    tableTitle: 'Tarifas {from} ↔ {to}',
    faqTitle: 'Perguntas frequentes — {from} ↔ {to}',
    faq: [
      {
        q: 'O que acontece se o voo atrasar?',
        a: 'Não tem de fazer nada: seguimos o número de voo em tempo real e ajustamos a recolha sem custo extra, mesmo à noite.',
      },
      {
        q: 'Onde encontro o motorista?',
        a: 'No desembarque do terminal, com placa. Recebe o número por SMS ou WhatsApp antes de aterrar.',
      },
      {
        q: 'As cadeiras de criança custam extra?',
        a: 'Não, são gratuitas. Indique as idades das crianças na reserva: ovo, cadeira ou banco elevatório serão instalados antes da chegada.',
      },
      {
        q: 'Como pago?',
        a: 'Com cartão a bordo, em numerário ou por ligação de pagamento antecipada — à sua escolha. O preço confirmado no orçamento é fixo, com portagens e espera incluídas.',
      },
      {
        q: 'É mesmo mais fácil do que o shuttle ou o RER?',
        a: 'Um transfer privado é porta a porta, sem várias paragens, sem transbordos com malas e carrinhos, e ajusta-se à hora do voo.',
      },
    ],
  },
  prices: {
    h1: 'Preços — fixos e transparentes',
    lead: 'Escolha o ponto de partida: cada preço por número de passageiros, ida ou ida e volta. Portagens, bagagem, espera e cadeiras de criança estão sempre incluídas.',
    departLabel: 'De:',
    colPax: 'Passageiros',
    colOneWay: 'Ida',
    colRoundTrip: 'Ida e volta',
    bookThis: 'Reservar este transfer',
    noRoute:
      'Não há percurso a partir deste ponto na grelha publicada — peça um orçamento, respondemos em 2 horas.',
    toursTitle: 'Passeios de um dia e motorista',
    toursLead:
      'Versalhes, Mont-Saint-Michel, castelos do Loire… Cada excursão é orçamentada à medida do grupo e dos planos — resposta garantida em 2 horas.',
    tourCta: 'Pedir orçamento →',
    customBadge: '⏱ Resposta em 2 h — 7 dias por semana',
    customTitle: 'Precisa de um orçamento à medida?',
    customLead:
      'Grupos com mais de 8, percurso fora da grelha, passeio à medida, aluguer à hora: diga-nos o que precisa e respondemos em menos de 2 horas.',
    customWhatsapp: 'Orçamento WhatsApp',
    customForm: 'Formulário de orçamento',
    whatsappRoute: 'Olá, gostaria de reservar: {from} → {to}.',
    whatsappTour: 'Olá, gostaria de um orçamento para a excursão {tour}.',
  },
  booking: {
    h1: 'Reserve o seu transfer',
    lead: 'Preencha o formulário e respondemos em minutos com um preço fixo garantido. Ainda mais rápido: WhatsApp ou telefone.',
    fromLabel: 'De',
    toLabel: 'Para',
    dateLabel: 'Data',
    timeLabel: 'Hora (voo ou recolha)',
    paxLabel: 'Passageiros',
    bagsLabel: 'Bagagem',
    vehicleLabel: 'Veículo preferido',
    seatsLabel: 'Cadeiras de criança',
    flightLabel: 'Número de voo (se aeroporto)',
    flightPlaceholder: 'ex. AF 1234',
    nameLabel: 'Nome completo',
    namePlaceholder: 'O seu nome',
    emailLabel: 'E-mail',
    emailPlaceholder: 'voce@email.com',
    phoneLabel: 'Telefone / WhatsApp',
    phonePlaceholder: '+44 …',
    messageLabel: 'Mensagem (morada exata, regresso, pedidos especiais…)',
    tripLabel: 'Tipo de viagem',
    oneWay: 'Ida',
    roundTrip: 'Ida e volta',
    bagOptions: ['0–2', '3–4', '5–6', '7 ou mais'],
    seatOptions: [
      'Nenhuma',
      'Ovo (0–12 meses)',
      'Cadeira (1–4 anos)',
      'Banco elevatório (4–10 anos)',
      'Várias (indique na mensagem)',
    ],
    vehicleAdvise: 'Aconselhem-me',
    otherPlace: 'Outro (indique na mensagem)',
    submit: 'Enviar o pedido de orçamento',
    submitting: 'A enviar…',
    success: 'Pedido enviado!',
    successLead: 'Entramos em contacto em breve com o preço fixo.',
    error: 'O envio falhou. Tente de novo ou contacte-nos no WhatsApp.',
    note: 'Orçamento gratuito, sem compromisso — resposta em 2 horas. Cancelamento gratuito até 24 horas antes do transfer.',
    estimateLabel: 'Estimativa deste transfer',
    estimateCustom: 'Percurso à medida — preço confirmado em 2 horas',
    payTitle: 'Pagar online agora',
    payLead:
      'Pode pagar o transfer com cartão já e garantir o horário. Caso contrário, paga a bordo.',
    payCta: 'Pagar {price} € com cartão',
    paySkip: 'Pago a bordo',
    paySuccess: 'Pagamento recebido — obrigado! O transfer está confirmado.',
    payCancelled: 'Pagamento anulado. O pedido continua guardado e pode pagar a bordo.',
    sidebarWhatsapp: 'WhatsApp',
    sidebarWhatsappNote: 'O caminho mais rápido — envie o percurso e receba o preço de imediato.',
    sidebarPhoneNote: '24 h, todo o ano — falamos português, inglês e francês.',
    includedTitle: 'Sempre incluído',
    included: [
      'Seguimento de voo e tempo de espera',
      'Receção com placa',
      'Cadeiras de criança gratuitas',
      'Portagens incluídas, preço fixo',
    ],
    required: 'Este campo é obrigatório.',
    invalidEmail: 'Endereço de e-mail inválido.',
    stepJourney: 'Percurso',
    stepParty: 'Passageiros',
    stepContact: 'Contacto',
    next: 'Continuar',
    back: 'Voltar',
    trustSeats: 'Cadeiras de criança gratuitas',
    trustFixed: 'Preço fixo, sem surpresas',
    trustHours: 'Serviço 24 h',
    noCard: 'Sem cartão para o orçamento',
    liveTitle: 'Tarifa estimada',
  },
  about: {
    h1: 'O seu motorista, não uma plataforma',
    lead: 'A Disney Paris Transfers é um serviço independente de motorista particular, especializado em viagens entre os aeroportos de Paris e a Disneyland Paris.',
    h2: 'Uma missão: tornar a viagem a parte mais fácil das férias',
    paragraphs: [
      'Motorista profissional com licença, autorização válida, veículos segurados e revistos. Conheço cada terminal de CDG e Orly, cada hotel Disney e os melhores percursos a qualquer hora.',
      'A maioria dos clientes são famílias que chegam de longe — por vezes após um voo longo, com crianças cansadas e muita bagagem. O meu trabalho é ter tudo pronto quando saem do avião: placa, cadeiras instaladas, mala grande e uma viagem calma até à magia.',
    ],
    editorNote:
      '✎ Substitua este texto pela sua apresentação: nome, anos de experiência, idiomas…',
    photo: 'foto: retrato do motorista',
    stats: [
      { value: '100%', label: 'Viagens seguradas, motorista com licença' },
      { value: '24/7', label: 'Disponível de dia e de noite' },
      { value: 'FR · EN', label: 'Motorista plurilingue' },
      { value: '€0', label: 'Sem taxas escondidas — preço fixo garantido' },
    ],
    ctaTitle: 'Vamos conhecer-nos',
    ctaLead: 'Uma pergunta, um percurso invulgar? Escreva-me — respondo pessoalmente.',
    ctaContact: 'Contactoar-me',
    ctaBook: 'Reservar um transfer',
  },
  faq: {
    h1: 'Perguntas frequentes',
    lead: 'Tudo o que importa saber antes de reservar o transfer aeroporto ↔ Disneyland Paris.',
    items: [
      {
        q: 'Como se calcula o preço do transfer?',
        a: 'O preço é fixo e confirmado antes da reserva. Depende dos passageiros, da bagagem e do veículo (berlin, SUV, van ou premium). Portagens, espera e cadeiras estão sempre incluídas.',
      },
      {
        q: 'O que acontece se o voo atrasar?',
        a: 'Seguimos o número de voo em tempo real. O motorista ajusta a recolha automaticamente, sem custo extra, mesmo à noite.',
      },
      {
        q: 'Onde encontro o motorista no aeroporto?',
        a: 'No desembarque do terminal, com placa. Recebe o número por SMS ou WhatsApp antes de aterrar.',
      },
      {
        q: 'Há cadeiras de criança?',
        a: 'Sim, gratuitas. Indique as idades na reserva: ovo, cadeira ou banco elevatório serão instalados antes da recolha.',
      },
      {
        q: 'Quantas pessoas e malas transportam?',
        a: 'Up to 4 passengers and 3 malas in a saloon, up to 8 passengers and 8 malas in a van. Pushchairs and equipment are welcome — mention them in your quote request.',
      },
      {
        q: 'Como pago?',
        a: 'Cartão a bordo, numerário ou ligação de pagamento antecipada. A maioria dos transfers não exige depósito.',
      },
      {
        q: 'Posso cancelar ou alterar a reserva?',
        a: 'Sim, gratuitamente até 24 horas antes do transfer. Contacte-nos no WhatsApp ou por telefone.',
      },
      {
        q: 'O motorista fala inglês?',
        a: 'Sim — português, francês e inglês. Recebemos regularmente famílias de todo o mundo a caminho da Disneyland Paris.',
      },
      {
        q: 'Servem todos os hotéis Disney e parceiros?',
        a: 'Sim: hotéis Disney (Disneyland Hotel, Newport Bay, Sequoia, Cheyenne, Santa Fe, Davy Crockett Ranch) e hotéis parceiros em Val d’Europe, Magny-le-Hongre, Bailly-Romainvilliers e Serris.',
      },
      {
        q: 'Fazem outros percursos além da Disney?',
        a: 'Sim: transfers CDG/Orly/Beauvais ↔ Paris, estações de Paris, passeios a Versalhes e aluguer à hora. Peça um orçamento.',
      },
      {
        q: 'Circulam à noite e em feriados?',
        a: 'Sim, 24 h todo o ano, incluindo voos muito cedo ou muito tarde. Reserve com antecedência para garantir disponibilidade.',
      },
    ],
    moreTitle: 'Outra pergunta?',
  },
  contact: {
    h1: 'Contacto',
    lead: 'Disponíveis 24 h, todo o ano — respondemos em minutos.',
    phoneTitle: 'Telefone',
    phoneNote: 'Chamada direta, 24 h todo o ano',
    whatsappTitle: 'WhatsApp',
    whatsappNote: 'A forma mais rápida de obter um orçamento',
    emailTitle: 'E-mail',
    emailNote: 'Resposta em poucas horas',
    ctaTitle: 'Precisa de um preço já?',
    ctaLead: 'O formulário de reserva dá-lhe um orçamento fixo em minutos.',
    ctaBtn: 'Pedir o meu orçamento',
  },
  pricing: {
    timeLabel: 'Hora de recolha',
    nightNote: 'Tarifa noturna: +{percent} % entre {start} e {end}',
    nightLine: 'Suplemento noturno (+{percent} %)',
    baseLine: 'Transfer',
    totalLine: 'Total estimado',
    packagesTitle: 'Pacotes',
    packagesLead: 'Ofertas a preço fixo, tudo incluído. Escolha um na reserva.',
    packageLabel: 'Pacote',
    packageNone: 'Sem pacote — calcular o percurso',
    packageUpTo: 'Até {pax} passageiros',
    extrasTitle: 'Extras opcionais',
    extrasLead: 'Acrescentados ao preço do transfer.',
    extrasEach: 'cada',
  },
  cookieBanner: {
    message:
      'Usamos poucos cookies essenciais (idioma, sessão de administração e este aviso). Sem cookies publicitários.',
    accept: 'Compreendi',
    more: 'Política de cookies',
  },
  legal: legalDocs.pt,
  destinationKinds: {
    airport: 'Aeroportos',
    city: 'Cidades',
    castle: 'Castelos e parques',
    tours: 'Passeios',
  },
  zones: {
    cdg: 'Aeroporto CDG',
    orly: 'Aeroporto de Orly',
    beauvais: 'Aeroporto de Beauvais',
    disney: 'Disneyland Paris',
    paris: 'Paris',
    versailles: 'Palácio de Versalhes',
    ladefense: 'La Défense',
    valeurope: 'Val d’Europe',
  },
  vehicles: {
    saloon: {
      label: 'Berlin',
      short: 'Berlin',
      desc: 'Ideal para um casal ou uma família pequena. Confortável e discreto.',
      pax: '1–4 passageiros',
      bags: '3 malas',
    },
    suv: {
      label: 'SUV',
      short: 'SUV',
      desc: 'Mais espaço para bagagem, com o mesmo conforto de um berlin.',
      pax: '1–4 passageiros',
      bags: '4 malas',
    },
    van: {
      label: 'Van',
      short: 'Van',
      desc: 'Perfeito para famílias maiores e grupos com carrinhos.',
      pax: '5–8 passageiros',
      bags: '8 malas',
    },
    premium: {
      label: 'Premium — Mercedes Classe E/S',
      short: 'Premium',
      desc: 'Para uma viagem de gama alta: pele, silêncio e serviço atento.',
      pax: '1–3 passageiros',
      bags: '3 malas',
    },
  },
  tours: {
    parisCityTour: {
      name: 'Tour de Paris',
      dur: '2 a 4 horas',
      desc: 'Tour privado pelos marcos: Torre Eiffel, Champs-Élysées, Louvre, Montmartre…',
    },
    versailles: {
      name: 'Palácio de Versalhes',
      dur: 'Meio dia',
      desc: 'Ida e volta ou aluguer à hora a partir de Paris ou Disneyland.',
    },
    montSaintMichel: {
      name: 'Mont Saint-Michel',
      dur: 'Dia inteiro',
      desc: 'Saída cedo, dia inteiro no local, regresso à noite.',
    },
    normandie: {
      name: 'Normandia e praias do Dia D',
      dur: 'Dia inteiro',
      desc: 'Omaha Bcada, o cemitério americano, Arromanches…',
    },
    loire: {
      name: 'Castelos do Loire',
      dur: 'Dia inteiro',
      desc: 'Chambord, Chenonceau, Amboise — um itinerário à sua medida.',
    },
    fontainebleau: {
      name: 'Fontainebleau',
      dur: 'Meio dia',
      desc: 'O palácio e a floresta de Fontainebleau, a partir de Paris ou Disney.',
    },
    giverny: {
      name: 'Giverny — jardins de Monet',
      dur: 'Meio dia',
      desc: 'Casa e jardins de Claude Monet (abril–outubro).',
    },
    parcAsterix: {
      name: 'Parc Astérix',
      dur: 'Transfer',
      desc: 'Ida ou ida e volta a partir de Paris, CDG ou Disney.',
    },
    valleeVillage: {
      name: 'La Vallée Village — compras',
      dur: 'Transfer',
      desc: 'Outlet de luxo a 5 minutos da Disneyland, com tempo de espera disponível.',
    },
  },
  seo: {
    home: {
      title: 'Transfer CDG ↔ Disneyland Paris — Motorista particular | Disney Paris Transfers',
      description:
        'Motorista particular para transfers entre CDG, Orly, Beauvais, Paris e Disneyland Paris. Preço fixo a partir de 70 €, seguimento de voo, receção, cadeiras de criança gratuitas. 24 h.',
    },
    routes: {
      title: 'Todos os transfers — aeroportos de Paris e Disneyland | Disney Paris Transfers',
      description:
        'CDG, Orly, Beauvais, Paris, Versalhes: todos os transfers privados para a Disneyland Paris e pela Île-de-France, com tempos, distâncias e preços fixos.',
    },
    prices: {
      title: 'Preços de transfer Paris e Disneyland — tarifas fixas | Disney Paris Transfers',
      description:
        'Lista completa por número de passageiros, ida e ida e volta. Portagens, bagagem e cadeiras incluídas. Passeios de um dia sob consulta, resposta em 2 horas.',
    },
    booking: {
      title: 'Reservar um transfer Paris ↔ Disneyland | Disney Paris Transfers',
      description:
        'Reserve o motorista particular em 2 minutos: orçamento gratuito com preço fixo, resposta em 2 horas, cancelamento gratuito até 24 horas antes.',
    },
    about: {
      title: 'Sobre nós — O seu motorista particular em Paris | Disney Paris Transfers',
      description:
        'Motorista independente com licença, especializado em transfers aeroporto ↔ Disneyland Paris. Veículos segurados, serviço em português, francês e inglês.',
    },
    faq: {
      title: 'FAQ — Transfers Disneyland Paris | Disney Paris Transfers',
      description:
        'Voos atrasados, cadeiras de criança, pagamento, cancelamento, bagagem: todas as respostas antes de reservar o transfer aeroporto ↔ Disneyland Paris.',
    },
    contact: {
      title: 'Contactoo — Motorista particular em Paris | Disney Paris Transfers',
      description:
        'Contactoe-nos 24 h por telefone, WhatsApp ou e-mail para o transfer entre os aeroportos de Paris e a Disneyland Paris.',
    },
    terms: {
      title: 'Termos e condições | Disney Paris Transfers',
      description:
        'Condições de reserva da Disney Paris Transfers: orçamentos, pagamento, cancelamento, suplemento noturno e deveres do passageiro.',
    },
    privacy: {
      title: 'Política de privacidade | Disney Paris Transfers',
      description:
        'Como a Disney Paris Transfers recolhe, guarda e usa dados pessoais para reservas, e-mails e pagamentos.',
    },
    cookies: {
      title: 'Política de cookies | Disney Paris Transfers',
      description:
        'Cookies essenciais em disneyparistransfers.com: idioma, sessão de administração e este aviso. Sem cookies publicitários.',
    },
    routeDetail: {
      title: 'Transfer {from} ↔ {to} — motorista particular a partir de {price} € | Disney Paris Transfers',
      description:
        'Transfer privado {from} ↔ {to} em cerca de {duration}. Preço fixo a partir de {price} €, seguimento de voo, receção, cadeiras de criança gratuitas. Reserve online.',
    },
  },
};
