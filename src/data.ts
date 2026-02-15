import { Accommodation, Attraction, ItineraryItem, Phrase } from "./types";

export const attractions: Attraction[] = [
  {
    id: "attr-1",
    name: "Шарын каньоны",
    region: "Алматы облысы",
    priceFrom: 15,
    rating: 4.9,
    category: "Табиғат",
    images: [
      "https://images.unsplash.com/photo-1556881868-6741dafe0e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    shortDescription: "Таңғажайып қызыл құмтас түзілімдерін ұсынатын «Қамалдар аңғары».",
    longDescription: "Жиі Үлкен каньонмен салыстырылатын Шарын каньоны Шарын өзенінің бойымен 154 шақырымға созылып жатыр. Ең танымал бөлігі — ерекше жартас түзілімдерімен танымал «Қамалдар аңғары». Бұл жаяу серуендеуге, суретке түсуге және даланың табиғи сұлулығын сезінуге таптырмас орын.",
    bestMonths: ["Сәуір", "Мамыр", "Қыркүйек", "Қазан"],
    coordinates: { lat: 43.3517, lng: 79.0833 }
  },
  {
    id: "attr-2",
    name: "Үлкен Алматы көлі",
    region: "Алматы облысы",
    priceFrom: 10,
    rating: 4.8,
    category: "Көлдер",
    images: [
      "https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    shortDescription: "Іле Алатауы тауларында жоғары орналасқан көгілдір альпілік көл.",
    longDescription: "Теңіз деңгейінен 2 511 метр биіктікте орналасқан Үлкен Алматы көлі — жер сілкіністерінен пайда болған табиғи су қоймасы. Судың түсі жыл мезгіліне байланысты ашық жасылдан көгілдір түске дейін өзгереді. Бұл Алматы қаласын ауыз сумен қамтасыз ететін негізгі нысан.",
    bestMonths: ["Маусым", "Шілде", "Тамыз", "Қыркүйек"],
    coordinates: { lat: 43.0506, lng: 76.9850 }
  },
  {
    id: "attr-3",
    name: "Астана Бәйтерек",
    region: "Астана",
    priceFrom: 5,
    rating: 4.5,
    category: "Қалалар",
    images: [
      "https://images.unsplash.com/photo-1697368761794-b25176d78a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    shortDescription: "Өмір ағашы мен Самұрық құстың алтын жұмыртқасын бейнелейтін футуристік мұнара.",
    longDescription: "Бәйтерек монументі — Астанадағы ескерткіш және бақылау мұнарасы. Ол ағаш қуысына алтын жұмыртқа салған мифтік Самұрық құс туралы қазақ халық ертегісін бейнелейді. Келушілер елорданың панорамалық көрінісін тамашалау үшін бақылау алаңына көтеріле алады.",
    bestMonths: ["Мамыр", "Маусым", "Шілде", "Тамыз", "Қыркүйек"],
    coordinates: { lat: 51.1283, lng: 71.4305 }
  },
  {
    id: "attr-4",
    name: "Көлсай көлдері",
    region: "Алматы облысы",
    priceFrom: 20,
    rating: 4.9,
    category: "Көлдер",
    images: [
      "https://images.unsplash.com/photo-1752418720096-3427849c1a3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    shortDescription: "Жиі «Тянь-Шань маржандары» деп аталатын үш альпілік көл жүйесі.",
    longDescription: "Көлсай көлдері — Солтүстік Тянь-Шань тауларында орналасқан үш тау көлінің жүйесі. Көлдер айналасындағы шырша ормандарын бейнелейтін мөлдір таза суымен танымал. Бұл кемпинг, жаяу серуендеу және атпен серуендеу үшін тамаша орын.",
    bestMonths: ["Маусым", "Шілде", "Тамыз", "Қыркүйек"],
    coordinates: { lat: 42.9906, lng: 78.3236 }
  }
];

export const accommodations: Accommodation[] = [
  {
    id: "acc-1",
    name: "Көшпенділердің киіз үй лагері",
    type: "Киіз үй",
    price: 45,
    rating: 4.7,
    amenities: ["Таңғы ас", "Атпен серуендеу", "От жағу", "Жұлдыздарды тамашалау"],
    region: "Алматы облысы",
    gallery: [
      "https://images.unsplash.com/photo-1579776722778-8365fa4c3f76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    coordinates: { lat: 43.36, lng: 79.10 }
  },
  {
    id: "acc-2",
    name: "Көлсай Эко-лоджы",
    type: "Эко-лодж",
    price: 80,
    rating: 4.8,
    amenities: ["WiFi", "Жеке ванна", "Жаяу серуендеу нұсқаушысы", "Толық пансион"],
    region: "Алматы облысы",
    gallery: [
      "https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    coordinates: { lat: 42.99, lng: 78.33 }
  },
  {
    id: "acc-3",
    name: "Rixos President Astana",
    type: "Қонақ үй",
    price: 150,
    rating: 4.9,
    amenities: ["Спа", "Бассейн", "Спорт залы", "Сәнді асхана"],
    region: "Астана",
    gallery: [
      "https://images.unsplash.com/photo-1697368761794-b25176d78a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    coordinates: { lat: 51.13, lng: 71.44 }
  }
];

export const itinerary: ItineraryItem[] = [
  { id: "it-1", day: 1, time: "09:00", activity: "Алматыдан шығу", type: "travel", cost: 0 },
  { id: "it-2", day: 1, time: "12:00", activity: "Шарын каньонына келу", type: "activity", cost: 15 },
  { id: "it-3", day: 1, time: "13:30", activity: "Өзен жағасында пикник", type: "meal", cost: 10 },
  { id: "it-4", day: 1, time: "16:00", activity: "Қамалдар аңғарында жаяу серуендеу", type: "activity", cost: 0 },
  { id: "it-5", day: 1, time: "19:00", activity: "Киіз үй лагеріндегі кешкі ас", type: "meal", cost: 20 },
  { id: "it-6", day: 1, time: "21:00", activity: "Киіз үйде түнеу", type: "stay", cost: 45 },
];

export const phrases: Phrase[] = [
  { category: "Сәлемдесу", kazakh: "Сәлеметсіз бе (Sälemetsiz be)", pronunciation: "Sa-lem-et-siz be", english: "Сәлеметсіз бе (Ресми)" },
  { category: "Сәлемдесу", kazakh: "Сәлем (Sälem)", pronunciation: "Sa-lem", english: "Сәлем (Бейресми)" },
  { category: "Негізгі сөздер", kazakh: "Рахмет (Rakhmet)", pronunciation: "Rakh-met", english: "Рахмет" },
  { category: "Негізгі сөздер", kazakh: "Иә / Жоқ (Iä / Zhoq)", pronunciation: "E-ya / Zhok", english: "Иә / Жоқ" },
  { category: "Ас ішу", kazakh: "Ас дәмді болсын (As dämdi bolsyn)", pronunciation: "As dam-di bol-syn", english: "Ас дәмді болсын" },
];
