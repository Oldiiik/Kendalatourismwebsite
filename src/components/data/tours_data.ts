
export interface LocalizedString {
    kz: string;
    ru: string;
    en: string;
}

export interface ItineraryItem {
    day: number | string;
    title: LocalizedString;
    desc: LocalizedString;
}

export interface Tour {
    id: number;
    title: LocalizedString;
    region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'Almaty' | 'Astana';
    type: LocalizedString;
    duration: number;
    price: number;
    image: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
    description: LocalizedString;
    longDescription: LocalizedString;
    rating: number;
    itinerary: ItineraryItem[];
    included: LocalizedString[];
    notIncluded?: LocalizedString[];
    whatToBring: LocalizedString[];
    contacts: {
        phone: string;
        email: string;
        website?: string;
        instagram?: string;
    };
    span?: string;
}

export const ALL_TOURS: Tour[] = [
    {
        id: 1,
        title: { kz: "Оңтүстік Қазақстанның Үш Жауһары", ru: "Три Бриллианта Южного Казахстана", en: "Three Diamonds of South Kazakhstan" },
        region: "South", type: { kz: "Премиум Экспедиция", ru: "Премиум Экспедиция", en: "Premium Expedition" },
        duration: 3, price: 450, image: "https://images.unsplash.com/photo-1556881868-6741dafe0e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGFyeW4lMjBDYW55b24lMjBLYXpha2hzdGFufGVufDF8fHx8MTc3MDMwNTUwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Medium",
        description: { kz: "Шарын, Көлсай және Қайыңдыға 3 күндік толыққанды саяхат.", ru: "3-дневное глубокое погружение в магию Чарына, Кольсая и Каинды.", en: "3-day deep immersion into Charyn, Kolsay, and Kaindy." },
        longDescription: {
            kz: "Бұл тур — Қазақстанның визиткасына айналған ең танымал орындарды қамтитын авторлық бағдарлама. Біз 12 миллион жылдық тарихы бар Шарын каньонының 'Қамалдар аңғарын' зерттейміз. Содан кейін Тянь-Шань маржандары — Көлсай көлдеріне жол тартамыз. Мұнда сізді таудың мөлдір ауасы мен шыршалы ормандар күтіп тұр. Үшінші күні біз 1911 жылғы жер сілкінісінен пайда болған жұмбақ Қайыңды көліне барамыз. Судан шығып тұрған шыршалар — әлемдегі сирек кездесетін көрініс. Біз тек ең жайлы эко-қонақ үйлер мен жоғары деңгейлі қызметті ұсынамыз. Саты ауылындағы кешкі ас сізге қазақ қонақжайлылығының нағыз дәмін көрсетеді.",
            ru: "Это не просто тур, а захватывающая экспедиция по самым фотографируемым местам страны. Мы начнем с Чарынского каньона, где вы пройдете по тропам 'Долины Замков', любуясь причудливыми формами из красного песчаника. Вторая точка — озера Кольсай, которые называют жемчужинами Тянь-Шаня. Мы организуем треккинг ко второму озеру, где на высоте 2250 метров открывается вид, от которого захватывает дух. Кульминацией станет озеро Каинды — мистический водоем с затонувшими елями, чьи верхушки пронзают бирюзовую гладь воды. Проживание в уютных эко-лоджах в селе Саты позволит вам насладиться тишиной гор и попробовать аутентичную домашнюю кухню.",
            en: "This is more than just a tour; it's a breathtaking expedition through the country's most iconic locations. We begin at Charyn Canyon, where you'll wander through the 'Valley of Castles,' marveling at formations carved over 12 million years. Next, the Kolsay Lakes, 'Pearls of the Tien Shan.' We organize a trek to the Middle Lake at 2,250 meters for unforgettable views. The journey culminates at Lake Kaindy—a mystical forest submerged in turquoise water since the 1911 earthquake. Staying in premium eco-lodges in Saty village provides an authentic experience."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Шарын: Қамалдар аңғары", ru: "Чарын: Долина Замков", en: "Charyn: Valley of Castles" }, desc: { kz: "Каньонның панорамалық нүктелеріне тоқтау. Аңғар ішімен Шарын өзеніне дейін (3 км) жаяу серуен. Саты ауылына келу.", ru: "Посещение панорамных площадок. Прогулка 3 км к реке Чарын по дну каньона. Заселение в эко-отель в Саты.", en: "Panoramic viewpoints visit. 3km hike to Charyn River. Check-in at the eco-lodge in Saty." } },
            { day: 2, title: { kz: "Көлсай: Тау маржаны", ru: "Кольсай: Жемчужина Тянь-Шаня", en: "Kolsay: Pearl of Tien Shan" }, desc: { kz: "Төменгі Көлсай көлі. Ортаңғы Көлсайға атпен немесе жаяу жорық. Тау басындағы пикник.", ru: "Завтрак у озера. Треккинг ко Второму озеру (8 км). Пикник на альпийских лугах.", en: "Morning at the Lower Lake. Trekking or horse riding to the Middle Lake (8km). Alpine picnic." } },
            { day: 3, title: { kz: "Қайыңды: Жұмбақ орман", ru: "Каинды: Таинственный лес", en: "Kaindy: The Secret Forest" }, desc: { kz: "Қайыңды көліне жол талғамайтын көлікпен шығу. Су астындағы орман. Алматыға қайту.", ru: "Джип-тур к озеру Каинды. Прогулка у затонувшего леса. Возвращение в Алматы к вечеру.", en: "4x4 drive to Lake Kaindy. Exploration of the sunken forest. Evening return to Almaty." } }
        ],
        included: [{ kz: "Toyota LC 300", ru: "Внедорожник VIP", en: "Premium 4x4" }, { kz: "Эко-қонақ үй", ru: "Эко-лодж", en: "Eco-lodge" }, { kz: "Аспаз", ru: "Повар", en: "Private Chef" }],
        whatToBring: [{ kz: "Треккинг етігі", ru: "Треккинговая обувь", en: "Hiking boots" }, { kz: "Жылы киім", ru: "Теплая одежда", en: "Warm layers" }],
        contacts: { phone: "+7 (701) 123-45-67", email: "info@kendala-tours.kz" },
        span: "md:col-span-2"
    },
    {
        id: 2,
        title: { kz: "Бозжыра: Тетис Мұхитының Түбі", ru: "Бозжыра: Дно Океана Тетис", en: "Bozjyra: Bottom of Tethys" },
        region: "West", type: { kz: "Экспедиция", ru: "Экспедиция", en: "Expedition" },
        duration: 5, price: 950, image: "https://images.unsplash.com/photo-1752503771411-0ca4ec85b147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCb3pqeXJhJTIwS2F6YWtoc3RhbnxlbnwxfHx8fDE3NzAzMDc0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Hard",
        description: { kz: "Маңғыстаудың ақ каньондары мен Бозжыраның марстық пейзаждары.", ru: "5-дневное погружение в белые каньоны и марсианские пейзажи Бозжыры.", en: "5-day immersion into white canyons and Martian landscapes." },
        longDescription: {
            kz: "Маңғыстау — бұл басқа планета. Миллиондаған жыл бұрын бұл жерде Тетис мұхиты болған. Біз Бозжыраның ақ азуларын, Тұзбайыр сорының аппақ тұздарын және Торыштың жұмбақ шарларын көреміз. Бұл экспедицияда сіз уақыттың қалай тоқтайтынын сезінесіз. Түнде біз жұлдыздар астында лагерь құрамыз, мұнда аспан әлемі қол созым жерде сияқты көрінеді. Сіз көне акулалардың тістерін өз қолыңызбен тауып, миллиондаған жылдық тарихты сезіне аласыз.",
            ru: "Мангистау — это портал в доисторическую эпоху. Когда-то здесь шумел древний океан Тетис, и сегодня белые известняковые скалы Бозжыры хранят в себе зубы гигантских акул. Наша экспедиция — это путь через бескрайние плато к самым грандиозным каньонам мира. Вы увидите ослепительно белый солончак Тузбаир и Долину Шаров Торыш. Мы ночуем в премиальном глэмпинге прямо в сердце каньонов, где Млечный Путь виден ярче всего.",
            en: "Mangystau is a destination that feels like another planet. Once the floor of the ancient Tethys Ocean, its white limestone cliffs hide the fossilized teeth of prehistoric sharks. Our 5-day expedition travels across vast plateaus to grand canyons. You'll witness the dazzling white salt flats of Tuzbayir and the mysterious Valley of Balls. We spend nights in premium glamping right in the heart of the canyons, under the brightest stars."
        },
        rating: 5.0,
        itinerary: [
            { day: 1, title: { kz: "Шарлар аңғары", ru: "Долина Шаров", en: "Valley of Balls" }, desc: { kz: "Ақтаудан шығу. Торыш домалақ тастары. Шерқала тауындағы аңыз-әңгімелер.", ru: "Выезд из Актау. Конкреции Торыш. История горы-замка Шеркала. Установка лагеря.", en: "Departure from Aktau. Torysh concretions. Legends of Sherkala Mountain. Camping." } },
            { day: 2, title: { kz: "Айрақты Шоқылары", ru: "Горы Айракты", en: "Airakty Mountains" }, desc: { kz: "Шоқылар аңғарына жорық. Көне тасқа басылған суреттерді зерттеу.", ru: "Хайкинг по Долине Шоку. Поиск древних петроглифов. Обед в цветном каньоне.", en: "Hiking the Valley of Small Peaks. Searching for ancient petroglyphs. Canyon lunch." } },
            { day: 3, title: { kz: "Бозжыра: Панорама", ru: "Бозжыра: Панорамы", en: "Bozjyra Viewpoints" }, desc: { kz: "Бозжыраның ең биік нүктесіне шығу. Ақ азуларға көрініс. Жартас ернеуіндегі кешкі ас.", ru: "Восхождение на верхние точки Бозжыры. Вид на 'Клыки'. Ужин на краю обрыва.", en: "Ascent to the upper viewpoints. View of the 'Tusks.' Sunset dinner on the cliff edge." } }
        ],
        included: [{ kz: "Экспедициялық джип", ru: "Внедорожник 4x4", en: "Expedition 4x4" }, { kz: "Глэмпинг", ru: "Глэмпинг", en: "Glamping" }, { kz: "Спутниктік байланыс", ru: "Спутниковая связь", en: "Satellite Link" }],
        whatToBring: [{ kz: "SPF 50+", ru: "Крем SPF 50+", en: "SPF 50+" }, { kz: "Бафф", ru: "Бафф от пыли", en: "Dust buff" }],
        contacts: { phone: "+7 (777) 987-65-43", email: "west@kendala.kz" }
    },
    {
        id: 3,
        title: { kz: "Алтай: Шамбала Ізімен", ru: "Алтай: По Следам Шамбалы", en: "Altay: Seeking Shambhala" },
        region: "East", type: { kz: "Ретрит", ru: "Ретрит", en: "Retreat" },
        duration: 7, price: 1350, image: "https://images.unsplash.com/photo-1695479065605-930003c31abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCZWx1a2hhJTIwTW91bnRhaW4lMjBBbHRhaSUyMEthemFraHN0YW4lMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcwMzA5MzU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Hard",
        description: { kz: "Киелі Мұзтауға бару және Рахман қайнарларының шипалы күшін сезіну.", ru: "Посещение священной Белухи и целебных источников Рахмановские ключи.", en: "Visit sacred Belukha and experience the healing power of radon springs." },
        longDescription: {
            kz: "Шығыс Қазақстанның Алтай таулары — бұл мистика мен жабайы табиғат ұштасқан мекен. Сіз Рахман қайнарларының шипалы радондарын қабылдап, Катон-Қарағай ұлттық паркінің қалың тайгасымен жүріп өтесіз. Турдың шыңы — Мұзтауды (Белуха) Көккөл сарқырамасынан тамашалау. Бұл жерді көптеген адамдар аңызға айналған Шамбаланың кіреберісі деп есептейді. Біз сізге нағыз пантотерапия курсын ұсынамыз.",
            ru: "Алтайские горы Восточного Казахстана — край мистики и дикой природы. Вы примете целебные ванны Рахмановских ключей, пройдете через тайгу к виду на священную Белуху со стороны водопада Кокколь. Многие верят, что именно здесь находится вход в легендарную Шамбалу. Мы предлагаем курс пантотерапии в специализированном хозяйстве. Это тур для духовного и физического обновления.",
            en: "The Altai Mountains of East Kazakhstan are a land of mysticism and untouched wilderness. Take healing radon baths at Rakhmanov Springs and trek through the dense taiga. The highlight is witnessing the sacred Belukha Mountain from the Kokkol waterfall. Many believe this is the gateway to the legendary Shambhala. We offer an exclusive maral antler therapy course for renewal."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Австрия жолы", ru: "Староавстрийская дорога", en: "Old Austrian Road" }, desc: { kz: "Өскеменнен Катонға. Тұтқындар салған аңыз тау жолымен өту.", ru: "Выезд из Усть-Каменогорска. Проезд по легендарной дороге через перевалы.", en: "Departure from Ust-Kamenogorsk. Driving the historic POW-built mountain road." } },
            { day: 2, title: { kz: "Рахман қайнарлары", ru: "Рахмановские ключи", en: "Rakhmanov Springs" }, desc: { kz: "Шипалы суға түсу. Тау көлінің жағасында демалу.", ru: "Оздоровительные процедуры в источниках. Отдых у высокогорного озера.", en: "Healing procedures in springs. Relaxation by the high-altitude lake." } },
            { day: 3, title: { kz: "Мұзтау панорамасы", ru: "Панорама Белухи", en: "Belukha Panorama" }, desc: { kz: "Язевое көліне жол тарту. Мұзтаудың судағы бейнесін суретке түсіру.", ru: "Переезд к озеру Язевое. Фотосессия Белухи, отражающейся в воде.", en: "Transfer to Lake Yazevoe. Photography of Mt. Belukha reflecting in the water." } }
        ],
        included: [{ kz: "Тікұшақ (таңдау бойынша)", ru: "Вертолет (опционально)", en: "Helicopter (optional)" }, { kz: "Санаторий", ru: "Санаторий/Шале", en: "Sanatorium/Chalet" }, { kz: "Пантотерапия", ru: "Пантотерапия", en: "Antler therapy" }],
        whatToBring: [{ kz: "Жылы киім", ru: "Теплая одежда", en: "Warm clothes" }, { kz: "Етік", ru: "Ботинки", en: "Boots" }],
        contacts: { phone: "+7 (723) 555-01-99", email: "altai@kendala.kz" }
    },
    {
        id: 4,
        title: { kz: "Байқоңыр: Зымыран Ұшыру", ru: "Байконур: Запуск Ракеты", en: "Baikonur: Rocket Launch" },
        region: "Central", type: { kz: "Ғылыми / VIP", ru: "Научный / VIP", en: "Science / VIP" },
        duration: 3, price: 1800, image: "https://images.unsplash.com/photo-1614642240262-a452c2c11724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTb3l1eiUyMHJvY2tldCUyMGxhdW5jaCUyMEJhaWtvbnVyJTIwY29zbW9kcm9tZSUyMHNwYWNlfGVufDF8fHx8MTc3MDMwOTM1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Medium",
        description: { kz: "Зымыранның ұшырылуын көруге мүмкіндік беретін эксклюзивті тур.", ru: "Эксклюзивный тур с возможностью увидеть запуск ракеты вживую.", en: "An exclusive tour to witness a live rocket launch." },
        longDescription: {
            kz: "Байқоңыр — адамзат тарихындағы тұңғыш және ең үлкен ғарыш айлағы. Бұл тур сізге ғарыш дәуірінің рухын сезінуге мүмкіндік береді. Сіз Гагарин старттық алаңын, 'Буран' ғарыш кемесін және ғарышкерлердің үйлерін көресіз. Зымыранның отты аспанға көтерілуіне куә болу — бұл өмірде бір рет болатын тәжірибе.",
            ru: "Байконур — первый и крупнейший космодром в истории. Это закрытая территория, доступная только в составе официальной экспедиции. Наш тур приурочен к реальному графику запусков ракет 'Союз'. Вы посетите Гагаринский старт, увидите корабль 'Буран' и почувствуете дрожь земли в момент пуска. Это опыт, меняющий масштаб мышления.",
            en: "Baikonur is the first and largest space launch facility in history. Access is restricted to official expeditions only. Our tour is synchronized with the actual 'Soyuz' launch schedule. Visit Gagarin's Start, see the 'Buran' shuttle, and feel the earth shake at liftoff. This is a truly life-changing experience."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Жабық қала", ru: "Закрытый город", en: "Closed City" }, desc: { kz: "Байқоңыр қаласы. Королев пен Гагариннің үйлері.", ru: "Прибытие в город. Прохождение КПП. Экскурсия по памятникам и домикам Гагарина.", en: "Arrival at the city. Security clearance. Tour of monuments and Gagarin's house." } },
            { day: 2, title: { kz: "Зымыранның шығуы", ru: "Вывоз ракеты", en: "Rocket Rollout" }, desc: { kz: "Зымыранның ангардан шығып, старт алаңына орнатылуын бақылау.", ru: "Наблюдение за вывозом ракеты из ангара и ее установкой на старт.", en: "Witnessing the rocket rollout and its vertical installation on the pad." } },
            { day: 3, title: { kz: "СТАРТ!", ru: "СТАРТ!", en: "LIFT OFF!" }, desc: { kz: "Зымыранның ұшырылуын бақылау. Ғарышкерлердің баспасөз мәслихаты.", ru: "Прибытие на смотровую площадку. Момент зажигания и отрыва. Полет.", en: "Arrival at the observation site. The moment of ignition and liftoff. Flight." } }
        ],
        included: [{ kz: "Спецрұқсаттар", ru: "Спецпропуска", en: "Security Permits" }, { kz: "VIP қонақ үй", ru: "Отель 7 ветров", en: "VIP Hotel" }, { kz: "Ғарыш тағамы", ru: "Космическое питание", en: "Space food" }],
        whatToBring: [{ kz: "Төлқұжат", ru: "Паспорт", en: "Passport" }, { kz: "Бинокль", ru: "Бинокль", en: "Binoculars" }],
        contacts: { phone: "+7 (724) 222-11-00", email: "space@kendala.kz" },
        span: "md:col-span-2"
    },
    {
        id: 5,
        title: { kz: "Түркістан: Түркі Әлемінің Рухы", ru: "Туркестан: Дух Тюркского Мира", en: "Turkestan: Spirit of Turkic World" },
        region: "South", type: { kz: "Мәдени", ru: "Культурный", en: "Cultural" },
        duration: 2, price: 350, image: "https://images.unsplash.com/photo-1703005793401-210d97536064?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYXVzb2xldW0lMjBvZiUyMEtob2phJTIwQWhtZWQlMjBZYXNhd2klMjBUdXJrZXN0YW4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcwMzA3Mzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "ЮНЕСКО мұрасы мен футуристік Керуен-сарайды ұштастыратын тур.", ru: "Тур, объединяющий наследие ЮНЕСКО и футуристичный Керуен-сарай.", en: "Tour combining UNESCO heritage and futuristic Karavansaray." },
        longDescription: {
            kz: "Түркістан — бұл уақыттың екі қырын көрсететін қала. Бір жағынан — 14-ші ғасырда Әмір Темір салғызған асқақ Қожа Ахмет Ясауи кесенесі, екінші жағынан — заманауи 'Керуен-сарай' кешені. Бұл турда сіз Орталық Азияның рухани тарихына бойлайсыз. Кешкі Түркістан сізді ертегілер әлеміне апарады: су шоуы мен қайықтар шеруі сізге ұмытылмас әсер сыйлайды.",
            ru: "Туркестан — город, где древность встречается с будущим. В центре внимания — мавзолей Ходжи Ахмеда Ясави, шедевр архитектуры эпохи Тимуридов. Но Туркестан сегодня — это и комплекс 'Керуен-сарай', 'казахстанская Венеция'. Вас ждет шоу лодок, полет в 8D-кинотеатре над святынями страны и прогулки по современным базарам. Мы также посетим древний Отрар.",
            en: "Turkestan is where antiquity meets the future. Focus on the Mausoleum of Khoja Ahmed Yasawi, a Timurid masterpiece. Today's Turkestan also features 'Karavansaray,' the 'Venice of Kazakhstan.' Enjoy the boat parade, an 8D sensory flight over landmarks, and modern bazaars. We will also explore the ruins of ancient Otrar."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Отырар мен Арыстан-баб", ru: "Отрар и Арыстан-баб", en: "Otrar & Arystan-bab" }, desc: { kz: "Ежелгі Отырар қаласы. Арыстан-баб кесенесі. Кешкі Керуен-сарай.", ru: "Руины Отрара. Мавзолей учителя Ясави. Вечернее шоу лодок.", en: "Otrar ruins. Mausoleum of Yasawi's teacher. Evening boat show." } },
            { day: 2, title: { kz: "Ясауи кесенесі", ru: "Мавзолей Ясави", en: "Yasawi Mausoleum" }, desc: { kz: "Кесенеге экскурсия. Шығыс моншасы. Ұшатын театр.", ru: "Экскурсия в мавзолей. Древняя баня. Полет в 'Алтын Самұрық'.", en: "Mausoleum tour. Ancient bathhouse. 'Flying Theater' 8D flight." } }
        ],
        included: [{ kz: "Бутик-отель", ru: "Бутик-отель", en: "Boutique hotel" }, { kz: "Гид-тарихшы", ru: "Гид-историк", en: "Historian guide" }, { kz: "Билеттер", ru: "Входные билеты", en: "Entrance fees" }],
        whatToBring: [{ kz: "Орамал", ru: "Платок", en: "Headscarf" }, { kz: "Жеңіл киім", ru: "Легкая одежда", en: "Light clothing" }],
        contacts: { phone: "+7 (725) 333-44-55", email: "turkestan@kendala.kz" }
    },
    {
        id: 6,
        title: { kz: "Алтын Емел: Шөлдің Үні", ru: "Алтын-Эмель: Глас Пустыни", en: "Altyn-Emel: Voice of Desert" },
        region: "South", type: { kz: "Шөл экспедициясы", ru: "Пустынная экспедиция", en: "Desert Expedition" },
        duration: 2, price: 320, image: "https://images.unsplash.com/photo-1722525014163-2c5eeb287759?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5naW5nJTIwZHVuZXxlbnwxfHx8fDE3NzAzMDkzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Medium",
        description: { kz: "Әнші бархан мен Ақтаудың марстық таулары.", ru: "Услышьте орган песков на Поющем бархане и горы Актау.", en: "Hear the organ of the sands at Singing Dune and see Aktau." },
        longDescription: {
            kz: "Алтын Емел — таңғажайып табиғи құбылыстар мекені. Басты нысан — Әнші құм. Биіктігі 150 метр бұл құм төбе құрғақ ауа райында орган музыкасына ұқсайтын дыбыс шығарады. Сондай-ақ, марстың пейзаждарына ұқсайтын Ақтаудың түрлі-түсті бор тауларын зерттейміз. Бұл жерде сіз жабайы құландарды кездестіре аласыз.",
            ru: "Национальный парк Алтын-Эмель — территория космических пейзажей. Первый объект — Поющий бархан, издающий гул, похожий на звук самолета. Второй — горы Актау, меловые обнажения фантастических цветов: от белого до кроваво-красного. Здесь вы увидите диких куланов и джейранов в их естественной среде обитания.",
            en: "Altyn-Emel National Park is a land of cosmic landscapes. First is the Singing Dune, producing a deep vibration like an organ or jet engine. Second are the Aktau Mountains, chalk formations in fantastic colors ranging from white to deep crimson. You'll spot wild kulans and gazelles running free across the steppe."
        },
        rating: 4.7,
        itinerary: [
            { day: 1, title: { kz: "Әнші Құм", ru: "Поющий Бархан", en: "Singing Dune" }, desc: { kz: "Барханға шығу. Оның 'әнін' тыңдау. Басшидегі қонақ үй.", ru: "Восхождение на бархан. Слушание гула песков. Ужин в Басши.", en: "Ascent of the dune. Experience the 'song.' Dinner in Basshi." } },
            { day: 2, title: { kz: "Ақтау таулары", ru: "Горы Актау", en: "Aktau Mountains" }, desc: { kz: "Түрлі-түсті каньондарда серуен. Жабайы құландарды іздеу.", ru: "Прогулка по лабиринтам цветных гор. Поиск диких куланов.", en: "Hike through multi-colored canyons. Spotting wild kulans." } }
        ],
        included: [{ kz: "4x4 көлік", ru: "Внедорожник 4x4", en: "4x4 SUV" }, { kz: "Қонақ үй", ru: "Гостевой дом", en: "Guesthouse" }, { kz: "Рұқсат қағаз", ru: "Пропуска в парк", en: "Park permits" }],
        whatToBring: [{ kz: "Бафф", ru: "Бафф от песка", en: "Sand buff" }, { kz: "Көзілдірік", ru: "Очки", en: "Sunglasses" }],
        contacts: { phone: "+7 (777) 111-22-33", email: "desert@kendala.kz" }
    },
    {
        id: 7,
        title: { kz: "Бурабай: Қазақстан Швейцариясы", ru: "Боровое: Казахстанская Швейцария", en: "Burabay: Kazakh Switzerland" },
        region: "North", type: { kz: "Luxury Демалыс", ru: "Luxury Отдых", en: "Luxury Wellness" },
        duration: 3, price: 550, image: "https://images.unsplash.com/photo-1567870648828-7bfe8073c061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCdXJhYmF5JTIwbGFrZSUyMHJvY2slMjBaaHVtYmFrdGFzJTIwQm9yb3ZvZSUyMG5hdHVyZXxlbnwxfHx8fDE3NzAzMDkzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Солтүстік Қазақстанның ең жақсы шипажайында демалыңыз.", ru: "Отдохните в Rixos Borovoe среди сосен и голубых озер.", en: "Relax in Rixos Borovoe among pines and blue lakes." },
        longDescription: {
            kz: "Бурабай — қазақ даласының ортасындағы табиғи оазис. Бөлектау тауына шығып, Бурабай мен Үлкен Шабақты көлдерінің панорамасын тамашалайсыз. Жұмбақтас жартасының аңыздарын тыңдап, қайықпен серуендейсіз. Қарағайлы орманның шипалы ауасы денсаулығыңызды нығайтады. Біз Rixos Borovoe қонақ үйінде демалысты ұсынамыз.",
            ru: "Боровое — жемчужина Казахстана. Наш тур предлагает премиальный отдых в отеле Rixos Borovoe. Вы совершите восхождение на гору Болектау для панорамных снимков, подплывете на лодке к загадочной скале Жумбактас и посетите поляну Абылай хана. Воздух здесь пропитан сосной, что делает каждую прогулку сеансом ароматерапии.",
            en: "Burabay is a gem in Kazakhstan's crown. Our tour offers a premium stay at Rixos Borovoe. Hike up Bolektau Mountain for iconic views, take a boat to the mysterious Zhumbaktas rock, and visit the Abylay Khan Glade. The air is saturated with pine phytoncides, making every stroll a session of natural aromatherapy."
        },
        rating: 4.6,
        itinerary: [
            { day: 1, title: { kz: "Бөлектау Шыңы", ru: "Пик Болектау", en: "Bolektau Peak" }, desc: { kz: "Астанадан келу. Бөлектауға шығу. Көлдер панорамасы.", ru: "Трансфер из Астаны. Хайкинг на Болектау. Заселение в отель.", en: "Astana transfer. Hike to Bolektau for lake views. Hotel check-in." } },
            { day: 2, title: { kz: "Жұмбақтас", ru: "Жумбактас", en: "Zhumbaktas Rock" }, desc: { kz: "Қайықпен серуендеу. Жұмбақтасқа бару. Вело-серуен.", ru: "Прогулка на лодке к скале Жумбактас. Велопрогулка по лесу.", en: "Boat trip to Zhumbaktas. Forest cycling tour." } },
            { day: 3, title: { kz: "SPA Демалыс", ru: "SPA Релакс", en: "SPA Relax" }, desc: { kz: "SPA процедуралары. Абылай хан алаңы. Астанаға оралу.", ru: "Свободное время в SPA. Поляна Абылай Хана. Возврат в Астану.", en: "SPA time. Abylay Khan Glade visit. Return transfer." } }
        ],
        included: [{ kz: "Rixos 5*", ru: "Отель Rixos 5*", en: "Rixos 5* Hotel" }, { kz: "Трансфер", ru: "Премиум трансфер", en: "Premium transfer" }, { kz: "SPA", ru: "SPA центр", en: "SPA access" }],
        whatToBring: [{ kz: "Dress-code киім", ru: "Вечерняя одежда", en: "Dinner outfit" }, { kz: "Шомылу киімі", ru: "Купальник", en: "Swimwear" }],
        contacts: { phone: "+7 (716) 336-12-34", email: "borovoe@rixos.com" }
    },
    {
        id: 8,
        title: { kz: "Бүркітшілер: Көшпенділер Рухы", ru: "Беркутчи: Дух Кочевников", en: "Berkutchi: Nomad Spirit" },
        region: "East", type: { kz: "Мәдени", ru: "Культурная антропология", en: "Cultural Anthropology" },
        duration: 4, price: 850, image: "https://images.unsplash.com/photo-1672939113761-f599cebb325f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFYWdsZSUyMGh1bnRlciUyMEthemFraHN0YW4lMjBub21hZCUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc3MDMwOTM1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Medium",
        description: { kz: "Бүркітшілермен бірге нағыз саятшылық өнерін зерттеңіз.", ru: "Изучите древнее искусство охоты с беркутами вместе с мастерами.", en: "Study the ancient art of eagle hunting with the masters." },
        longDescription: {
            kz: "Бұл тур — қазақтың мыңжылдық саятшылық дәстүрін өз көзіңізбен көруге арналған бірегей мүмкіндік. Шығыс Қазақстанның тауларында сіз нағыз бүркітшілермен кездесесіз. Бұл өнер әкеден балаға мұра болып қалып отырған қасиетті білім. Біз бүркітшілер отбасында киіз үйде тұруды ұйымдастырамыз. Таңертең атқа мініп, тауға аңшылық демонстрациясына шығамыз.",
            ru: "Этот тур — редкая возможность прикоснуться к живой традиции, которой три тысячи лет. В горах Алтая мы отправимся к потомственным охотникам. Вы узнаете, как тренируют беркута и как формируется связь птицы и человека. Проживание в аутентичных юртах и демонстрация реальной охоты. Вы сможете сами подержать птицу на руке и сделать уникальные кадры.",
            en: "This tour is a rare chance to witness a 3,000-year-old tradition. In the Altai mountains, we visit hereditary hunters. Learn how eagles are trained and the mystical bond between bird and master. Stay in authentic yurts and witness a live hunting demonstration. You'll hold the majestic bird yourself for unique photos."
        },
        rating: 5.0,
        itinerary: [
            { day: 1, title: { kz: "Ауылға келу", ru: "Приезд в аул", en: "Village Arrival" }, desc: { kz: "Дәстүрлі шашу. Киіз үйге орналасу. Алғашқы танысу.", ru: "Встреча с ритуалом 'Шашу'. Заселение в юрту. Вечернее чаепитие.", en: "Traditional 'Shashu' welcome. Yurt check-in. Evening tea." } },
            { day: 2, title: { kz: "Құспен танысу", ru: "Знакомство с птицей", en: "Meeting the Bird" }, desc: { kz: "Бүркітті тамақтандыру. Саятшылық жабдықтары. Атқа міну.", ru: "Урок обращения с птицей. Основы верховой езды. История беркутчи.", en: "Bird handling lesson. Horseback riding basics. Berkutchi history." } },
            { day: 3, title: { kz: "Аңшылық", ru: "Охота", en: "The Hunt" }, desc: { kz: "Тауға атпен шығу. Аңшылық демонстрациясы. Дала түскі асы.", ru: "Выезд в горы. Запуск беркута с вершины. Фотосессия в костюмах.", en: "Mountain ride. Launching the eagle from a peak. Costume photo session." } }
        ],
        included: [{ kz: "VIP Юрта", ru: "Проживание в VIP-юрте", en: "VIP Yurt stay" }, { kz: "Аттар", ru: "Аренда лошадей", en: "Horse rental" }, { kz: "Ұлттық тағам", ru: "Полный пансион", en: "Full-board meals" }],
        whatToBring: [{ kz: "Жылы киім", ru: "Ветровка", en: "Windbreaker" }, { kz: "Фото-техника", ru: "Камера", en: "Camera gear" }],
        contacts: { phone: "+7 (702) 888-99-00", email: "culture@kendala.kz" }
    },
    {
        id: 9,
        title: { kz: "Астана: Сәулет Спектрі", ru: "Астана: Спектр Архитектуры", en: "Astana: Spectrum of Architecture" },
        region: "Astana", type: { kz: "Урбан Экспедиция", ru: "Урбан Экспедиция", en: "Urban Expedition" },
        duration: 2, price: 250, image: "https://images.unsplash.com/photo-1759167631378-0545007f9799?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBc3RhbmElMjBjaXR5JTIwc2t5bGluZSUyMEtoYW4lMjBTaGF0eXIlMjBCYWl0ZXJlayUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzcwMzA5MzU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Еуразия жүрегіндегі заманауи сәулет өнерін ашыңыз.", ru: "Хан-Шатыр, Байтерек и сфера Нур-Алем в футуристичном мегаполисе.", en: "Discover Khan Shatyr, Baiterek, and Nur-Alem in a futuristic city." },
        longDescription: {
            kz: "Астана — бұл даланың ортасындағы футуристік арман. Біз Норман Фостер салған 'Хан Шатыр' — әлемдегі ең үлкен шатырды аралаймыз. 'Бәйтерек' монументінен қала панорамасын көріп, 'Нұр Әлем' сферасында болашақ энергиясын сезінеміз. Астананың түнгі шамдары мен Есіл өзенінің жағалауы сізге ерекше көңіл-күй сыйлайды. Проживание в Ritz-Carlton.",
            ru: "Астана — футуристический мираж в степи. Мы посетим 'Хан Шатыр' Нормана Фостера, поднимемся на 'Байтерек' и увидим сферу 'Нур-Алем' — чудо EXPO-2017. Вечерняя прогулка на теплоходе по реке Ишим позволит увидеть сияющие небоскребы с воды. Проживание в отеле Ritz-Carlton или Sheraton с лучшими видами на город.",
            en: "Astana is a futuristic mirage realized in stone and glass. Visit Norman Foster's 'Khan Shatyr,' ascend the 'Baiterek' tower, and explore the 'Nur-Alem' sphere—the technological marvel of EXPO-2017. An evening boat cruise on the Ishim River offers spectacular views of glowing skyscrapers. Stay at the Ritz-Carlton or Sheraton."
        },
        rating: 4.7,
        itinerary: [
            { day: 1, title: { kz: "Сол Жағалау", ru: "Левый Берег", en: "Left Bank" }, desc: { kz: "Бәйтерекке шығу. Пирамида. Хан Шатырдағы Sky Beach.", ru: "Восхождение на Байтерек. Пирамида. Релакс на пляже Sky Beach.", en: "Climbing Baiterek. The Pyramid visit. Sky Beach relaxation." } },
            { day: 2, title: { kz: "ЭКСПО Мұрасы", ru: "Наследие ЭКСПО", en: "EXPO Heritage" }, desc: { kz: "Нұр Әлем сферасы. Ұлттық музей. Кешкі Есіл серуені.", ru: "Сфера Нур-Алем. Зал Золотого человека. Прогулка на теплоходе.", en: "Nur-Alem sphere. Hall of the Golden Man. Boat cruise." } }
        ],
        included: [{ kz: "Ritz-Carlton", ru: "Отель Ritz-Carlton", en: "Ritz-Carlton stay" }, { kz: "Жеке гид", ru: "Индивидуальный гид", en: "Private guide" }, { kz: "Гастро-кешкі ас", ru: "Гастро-ужин", en: "Gourmet dinner" }],
        whatToBring: [{ kz: "Жайлы аяқ киім", ru: "Удобная обувь", en: "Walking shoes" }, { kz: "Стильді киім", ru: "Стильный наряд", en: "Stylish outfit" }],
        contacts: { phone: "+7 (717) 222-33-44", email: "astana@kendala.kz" }
    },
    {
        id: 10,
        title: { kz: "Ұлытау: Халықтар Анасы", ru: "Улытау: Колыбель Наций", en: "Ulytau: Cradle of Nations" },
        region: "Central", type: { kz: "Тарихи", ru: "Историческая экспедиция", en: "Historical Expedition" },
        duration: 4, price: 650, image: "https://images.unsplash.com/photo-1671779262081-ec54ae211f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLYXpha2hzdGFuJTIwc3RlcHBlJTIwaGlzdG9yaWNhbHxlbnwxfHx8fDE3NzAzMDkzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Medium",
        description: { kz: "Қазақ мемлекеттілігінің бастауы мен хандардың кесенелері.", ru: "Глубокое погружение в историю Золотой Орды и казахских ханов.", en: "A deep dive into Golden Horde history and Kazakh Khans." },
        longDescription: {
            kz: "Ұлытау — Қазақстанның географиялық және рухани орталығы. Бұл жерде Алтын Орда хандарының ставкалары болған. Біз Жошы хан мен Алаша хан кесенелеріне барып, тарихқа бойлаймыз. Әулиетау шыңына шығып, киелі энергияны сезінеміз. Бұл — өз тамырын іздеген жандар үшін нағыз экспедиция. Біз жол талғамайтын көліктермен жүреміз.",
            ru: "Улытау — географический и духовный центр страны. Здесь находилась ставка ханов Золотой Орды. Мы посетим мавзолей Джучи-хана, старшего сына Чингисхана, и священную гору Аулиетау — место силы и общения с духами предков. Это суровое, величественное место, пропитанное запахом полыни и истории.",
            en: "Ulytau is the geographical and spiritual center of Kazakhstan. It served as the headquarters for Golden Horde Khans. Visit the mausoleum of Jochi Khan, Genghis Khan's eldest son, and ascend sacred Aulietau Mountain—a place of power and ancestral communion. A rugged, majestic landscape thick with the scent of history."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Дала Жүрегі", ru: "Сердце Степи", en: "Heart of Steppe" }, desc: { kz: "Жезқазғаннан Ұлытауға жол. Географиялық орталық монументі.", ru: "Трансфер в Улытау. Остановка у монумента центра страны.", en: "Transfer to Ulytau. Stop at the geographical center monument." } },
            { day: 2, title: { kz: "Хандар Пантеоны", ru: "Пантеон Ханов", en: "Khan Pantheon" }, desc: { kz: "Жошы хан мен Алаша хан кесенелері. Тарихи лекция.", ru: "Экскурсия в мавзолеи Джучи-хана и Алаша-хана. Обед у реки.", en: "Jochi and Alasha Khan mausoleums. Historical lecture. River picnic." } },
            { day: 3, title: { kz: "Әулиетау", ru: "Аулиетау", en: "Aulietau" }, desc: { kz: "Киелі шыңға шығу. Петроглифтерді көру. Лагерь.", ru: "Восхождение на священную гору. Осмотр петроглифов Теректы-Аулие.", en: "Sacred peak ascent. Viewing Terekty-Auliye petroglyphs." } }
        ],
        included: [{ kz: "4x4 Джип", ru: "Внедорожник 4x4", en: "4x4 SUV" }, { kz: "Гид-тарихшы", ru: "Гид-историк", en: "Historian guide" }, { kz: "Лагерь", ru: "Полевой лагерь", en: "Field camp" }],
        whatToBring: [{ kz: "Hiking етігі", ru: "Ботинки для хайкинга", en: "Hiking boots" }, { kz: "Powerbank", ru: "Пауэрбанк", en: "Power bank" }],
        contacts: { phone: "+7 (710) 633-44-22", email: "ulytau@kendala.kz" }
    },
    {
        id: 11,
        title: { kz: "Каспий: Ақ Жартастар", ru: "Каспий: Белые Скалы", en: "Caspian: White Cliffs" },
        region: "West", type: { kz: "Теңіз", ru: "Морская экскурсия", en: "Marine Excursion" },
        duration: 4, price: 780, image: "https://images.unsplash.com/photo-1742593236662-9362cfc1999f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYXNwaWFuJTIwU2VhJTIwS2F6YWtoc3RhbiUyMGNvYXN0JTIwcm9ja3l8ZW58MXx8fHwxNzcwMzA5NjE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Каспийдің жабайы жағалауы мен жартастарын ашыңыз.", ru: "Прогулка над морем по Скальной тропе и круиз на яхте.", en: "Walk the Rock Path and enjoy a sunset yacht cruise." },
        longDescription: {
            kz: "Каспий теңізі — әлемдегі ең үлкен ішкі су қоймасы. Ақтаудың 'Жартас жолы' сізді теңіз үстіндегі серуенге шақырады. 'Голубая лагуна' мен Саура сайындағы тасбақалар көлі табиғаттың тылсым күшін көрсетеді. Біз яхтамен ашық теңізге шығып, күннің батуын тамашалаймыз. Балықтан жасалған бешбармақ дәмін татыңыз.",
            ru: "Каспийское море — уникальная экосистема. Наш тур включает прогулку по Скальной тропе в Актау, визит в ущелье Саура с пресным озером и купание в бирюзовой 'Голубой бухте'. Вечером мы организуем круиз на яхте на закате. Попробуйте местный деликатес — рыбный бешбармак. Проживание в отелях на первой линии.",
            en: "The Caspian Sea is a unique ecosystem. Our tour includes the Aktau Rock Path, Saura Gorge with its freshwater lake, and swimming in the turquoise 'Blue Bay.' In the evening, we organize a sunset yacht cruise. Taste the local delicacy: fish beshbarmak. Stay in premium beachfront hotels."
        },
        rating: 4.6,
        itinerary: [
            { day: 1, title: { kz: "Ақтау рухы", ru: "Дух Актау", en: "Spirit of Aktau" }, desc: { kz: "Жартас жолы. Теңіз жағасындағы кешкі ас.", ru: "Прогулка по Скальной тропе. Ужин из каспийской рыбы.", en: "Rock Path stroll. Fresh Caspian fish dinner." } },
            { day: 2, title: { kz: "Голубая бухта", ru: "Голубая бухта", en: "Blue Bay" }, desc: { kz: "Шомылу. Яхтамен ашық теңізге шығу.", ru: "Поездка в бухту. Купание. Вечерний круиз на яхте.", en: "Drive to the bay. Swimming. Evening yacht cruise." } },
            { day: 3, title: { kz: "Саура", ru: "Саура", en: "Saura" }, desc: { kz: "Саура сайы. Тасбақалар көлі. Түйеге міну.", ru: "Экскурсия в каньон Саура. Фотосессия с верблюдами.", en: "Saura Canyon excursion. Photo session with camels." } }
        ],
        included: [{ kz: "Отель 1-ші линия", ru: "Отель 1-я линия", en: "Beachfront hotel" }, { kz: "Яхта", ru: "Круиз на яхте", en: "Yacht cruise" }, { kz: "Балық мәзірі", ru: "Рыбное меню", en: "Seafood menu" }],
        whatToBring: [{ kz: "Шомылу киімі", ru: "Купальник", en: "Swimwear" }, { kz: "Көзілдірік", ru: "Очки", en: "Sunglasses" }],
        contacts: { phone: "+7 (729) 222-00-11", email: "caspian@kendala.kz" }
    },
    {
        id: 12,
        title: { kz: "Жоңғар Алатауы: Мұздықтар", ru: "Джунгарский Алатау: Ледники", en: "Dzungarian Alatau: Glaciers" },
        region: "East", type: { kz: "Экстремалды", ru: "Экстремальный треккинг", en: "Extreme Trekking" },
        duration: 6, price: 1100, image: "https://images.unsplash.com/photo-1730744741007-760cdbfeb1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Extreme",
        description: { kz: "Қазақстанның ең жабайы және аз зерттелген таулары.", ru: "Водопад Бурхан-Булак и грандиозные ледники Безсонова.", en: "Burkhan-Bulak waterfall and massive Bezsonov glaciers." },
        longDescription: {
            kz: "Жоңғар Алатауы — нағыз жабайы табиғат. Біз бұл турда 4000 метрден асатын биік асулардан өтіп, алып мұздықтарға барамыз. Жолымызда Орталық Азиядағы ең биік сарқырамалардың бірі — Бурхан-Бұлақты (168 м) көреміз. Бұл жерде байланыс жоқ, тек сіз және табиғат. Жоғары физикалық дайындықты талап етеді.",
            ru: "Самые труднодоступные горы Казахстана. Мы отправимся к ледникам Безсонова, пересекая бурные реки на лошадях. Вы увидите Бурхан-Булак — самый высокий водопад страны (168 метров). Здесь нет связи и толп туристов. Воздух настолько чист, что кружится голова. Сопровождение опытными гидами и поваром.",
            en: "The most inaccessible mountains in Kazakhstan. We head towards the Bezsonov glaciers, crossing turbulent rivers on horseback. Witness Burkhan-Bulak, the country's tallest waterfall (168m). There is no signal and no crowds. The air is so pure it's intoxicating. Guided by experts with a private chef."
        },
        rating: 5.0,
        itinerary: [
            { day: 1, title: { kz: "Кора шатқалы", ru: "Ущелье Кора", en: "Kora Gorge" }, desc: { kz: "Талдықорғаннан тауға жол. Базалық лагерь құру.", ru: "Трансфер в горы. Установка базового лагеря у реки.", en: "Mountain transfer. Setting up base camp by the river." } },
            { day: 2, title: { kz: "Бурхан-Бұлақ", ru: "Бурхан-Булак", en: "Burkhan-Bulak" }, desc: { kz: "Сарқырамаға жорық. Оның қуатын сезіну.", ru: "Радиальный выход к водопаду. Медитация у воды.", en: "Hike to the giant waterfall. Meditation by the mist." } },
            { day: 3, title: { kz: "Мұздыққа жол", ru: "Путь к леднику", en: "Glacier Path" }, desc: { kz: "Биік таулы асу арқылы мұздыққа көтерілу.", ru: "Восхождение к языку ледника. Установка лагеря 3000м.", en: "Ascent to the glacier tongue. High camp at 3000m." } }
        ],
        included: [{ kz: "Тау гидтері", ru: "Горные гиды", en: "Mountain guides" }, { kz: "Аттар", ru: "Лошади для груза", en: "Pack horses" }, { kz: "Тамақ", ru: "Экспедиционное питание", en: "Expedition food" }],
        whatToBring: [{ kz: "Етік", ru: "Горные ботинки", en: "Mountain boots" }, { kz: "Ұйқы қап", ru: "Спальник -10С", en: "Sleeping bag -10C" }],
        contacts: { phone: "+7 (705) 555-66-77", email: "dzungaria@kendala.kz" }
    },
    {
        id: 13,
        title: { kz: "Шымкент: Гастро-Ренессанс", ru: "Шымкент: Гастро-Ренессанс", en: "Shymkent: Gastro Renaissance" },
        region: "South", type: { kz: "Гастро", ru: "Гастро-тур", en: "Gastro Tour" },
        duration: 3, price: 280, image: "https://images.unsplash.com/photo-1690269786760-237a7c75d2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Easy",
        description: { kz: "Палау, самса және шынайы оңтүстік қонақжайлылығы.", ru: "Лучший плов, тандырная самса и вечерний шашлык-марафон.", en: "Best pilaf, tandoor samsa, and an evening kebab marathon." },
        longDescription: {
            kz: "Шымкент — дәмнің мерекесі. Тандыр самса, шынайы кәуап және Шымкент палауы. Оңтүстік қонақжайлылығы мен базардың хош иісі сізді таңғалдырады. Біз 'Қазығұрт' тауына барып, аңызға айналған 'Нұх кемесін' көреміз. Бұл тур — тек тамақтану емес, бұл оңтүстік өмір салтын түсіну.",
            ru: "Шымкент — это не просто город, это культ еды. Мы начнем утро на Зеленом базаре, попробуем тандырную самсу и узнаем секрет настоящего плова в одном из закрытых заведений 'для своих'. Вечер проведем в знаменитых шашлычных двориках. В программе также поездка к горе Казыгурт, где причалил Ковчег Ноя.",
            en: "Shymkent is more than a city; it's a food cult. Start the morning at the Green Bazaar, try melt-in-your-mouth tandoor samsa, and discover the secret of authentic pilaf in a local hidden gem. Spend evenings in famous kebab courtyards. Also includes a trip to Kazygurt Mountain, the legendary Ark mooring site."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Дәм Мерекесі", ru: "Праздник Вкуса", en: "Taste Feast" }, desc: { kz: "Көк базар. Самса мен палау дегустациясы.", ru: "Завтрак на базаре. Обед в центре плова. Ужин - шашлыки.", en: "Bazaar breakfast. Pilaf center lunch. Kebab dinner." } },
            { day: 2, title: { kz: "Көне Сайрам", ru: "Древний Сайрам", en: "Ancient Sairam" }, desc: { kz: "Тарихи кесенелер. Жергілікті этно-ауыл.", ru: "Мавзолеи Сайрама. Визит в местный аул. Традиции юга.", en: "Sairam mausoleums. Village visit. Southern traditions." } },
            { day: 3, title: { kz: "Қазығұрт", ru: "Казыгурт", en: "Kazygurt" }, desc: { kz: "Нұх кемесі ескерткіші. Шымкентпен қоштасу.", ru: "Поездка к 'Ноеву ковчегу'. Финальный дастархан.", en: "Trip to 'Noah's Ark'. Final celebratory feast." } }
        ],
        included: [{ kz: "Гастро-гид", ru: "Гастро-гид", en: "Gastro guide" }, { kz: "Тамақ", ru: "Все дегустации", en: "All tastings" }, { kz: "Отель", ru: "Отель в центре", en: "Central hotel" }],
        whatToBring: [{ kz: "Тәбет", ru: "Аппетит", en: "Appetite" }, { kz: "Бос киім", ru: "Свободная одежда", en: "Loose clothing" }],
        contacts: { phone: "+7 (725) 222-77-88", email: "food@kendala.kz" }
    },
    {
        id: 14,
        title: { kz: "Қарқаралы: Гранитті Оазис", ru: "Каркаралы: Гранитный Оазис", en: "Karkaraly: Granite Oasis" },
        region: "Central", type: { kz: "Табиғат", ru: "Хайкинг в соснах", en: "Pine Forest Hiking" },
        duration: 3, price: 320, image: "https://images.unsplash.com/photo-1752419258215-60ba58a20a74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Medium",
        description: { kz: "Мистикалық Шайтанкөл мен гранитті жартастар.", ru: "Удивительные гранитные горы и леса посреди степи.", en: "Amazing granite mountains and forests in the steppe." },
        longDescription: {
            kz: "Қарқаралы — граниттен қаланған ертегі әлемі. Басты мақсат — биік таудағы мистикалық Шайтанкөл. Оның тереңдігі әлі күнге дейін белгісіз. Қарағайлы орманның хош иісі мен таза ауасы хайкингті жеңілдетеді. Біз сондай-ақ 'Үш үңгірге' барып, көне адамдардың тұрағын көреміз. Тыныштық пен гармония мекені.",
            ru: "Фантастические скалы и вековые сосны в сердце Сарыарки. Главная цель — озеро Шайтанколь, спрятанное среди утесов. По легенде, его глубина неизвестна. Мы пройдем к 'Трем пещерам' — стоянке древнего человека. Воздух насыщен хвоей, что делает хайкинг легким. Идеальное место для отдыха от города.",
            en: "Fantastic cliffs and ancient pines in the heart of Saryarka. The main destination is Shaitankol Lake, hidden among granite crags. According to legend, its depth is unknown. We'll hike to the 'Three Caves'—an ancient settlement. The pine-saturated air makes hiking a breeze. Perfect for escaping the city."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Орман серуені", ru: "Лесная тропа", en: "Forest Stroll" }, desc: { kz: "Қарағандыдан келу. Эко-үй. 'Сказка' соқпағы.", ru: "Заселение в гостевой дом. Прогулка по тропе 'Сказка'.", en: "Arrival. Eco-house check-in. 'Fairytale' trail walk." } },
            { day: 2, title: { kz: "Шайтанкөл", ru: "Шайтанколь", en: "Shaitankol" }, desc: { kz: "Шайтанкөлге жорық (6 сағат). Төбеден көрініс.", ru: "Восхождение к озеру. Легенды и мифы. Обед на скалах.", en: "Hike to the lake. Legends and myths. Cliff-top lunch." } },
            { day: 3, title: { kz: "Кент таулары", ru: "Горы Кент", en: "Kent Mountains" }, desc: { kz: "Көне будда ғибадатханасының руиналары.", ru: "Поездка к руинам дворца XVII века. Прощание с лесом.", en: "Trip to 17th-century palace ruins. Forest farewell." } }
        ],
        included: [{ kz: "Дом отдыха", ru: "Дом отдыха", en: "Rest house" }, { kz: "Гид", ru: "Гид-инструктор", en: "Guide-instructor" }, { kz: "Пикник", ru: "Пикник", en: "Picnic" }],
        whatToBring: [{ kz: "Дождевик", ru: "Дождевик", en: "Raincoat" }, { kz: "Кроссовка", ru: "Кроссовки", en: "Sneakers" }],
        contacts: { phone: "+7 (721) 222-11-22", email: "karkaraly@kendala.kz" }
    },
    {
        id: 15,
        title: { kz: "Баянауыл: Аңыз Тастар", ru: "Баянаул: Легендарные Камни", en: "Bayanaul: Legendary Rocks" },
        region: "North", type: { kz: "Демалыс", ru: "Магия Жасыбая", en: "Magic of Jasybay" },
        duration: 3, price: 290, image: "https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Easy",
        description: { kz: "Жасыбай көлі мен Кемпіртас жартасы.", ru: "Скалы необычных форм и чистейшее озеро Жасыбай.", en: "Unusually shaped rocks and the pristine Lake Jasybay." },
        longDescription: {
            kz: "Баянауыл — Қазақстанның тұңғыш ұлттық паркі. Мұнда тастар тірі сияқты: Кемпіртас, Найзатас, Атбасы. Жасыбай көлінің жылы суында шомылып, 'Қоңыр әулие' үңгіріне барып тілек тілейміз. Фотографтар үшін таптырмас мекен: қызыл жартастар мен жасыл қарағайлардың контрасты керемет.",
            ru: "Старейший нацпарк, где камни оживают в легендах. Мы посетим скалу Кемпиртас (Старуха), искупаемся в Жасыбае — самом теплом озере региона. Совершим паломничество к пещере Коныр-Аулие для исполнения желаний. Рай для фотографов: контраст охристых скал и лазурной воды.",
            en: "The oldest national park, where stones come alive in legends. Visit the Kempirtas (Old Woman) rock and swim in Jasybay—the region's warmest lake. Make a pilgrimage to Konyr-Auliye Cave for wish-granting. A photographer's paradise: the contrast of ochre cliffs and azure water."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Жасыбай жағасы", ru: "Берег Жасыбая", en: "Jasybay Shore" }, desc: { kz: "Көлге келу. Қайықпен серуен. Пляж.", ru: "Приезд. Прогулка на лодке к острову Любви. Отдых.", en: "Arrival. Boat trip to the Island of Love. Beach time." } },
            { day: 2, title: { kz: "Аңыз тастар", ru: "Легенды камней", en: "Stone Legends" }, desc: { kz: "Кемпіртас пен Найзатасқа жорық. Фотосессия.", ru: "Экскурсия к скалам. История батыра Жасыбая. Обед.", en: "Rock excursions. Story of Batyr Jasybay. Lunch." } },
            { day: 3, title: { kz: "Киелі үңгір", ru: "Священная пещера", en: "Sacred Cave" }, desc: { kz: "Қоңыр әулие үңгірі. Павлодарға оралу.", ru: "Ритуал в пещере Коныр-Аулие. Трансфер в Павлодар.", en: "Ritual in Konyr-Auliye Cave. Transfer to Pavlodar." } }
        ],
        included: [{ kz: "Демалыс орны", ru: "Дом отдыха", en: "Resort stay" }, { kz: "Қайық", ru: "Аренда лодок", en: "Boat rental" }, { kz: "Гид", ru: "Экскурсовод", en: "Guide" }],
        whatToBring: [{ kz: "Күннен қорғаныс", ru: "Крем от солнца", en: "Sunscreen" }, { kz: "Бас киім", ru: "Головной убор", en: "Hat" }],
        contacts: { phone: "+7 (718) 222-99-88", email: "bayanaul@kendala.kz" }
    },
    {
        id: 16,
        title: { kz: "Арал: Елес Кемелер", ru: "Арал: Корабли-Призраки", en: "Aral: Ghost Ships" },
        region: "West", type: { kz: "Эко-экспедиция", ru: "Постапокалиптика", en: "Post-Apocalyptic" },
        duration: 4, price: 750, image: "https://images.unsplash.com/photo-1614642240262-a452c2c11724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Hard",
        description: { kz: "Арал теңізінің тартылған табаны мен кемелер зираты.", ru: "Урок истории на дне высохшего моря в пустыне Аралкум.", en: "A history lesson on the dry seabed in Aralkum desert." },
        longDescription: {
            kz: "Арал теңізі — экологиялық апаттың символы. Біз Жаланаш ауылы маңындағы кемелер зиратына барамыз. Теңіз тартылғаннан кейін шөлде қалып қойған кемелер — өте әсерлі көрініс. Аралқұм шөлімен жүріп өтіп, ыстық бұлақтарға шомыламыз. Бұл — тарихпен бетпе-бет келу.",
            ru: "Путешествие в постапокалиптическую реальность. Мы посетим кладбище кораблей в Жаланаше, где ржавые остовы судов замерли в песках на десятки километров от воды. Проедем по Аралкуму — новой пустыне на дне моря. Ночевки в палатках под огромными звездами.",
            en: "A journey into post-apocalyptic reality. Visit the ship graveyard in Zhalanash, where rusted hulls stand in the sand tens of kilometers from the water. Drive across Aralkum—a new desert on the seabed. Tent camping under massive desert stars."
        },
        rating: 4.5,
        itinerary: [
            { day: 1, title: { kz: "Арал қаласы", ru: "Город Аральск", en: "Aralsk City" }, desc: { kz: "Мұражай мен порт. Порт крандарын көру.", ru: "Музей истории рыболовства. Осмотр бывшего порта.", en: "Fishery history museum. Former port exploration." } },
            { day: 2, title: { kz: "Кемелер зираты", ru: "Кладбище кораблей", en: "Ship Graveyard" }, desc: { kz: "Жаланаш. Құмдағы кемелер. Теңіз табанындағы түн.", ru: "Фотосессия у брошенных кораблей. Ночевка в пустыне.", en: "Abandoned ship photo session. Night in the desert." } },
            { day: 3, title: { kz: "Акеспе бұлағы", ru: "Источник Акеспе", en: "Akespe Spring" }, desc: { kz: "Ыстық бұлақ. Термалды суға түсу.", ru: "Термальные ванны под открытым небом. Кокаральская плотина.", en: "Open-air thermal baths. Kokaral Dam visit." } }
        ],
        included: [{ kz: "4x4 Джип", ru: "Внедорожник 4x4", en: "4x4 SUV" }, { kz: "Лагерь", ru: "Экспедиционный лагерь", en: "Expedition camp" }, { kz: "Тамақ", ru: "Полный пансион", en: "Full-board" }],
        whatToBring: [{ kz: "Маска", ru: "Маска от пыли", en: "Dust mask" }, { kz: "Жылы киім", ru: "Теплая куртка", en: "Warm jacket" }],
        contacts: { phone: "+7 (724) 333-22-11", email: "aral@kendala.kz" }
    },
    {
        id: 17,
        title: { kz: "Ақсу-Жабағылы: Тұңғыш Қорық", ru: "Аксу-Жабаглы: Заповедник", en: "Aksu-Zhabagly: The Reserve" },
        region: "South", type: { kz: "Эко-тур", ru: "Бердвотчинг", en: "Birdwatching" },
        duration: 3, price: 300, image: "https://images.unsplash.com/photo-1752503256243-2edf964c00d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Medium",
        description: { kz: "Ақсу каньоны мен Грейг қызғалдақтары.", ru: "Каньон Аксу (500м) и краснокнижные тюльпаны.", en: "Aksu Canyon (500m) and rare wild tulips." },
        longDescription: {
            kz: "Ақсу-Жабағылы — Орталық Азиядағы ең көне қорық. Басты байлығы — тереңдігі 500 метрлік Ақсу каньоны. Көктемде мұнда әлемдік деңгейдегі қызғалдақтар гүлдейді. Снежные барсы мен аюларды кездестіру мүмкіндігі бар. Нағыз табиғат сүйер қауымға арналған.",
            ru: "Старейший заповедник региона под ЮНЕСКО. Каньон Аксу глубиной 500 метров — зрелище не для слабонервных. В апреле степи покрываются тюльпанами Грейга и Кауфмана. Здесь обитают снежные барсы, тянь-шаньские медведи и сотни видов птиц. Рай для ботаников и фотографов.",
            en: "The region's oldest UNESCO-listed reserve. Aksu Canyon, 500m deep, is a sight to behold. In April, the steppes bloom with Greig's and Kaufman's tulips. Home to snow leopards, brown bears, and hundreds of bird species. A true haven for botanists and wildlife photographers."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Каньон Ақсу", ru: "Каньон Аксу", en: "Aksu Canyon" }, desc: { kz: "Каньон ернеуіне шығу. Панорама.", ru: "Подход к краю каньона. Вид на реку Аксу с высоты 500м.", en: "Approaching the canyon edge. View of Aksu river from 500m." } },
            { day: 2, title: { kz: "Жабағылы өзені", ru: "Река Жабаглы", en: "Zhabagly River" }, desc: { kz: "Өзен бойымен атпен серуендеу.", ru: "Конная прогулка вдоль реки к водопадам.", en: "Horseback ride along the river to waterfalls." } },
            { day: 3, title: { kz: "Қызғалдақтар", ru: "Тюльпаны", en: "Tulips" }, desc: { kz: "Қызғалдақ алаңдарын іздеу (көктемде).", ru: "Поиск редких цветов. Фотоохота за птицами.", en: "Searching for rare flowers. Birdwatching session." } }
        ],
        included: [{ kz: "Гид", ru: "Гид-биолог", en: "Biologist guide" }, { kz: "Тұру", ru: "Гостевой дом", en: "Guesthouse" }, { kz: "Аттар", ru: "Лошади", en: "Horses" }],
        whatToBring: [{ kz: "Бинокль", ru: "Бинокль", en: "Binoculars" }, { kz: "Күннен қорғаныс", ru: "Солнцезащитный крем", en: "Sunscreen" }],
        contacts: { phone: "+7 (725) 444-11-22", email: "aksu@kendala.kz" }
    },
    {
        id: 18,
        title: { kz: "Сайрам-Өгем: Биік Таулар", ru: "Сайрам-Угам: Высокогорье", en: "Sayram-Ugam: High Mountains" },
        region: "South", type: { kz: "Треккинг", ru: "Треккинг", en: "Trekking" },
        duration: 5, price: 420, image: "https://images.unsplash.com/photo-1752584157622-83ecf47ca18d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Hard",
        description: { kz: "Мақпал мен Сусіңген көлдеріне жорық.", ru: "Ледниковые озера Макпал и Сусинген на высоте 3000м.", en: "Glacial lakes Makpal and Susingen at 3000m altitude." },
        longDescription: {
            kz: "Сайрам-Өгем ұлттық паркі — тау шыңдары мен мөлдір көлдер мекені. Біз биік таулы асулардан өтіп, табиғаттың ең сұлу нүктелеріне барамыз. Жабайы жануарлар мен сирек өсімдіктер сізді күтуде. Түнде биік таулы лагерьде қонамыз. Нағыз альпинизм атмосферасы.",
            ru: "Альпийские луга и ледниковые озера Угамского хребта. Маршрут проходит через перевалы 3000м к озеру Макпал. Вы увидите 'уходящее' озеро Сусинген, которое исчезает в июле. Встречи с горными козлами и орлами. Полная автономность и дикая природа Юга.",
            en: "Alpine meadows and glacial lakes of the Ugam Ridge. The route crosses 3000m passes to Lake Makpal. Witness the 'receding' Lake Susingen, which disappears in July. Encounter mountain goats and eagles. Full autonomy in the wild Southern nature."
        },
        rating: 4.7,
        itinerary: [
            { day: 1, title: { kz: "Кіру", ru: "Вход в парк", en: "Entry" }, desc: { kz: "Өгем шатқалына келу. Жоғары көтерілу.", ru: "Подъем в ущелье. Установка первого лагеря.", en: "Ascent into the gorge. First camp setup." } },
            { day: 3, title: { kz: "Мақпал көлі", ru: "Озеро Макпал", en: "Lake Makpal" }, desc: { kz: "Көлге жету. Мөлдір суда шомылу.", ru: "Выход к ледниковому озеру. Медитация у воды.", en: "Reaching the glacial lake. Meditation by the water." } },
            { day: 5, title: { kz: "Түсу", ru: "Спуск", en: "Descent" }, desc: { kz: "Төменге оралу. Шымкентке трансфер.", ru: "Спуск в долину. Завершение трека. Трансфер.", en: "Descent to the valley. Track completion. Transfer." } }
        ],
        included: [{ kz: "Гидтер", ru: "Горные проводники", en: "Mountain guides" }, { kz: "Тамақ", ru: "Питание (костер)", en: "Campfire meals" }, { kz: "Рұқсат", ru: "Пропуска", en: "Permits" }],
        whatToBring: [{ kz: "Шатыр", ru: "Палатка", en: "Tent" }, { kz: "Ұйқы қап", ru: "Спальник", en: "Sleeping bag" }],
        contacts: { phone: "+7 (725) 555-00-11", email: "ugam@kendala.kz" }
    },
    {
        id: 19,
        title: { kz: "Киін-Керіш: Фото-Шытырман", ru: "Киин-Кериш: Фото-Приключение", en: "Kiin-Kerish: Photo Adventure" },
        region: "East", type: { kz: "Фото-тур", ru: "Фото-экспедиция", en: "Photo Expedition" },
        duration: 4, price: 680, image: "https://images.unsplash.com/photo-1752503256243-2edf964c00d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Medium",
        description: { kz: "Қызыл балшықты жартастар мен каньондар.", ru: "Пылающие каньоны и глиняные замки на востоке страны.", en: "Flaming canyons and clay castles in the country's East." },
        longDescription: {
            kz: "Киін-Керіш — түрлі-түсті балшықтан жаралған табиғат туындысы. Күн батқанда жартастар отқа оранғандай көрінеді. Бұл жерде динозаврлардың қалдықтары табылған. Біз сондай-ақ 'Шекелмес' каньоны мен Зайсан көліне соғамыз. Фотографтар үшін жұмақ.",
            ru: "Эоловый город из цветных глин. Пейзажи напоминают декорации к Марсу. Настоящий палеонтологический музей: здесь находили остатки динозавров и древних черепах. Мы посетим каньон Шекелмес на берегу озера Зайсан. Закаты здесь самые яркие в Казахстане.",
            en: "An aeolian city of colored clays. Landscapes resemble Martian movie sets. A true paleontological museum: dinosaur and ancient turtle remains have been found here. We'll visit Shekelmes Canyon on the shores of Lake Zaisan. The sunsets here are the brightest in Kazakhstan."
        },
        rating: 5.0,
        itinerary: [
            { day: 1, title: { kz: "Зайсан", ru: "Зайсан", en: "Zaisan" }, desc: { kz: "Өскеменнен Зайсанға жол. Лагерь.", ru: "Переезд к озеру. Установка лагеря на берегу.", en: "Drive to the lake. Lakeside camping setup." } },
            { day: 2, title: { kz: "Киін-Керіш", ru: "Киин-Кериш", en: "Kiin-Kerish" }, desc: { kz: "Қызыл жартастарды аралау. Күн бату.", ru: "Глубокая фотосессия в 'пылающем' каньоне.", en: "In-depth photo session in the 'flaming' canyon." } },
            { day: 3, title: { kz: "Шекелмес", ru: "Шекелмес", en: "Shekelmes" }, desc: { kz: "Ақ балшықты каньондар. Зайсанға шомылу.", ru: "Белые глины Шекелмеса. Купание в озере.", en: "White clays of Shekelmes. Swimming in the lake." } }
        ],
        included: [{ kz: "4x4", ru: "Внедорожник", en: "4x4 SUV" }, { kz: "Аспаз", ru: "Повар", en: "Chef" }, { kz: "Жабдық", ru: "Снаряжение", en: "Camping gear" }],
        whatToBring: [{ kz: "Камера", ru: "Камера", en: "Camera" }, { kz: "Су", ru: "Запас воды", en: "Water supply" }],
        contacts: { phone: "+7 (723) 111-22-33", email: "kiin@kendala.kz" }
    },
    {
        id: 20,
        title: { kz: "Марқакөл: Алтай Інжуі", ru: "Маркаколь: Жемчужина Алтая", en: "Markakol: Altai Pearl" },
        region: "East", type: { kz: "Экспедиция", ru: "Экспедиция", en: "Expedition" },
        duration: 5, price: 820, image: "https://images.unsplash.com/photo-1729959884778-da26e3896ed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Hard",
        description: { kz: "Алтайдың ең шалғай және мөлдір көлі.", ru: "Высокогорное озеро Маркаколь и редкая рыба ускуч.", en: "High-altitude Lake Markakol and rare uskuch fish." },
        longDescription: {
            kz: "Марқакөл — Алтайдың ең сұлу көлдерінің бірі. Көл суы өте мөлдір және онда сирек кездесетін ускуч балығы мекендейді. Шалғайда орналасқандықтан, табиғаты өте таза. Біз Уронхайка ауылында тұрып, жергілікті балықшылардың өмірімен танысамыз. Тайга ормандарымен серуен.",
            ru: "Кристально чистое озеро, окруженное лиственничной тайгой. Путь лежит через перевал 'Проходной' и требует проходимого транспорта. Здесь водится уникальный ленок — ускуч. Мы поживем в старообрядческом поселке Уронхайка, почувствуем дух старого Алтая и увидим нетронутую природу.",
            en: "A crystal-clear lake surrounded by larch taiga. The path requires rugged transport via the 'Prokhodnoy' pass. Home to the unique uskuch fish. We'll stay in the old-believer village of Uronkhaika, feeling the spirit of ancient Altai and witnessing untouched wilderness."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Тау жолы", ru: "Горная дорога", en: "Mountain Road" }, desc: { kz: "Катоннан Марқакөлге жол. Асулар.", ru: "Переезд через перевалы к озеру. Заселение.", en: "Pass crossing to the lake. Check-in." } },
            { day: 2, title: { kz: "Уронхайка", ru: "Уронхайка", en: "Uronkhaika" }, desc: { kz: "Ауыл өмірі. Көл жағасындағы серуен.", ru: "Жизнь поселка. Прогулка по берегу озера.", en: "Village life. Lakeside stroll." } },
            { day: 3, title: { kz: "Тайга", ru: "Тайга", en: "Taiga" }, desc: { kz: "Орман ішіне жорық. Қарақарағайды көру.", ru: "Поход в кедровую тайгу. Вид на горы.", en: "Cedar taiga trek. Mountain views." } }
        ],
        included: [{ kz: "4x4", ru: "Транспорт 4x4", en: "4x4 Transport" }, { kz: "Тұру", ru: "Проживание в домах", en: "Guesthouse stay" }, { kz: "Рұқсат", ru: "Погранпропуска", en: "Border permits" }],
        whatToBring: [{ kz: "Жылы киім", ru: "Теплая одежда", en: "Warm clothes" }, { kz: "Етік", ru: "Ботинки", en: "Boots" }],
        contacts: { phone: "+7 (723) 444-55-66", email: "markakol@kendala.kz" }
    },
    {
        id: 21,
        title: { kz: "Бұқтырма: Алтай Теңізі", ru: "Бухтарма: Море Алтая", en: "Bukhtarma: Altai Sea" },
        region: "East", type: { kz: "Демалыс", ru: "Летний отдых", en: "Summer Relaxation" },
        duration: 4, price: 400, image: "https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Easy",
        description: { kz: "Бұқтырма су қоймасындағы жағажай демалысы.", ru: "Песчаные пляжи и сосновые боры Бухтармы.", en: "Sandy beaches and pine forests of Bukhtarma." },
        longDescription: {
            kz: "Бұқтырма — таулармен қоршалған алып су қоймасы. Шомылу, балық аулау және қайықпен серуендеу үшін таптырмас орын. Жағажайдағы қарағайлы ормандар ауаны тазартады. Біз 'Голубой залив' аймағында демалып, тау шыңдарына шығамыз. Керемет жазғы демалыс.",
            ru: "Самое большое водохранилище Казахстана, которое местные называют морем. Прогретая вода, сосновые леса прямо у воды и отвесные скалы. Мы организуем отдых в коттеджах, прогулки на катерах к диким островам и вечерние костры. Идеально для тех, кто хочет совместить горы и пляж.",
            en: "Kazakhstan's largest reservoir, locally called a sea. Warm water, pine forests right at the edge, and sheer cliffs. We organize cottage stays, boat trips to wild islands, and evening campfires. Perfect for those wanting to combine mountains and beach."
        },
        rating: 4.6,
        itinerary: [
            { day: 1, title: { kz: "Келу", ru: "Приезд", en: "Arrival" }, desc: { kz: "Бұқтырмаға келу. Үйшікке орналасу.", ru: "Трансфер из Усть-Каменогорска. Размещение.", en: "Transfer from Ust-Kamenogorsk. Check-in." } },
            { day: 2, title: { kz: "Аралдар", ru: "Острова", en: "Islands" }, desc: { kz: "Қайықпен серуен. Балық аулау.", ru: "Прогулка на катере к островам. Купание.", en: "Boat trip to islands. Swimming session." } },
            { day: 3, title: { kz: "Таулар", ru: "Горы", en: "Mountains" }, desc: { kz: "Көріністі тамашалау. Орман серуені.", ru: "Подъем на ближайшую сопку для обзора.", en: "Hike up a local hill for the view." } }
        ],
        included: [{ kz: "Коттедж", ru: "Коттедж", en: "Cottage" }, { kz: "Қайық", ru: "Прогулка на катере", en: "Boat tour" }, { kz: "Тамақ", ru: "Питание", en: "Meals" }],
        whatToBring: [{ kz: "Шомылу киімі", ru: "Купальник", en: "Swimwear" }, { kz: "Крем", ru: "Крем", en: "Sunscreen" }],
        contacts: { phone: "+7 (723) 222-33-44", email: "vko@kendala.kz" }
    },
    {
        id: 22,
        title: { kz: "Қорғалжын: Дала Еркіндігі", ru: "Коргалжын: Степная Воля", en: "Korgalzhyn: Steppe Freedom" },
        region: "Central", type: { kz: "Эко", ru: "Бердвотчинг", en: "Birdwatching" },
        duration: 2, price: 220, image: "https://images.unsplash.com/photo-1663324877305-79d44df7abc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbGFtaW5nb3MlMjBsYWtlJTIwbmF0dXJlJTIwd2lsZHxlbnwxfHx8fDE3NzAzMDk2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Қызғылт қоқиқаздар мен шексіз көлдер.", ru: "Розовые фламинго и заповедные степные озера.", en: "Pink flamingos and protected steppe lakes." },
        longDescription: {
            kz: "Қорғалжын қорығы — ЮНЕСКО мұрасы. Мұнда әлемдегі ең солтүстік қоқиқаздар мекендейді. Біз Теңіз көлінің маңындағы құстарды бақылап, даланың нағыз тыныштығын сезінеміз. Астанадан бірнеше сағаттық жерде орналасқан нағыз жабайы табиғат.",
            ru: "Заповедник ЮНЕСКО в паре часов от Астаны. Здесь гнездится самая северная в мире колония розовых фламинго. Мы проедем по степным дорогам к озеру Тениз, увидим сотни видов птиц и, если повезет, степных сурков и сайгаков. Рай для любителей тишины и живой природы.",
            en: "A UNESCO reserve just hours from Astana. Home to the world's northernmost colony of pink flamingos. Drive across steppe roads to Lake Teniz, see hundreds of bird species and, with luck, marmots and saigas. A haven for lovers of silence and living nature."
        },
        rating: 4.7,
        itinerary: [
            { day: 1, title: { kz: "Мұражай", ru: "Визит-центр", en: "Visitor Center" }, desc: { kz: "Қорық мұражайын аралау. Лекция.", ru: "Экскурсия в музей природы. Инструктаж.", en: "Nature museum tour. Briefing." } },
            { day: 2, title: { kz: "Құстар", ru: "Фламинго", en: "Flamingos" }, desc: { kz: "Теңіз көліне шығу. Құстарды бақылау.", ru: "Выезд на озера. Наблюдение за фламинго.", en: "Drive to the lakes. Flamingo spotting." } }
        ],
        included: [{ kz: "Көлік", ru: "Транспорт", en: "Transport" }, { kz: "Гид", ru: "Орнитолог-гид", en: "Ornithologist guide" }, { kz: "Тамақ", ru: "Обед", en: "Lunch" }],
        whatToBring: [{ kz: "Бинокль", ru: "Бинокль", en: "Binoculars" }, { kz: "Камера", ru: "Камера", en: "Camera" }],
        contacts: { phone: "+7 (716) 111-22-33", email: "birds@kendala.kz" }
    },
    {
        id: 23,
        title: { kz: "Бектау-Ата: Гранитті Жартастар", ru: "Бектау-Ата: Гранитные Скалы", en: "Bektau-Ata: Granite Cliffs" },
        region: "Central", type: { kz: "Фото-тур", ru: "Геология", en: "Geology" },
        duration: 2, price: 180, image: "https://images.unsplash.com/photo-1752503770913-124df0a3ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Medium",
        description: { kz: "Балқаш маңындағы таңғажайып тас таулар.", ru: "Марсианские ландшафты и пещера Аулие-тас.", en: "Martian landscapes and Aulietas cave." },
        longDescription: {
            kz: "Бектау-Ата — жанартаудан пайда болған гранитті массив. Жартастардың пішіні өте ерекше, мұнда 'Әулие тас' үңгірі орналасқан. Күн батқанда граниттер қызғылт түске боялады. Балқаш көліне жақын орналасқандықтан, табиғаты өте қызықты.",
            ru: "Огромный гранитный массив, возвышающийся над степью. Сглаженные формы скал создают ощущение присутствия на другой планете. Мы посетим пещеру Аулие-тас с целебным источником и поднимемся на вершину для кругового обзора степи. Идеальное место для ночной съемки звезд.",
            en: "A massive granite pluton rising above the steppe. Its smoothed rock forms create an alien atmosphere. We'll visit Aulietas Cave with its healing spring and ascend the summit for a 360-degree steppe view. An ideal spot for night-sky photography."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Келу", ru: "Заселение", en: "Arrival" }, desc: { kz: "Бектау-Атаға келу. Лагерь.", ru: "Приезд. Размещение в палатках. Ужин.", en: "Arrival. Tent setup. Dinner." } },
            { day: 2, title: { kz: "Шың", ru: "Вершина", en: "Summit" }, desc: { kz: "Шыңға шығу. Үңгірге бару. Қайту.", ru: "Восхождение на пик. Осмотр пещеры.", en: "Summit ascent. Cave exploration." } }
        ],
        included: [{ kz: "Трансфер", ru: "Трансфер", en: "Transfer" }, { kz: "Гид", ru: "Гид", en: "Guide" }, { kz: "Лагерь", ru: "Лагерь", en: "Camp" }],
        whatToBring: [{ kz: "Камера", ru: "Камера", en: "Camera" }, { kz: "Су", ru: "Вода", en: "Water" }],
        contacts: { phone: "+7 (710) 555-66-77", email: "bektau@kendala.kz" }
    },
    {
        id: 24,
        title: { kz: "Қарақия: Ойпат Түбі", ru: "Карагие: Дно Впадины", en: "Karagiye: Bottom of Depression" },
        region: "West", type: { kz: "Геология", ru: "Экспедиция", en: "Expedition" },
        duration: 2, price: 200, image: "https://images.unsplash.com/photo-1671779262081-ec54ae211f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Medium",
        description: { kz: "Теңіз деңгейінен -132 метр төмен түсу.", ru: "Одна из глубочайших точек мира и солончаки.", en: "One of the world's deepest points and salt flats." },
        longDescription: {
            kz: "Қарақия ойпаты — әлемдегі ең терең нүктелердің бірі. Бұл жерде сіз нағыз шөл табиғатын көресіз. Біз ойпаттың ең төменгі нүктесіне түсіп, ежелгі мұхит қалдықтарын іздейміз. Ақтау қаласына жақын, бірақ өзіндік атмосферасы бар мекен.",
            ru: "Впадина 'Черная пасть'. Прогулка по солончакам на глубине 132 метра ниже уровня мирового океана. Мы увидим, как меняется климат и растительность внутри впадины, и найдем окаменевшие зубы акул. Захватывающий вид с края обрыва перед спуском.",
            en: "'Black Mouth' depression. Walk across salt flats 132 meters below sea level. Witness the climate and flora shifts inside the sinkhole, and search for fossilized shark teeth. Breathtaking views from the rim before our descent."
        },
        rating: 4.5,
        itinerary: [
            { day: 1, title: { kz: "Түсу", ru: "Спуск", en: "Descent" }, desc: { kz: "Ойпатқа түсу. Тұзды сорлар.", ru: "Спуск во впадину. Прогулка по соли.", en: "Descent into the sinkhole. Salt flat walk." } },
            { day: 2, title: { kz: "Палеонтология", ru: "Артефакты", en: "Paleontology" }, desc: { kz: "Көне қалдықтарды іздеу. Қайту.", ru: "Поиск окаменелостей. Возврат в Актау.", en: "Fossil hunting. Return to Aktau." } }
        ],
        included: [{ kz: "Джип", ru: "Джип", en: "Jeep" }, { kz: "Су", ru: "Вода", en: "Water" }, { kz: "Гид", ru: "Гид", en: "Guide" }],
        whatToBring: [{ kz: "Көзілдірік", ru: "Очки", en: "Sunglasses" }, { kz: "Бас киім", ru: "Шляпа", en: "Hat" }],
        contacts: { phone: "+7 (729) 111-00-00", email: "west@kendala.kz" }
    },
    {
        id: 25,
        title: { kz: "Үстірт: Ақ Чинктер", ru: "Устюрт: Белые Чинки", en: "Ustyurt: White Chinks" },
        region: "West", type: { kz: "Экспедиция", ru: "Офф-роуд", en: "Off-road" },
        duration: 6, price: 1100, image: "https://images.unsplash.com/photo-1752503770913-124df0a3ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Extreme",
        description: { kz: "Үстірт үстіртінің шексіз ақ жартастары.", ru: "Бескрайнее плато и отвесные обрывы-чинки.", en: "Endless plateau and sheer chink cliffs." },
        longDescription: {
            kz: "Үстірт — бұл нағыз еркіндік. Ақ жартастар, 'чинктер' және шексіз дала. Бұл турда біз Каспий мен Арал арасындағы алып платоны кесіп өтеміз. Көне керуен-сарайлар мен жерасты мешіттері. Тек мықты джиптермен баратын нағыз шытырман оқиға.",
            ru: "Огромное плато, зажатое между Каспием и Аралом. Белые обрывы высотой в сотни метров, древние караван-сараи и полная изоляция. Мы посетим самые дикие точки, где нет дорог, только направления. Ночевки в автономном лагере. Тур для сильных духом.",
            en: "A massive plateau squeezed between the Caspian and Aral. White cliffs hundreds of meters high, ancient caravanserai, and total isolation. We visit the wildest points with no roads, only directions. Autonomous camping nights. A tour for the strong-willed."
        },
        rating: 5.0,
        itinerary: [
            { day: 1, title: { kz: "Шығу", ru: "Старт", en: "Start" }, desc: { kz: "Ақтаудан платоға жол. Лагерь.", ru: "Выезд в глубь плато. Первый лагерь.", en: "Heading into the plateau. First camp." } },
            { day: 3, title: { kz: "Чинктер", ru: "Чинки", en: "Chinks" }, desc: { kz: "Ақ жартастар ернеуімен жүру.", ru: "Езда вдоль края плато. Панорамы.", en: "Driving along the plateau edge. Views." } },
            { day: 6, title: { kz: "Оралу", ru: "Финиш", en: "Return" }, desc: { kz: "Ақтауға қайту. Қоштасу.", ru: "Возвращение в цивилизацию.", en: "Returning to civilization." } }
        ],
        included: [{ kz: "SUV 4x4", ru: "Внедорожник 4x4", en: "4x4 SUV" }, { kz: "Лагерь", ru: "Все снаряжение", en: "All gear" }, { kz: "Тамақ", ru: "Повар", en: "Chef" }],
        whatToBring: [{ kz: "Пауэрбанк", ru: "Пауэрбанк", en: "Power bank" }, { kz: "Маска", ru: "Маска", en: "Mask" }],
        contacts: { phone: "+7 (729) 333-44-55", email: "ustyurt@kendala.kz" }
    },
    {
        id: 26,
        title: { kz: "Қызыларай: Арқарлар Мекені", ru: "Кызыларай: Край Архаров", en: "Kyzylarai: Land of Argalis" },
        region: "Central", type: { kz: "Треккинг", ru: "Горный треккинг", en: "Mountain Trekking" },
        duration: 3, price: 280, image: "https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Medium",
        description: { kz: "Орталық Қазақстанның ең биік нүктесі — Ақсоран шыңы.", ru: "Восхождение на крышу Сарыарки и древние гробницы Бегазы.", en: "Climbing the roof of Saryarka and ancient Begazy tombs." },
        longDescription: {
            kz: "Қызыларай таулары — Даланың ортасындағы алып гранитті массив. Ақсоран шыңы (1565 м) Орталық Қазақстанның ең биік нүктесі. Мұнда реликтік қарағайлы ормандар мен жабайы арқарлар сақталған. Біз сондай-ақ қола дәуірінің жәдігері — Бегазы кешенін көреміз. Нағыз тарихи-табиғи ретрит.",
            ru: "Кызыларай — это гранитный оазис посреди бескрайней степи. Мы совершим восхождение на пик Аксоран, откуда в ясную погоду видимость достигает 100 км. Вы увидите уникальные реликтовые сосны, которые чудом сохранились здесь с ледникового периода. Посещение археологического комплекса Бегазы раскроет тайны загадочной культуры эпохи бронзы. Вечера в гостевом доме у местных жителей с дегустацией домашнего кумыса.",
            en: "Kyzylarai is a granite oasis in the middle of the endless steppe. We will ascend Aksoran Peak, offering 100km visibility on clear days. Witness unique relic pines, survivors from the ice age. A visit to the Begazy archaeological complex reveals the secrets of a mysterious Bronze Age culture. Evenings are spent in local guesthouses with authentic kumis tasting."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Шабанбай би", ru: "Шабанбай Би", en: "Shabanbay Bi" }, desc: { kz: "Қарағандыдан ауылға келу. Жергілікті қонақжайлылық.", ru: "Приезд в базовое село. Знакомство с бытом. Подготовка к походу.", en: "Arrival at the base village. Local life introduction. Trek preparation." } },
            { day: 2, title: { kz: "Ақсоран Шыңы", ru: "Пик Аксоран", en: "Aksoran Peak" }, desc: { kz: "Шыңға шығу (6-7 сағат). Төбедегі панорама. Пикник.", ru: "Восхождение на вершину (1565м). Обзор всей Сарыарки. Фотосессия на скалах.", en: "Ascent to the summit (1565m). Panorama of Saryarka. Cliffside photo session." } },
            { day: 3, title: { kz: "Бегазы", ru: "Бегазы", en: "Begazy" }, desc: { kz: "Көне кесенелерді аралау. Қарағандыға қайту.", ru: "Экскурсия в долину древних гробниц. Возвращение в город.", en: "Excursion to the valley of ancient tombs. Return to the city." } }
        ],
        included: [{ kz: "Гид", ru: "Местный гид", en: "Local guide" }, { kz: "Тұру", ru: "Гостевой дом", en: "Guesthouse stay" }, { kz: "Трансфер", ru: "Трансфер из Караганды", en: "Karaganda transfer" }],
        whatToBring: [{ kz: "Треккинг етігі", ru: "Треккинговые ботинки", en: "Hiking boots" }, { kz: "Күннен қорғаныс", ru: "Защита от солнца", en: "Sunscreen" }],
        contacts: { phone: "+7 (710) 222-11-00", email: "peaks@kendala.kz" }
    },
    {
        id: 27,
        title: { kz: "Имантау-Шалқар: Солтүстік Көлдері", ru: "Имантау-Шалкар: Озера Севера", en: "Imantau-Shalkar: Northern Lakes" },
        region: "North", type: { kz: "Демалыс", ru: "Эко-релакс", en: "Eco-relax" },
        duration: 4, price: 320, image: "https://images.unsplash.com/photo-1752583649371-8e8c3bfa38ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbWFudGF1JTIwbGFrZSUyMHBpbmUlMjBmb3Jlc3QlMjBLYXpha2hzdGFufGVufDF8fHx8MTc3MDMwOTYxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Айыртаудың сұлу көлдері мен қарағайлы ормандары.", ru: "Зеркальные озера и сосновые леса Северо-Казахстанской области.", en: "Mirror lakes and pine forests of North Kazakhstan." },
        longDescription: {
            kz: "Имантау мен Шалқар — Солтүстік Қазақстанның жасырын жауһарлары. Бұл жерде көл суы емдік қасиетке ие, ал жағалаудағы қарағайлы ормандар демалыс үшін таптырмас орын. Біз Имантау көліндегі 'Казачий' аралына қайықпен барып, жабайы табиғатты тамашалаймыз. Балық аулау мен жидек жинау — бұл турдың ажырамас бөлігі. Тыныштық пен таза ауа іздегендерге арналған.",
            ru: "Край озер Айыртауского района — это альтернатива шумному Боровому. Чистейшая вода Шалкара, богатая минералами, и живописный остров на Имантау создают атмосферу полного уединения. Мы организуем прогулки на катерах, походы за грибами и ягодами, а также вечерние посиделки у костра. Идеально для семейного отдыха и тех, кто хочет сбежать от городской суеты в объятия леса.",
            en: "The Ayirtau lake district is a peaceful alternative to busy Burabay. Shalkar's mineral-rich waters and Imantau's picturesque Kazachiy island create an atmosphere of total solitude. We organize boat trips, mushroom and berry picking, and evening campfires. Perfect for family vacations and those seeking to escape the city into the forest's embrace."
        },
        rating: 4.6,
        itinerary: [
            { day: 1, title: { kz: "Келу", ru: "Приезд", en: "Arrival" }, desc: { kz: "Көкшетаудан көлге келу. Демалыс орнына орналасу.", ru: "Трансфер из Кокшетау. Заселение в эко-отель на берегу.", en: "Kokshetau transfer. Check-in at a lakeside eco-hotel." } },
            { day: 2, title: { kz: "Арал Сәлемі", ru: "Остров Казачий", en: "Kazachiy Island" }, desc: { kz: "Аралға қайықпен бару. Жаяу серуен.", ru: "Поездка на катере на остров. Пикник и купание в чистой воде.", en: "Boat trip to the island. Picnic and swimming in clear water." } },
            { day: 3, title: { kz: "Екі Шоқы", ru: "Две Сопки", en: "Two Hills" }, desc: { kz: "Тау шыңына шығу. Панорама.", ru: "Легкий подъем на смотровую площадку. Вид на оба озера.", en: "Light ascent to the viewpoint. View of both lakes." } }
        ],
        included: [{ kz: "Тұру", ru: "База отдыха", en: "Base camp stay" }, { kz: "Қайық", ru: "Прогулка на катере", en: "Boat tour" }, { kz: "Тамақ", ru: "Питание", en: "Meals" }],
        whatToBring: [{ kz: "Қармақ", ru: "Снасти для рыбалки", en: "Fishing gear" }, { kz: "Крем", ru: "Средство от комаров", en: "Bug spray" }],
        contacts: { phone: "+7 (715) 333-44-55", email: "north@kendala.kz" }
    },
    {
        id: 28,
        title: { kz: "Зеренді: Қарағайлы Ретрит", ru: "Зеренда: Сосновый Ретрит", en: "Zerenda: Pine Retreat" },
        region: "North", type: { kz: "Wellness", ru: "Оздоровление", en: "Wellness" },
        duration: 2, price: 150, image: "https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxaZXJlbmRhJTIwbGFrZSUyMG5hdHVyZSUyMEthemFraHN0YW58ZW58MXx8fHwxNzcwMzA5NjE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Зеренді көлінің жағасындағы жайлы демалыс.", ru: "Уютный отдых в сосновом бору у берегов Зерендинского озера.", en: "Cozy relaxation in pine woods by Zerenda Lake." },
        longDescription: {
            kz: "Зеренді — Астанаға жақын орналасқан тамаша демалыс орны. Қарағайлы ормандар мен таза көл суы сізге күш береді. Біз орман ішімен серуендеп, ерекше пішінді жартастарды көреміз. Бұл тур денсаулықты нығайтуға және рухани демалысқа бағытталған. Жайлы отельдер мен таза ауа сізді күтуде.",
            ru: "Зеренда — это идеальное место для перезагрузки в паре часов от столицы. Сосновый бор здесь вплотную подходит к воде, создавая уникальный микроклимат. Программа включает прогулки по экологическим тропам, йогу на берегу и посещение смотровых площадок. Здесь нет пафоса, только тишина, шепот хвои и кристальный воздух. Лучший выбор для короткого отдыха.",
            en: "Zerenda is the perfect spot for a reset just a couple of hours from the capital. The pine forest meets the water here, creating a unique microclimate. The program includes eco-trail walks, lakeside yoga, and visiting viewpoints. No pretension, just silence, the whisper of needles, and crystal air. The best choice for a short break."
        },
        rating: 4.5,
        itinerary: [
            { day: 1, title: { kz: "Орманға ену", ru: "В сердце леса", en: "Into the Woods" }, desc: { kz: "Отельге орналасу. Орман серуені.", ru: "Заселение. Прогулка по сосновому бору. Дыхательная гимнастика.", en: "Check-in. Stroll through the pine woods. Breathing exercises." } },
            { day: 2, title: { kz: "Көл рухы", ru: "Дух озера", en: "Spirit of Lake" }, desc: { kz: "Көл жағасындағы таңғы жаттығу. Қайықпен серуен.", ru: "Йога на пирсе. Катание на катамаранах. Возвращение в Астану.", en: "Pier yoga. Catamaran riding. Return to Astana." } }
        ],
        included: [{ kz: "Отель", ru: "Отель 4*", en: "4* Hotel" }, { kz: "Таңғы ас", ru: "Завтрак", en: "Breakfast" }, { kz: "Гид", ru: "Инструктор", en: "Instructor" }],
        whatToBring: [{ kz: "Спорт киім", ru: "Спортивная одежда", en: "Sportswear" }, { kz: "Кроссовка", ru: "Кроссовки", en: "Sneakers" }],
        contacts: { phone: "+7 (716) 222-33-00", email: "zerenda@kendala.kz" }
    },
    {
        id: 29,
        title: { kz: "Қостанай: Тұлпарлар Әлемі", ru: "Костанай: Мир Тулпаров", en: "Kostanay: World of Steeds" },
        region: "North", type: { kz: "Хобби", ru: "Конный тур", en: "Horseback Tour" },
        duration: 3, price: 280, image: "https://images.unsplash.com/photo-1562595706-61433957484a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3JzZXMlMjBydW5uaW5nJTIwc3RlcHBlJTIwS2F6YWtoc3RhbnxlbnwxfHx8fDE3NzAzMDk2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Қостанай жылқы зауыты мен дала серуені.", ru: "Знакомство с кустанайской породой лошадей и степные скачки.", en: "Meeting the Kostanay horse breed and steppe riding." },
        longDescription: {
            kz: "Қостанай — қазақтың тұлпарларының отаны. Біз 100 жылдық тарихы бар жылқы зауытына барып, атақты Қостанай тұқымымен танысамыз. Сіз атқа мінуді үйреніп, шексіз далада серуендейсіз. Нағыз көшпенділердің рухын сезіну үшін таптырмас мүмкіндік. Біз сондай-ақ жергілікті музейлер мен мәдени орындарды аралаймыз.",
            ru: "Костанайская область — это житница страны и родина уникальной породы лошадей. Мы посетим старейший конный завод, увидим грациозных скакунов и пройдем мастер-класс по верховой езде. Программа тура включает выезды в настоящую целину, обеды в юртах и знакомство с традициями коневодства. Тур для тех, кто любит животных и простор широкой степи.",
            en: "The Kostanay region is the country's breadbasket and the birthplace of a unique horse breed. We'll visit the oldest stud farm, see graceful steeds, and take a masterclass in riding. The tour includes trips into the real virgin lands, yurt lunches, and learning about horse-breeding traditions. For those who love animals and the vast steppe."
        },
        rating: 4.7,
        itinerary: [
            { day: 1, title: { kz: "Зауыт", ru: "Конезавод", en: "Stud Farm" }, desc: { kz: "Жылқылармен танысу. Тарих.", ru: "Экскурсия по заводу. История породы. Первое занятие верхом.", en: "Farm tour. Breed history. First riding lesson." } },
            { day: 2, title: { kz: "Дала", ru: "Степь", en: "Steppe" }, desc: { kz: "Шексіз далада атпен серуендеу.", ru: "Выезд в степь на весь день. Традиционный обед в поле.", en: "Full day steppe ride. Traditional field lunch." } },
            { day: 3, title: { kz: "Мәдениет", ru: "Культура", en: "Culture" }, desc: { kz: "Музейлер мен қала аралау.", ru: "Экскурсия по Костанаю. Покупка местных сувениров.", en: "Kostanay city tour. Souvenir shopping." } }
        ],
        included: [{ kz: "Аттар", ru: "Аренда лошадей", en: "Horse rental" }, { kz: "Гид", ru: "Инструктор", en: "Instructor" }, { kz: "Тұру", ru: "Гостиница", en: "Hotel stay" }],
        whatToBring: [{ kz: "Шалбар", ru: "Удобные брюки", en: "Comfortable pants" }, { kz: "Қатты аяқ киім", ru: "Обувь на твердой подошве", en: "Hard-soled shoes" }],
        contacts: { phone: "+7 (714) 111-22-33", email: "horses@kendala.kz" }
    },
    {
        id: 30,
        title: { kz: "Мерке: Аспан Ғибадатханасы", ru: "Мерке: Небесное Святилище", en: "Merke: Celestial Sanctuary" },
        region: "South", type: { kz: "Экспедиция", ru: "Археология", en: "Archaeology" },
        duration: 3, price: 350, image: "https://images.unsplash.com/photo-1752584157622-83ecf47ca18d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Hard",
        description: { kz: "Мерке тауларындағы биік таулы түркі балбалдары.", ru: "Древние каменные изваяния на высоте 3000 метров.", en: "Ancient stone idols at an altitude of 3000 meters." },
        longDescription: {
            kz: "Мерке — биік таудағы киелі мекен. Мұнда 3000 метр биіктікте ежелгі түркілердің тас мүсіндері (балбалдар) сақталған. Бұл жерді 'Аспан сарайы' деп те атайды. Біз атпен немесе жол талғамайтын көлікпен биік үстіртке шығып, ата-бабаларымыздың ізімен жүреміз. Нағыз аспан астындағы мұражай мен мистикалық атмосфера.",
            ru: "Высокогорное плато Мерке — это одно из самых загадочных мест Южного Казахстана. На высоте 3000 метров разбросаны десятки каменных баб (балбалов), поставленных здесь более тысячи лет назад. Мы совершим экспедицию на внедорожниках или лошадях к этим 'стражам вечности'. Вы увидите священные источники и почувствуете мощную энергетику места, где небо встречается с землей.",
            en: "The high-altitude Merke plateau is one of South Kazakhstan's most mysterious sites. At 3000 meters, dozens of stone idols (balbals) stand, placed there over a thousand years ago. We'll lead an expedition by 4x4 or horseback to these 'guardians of eternity.' Witness sacred springs and feel the powerful energy where sky meets earth."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Шатқал", ru: "Ущелье", en: "Gorge" }, desc: { kz: "Мерке шатқалына келу. Лагерь.", ru: "Въезд в ущелье Мерке. Установка лагеря у подножия гор.", en: "Entering Merke Gorge. Base camp setup." } },
            { day: 2, title: { kz: "Үстірт", ru: "Плато", en: "Plateau" }, desc: { kz: "Балбалдарға жол тарту. Зерттеу.", ru: "Подъем на плато Сандык. Осмотр каменных изваяний.", en: "Ascent to Sandyk plateau. Viewing stone idols." } },
            { day: 3, title: { kz: "Оралу", ru: "Возвращение", en: "Return" }, desc: { kz: "Таудан түсу. Таразға трансфер.", ru: "Спуск в долину. Посещение радоновых бань. Трансфер.", en: "Descent. Radon bath visit. Transfer." } }
        ],
        included: [{ kz: "Жолсерік", ru: "Проводник", en: "Guide" }, { kz: "4x4", ru: "Внедорожник", en: "SUV" }, { kz: "Тамақ", ru: "Полевое питание", en: "Field meals" }],
        whatToBring: [{ kz: "Жылы киім", ru: "Теплая куртка", en: "Warm jacket" }, { kz: "Етік", ru: "Ботинки", en: "Boots" }],
        contacts: { phone: "+7 (726) 333-44-55", email: "merke@kendala.kz" }
    },
    {
        id: 31,
        title: { kz: "Шаян: Оңтүстік Каньондары", ru: "Шаян: Южные Каньоны", en: "Shayan: Southern Canyons" },
        region: "South", type: { kz: "Фото-тур", ru: "Экзотика", en: "Exotic" },
        duration: 2, price: 220, image: "https://images.unsplash.com/photo-1603621061602-fce636447a8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXZlJTIwZW50cmFuY2UlMjBuYXR1cmUlMjBzdW5saWdodCUyMGluc2lkZXxlbnwxfHx8fDE3NzAzMDk2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Medium",
        description: { kz: "Ақмешіт үңгірі мен Шаянның қызыл жартастары.", ru: "Гигантская пещера Акмечеть и каньоны Туркестанской области.", en: "Giant Akmeshit cave and Turkestan region canyons." },
        longDescription: {
            kz: "Түркістан облысындағы Шаян каньондары — Шарынға ұқсас, бірақ өзіндік ерекшелігі бар. Ақмешіт үңгірінің аурасы мен сұлулығы сізді таңғалдырады. Үңгірдің ішінде өзіндік микроклимат бар, тіпті ағаштар өседі. Бұл жер туралы көптеген аңыздар бар. Фотографтар мен тарихты сүйетіндер үшін тамаша орын.",
            ru: "Тур в Шаян — это путешествие по малоизвестным, но грандиозным локациям. Пещера Акмечеть поражает масштабами: это огромный купол со своим микроклиматом и деревьями внутри. Красные каньоны реки Шаян напоминают американские прерии. Мы посетим сакральные мечети и узнаем легенды о святых старцах. Тур для тех, кто ищет необычные ракурсы и тихие святыни.",
            en: "A tour to Shayan visits lesser-known but grand locations. Akmeshit cave impresses with its scale: a massive dome with its own microclimate and trees inside. The red canyons of the Shayan River resemble American prairies. We'll visit sacred mosques and learn legends of holy elders. For those seeking unique angles and quiet shrines."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Ақмешіт", ru: "Акмечеть", en: "Akmeshit" }, desc: { kz: "Үңгірге түсу. Рухани демалыс.", ru: "Спуск в гигантскую пещеру. Медитация и фото.", en: "Descent into the giant cave. Meditation and photos." } },
            { day: 2, title: { kz: "Каньондар", ru: "Каньоны", en: "Canyons" }, desc: { kz: "Шаян каньондарын аралау. Қайту.", ru: "Прогулка по красным каньонам. Возвращение в Шымкент.", en: "Stroll through red canyons. Return to Shymkent." } }
        ],
        included: [{ kz: "Трансфер", ru: "Трансфер", en: "Transfer" }, { kz: "Гид", ru: "Гид", en: "Guide" }, { kz: "Пикник", ru: "Пикник", en: "Picnic" }],
        whatToBring: [{ kz: "Камера", ru: "Камера", en: "Camera" }, { kz: "Жайлы аяқ киім", ru: "Удобная обувь", en: "Comfortable shoes" }],
        contacts: { phone: "+7 (725) 222-11-00", email: "shayan@kendala.kz" }
    },
    {
        id: 32,
        title: { kz: "Ассы: Жұлдыздар Үстірті", ru: "Ассы: Плато Звезд", en: "Assy: Plateau of Stars" },
        region: "Almaty", type: { kz: "Астро-тур", ru: "Фото-экспедиция", en: "Photo Expedition" },
        duration: 2, price: 200, image: "https://images.unsplash.com/photo-1651515089125-e73c19f1dedf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBc3N5JTIwcGxhdGVhdSUyMG9ic2VydmF0b3J5JTIwS2F6YWtoc3RhbnxlbnwxfHx8fDE3NzAzMDk2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Medium",
        description: { kz: "Обсерватория мен биік таулы жайлаудағы түнгі аспан.", ru: "Звездное небо над обсерваторией и альпийские луга.", en: "Starry skies over the observatory and alpine meadows." },
        longDescription: {
            kz: "Ассы жайлауы — Алматы облысындағы ең көрікті биік таулы үстірт. Мұнда 2800 метр биіктікте алып обсерватория орналасқан. Түнде аспан мөлдір болып, жұлдыздар қол созым жерде тұрғандай көрінеді. Біз жайлаудағы көшпенділердің өмірімен танысып, таудың таза ауасымен тыныстаймыз. Астрофотография үшін ең жақсы мекен.",
            ru: "Плато Ассы — это гигантская альпийская долина на высоте 2800 метров. Белый купол обсерватории на фоне заснеженных пиков создает сюрреалистичную картину. Мы увидим стада лошадей, древние курганы и проведем ночь в палатках, наблюдая за Млечным Путем. Здесь воздух настолько разрежен и чист, что звезды кажутся огромными. Настоящий рай для романтиков и фотографов.",
            en: "The Assy Plateau is a massive alpine valley at 2800 meters. The white observatory dome against snow-capped peaks creates a surreal image. We'll see horse herds, ancient mounds, and spend the night in tents watching the Milky Way. The air is so thin and clear that the stars seem giant. A true paradise for romantics and photographers."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Жайлау", ru: "Жайляу", en: "Zhaylyau" }, desc: { kz: "Ассыға көтерілу. Лагерь құру. Күн бату.", ru: "Подъем на плато. Установка лагеря. Вечерняя съемка обсерватории.", en: "Ascent to the plateau. Camp setup. Evening observatory shoot." } },
            { day: 2, title: { kz: "Обсерватория", ru: "Космос", en: "Cosmos" }, desc: { kz: "Түнгі жұлдыздарды бақылау. Таңғы серуен.", ru: "Ночное наблюдение за небом. Прогулка к петроглифам. Спуск.", en: "Night stargazing. Walk to petroglyphs. Descent." } }
        ],
        included: [{ kz: "Джип 4x4", ru: "Внедорожник 4x4", en: "4x4 SUV" }, { kz: "Шатыр", ru: "Снаряжение", en: "Gear" }, { kz: "Аспаз", ru: "Повар", en: "Chef" }],
        whatToBring: [{ kz: "Жылы киім", ru: "Очень теплая одежда", en: "Very warm clothes" }, { kz: "Штатив", ru: "Штатив", en: "Tripod" }],
        contacts: { phone: "+7 (701) 555-00-99", email: "assy@kendala.kz" }
    },
    {
        id: 33,
        title: { kz: "Бартоғай: Адреналин", ru: "Бартогай: Драйв", en: "Bartogay: Drive" },
        region: "Almaty", type: { kz: "Шытырман", ru: "Рафтинг", en: "Rafting" },
        duration: 1, price: 120, image: "https://images.unsplash.com/photo-1762517441664-20f6826ae192?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZXdhdGVyJTIwcmFmdGluZyUyMHJpdmVyJTIwYWN0aW9ufGVufDF8fHx8MTc3MDMwOTYxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Extreme",
        description: { kz: "Іле өзеніндегі рафтинг пен Бартоғай бөгеті.", ru: "Экстремальный сплав и фонтаны водохранилища.", en: "Extreme rafting and reservoir fountains." },
        longDescription: {
            kz: "Бартоғай су қоймасы — алып су бөгеті. Мұнда судың шығуы өте әсерлі көрініс сыйлайды. Біз Іле өзенінде экстремалды рафтинг ұйымдастырамыз. Судың толқыны мен адреналин сізді сергітеді. Тур кәсіби нұсқаушылармен бірге өтеді. Белсенді демалысты сүйетіндер үшін таптырмас мүмкіндік.",
            ru: "Бартогай знаменит своими колоссальными фонтанами при сбросе воды. Это создает идеальные условия для рафтинга на реке Чилик. Вас ждут пороги, брызги и мощный заряд адреналина. Мы обеспечиваем полное снаряжение и сопровождение профессиональных спасателей. Обед-пикник на берегу реки после сплава завершит этот драйвовый день.",
            en: "Bartogay is famous for its colossal water release fountains. This creates perfect conditions for rafting on the Chilik River. Expect rapids, splashes, and a massive adrenaline rush. We provide full gear and professional rescue support. A riverside picnic lunch after the float completes this high-drive day."
        },
        rating: 4.7,
        itinerary: [
            { day: 1, title: { kz: "Бөгет", ru: "Плотина", en: "Dam" }, desc: { kz: "Бартоғай бөгетін көру. Рафтингке дайындық.", ru: "Осмотр сброса воды. Инструктаж. Начало сплава.", en: "Viewing the water release. Briefing. Start of the float." } }
        ],
        included: [{ kz: "Рафт", ru: "Рафтинг-снаряжение", en: "Rafting gear" }, { kz: "Инструктор", ru: "Инструктор", en: "Instructor" }, { kz: "Ланч", ru: "Обед", en: "Lunch" }],
        whatToBring: [{ kz: "Ауыстыратын киім", ru: "Сменная одежда", en: "Spare clothes" }, { kz: "Сүлгі", ru: "Полотенце", en: "Towel" }],
        contacts: { phone: "+7 (702) 111-22-33", email: "raft@kendala.kz" }
    },
    {
        id: 34,
        title: { kz: "Есік Көлі: Тарих Інжуі", ru: "Озеро Иссык: Изумруд истории", en: "Lake Issyk: Emerald of History" },
        region: "Almaty", type: { kz: "Табиғат", ru: "Экскурсия", en: "Excursion" },
        duration: 1, price: 80, image: "https://images.unsplash.com/photo-1729959884778-da26e3896ed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWtlJTIwSXNzeWslMjBLYXpha2hzdGFuJTIwdHVycXVvaXNlJTIwd2F0ZXJ8ZW58MXx8fHwxNzcwMzA5NjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Есік көлі мен Алтын адамның отаны.", ru: "Красивейшее озеро и музей сакской культуры.", en: "Stunning lake and Saka culture museum." },
        longDescription: {
            kz: "Есік көлі — Іле Алатауының ең көрікті жерлерінің бірі. 1963 жылғы тасқыннан кейін қайта қалпына келген көлдің түсі таңғалдырады. Біз сондай-ақ 'Алтын адам' табылған Есік қорғанына және археологиялық мұражайға барамыз. Сактардың тарихы мен табиғаттың сұлулығы бір турда.",
            ru: "Высокогорное озеро Иссык расположено в одноименном ущелье. Оно известно своей изумрудной водой и трагической историей селя. После прогулки у озера мы посетим курган, где был найден Золотой человек — символ Казахстана. В государственном историко-культурном заповеднике-музее 'Иссык' вы узнаете всё о цивилизации древних саков.",
            en: "Alpine Lake Issyk is located in the eponymous gorge. It's known for its emerald water and tragic flood history. After a lakeside walk, we'll visit the mound where the Golden Man—Kazakhstan's symbol—was found. At the 'Issyk' state museum-reserve, you'll learn all about the ancient Saka civilization."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Мұражай мен Көл", ru: "Музей и Озеро", en: "Museum & Lake" }, desc: { kz: "Мұражай аралау. Көл жағасындағы серуен.", ru: "Экскурсия в музей саков. Прогулка у озера Иссык.", en: "Saka museum tour. Stroll by Lake Issyk." } }
        ],
        included: [{ kz: "Транспорт", ru: "Транспорт", en: "Transport" }, { kz: "Билет", ru: "Билеты в музей", en: "Museum tickets" }, { kz: "Гид", ru: "Гид", en: "Guide" }],
        whatToBring: [{ kz: "Ыңғайлы аяқ киім", ru: "Кроссовки", en: "Sneakers" }, { kz: "Көзілдірік", ru: "Очки", en: "Sunglasses" }],
        contacts: { phone: "+7 (727) 222-11-33", email: "issyk@kendala.kz" }
    },
    {
        id: 35,
        title: { kz: "Түрген: Сарқырамалар", ru: "Тургень: Водопады", en: "Turgen: Waterfalls" },
        region: "Almaty", type: { kz: "Хайкинг", ru: "Семейный отдых", en: "Family Fun" },
        duration: 1, price: 70, image: "https://images.unsplash.com/photo-1751440368012-18334398f8b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUdXJnZW4lMjB3YXRlcmZhbGwlMjBmb3Jlc3QlMjBLYXpha2hzdGFufGVufDF8fHx8MTc3MDMwOTkxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Аюлы сарқырамасы мен форель фермасы.", ru: "Хайкинг к водопадам и обед на форелевой ферме.", en: "Waterfall hiking and trout farm lunch." },
        longDescription: {
            kz: "Түрген шатқалы — табиғаты бай және жаяу жүруге өте қолайлы мекен. Біз Аюлы сарқырамасына дейін жеңіл хайкинг жасаймыз. Содан кейін форель фермасына барып, өз қолыңызбен балық аулап, оны түскі асқа жей аласыз. Түргеннің таза ауасы мен тау өзені сізге жақсы көңіл-күй сыйлайды.",
            ru: "Тургеньское ущелье идеально для однодневного выезда. Мы пройдем легким маршрутом к Медвежьему водопаду, а затем посетим форелевое хозяйство, где можно самому поймать рыбу на обед. В программе также визит к страусиной ферме. Отличный вариант для отдыха с детьми на свежем воздухе.",
            en: "Turgen Gorge is ideal for a one-day trip. We'll take an easy route to Bear Waterfall, then visit a trout farm where you can catch your own lunch. The program also includes an ostrich farm visit. A great option for family fun in the fresh air."
        },
        rating: 4.6,
        itinerary: [
            { day: 1, title: { kz: "Сарқырама", ru: "Водопад", en: "Waterfall" }, desc: { kz: "Аюлы сарқырамасына жорық. Форель фермасы.", ru: "Хайкинг (1.5 км). Обед на ферме. Страусиная ферма.", en: "Hike (1.5km). Farm lunch. Ostrich farm." } }
        ],
        included: [{ kz: "Транспорт", ru: "Транспорт", en: "Transport" }, { kz: "Пикник", ru: "Пикник", en: "Picnic" }],
        whatToBring: [{ kz: "Су", ru: "Вода", en: "Water" }, { kz: "Жайлы киім", ru: "Удобная одежда", en: "Comfortable clothes" }],
        contacts: { phone: "+7 (701) 444-55-66", email: "turgen@kendala.kz" }
    },
    {
        id: 36,
        title: { kz: "Шонжы: Термалды Сулар", ru: "Чунджа: Горячие Источники", en: "Chundzha: Hot Springs" },
        region: "Almaty", type: { kz: "Wellness", ru: "Релакс", en: "Relax" },
        duration: 2, price: 180, image: "https://images.unsplash.com/photo-1769438952085-8bacd8183f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwaG90JTIwc3ByaW5ncyUyMHdpbnRlciUyMHN0ZWFtfGVufDF8fHx8MTc3MDMwOTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Минералды бұлақтар мен SPA демалыс.", ru: "Оздоровление в термальных бассейнах под открытым небом.", en: "Wellness in open-air thermal pools." },
        longDescription: {
            kz: "Шонжы — ыстық минералды суларымен танымал шипажай аймағы. Судың температурасы 37-50 градус аралығында болады. Бұл су денсаулыққа, әсіресе буындарға өте пайдалы. Біз ең жақсы демалыс орындарының бірінде тоқтап, демаламыз. Түнгі аспан астында ыстық бассейнде шомылу — ерекше сезім.",
            ru: "Чунджа — это десятки баз отдыха с бассейнами, наполненными радоновой и кремниевой водой из подземных источников. Температура воды комфортна даже в мороз. Это полноценный SPA-ретрит посреди степи. Мы выбираем лучшие базы с современным сервисом и питанием. Идеальное место для зимнего отдыха и восстановления сил.",
            en: "Chundzha features dozens of rest bases with pools filled with radon and silicon water from underground springs. The temperature is comfortable even in freezing weather. A full-blown SPA retreat in the middle of the steppe. We pick the best bases with modern service. Perfect for winter recovery."
        },
        rating: 4.5,
        itinerary: [
            { day: 1, title: { kz: "Келу", ru: "Приезд", en: "Arrival" }, desc: { kz: "Алматыдан келу. Бассейнге шомылу.", ru: "Трансфер из Алматы (4 часа). Заселение. Релакс в бассейнах.", en: "Almaty transfer (4h). Check-in. Pool relaxation." } },
            { day: 2, title: { kz: "Демалыс", ru: "Отдых", en: "Relax" }, desc: { kz: "Таңғы шомылу. Релакс. Қайту.", ru: "Утреннее купание. Свободное время. Возвращение в город.", en: "Morning swim. Free time. Return to city." } }
        ],
        included: [{ kz: "Курорт", ru: "База отдыха", en: "Resort base" }, { kz: "Тамақ", ru: "3-разовое питание", en: "Full-board" }, { kz: "Трансфер", ru: "Трансфер", en: "Transfer" }],
        whatToBring: [{ kz: "Шомылу киімі", ru: "Купальник", en: "Swimwear" }, { kz: "Халат", ru: "Халат и тапочки", en: "Bathrobe & slippers" }],
        contacts: { phone: "+7 (727) 777-88-99", email: "spa@kendala.kz" }
    },
    {
        id: 37,
        title: { kz: "Жаркент: Сәулет Нақышы", ru: "Жаркент: Пагода", en: "Zharkent: Pagoda" },
        region: "Almaty", type: { kz: "Мәдени", ru: "История", en: "History" },
        duration: 2, price: 200, image: "https://images.unsplash.com/photo-1730474506965-2b659b1d6a71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxaaGFya2VudCUyMG1vc3F1ZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzAzMDk2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Шегесіз салынған пагода стиліндегі мешіт.", ru: "Уникальная мечеть в китайском стиле и 700-летний дуб.", en: "Unique Chinese-style mosque and a 700-year-old oak." },
        longDescription: {
            kz: "Жаркент мешіті — Орталық Азиядағы ең ерекше сәулет ескерткіштерінің бірі. Ол 1895 жылы бірде-бір шегесіз, Қытай пагодасы стилінде салынған. Біз сондай-ақ киелі 'Әулие ағашқа' барамыз, оның жасы 700 жылдан асады. Бұл тур сізді Жібек жолының мәдениеттер тоғысқан атмосферасына бөлейді.",
            ru: "Жаркентская мечеть — архитектурное чудо XIX века. Построенная из тянь-шаньской ели без гвоздей, она соединяет в себе исламские и буддийские мотивы. Мы также посетим Аулие агаш — гигантский карагач, возраст которого превышает 700 лет. Это место силы, где люди веками загадывают желания. Путешествие в Жаркент — это погружение в атмосферу старого Шелкового пути.",
            en: "Zharkent Mosque is a 19th-century architectural miracle. Built from Tien Shan spruce without a single nail, it blends Islamic and Buddhist motifs. We'll also visit Aulie Agash—a giant elm over 700 years old. A place of power where people have made wishes for centuries. A trip to Zharkent is an immersion into the old Silk Road atmosphere."
        },
        rating: 4.7,
        itinerary: [
            { day: 1, title: { kz: "Мешіт", ru: "Мечеть", en: "Mosque" }, desc: { kz: "Жаркентке келу. Мешіт-мұражайды аралау.", ru: "Экскурсия в мечеть-пагоду. История купца Юлдашева.", en: "Mosque-pagoda tour. Story of merchant Yuldashev." } },
            { day: 2, title: { kz: "Киелі Ағаш", ru: "Святое Дерево", en: "Holy Tree" }, desc: { kz: "Әулие ағашқа бару. Тілек тілеу.", ru: "Визит к 700-летнему дереву. Обед в уйгурской семье.", en: "Visit to the 700-year-old tree. Lunch with a local family." } }
        ],
        included: [{ kz: "Гид", ru: "Гид", en: "Guide" }, { kz: "Тұру", ru: "Гостиница", en: "Hotel stay" }, { kz: "Тамақ", ru: "Традиционные обеды", en: "Traditional meals" }],
        whatToBring: [{ kz: "Орамал", ru: "Платок", en: "Headscarf" }, { kz: "Сенім", ru: "Вера в чудеса", en: "Faith in miracles" }],
        contacts: { phone: "+7 (727) 333-00-11", email: "zharkent@kendala.kz" }
    },
    {
        id: 38,
        title: { kz: "Қорғас: Сауда Көпірі", ru: "Хоргос: Граница", en: "Khorgos: The Border" },
        region: "Almaty", type: { kz: "Шоппинг", ru: "Бизнес-тур", en: "Business Tour" },
        duration: 1, price: 100, image: "https://images.unsplash.com/photo-1614484717583-ae184e07e118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLaG9yZ29zJTIwSW50ZXJuYXRpb25hbCUyMENlbnRlciUyMG9mJTIwQm91bmRhcnklMjBDb29wZXJhdGlvbnxlbnwxfHx8fDE3NzAzMTAwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Қытай шекарасындағы еркін сауда аймағы.", ru: "Беспошлинная торговля и нейтральная зона между странами.", en: "Duty-free trade and neutral zone between countries." },
        longDescription: {
            kz: "Қорғас — Қазақстан мен Қытай арасындағы нейтралды аймақта орналасқан алып сауда кешені. Мұнда сіз электроника, киім-кешек және басқа да тауарларды зауыттық бағада ала аласыз. Шет елге шыққандай сезім сыйлайтын бұл жерде логистикалық орталықтардың жұмысын көре аласыз. Шоппинг пен шекаралық экзотика.",
            ru: "МЦПС Хоргос — это уникальный проект на нейтральной полосе границы. Огромные торговые центры Китая доступны без визы. Вы сможете приобрести электронику, текстиль и экзотические продукты по оптовым ценам. Мы обеспечиваем комфортабельный трансфер из Алматы, помощь в прохождении таможни и сопровождение по рынкам. Весь колорит приграничной торговли в одном туре.",
            en: "Khorgos ICBC is a unique project on the border's neutral strip. Huge Chinese shopping malls are accessible without a visa. Buy electronics, textiles, and exotic products at wholesale prices. We provide comfortable Almaty transfers, customs assistance, and market guidance. The full flavor of border trade in one tour."
        },
        rating: 4.4,
        itinerary: [
            { day: 1, title: { kz: "Шекара", ru: "Граница", en: "Border" }, desc: { kz: "Таңғы шығу. Кедендік тексеріс. Шоппинг.", ru: "Выезд в 5 утра. Проход КПП. Шоппинг до вечера.", en: "5 AM departure. Customs check. Shopping until evening." } }
        ],
        included: [{ kz: "Автобус", ru: "Комфортабельный автобус", en: "Comfortable bus" }, { kz: "Гид", ru: "Сопровождение", en: "Support guide" }],
        whatToBring: [{ kz: "Төлқұжат", ru: "Паспорт (оригинал)", en: "Passport (original)" }, { kz: "Чемодан", ru: "Пустой чемодан", en: "Empty suitcase" }],
        contacts: { phone: "+7 (707) 222-11-00", email: "shop@kendala.kz" }
    },
    {
        id: 39,
        title: { kz: "Текелі: Сарқырама Шыңы", ru: "Текели: Гранд Водопад", en: "Tekeli: Grand Waterfall" },
        region: "East", type: { kz: "Треккинг", ru: "Экспедиция", en: "Expedition" },
        duration: 3, price: 300, image: "https://images.unsplash.com/photo-1749852660673-62d8d1545620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCdXJraGFuJTIwQnVsYWslMjB3YXRlcmZhbGwlMjBuYXR1cmV8ZW58MXx8fHwxNzcwMzEwMDE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Hard",
        description: { kz: "Бурхан-Бұлақ — Орталық Азияның ең биік сарқырамасы.", ru: "168 метров падающей воды в сердце ущелья Кора.", en: "168 meters of falling water in the heart of Kora Gorge." },
        longDescription: {
            kz: "Текелі қаласынан басталатын бұл экспедиция сізді Бурхан-Бұлақ сарқырамасына апарады. Биіктігі 168 метрлік бұл алып сарқыраманың қуаты таңғалдырады. Жол бойы Кора өзенінің жағасымен жүріп, таудың жабайы табиғатын көресіз. Жол өте қиын, сондықтан тек жоғары өтімділіктегі джиптерді қолданамыз. Нағыз тау еркіндігі.",
            ru: "Водопад Бурхан-Булак — гордость Семиречья. Путь к нему из города Текели лежит через сложнейшие горные серпантины и броды. Вы увидите три каскада ледяной воды общей высотой 168 метров. В ущелье Кора мы разобьем лагерь, будем пить чай из горных трав и слушать шум падающей воды. Тур для тех, кто готов к дорожным испытаниям ради величия природы.",
            en: "Burkhan-Bulak waterfall is the pride of Semirechye. The path from Tekeli crosses tough mountain serpentines and fords. You'll see three ice-cold water cascades totaling 168 meters. In Kora Gorge, we'll set up camp, drink herbal tea, and listen to the water's roar. A tour for those ready for road trials in exchange for nature's majesty."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Асулар", ru: "Перевалы", en: "Passes" }, desc: { kz: "Текеліден шығу. Биік асудан өту. Лагерь.", ru: "Выезд из Текели. Преодоление перевала Капал. Установка палаток.", en: "Tekeli departure. Kapal pass crossing. Tent setup." } },
            { day: 2, title: { kz: "Гигант", ru: "Гигант", en: "Giant" }, desc: { kz: "Сарқырамаға бару. Радиальді жорық.", ru: "Весь день у водопада Бурхан-Булак. Фото и медитация.", en: "Full day at Burkhan-Bulak. Photos and meditation." } },
            { day: 3, title: { kz: "Қайту", ru: "Возврат", en: "Return" }, desc: { kz: "Шатқалдан шығу. Талдықорғанға трансфер.", ru: "Выезд из ущелья. Трансфер в город. Прощальный ужин.", en: "Gorge exit. City transfer. Farewell dinner." } }
        ],
        included: [{ kz: "Джип 4x4", ru: "Подготовленный джип", en: "Prepped SUV" }, { kz: "Лагерь", ru: "Лагерь и повар", en: "Camp & Chef" }, { kz: "Гид", ru: "Гид-инструктор", en: "Guide-instructor" }],
        whatToBring: [{ kz: "Ботинка", ru: "Горные ботинки", en: "Mountain boots" }, { kz: "Дождевик", ru: "Дождевик", en: "Raincoat" }],
        contacts: { phone: "+7 (705) 333-22-11", email: "tekeli@kendala.kz" }
    },
    {
        id: 40,
        title: { kz: "Алматы Қысы: Медеу мен Шымбұлақ", ru: "Зима в Алматы: Медеу и Шымбулак", en: "Almaty Winter: Medeu & Shymbulak" },
        region: "Almaty", type: { kz: "Спорт", ru: "Горные лыжи", en: "Alpine Skiing" },
        duration: 1, price: 100, image: "https://images.unsplash.com/photo-1616967228676-20dc8f1697ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTaHltYnVsYWslMjBza2klMjByZXNvcnQlMjB3aW50ZXIlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzcwMzA5NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Мұз айдыны мен тау шаңғысы курорты.", ru: "Легендарный каток на 1691м и горнолыжные трассы мирового уровня.", en: "Legendary ice rink at 1691m and world-class ski slopes." },
        longDescription: {
            kz: "Медеу — әлемдегі ең биік таулы мұз айдыны, мұнда жүздеген әлемдік рекордтар орнатылған. Шымбұлақ — халықаралық деңгейдегі тау шаңғысы курорты, 2260 метр биіктікте орналасқан. Біз гондоламен Талғар асуына (3200 м) көтеріліп, таулардың керемет көрінісін тамашалаймыз. Қысқы Алматының символы саналатын бұл жер сізге нағыз мерекелік көңіл-күй сыйлайды.",
            ru: "Почувствуйте драйв алматинской зимы! Мы начнем с катания на коньках на легендарном Медеу, а затем поднимемся на гондольной дороге на Шымбулак. Вас ждут идеально подготовленные трассы, уютные кофейни с видом на пики и подъем на самую высокую точку — Талгарский перевал (3200 метров). Это тур для любителей активного отдыха и тех, кто хочет увидеть 'визитную карточку' Алматы в снежном убранстве.",
            en: "Feel the drive of Almaty winter! We start with skating at the legendary Medeu, then take the gondola to Shymbulak. Expect perfectly prepped slopes, cozy cafes with peak views, and an ascent to the highest point—Talgar Pass (3200m). A tour for active lifestyle lovers and those wanting to see Almaty's snowy 'calling card'."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Мұз және Қар", ru: "Лед и Снег", en: "Ice & Snow" }, desc: { kz: "Медеуде коньки тебу. Шымбұлаққа көтерілу. Талғар асуы.", ru: "Каток Медеу. Подъем на Шымбулак. Обед в горах. Пик 3200м.", en: "Medeu skating. Shymbulak ascent. Mountain lunch. 3200m peak." } }
        ],
        included: [{ kz: "Билеттер", ru: "Ски-пасс и каток", en: "Ski-pass & skating" }, { kz: "Трансфер", ru: "Трансфер из города", en: "City transfer" }, { kz: "Гид", ru: "Сопровождение", en: "Support guide" }],
        whatToBring: [{ kz: "Спорт киім", ru: "Теплая спортодежда", en: "Warm sportswear" }, { kz: "Көзілдірік", ru: "Солнцезащитные очки", en: "Sunglasses" }],
        contacts: { phone: "+7 (727) 331-77-77", email: "info@shymbulak.com" }
    },
    {
        id: 41,
        title: { kz: "Алматы Мәдениеті: Театрлар мен Музейлер", ru: "Культурная Алматы: Театры и Музеи", en: "Cultural Almaty: Arts & History" },
        region: "Almaty", type: { kz: "Мәдени", ru: "Искусство", en: "Arts" },
        duration: 1, price: 60, image: "https://images.unsplash.com/photo-1676396096781-72d05ddabe61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        difficulty: "Easy",
        description: { kz: "Опера театры мен Қастеев мұражайына саяхат.", ru: "Вечер классического балета и шедевры казахской живописи.", en: "Classical ballet evening and masterpieces of Kazakh painting." },
        longDescription: {
            kz: "Алматы — елдің мәдени жүрегі. Абай атындағы опера және балет театры — сәулет туындысы. Біз Әбілхан Қастеев атындағы өнер мұражайына барып, қазақ бейнелеу өнерінің жауһарларын көреміз. Тур аясында Панфилов көшесімен серуендеп, қаланың шығармашылық атмосферасын сезінеміз. Мәдени демалыс пен рухани азық іздегендерге арналған.",
            ru: "Погрузитесь в богемную атмосферу Алматы. Мы посетим Театр оперы и балета им. Абая — архитектурный памятник с уникальной акустикой. В музее Кастеева вы увидите легендарные полотна, отражающие дух степи. Вечер завершится прогулкой по пешеходному центру и ужином в одном из арт-кафе. Тур для тех, кто ценит эстетику, историю и классическое искусство.",
            en: "Immerse yourself in Almaty's bohemian atmosphere. Visit the Abay Opera and Ballet Theatre—an architectural landmark with unique acoustics. At the Kasteyev Museum, witness legendary canvases reflecting the steppe's spirit. The evening ends with a stroll through the pedestrian center and dinner at an art cafe. For those valuing aesthetics and classical art."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Өнер Әлемі", ru: "Мир Искусства", en: "World of Art" }, desc: { kz: "Қастеев мұражайы. Опера театрына кешкі бару.", ru: "Музей искусств. Прогулка по центру. Вечерний балет.", en: "Art museum. Center stroll. Evening ballet performance." } }
        ],
        included: [{ kz: "Билет", ru: "Билеты в театр и музей", en: "Theatre & Museum tickets" }, { kz: "Гид", ru: "Искусствовед", en: "Art guide" }, { kz: "Кешкі ас", ru: "Ужин в арт-кафе", en: "Art-cafe dinner" }],
        whatToBring: [{ kz: "Кешкі көйлек", ru: "Вечерний наряд", en: "Evening wear" }, { kz: "Көңіл-күй", ru: "Настроение", en: "Good mood" }],
        contacts: { phone: "+7 (727) 272-79-34", email: "culture@almaty.kz" }
    },
    {
        id: 42,
        title: { kz: "Алматы Гастро: Кофе мен Барлар", ru: "Гастро Алматы: Кофе и Бары", en: "Gastro Almaty: Coffee & Bars" },
        region: "Almaty", type: { kz: "Гастро", ru: "Ночная жизнь", en: "Nightlife" },
        duration: 1, price: 50, image: "https://images.unsplash.com/photo-1769985840494-32e240087fa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY29mZmVlJTIwc2hvcCUyMGludGVyaW9yJTIwZGFyayUyMHdvb2R8ZW58MXx8fHwxNzcwMzA5NjIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Қаланың ең үздік кофейнялары мен жасырын барлары.", ru: "Тур по кофейням 'золотого квадрата' и секретным барам.", en: "Tour of 'golden square' coffee shops and secret bars." },
        longDescription: {
            kz: "Алматы — кофе мәдениетінің орталығы. Біз қаланың ең үздік кофейняларынан бастап, кешкісін жасырын (speakeasy) барларға барамыз. Сіз авторлық коктейльдер мен қаланың түнгі өмірімен танысасыз. Панфилов пен Төле би көшелерінің атмосферасы, заманауи алматылықтардың өмір салты. Нағыз урбан-гастро шытырман.",
            ru: "Алматы называют городом кофе и баров. Наш авторский тур проведет вас по самым атмосферным кофейням с обжаркой 'specialty' и секретным барам без вывесок, которые знают только местные. Вы узнаете историю 'золотого квадрата' города через его вкусы. Вечер завершится дегустацией коктейлей и погружением в ночной драйв мегаполиса.",
            en: "Almaty is often called the city of coffee and bars. Our curated tour leads you through the most atmospheric specialty coffee shops and hidden speakeasy bars known only to locals. Discover the 'golden square's' history through its flavors. The evening culminates in a cocktail tasting and immersion into the city's nightly drive."
        },
        rating: 4.7,
        itinerary: [
            { day: 1, title: { kz: "Дәм мен Кеш", ru: "Вкус и Вечер", en: "Taste & Evening" }, desc: { kz: "Кофе дегустациясы. Бар-хоппинг.", ru: "Тур по 3 кофейням. Ужин. Посещение 2 секретных баров.", en: "3-coffee-shop tour. Dinner. Visit to 2 secret bars." } }
        ],
        included: [{ kz: "Дегустация", ru: "Напитки и дегустации", en: "Drinks & tastings" }, { kz: "Гид", ru: "Локальный эксперт", en: "Local expert guide" }],
        whatToBring: [{ kz: "Көңіл-күй", ru: "Хорошее настроение", en: "Good mood" }, { kz: "Смартфон", ru: "Смартфон", en: "Smartphone" }],
        contacts: { phone: "+7 (707) 111-00-22", email: "gastrotour@almaty.kz" }
    },
    {
        id: 43,
        title: { kz: "Тараз: Махаббат Жәдігерлері", ru: "Тараз: Святыни Любви", en: "Taraz: Shrines of Love" },
        region: "South", type: { kz: "Тарихи", ru: "Паломничество", en: "Pilgrimage" },
        duration: 2, price: 240, image: "https://images.unsplash.com/photo-1680777015090-134cea6d04f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBaXNoYSUyMEJpYmklMjBtYXVzb2xldW0lMjBUYXJhenxlbnwxfHx8fDE3NzAzMDk2MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Айша бибі мен Қарахан кесенелері — махаббат символы.", ru: "Шедевры терракотового зодчества и легенды древнего Тараза.", en: "Terracotta architecture masterpieces and legends of ancient Taraz." },
        longDescription: {
            kz: "Тараз — 2000 жылдық тарихы бар, Жібек жолының маңызды бекеті. Айша бибі кесенесі — XII ғасырдың бірегей сәулет ескерткіші, махаббат пен адалдықтың символы. Біз Қарахан кесенесіне, Тектурмас кешеніне барамыз. Көне Тараздың қазба жұмыстары мен мұражайлары сізді орта ғасырларға жетелейді. Рухани тазару мен тарихқа құрмет.",
            ru: "Тараз — один из древнейших городов Казахстана. Главная жемчужина — мавзолей Айша-Биби, полностью облицованный резной терракотой. История любви красавицы Айши и правителя Карахана оживает здесь в каждом камне. Мы также посетим древнюю баню Кали-Юнуса и комплекс Тектурмас на берегу реки Талас. Тур для тех, кто хочет прикоснуться к истокам цивилизации.",
            en: "Taraz is one of Kazakhstan's oldest cities. The crown jewel is the Aisha-Bibi Mausoleum, entirely faced with carved terracotta. The love story of beautiful Aisha and ruler Karakhan lives in every stone here. We'll also visit the ancient Kali-Yunus bath and the Tekturmas complex on the Talas riverbank. A tour for those wanting to touch the roots of civilization."
        },
        rating: 4.8,
        itinerary: [
            { day: 1, title: { kz: "Көне Тараз", ru: "Древний Тараз", en: "Ancient Taraz" }, desc: { kz: "Қарахан кесенесі. Көне монша. Тектурмас.", ru: "Мавзолей Карахана. Раскопки цитадели. Закат на Тектурмасе.", en: "Karakhan mausoleum. Citadel excavations. Tekturmas sunset." } },
            { day: 2, title: { kz: "Айша Бибі", ru: "Айша-Биби", en: "Aisha-Bibi" }, desc: { kz: "Айша бибі және Бабаджа қатын кесенелері.", ru: "Посещение мавзолеев Айша-Биби и Бабаджа-Хатун. Выезд.", en: "Visit to Aisha-Bibi and Babaja-Khatun mausoleums. Departure." } }
        ],
        included: [{ kz: "Гид", ru: "Гид-историк", en: "Historian guide" }, { kz: "Отель", ru: "Гостиница", en: "Hotel stay" }, { kz: "Трансфер", ru: "Трансфер", en: "Transfer" }],
        whatToBring: [{ kz: "Орамал", ru: "Платок", en: "Headscarf" }, { kz: "Су", ru: "Вода", en: "Water" }],
        contacts: { phone: "+7 (726) 222-33-44", email: "taraz@kendala.kz" }
    },
    {
        id: 44,
        title: { kz: "Жетісу: Түркі Қағанаты Ізімен", ru: "Жетысу: Следы Каганата", en: "Zhetysu: Khaganate Traces" },
        region: "South", type: { kz: "Тарихи", ru: "Археология", en: "Archaeology" },
        duration: 3, price: 380, image: "https://images.unsplash.com/photo-1766152653377-efc7df4d7f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUYW1nYWx5JTIwVGFzJTIwQnVkZGhhJTIwcm9jayUyMGNhcnZpbmd8ZW58MXx8fHwxNzcwMzA5NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Medium",
        description: { kz: "Тамғалы-Тас пен ежелгі Қойлық қалашығы.", ru: "Буддийские надписи на скалах и руины столицы карлуков.", en: "Buddhist rock inscriptions and Karluk capital ruins." },
        longDescription: {
            kz: "Жетісу (Жетісу) — өркениеттер тоғысқан киелі өлке. Тамғалы-Тастағы Іле өзені жағасындағы жартастағы буддалық бейнелер — нағыз жұмбақ. Біз ЮНЕСКО мұрасы — Қойлық қалашығына барамыз, ол кезінде Қарлұқ қағанатының астанасы болған. Мұнда мешіттер, шіркеулер мен будда ғибадатханалары қатар тұрған. Толеранттылық пен тарих сабағы.",
            ru: "Семиречье — земля контрастов и древних культур. Мы увидим Тамгалы-Тас, где на скалах у реки Или замерли изображения Будд. Затем отправимся к руинам городища Койлык, где мирно сосуществовали ислам, христианство и буддизм. Это путешествие раскроет перед вами духовную карту Великого Шелкового пути и величие тюркских каганатов.",
            en: "Semirechye is a land of contrasts and ancient cultures. Witness Tamgaly-Tas, where Buddha images are frozen on cliffs by the Ili River. Then, head to the ruins of Koylyk, where Islam, Christianity, and Buddhism peacefully coexisted. This journey reveals the spiritual map of the Great Silk Road and the grandeur of Turkic Khaganates."
        },
        rating: 4.7,
        itinerary: [
            { day: 1, title: { kz: "Тамғалы-Тас", ru: "Тамгалы-Тас", en: "Tamgaly-Tas" }, desc: { kz: "Іле өзені. Жартастағы бейнелер.", ru: "Поездка к скалам Будд. Пикник на берегу Или.", en: "Trip to Buddha cliffs. Picnic on Ili riverbank." } },
            { day: 2, title: { kz: "Қойлық", ru: "Койлык", en: "Koylyk" }, desc: { kz: "Қойлық қалашығының қазбалары. Тарих.", ru: "Экскурсия в городище Койлык. Осмотр руин храмов.", en: "Koylyk ruins tour. Viewing temple remains." } },
            { day: 3, title: { kz: "Талхиз", ru: "Талхиз", en: "Talkhiz" }, desc: { kz: "Талғар маңындағы көне қалашық.", ru: "Посещение Талхиз. Возвращение в Алматы.", en: "Talkhiz visit. Return to Almaty." } }
        ],
        included: [{ kz: "Транспорт", ru: "Транспорт", en: "Transport" }, { kz: "Гид", ru: "Гид-археолог", en: "Archaeologist guide" }, { kz: "Лагерь", ru: "Лагерь", en: "Camp" }],
        whatToBring: [{ kz: "Су", ru: "Запас воды", en: "Water supply" }, { kz: "Бас киім", ru: "Головной убор", en: "Hat" }],
        contacts: { phone: "+7 (728) 111-22-33", email: "zhetysu@kendala.kz" }
    },
    {
        id: 45,
        title: { kz: "Риддер: Алтай Фрирайды", ru: "Риддер: Фрирайд на Алтае", en: "Ridder: Altai Freeride" },
        region: "East", type: { kz: "Спорт", ru: "Экстрим", en: "Extreme" },
        duration: 4, price: 500, image: "https://images.unsplash.com/photo-1768329773087-4788c59586bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVlcmlkZSUyMHNraWluZyUyMHBvd2RlciUyMHNub3clMjBmb3Jlc3R8ZW58MXx8fHwxNzcwMzA5NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Hard",
        description: { kz: "Шығыстың ең қалың қары мен еркін сырғанау.", ru: "Лучший глубокий снег и дикие склоны Ивановского хребта.", en: "Best deep snow and wild slopes of Ivanovsky Ridge." },
        longDescription: {
            kz: "Риддер (бұрынғы Лениногорск) — шаңғышылар мен сноубордшылардың құпия жұмағы. Мұнда қардың қалыңдығы 2-3 метрге жетеді. Біз 'Проходной' белсенділік аймағында фрирайд ұйымдастырамыз. Трассадан тыс сырғанау, таза қар ('пухляк') және адреналин. Түнде тау баурайындағы жайлы базада қонып, нағыз қысқы ертегіні сезінесіз.",
            ru: "Риддер — мекка для фрирайдеров. Здесь выпадает уникальный 'сухой' снег, который не слипается. Мы организуем заброски на ратраках и снегоходах на вершины Ивановского хребта. Никаких очередей, только вы и бесконечные снежные поля. Вечера в уютных деревянных шале с камином. Тур для тех, кто уверенно стоит на лыжах или сноуборде.",
            en: "Ridder is a mecca for freeriders. Unique 'dry' snow falls here that doesn't clump. We organize snowcat and snowmobile drops to Ivanovsky Ridge peaks. No queues, just you and endless snow fields. Evenings in cozy wooden chalets with fireplaces. For confident skiers or snowboarders."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Келу", ru: "База", en: "Base" }, desc: { kz: "Өскеменнен Риддерге келу. Дайындық.", ru: "Трансфер. Заселение в шале. Инструктаж по лавинам.", en: "Transfer. Chalet check-in. Avalanche briefing." } },
            { day: 2, title: { kz: "Сырғанау", ru: "Фрирайд", en: "Freeride" }, desc: { kz: "Тауға шығу. Еркін сырғанау.", ru: "Весь день на склонах. Заброски на снегоходах.", en: "Full day on slopes. Snowmobile drops." } }
        ],
        included: [{ kz: "Тұру", ru: "Шале", en: "Chalet" }, { kz: "Ратрак", ru: "Заброски", en: "Drops" }, { kz: "Гид", ru: "Инструктор", en: "Instructor" }],
        whatToBring: [{ kz: "Шаңғы", ru: "Лыжи/Сноуборд", en: "Skis/Snowboard" }, { kz: "Лавина жинағы", ru: "Лавинный комплект", en: "Avalanche kit" }],
        contacts: { phone: "+7 (723) 333-44-00", email: "ski@ridder.kz" }
    },
    {
        id: 46,
        title: { kz: "Маңғыстау: Жығылған Сафари", ru: "Мангистау: Сафари Жыгылган", en: "Mangystau: Zhigylgan Safari" },
        region: "West", type: { kz: "Экспедиция", ru: "Бездорожье", en: "Off-road" },
        duration: 7, price: 1250, image: "https://images.unsplash.com/photo-1737207782480-a004a3ae4ffd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGlmZiUyMGNvbGxhcHNlJTIwc2VhJTIwdmlldyUyMHJ1Z2dlZCUyMGNvYXN0fGVufDF8fHx8MTc3MDMwOTYyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Extreme",
        description: { kz: "Құлаған жер мен Каспийдің ең жабайы жағалауы.", ru: "Гигантский провал земли и следы древних львов.", en: "A giant land collapse and ancient lion tracks." },
        longDescription: {
            kz: "Бұл — Маңғыстаудың ең қиын және қызықты бағыты. Жығылған (Құлаған жер) — диаметрі 4 км болатын алып шұңқыр. Мұнда жартастарда ежелгі махайродтардың (қылыш тісті жолбарыстар) ізі қалған. Біз Каспийдің адам аяғы баспаған жағалауларымен жүріп, 'Саура' мен 'Тамшалы' оазистерін көреміз. Шынайы жабайы экспедиция.",
            ru: "Жыгылган — это место катастрофического обвала плато в море. Огромный амфитеатр скал, где среди камней можно найти следы кошек, живших миллионы лет назад. Мы проедем вдоль дикого побережья Каспия к каньону Капымсай. Ночевки под открытым небом, полная автономность и преодоление сложнейших препятствий. Экспедиция для настоящих ценителей офф-роуда.",
            en: "Zhigylgan is the site of a catastrophic plateau collapse into the sea. A vast amphitheater of cliffs where you can find footprints of cats that lived millions of years ago. We'll drive along the wild Caspian coast to Kapymsay Canyon. Open-air nights, total autonomy, and tackling the toughest obstacles. An expedition for true off-road enthusiasts."
        },
        rating: 5.0,
        itinerary: [
            { day: 1, title: { kz: "Жығылған", ru: "Жыгылган", en: "Zhigylgan" }, desc: { kz: "Құлаған жерге түсу. Іздерді іздеу.", ru: "Спуск в провал. Поиск древних следов животных.", en: "Descent into the collapse. Searching for ancient tracks." } },
            { day: 4, title: { kz: "Тамшалы", ru: "Тамшалы", en: "Tamshaly" }, desc: { kz: "Шөлдегі оазис пен сарқырама.", ru: "Посещение оазиса с плачущими скалами.", en: "Visit to the oasis with weeping cliffs." } }
        ],
        included: [{ kz: "4x4", ru: "Подготовленный SUV", en: "Prepped SUV" }, { kz: "Повар", ru: "Повар", en: "Chef" }, { kz: "Спутник", ru: "Спутниковый телефон", en: "Sat-phone" }],
        whatToBring: [{ kz: "Рух", ru: "Стойкость", en: "Stamina" }, { kz: "Су", ru: "Личный запас воды", en: "Personal water" }],
        contacts: { phone: "+7 (729) 555-66-77", email: "wild@kendala.kz" }
    },
    {
        id: 47,
        title: { kz: "Қарағанды: Шахтерлер Мұрасы", ru: "Караганда: Наследие Шахтеров", en: "Karaganda: Mining Heritage" },
        region: "Central", type: { kz: "Мәдени", ru: "Индустриалка", en: "Industrial" },
        duration: 2, price: 180, image: "https://images.unsplash.com/photo-1740156118330-6aec2527305d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMGNvYWwlMjBtaW5lJTIwdHVubmVsfGVufDF8fHx8MTc3MDMxMDAxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Карлаг мұражайы мен оқу шахтасы.", ru: "История Карлага и спуск в учебную угольную шахту.", en: "Karlag history and descent into a training coal mine." },
        longDescription: {
            kz: "Қарағанды — индустриалды қаланың символы. Біз Долинка ауылындағы Карлаг мұражайына барып, тарихтың мұңды беттерін көреміз. Содан кейін нағыз шахтаға (оқу полигоны) түсіп, көмір өндіру процесімен танысамыз. Шахтерлердің өмірі мен қаланың сәулеті. 'Где-где? В Караганде!' тіркесінің мағынасын түсінесіз.",
            ru: "Караганда — город с суровым характером и глубокой историей. Мы посетим музей Карлаг в Долинке — памятник жертвам репрессий. Вторая часть тура — индустриальная: спуск в учебную шахту Горного музея, где вы примерите каску и увидите комбайны в действии. Погружение в атмосферу угольной столицы и знакомство с 'карагандинским гостеприимством'.",
            en: "Karaganda is a city with a rugged character and deep history. We'll visit the Karlag Museum in Dolinka—a monument to repression victims. The second part is industrial: a descent into the Mining Museum's training mine, where you'll wear a helmet and see coal combines in action. Dive into the coal capital's atmosphere."
        },
        rating: 4.6,
        itinerary: [
            { day: 1, title: { kz: "Долинка", ru: "Долинка", en: "Dolinka" }, desc: { kz: "Карлаг мұражайы. Тарихи экскурсия.", ru: "Экскурсия по залам Карлага. История репрессий.", en: "Karlag halls tour. History of repression." } },
            { day: 2, title: { kz: "Шахта", ru: "Шахта", en: "Mine" }, desc: { kz: "Оқу шахтасына түсу. Қаланы аралау.", ru: "Спуск в забой (учебный). Экскурсия по центру города.", en: "Descent into the pit (training). City center tour." } }
        ],
        included: [{ kz: "Гид", ru: "Гид", en: "Guide" }, { kz: "Билет", ru: "Билеты", en: "Tickets" }, { kz: "Трансфер", ru: "Трансфер", en: "Transfer" }],
        whatToBring: [{ kz: "Жылы киім", ru: "Теплая одежда для шахты", en: "Warm clothes for the mine" }],
        contacts: { phone: "+7 (721) 111-22-00", email: "history@karaganda.kz" }
    },
    {
        id: 48,
        title: { kz: "Солтүстік: Есіл Балықшылығы", ru: "Север: Рыбалка на Ишиме", en: "North: Ishim Fishing" },
        region: "North", type: { kz: "Хобби", ru: "Рыбалка", en: "Fishing" },
        duration: 3, price: 250, image: "https://images.unsplash.com/photo-1730276516257-9f2133eb990c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMGZpc2hpbmclMjBib2F0JTIwcGlrZSUyMGNhdGNofGVufDF8fHx8MTc3MDMwOTYyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Medium",
        description: { kz: "Есіл өзеніндегі шортан мен алабұға аулау.", ru: "Трофейная рыбалка на щуку и окуня в диких местах.", en: "Trophy pike and perch fishing in wild spots." },
        longDescription: {
            kz: "Солтүстік Қазақстан — балықшылардың мекені. Есіл өзенінің жабайы иірімдерінде шортан, алабұға және көксерке көп. Біз қайықпен ең жақсы нүктелерге барып, нағыз трофей аулаймыз. Кешке жағада от жағып, балық сорпасын (уха) дайындаймыз. Түнде өзен жағасындағы жайлы лагерьде қонамыз.",
            ru: "Северный Казахстан славится своими реками. Мы отправимся в секретные места на реке Ишим, где клюет крупная щука и судак. Тур включает аренду лодок с мотором, услуги опытных егерей и всё необходимое снаряжение. Вечерняя уха из свежего улова на костре и ночевка в палатках у воды — лучший отдых для настоящего мужчины.",
            en: "North Kazakhstan is famous for its rivers. We'll head to secret spots on the Ishim River, home to large pike and zander. The tour includes motorboat rentals, experienced ranger services, and all necessary gear. Evening fish soup over a campfire and riverside camping—the best reset for a true fisherman."
        },
        rating: 4.5,
        itinerary: [
            { day: 1, title: { kz: "Жол", ru: "Выезд", en: "Departure" }, desc: { kz: "Петропавлдан өзенге жол. Лагерь.", ru: "Трансфер к реке. Установка лагеря. Пробный заброс.", en: "River transfer. Camp setup. First cast." } },
            { day: 2, title: { kz: "Трофей", ru: "Трофей", en: "Trophy" }, desc: { kz: "Күні бойы балық аулау. Уха.", ru: "Рыбалка с лодок. Обед на костре. Вечерний клев.", en: "Full day boat fishing. Campfire lunch. Evening bite." } }
        ],
        included: [{ kz: "Қайық", ru: "Лодки и снасти", en: "Boats & tackle" }, { kz: "Егерь", ru: "Егерь", en: "Ranger" }, { kz: "Тамақ", ru: "Полевое питание", en: "Field meals" }],
        whatToBring: [{ kz: "Етік", ru: "Сапоги", en: "Boots" }, { kz: "Дождевик", ru: "Дождевик", en: "Raincoat" }],
        contacts: { phone: "+7 (715) 222-00-11", email: "fish@kendala.kz" }
    },
    {
        id: 49,
        title: { kz: "Қызғалдақ Экспедициясы", ru: "Экспедиция Тюльпанов", en: "Tulip Expedition" },
        region: "South", type: { kz: "Табиғат", ru: "Ботаника", en: "Botany" },
        duration: 3, price: 300, image: "https://images.unsplash.com/photo-1543862475-eb136770ae9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkJTIwdHVsaXBzJTIwZmllbGQlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzcwMzEwMDE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Easy",
        description: { kz: "Көктемгі даланың қызыл-сары гүлдеуі.", ru: "Поиск диких прародителей всех тюльпанов мира.", en: "Searching for the wild ancestors of all world tulips." },
        longDescription: {
            kz: "Қазақстан — қызғалдақтардың отаны. Сәуір айында Түркістан мен Жамбыл облыстарының далалары қызыл-сары түске боялады. Біз Грейг және Кауфман қызғалдақтарын — әлемдегі барлық қызғалдақтардың арғы аталарын көреміз. Ботаник-гид сізге бұл гүлдердің тарихын айтып береді. Фотографтар үшін сиқырлы уақыт.",
            ru: "Мало кто знает, что родина тюльпанов — не Голландия, а степи Казахстана. В середине апреля мы отправимся в экспедицию, чтобы застать пик цветения диких тюльпанов Грейга и Кауфмана. Мы посетим заповедник Аксу-Жабаглы и предгорья Каратау. Это хрупкая красота, которую нужно увидеть хотя бы раз в жизни. Сопровождение профессионального ботаника.",
            en: "Few know that the tulip's homeland isn't Holland, but the Kazakhstan steppes. In mid-April, we'll lead an expedition to catch the peak bloom of wild Greig's and Kaufman's tulips. Visit Aksu-Zhabagly and the Karatau foothills. A fragile beauty to be seen at least once. Guided by a professional botanist."
        },
        rating: 4.9,
        itinerary: [
            { day: 1, title: { kz: "Дала", ru: "Степь", en: "Steppe" }, desc: { kz: "Шымкент маңындағы алқаптар.", ru: "Выезд в степь. Поиск первых цветов. Макро-съемка.", en: "Steppe drive. Finding first blooms. Macro photography." } },
            { day: 2, title: { kz: "Тау етегі", ru: "Предгорья", en: "Foothills" }, desc: { kz: "Қаратау баурайындағы қызғалдақтар.", ru: "Цветение в предгорьях Каратау. Самые крупные виды.", en: "Karatau foothill blooms. The largest species." } }
        ],
        included: [{ kz: "Гид", ru: "Ботаник", en: "Botanist guide" }, { kz: "Транспорт", ru: "Микроавтобус", en: "Minibus" }, { kz: "Пикник", ru: "Ланч-боксы", en: "Lunch boxes" }],
        whatToBring: [{ kz: "Камера", ru: "Камера", en: "Camera" }, { kz: "Күннен қорғаныс", ru: "Шляпа", en: "Hat" }],
        contacts: { phone: "+7 (701) 222-33-44", email: "tulip@kendala.kz" }
    },
    {
        id: 50,
        title: { kz: "Ұлы Дала Транзиті", ru: "Транзит Великой Степи", en: "Great Steppe Transit" },
        region: "Central", type: { kz: "Гранд-экспедиция", ru: "Гранд-экспедиция", en: "Grand Expedition" },
        duration: 10, price: 1500, image: "https://images.unsplash.com/photo-1599916832684-246e72e24ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTaWxrJTIwUm9hZCUyMEthemFraHN0YW4lMjBsYW5kc2NhcGUlMjBjYW1lbCUyMGNhcmF2YW58ZW58MXx8fHwxNzcwMzEwMDU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        difficulty: "Medium",
        description: { kz: "Қазақстанды батыстан шығысқа дейін кесіп өтіңіз.", ru: "10-дневное путешествие через всю страну: от Каспия до Алтая.", en: "A 10-day journey across the whole country: Caspian to Altai." },
        longDescription: {
            kz: "Бұл — 'Kendala' платформасының ең ауқымды туры. 10 күн ішінде сіз Қазақстанның барлық табиғи зоналарын көресіз: Каспий жағалауы, Маңғыстау шөлі, Оңтүстік қалалары, Орталықтың шексіз даласы және Алтайдың қалың тайгасы. Біз ұшақ, пойыз және жол талғамайтын көліктерді қолданамыз. Елдің бүкіл колориті бір сапарда.",
            ru: "Самый амбициозный маршрут в нашей коллекции. За 10 дней вы пересечете Казахстан с запада на восток. Вы увидите закат на Каспии, марсианские хроники Бозжыры, духовный Туркестан, футуристичную Астану и закончите путь в кедровых лесах Алтая. Это микс из авиаперелетов и джип-туров. Весь Казахстан — от 'А' до 'Я' — за одну экспедицию.",
            en: "The most ambitious route in our collection. Cross Kazakhstan from west to east in 10 days. Witness a Caspian sunset, Martian Bozjyra chronicles, spiritual Turkestan, futuristic Astana, and end in Altai's cedar forests. A mix of flights and 4x4 tours. All of Kazakhstan—from A to Z—in one grand expedition."
        },
        rating: 5.0,
        itinerary: [
            { day: 1, title: { kz: "Каспий", ru: "Каспий", en: "Caspian" }, desc: { kz: "Ақтаудан бастау. Теңіз.", ru: "Старт в Актау. Прогулка по побережью.", en: "Start in Aktau. Coastal stroll." } },
            { day: 5, title: { kz: "Астана", ru: "Астана", en: "Astana" }, desc: { kz: "Елорданың футуристік келбеті.", ru: "Транзит через столицу. Главные монументы.", en: "Capital transit. Main monuments." } },
            { day: 10, title: { kz: "Алтай", ru: "Алтай", en: "Altai" }, desc: { kz: "Шығыстағы қоштасу кеші.", ru: "Финиш в горах Алтая. Торжественный ужин.", en: "Finish in Altai mountains. Gala dinner." } }
        ],
        included: [{ kz: "Логистика", ru: "Все билеты", en: "All tickets" }, { kz: "Отельдер", ru: "Отели 5*", en: "5* Hotels" }, { kz: "VIP Гид", ru: "VIP сопровождение", en: "VIP support" }],
        whatToBring: [{ kz: "Энергия", ru: "Запас энергии", en: "Energy" }, { kz: "Төлқұжат", ru: "Паспорт", en: "Passport" }],
        contacts: { phone: "+7 (700) 000-00-00", email: "grand@kendala.kz" }
    }
];
