import type { Dictionary } from '../types';
import { legalDocs } from '../legalDocs';

export const ja: Dictionary = {
  common: {
    brand: 'Disney Paris',
    brandAccent: 'Transfers',
    tagline: 'パリの専属ドライバー',
    langLabel: '言語',
    menu: 'メニュー',
    book: '予約する',
    bookTransfer: '送迎を予約する',
    whatsappQuote: 'WhatsAppで今すぐ見積り',
    callNow: '今すぐ電話する',
    writeWhatsapp: 'WhatsAppで連絡する',
    approx: '約',
    minutes: '分',
    hour: '時間',
    km: 'km',
    from: '～',
    quoteOnly: 'お見積り',
    perDay: '1日',
    availability: '年中無休・24時間',
    replyUnder2h: '2時間以内にご返信',
    skipToContent: '本文へ移動',
  },
  nav: {
    home: 'ホーム',
    routes: '送迎ルート',
    prices: '料金',
    about: '私たちについて',
    faq: 'よくある質問',
    contact: 'お問い合わせ',
  },
  footer: {
    blurb:
      'パリの専属ドライバーサービス。空港送迎とディズニーランド®・パリへの送迎を専門としています。上級セダン・バン、フライト追跡、名前ボードでのお出迎え、チャイルドシート無料。',
    disclaimer: '当サービスは独立した事業者であり、ウォルト・ディズニー・カンパニーとは関係ありません。',
    colRoutes: '送迎ルート',
    colSite: 'サイト',
    colContact: 'お問い合わせ',
    whatsappLine: 'WhatsApp — すぐにご返信',
    booking: 'ご予約',
    rights: '© 2026 disneyparistransfers.com — 無断転載を禁じます',
    seoLine: 'パリの専属ドライバー・CDG、オルリー、ボーヴェ空港送迎・ディズニーランド パリ',
    colLegal: '法的情報',
    terms: '利用規約',
    privacy: 'プライバシー',
    cookies: 'Cookie',
  },
  home: {
    badge: 'ディズニーランド®・パリ送迎の専門サービス',
    h1: 'パリの各空港とディズニーランド・パリを結ぶ専属ドライバー',
    lead: 'CDG、オルリー、ボーヴェ、パリ市内からの送迎を、上級セダンまたはバンで。フライトを追跡し、名前ボードでお出迎え、チャイルドシートは無料です。休暇は空港から始まります。',
    ctaPrimary: '送迎を予約する',
    ctaSecondary: 'WhatsAppで今すぐ見積り',
    perks: ['キャンセル無料', 'フライト追跡', '車内でカード決済', '年中無休・24時間'],
    calc: {
      title: 'リアルタイム料金',
      fromLabel: '出発地',
      toLabel: '目的地',
      paxLabel: 'ご乗車人数',
      tripLabel: '行程',
      oneWay: '片道',
      roundTrip: '往復',
      vehicleLabel: '車種',
      roundTripSuffix: '・往復',
      priceNote: '定額料金 — 高速代・手荷物・チャイルドシート込み',
      confirmWhatsapp: 'WhatsAppで確定する',
      book: '予約する',
      samePlace: '異なる2地点をお選びください',
      custom: 'オーダーメイドの行程 — 2時間以内にご返信',
      loading: '料金を計算しています…',
      whatsappMessage: 'こんにちは。{from} → {to}、{pax}名、{vehicle}、{trip}で予約を希望します。',
    },
    routesTitle: 'ご依頼の多い送迎ルート',
    routesLead: 'ご予約時に確定する定額料金。人数・手荷物・車種によって決まります。',
    seeRoute: 'このルートを見る →',
    excursionsCard: {
      title: '日帰り観光：ヴェルサイユ、モン・サン＝ミシェル…',
      duration: '1日',
      note: '2時間以内にお見積り',
    },
    stepsTitle: 'ご予約はとても簡単',
    steps: [
      {
        title: 'お見積りをご依頼ください',
        text: 'フォーム、WhatsApp、お電話で。数分以内に、保証された定額料金でご返信します。',
      },
      {
        title: 'ドライバーがお待ちします',
        text: 'ドライバーがフライトを追跡し、お名前を記したボードでお出迎え。遅延の際も同様です。',
      },
      {
        title: '道中をお楽しみください',
        text: '冷たいお水、充電器、設置済みのチャイルドシート。お支払いは車内で現金またはカードで。',
      },
    ],
    familyTitle: 'ご家族のために考えられたサービス',
    familyPhoto: '写真：車内 / チャイルドシート',
    services: [
      {
        title: 'フライト追跡',
        text: '遅延の際もドライバーがお迎え時刻を調整します。追加料金はかかりません。',
      },
      {
        title: '名前ボードでお出迎え',
        text: '到着ロビー出口で、お名前を記したボードを持ってお待ちします。手荷物のお手伝いも承ります。',
      },
      {
        title: 'チャイルドシート無料',
        text: 'ベビーシート、チャイルドシート、ジュニアシートを到着前に設置します。',
      },
      {
        title: '柔軟なお支払い',
        text: '車内でのカード決済、現金、決済リンクからお選びいただけます。',
      },
      {
        title: 'キャンセル無料',
        text: '送迎の24時間前まで、理由を問わず無料です。',
      },
      {
        title: '車内の快適さ',
        text: '冷たいお水、充電器、Wi-Fi。ドライバーはフランス語と英語に対応します。',
      },
    ],
    fleetTitle: 'ご人数に合わせた車両',
    fleetLead: '料金は車種・ご乗車人数・お荷物によって決まります。お見積り時にすべてお知らせください。',
    fleetPhoto: '写真：{vehicle}',
    reviewsTitle: 'ご利用いただいたお客様',
    reviewsNote: '— Google / TripAdvisor のレビューはこちらに掲載されます —',
    reviews: [
      {
        name: '— Googleレビュー 1',
        text: '掲載用スペース：実際のお客様のレビュー（GoogleまたはTripAdvisor）をここに貼り付けてください。',
      },
      {
        name: '— Googleレビュー 2',
        text: '掲載用スペース：実際のお客様のレビュー（GoogleまたはTripAdvisor）をここに貼り付けてください。',
      },
      {
        name: '— TripAdvisorレビュー 1',
        text: '掲載用スペース：実際のお客様のレビュー（GoogleまたはTripAdvisor）をここに貼り付けてください。',
      },
    ],
    finalTitle: '魔法の準備はできましたか？送迎をご予約ください。',
    finalLead: 'お見積りは無料・拘束力なし。数分以内にご返信します。',
    finalBook: 'オンラインで予約する',
  },
  routes: {
    h1: 'すべての送迎ルート',
    lead: 'パリの各空港、パリ市内、ディズニーランド・パリを結ぶ専用送迎。定額料金はお見積りで確定し、ご乗車人数・お荷物・お選びの車種によって決まります。',
    see: 'このルートを見る',
    askQuote: 'お見積りを依頼する',
    otherLead: '他の目的地をご希望ですか？',
    otherLink: 'WhatsAppでお問い合わせください — イル＝ド＝フランス全域に対応しています。',
    descriptionTemplate:
      '{from} と {to} を結ぶ専属ドライバー送迎。定額料金、ネームボードでのお出迎え、チャイルドシート込み。',
    descriptions: {
      'cdg-disneyland':
        '最もご依頼の多いルートです。到着ロビー出口でお出迎えし、ディズニーホテルまたは提携ホテルへ直接お送りします。',
      'orly-disneyland':
        'オルリー1・2・3・4でお迎えし、A86号線とA4号線を経由してマルヌ・ラ・ヴァレへ直行します。',
      'beauvais-disneyland':
        '2本のシャトルとRERは不要。ボーヴェ・ティエ空港からドアツードアで直行します。',
      'paris-disneyland':
        'パリのホテルやご住所からパークまたはディズニーホテルへ、ご希望の時刻にお送りします。',
      'cdg-paris': 'ロワシー空港とパリのご住所を結ぶ専用送迎。待ち時間も追加料金もありません。',
      'orly-paris': 'オルリー空港でお迎えし、パリ市内のホテルや玄関先までお送りします。',
      'paris-beauvais':
        'パリのご住所を出発し、ボーヴェ・ティエ空港のターミナル前までお送りします。',
      'paris-versailles':
        'ヴェルサイユ宮殿、パリ市内観光、時間単位または1日単位の貸切もドライバー付きで承ります。',
    },
  },
  routeDetail: {
    breadcrumb: '送迎ルート',
    h1: '{from} ↔ {to} 専属ドライバーによる送迎',
    leadTemplate:
      '{from} と {to} を結ぶドアツードアのプライベート送迎。フライトを追跡し、ネームボードでお出迎えし、出発前に定額を確定します。',
    lead: {
      'cdg-disneyland':
        'ロワシー・シャルル・ド・ゴール空港とディズニーホテルを約45分で直結します。ドライバーがフライトを追跡し、名前ボードでお出迎えし、ご到着前にチャイルドシートを設置します。',
      'orly-disneyland':
        'A86号線とA4号線を経由し、オルリー空港からマルヌ・ラ・ヴァレへ約50分で直行します。オルリー1・2・3・4でお迎えし、乗り換えも待ち時間もありません。',
      'beauvais-disneyland':
        'ボーヴェ・ティエ空港からディズニーランドまでは120km。専用送迎なら、シャトル・駅・RERを使わず、ドアツードアで一度に移動できます。',
      'paris-disneyland':
        'パリのホテルからパークまたはディズニーホテルまで約45分。ご希望の時刻に、お荷物とベビーカーも一緒にお運びします。',
      'cdg-paris':
        'ロワシー・シャルル・ド・ゴール空港とパリのご住所を結ぶ専用送迎。到着ロビーでお出迎えし、料金はご予約時に確定します。',
      'orly-paris':
        'オルリー空港とパリ市内を結ぶ専用送迎。時間帯を問わず、行列も直前の追加料金もありません。',
      'paris-beauvais':
        'パリのご住所を出発し、ボーヴェ・ティエ空港のターミナル前へ。出発時刻はフライトに合わせて算出します。',
      'paris-versailles':
        'パリとヴェルサイユ宮殿を結ぶ往復、または時間単位の貸切。ご見学の間、ドライバーがお待ちします。',
    },
    ctaBook: 'この送迎を予約する',
    livePriceTitle: 'リアルタイム料金',
    relatedTitle: 'その他の送迎',
    imageAlt: '{from} から {to} への専属ドライバー送迎',
    statDuration: '所要時間',
    statDistance: '距離',
    statHours: 'すべての便、すべてのターミナル',
    statHoursValue: '24時間',
    statPrice: 'お見積りで確定、追加請求なし',
    statPriceValue: '定額料金',
    howTitle: '送迎の流れ',
    stepPickupTitle: 'ご到着時',
    stepPickupAirport:
      'ドライバーがフライトをリアルタイムで追跡します。遅延でも早着でも、追加料金なしで適切な時刻にお待ちしています。ご利用のターミナルの到着ロビー出口で、お名前を記したボードを持ってお待ちします。',
    stepPickupCity:
      'ドライバーはお約束の時刻にホテルやご住所の前でお待ちし、到着次第SMSまたはWhatsAppでお知らせします。',
    stepDriveTitle: '道中',
    stepDrive:
      '手荷物のお手伝い、設置済みのチャイルドシート、冷たいお水と充電器をご用意。途中停車も遠回りもない直行便です。',
    stepArrivalTitle: 'ご到着時',
    stepArrivalDisney:
      'ディズニーホテル（Disneyland Hotel、Newport Bay Club、Sequoia Lodge、Cheyenne、Santa Fe、Davy Crockett Ranch）、またはヴァル・デュロップやマニー・ル・オングルの提携ホテルの玄関前まで直接お送りします。',
    stepArrivalOther:
      '正確なご住所の玄関前までお送りし、お荷物はロビーまでお運びします。',
    stepReturnTitle: '復路',
    stepReturn:
      'お約束の時刻にお迎えにあがります。出発ターミナルへ余裕をもって到着できるよう時刻を算出します。',
    photo: '写真：名前ボードでのお出迎え',
    priceBoxTitle: '料金を決める要素：',
    priceFactors: [
      'ご乗車人数（1〜8名）',
      'お荷物の個数と大きさ',
      '車種：セダン、SUV、バン、プレミアム',
    ],
    priceBoxCta: '定額料金を確認する',
    tableTitle: '{from} ↔ {to} の料金',
    faqTitle: 'よくある質問 — {from} ↔ {to}',
    faq: [
      {
        q: 'フライトが遅延した場合はどうなりますか？',
        a: 'お客様は何もなさる必要はありません。便名をリアルタイムで追跡し、追加料金なしでお迎え時刻を調整します。深夜でも同様です。',
      },
      {
        q: 'ドライバーとはどこで合流しますか？',
        a: 'ご利用のターミナルの到着ロビー出口で、お名前を記したボードを持ってお待ちしています。着陸前にSMSまたはWhatsAppでドライバーの番号をお送りします。',
      },
      {
        q: 'チャイルドシートは有料ですか？',
        a: 'いいえ、無料です。ご予約時にお子様の年齢をお知らせください。ベビーシート、チャイルドシート、ジュニアシートをご到着前に設置します。',
      },
      {
        q: '支払い方法は？',
        a: '車内でのカード決済、現金、事前の決済リンクからお選びいただけます。お見積りで確定した料金は定額で、高速代と待機料込みです。',
      },
      {
        q: 'シャトルバスやRERより本当に便利ですか？',
        a: '専用送迎はドアツードアで、途中停車も、お荷物やベビーカーを持っての乗り換えもありません。フライトの時刻にぴったり合わせて運行します。',
      },
    ],
  },
  prices: {
    h1: '料金 — 定額で明朗',
    lead: '出発地をお選びください。すべての料金をご乗車人数別、片道・往復別に表示します。高速代、お荷物、待機時間、チャイルドシートは常に含まれています。',
    departLabel: '出発地：',
    colPax: 'ご乗車人数',
    colOneWay: '片道',
    colRoundTrip: '往復',
    bookThis: 'このルートを予約する',
    noRoute:
      'この地点から出発するルートは料金表にございません。お見積りをご依頼ください。2時間以内にご返信します。',
    toursTitle: '日帰り観光・ドライバー付き貸切',
    toursLead:
      'ヴェルサイユ、モン・サン＝ミシェル、ロワールの古城…。各ツアーはご人数とご予定に合わせて個別にお見積りし、2時間以内に必ずご返信します。',
    tourCta: 'お見積りを依頼する →',
    customBadge: '⏱ 2時間以内にご返信 — 年中無休',
    customTitle: 'オーダーメイドのお見積りをご希望ですか？',
    customLead:
      '9名以上のグループ、料金表にないルート、オリジナルの日帰り観光、1日貸切など、ご要望をお知らせいただければ2時間以内にご返信します。',
    customWhatsapp: 'WhatsAppで見積り',
    customForm: 'お見積りフォーム',
    whatsappRoute: 'こんにちは。{from} → {to} の予約を希望します。',
    whatsappTour: 'こんにちは。{tour} の日帰り観光について見積りをお願いします。',
  },
  booking: {
    h1: '送迎をご予約ください',
    lead: 'フォームにご記入ください。数分以内に、保証された定額料金でご返信します。お急ぎの場合はWhatsAppまたはお電話が確実です。',
    fromLabel: '出発地',
    toLabel: '目的地',
    dateLabel: '日付',
    timeLabel: '時刻（フライトまたはお迎え）',
    paxLabel: 'ご乗車人数',
    bagsLabel: 'お荷物',
    vehicleLabel: 'ご希望の車種',
    seatsLabel: 'チャイルドシート',
    flightLabel: '便名（空港の場合）',
    flightPlaceholder: '例：AF 1234',
    nameLabel: 'お名前',
    namePlaceholder: 'お名前',
    emailLabel: 'メールアドレス',
    emailPlaceholder: 'you@email.com',
    phoneLabel: '電話 / WhatsApp',
    phonePlaceholder: '+81 …',
    messageLabel: 'メッセージ（正確な住所、復路、特別なご要望など）',
    tripLabel: '行程の種類',
    oneWay: '片道',
    roundTrip: '往復',
    bagOptions: ['0〜2個', '3〜4個', '5〜6個', '7個以上'],
    seatOptions: [
      '不要',
      'ベビーシート（0〜12か月）',
      'チャイルドシート（1〜4歳）',
      'ジュニアシート（4〜10歳）',
      '複数（メッセージ欄にご記入ください）',
    ],
    vehicleAdvise: 'おすすめを教えてください',
    otherPlace: 'その他（メッセージ欄にご記入ください）',
    submit: 'お見積りを依頼する',
    submitting: '送信中…',
    success: '送信しました！',
    successLead: '定額料金をお知らせするため、まもなくご連絡いたします。',
    error: '送信に失敗しました。もう一度お試しいただくか、WhatsAppで直接ご連絡ください。',
    note: 'お見積りは無料・拘束力なし — 2時間以内にご返信します。送迎の24時間前まで無料でキャンセルいただけます。',
    estimateLabel: 'このルートの目安料金',
    estimateCustom: 'オーダーメイドの行程 — 料金は2時間以内に確定します',
    payTitle: '今すぐオンラインで支払う',
    payLead:
      'カードで今すぐお支払いいただくと、お時間がその場で確保されます。もちろん車内でのお支払いも可能です。',
    payCta: 'カードで {price} € を支払う',
    paySkip: '車内で支払います',
    paySuccess: 'お支払いを受領しました。ありがとうございます！送迎が確定しました。',
    payCancelled: 'お支払いをキャンセルしました。ご依頼は保存されており、車内でお支払いいただけます。',
    sidebarWhatsapp: 'WhatsApp',
    sidebarWhatsappNote: '最も早い方法です。行程をお送りいただければ、すぐに料金をご返信します。',
    sidebarPhoneNote: '年中無休・24時間 — フランス語と英語に対応します。',
    includedTitle: '常に含まれるもの',
    included: ['フライト追跡と待機', '名前ボードでのお出迎え', 'チャイルドシート無料', '高速代込み・定額料金'],
    required: 'この項目は必須です。',
    invalidEmail: 'メールアドレスが正しくありません。',
    stepJourney: '行程',
    stepParty: '人数',
    stepContact: 'ご連絡先',
    next: '次へ',
    back: '戻る',
    trustSeats: 'チャイルドシート無料',
    trustFixed: '定額・追加料金なし',
    trustHours: '24時間対応',
    noCard: '見積りにカードは不要',
    liveTitle: '概算料金',
  },
  about: {
    h1: 'プラットフォームではなく、あなたのドライバー',
    lead: 'Disney Paris Transfers は、パリの各空港とディズニーランド・パリを結ぶ送迎を専門とする、独立した専属ドライバーサービスです。',
    h2: '一つの仕事：移動を、休暇でいちばん気楽な時間にすること',
    paragraphs: [
      '認可を受けたプロのドライバーで、免許も有効、車両は保険加入・整備済みです。CDGとオルリーのすべてのターミナル、すべてのディズニーホテル、そして時間帯ごとの最適なルートを熟知しています。',
      'お客様の多くは遠方からお越しのご家族です。長時間のフライトの後、疲れたお子様と多くのお荷物を抱えていらっしゃることもあります。飛行機を降りた瞬間にすべてが整っていること——名前ボード、設置済みのチャイルドシート、広いトランク、そして魔法の国までの穏やかな道のり。それが私の仕事です。',
    ],
    editorNote: '✎ この文章を、ご自身の紹介文に差し替えてください：お名前、経験年数、話せる言語など。',
    photo: '写真：ドライバーのポートレート',
    stats: [
      { value: '100%', label: '全行程で保険加入、認可取得済み' },
      { value: '年中無休', label: '昼夜を問わず対応' },
      { value: 'FR · EN', label: 'バイリンガルのドライバー' },
      { value: '0 €', label: '隠れた費用なし — 定額料金を保証' },
    ],
    ctaTitle: 'お話ししましょう',
    ctaLead: 'ご質問や特別な行程はありますか？ご連絡ください。私が直接お返事します。',
    ctaContact: '連絡する',
    ctaBook: '送迎を予約する',
  },
  faq: {
    h1: 'よくある質問',
    lead: '空港 ↔ ディズニーランド・パリの送迎をご予約になる前に知っておきたいことをまとめました。',
    items: [
      {
        q: '送迎料金はどのように決まりますか？',
        a: '料金は定額で、ご予約前に確定します。ご乗車人数、お荷物の量、お選びの車種（セダン、SUV、バン、プレミアム）によって決まります。高速代、待機時間、チャイルドシートは常に含まれています。',
      },
      {
        q: 'フライトが遅延した場合はどうなりますか？',
        a: '便名をリアルタイムで追跡します。ドライバーが自動的にお迎え時刻を調整し、追加料金はかかりません。深夜でも同様です。',
      },
      {
        q: '空港のどこでドライバーと合流しますか？',
        a: 'ご利用のターミナルの到着ロビー出口で、お名前を記したボードを持ってお待ちしています。着陸前にSMSまたはWhatsAppでドライバーの電話番号をお送りします。',
      },
      {
        q: 'チャイルドシートは用意されますか？',
        a: 'はい、無料でご用意します。ご予約時にお子様の年齢をお知らせください。ベビーシート、チャイルドシート、ジュニアシートをお迎え前に設置します。',
      },
      {
        q: '何名まで、荷物はいくつまで乗せられますか？',
        a: 'セダンで4名・お荷物3個まで、バンで8名・お荷物8個までです。ベビーカーや各種用具もお持ちいただけます。お見積りの際にお知らせください。',
      },
      {
        q: '支払い方法は？',
        a: '車内でのカード決済、現金、または事前の決済リンクをご利用いただけます。ほとんどのルートで前金は不要です。',
      },
      {
        q: '予約の取り消しや変更はできますか？',
        a: 'はい、送迎の24時間前まで無料です。WhatsAppまたはお電話でご連絡ください。',
      },
      {
        q: 'ドライバーは英語を話しますか？',
        a: 'はい、フランス語と英語に対応します。ディズニーランド・パリへお越しになる世界各国のご家族を日常的にお迎えしています。',
      },
      {
        q: 'ディズニーホテルや提携ホテルにはすべて対応していますか？',
        a: 'はい。ディズニーホテル（Disneyland Hotel、Newport Bay、Sequoia、Cheyenne、Santa Fe、Davy Crockett Ranch）、およびヴァル・デュロップ、マニー・ル・オングル、バイイ・ロマンヴィリエ、セリスの提携ホテルに対応しています。',
      },
      {
        q: 'ディズニー以外の送迎も行っていますか？',
        a: 'はい。CDG／オルリー／ボーヴェ ↔ パリの送迎、パリ市内の各駅、ヴェルサイユ日帰り観光、時間単位の貸切も承ります。お気軽にお見積りをご依頼ください。',
      },
      {
        q: '夜間や祝日も営業していますか？',
        a: 'はい、年中無休・24時間対応で、早朝や深夜のフライトにも対応します。確実にご利用いただくため、お早めのご予約をおすすめします。',
      },
    ],
    moreTitle: '他にご質問はありますか？',
  },
  contact: {
    h1: 'お問い合わせ',
    lead: '年中無休・24時間対応 — 数分以内にご返信します。',
    phoneTitle: '電話',
    phoneNote: '直通、年中無休・24時間',
    whatsappTitle: 'WhatsApp',
    whatsappNote: 'お見積りにはこれが最速です',
    emailTitle: 'メール',
    emailNote: '数時間以内にご返信',
    ctaTitle: '今すぐ料金を知りたいですか？',
    ctaLead: '予約フォームなら、数分で定額のお見積りが届きます。',
    ctaBtn: '見積りを依頼する',
  },
  pricing: {
    timeLabel: 'お迎え時刻',
    nightNote: '深夜料金：{start}〜{end} は +{percent}%',
    nightLine: '深夜割増（+{percent}%）',
    baseLine: '送迎',
    totalLine: '概算合計',
    packagesTitle: 'パッケージ',
    packagesLead: '定額・すべて込みのプランです。ご予約時にお選びください。',
    packageLabel: 'パッケージ',
    packageNone: 'パッケージなし — ルートで計算',
    packageUpTo: '最大 {pax} 名',
    extrasTitle: 'オプション',
    extrasLead: '送迎料金に加算されます。',
    extrasEach: '1点につき',
  },
  cookieBanner: {
    message:
      '言語、管理画面のセッション、この告知など、必要最低限のCookieのみを使用します。広告用Cookieはありません。',
    accept: '了解しました',
    more: 'Cookieポリシー',
  },
  legal: legalDocs.ja,
  destinationKinds: {
    airport: '空港',
    city: '都市',
    castle: '城・テーマパーク',
    tours: 'ツアー',
  },
  zones: {
    cdg: 'シャルル・ド・ゴール空港（CDG）',
    orly: 'オルリー空港',
    beauvais: 'ボーヴェ空港',
    disney: 'ディズニーランド・パリ',
    paris: 'パリ',
    versailles: 'ヴェルサイユ宮殿',
    ladefense: 'ラ・デファンス',
    valeurope: 'ヴァル・デュロップ',
  },
  vehicles: {
    saloon: {
      label: 'セダン',
      short: 'セダン',
      desc: 'カップルや少人数のご家族に最適。快適で控えめな一台です。',
      pax: '1〜4名',
      bags: 'お荷物3個',
    },
    suv: {
      label: 'SUV',
      short: 'SUV',
      desc: 'セダンと同じ快適さで、お荷物のスペースがより広い車種です。',
      pax: '1〜4名',
      bags: 'お荷物4個',
    },
    van: {
      label: 'バン',
      short: 'バン',
      desc: '大家族やベビーカーをお持ちのグループにぴったりです。',
      pax: '5〜8名',
      bags: 'お荷物8個',
    },
    premium: {
      label: 'プレミアム — メルセデス Eクラス／Sクラス',
      short: 'プレミアム',
      desc: 'ワンランク上の移動に。レザー、静粛性、行き届いたサービス。',
      pax: '1〜3名',
      bags: 'お荷物3個',
    },
  },
  tours: {
    parisCityTour: {
      name: 'パリ市内観光',
      dur: '2〜4時間',
      desc: '名所を巡るプライベートツアー：エッフェル塔、シャンゼリゼ、ルーヴル、モンマルトルなど。',
    },
    versailles: {
      name: 'ヴェルサイユ宮殿',
      dur: '半日',
      desc: 'パリまたはディズニーランドからの往復、あるいは時間単位の貸切。',
    },
    montSaintMichel: {
      name: 'モン・サン＝ミシェル',
      dur: '1日',
      desc: '早朝に出発し、現地で丸一日過ごして夕方に戻ります。',
    },
    normandie: {
      name: 'ノルマンディーと上陸海岸',
      dur: '1日',
      desc: 'オマハ・ビーチ、アメリカ人墓地、アロマンシュなど。',
    },
    loire: {
      name: 'ロワールの古城',
      dur: '1日',
      desc: 'シャンボール、シュノンソー、アンボワーズ — ご希望に合わせた行程で。',
    },
    fontainebleau: {
      name: 'フォンテーヌブロー',
      dur: '半日',
      desc: 'フォンテーヌブロー城と森へ。パリからもディズニーからも出発できます。',
    },
    giverny: {
      name: 'ジヴェルニー — モネの庭',
      dur: '半日',
      desc: 'クロード・モネの家と庭園（4月〜10月）。',
    },
    parcAsterix: {
      name: 'パルク・アステリックス',
      dur: '送迎',
      desc: 'パリ、CDG、ディズニーからの片道または往復。',
    },
    valleeVillage: {
      name: 'ラ・ヴァレ・ヴィレッジ — ショッピング',
      dur: '送迎',
      desc: 'ディズニーランドから5分の高級アウトレット。待機も可能です。',
    },
  },
  seo: {
    home: {
      title: 'CDG ↔ ディズニーランド・パリ送迎 — 専属ドライバー | Disney Paris Transfers',
      description:
        'CDG、オルリー、ボーヴェ、パリ市内とディズニーランド・パリを結ぶ専属ドライバーによる送迎。定額70 €から、フライト追跡、名前ボードでのお出迎え、チャイルドシート無料。24時間対応。',
    },
    routes: {
      title: 'すべての送迎ルート — パリの空港とディズニーランド | Disney Paris Transfers',
      description:
        'CDG、オルリー、ボーヴェ、パリ、ヴェルサイユ。ディズニーランド・パリおよびイル＝ド＝フランス各地への専用送迎を、所要時間・距離・定額料金とともにご紹介します。',
    },
    prices: {
      title: 'パリ・ディズニーランド送迎料金 — 定額表 | Disney Paris Transfers',
      description:
        'ご乗車人数別・片道・往復の完全な料金表。高速代、お荷物、チャイルドシート込み。日帰り観光は個別見積りで、2時間以内にご返信します。',
    },
    booking: {
      title: 'パリ ↔ ディズニーランドの送迎を予約 | Disney Paris Transfers',
      description:
        '専属ドライバーのご予約は2分で完了。無料見積り・定額料金保証、2時間以内にご返信、送迎の24時間前まで無料キャンセル。',
    },
    about: {
      title: '私たちについて — パリの専属ドライバー | Disney Paris Transfers',
      description:
        '空港 ↔ ディズニーランド・パリの送迎を専門とする、認可取得済みの独立ドライバー。保険加入済みの車両で、フランス語・英語に対応します。',
    },
    faq: {
      title: 'よくある質問 — ディズニーランド・パリ送迎 | Disney Paris Transfers',
      description:
        'フライトの遅延、チャイルドシート、お支払い、キャンセル、お荷物。空港 ↔ ディズニーランド・パリの送迎をご予約になる前の疑問にお答えします。',
    },
    contact: {
      title: 'お問い合わせ — パリの専属ドライバー | Disney Paris Transfers',
      description:
        'パリの各空港とディズニーランド・パリを結ぶ送迎について、年中無休・24時間、電話・WhatsApp・メールでご連絡いただけます。',
    },
    terms: {
      title: '利用規約 | Disney Paris Transfers',
      description:
        'Disney Paris Transfersの予約条件：お見積り、お支払い、キャンセル、夜間割増、お客様の義務。',
    },
    privacy: {
      title: 'プライバシーポリシー | Disney Paris Transfers',
      description:
        'Disney Paris Transfersが予約・メール・決済のために個人データを収集・保管・利用する方法。',
    },
    cookies: {
      title: 'Cookieポリシー | Disney Paris Transfers',
      description:
        'disneyparistransfers.comの必須Cookie：言語、管理画面のセッション、この告知。広告用Cookieはありません。',
    },
    routeDetail: {
      title: '{from} ↔ {to} 送迎 — 専属ドライバー {price} €から | Disney Paris Transfers',
      description:
        '{from} ↔ {to} の専用送迎、所要時間は約{duration}。定額{price} €から、フライト追跡、名前ボードでのお出迎え、チャイルドシート無料。オンラインでご予約いただけます。',
    },
  },
};
