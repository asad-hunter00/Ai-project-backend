import { confirmedLocation } from "./location";
import type { SiteContent, MenuItem } from "../types";
export const initialContent: SiteContent = {
  settings: {
    name: "O‘ktam ota choyxonasi",
    ...confirmedLocation,
    hours: "09:00–23:50",
    phones: ["+998 91 567 28 15", "+998 90 486 96 11"],
  },
  rooms: [],
  gallery: [
  {
    "id": "xona-photo",
    "src": "/images/gallery/xona.webp",
    "alt": {
      "uz": "Shinam mebellar va konditsionerli xona",
      "ru": "Комната с удобной мебелью и кондиционером",
      "en": "Room with comfortable furniture and air conditioning"
    }
  },
  {
    "id": "zal-photo-1",
    "src": "/images/gallery/zal-1.webp",
    "alt": {
      "uz": "Choyxonaning stol-stulli zali",
      "ru": "Зал чайханы со столами и стульями",
      "en": "Teahouse hall with tables and chairs"
    }
  },
  {
    "id": "zal-photo-2",
    "src": "/images/gallery/zal-2.webp",
    "alt": {
      "uz": "Choyxona zalining ichki ko‘rinishi",
      "ru": "Интерьер зала чайханы",
      "en": "Interior of the teahouse hall"
    }
  },
  {
    "id": "mangal",
    "src": "/images/gallery/mangal.webp",
    "alt": {
      "uz": "Cho‘g‘ ustida pishayotgan shashliklar",
      "ru": "Шашлыки на углях",
      "en": "Shashlik over glowing coals"
    }
  },
  {
    "id": "dasturxon",
    "src": "/images/gallery/dasturxon.webp",
    "alt": {
      "uz": "Mehmonlar uchun yozilgan dasturxon",
      "ru": "Накрытый стол для гостей",
      "en": "A table set for guests"
    }
  },
  {
    "id": "kirish",
    "src": "/images/gallery/kirish.webp",
    "alt": {
      "uz": "Choyxonaning kirish qismi",
      "ru": "Вход в чайхану",
      "en": "Teahouse entrance"
    }
  },
  {
    "id": "hovli",
    "src": "/images/gallery/hovli.webp",
    "alt": {
      "uz": "Choyxona hovlisi va yo‘lagi",
      "ru": "Двор и проход чайханы",
      "en": "Teahouse courtyard and walkway"
    }
  }
],
  announcements: [],
};
// Tasdiqlangan menyu va suratlarni shu yerga qo‘shing. Rasmlar public/images/ ichida saqlanadi.
export const menuItems: MenuItem[] = [
  {
    "id": "qoy-koska",
    "name": {
      "uz": "Qo‘y koska",
      "ru": "Коска из баранины",
      "en": "Lamb koska"
    },
    "image": "/images/menu/qoy-koska.png",
    "category": {
      "uz": "Donalik shashliklar",
      "ru": "Поштучные шашлыки",
      "en": "Shashlik by the skewer"
    },
    "reviews": [],
    "meat": {
      "uz": "Qo‘y go‘shti",
      "ru": "Баранина",
      "en": "Lamb"
    },
    "description": {
      "uz": "Qo‘y go‘shti asosidagi shashlik. Marinad, ziravorlar va porsiya haqida xodimdan aniqlashtiring.",
      "ru": "Шашлык: баранина. Маринад, специи и размер порции уточните у сотрудника.",
      "en": "Shashlik made with lamb. Ask our team about the marinade, spices and portion size."
    },
    "price": 40000,
    "portion": {
      "uz": "1 dona",
      "ru": "1 шт.",
      "en": "1 skewer"
    }
  },
  {
    "id": "mol-koska",
    "name": {
      "uz": "Mol koska",
      "ru": "Коска из говядины",
      "en": "Beef koska"
    },
    "image": "/images/menu/mol-koska.png",
    "category": {
      "uz": "Donalik shashliklar",
      "ru": "Поштучные шашлыки",
      "en": "Shashlik by the skewer"
    },
    "reviews": [],
    "meat": {
      "uz": "Mol go‘shti",
      "ru": "Говядина",
      "en": "Beef"
    },
    "description": {
      "uz": "Mol go‘shti asosidagi shashlik. Marinad, ziravorlar va porsiya haqida xodimdan aniqlashtiring.",
      "ru": "Шашлык: говядина. Маринад, специи и размер порции уточните у сотрудника.",
      "en": "Shashlik made with beef. Ask our team about the marinade, spices and portion size."
    },
    "price": 40000,
    "portion": {
      "uz": "1 dona",
      "ru": "1 шт.",
      "en": "1 skewer"
    }
  },
  {
    "id": "keskis-shashlik",
    "name": {
      "uz": "Keskis shashlik",
      "ru": "Шашлык «Кескис»",
      "en": "Keskis shashlik"
    },
    "image": "/images/menu/keskis-shashlik.png",
    "category": {
      "uz": "Donalik shashliklar",
      "ru": "Поштучные шашлыки",
      "en": "Shashlik by the skewer"
    },
    "reviews": [],
    "description": {
      "uz": "Shashlik menyusidagi alohida variant. Go‘sht turi, tarkibi va porsiyasini xodimdan aniqlashtiring.",
      "ru": "Отдельный вариант в меню шашлыков. Вид мяса, состав и порцию уточните у сотрудника.",
      "en": "A distinct option from the shashlik menu. Ask our team about the meat, ingredients and portion."
    },
    "price": 40000,
    "portion": {
      "uz": "1 dona",
      "ru": "1 шт.",
      "en": "1 skewer"
    }
  },
  {
    "id": "koska-rulet",
    "name": {
      "uz": "Koska rulet",
      "ru": "Коска-рулет",
      "en": "Koska roll"
    },
    "image": "/images/menu/koska-rulet.png",
    "category": {
      "uz": "Donalik shashliklar",
      "ru": "Поштучные шашлыки",
      "en": "Shashlik by the skewer"
    },
    "reviews": [],
    "description": {
      "uz": "Shashlik menyusidagi alohida variant. Go‘sht turi, tarkibi va porsiyasini xodimdan aniqlashtiring.",
      "ru": "Отдельный вариант в меню шашлыков. Вид мяса, состав и порцию уточните у сотрудника.",
      "en": "A distinct option from the shashlik menu. Ask our team about the meat, ingredients and portion."
    },
    "price": 40000,
    "portion": {
      "uz": "1 dona",
      "ru": "1 шт.",
      "en": "1 skewer"
    }
  },
  {
    "id": "qoy-biqin",
    "name": {
      "uz": "Qo‘y biqin shashlik",
      "ru": "Шашлык «Куй бикин»",
      "en": "Lamb biqin shashlik"
    },
    "image": "/images/menu/qoy-biqin.png",
    "category": {
      "uz": "Donalik shashliklar",
      "ru": "Поштучные шашлыки",
      "en": "Shashlik by the skewer"
    },
    "reviews": [],
    "meat": {
      "uz": "Qo‘y go‘shti",
      "ru": "Баранина",
      "en": "Lamb"
    },
    "description": {
      "uz": "Qo‘y go‘shti asosidagi shashlik. Marinad, ziravorlar va porsiya haqida xodimdan aniqlashtiring.",
      "ru": "Шашлык: баранина. Маринад, специи и размер порции уточните у сотрудника.",
      "en": "Shashlik made with lamb. Ask our team about the marinade, spices and portion size."
    },
    "price": 55000,
    "portion": {
      "uz": "1 dona",
      "ru": "1 шт.",
      "en": "1 skewer"
    }
  },
  {
    "id": "bomba",
    "name": {
      "uz": "Bomba shashlik",
      "ru": "Шашлык «Бомба»",
      "en": "Bomba shashlik"
    },
    "image": "/images/menu/bomba.png",
    "category": {
      "uz": "Donalik shashliklar",
      "ru": "Поштучные шашлыки",
      "en": "Shashlik by the skewer"
    },
    "reviews": [],
    "description": {
      "uz": "Shashlik menyusidagi alohida variant. Go‘sht turi, tarkibi va porsiyasini xodimdan aniqlashtiring.",
      "ru": "Отдельный вариант в меню шашлыков. Вид мяса, состав и порцию уточните у сотрудника.",
      "en": "A distinct option from the shashlik menu. Ask our team about the meat, ingredients and portion."
    },
    "price": 40000,
    "portion": {
      "uz": "1 dona",
      "ru": "1 шт.",
      "en": "1 skewer"
    }
  },
  {
    "id": "rulet",
    "name": {
      "uz": "Rulet shashlik",
      "ru": "Шашлык-рулет",
      "en": "Roll shashlik"
    },
    "image": "/images/menu/rulet.png",
    "category": {
      "uz": "Donalik shashliklar",
      "ru": "Поштучные шашлыки",
      "en": "Shashlik by the skewer"
    },
    "reviews": [],
    "description": {
      "uz": "Shashlik menyusidagi alohida variant. Go‘sht turi, tarkibi va porsiyasini xodimdan aniqlashtiring.",
      "ru": "Отдельный вариант в меню шашлыков. Вид мяса, состав и порцию уточните у сотрудника.",
      "en": "A distinct option from the shashlik menu. Ask our team about the meat, ingredients and portion."
    },
    "price": 40000,
    "portion": {
      "uz": "1 dona",
      "ru": "1 шт.",
      "en": "1 skewer"
    }
  },
  {
    "id": "qoy-jigar",
    "name": {
      "uz": "Qo‘y jigar shashlik",
      "ru": "Шашлык из бараньей печени",
      "en": "Lamb liver shashlik"
    },
    "image": "/images/menu/qoy-jigar.png",
    "category": {
      "uz": "Donalik shashliklar",
      "ru": "Поштучные шашлыки",
      "en": "Shashlik by the skewer"
    },
    "reviews": [],
    "meat": {
      "uz": "Qo‘y jigari",
      "ru": "Баранья печень",
      "en": "Lamb liver"
    },
    "description": {
      "uz": "Qo‘y jigari asosidagi shashlik. Marinad, ziravorlar va porsiya haqida xodimdan aniqlashtiring.",
      "ru": "Шашлык: баранья печень. Маринад, специи и размер порции уточните у сотрудника.",
      "en": "Shashlik made with lamb liver. Ask our team about the marinade, spices and portion size."
    },
    "price": 28000,
    "portion": {
      "uz": "1 dona",
      "ru": "1 шт.",
      "en": "1 skewer"
    }
  },
  {
    "id": "tovuq",
    "name": {
      "uz": "Tovuq shashlik",
      "ru": "Куриный шашлык",
      "en": "Chicken shashlik"
    },
    "image": "/images/menu/tovuq.png",
    "category": {
      "uz": "Donalik shashliklar",
      "ru": "Поштучные шашлыки",
      "en": "Shashlik by the skewer"
    },
    "reviews": [],
    "meat": {
      "uz": "Tovuq go‘shti",
      "ru": "Курица",
      "en": "Chicken"
    },
    "description": {
      "uz": "Tovuq go‘shti asosidagi shashlik. Marinad, ziravorlar va porsiya haqida xodimdan aniqlashtiring.",
      "ru": "Шашлык: курица. Маринад, специи и размер порции уточните у сотрудника.",
      "en": "Shashlik made with chicken. Ask our team about the marinade, spices and portion size."
    },
    "price": 18000,
    "portion": {
      "uz": "1 dona",
      "ru": "1 шт.",
      "en": "1 skewer"
    }
  },
  {
    "id": "qiyma",
    "name": {
      "uz": "Qiyma shashlik",
      "ru": "Шашлык из фарша",
      "en": "Minced meat shashlik"
    },
    "category": {
      "uz": "Donalik shashliklar",
      "ru": "Поштучные шашлыки",
      "en": "Shashlik by the skewer"
    },
    "portion": {
      "uz": "1 dona",
      "ru": "1 шт.",
      "en": "1 skewer"
    },
    "description": {
      "uz": "Qiyma asosidagi shashlik. Go‘sht turi va qo‘shimchalarini xodimdan aniqlashtiring.",
      "ru": "Шашлык из фарша. Вид мяса и добавки уточните у сотрудника.",
      "en": "Minced meat shashlik. Ask our staff about the meat type and additions."
    },
    "image": "/images/menu/qiyma.webp",
    "reviews": []
  },
  {
    "id": "achchiq-chuchuk",
    "name": {
      "uz": "Achchiq-chuchuk",
      "ru": "Ачичук",
      "en": "Achichuk salad"
    },
    "category": {
      "uz": "Salatlar",
      "ru": "Салаты",
      "en": "Salads"
    },
    "description": {
      "uz": "Dasturxonga yengil qo‘shimcha — an’anaviy sabzavotli salat.",
      "ru": "Лёгкое дополнение к столу — традиционный овощной салат.",
      "en": "A light addition to the table: a traditional vegetable salad."
    },
    "ingredients": {
      "uz": "An’anaviy variantida pomidor, piyoz va qalampir bo‘ladi. Aynan shu choyxonadagi retsept hamda qo‘shimchalarni xodimdan aniqlashtiring.",
      "ru": "Традиционный вариант включает помидоры, лук и перец. Рецепт и добавки в этой чайхане уточните у сотрудника.",
      "en": "Traditionally made with tomatoes, onion and pepper. Confirm this teahouse’s recipe and additions with the staff."
    },
    "image": "/images/menu/achchiq-chuchuk.webp",
    "reviews": [],
    "price": 20000,
    "portion": {
      "uz": "1 porsiya",
      "ru": "1 порция",
      "en": "1 serving"
    }
  },
  {
    "id": "qiyma-kg",
    "name": {
      "uz": "Kiloli qiyma",
      "ru": "Фарш на килограмм",
      "en": "Minced meat by the kilogram"
    },
    "price": 170000,
    "portion": {
      "uz": "1 kg",
      "ru": "1 кг",
      "en": "1 kg"
    },
    "category": {
      "uz": "Kiloli shashliklar",
      "ru": "Шашлыки на килограмм",
      "en": "Shashlik by the kilogram"
    },
    "image": "/images/menu/qiyma-kg.webp",
    "imageFit": "cover",
    "imageCaption": {
      "uz": "Kiloli mahsulotning tayyorlashdan oldingi ko‘rinishi.",
      "ru": "Продукт на килограмм до приготовления.",
      "en": "The kilogram selection before cooking."
    },
    "description": {
      "uz": "Kilogramm hisobida taklif qilinadi. Narx 1 kg uchun. Tayyorlash va tortish tartibini xodimdan aniqlashtiring.",
      "ru": "Цена указана за 1 кг. Порядок взвешивания и приготовления уточните у сотрудника.",
      "en": "Priced per kilogram. Ask our staff about weighing and preparation."
    },
    "reviews": []
  },
  {
    "id": "qoy-koska-kg",
    "name": {
      "uz": "Kiloli qo‘y koska",
      "ru": "Баранина «Коска» на килограмм",
      "en": "Lamb koska by the kilogram"
    },
    "price": 190000,
    "portion": {
      "uz": "1 kg",
      "ru": "1 кг",
      "en": "1 kg"
    },
    "category": {
      "uz": "Kiloli shashliklar",
      "ru": "Шашлыки на килограмм",
      "en": "Shashlik by the kilogram"
    },
    "image": "/images/menu/qoy-koska-kg.webp",
    "imageFit": "cover",
    "imageCaption": {
      "uz": "Kiloli mahsulotning tayyorlashdan oldingi ko‘rinishi.",
      "ru": "Продукт на килограмм до приготовления.",
      "en": "The kilogram selection before cooking."
    },
    "description": {
      "uz": "Kilogramm hisobida taklif qilinadi. Narx 1 kg uchun. Tayyorlash va tortish tartibini xodimdan aniqlashtiring.",
      "ru": "Цена указана за 1 кг. Порядок взвешивания и приготовления уточните у сотрудника.",
      "en": "Priced per kilogram. Ask our staff about weighing and preparation."
    },
    "reviews": [],
    "meat": {
      "uz": "Qo‘y go‘shti",
      "ru": "Баранина",
      "en": "Lamb"
    }
  },
  {
    "id": "tovuq-kg",
    "name": {
      "uz": "Kiloli tovuq",
      "ru": "Курица на килограмм",
      "en": "Chicken by the kilogram"
    },
    "price": 70000,
    "portion": {
      "uz": "1 kg",
      "ru": "1 кг",
      "en": "1 kg"
    },
    "category": {
      "uz": "Kiloli shashliklar",
      "ru": "Шашлыки на килограмм",
      "en": "Shashlik by the kilogram"
    },
    "image": "/images/menu/tovuq-kg.webp",
    "imageFit": "cover",
    "imageCaption": {
      "uz": "Kiloli mahsulotning tayyorlashdan oldingi ko‘rinishi.",
      "ru": "Продукт на килограмм до приготовления.",
      "en": "The kilogram selection before cooking."
    },
    "description": {
      "uz": "Kilogramm hisobida taklif qilinadi. Narx 1 kg uchun. Tayyorlash va tortish tartibini xodimdan aniqlashtiring.",
      "ru": "Цена указана за 1 кг. Порядок взвешивания и приготовления уточните у сотрудника.",
      "en": "Priced per kilogram. Ask our staff about weighing and preparation."
    },
    "reviews": [],
    "meat": {
      "uz": "Tovuq go‘shti",
      "ru": "Курица",
      "en": "Chicken"
    }
  },
  {
    "id": "shorva",
    "name": {
      "uz": "Sho‘rva",
      "ru": "Шурпа",
      "en": "Shurpa soup"
    },
    "category": {
      "uz": "Sho‘rvalar",
      "ru": "Супы",
      "en": "Soups"
    },
    "image": "/images/menu/shorva.webp",
    "imageFit": "cover",
    "description": {
      "uz": "Qozonda tayyorlanadigan issiq sho‘rva. Tarkibi va porsiyasini xodimdan aniqlashtiring.",
      "ru": "Горячая шурпа в казане. Состав и размер порции уточните у сотрудника.",
      "en": "Hot shurpa cooked in a kazan. Ask staff about ingredients and portion size."
    },
    "reviews": []
  },
  {
    "id": "qattiq",
    "name": {
      "uz": "Qattiq (okroshka)",
      "ru": "Окрошка",
      "en": "Okroshka"
    },
    "category": {
      "uz": "Sovuq taomlar",
      "ru": "Холодные блюда",
      "en": "Cold dishes"
    },
    "image": "/images/menu/qattiq.webp",
    "imageFit": "cover",
    "price": 20000,
    "portion": {
      "uz": "1 porsiya",
      "ru": "1 порция",
      "en": "1 serving"
    },
    "description": {
      "uz": "Sovuq holda tortiladigan qattiq — okroshka. Sut mahsulotlari va boshqa tarkibiy qismlarini xodimdan aniqlashtiring.",
      "ru": "Холодное блюдо — окрошка. Молочные продукты и другие ингредиенты уточните у сотрудника.",
      "en": "A cold dish known as okroshka. Ask staff about dairy and other ingredients."
    },
    "reviews": []
  }
];
