import type { ProjectSection } from "@/lib/types";

/**
 * Detailed blocks of the Vatan Residence page, from the developer's guidebook (Vatan Residence catalog,
 * flipbook «VATAN RESIDENCE katalog final», 84 pages, Uzbek). Pictures are taken from the same catalog.
 */
export const VATAN_SECTIONS: ProjectSection[] = [
  {
    id: "location",
    eyebrow: { ru: "Расположение", uz: "Joylashuv", en: "Location" },
    title: { ru: "Стратегическая точка Самарканда", uz: "Shaharning strategik nuqtasi", en: "A strategic point of Samarkand" },
    text: {
      ru: "Vatan Residence стоит в одном из самых престижных и быстро развивающихся районов города и продолжает его современную среду. Локация отличается высоким инвестиционным потенциалом: стоимость премиальной недвижимости здесь растёт на 15–20% в год. Это не только дом, но и вложение с долгосрочной ценностью.",
      uz: "Vatan Residence shaharning eng nufuzli va jadal rivojlanayotgan hududlaridan birida joylashgan. Lokatsiya yuqori investitsion salohiyatga ega: hududda premium ko‘chmas mulk qiymati yiliga 15–20% ga o‘smoqda. Bu nafaqat uy, balki uzoq muddatli qiymatga ega investitsiya.",
      en: "Vatan Residence stands in one of the city's most prestigious and fastest-growing districts. The location has strong investment potential: premium property here gains 15–20% in value a year. It is a home and a long-term investment at once.",
    },
    image: "/vatan/guide/location.jpg",
    stats: [
      { value: "15–20%", label: { ru: "годовой рост цен на премиум-жильё", uz: "premium uy-joy narxining yillik o‘sishi", en: "yearly growth of premium prices" } },
      { value: "8", label: { ru: "блоков в комплексе", uz: "blok", en: "blocks" } },
      { value: "16", label: { ru: "этажей", uz: "qavat", en: "floors" } },
    ],
  },
  {
    id: "architecture",
    eyebrow: { ru: "Архитектура", uz: "Arxitektura", en: "Architecture" },
    title: { ru: "Восточная культура в современной архитектуре", uz: "Sharq madaniyatidan ilhomlangan zamonaviy arxitektura", en: "Eastern culture in modern architecture" },
    text: {
      ru: "Концепция и генплан разработаны вместе с архитектурным бюро UNIVER PRO STYLE: восемь блоков с собственной идеей и дизайном. Фирменный орнамент проекта вплетён в фасад и стал его архитектурным кодом, а сама эстетика фасада строится на принципах современного минимализма.",
      uz: "Konsepsiya va bosh reja UNIVER PRO STYLE arxitektura firmasi bilan hamkorlikda ishlab chiqilgan: o‘ziga xos g‘oya va dizaynga ega 8 ta blok. Loyiha ramziga asoslangan korporativ naqsh fasadga singdirilib, majmuaning betakror arxitekturaviy kodini shakllantirdi.",
      en: "The concept and master plan were created with the UNIVER PRO STYLE architecture firm: eight blocks, each with its own idea and design. The project's signature pattern is woven into the facade as its architectural code, on the principles of modern minimalism.",
    },
    image: "/vatan/guide/architecture.jpg",
    points: [
      { ru: "Облицовка натуральным камнем — травертином", uz: "Tabiiy tosh — travertin bilan qoplama", en: "Natural travertine stone cladding" },
      { ru: "Алюминиевые ламели", uz: "Alyuminiy lamellar", en: "Aluminium louvres" },
      { ru: "Панорамное остекление", uz: "Panorama oynalar", en: "Panoramic glazing" },
      { ru: "Торговая галерея на первых этажах", uz: "Birinchi qavatlarda savdo galereyasi", en: "Retail gallery on the lower floors" },
    ],
  },
  {
    id: "lobby",
    eyebrow: { ru: "Лобби", uz: "Lobbi", en: "Lobby" },
    title: { ru: "Лобби гостиничного уровня", uz: "Mehmonxona toifasidagi lobbi", en: "A hotel-class lobby" },
    text: {
      ru: "Лобби в стиле Modern Luxury встречает статусом с первого шага. Здесь удобно принять гостей или провести деловую встречу, не нарушая приватность квартиры. При входе — консьерж и служба безопасности.",
      uz: "Modern Luxury uslubidagi lobbi ilk qadamdanoq majmuaning yuksak maqomini namoyon etadi. Bu yerda xonadoningizning daxlsizligini saqlagan holda mehmonlarni kutib olish yoki ishbilarmonlik uchrashuvlarini o‘tkazish mumkin.",
      en: "The Modern Luxury lobby shows the status of the complex from the first step. Receive guests or hold a business meeting here while your apartment stays private. A concierge and security meet you at the entrance.",
    },
    image: "/vatan/guide/lobby.jpg",
    stats: [
      { value: "46,4 m²", label: { ru: "площадь лобби", uz: "lobbi maydoni", en: "lobby area" } },
      { value: "3,6 m", label: { ru: "высота потолков", uz: "shift balandligi", en: "ceiling height" } },
      { value: "3,2 m", label: { ru: "панорамные окна", uz: "panorama oynalar", en: "panoramic windows" } },
    ],
  },
  {
    id: "lifts",
    eyebrow: { ru: "Лифты", uz: "Liftlar", en: "Lifts" },
    title: { ru: "Американские лифты Otis", uz: "Premium toifadagi Amerika liftlari", en: "American Otis lifts" },
    text: {
      ru: "В комплексе устанавливаются улучшенные лифты Otis — бренда с историей более 170 лет. Высокая скорость и умная маршрутизация сокращают ожидание, контроль доступа бережёт безопасность, а высокие кабины с индивидуальной отделкой дают ощущение простора.",
      uz: "Majmuada 170 yildan ortiq tarixga ega Otis brendining takomillashtirilgan liftlari o‘rnatiladi. Yuqori tezlik va optimal marshrutlar kutish vaqtini qisqartiradi, kirishni nazorat qilish tizimi xavfsizlikni ta’minlaydi.",
      en: "The complex gets upgraded Otis lifts, a brand with over 170 years of history. High speed and smart routing cut the wait, access control keeps the building secure, and tall cabins with custom finishes feel spacious.",
    },
    image: "/vatan/guide/lifts.jpg",
    stats: [
      { value: "3", label: { ru: "лифта в каждом лобби", uz: "har bir lobbida lift", en: "lifts in every lobby" } },
      { value: "2,5 m/s", label: { ru: "скорость", uz: "harakat tezligi", en: "speed" } },
      { value: { ru: "до 1,6 т", uz: "1,6 t gacha", en: "up to 1.6 t" }, label: { ru: "грузоподъёмность", uz: "yuk ko‘tarish quvvati", en: "load capacity" } },
      { value: { ru: "10,1 с", uz: "10,1 sek", en: "10.1 s" }, label: { ru: "до 16-го этажа", uz: "16-qavatgacha", en: "to the 16th floor" } },
    ],
  },
  {
    id: "apartments",
    eyebrow: { ru: "Квартиры", uz: "Xonadonlar", en: "Apartments" },
    title: { ru: "Квартиры под ключ с высокими потолками", uz: "Baland shiftli to‘liq ta’mirlangan xonadonlar", en: "Turnkey apartments with high ceilings" },
    text: {
      ru: "Квартиры сдаются с полной чистовой отделкой: премиальные материалы, качественные полы, межкомнатные двери и полная сантехника в санузлах. Ключи — и можно въезжать. Высокие потолки, панорамные окна и скрытые инженерные системы дают ощущение простора, а гибкие планировки подходят под любой стиль — от классики до лофта.",
      uz: "Xonadonlar to‘liq ta’mirlangan holda («pod klyuch») topshiriladi: premium materiallar, sifatli pol qoplamalari, ichki eshiklar va sanuzellar uchun to‘liq santexnika. Baland shiftlar va panorama oynalar kenglik tuyg‘usini beradi.",
      en: "Apartments are handed over fully finished: premium materials, quality floors, interior doors and complete bathroom fittings. Get the keys and move in. High ceilings, panoramic windows and hidden engineering make the rooms feel spacious, and flexible layouts suit any style, from classic to loft.",
    },
    image: "/vatan/guide/apartments.jpg",
    stats: [
      { value: "34,8–73 m²", label: { ru: "площадь квартир", uz: "xonadonlar maydoni", en: "apartment sizes" } },
      { value: "3,2 m", label: { ru: "потолки (3,8 м в пентхаусах)", uz: "shift (pentxauslarda 3,8 m)", en: "ceilings (3.8 m in penthouses)" } },
      { value: "641", label: { ru: "квартира в комплексе", uz: "xonadon", en: "apartments in total" } },
    ],
  },
  {
    id: "quiet",
    eyebrow: { ru: "Окна и двери", uz: "Oynalar va eshiklar", en: "Windows and doors" },
    title: { ru: "Тишина и тепло круглый год", uz: "Yil bo‘yi sukunat va issiqlik", en: "Quiet and warm all year round" },
    text: {
      ru: "Энергосберегающее панорамное остекление на европейских алюминиевых профилях: трёхслойный стеклопакет держит тепло вдвое лучше обычных окон, защищает от сквозняков, конденсата и летней жары. Входные двери сделаны специально для проекта — семь слоёв защиты от шума. Отопление — настенные дизайнерские конвекторы.",
      uz: "Yevropa alyuminiy profillaridagi energiya tejamkor panorama oynalar: uch qavatli oynapaket issiqlikni oddiy oynalarga qaraganda ikki baravar yaxshiroq saqlaydi. Kirish eshiklari maxsus ishlab chiqilgan — yetti qatlamli shovqin himoyasi.",
      en: "Energy-saving panoramic glazing on European aluminium profiles: the triple-glazed unit keeps heat twice as well as ordinary windows and guards against draughts, condensation and summer heat. The entrance doors were made for the project, with seven layers of noise protection. Heating comes from designer wall convectors.",
    },
    image: "/vatan/guide/windows.jpg",
    stats: [
      { value: "40–45 dB", label: { ru: "шумоизоляция окон", uz: "oynalar shovqin izolyatsiyasi", en: "window noise insulation" } },
      { value: "40 dB", label: { ru: "шумоизоляция дверей", uz: "eshiklar shovqin izolyatsiyasi", en: "door noise insulation" } },
      { value: "1,5 mm", label: { ru: "сталь входной двери", uz: "eshik po‘lati qalinligi", en: "steel of the entrance door" } },
    ],
    points: [
      { ru: "Защита от ультрафиолета и тонировка", uz: "UF nurlaridan himoya va tonirovka", en: "UV protection and tinting" },
      { ru: "Детский замок на окнах", uz: "Bolalar xavfsizligi qulfi", en: "Child lock on the windows" },
    ],
  },
  {
    id: "smart",
    eyebrow: { ru: "Умный дом и безопасность", uz: "Aqlli uy va xavfsizlik", en: "Smart home and security" },
    title: { ru: "Дверь узнаёт вас в лицо", uz: "Eshik sizni yuzingizdan taniydi", en: "The door knows your face" },
    text: {
      ru: "Каждая квартира получает умный замок Aqara: 3D-распознавание лица открывает дверь, когда вы подходите на метр. Видеоглазок с инфракрасным датчиком выводит картинку на 4-дюймовый экран и в смартфон. Ещё — умный климат-контроль и бесконтактный въезд в паркинг; комплекс под охраной и видеонаблюдением 24/7.",
      uz: "Har bir xonadon Aqara aqlli qulfi bilan jihozlangan: 3D-yuzni tanish texnologiyasi eshikka bir metr masofada yaqinlashganingizda uni ochadi. Ichki videoko‘zgich tasvirni 4 dyuymli displeyga va smartfoningizga uzatadi.",
      en: "Every apartment gets an Aqara smart lock: 3D face recognition opens the door as you come within a metre. An infrared video peephole shows the picture on a 4-inch screen and on your phone. There is also smart climate control and contactless parking entry, and the complex is guarded and on camera 24/7.",
    },
    image: "/vatan/guide/smart.jpg",
    points: [
      { ru: "Открыть: приложение, отпечаток, NFC-метка, пароль, Apple Home Key или ключ", uz: "Ochish: ilova, barmoq izi, NFC-metka, parol, Apple Home Key yoki kalit", en: "Unlock by app, fingerprint, NFC tag, code, Apple Home Key or key" },
      { ru: "Охрана и видеонаблюдение 24/7", uz: "24/7 qo‘riqlash va videokuzatuv", en: "24/7 guards and CCTV" },
      { ru: "Пожарная безопасность", uz: "Yong‘in xavfsizligi tizimi", en: "Fire safety system" },
      { ru: "Контроль доступа в лифтах", uz: "Liftlarda kirishni nazorat qilish", en: "Access control in the lifts" },
    ],
  },
  {
    id: "amenities",
    eyebrow: { ru: "Инфраструктура", uz: "Infratuzilma", en: "Amenities" },
    title: { ru: "Всё для жизни — внутри комплекса", uz: "Hayot uchun hammasi — majmua ichida", en: "Everything for life, inside the complex" },
    text: {
      ru: "Магазины, спорт, детский клуб и зал для праздников — без выхода со двора.",
      uz: "Do‘konlar, sport, bolalar klubi va bayramlar uchun zal — hovlidan chiqmasdan.",
      en: "Shops, sport, a kids' club and a party hall without leaving the courtyard.",
    },
    cards: [
      {
        title: { ru: "Шопинг-аллея", uz: "Shopping xiyoboni", en: "Shopping alley" },
        text: { ru: "Бутики мировых брендов на 1–2 этажах, супермаркет и гастрозоны.", uz: "1–2-qavatlarda jahon brendlari butiklari, supermarket va gastrozonalar.", en: "World-brand boutiques on floors 1–2, a supermarket and food halls." },
        image: "/vatan/04.jpg",
        stat: { ru: "1–2 этажи", uz: "1–2-qavatlar", en: "floors 1–2" },
      },
      {
        title: { ru: "Фитнес и SPA", uz: "Fitnes va SPA", en: "Fitness and spa" },
        text: { ru: "Тренажёрный зал, персональный тренер, душевые; SPA-зона с бассейном и сауной.", uz: "Trenajyorlar zali, shaxsiy trener, dush xonalari; basseyn va saunali SPA zonasi.", en: "Gym, personal trainer, showers, and a spa with a pool and sauna." },
        image: "/vatan/guide/fitness.jpg",
        stat: "89,1 m²",
      },
      {
        title: { ru: "Kid's Lab", uz: "Kid's Lab", en: "Kid's Lab" },
        text: { ru: "Детский клуб по возрастам: игровые зоны, развивающие занятия и услуги няни.", uz: "Yosh toifalari bo‘yicha o‘yin zonalari, rivojlantirish to‘garagi va enaga xizmatlari.", en: "A kids' club by age group: play zones, learning clubs and a nanny service." },
        image: "/vatan/guide/kids.jpg",
        stat: "155 m²",
      },
      {
        title: { ru: "Lounge Room", uz: "Lounge Room", en: "Lounge Room" },
        text: { ru: "Зал для семейных ужинов, дней рождения и встреч с соседями.", uz: "Oilaviy kechki ovqat, tug‘ilgan kunlar va qo‘shnilar bilan uchrashuvlar uchun zal.", en: "A hall for family dinners, birthdays and evenings with neighbours." },
        image: "/vatan/guide/lounge.jpg",
        stat: "137,8 m²",
      },
    ],
  },
  {
    id: "penthouses",
    eyebrow: { ru: "Пентхаусы", uz: "Pentxauslar", en: "Penthouses" },
    title: { ru: "Пентхаусы с террасой на высоте 53 метров", uz: "53 metr balandlikdagi terrasaga ega pentxauslar", en: "Penthouses with a terrace 53 metres up" },
    text: {
      ru: "Трёхуровневые пентхаусы — эксклюзив для рынка Узбекистана. Собственная озеленённая крыша с садом и бассейном, личный лифт внутри квартиры и панорамы города каждое утро. Потолки на жилых уровнях — 4,2 м, на закрытой террасе — 6,8 м.",
      uz: "Uch darajali pentxaus — O‘zbekiston ko‘chmas mulk bozorida tengi yo‘q eksklyuziv taklif. Obodonlashtirilgan shaxsiy ruftop, xonadon ichidagi shaxsiy lift va har kuni shaharning panorama manzaralari. Yashash sathlarida shift 4,2 m, yopiq terrasada 6,8 m.",
      en: "Three-level penthouses, an exclusive offer for Uzbekistan's market: a private landscaped rooftop with a garden and a pool, a personal lift inside the apartment and city views every morning. Ceilings are 4.2 m on the living levels and 6.8 m on the covered terrace.",
    },
    image: "/vatan/18.jpg",
    stats: [
      { value: "53 m", label: { ru: "высота террасы", uz: "terrasa balandligi", en: "terrace height" } },
      { value: "4,2 m", label: { ru: "потолки", uz: "shift balandligi", en: "ceilings" } },
      { value: "6,8 m", label: { ru: "потолок террасы", uz: "yopiq terrasa shifti", en: "terrace ceiling" } },
      { value: "3,7 m", label: { ru: "панорамные окна", uz: "panorama oynalar", en: "panoramic windows" } },
    ],
  },
  {
    id: "yard",
    eyebrow: { ru: "Двор и паркинг", uz: "Hovli va avtoturargoh", en: "Courtyard and parking" },
    title: { ru: "Зелёный двор и подземный паркинг", uz: "Yashil hovli va yerosti avtoturargohi", en: "A green courtyard and underground parking" },
    text: {
      ru: "По периметру комплекса — тенистые деревья, декоративные кустарники и сезонные цветы, во дворе — безопасные площадки для детей разного возраста и аллеи для прогулок. Машины — в двухуровневом подземном паркинге с широкими местами; предусмотрена возможность установки зарядных станций для электромобилей.",
      uz: "Majmua perimetri bo‘ylab soyabon daraxtlar, manzarali butalar va gullar, ichki hovlida bolalar uchun xavfsiz maydonchalar va sayr uchun yo‘lakchalar. Avtomobillar keng joylarga ega 2 qavatli yerosti avtoturargohida.",
      en: "Shady trees, ornamental shrubs and seasonal flowers line the complex, with safe playgrounds for every age and walking paths in the courtyard. Cars go to a two-level underground car park with wide bays, ready for electric-car charging stations.",
    },
    image: "/vatan/11.jpg",
    stats: [
      { value: "4 204 m²", label: { ru: "озеленения", uz: "yashil hudud", en: "of greenery" } },
      { value: "246", label: { ru: "машиномест", uz: "avtoturargoh", en: "parking spaces" } },
      { value: "2", label: { ru: "подземных уровня", uz: "yerosti qavati", en: "underground levels" } },
    ],
  },
  {
    id: "service",
    eyebrow: { ru: "Сервис", uz: "Servis", en: "Service" },
    title: { ru: "Консьерж и своя управляющая компания", uz: "Konsyerj-servis va xususiy boshqaruv kompaniyasi", en: "A concierge and the complex's own management" },
    text: {
      ru: "Консьерж-сервис 24/7 возьмёт на себя повседневные заботы: встретит гостей, примет доставку, вызовет такси и подскажет по любому вопросу. За чистоту, исправность инженерных систем и ремонт отвечает собственная управляющая компания премиального уровня.",
      uz: "Konsyerj-servis 24/7 kundalik tashvishlarni o‘z zimmasiga oladi: mehmonlarni kutib oladi, yetkazib berishni qabul qiladi, taksi chaqiradi. Tozalik va muhandislik tizimlarining sozligi uchun premium darajadagi xususiy boshqaruv kompaniyasi javob beradi.",
      en: "A 24/7 concierge takes care of everyday matters: meeting guests, taking deliveries, calling a taxi and answering any question. The complex's own premium management company keeps it clean and its engineering in order.",
    },
    image: "/vatan/guide/concierge.jpg",
    stats: [
      { value: "24/7", label: { ru: "консьерж", uz: "konsyerj", en: "concierge" } },
      { value: "2 243+", label: { ru: "жителей", uz: "yashovchi", en: "residents" } },
    ],
  },
];
