import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
export const translations = {
  uz: {
    fullMenu: "To‘liq menyu",
    searchMenu: "Taom nomi bo‘yicha qidirish",
    searchPlaceholder: "Taom nomini kiriting",
    category: "Kategoriya",
    allCategories: "Barchasi",
    uncategorized: "Kategoriyasi kiritilmagan",
    categoriesPending: "Taomlar uchun kategoriyalar hali kiritilmagan.",
    results: "Topilgan taomlar",
    noResults: "Mos taom topilmadi",
    resetFilters: "Filtrlarni tozalash",
    dishDetails: "Taomni ko‘rish",
    previousImage: "Oldingi rasm",
    nextImage: "Keyingi rasm",
    notFound: "Sahifa topilmadi",
    notFoundText:
      "Bu manzilda sahifa mavjud emas. Bosh sahifaga qaytishingiz mumkin.",
    backHome: "Bosh sahifaga qaytish",
    viewFullMenu: "To‘liq menyuni ko‘rish",
    viewGallery: "Galereyani ko‘rish",

    nav: [
      "Bosh sahifa",
      "Biz haqimizda",
      "Xonalar",
      "Menyu",
      "Galereya",
      "Aloqa",
    ],
    brand: "O‘ktam ota choyxonasi",
    tag: "O‘KTAM OTA CHOYXONASI",
    heroTitle: "Yaqinlaringiz bilan shinam davralar uchun",
    heroText:
      "Jizzaxdagi O‘ktam ota choyxonasida sizni shinam xonalar va qulay muhit kutadi.",
    call: "Qo‘ng‘iroq qilish",
    seeRooms: "Xonalar bilan tanishish",
    decorative:
      "Bezak uchun yaratilgan tasvir. Choyxonaning haqiqiy surati emas.",
    stats: ["20 ta xona", "10 kishilik", "Konditsioner"],
    statText: [
      "Yaqinlar davrasi uchun shinam xonalar",
      "Har bir xona 10 kishiga mo‘ljallangan",
      "Xonalarda qulay harorat uchun",
    ],
    aboutTitle: "Biz haqimizda",
    aboutText:
      "O‘ktam ota choyxonasi — Jizzaxda yaqinlaringiz bilan bir dasturxon atrofida jam bo‘lish uchun shinam maskan. 20 ta xonamizning har biri 10 kishiga mo‘ljallangan.",
    aboutText2:
      "Shinam mebellar va konditsioner suhbat hamda birga o‘tkaziladigan vaqtni yanada qulay qiladi.",
    more: "Xonalar bilan tanishish",
    roomsTitle: "Davrangiz uchun qulay joy",
    roomsTag: "XONALAR",
    roomsText:
      "Oila va yaqinlar davrasi uchun shinam muhit. Har bir xona 10 kishiga mo‘ljallangan, shinam mebellar va konditsioner bilan jihozlangan.",
    roomFeatures: [
      "20 ta xona",
      "Har biri 10 kishilik",
      "Shinam mebellar",
      "Konditsioner",
    ],
    askRooms: "Xonalar haqida so‘rash",
    roomArt: "Xonaning bezak chizmasi",
    menuTitle: "Menyu",
    menuSoon: "Menyumiz tez orada shu yerda",
    menuText:
      "Menyu bo‘limi tayyorlanmoqda. Taomlar, porsiyalar va narxlar haqida tez orada shu yerda tanishishingiz mumkin bo‘ladi.",
    galleryTitle: "Galereya",
    gallerySoon: "Choyxonamiz suratlari tez orada qo‘shiladi",
    galleryText: "Haqiqiy xonalarimiz va muhitimizni shu yerda ko‘rsatamiz.",
    faqTitle: "Tez-tez so‘raladigan savollar",
    faqQ: ["Choyxona qayerda joylashgan?", "Ish vaqti qanday?", "Yakshanba kuni ochiqmi?", "Chorshanba doim dam olish kunimi?", "Xonalarga nechta odam sig‘adi?", "Xonalarda qanday qulayliklar bor?", "Menyuni telefondan ko‘rsa bo‘ladimi?", "Saytdan taom buyurtma yoki xona bron qilish mumkinmi?", "Go‘shtning manbasi va taom tarkibini qanday bilaman?", "Narx va porsiyani qanday aniqlashtiraman?"],
    faqA: ["Sarvar Azimov ko‘chasi 47, 131100, Jizzax, Jizzax viloyati, O‘zbekiston. Aniq yo‘lni telefon orqali so‘rashingiz mumkin.", "09:00 dan 23:50 gacha. Tashrifdan oldin shu kundagi ish tartibini aniqlashtiring.", "Ha, yakshanba kunlari ham ishlaydi.", "Yo‘q. Faqat ayrim chorshanbalarda dam beriladi. Kelishdan oldin telefon orqali aniqlashtiring.", "20 ta xona bor. Har bir xona 10 kishiga mo‘ljallangan.", "Shinam mebellar va konditsioner mavjud.", "Ha. /menu sahifasida taomlarni ko‘ring, nomi bo‘yicha qidiring va kategoriyani tanlang.", "Sayt tanishish uchun. Unda onlayn bron yoki buyurtma yo‘q. Taom buyurtmasi xodim orqali beriladi.", "Taom kartochkasini oching. Yetkazib beruvchi, aniq tarkib yoki allergenlar haqida ma’lumot bo‘lmasa, xodimdan so‘rang.", "Hali ko‘rsatilmagan narx va porsiyalarni xodimdan telefon orqali yoki tashrif vaqtida so‘rang."],
    contactTitle: "Aloqa",
    contactText:
      "Xonalar va ish tartibi haqida ma’lumot olish uchun qo‘ng‘iroq qiling.",
    address: "Sarvar Azimov ko‘chasi 47, 131100, Jizzax, Jizzax viloyati, O‘zbekiston",
    hours: "Ish vaqti",
    schedule:
      "Yakshanba kuni ham ishlaymiz. Ayrim chorshanbalarda dam beriladi. Kelishdan oldin telefon orqali aniqlashtiring.",
    visit: "Sizni kutamiz",
    location: "JIZZAX SHAHRI",
    locationText: "Yaqinlaringiz bilan uchrashuv uchun shinam maskan.",
    footerText: "Yaqinlaringiz bilan shinam davralar uchun.",
    copyright: "Barcha huquqlar himoyalangan.",
    up: "Yuqoriga",
    openMenu: "Menyuni ochish",
    closeMenu: "Menyuni yopish",
    light: "Yorug‘ rejim",
    dark: "Qorong‘i rejim",
    language: "Tilni tanlash",
    skip: "Asosiy mazmunga o‘tish",
    closeImage: "Suratni yopish",
    enlarge: "Suratni kattalashtirish",
    announcements: "E’lonlar",
    loading: "Ma’lumotlar yuklanmoqda…",
    error:
      "Qo‘shimcha ma’lumotlar olinmadi. Asosiy ma’lumotlar ko‘rsatilmoqda.",
    currency: "so‘m",
  },
  ru: {
    fullMenu: "Полное меню",
    searchMenu: "Поиск по названию блюда",
    searchPlaceholder: "Введите название блюда",
    category: "Категория",
    allCategories: "Все",
    uncategorized: "Категория не указана",
    categoriesPending: "Категории блюд пока не указаны.",
    results: "Найдено блюд",
    noResults: "Блюда не найдены",
    resetFilters: "Сбросить фильтры",
    dishDetails: "Посмотреть блюдо",
    previousImage: "Предыдущее фото",
    nextImage: "Следующее фото",
    notFound: "Страница не найдена",
    notFoundText:
      "По этому адресу нет страницы. Вы можете вернуться на главную.",
    backHome: "На главную",
    viewFullMenu: "Посмотреть всё меню",
    viewGallery: "Посмотреть галерею",

    nav: ["Главная", "О нас", "Комнаты", "Меню", "Галерея", "Контакты"],
    brand: "Чайхана O‘ktam ota",
    tag: "ЧАЙХАНА O‘KTAM OTA",
    heroTitle: "Уютное место для тёплых встреч",
    heroText:
      "В чайхане O‘ktam ota в Джизаке вас ждут уютные комнаты и комфортная атмосфера.",
    call: "Позвонить",
    seeRooms: "Посмотреть комнаты",
    decorative: "Декоративное изображение. Не является фотографией чайханы.",
    stats: ["20 комнат", "10 человек", "Кондиционер"],
    statText: [
      "Уютные комнаты для встреч с близкими",
      "Каждая комната рассчитана на 10 человек",
      "Для комфортной температуры в комнатах",
    ],
    aboutTitle: "О нас",
    aboutText:
      "Чайхана O‘ktam ota — уютное место в Джизаке, где можно собраться с близкими за одним столом. У нас 20 комнат, каждая рассчитана на 10 человек.",
    aboutText2:
      "Удобная мебель и кондиционер делают общение и время вместе ещё комфортнее.",
    more: "Посмотреть комнаты",
    roomsTitle: "Место для вашей компании",
    roomsTag: "КОМНАТЫ",
    roomsText:
      "Уютная обстановка для семьи и близких. Каждая комната рассчитана на 10 человек и оборудована удобной мебелью и кондиционером.",
    roomFeatures: [
      "20 комнат",
      "По 10 человек",
      "Удобная мебель",
      "Кондиционер",
    ],
    askRooms: "Узнать о комнатах",
    roomArt: "Декоративный рисунок комнаты",
    menuTitle: "Меню",
    menuSoon: "Меню скоро появится здесь",
    menuText:
      "Раздел меню готовится. Скоро здесь можно будет ознакомиться с блюдами, порциями и ценами.",
    galleryTitle: "Галерея",
    gallerySoon: "Фотографии нашей чайханы скоро появятся",
    galleryText:
      "Здесь мы покажем настоящие комнаты и атмосферу нашей чайханы.",
    faqTitle: "Часто задаваемые вопросы",
    faqQ: ["Где находится чайхана?", "Какое у вас время работы?", "Вы открыты в воскресенье?", "Каждая среда — выходной?", "Сколько человек вмещают комнаты?", "Какие удобства есть в комнатах?", "Можно ли посмотреть меню на телефоне?", "Можно ли заказать еду или забронировать комнату на сайте?", "Как узнать происхождение мяса и состав блюда?", "Как уточнить цену и размер порции?"],
    faqA: ["Узбекистан, Джизакская область, Джизак, улица Сарвара Азимова, 47, 131100. Подробный маршрут уточните по телефону.", "С 09:00 до 23:50. Перед визитом уточните режим работы на этот день.", "Да, чайхана работает и по воскресеньям.", "Нет. Выходными бывают только отдельные среды. Перед визитом позвоните.", "В чайхане 20 комнат, каждая рассчитана на 10 человек.", "Удобная мебель и кондиционер.", "Да. На странице /menu есть поиск блюд и фильтр по категориям.", "Сайт предназначен для ознакомления. Онлайн-заказа и бронирования нет. Заказы принимает сотрудник.", "Откройте карточку блюда. Если поставщик, состав или аллергены не указаны, уточните их у сотрудника.", "Неуказанные цены и порции уточните по телефону или во время визита."],
    contactTitle: "Контакты",
    contactText: "Позвоните нам, чтобы узнать о комнатах и графике работы.",
    address: "Узбекистан, Джизакская область, Джизак, улица Сарвара Азимова, 47, 131100",
    hours: "Время работы",
    schedule:
      "Работаем и по воскресеньям. В отдельные среды бывают выходные. Перед визитом уточните по телефону.",
    visit: "Ждём вас",
    location: "ГОРОД ДЖИЗАК",
    locationText: "Уютное место для встреч с близкими.",
    footerText: "Для тёплых встреч с близкими.",
    copyright: "Все права защищены.",
    up: "Наверх",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    light: "Светлая тема",
    dark: "Тёмная тема",
    language: "Выбрать язык",
    skip: "Перейти к содержимому",
    closeImage: "Закрыть фотографию",
    enlarge: "Увеличить фотографию",
    announcements: "Объявления",
    loading: "Загрузка данных…",
    error: "Дополнительные данные недоступны. Показана основная информация.",
    currency: "сум",
  },
  en: {
    fullMenu: "Full menu",
    searchMenu: "Search by dish name",
    searchPlaceholder: "Enter a dish name",
    category: "Category",
    allCategories: "All",
    uncategorized: "Category not provided",
    categoriesPending: "Dish categories have not been provided yet.",
    results: "Dishes found",
    noResults: "No matching dishes",
    resetFilters: "Clear filters",
    dishDetails: "View dish",
    previousImage: "Previous photo",
    nextImage: "Next photo",
    notFound: "Page not found",
    notFoundText:
      "There is no page at this address. You can return to the home page.",
    backHome: "Back to home",
    viewFullMenu: "View full menu",
    viewGallery: "View gallery",

    nav: ["Home", "About us", "Rooms", "Menu", "Gallery", "Contact"],
    brand: "O‘ktam ota teahouse",
    tag: "O‘KTAM OTA TEAHOUSE",
    heroTitle: "A cosy place for warm gatherings",
    heroText:
      "Enjoy comfortable rooms and a welcoming atmosphere at O‘ktam ota teahouse in Jizzakh.",
    call: "Call us",
    seeRooms: "Explore the rooms",
    decorative:
      "Decorative illustration. Not an actual photograph of the teahouse.",
    stats: ["20 rooms", "10 guests", "Air conditioning"],
    statText: [
      "Cosy rooms for time with loved ones",
      "Each room accommodates 10 guests",
      "For a comfortable room temperature",
    ],
    aboutTitle: "About us",
    aboutText:
      "O‘ktam ota teahouse is a cosy place in Jizzakh to gather with loved ones around one table. We have 20 rooms, each accommodating 10 guests.",
    aboutText2:
      "Comfortable furniture and air conditioning make conversations and time together more relaxing.",
    more: "Explore the rooms",
    roomsTitle: "A place for your gathering",
    roomsTag: "OUR ROOMS",
    roomsText:
      "A cosy setting for family and friends. Each room accommodates 10 guests and features comfortable furniture and air conditioning.",
    roomFeatures: [
      "20 rooms",
      "10 guests per room",
      "Comfortable furniture",
      "Air conditioning",
    ],
    askRooms: "Ask about the rooms",
    roomArt: "Decorative drawing of a room",
    menuTitle: "Menu",
    menuSoon: "Our menu is coming soon",
    menuText:
      "We are preparing this section. You will soon be able to explore our dishes, portions and prices here.",
    galleryTitle: "Gallery",
    gallerySoon: "Photos of our teahouse are coming soon",
    galleryText: "We will share real photos of our rooms and atmosphere here.",
    faqTitle: "Frequently asked questions",
    faqQ: ["Where is the teahouse?", "What are the opening hours?", "Are you open on Sundays?", "Is every Wednesday a day off?", "How many people do the rooms seat?", "What amenities do the rooms have?", "Can I browse the menu on my phone?", "Can I order food or book a room on the website?", "How can I check meat origin and ingredients?", "How do I check prices and portion sizes?"],
    faqA: ["47 Sarvar Azimov Street, Jizzakh, Jizzakh Region, Uzbekistan, 131100. Call for detailed directions.", "09:00–23:50. Please confirm the schedule for your visit.", "Yes, the teahouse also opens on Sundays.", "No. Only some Wednesdays are days off. Please call before visiting.", "There are 20 rooms, each seating 10 people.", "Comfortable furniture and air conditioning.", "Yes. Visit /menu to search dishes and filter by category.", "The website is for browsing. There is no online ordering or booking. Staff take food orders.", "Open the dish details. If supplier, ingredients or allergens are not listed, please ask the staff.", "Ask staff by phone or during your visit about prices and portions that are not listed."],
    contactTitle: "Contact",
    contactText: "Call us for information about the rooms and opening hours.",
    address: "47 Sarvar Azimov Street, 131100, Jizzakh, Jizzakh Region, Uzbekistan",
    hours: "Opening hours",
    schedule:
      "Open on Sundays. We close on some Wednesdays. Please call before visiting to confirm.",
    visit: "We look forward to seeing you",
    location: "JIZZAKH CITY",
    locationText: "A cosy place to meet your loved ones.",
    footerText: "For warm gatherings with your loved ones.",
    copyright: "All rights reserved.",
    up: "Back to top",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    light: "Light mode",
    dark: "Dark mode",
    language: "Select language",
    skip: "Skip to main content",
    closeImage: "Close photo",
    enlarge: "Enlarge photo",
    announcements: "Announcements",
    loading: "Loading information…",
    error: "Additional information is unavailable. Basic information is shown.",
    currency: "UZS",
  },
};
export type Language = keyof typeof translations;
type Theme = "light" | "dark";
function stored(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
const Context = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: typeof translations.uz;
} | null>(null);
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const v = stored("oktam-language");
    return v === "ru" || v === "en" ? v : "uz";
  });
  const [theme, setTheme] = useState<Theme>(() =>
    stored("oktam-theme") === "dark" ? "dark" : "light",
  );
  useEffect(() => {
    document.documentElement.lang = lang;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", translations[lang].heroText);
    try {
      localStorage.setItem("oktam-language", lang);
    } catch {}
  }, [lang]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0d2520" : "#faf8f2");
    try {
      localStorage.setItem("oktam-theme", theme);
    } catch {}
  }, [theme]);
  return (
    <Context.Provider
      value={{ lang, setLang, theme, setTheme, t: translations[lang] }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePreferences() {
  const c = useContext(Context);
  if (!c) throw new Error("PreferencesProvider required");
  return c;
}
