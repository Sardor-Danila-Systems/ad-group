import type { GalleryPhoto, L10n, NewsItem, Person, Project, Settings, Vacancy } from "@/lib/types";

const l = (ru: string, uz: string, en: string): L10n => ({ ru, uz, en });
const ph = (n: number, w: number, h: number, alt: L10n): GalleryPhoto => ({ src: `/vatan/${String(n).padStart(2, "0")}.jpg`, w, h, alt });

/** Vatan Residence renders, in gallery order. */
const VATAN_GALLERY: GalleryPhoto[] = [
  ph(8, 1500, 1487, l("Фасад комплекса вечером", "Majmua jabhasi kechqurun", "Complex facade at night")),
  ph(14, 2000, 1653, l("Фасад, вид спереди", "Jabha, old tomondan ko‘rinish", "Front facade")),
  ph(7, 2000, 2000, l("Торговый павильон", "Savdo pavilyoni", "Retail pavilion")),
  ph(2, 2000, 1750, l("Входная группа и витрины", "Kirish guruhi va vitrinalar", "Entrance and shopfronts")),
  ph(4, 2000, 1750, l("Главный вход", "Asosiy kirish", "Main entrance")),
  ph(6, 1600, 2000, l("Верхние этажи и террасы", "Yuqori qavatlar va terrasalar", "Upper floors and terraces")),
  ph(5, 1415, 2000, l("Двор под дождём", "Yomg‘irdagi hovli", "Courtyard in the rain")),
  ph(15, 1514, 2000, l("Двор и башня", "Hovli va minora", "Courtyard and tower")),
  ph(10, 2000, 1414, l("Детская площадка", "Bolalar maydonchasi", "Playground")),
  ph(12, 2000, 1409, l("Двор вечером", "Hovli kechqurun", "Courtyard in the evening")),
  ph(11, 2000, 1414, l("Двор сверху", "Hovli yuqoridan", "Courtyard from above")),
  ph(9, 2000, 1414, l("Сад у торгового павильона", "Savdo pavilyoni yonidagi bog‘", "Garden by the retail pavilion")),
  ph(17, 2000, 1500, l("Подъезд, блок 2", "2-blok kirish joyi", "Residential entrance, block 2")),
  ph(13, 1500, 1161, l("Комплекс в окружении города", "Majmua shahar muhitida", "The complex in its surroundings")),
  ph(16, 2000, 1500, l("Терраса на крыше", "Tom terrasasi", "Roof terrace")),
  ph(1, 1500, 1500, l("Бассейн на террасе, день", "Terrasadagi basseyn, kunduzi", "Terrace pool by day")),
  ph(3, 1500, 1500, l("Бассейн на закате", "Botayotgan quyoshdagi basseyn", "Pool at sunset")),
  ph(18, 2000, 1115, l("Зона отдыха у бассейна", "Basseyn yonidagi dam olish zonasi", "Poolside lounge")),
];

const sogdiana = (n: number, w: number, h: number, alt: L10n): GalleryPhoto => ({ src: `/sogdiana/${String(n).padStart(2, "0")}.jpg`, w, h, alt });

const SOGDIANA_GALLERY: GalleryPhoto[] = [
  sogdiana(1, 1500, 1323, l("Дом с волнообразным фасадом", "To‘lqinsimon jabhali uy", "The building with its wave-shaped facade")),
  sogdiana(2, 1500, 1323, l("Фасад, вид с угла", "Jabha, burchakdan ko‘rinish", "Facade from the corner")),
  sogdiana(3, 2000, 1765, l("Фасад, вид спереди", "Jabha, old tomondan ko‘rinish", "Front facade")),
  sogdiana(4, 1500, 1323, l("Торговая галерея на улице", "Ko‘chadagi savdo galereyasi", "Retail gallery on the street")),
  sogdiana(5, 2000, 1126, l("Витрины первого этажа", "Birinchi qavat vitrinalari", "Ground-floor shopfronts")),
  sogdiana(6, 2000, 1126, l("Угол дома и въезд в паркинг", "Uy burchagi va avtoturargohga kirish", "Corner of the building and parking entrance")),
  sogdiana(7, 2000, 1126, l("Вид сверху", "Yuqoridan ko‘rinish", "View from above")),
  sogdiana(8, 2000, 1126, l("Вид сверху: двор и окружение", "Yuqoridan: hovli va atrof", "View from above: courtyard and surroundings")),
];

const urgutPh = (n: number, w: number, h: number): GalleryPhoto => ({ src: `/urgut/${String(n).padStart(2, "0")}.jpg`, w, h, alt: l(`Urgut Tower, визуализация ${n}`, `Urgut Tower, vizualizatsiya ${n}`, `Urgut Tower, render ${n}`) });
const URGUT_GALLERY: GalleryPhoto[] = [
  urgutPh(1, 2400, 1725),
  urgutPh(2, 1456, 1080),
  urgutPh(3, 1477, 1065),
  urgutPh(4, 2400, 1725),
  urgutPh(5, 2400, 1725),
  urgutPh(6, 1483, 1061),
  urgutPh(7, 1479, 1063),
  urgutPh(8, 2400, 1725),
  urgutPh(9, 2400, 1725),
  urgutPh(10, 2400, 1725),
  urgutPh(11, 2400, 1725),
  urgutPh(12, 2400, 1725),
  urgutPh(13, 2400, 1725),
  urgutPh(14, 2400, 1725),
  urgutPh(15, 2400, 1725),
  urgutPh(16, 2400, 1725),
  urgutPh(17, 2400, 1725),
  urgutPh(18, 2400, 1725),
  urgutPh(19, 2400, 1725),
  urgutPh(20, 2400, 1725),
  urgutPh(21, 1672, 941),
  urgutPh(22, 2400, 1725),
  urgutPh(23, 2400, 1725),
  urgutPh(24, 2400, 1725),
];

const yangiPh = (n: number, w: number, h: number): GalleryPhoto => ({ src: `/yangi-urgut/${String(n).padStart(2, "0")}.jpg`, w, h, alt: l(`Yangi Urgut Tower, визуализация ${n}`, `Yangi Urgut Tower, vizualizatsiya ${n}`, `Yangi Urgut Tower, render ${n}`) });
const YANGI_URGUT_GALLERY: GalleryPhoto[] = [
  yangiPh(1, 2400, 2000),
  yangiPh(2, 2400, 1601),
  yangiPh(3, 2400, 1600),
  yangiPh(4, 1920, 2400),
  yangiPh(5, 2244, 2400),
  yangiPh(6, 2400, 1578),
  yangiPh(7, 2400, 1413),
  yangiPh(8, 2400, 1497),
  yangiPh(9, 2400, 1339),
  yangiPh(10, 2400, 1049),
];

/**
 * Initial content, written to data/content.json on first run. Vatan Residence figures come from the
 * official catalog; Sogdiana Diamond House text is derived from its renders. Dates, vacancies and news are placeholders.
 */
export const SEED_PROJECTS: Project[] = [
  {
    id: "vatan",
    cat: "residential",
    status: "build",
    kind: "vatan",
    cover: "/vatan/08.jpg",
    logo: "/assets/logo-vatan.png",
    video: "/video/vatan-showroom.mp4",
    tagline: l("Постройте будущее на прочном фундаменте", "Kelajagingizni mustahkam poydevor ustiga quring", "Build your future on a solid foundation"),
    featured: true,
    gallery: VATAN_GALLERY,
    name: l("Vatan Residence", "Vatan Residence", "Vatan Residence"),
    desc: l("Жилой комплекс в Самарканде", "Samarqanddagi turar-joy majmuasi", "Residential complex in Samarkand"),
    long: l(
      "Vatan Residence — продуманный жилой комплекс в Самарканде: 8 блоков по 16 этажей, современная архитектура с национальным орнаментом, торговая галерея с бутиками и ресторанами на первых этажах, фитнес-центр, пешеходные улицы, озеленённые дворы и терраса с бассейном на крыше. Проект разработан совместно с архитектурным бюро UNIVER PRO STYLE.",
      "Vatan Residence — Samarqanddagi puxta o‘ylangan turar-joy majmuasi: 16 qavatli 8 ta blok, milliy naqshli zamonaviy arxitektura, birinchi qavatlarda butiklar va restoranlar bilan savdo galereyasi, fitnes-markaz, piyoda ko‘chalar, obod hovlilar va tomida basseynli terrasa. Loyiha UNIVER PRO STYLE arxitektura byurosi bilan hamkorlikda ishlab chiqilgan.",
      "Vatan Residence is a carefully planned residential complex in Samarkand: 8 blocks of 16 floors, modern architecture with a national ornament, a retail gallery with boutiques and restaurants on the ground floors, a fitness centre, pedestrian streets, landscaped courtyards and a rooftop terrace with a pool. Designed together with the UNIVER PRO STYLE architecture studio.",
    ),
    facts: [
      { label: l("Застройщик", "Quruvchi", "Developer"), value: "AD Group" },
      { label: l("Общая площадь", "Umumiy maydon", "Total area"), value: "14 015 m²" },
      { label: l("Площадь участка", "Qurilish maydoni", "Land area"), value: "3 998 m²" },
      { label: l("Квартир", "Xonadon", "Apartments"), value: "641" },
      { label: l("Блоков", "Blok", "Blocks"), value: "8" },
      { label: l("Этажей", "Qavat", "Floors"), value: "16" },
      { label: l("Парковочных мест", "Avtoturargoh", "Parking spaces"), value: "246" },
      { label: l("Озеленение", "Yashil hudud", "Green area"), value: "4 204 m²" },
    ],
    features: [
      l("Smart-технологии: умный замок и климат-контроль", "Smart-texnologiyalar: aqlli qulf va iqlim nazorati", "Smart technology: smart lock and climate control"),
      l("Безопасность 24/7 и консьерж-сервис", "24/7 xavfsizlik va konsyerj-servis", "24/7 security and concierge service"),
      l("Подземный паркинг и озеленённые дворы", "Yerosti avtoturargohi va obod hovlilar", "Underground parking and landscaped courtyards"),
    ],
  },
  {
    id: "sogdiana-diamond-house",
    cat: "residential",
    status: "build",
    year: 2026,
    kind: "tower",
    cover: "/sogdiana/01.jpg",
    gallery: SOGDIANA_GALLERY,
    name: l("Sogdiana Diamond House", "Sogdiana Diamond House", "Sogdiana Diamond House"),
    tagline: l("Новый стандарт городской жизни", "Shahar hayotining yangi standarti", "A new standard of urban living"),
    desc: l("Премиальный жилой комплекс в Самарканде", "Samarqanddagi premium turar-joy majmuasi", "Premium residential development in Samarkand"),
    long: l(
      "Sogdiana Diamond House — премиальный жилой комплекс в Самарканде, в котором сочетаются современная архитектура, комфортная жизнь и оживлённая торговая улица на первых этажах. Выразительный волнообразный фасад, качественные материалы и продуманные пространства задают городу новый стандарт современной жизни.",
      "Sogdiana Diamond House — Samarqanddagi premium turar-joy majmuasi bo‘lib, unda zamonaviy arxitektura, qulay hayot va birinchi qavatlardagi jonli savdo ko‘chasi uyg‘unlashgan. O‘ziga xos to‘lqinsimon jabha, sifatli materiallar va puxta o‘ylangan makonlar shaharga zamonaviy hayotning yangi standartini olib kiradi.",
      "Sogdiana Diamond House is a premium residential development in Samarkand, combining modern architecture, comfortable living and an active street-level retail environment. With its distinctive curved façade, high-quality materials and thoughtfully designed spaces, the project brings a new standard of contemporary urban living to the city.",
    ),
    facts: [
      { label: l("Застройщик", "Quruvchi", "Developer"), value: "AD Group" },
      { label: l("Класс", "Sinf", "Market position"), value: "Premium" },
      { label: l("Общая площадь", "Umumiy maydon", "Development scale"), value: "12 000 m²" },
      { label: l("Площадь участка", "Yer maydoni", "Land area"), value: "0,5 ha" },
      { label: l("Жилых блоков", "Turar-joy bloklari", "Residential blocks"), value: "2" },
      { label: l("Этажей", "Qavat", "Floors"), value: "12" },
      { label: l("Объём проекта", "Loyiha qiymati", "Project value"), value: "USD 16.8M" },
      { label: l("Начало строительства", "Qurilish boshlangan", "Construction start"), value: "2024" },
      { label: l("Сдача", "Topshirish", "Target handover"), value: "12.2026" },
    ],
    features: [
      l("Волнообразный фасад", "To‘lqinsimon jabha", "Distinctive curved façade"),
      l("Торговая галерея на первом этаже", "Birinchi qavatda savdo galereyasi", "Street-level retail gallery"),
      l("Подземный паркинг", "Yerosti avtoturargohi", "Underground parking"),
      l("Остеклённые балконы с озеленением", "Oynalangan va ko‘kalamzor balkonlar", "Glazed balconies with planting"),
    ],
  },

  {
    id: "urgut-tower",
    cat: "residential",
    status: "build",
    kind: "tower",
    cover: "/urgut/01.jpg",
    gallery: URGUT_GALLERY,
    name: l("Urgut Tower", "Urgut Tower", "Urgut Tower"),
    tagline: l("Адрес надёжного будущего", "Ishonchli kelajak manzili", "The address of a reliable future"),
    desc: l("Жилой комплекс в массиве «Янги Узбекистан», Ургут", "Urgut tumanidagi “Yangi O‘zbekiston” massivida turar-joy majmuasi", "Residential complex in the Yangi Uzbekistan district, Urgut"),
    long: l(
      "Urgut Tower — современный жилой комплекс, который AD Group строит в массиве «Янги Узбекистан» Ургутского района. Проект состоит из 4 шестнадцатиэтажных домов, всего 512 квартир. Дома возводятся по монолитной железобетонной технологии с учётом сейсмических требований 8–9 баллов. В комплексе предусмотрены парковка примерно на 400 автомобилей, квартиры с удобными планировками и современные архитектурные решения. Urgut Tower — сочетание комфорта, качества и надёжности для вашей семьи.",
      "URGUT TOWER — AD GROUP tomonidan Urgut tumanining “Yangi O‘zbekiston” massivida barpo etilayotgan zamonaviy turar joy majmuasi. Loyiha 16 qavatli 4 ta binodan iborat bo‘lib, jami 512 ta xonadonni o‘z ichiga oladi. Binolar monolit temir-beton texnologiyasi asosida, 8–9 ballik seysmik talablarni hisobga olgan holda qurilmoqda. Majmuada 400 ga yaqin avtomobil uchun avtoturargoh, qulay rejalashtirilgan xonadonlar va zamonaviy arxitektura yechimlari ko‘zda tutilgan. URGUT TOWER — oilangiz uchun qulaylik, sifat va ishonch uyg‘unligi!",
      "Urgut Tower is a modern residential complex that AD Group is building in the Yangi Uzbekistan district of Urgut. The project consists of four 16-storey buildings with 512 apartments in total. The buildings use cast-in-place reinforced concrete and are designed for seismic intensity 8–9. The complex includes parking for about 400 cars, well-planned apartments and modern architecture. Urgut Tower brings comfort, quality and reliability together for your family.",
    ),
    facts: [
      { label: l("Застройщик", "Quruvchi", "Developer"), value: "AD Group" },
      { label: l("Домов", "Binolar", "Buildings"), value: "4" },
      { label: l("Этажей", "Qavat", "Floors"), value: "16" },
      { label: l("Квартир", "Xonadon", "Apartments"), value: "512" },
      { label: l("Парковочных мест", "Avtoturargoh", "Parking spaces"), value: "~400" },
      { label: l("Сейсмостойкость, баллов", "Seysmik bardoshlilik, ball", "Seismic rating"), value: "8–9" },
    ],
    features: [
      l("Монолитный железобетонный каркас", "Monolit temir-beton karkas", "Cast-in-place reinforced concrete frame"),
      l("Сейсмостойкость 8–9 баллов", "8–9 ballik seysmik bardoshlilik", "Designed for seismic intensity 8–9"),
      l("Парковка примерно на 400 автомобилей", "400 ga yaqin avtomobil uchun avtoturargoh", "Parking for about 400 cars"),
      l("Квартиры с удобными планировками", "Qulay rejalashtirilgan xonadonlar", "Well-planned apartments"),
    ],
  },
  {
    id: "yangi-urgut-tower",
    cat: "residential",
    status: "build",
    year: 2029,
    kind: "stepped",
    cover: "/yangi-urgut/01.jpg",
    gallery: YANGI_URGUT_GALLERY,
    name: l("Yangi Urgut Tower", "Yangi Urgut Tower", "Yangi Urgut Tower"),
    tagline: l("Новый шаг к новой жизни", "Yangi hayot sari yangi qadam", "A new step towards a new life"),
    desc: l("Жилой комплекс у въезда в массив «Янги Узбекистан», Ургут", "Urgut tumanidagi “Yangi O‘zbekiston” massivi kirishidagi turar-joy majmuasi", "Residential complex at the entrance to the Yangi Uzbekistan district, Urgut"),
    long: l(
      "Yangi Urgut Tower — современный жилой комплекс, который AD Group строит у въезда в 90-гектарный массив «Янги Узбекистан» Ургутского района. Проект занимает 6 гектаров и включает 13 жилых домов высотой 9 и 12 этажей. Комплекс объединяет современную архитектуру, квартиры с удобными планировками и среду, созданную для семейной жизни. Квартиры предлагаются с ремонтом и без ремонта. Сдача в эксплуатацию запланирована на III квартал 2029 года.",
      "YANGI URGUT TOWER — AD GROUP tomonidan Urgut tumanidagi 90 gektarlik “Yangi O‘zbekiston” massivining kirish qismida barpo etilayotgan zamonaviy turar joy majmuasi. Loyiha umumiy 6 gektar maydonda joylashgan bo‘lib, 9 va 12 qavatli 13 ta turar joy binosidan iborat. Majmua zamonaviy arxitektura, qulay rejalashtirilgan xonadonlar va oilaviy hayot uchun mo‘ljallangan yashash muhitini o‘zida mujassam etadi. Xonadonlar ta’mirlangan va ta’mirsiz holatda taklif etiladi. Loyihani 2029-yilning III choragida foydalanishga topshirish rejalashtirilgan.",
      "Yangi Urgut Tower is a modern residential complex that AD Group is building at the entrance to the 90-hectare Yangi Uzbekistan district of Urgut. The project covers 6 hectares and includes 13 residential buildings of 9 and 12 storeys. It combines modern architecture, well-planned apartments and an environment designed for family life. Apartments are offered with or without finishing. Completion is planned for Q3 2029.",
    ),
    facts: [
      { label: l("Застройщик", "Quruvchi", "Developer"), value: "AD Group" },
      { label: l("Площадь участка", "Yer maydoni", "Land area"), value: "6 ha" },
      { label: l("Жилых домов", "Turar-joy binolari", "Residential buildings"), value: "13" },
      { label: l("Этажность", "Qavatlar", "Storeys"), value: "9 / 12" },
      { label: l("Сдача", "Topshirish", "Completion"), value: "Q3 2029" },
    ],
    features: [
      l("Въезд в 90-гектарный массив «Янги Узбекистан»", "90 gektarlik “Yangi O‘zbekiston” massivining kirish qismi", "At the entrance to the 90-hectare Yangi Uzbekistan district"),
      l("Квартиры с ремонтом и без ремонта", "Ta’mirlangan va ta’mirsiz xonadonlar", "Apartments with or without finishing"),
      l("Удобные планировки для семей", "Oilalar uchun qulay rejalar", "Family-friendly layouts"),
      l("Современная архитектура", "Zamonaviy arxitektura", "Modern architecture"),
    ],
  },
];

export const SEED_NEWS: NewsItem[] = [
  { id: "n1", date: "2026-10-14", title: l("Готов каталог Vatan Residence", "Vatan Residence katalogi tayyor", "Vatan Residence catalog is ready"), text: l("84 страницы о концепции, планировках и инфраструктуре комплекса.", "Majmuaning kontseptsiyasi, rejalari va infratuzilmasi haqida 84 sahifa.", "84 pages on the concept, layouts and infrastructure of the complex.") },
  { id: "n2", date: "2026-10-20", title: l("Новый проект: Sogdiana Diamond House", "Yangi loyiha: Sogdiana Diamond House", "New project: Sogdiana Diamond House"), text: l("Жилой дом с торговой галереей от AD Group.", "AD Group’dan savdo galereyali turar-joy uyi.", "A residential building with a retail gallery by AD Group.") },
  { id: "n3", date: "2026-08-25", title: l("Новый фирменный стиль AD Group", "AD Group yangi firma uslubi", "New AD Group identity"), text: l("Монограмма AD и геометрический паттерн из буквы A.", "AD monogrammasi va A harfidan olingan geometrik pattern.", "The AD monogram and a geometric pattern built from the letter A.") },
];

const vac = (id: string, title: L10n, summary: L10n, reqs: L10n[]): Vacancy => ({
  id,
  title,
  dept: l("Строительство", "Qurilish", "Construction"),
  city: l("Самарканд", "Samarqand", "Samarkand"),
  type: "full",
  summary,
  requirements: reqs,
  open: true,
  createdAt: "2026-10-20T09:00:00.000Z",
});

/** Placeholders so the page has a shape; replace them in the admin panel. */
export const SEED_VACANCIES: Vacancy[] = [
  vac(
    "site-engineer",
    l("Инженер-строитель", "Qurilish muhandisi", "Site engineer"),
    l("Ведение объекта, контроль графика и качества работ на жилом комплексе.", "Turar-joy majmuasida obyektni yuritish, jadval va ish sifatini nazorat qilish.", "Running a site, controlling schedule and quality of works on a residential complex."),
    [l("Высшее строительное образование", "Oliy qurilish ma’lumoti", "Higher education in civil engineering"), l("Опыт на монолитных объектах от 3 лет", "Monolit obyektlarda 3 yildan ortiq tajriba", "3+ years on cast-in-place sites"), l("Умение читать чертежи и вести документацию", "Chizmalarni o‘qish va hujjat yuritish ko‘nikmasi", "Able to read drawings and keep documentation")],
  ),
  {
    ...vac(
      "sales-manager",
      l("Менеджер по продажам", "Sotuv menejeri", "Sales manager"),
      l("Консультации клиентов по квартирам и коммерческим помещениям, сопровождение сделки.", "Mijozlarga xonadonlar va tijorat maydonlari bo‘yicha maslahat, bitimni qo‘llab-quvvatlash.", "Advising clients on apartments and commercial space and guiding the deal."),
      [l("Опыт продаж недвижимости приветствуется", "Ko‘chmas mulk sotuvi tajribasi afzal", "Real estate sales experience is a plus"), l("Грамотная речь на русском и узбекском", "Rus va o‘zbek tillarida ravon nutq", "Fluent Russian and Uzbek"), l("Ориентация на результат", "Natijaga yo‘nalganlik", "Result orientation")],
    ),
    dept: l("Продажи", "Sotuv", "Sales"),
  },
  {
    ...vac(
      "site-foreman",
      l("Прораб", "Prorab", "Site foreman"),
      l("Организация работ бригад на объекте, приёмка работ, соблюдение техники безопасности.", "Obyektda brigadalar ishini tashkil etish, ishlarni qabul qilish, xavfsizlik texnikasiga rioya.", "Organising crews on site, accepting works and enforcing safety rules."),
      [l("Опыт работы прорабом от 5 лет", "Prorab sifatida 5 yildan ortiq tajriba", "5+ years as a foreman"), l("Знание технологий отделочных и монолитных работ", "Pardozlash va monolit ishlar texnologiyalarini bilish", "Knowledge of finishing and cast-in-place works"), l("Готовность к работе на объекте", "Obyektda ishlashga tayyorlik", "Ready to work on site")],
    ),
  },
];

export const SEED_FOUNDER: Person = {
  name: l("Асадов Азамат Нуриллаевич", "Asadov Azamat Nurillayevich", "Asadov Azamat Nurillayevich"),
  role: l("Основатель AD Group", "AD Group asoschisi", "Founder of AD Group"),
  quote: l(
    "Дом — это не просто стены. Здесь начинается чья-то жизнь. Поэтому мы относимся серьёзно к каждой детали.",
    "Uy — bu shunchaki devorlar emas. Bu yerda kimningdir hayoti boshlanadi. Shuning uchun biz har bir detalga jiddiy qaraymiz.",
    "A home is not just walls. Someone’s life begins here. That is why we take every detail seriously.",
  ),
  p1: l(
    "Мы создаём проекты, которые становятся частью городской среды. В каждом решении учитываем окружение, повседневную жизнь людей и их будущие потребности.",
    "Biz shahar muhitining bir qismiga aylanadigan loyihalar yaratamiz. Har bir qarorda atrof-muhitni, odamlarning kundalik hayotini va kelajakdagi ehtiyojlarini hisobga olamiz.",
    "We create projects that become part of the urban environment. In every decision we consider the surroundings, everyday life and future needs of people.",
  ),
  p2: l(
    "Финансовый успех — естественный результат. Но наша цель — проекты, которые сохранят ценность на многие годы и будут полезны людям.",
    "Moliyaviy muvaffaqiyat — tabiiy natija. Lekin bizning maqsadimiz — uzoq yillar qiymatini saqlaydigan va odamlarga foyda keltiradigan loyihalar.",
    "Financial success is a natural result. But our real goal is projects that keep their value for many years and stay useful to people.",
  ),
  photo: "/team/founder.jpg",
};

/** Placeholder text for the CEO block: replace it in the admin panel. */
export const SEED_CEO: Person = {
  name: l("Саидов Акмаль Максудович", "Saidov Akmal Maqsudovich", "Saidov Akmal Maqsudovich"),
  role: l("Сооснователь и CEO", "Hammuassis va CEO", "Co-founder and CEO"),
  quote: l(
    "Мы строим не просто здания, а среду, в которой людям хочется жить и работать.",
    "Biz shunchaki binolar emas, odamlar yashashni va ishlashni xohlaydigan muhit quramiz.",
    "We build not just buildings but an environment where people want to live and work.",
  ),
  p1: l(
    "За каждым проектом стоит команда инженеров, архитекторов и строителей. Моя задача — чтобы сроки, качество и обещания перед клиентами всегда совпадали.",
    "Har bir loyiha ortida muhandislar, arxitektorlar va quruvchilar jamoasi turadi. Mening vazifam — muddat, sifat va mijozlar oldidagi va’dalar doim mos kelishini ta’minlash.",
    "Behind every project is a team of engineers, architects and builders. My job is to make sure deadlines, quality and our promises to clients always match.",
  ),
  p2: l(
    "Мы открыты к сотрудничеству с партнёрами и инвесторами и всегда рады талантливым людям, которые хотят расти вместе с компанией.",
    "Biz hamkorlar va investorlar bilan hamkorlikka ochiqmiz va kompaniya bilan birga o‘sishni istagan iqtidorli insonlardan doim xursandmiz.",
    "We are open to partners and investors and always glad to meet talented people who want to grow with the company.",
  ),
  photo: "/team/ceo.jpg",
};

/** Instagram accounts per direction (from the client, 31.10). */
export const SEED_DIRECTIONS: Settings["directions"] = {
  construction: { instagram: ["https://www.instagram.com/ad_group.uz/"] },
  service: { instagram: ["https://www.instagram.com/adbellagio/", "https://www.instagram.com/asador.rest/"] },
  logistics: { instagram: ["https://www.instagram.com/adexpress_trucking_llc_/"] },
};

export const SEED_SETTINGS: Settings = {
  founder: SEED_FOUNDER,
  ceo: SEED_CEO,
  // Instagram accounts of the directions (editable in the admin panel). Photos: built-in until set there.
  directions: SEED_DIRECTIONS,
  contacts: {
    phone: "+998 66 230 00 00",
    email: "adgroup@gmail.com",
    address: l("Самарканд, адрес — placeholder", "Samarqand, manzil — placeholder", "Samarkand, address — placeholder"),
    hours: "09:00 – 18:00",
    instagram: "vatan.residence",
    telegram: "vatan_residence",
  },
};
