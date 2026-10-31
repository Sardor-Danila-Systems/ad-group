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
    kind: "tower",
    cover: "/sogdiana/01.jpg",
    gallery: SOGDIANA_GALLERY,
    name: l("Sogdiana Diamond House", "Sogdiana Diamond House", "Sogdiana Diamond House"),
    desc: l("Жилой дом с торговой галереей на первом этаже", "Birinchi qavatida savdo galereyasi bor turar-joy uyi", "Residential building with a retail gallery on the ground floor"),
    long: l(
      "Sogdiana Diamond House — жилой дом от AD Group с волнообразным фасадом, остеклёнными балконами с деревянной подшивкой и торговой галереей на первом этаже. Во дворе детская площадка, въезд в подземный паркинг организован со стороны улицы.",
      "Sogdiana Diamond House — AD Group qurgan, to‘lqinsimon jabhali, yog‘och ostli oynalangan balkonlari va birinchi qavatida savdo galereyasi bor turar-joy uyi. Hovlida bolalar maydonchasi, yerosti avtoturargohiga kirish ko‘cha tomonidan.",
      "Sogdiana Diamond House is a residential building by AD Group with a wave-shaped facade, glazed balconies with timber soffits and a retail gallery on the ground floor. There is a playground in the courtyard and an underground parking entrance from the street.",
    ),
    facts: [{ label: l("Застройщик", "Quruvchi", "Developer"), value: "AD Group" }],
    features: [
      l("Торговая галерея на первом этаже", "Birinchi qavatda savdo galereyasi", "Retail gallery on the ground floor"),
      l("Подземный паркинг", "Yerosti avtoturargohi", "Underground parking"),
      l("Остеклённые балконы с озеленением", "Oynalangan va ko‘kalamzor balkonlar", "Glazed balconies with planting"),
      l("Детская площадка во дворе", "Hovlida bolalar maydonchasi", "Playground in the courtyard"),
    ],
  },
  // Materials (photos, texts, figures) for these two are still to come; the cards hold neutral placeholders.
  {
    id: "urgut-tower",
    cat: "residential",
    status: "plan",
    kind: "tower",
    gallery: [],
    facts: [{ label: l("Застройщик", "Quruvchi", "Developer"), value: "AD Group" }],
    features: [],
    name: l("Urgut Tower", "Urgut Tower", "Urgut Tower"),
    desc: l("Новый жилой проект AD Group", "AD Group’ning yangi turar-joy loyihasi", "A new residential project by AD Group"),
    long: l(
      "Urgut Tower — новый жилой проект AD Group. Фотографии, планировки и характеристики появятся здесь в ближайшее время. Оставьте заявку, чтобы первыми узнать о старте продаж.",
      "Urgut Tower — AD Group’ning yangi turar-joy loyihasi. Rasmlar, rejalar va xususiyatlar tez orada shu yerda paydo bo‘ladi. Sotuv boshlanishi haqida birinchilardan bo‘lib bilish uchun ariza qoldiring.",
      "Urgut Tower is a new residential project by AD Group. Photos, layouts and specifications will appear here soon. Leave a request to be the first to hear when sales open.",
    ),
  },
  {
    id: "yangi-urgut-tower",
    cat: "residential",
    status: "plan",
    kind: "stepped",
    gallery: [],
    facts: [{ label: l("Застройщик", "Quruvchi", "Developer"), value: "AD Group" }],
    features: [],
    name: l("Yangi Urgut Tower", "Yangi Urgut Tower", "Yangi Urgut Tower"),
    desc: l("Новый жилой проект AD Group", "AD Group’ning yangi turar-joy loyihasi", "A new residential project by AD Group"),
    long: l(
      "Yangi Urgut Tower — новый жилой проект AD Group. Фотографии, планировки и характеристики появятся здесь в ближайшее время. Оставьте заявку, чтобы первыми узнать о старте продаж.",
      "Yangi Urgut Tower — AD Group’ning yangi turar-joy loyihasi. Rasmlar, rejalar va xususiyatlar tez orada shu yerda paydo bo‘ladi. Sotuv boshlanishi haqida birinchilardan bo‘lib bilish uchun ariza qoldiring.",
      "Yangi Urgut Tower is a new residential project by AD Group. Photos, layouts and specifications will appear here soon. Leave a request to be the first to hear when sales open.",
    ),
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

export const SEED_SETTINGS: Settings = {
  founder: SEED_FOUNDER,
  ceo: SEED_CEO,
  contacts: {
    phone: "+998 66 230 00 00",
    email: "adgroup@gmail.com",
    address: l("Самарканд, адрес — placeholder", "Samarqand, manzil — placeholder", "Samarkand, address — placeholder"),
    hours: "09:00 – 18:00",
    instagram: "vatan.residence",
    telegram: "vatan_residence",
  },
};
