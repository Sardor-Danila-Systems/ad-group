import type { L10n } from "@/lib/content";

export interface Photo {
  src: string;
  w: number;
  h: number;
  alt: L10n;
}

const p = (n: number, w: number, h: number, ru: string, uz: string, en: string): Photo => ({
  src: `/vatan/${String(n).padStart(2, "0")}.jpg`,
  w,
  h,
  alt: { ru, uz, en },
});

/** Vatan Residence renders, in gallery order. */
export const VATAN_PHOTOS: Photo[] = [
  p(8, 1500, 1487, "Фасад комплекса вечером", "Majmua jabhasi kechqurun", "Complex facade at night"),
  p(14, 2000, 1653, "Фасад, вид спереди", "Jabha, old tomondan ko‘rinish", "Front facade"),
  p(7, 2000, 2000, "Торговый павильон", "Savdo pavilyoni", "Retail pavilion"),
  p(2, 2000, 1750, "Входная группа и витрины", "Kirish guruhi va vitrinalar", "Entrance and shopfronts"),
  p(4, 2000, 1750, "Главный вход", "Asosiy kirish", "Main entrance"),
  p(6, 1600, 2000, "Верхние этажи и террасы", "Yuqori qavatlar va terrasalar", "Upper floors and terraces"),
  p(5, 1415, 2000, "Двор под дождём", "Yomg‘irdagi hovli", "Courtyard in the rain"),
  p(15, 1514, 2000, "Двор и башня", "Hovli va minora", "Courtyard and tower"),
  p(10, 2000, 1414, "Детская площадка", "Bolalar maydonchasi", "Playground"),
  p(12, 2000, 1409, "Двор вечером", "Hovli kechqurun", "Courtyard in the evening"),
  p(11, 2000, 1414, "Двор сверху", "Hovli yuqoridan", "Courtyard from above"),
  p(9, 2000, 1414, "Сад у торгового павильона", "Savdo pavilyoni yonidagi bog‘", "Garden by the retail pavilion"),
  p(17, 2000, 1500, "Подъезд, блок 2", "2-blok kirish joyi", "Residential entrance, block 2"),
  p(13, 1500, 1161, "Комплекс в окружении города", "Majmua shahar muhitida", "The complex in its surroundings"),
  p(16, 2000, 1500, "Терраса на крыше", "Tom terrasasi", "Roof terrace"),
  p(1, 1500, 1500, "Бассейн на террасе, день", "Terrasadagi basseyn, kunduzi", "Terrace pool by day"),
  p(3, 1500, 1500, "Бассейн на закате", "Botayotgan quyoshdagi basseyn", "Pool at sunset"),
  p(18, 2000, 1115, "Зона отдыха у бассейна", "Basseyn yonidagi dam olish zonasi", "Poolside lounge"),
];
