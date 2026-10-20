import type { GalleryPhoto, L10n, NewsItem, Project } from "@/lib/types";

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

/**
 * Initial content. Vatan Residence figures come from the official catalog;
 * every other project, the dates and the news are placeholders.
 */
export const SEED_PROJECTS: Project[] = [
  {
    id: "vatan",
    cat: "residential",
    status: "build",
    kind: "vatan",
    cover: "/vatan/08.jpg",
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
      { label: l("Общая площадь", "Umumiy maydon", "Total area"), value: "14 015 m²" },
      { label: l("Площадь участка", "Qurilish maydoni", "Land area"), value: "3 998 m²" },
      { label: l("Квартир", "Xonadon", "Apartments"), value: "641" },
      { label: l("Блоков", "Blok", "Blocks"), value: "8" },
      { label: l("Этажей", "Qavat", "Floors"), value: "16" },
      { label: l("Парковочных мест", "Avtoturargoh", "Parking spaces"), value: "246" },
      { label: l("Озеленение", "Yashil hudud", "Green area"), value: "4 204 m²" },
      { label: l("Жителей", "Yashovchilar", "Residents"), value: "2 243+" },
    ],
    features: [
      l("Smart-технологии: умный замок и климат-контроль", "Smart-texnologiyalar: aqlli qulf va iqlim nazorati", "Smart technology: smart lock and climate control"),
      l("Безопасность 24/7 и консьерж-сервис", "24/7 xavfsizlik va konsyerj-servis", "24/7 security and concierge service"),
      l("Подземный паркинг и озеленённые дворы", "Yerosti avtoturargohi va obod hovlilar", "Underground parking and landscaped courtyards"),
    ],
  },
  { id: "tower", cat: "commercial", status: "build", year: 2027, kind: "tower", gallery: [], facts: [], features: [],
    name: l("AD Tower", "AD Tower", "AD Tower"), desc: l("Бизнес-башня класса A", "A klassli biznes-minora", "Class A business tower") },
  { id: "garden", cat: "residential", status: "done", year: 2024, kind: "slab", gallery: [], facts: [], features: [],
    name: l("AD Garden", "AD Garden", "AD Garden"), desc: l("Жилой квартал с парком", "Bog‘li turar-joy kvartali", "Residential quarter with a park") },
  { id: "park", cat: "commercial", status: "done", year: 2023, kind: "blocks", gallery: [], facts: [], features: [],
    name: l("AD Business Park", "AD Business Park", "AD Business Park"), desc: l("Офисы и сервисные площади", "Ofis va xizmat maydonlari", "Offices and service space") },
  { id: "sky", cat: "residential", status: "plan", year: 2028, kind: "stepped", gallery: [], facts: [], features: [],
    name: l("AD Sky", "AD Sky", "AD Sky"), desc: l("Высотный жилой комплекс", "Ko‘p qavatli turar-joy majmuasi", "High-rise residential complex") },
  { id: "plaza", cat: "commercial", status: "done", year: 2022, kind: "blocks", gallery: [], facts: [], features: [],
    name: l("AD Plaza", "AD Plaza", "AD Plaza"), desc: l("Торговый центр с офисной частью", "Ofis qismli savdo markazi", "Shopping centre with offices") },
];

export const SEED_NEWS: NewsItem[] = [
  { id: "n1", date: "2026-10-02", title: l('Заложен фундамент Vatan Residence', 'Vatan Residence poydevori qo‘yildi', 'Foundation laid for Vatan Residence'), text: l('Началось строительство первой очереди комплекса.', 'Majmuaning birinchi navbati qurilishi boshlandi.', 'Construction of the first phase has begun.') },
  { id: "n2", date: "2026-09-18", title: l('Открыт набор на вакансии', 'Vakansiyalar uchun qabul ochildi', 'New vacancies open'), text: l('Ищем инженеров, прорабов и менеджеров по продажам.', 'Muhandislar, prorablar va sotuv menejerlari izlanmoqda.', 'Hiring engineers, site managers and sales managers.') },
  { id: "n3", date: "2026-08-25", title: l('Новый фирменный стиль AD Group', 'AD Group yangi firma uslubi', 'New AD Group identity'), text: l('Монограмма AD и геометрический паттерн из буквы A.', 'AD monogrammasi va A harfidan olingan geometrik pattern.', 'The AD monogram and a geometric pattern built from the letter A.') },
  { id: "n4", date: "2026-07-10", title: l('AD Business Park: 100% аренды', 'AD Business Park: 100% ijara', 'AD Business Park: fully leased'), text: l('Все офисные площади нашли арендаторов.', 'Barcha ofis maydonlari ijarachilarini topdi.', 'All office space now has tenants.') },
];
