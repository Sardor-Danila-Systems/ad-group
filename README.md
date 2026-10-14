# ad-group

Демо-сайт строительной компании AD Group (структура — как txt.group, стиль — брендбуки AD Group и Vatan Residence).

**Стек:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix).

## Запуск

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production-сборка (статическая)
npm run lint
```

## Структура
- `src/app/layout.tsx` — шрифты (next/font), метаданные, провайдеры
- `src/app/page.tsx` — сборка секций
- `src/app/globals.css` — токены бренда (#171F38, #D4DEE8; Vatan: #11264A / #C9935E) поверх переменных shadcn
- `src/components/site/` — секции: header, hero, projects, about, vatan, calculator, carousels (история, новости), footer (CTA, подвал, cookie, «наверх»), call-dialog
- `src/components/ui/` — компоненты shadcn (button, dialog, sheet, slider, carousel, toggle-group, card, …)
- `src/lib/content.ts` — тексты RU / UZ / EN и демо-данные
- `public/assets/` — логотипы, вырезанные из брендбуков

## Демо-ограничения
Названия проектов (кроме Vatan Residence), цифры, новости, адрес и телефон — placeholder. Форма звонка ничего не отправляет. Фото нет — здания нарисованы процедурным SVG (`building-art.tsx`).
Шрифт заголовков Cairo Now Extended заменён на Lexend Giga, Delmon Delicate — на Cormorant Garamond.
