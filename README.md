# ad-group

Сайт строительной компании AD Group: главная, проекты и страницы ЖК, раздел «Направления», форма заявки, админка.

**Стек:** Next.js (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · shadcn/ui · react-icons.

## Запуск

```bash
npm install
cp .env.example .env.local   # задайте ADMIN_PASSWORD и SESSION_SECRET
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint
```

## Админка

`/admin` (вход по паролю `ADMIN_PASSWORD`). Что можно делать:

- **ЖК и проекты:** названия и описания на RU/UZ/EN, тип, статус, год, цена, обложка, галерея (порядок и удаление фото), цифры и преимущества; галочка «Показывать большим блоком на главной»
- **Новости:** заголовок, текст, дата, картинка
- **Заявки:** всё, что отправлено формами на сайте

Изменения появляются на сайте сразу. Фото при загрузке сжимаются и переводятся в WebP (до 12 МБ на файл, JPG/PNG/WebP/AVIF).

### Где хранятся данные

В папке `data/` (или в `DATA_DIR`): `content.json`, `leads.json`, `uploads/`. Папка не попадает в git. Пока `content.json` нет, сайт показывает стартовые данные из `src/lib/seed.ts`.

> Хранилище файловое, поэтому сайту нужен постоянный диск (свой сервер, VPS, Docker-том). На Vercel и другом serverless-хостинге файлы не сохраняются: там потребуются база данных и объектное хранилище. Весь доступ к данным собран в `src/lib/server/store.ts`, заменить нужно только его.

### Безопасность

- Сессия — подписанная HMAC cookie (httpOnly, sameSite=lax, secure в production) на 7 дней
- `src/proxy.ts` быстро отправляет на вход запросы без cookie; подпись проверяется в layout админки и в каждом server action
- Загрузки: проверка типа и размера, перекодирование через sharp (метаданные удаляются), случайные имена, раздача через `/uploads/[name]` с защитой от выхода из папки
- Форма заявки: проверка на сервере и скрытое поле-ловушка для ботов

## Структура
- `src/app` — страницы: `/`, `/directions`, `/projects/[id]`, `/admin/*`, `/uploads/[name]`
- `src/components/site` — секции сайта; `src/components/admin` — формы админки; `src/components/ui` — shadcn
- `src/actions` — server actions (заявки, админка)
- `src/lib/types.ts`, `seed.ts`, `content.ts` (тексты интерфейса RU/UZ/EN), `content-source.ts` (чтение с кэшем), `server/` (хранилище, авторизация)
- `public/assets`, `public/textures`, `public/vatan`, `public/team` — логотипы, мраморная текстура, фото ЖК, фото основателя

## Демо-ограничения
Данные Vatan Residence взяты из официального каталога; остальные проекты, цифры в шапке главной, история, новости, адрес и e-mail — заглушки. Имя основателя в блоке с фото — «Имя Фамилия». Шрифт заголовков Cairo Now Extended и шрифт Vatan Delmon Delicate заменены на Cormorant Garamond.
