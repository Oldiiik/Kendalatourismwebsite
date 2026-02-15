
export interface NewsArticleImage {
    url: string;
    caption: { en: string; ru: string; kz: string };
}

export interface NewsArticleSection {
    heading: { en: string; ru: string; kz: string };
    body: { en: string; ru: string; kz: string };
    image?: NewsArticleImage;
    quote?: { text: { en: string; ru: string; kz: string }; author: string };
    stats?: { label: { en: string; ru: string; kz: string }; value: string }[];
}

export interface LocalizedNewsArticle {
    id: string;
    category: { en: string; ru: string; kz: string };
    date: string;
    title: { en: string; ru: string; kz: string };
    summary: { en: string; ru: string; kz: string };
    content: { en: string; ru: string; kz: string };
    image: string;
    featured?: boolean;
    author: { name: string; role: { en: string; ru: string; kz: string }; avatar: string };
    location: { en: string; ru: string; kz: string };
    readTime: number;
    sections: NewsArticleSection[];
    gallery?: string[];
}

const NEWS_DATABASE: LocalizedNewsArticle[] = [
    {
        id: "news-001",
        category: { en: "Adventure", ru: "Приключения", kz: "Шытырман" },
        date: "Feb 5, 2026",
        title: {
            en: "Charyn Canyon: The Grand Canyon of Central Asia Draws Record Visitors in 2026",
            ru: "Чарынский каньон: Гранд-Каньон Центральной Азии привлёк рекордное число туристов в 2026 году",
            kz: "Шарын шатқалы: Орталық Азияның Гранд-Каньоны 2026 жылы рекордтық сан туристер тартты"
        },
        summary: {
            en: "With new eco-lodges, a glass skywalk, and UNESCO heritage status on the horizon, Charyn Canyon is rapidly becoming the must-visit destination of the decade for adventure travelers worldwide.",
            ru: "С новыми эко-отелями, стеклянным скайволком и перспективой статуса наследия ЮНЕСКО, Чарынский каньон стремительно становится направлением десятилетия для путешественников со всего мира.",
            kz: "Жаңа эко-қонақ үйлер, шыны скайуок және ЮНЕСКО мұрасы мәртебесі болашағымен Шарын шатқалы бүкіл әлемнен келетін саяхатшылар үшін онжылдықтың ең танымал бағытына айналуда."
        },
        content: { en: "", ru: "", kz: "" },
        image: "https://images.unsplash.com/photo-1702920375620-24aa8b8e42f6",
        featured: true,
        author: { name: "Aigerim Suleimenova", role: { en: "Senior Travel Editor", ru: "Главный редактор путешествий", kz: "Саяхат бас редакторы" }, avatar: "" },
        location: { en: "Charyn, Almaty Region", ru: "Чарын, Алматинская область", kz: "Шарын, Алматы облысы" },
        readTime: 12,
        sections: [
            {
                heading: { en: "A Natural Masterpiece 12 Million Years in the Making", ru: "Природный шедевр, создававшийся 12 миллионов лет", kz: "12 миллион жыл бойы қалыптасқан табиғат шедеврі" },
                body: {
                    en: "Standing at the rim of Charyn Canyon, you feel the weight of geological time pressing against your chest. This 154-kilometer gash in the earth's surface, carved by the Charyn River over 12 million years, reveals sedimentary layers painted in ochre, crimson, and burnt sienna — each stripe a chapter in the planet's autobiography. The Valley of Castles, the canyon's most photographed section, presents towering rock formations that resemble Gothic cathedrals, their spires reaching 300 meters toward a sky so blue it hurts to look at.\n\nIn 2026, visitor numbers crossed 850,000 — a 340% increase from just five years ago. But unlike many overtouristed natural wonders, Kazakhstan has approached this surge with remarkable foresight. The new Charyn Masterplan, a $180 million infrastructure investment, prioritizes preservation over profit, implementing strict carrying-capacity limits while dramatically improving the visitor experience.",
                    ru: "Стоя на краю Чарынского каньона, вы чувствуете, как вес геологического времени давит на грудь. Этот 154-километровый разлом в поверхности Земли, вырезанный рекой Чарын за 12 миллионов лет, обнажает осадочные слои, окрашенные в охру, малиновый и жжёную сиену — каждая полоса является главой в автобиографии планеты. Долина Замков, самый фотографируемый участок каньона, представляет величественные скальные образования, напоминающие готические соборы, шпили которых достигают 300 метров.\n\nВ 2026 году число посетителей превысило 850 000 — рост на 340% всего за пять лет. Но в отличие от многих перегруженных туристами природных чудес, Казахстан подошёл к этому всплеску с замечательной дальновидностью. Новый Генплан Чарына — инфраструктурная инвестиция в 180 млн долларов — приоритизирует сохранение над прибылью.",
                    kz: "Шарын шатқалының жиегінде тұрып, геологиялық уақыттың салмағын сезесіз. Шарын өзенінің 12 миллион жыл бойы ойып жасаған жер бетіндегі бұл 154 километрлік жарық охра, қызыл және күйген сиена түстеріне боялған шөгінді қабаттарды көрсетеді — әр жолақ планетаның өмірбаянындағы тарау. Шатқалдың ең көп суретке түсірілетін бөлігі — Сарайлар алқабы — готикалық соборларды еске түсіретін, шыңдары 300 метрге жететін зәулім тау жыныстарын ұсынады.\n\n2026 жылы келушілер саны 850 000-нан асты — бес жыл ішінде 340% өсім. Бірақ туристер тасқынынан зардап шегетін көптеген табиғи ғажайыптардан айырмашылығы, Қазақстан бұл толқынға керемет алдын ала дайындықпен кірісті. 180 миллион долларлық инфрақұрылымдық инвестиция — жаңа Шарын Бас жоспары — пайдадан гөрі сақтауды басымдық етеді."
                },
                image: {
                    url: "https://images.unsplash.com/photo-1752419258215-60ba58a20a74",
                    caption: { en: "The Valley of Castles at golden hour", ru: "Долина Замков в золотой час", kz: "Алтын сағаттағы Сарайлар алқабы" }
                }
            },
            {
                heading: { en: "The Glass Skywalk: Engineering at the Edge", ru: "Стеклянный скайволк: Инженерия на краю", kz: "Шыны скайуок: Жиектегі инженерия" },
                body: {
                    en: "The centerpiece of the new development is the Charyn Skywalk — a 42-meter cantilevered glass platform extending over the canyon's deepest point. Designed by Kazakh architect Marat Aitkenov in collaboration with Danish firm BIG, the structure appears to float in mid-air, offering visitors an unobstructed 270-degree panorama of the canyon system. The platform's triple-layered laminated glass can support 120 visitors simultaneously, and its transparent floor reveals a vertiginous 280-meter drop to the river below.\n\nBut it's not just about the thrill. Embedded in the skywalk are interactive geological displays that use augmented reality to show visitors how the canyon evolved over millennia. Point your phone at any rock layer, and the Charyn AR app reconstructs the environment as it was millions of years ago — complete with the subtropical forests and ancient rivers that once covered this region.",
                    ru: "Центральным элементом нового развития стал скайволк Чарына — 42-метровая консольная стеклянная платформа, выступающая над самой глубокой точкой каньона. Спроектированная казахстанским архитектором Маратом Айткеновым совместно с датской фирмой BIG, конструкция словно парит в воздухе, предлагая посетителям беспрепятственную 270-градусную панораму каньонной системы. Трёхслойное ламинированное стекло платформы выдерживает 120 посетителей одновременно, а прозрачный пол открывает головокружительный 280-метровый обрыв до реки.\n\nНо дело не только в острых ощущениях. В скайволк встроены интерактивные геологические дисплеи, использующие дополненную реальность для демонстрации эволюции каньона. Наведите телефон на любой слой породы — приложение Charyn AR воссоздаст окружающую среду миллионолетней давности.",
                    kz: "Жаңа жобаның орталық элементі — Шарын скайуогі — шатқалдың ең терең нүктесі үстіне созылатын 42 метрлік консольді шыны платформа. Қазақстандық сәулетші Марат Айтқоновтың дандық BIG фирмасымен бірлесіп жасаған жобасы бойынша ауада қалқып тұрғандай көрінетін құрылым келушілерге шатқал жүйесінің 270 градустық кедергісіз панорамасын ұсынады. Платформаның үш қабатты шынысы бір мезгілде 120 келушіні көтере алады, ал мөлдір еденінен 280 метрлік тереңдік көрінеді.\n\nБірақ бұл тек қызу сезім емес. Скайуокке толықтырылған шындықты пайдаланып шатқалдың қалай дамығанын көрсететін интерактивті геологиялық дисплейлер орнатылған."
                },
                stats: [
                    { label: { en: "Canyon Length", ru: "Длина каньона", kz: "Шатқал ұзындығы" }, value: "154 km" },
                    { label: { en: "Visitors 2026", ru: "Посетители 2026", kz: "2026 келушілер" }, value: "850K+" },
                    { label: { en: "Skywalk Height", ru: "Высота скайволка", kz: "Скайуок биіктігі" }, value: "280 m" },
                    { label: { en: "Investment", ru: "Инвестиции", kz: "Инвестициялар" }, value: "$180M" }
                ]
            },
            {
                heading: { en: "Eco-Lodges: Where Luxury Meets the Wild", ru: "Эко-лоджи: Где роскошь встречается с дикой природой", kz: "Эко-қонақүйлер: Сән-салтанат пен жабайы табиғаттың тоғысы" },
                body: {
                    en: "Perhaps the most transformative addition to the Charyn experience is the network of 24 eco-lodges built along the canyon rim. Each unit is a self-contained capsule constructed from locally sourced stone and reclaimed timber, with floor-to-ceiling windows framing the canyon like a living painting. The lodges operate entirely off-grid, powered by solar panels and geothermal heating, with greywater recycling systems that return purified water to the surrounding landscape.\n\nGuests wake to the sound of the wind carving through the canyon — the same wind that has been sculpting these formations since before humans walked the earth. The lodges' restaurant serves a 'geological tasting menu' where each course represents a different era of the canyon's formation, using ingredients sourced from the surrounding steppe ecosystem.",
                    ru: "Пожалуй, самым трансформативным дополнением к опыту Чарына стала сеть из 24 эко-лоджей, построенных вдоль края каньона. Каждый блок — автономная капсула из местного камня и переработанной древесины, с панорамными окнами, обрамляющими каньон словно живую картину. Лоджи работают полностью автономно — на солнечных батареях и геотермальном отоплении с системой рециркуляции воды.\n\nГости просыпаются под звук ветра, прорезающего каньон — того самого ветра, что формировал эти скалы задолго до появления человека. Ресторан лоджей предлагает «геологическое дегустационное меню», где каждое блюдо представляет отдельную эпоху формирования каньона.",
                    kz: "Шарын тәжірибесіне ең трансформациялық қосымша — шатқал жиегі бойымен салынған 24 эко-қонақ үй желісі. Әр блок — жергілікті тас пен қайта өңделген ағаштан жасалған, шатқалды тірі сурет сияқты шеңберлейтін панорамалық терезелері бар автономды капсула. Қонақ үйлер толығымен автономды жұмыс істейді — күн батареялары мен геотермалды жылыту жүйесінде.\n\nҚонақтар шатқал арқылы кесіп өтетін жел дыбысымен оянады — адам жер бетінде жүрмей тұрған кезден бері осы жыныстарды қалыптастырып келе жатқан сол жел."
                },
                image: {
                    url: "https://images.unsplash.com/photo-1533393189657-3a18944e8203",
                    caption: { en: "Charyn eco-lodge at dusk overlooking the canyon", ru: "Эко-лодж Чарына на закате с видом на каньон", kz: "Шатқалға қарайтын Шарын эко-қонақ үйі кешкі уақытта" }
                },
                quote: {
                    text: {
                        en: "We didn't want to build a resort. We wanted to build a way for people to feel the canyon — to sleep beside it, eat from it, and wake up understanding something ancient.",
                        ru: "Мы не хотели строить курорт. Мы хотели построить способ для людей почувствовать каньон — спать рядом с ним, есть из его даров и просыпаться, понимая что-то древнее.",
                        kz: "Біз курорт салғымыз келмеді. Біз адамдарға шатқалды сезуге — оның жанында ұйықтауға, оның сыйларын ішуге және бір ежелгі нәрсені түсініп оянуға мүмкіндік беретін жол салғымыз келді."
                    },
                    author: "Marat Aitkenov, Lead Architect"
                }
            }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1702920375620-24aa8b8e42f6",
            "https://images.unsplash.com/photo-1752419258215-60ba58a20a74",
            "https://images.unsplash.com/photo-1533393189657-3a18944e8203"
        ]
    },
    {
        id: "news-002",
        category: { en: "Culture", ru: "Культура", kz: "Мәдениет" },
        date: "Feb 3, 2026",
        title: {
            en: "The Last Eagle Hunters: How Berkutchi Tradition is Becoming Kazakhstan's Hottest Tourism Experience",
            ru: "Последние беркутчи: Как традиция охоты с орлами становится самым популярным туристическим опытом Казахстана",
            kz: "Соңғы бүркітшілер: Бүркітпен аңшылық дәстүрі қалай Қазақстанның ең танымал туристік тәжірибесіне айналуда"
        },
        summary: {
            en: "In the frost-bitten Altai Mountains, an ancient art form is experiencing an extraordinary revival — and travelers from 47 countries are arriving to witness and participate in the tradition of berkutchi eagle hunting.",
            ru: "В заснеженных горах Алтая древнее искусство переживает необычайное возрождение — путешественники из 47 стран приезжают, чтобы стать свидетелями традиции беркутчи.",
            kz: "Қарлы Алтай тауларында ежелгі өнер ерекше жаңғыруды басынан кешіруде — 47 елден саяхатшылар бүркітшілік дәстүрін көруге келуде."
        },
        content: { en: "", ru: "", kz: "" },
        image: "https://images.unsplash.com/photo-1672939113761-f599cebb325f",
        featured: false,
        author: { name: "Nurlan Orazov", role: { en: "Cultural Correspondent", ru: "Культурный корреспондент", kz: "Мәдениет тілшісі" }, avatar: "" },
        location: { en: "Bayan-Ölgii, Altai", ru: "Баян-Олгий, Алтай", kz: "Баян-Өлгей, Алтай" },
        readTime: 10,
        sections: [
            {
                heading: { en: "4,000 Years of Partnership Between Man and Eagle", ru: "4000 лет партнёрства человека и орла", kz: "Адам мен бүркіттің 4000 жылдық серіктестігі" },
                body: {
                    en: "The berkutchi tradition — the art of hunting with trained golden eagles — dates back over 4,000 years in the mountains of Central Asia. Today, fewer than 250 active berkutchi remain in Kazakhstan, most of them in the remote Altai highlands near the Chinese and Mongolian borders. Each eagle is captured young, trained over years through a bond that defies description, and eventually released back to the wild after a decade of partnership.\n\nWhat was once a dying art confined to elderly practitioners has become Kazakhstan's most compelling cultural tourism experience. The Altai Eagle Festival, held every February, now attracts over 15,000 international visitors who brave temperatures of -30°C to watch these magnificent birds dive from horseback at speeds exceeding 300 km/h.",
                    ru: "Традиция беркутчи — искусство охоты с обученными беркутами — насчитывает более 4000 лет в горах Центральной Азии. Сегодня менее 250 активных беркутчи остаётся в Казахстане, большинство — в высокогорье Алтая близ китайской и монгольской границ. Каждого орла ловят молодым, обучают годами через связь, которую невозможно описать, и в конечном итоге выпускают на волю после десятилетия партнёрства.\n\nТо, что когда-то было умирающим искусством, стало самым притягательным культурным туристическим опытом Казахстана. Алтайский фестиваль орлов, проводимый каждый февраль, привлекает более 15 000 международных посетителей.",
                    kz: "Бүркітшілік дәстүрі — тәрбиеленген бүркіттермен аң аулау өнері — Орталық Азия тауларында 4000 жылдан асам тарихқа ие. Бүгінде Қазақстанда 250-ден аз белсенді бүркітші қалды, олардың көпшілігі Қытай мен Моңғолия шекарасына жақын Алтай таулы өңірінде. Әр бүркітті жас кезінде ұстайды, жылдар бойы сипаттауға келмейтін байланыс арқылы тәрбиелейді және он жылдық серіктестіктен кейін жабайы табиғатқа қайтарады.\n\nБір кездері жоғалып бара жатқан өнер болған нәрсе Қазақстанның ең тартымды мәдени туристік тәжірибесіне айналды. Жыл сайын ақпанда өтетін Алтай бүркіт фестивалі 15 000-нан астам халықаралық келушілерді тартады."
                },
                image: {
                    url: "https://images.unsplash.com/photo-1672939113761-f599cebb325f",
                    caption: { en: "A berkutchi with his golden eagle in the Altai Mountains", ru: "Беркутчи со своим беркутом в Алтайских горах", kz: "Алтай тауларындағы бүркітшінің бүркітімен" }
                },
                stats: [
                    { label: { en: "Active Berkutchi", ru: "Активных беркутчи", kz: "Белсенді бүркітшілер" }, value: "~250" },
                    { label: { en: "Tradition Age", ru: "Возраст традиции", kz: "Дәстүр жасы" }, value: "4,000+" },
                    { label: { en: "Dive Speed", ru: "Скорость пике", kz: "Құлау жылдамдығы" }, value: "300 km/h" },
                    { label: { en: "Festival Visitors", ru: "Посетители фестиваля", kz: "Фестиваль келушілері" }, value: "15K+" }
                ]
            },
            {
                heading: { en: "Immersive Multi-Day Experiences", ru: "Многодневные иммерсивные программы", kz: "Көп күндік иммерсивті бағдарламалар" },
                body: {
                    en: "Tour operators have developed week-long immersive programs where travelers live alongside berkutchi families in traditional winter camps. Participants learn the art of calling the eagle, the rituals of preparation before a hunt, and the centuries-old songs that accompany the training. Evenings are spent in felt-lined yurts drinking kumis (fermented mare's milk) while elders share stories passed down through generations.\n\nThese programs — priced between $3,000 and $8,000 — are consistently sold out months in advance. The revenue has directly improved living standards in remote Altai villages, with berkutchi families earning three to five times the regional average income.",
                    ru: "Туроператоры разработали недельные иммерсивные программы, в которых путешественники живут рядом с семьями беркутчи в традиционных зимних стоянках. Участники изучают искусство призыва орла, ритуалы подготовки к охоте и вековые песни, сопровождающие тренировку. Вечера проходят в юртах за кумысом, пока старейшины рассказывают истории поколений.\n\nЭти программы — стоимостью от $3 000 до $8 000 — стабильно распродаются за месяцы вперёд. Доход напрямую улучшил уровень жизни в отдалённых алтайских селах.",
                    kz: "Тур операторлары саяхатшылардың бүркітші отбасыларымен бірге дәстүрлі қысқы лагерьлерде тұратын бір апталық иммерсивті бағдарламалар жасады. Қатысушылар бүркітті шақыру өнерін, аңшылыққа дайындық рәсімдерін және тәрбиелеуді сүйемелдейтін ғасырлық әндерді үйренеді. Кештер киіз үйде құмыс іше отырып, ақсақалдар ұрпақтан ұрпаққа берілген әңгімелерді бөліседі.\n\nБұл бағдарламалар — $3 000-ден $8 000-ға дейін бағаланған — бірнеше ай бұрын таусылып кетеді."
                },
                quote: {
                    text: {
                        en: "When the eagle returns to your arm after a hunt, you feel something that no technology, no virtual reality can ever replicate. It is a conversation between two wild souls.",
                        ru: "Когда орёл возвращается на вашу руку после охоты, вы чувствуете то, что никакие технологии не смогут повторить. Это разговор двух диких душ.",
                        kz: "Бүркіт аңнан кейін қолыңызға қайтып оралғанда, ешбір технология қайталай алмайтын нәрсені сезесіз. Бұл екі жабайы жанның әңгімесі."
                    },
                    author: "Daulet Beksultan, Master Berkutchi"
                }
            }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1672939113761-f599cebb325f",
            "https://images.unsplash.com/photo-1637842729600-d256c8960194"
        ]
    },
    {
        id: "news-003",
        category: { en: "Luxury", ru: "Люкс", kz: "Люкс" },
        date: "Jan 30, 2026",
        title: {
            en: "Glamping Revolution: Kazakhstan's $200M Investment in Luxury Wilderness Camps",
            ru: "Глэмпинг-революция: Инвестиция Казахстана в $200 млн в люксовые кемпинги дикой природы",
            kz: "Глэмпинг революциясы: Қазақстанның жабайы табиғаттағы люкс кемпингтерге $200 млн инвестициясы"
        },
        summary: {
            en: "From heated yurt suites on the shores of Kolsai Lakes to cliff-edge pods in Mangystau, a new wave of ultra-luxury glamping is redefining what it means to experience the Kazakh wilderness.",
            ru: "От утеплённых юрт-люкс на берегах Кольсайских озёр до капсул на краю скал в Мангистау — новая волна ультра-люкс глэмпинга переосмысливает опыт дикой природы Казахстана.",
            kz: "Көлсай көлдерінің жағасындағы жылы киіз үй-люкстерден Маңғыстаудағы жартас шетіндегі капсулаларға дейін — ультра-люкс глэмпингтің жаңа толқыны қазақ жабайы табиғатын жаңаша ұсынуда."
        },
        content: { en: "", ru: "", kz: "" },
        image: "https://images.unsplash.com/photo-1768363413701-7e84a071d6ec",
        featured: false,
        author: { name: "Madina Karimova", role: { en: "Luxury Travel Analyst", ru: "Аналитик люкс-путешествий", kz: "Люкс саяхат талдаушысы" }, avatar: "" },
        location: { en: "Kolsai Lakes, Almaty Region", ru: "Кольсайские озёра, Алматинская обл.", kz: "Көлсай көлдері, Алматы облысы" },
        readTime: 9,
        sections: [
            {
                heading: { en: "Kolsai: The Pearl of the Tien Shan Gets a Five-Star Makeover", ru: "Кольсай: Жемчужина Тянь-Шаня получает пятизвёздочный ремонт", kz: "Көлсай: Тянь-Шанның маржаны бес жұлдызды жаңару алады" },
                body: {
                    en: "At an altitude of 2,000 meters, nestled between ancient spruce forests and turquoise glacial lakes, sits the new Kolsai Wilderness Resort — the flagship of Kazakhstan's glamping revolution. Each of the 36 heated yurt-suites features handcrafted felt interiors by Kazakh artisans, king-size beds with cashmere throws, private hot tubs fed by natural mountain springs, and panoramic skylights for stargazing from the comfort of your bed.\n\nThe resort operates on a 'zero-trace' philosophy. All structures are designed to be completely dismantled within 48 hours, leaving no permanent footprint. Energy comes from micro-hydro turbines in nearby streams. Waste is composted on-site. Even the Wi-Fi — satellite-based and available only in the communal lodge — is deliberately limited to encourage disconnection.\n\nRates start at $1,200 per night in summer, yet the waitlist stretches nine months ahead. Conde Nast Traveler has already named it one of the world's top 10 eco-luxury experiences for 2026.",
                    ru: "На высоте 2000 метров, среди вековых еловых лесов и бирюзовых ледниковых озёр, расположился новый курорт Kolsai Wilderness — флагман глэмпинг-революции Казахстана. Каждый из 36 отапливаемых юрт-сьютов отличается интерьерами ручной работы из войлока, кроватями размера king-size с кашемировыми пледами, частными джакузи с горными ключами и панорамными окнами в потолке для наблюдения за звёздами.\n\nКурорт работает по философии «нулевого следа». Все конструкции можно полностью демонтировать за 48 часов, не оставив следа. Энергия поступает от микро-ГЭС в ближайших ручьях. Отходы компостируются на месте. Даже Wi-Fi — спутниковый и доступный только в общем лодже — намеренно ограничен.\n\nЦены начинаются от $1 200 за ночь летом, а список ожидания растянулся на девять месяцев. Conde Nast Traveler уже назвал его одним из 10 лучших эко-люкс направлений 2026 года.",
                    kz: "2000 метр биіктікте, ғасырлық шырша ормандары мен көгілдір мұздық көлдер арасында жаңа Kolsai Wilderness курорты орналасқан — Қазақстан глэмпинг революциясының флагманы. 36 жылытылатын киіз үй-люкстің әрқайсысында қазақ шеберлерінің қолмен жасаған кілем интерьерлері, кашемир жамылғылы king-size төсектер, тау бұлақтарымен қамтылған жеке джакузилер және жұлдыздарды бақылауға арналған панорамалық төбе терезелері бар.\n\nКурорт 'нөлдік із' философиясымен жұмыс істейді. Барлық құрылымдар 48 сағат ішінде толығымен бөлшектелетіндей жасалған. Тарифтер жазда бір түн үшін $1 200-ден басталады, ал күту тізімі тоғыз ай алға созылады."
                },
                image: {
                    url: "https://images.unsplash.com/photo-1533393189657-3a18944e8203",
                    caption: { en: "Luxury glamping under the Tien Shan stars", ru: "Люкс-глэмпинг под звёздами Тянь-Шаня", kz: "Тянь-Шань жұлдыздары астындағы люкс глэмпинг" }
                },
                stats: [
                    { label: { en: "Altitude", ru: "Высота", kz: "Биіктік" }, value: "2,000m" },
                    { label: { en: "Yurt Suites", ru: "Юрт-сьютов", kz: "Киіз үй-люкс" }, value: "36" },
                    { label: { en: "Price/Night", ru: "Цена/Ночь", kz: "Баға/Түн" }, value: "$1,200+" },
                    { label: { en: "Waitlist", ru: "Лист ожидания", kz: "Күту тізімі" }, value: "9 months" }
                ]
            }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1768363413701-7e84a071d6ec",
            "https://images.unsplash.com/photo-1533393189657-3a18944e8203"
        ]
    },
    {
        id: "news-004",
        category: { en: "Heritage", ru: "Наследие", kz: "Мұра" },
        date: "Jan 26, 2026",
        title: {
            en: "Turkestan 2026: The Spiritual Capital Unveils $500M Cultural Quarter",
            ru: "Туркестан 2026: Духовная столица открывает культурный квартал стоимостью $500 млн",
            kz: "Түркістан 2026: Рухани астана $500 млн мәдени кварталын ашты"
        },
        summary: {
            en: "The ancient city of Turkestan — home to the Mausoleum of Khoja Ahmed Yasawi — has completed the largest cultural infrastructure project in Central Asian history, transforming into a world-class pilgrimage and tourism destination.",
            ru: "Древний Туркестан — родина мавзолея Ходжа Ахмета Ясауи — завершил крупнейший культурный инфраструктурный проект в истории Центральной Азии.",
            kz: "Қожа Ахмет Ясауи кесенесінің мекені — көне Түркістан — Орталық Азия тарихындағы ең ірі мәдени инфрақұрылым жобасын аяқтады."
        },
        content: { en: "", ru: "", kz: "" },
        image: "https://images.unsplash.com/photo-1749801878037-dade274c2f58",
        featured: false,
        author: { name: "Askar Nurgaliyev", role: { en: "Heritage Correspondent", ru: "Корреспондент по наследию", kz: "Мұра тілшісі" }, avatar: "" },
        location: { en: "Turkestan, Turkestan Region", ru: "Туркестан, Туркестанская область", kz: "Түркістан, Түркістан облысы" },
        readTime: 11,
        sections: [
            {
                heading: { en: "Where 1,500 Years of History Meet Tomorrow's Architecture", ru: "Где 1500 лет истории встречаются с архитектурой завтрашнего дня", kz: "1500 жылдық тарих ертеңгі сәулет өнерімен кездесетін жер" },
                body: {
                    en: "Walking through the new Turkestan Cultural Quarter feels like stepping through a portal between centuries. To your left stands the 14th-century Mausoleum of Khoja Ahmed Yasawi — a Timurid masterpiece and Kazakhstan's first UNESCO World Heritage Site — its turquoise dome still commanding the skyline as it has for 600 years. To your right, the gleaming Caravanserai Contemporary Arts Center, a parametric glass structure whose algorithmically generated façade echoes the geometric patterns of Islamic art.\n\nThe $500 million project, completed after six years of construction, includes a 2,000-seat amphitheater carved into the ancient hillside, an underground Silk Road museum with holographic reconstructions of medieval trade caravans, a traditional artisan bazaar housing 200 craftspeople, and the 'Path of Light' — a 3-kilometer illuminated walkway connecting all major historical sites.\n\nTourism to Turkestan has surged to 2.1 million visitors annually — up from 400,000 in 2020 — with the government projecting 5 million by 2030. The city now rivals Samarkand and Bukhara as Central Asia's premier heritage destination.",
                    ru: "Прогулка по новому Туркестанскому культурному кварталу напоминает путешествие сквозь портал между столетиями. Слева — мавзолей Ходжа Ахмета Ясауи XIV века, тимуридский шедевр и первый объект Всемирного наследия ЮНЕСКО в Казахстане. Справа — сверкающий Центр современного искусства «Каравансарай», параметрическая стеклянная структура, фасад которой повторяет геометрические узоры исламского искусства.\n\nПроект стоимостью $500 млн, завершённый после шести лет строительства, включает амфитеатр на 2000 мест, подземный музей Шёлкового пути с голографическими реконструкциями, ремесленный базар на 200 мастеров и «Путь Света» — 3-километровый освещённый маршрут.\n\nТуризм в Туркестан вырос до 2,1 млн посетителей в год — с 400 000 в 2020 году.",
                    kz: "Жаңа Түркістан мәдени кварталы арқылы серуендеу ғасырлар арасындағы порталдан өткендей сезіледі. Сол жағыңызда XIV ғасырдағы Қожа Ахмет Ясауи кесенесі — Темірлан шеберлігі және Қазақстанның ЮНЕСКО Дүниежүзілік мұра тізіміндегі алғашқы нысаны — оның көгілдір күмбезі 600 жыл бойы аспанға ілесіп тұр. Оң жағыңызда — ислам өнерінің геометриялық өрнектерін қайталайтын параметрлік шыны құрылым — 'Керуен-сарай' заманауи өнер орталығы.\n\n$500 миллион жоба алты жылдық құрылыстан кейін аяқталды: 2000 орындық амфитеатр, голографиялық реконструкциялары бар жерасты Жібек жолы мұражайы, 200 шеберге арналған қолөнер базары және 'Нұр жолы' — 3 километрлік жарықтандырылған маршрут.\n\nТүркістанға туризм жылына 2,1 миллион келушіге дейін өсті — 2020 жылдағы 400 000-нан."
                },
                image: {
                    url: "https://images.unsplash.com/photo-1749801878037-dade274c2f58",
                    caption: { en: "The timeless silhouette of Turkestan's sacred architecture", ru: "Вечный силуэт священной архитектуры Туркестана", kz: "Түркістанның киелі сәулет өнерінің мәңгі силуэті" }
                },
                stats: [
                    { label: { en: "Investment", ru: "Инвестиции", kz: "Инвестициялар" }, value: "$500M" },
                    { label: { en: "Annual Visitors", ru: "Посетителей в год", kz: "Жылдық келушілер" }, value: "2.1M" },
                    { label: { en: "UNESCO Sites", ru: "Объектов ЮНЕСКО", kz: "ЮНЕСКО нысандары" }, value: "3" },
                    { label: { en: "Heritage Age", ru: "Возраст наследия", kz: "Мұра жасы" }, value: "1,500 yr" }
                ]
            }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1749801878037-dade274c2f58",
            "https://images.unsplash.com/photo-1760331696996-e0b7a83ecc98"
        ]
    },
    {
        id: "news-005",
        category: { en: "Nature", ru: "Природа", kz: "Табиғат" },
        date: "Jan 22, 2026",
        title: {
            en: "Snow Leopard Corridors: How Wildlife Tourism is Saving Kazakhstan's Ghost Cat",
            ru: "Коридоры снежного барса: Как фототуризм спасает «Призрак гор» Казахстана",
            kz: "Барыс дәліздері: Жабайы табиғат туризмі Қазақстанның 'Тау елесін' қалай құтқаруда"
        },
        summary: {
            en: "A groundbreaking conservation-tourism model in the Tien Shan mountains has doubled snow leopard sightings while generating $40M annually for local communities — proving that wildlife tourism can be the ultimate conservation tool.",
            ru: "Революционная модель эко-туризма в Тянь-Шане удвоила наблюдения снежных барсов, принося $40 млн в год местным общинам.",
            kz: "Тянь-Шан тауларындағы экотуризмнің жаңашыл моделі барыстарды бақылауды екі есе арттырып, жергілікті қауымдастықтарға жылына $40 млн табыс әкелуде."
        },
        content: { en: "", ru: "", kz: "" },
        image: "https://images.unsplash.com/photo-1760470489946-2cdc2f8baca2",
        featured: false,
        author: { name: "Dr. Zhaniya Kenzhebekova", role: { en: "Wildlife Conservation Editor", ru: "Редактор по охране дикой природы", kz: "Жабайы табиғат қорғау редакторы" }, avatar: "" },
        location: { en: "Tien Shan Mountains", ru: "Горы Тянь-Шань", kz: "Тянь-Шань таулары" },
        readTime: 10,
        sections: [
            {
                heading: { en: "From 120 to 230: The Remarkable Recovery", ru: "От 120 до 230: Замечательное восстановление", kz: "120-ден 230-ға: Керемет қалпына келу" },
                body: {
                    en: "In 2019, Kazakhstan's snow leopard population had dwindled to an estimated 120 individuals — a critically low number for genetic viability. Today, that number stands at approximately 230, one of the most dramatic conservation recoveries in modern wildlife history. The catalyst? An innovative model that directly links tourism revenue to conservation outcomes.\n\nThe 'Ghost Cat Corridor' program, launched in 2022, established a network of 14 monitored wildlife zones across the Tien Shan range. Each zone is managed by local communities who receive a direct percentage of tourism revenue proportional to the number of snow leopard sightings confirmed by camera traps within their territory. This created a powerful financial incentive for communities that previously tolerated — or participated in — poaching.\n\nThe results have been extraordinary. Retaliatory killing of snow leopards by herders has dropped by 94%. Former poachers have become the most dedicated conservationists, their intimate knowledge of leopard behavior making them invaluable guides for wildlife photographers willing to pay premium rates for a glimpse of the world's most elusive big cat.",
                    ru: "В 2019 году популяция снежного барса в Казахстане сократилась до примерно 120 особей — критически низкого числа для генетической жизнеспособности. Сегодня их около 230 — одно из самых впечатляющих восстановлений в истории охраны дикой природы. Катализатор? Инновационная модель, напрямую связывающая доходы от туризма с результатами охраны.\n\nПрограмма «Коридор Призрака», запущенная в 2022 году, создала сеть из 14 контролируемых зон дикой природы в Тянь-Шане. Каждая зона управляется местными общинами, получающими процент от доходов пропорционально количеству подтверждённых камерами-ловушками наблюдений барсов. Это создало мощный финансовый стимул для общин, ранее терпевших браконьерство.\n\nРезультаты оказались невероятными. Убийство барсов пастухами снизилось на 94%. Бывшие браконьеры стали самыми преданными защитниками природы.",
                    kz: "2019 жылы Қазақстандағы барыс популяциясы шамамен 120 дарақа дейін азайды — генетикалық өміршеңдік үшін сыни деңгей. Бүгінде бұл сан шамамен 230-ға жетті — жабайы табиғат тарихындағы ең таңғажайып қалпына келулердің бірі. Катализатор? Туризм табысын тікелей сақтау нәтижелерімен байланыстыратын жаңашыл модель.\n\n2022 жылы іске қосылған 'Елес барыс дәлізі' бағдарламасы Тянь-Шан бойынша 14 бақыланатын жабайы табиғат аймағының желісін құрды. Әр аймақ камера-тұзақтармен расталған барыс бақылаулар санына пропорционалды туризм табысының пайызын алатын жергілікті қауымдастықтар басқарады.\n\nНәтижелер керемет болды. Малшылардың барыстарды өлтіруі 94%-ға төмендеді. Бұрынғы браконьерлер ең адал табиғат қорғаушыларына айналды."
                },
                image: {
                    url: "https://images.unsplash.com/photo-1760470489946-2cdc2f8baca2",
                    caption: { en: "A rare snow leopard captured by camera trap in the Tien Shan", ru: "Редкий снежный барс, запечатлённый камерой-ловушкой в Тянь-Шане", kz: "Тянь-Шандағы камера-тұзақ түсірген сирек барыс" }
                },
                stats: [
                    { label: { en: "Population 2019", ru: "Популяция 2019", kz: "2019 популяция" }, value: "~120" },
                    { label: { en: "Population 2026", ru: "Популяция 2026", kz: "2026 популяция" }, value: "~230" },
                    { label: { en: "Poaching Drop", ru: "Снижение браконьерства", kz: "Браконьерлік төмендеуі" }, value: "-94%" },
                    { label: { en: "Annual Revenue", ru: "Годовой доход", kz: "Жылдық табыс" }, value: "$40M" }
                ]
            }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1760470489946-2cdc2f8baca2",
            "https://images.unsplash.com/photo-1655848137492-400ac53d6db9"
        ]
    },
    {
        id: "news-006",
        category: { en: "Winter", ru: "Зима", kz: "Қыс" },
        date: "Jan 18, 2026",
        title: {
            en: "Shymbulak 2.0: Almaty's Ski Resort Completes $120M Expansion, Eyes 2034 Olympics",
            ru: "Шымбулак 2.0: Горнолыжный курорт Алматы завершил расширение за $120 млн, нацелен на Олимпиаду 2034",
            kz: "Шымбұлақ 2.0: Алматының тау шаңғысы курорты $120 млн кеңейтуді аяқтап, 2034 Олимпиадасына көз тікті"
        },
        summary: {
            en: "With 15 new runs, Central Asia's first eight-person gondola, and a revolutionary indoor-outdoor après-ski village at 3,200 meters, Shymbulak is positioning itself as a serious contender on the world ski circuit.",
            ru: "С 15 новыми трассами, первой в Центральной Азии 8-местной гондолой и инновационной деревней апре-ски на высоте 3200 метров, Шымбулак позиционируется как серьёзный конкурент на мировой лыжной арене.",
            kz: "15 жаңа трасса, Орталық Азиядағы алғашқы сегіз орындық гондола және 3200 метр биіктіктегі инновациялық апре-ски ауылымен Шымбұлақ әлемдік шаңғы аренасындағы маңызды бәсекелеске айналуда."
        },
        content: { en: "", ru: "", kz: "" },
        image: "https://images.unsplash.com/photo-1768672278671-324071c0b3ec",
        featured: false,
        author: { name: "Timur Bekmuratov", role: { en: "Sports & Adventure Editor", ru: "Редактор спорта и приключений", kz: "Спорт және шытырман редакторы" }, avatar: "" },
        location: { en: "Shymbulak, Almaty", ru: "Шымбулак, Алматы", kz: "Шымбұлақ, Алматы" },
        readTime: 8,
        sections: [
            {
                heading: { en: "From Soviet Legacy to World-Class Winter Playground", ru: "От советского наследия к зимней площадке мирового класса", kz: "Кеңестік мұрадан әлемдік деңгейдегі қысқы алаңға дейін" },
                body: {
                    en: "The numbers tell an ambitious story: 15 new runs bringing the total to 40, including Central Asia's first FIS-homologated Super-G course. A $45 million gondola system that whisks skiers from the Medeu skating rink (1,691m) to the peak station (3,200m) in under 12 minutes. And at the summit, the 'Eagle's Nest' — a breathtaking glass-and-timber après-ski village suspended between two ridgelines, offering 360-degree views of the Zailiysky Alatau range.\n\nBut the true revolution is in accessibility. Shymbulak is now just 25 minutes from downtown Almaty via the new mountain metro extension, making it one of the world's most easily accessible alpine resorts from a major city. Lift passes start at just $35/day — a fraction of European resort prices — while the snow quality, thanks to the continental climate, rivals anything in the Alps. With annual snowfall averaging 4 meters and a season running from November to May, Shymbulak offers one of the longest ski seasons in the Northern Hemisphere.\n\nThe resort's Olympic ambitions are serious. Almaty narrowly lost its 2022 Winter Olympics bid and is now preparing a significantly stronger case for 2034, with Shymbulak as the centerpiece alpine venue.",
                    ru: "Цифры рассказывают амбициозную историю: 15 новых трасс (всего 40), включая первую в Центральной Азии трассу Супер-Г с омологацией FIS. Гондольная система за $45 млн доставляет лыжников от катка Медео (1691 м) до вершины (3200 м) за 12 минут. На вершине — «Гнездо орла», головокружительная деревня апре-ски из стекла и дерева с 360-градусным обзором Заилийского Алатау.\n\nНо настоящая революция — в доступности. До Шымбулака теперь 25 минут из центра Алматы по новому горному метро, что делает его одним из самых доступных альпийских курортов в мире. Ски-пассы начинаются от $35/день. При ежегодном снегопаде в 4 метра и сезоне с ноября по май Шымбулак предлагает один из самых длинных лыжных сезонов.\n\nОлимпийские амбиции курорта серьёзны. Алматы с минимальным отрывом проиграл заявку на Зимние Олимпийские игры 2022 года и теперь готовит значительно более сильную заявку на 2034 год.",
                    kz: "Сандар өршіл тарих баяндайды: жалпы санын 40-қа жеткізетін 15 жаңа трасса, оның ішінде Орталық Азиядағы алғашқы FIS Супер-Г трассасы. $45 миллион гондола жүйесі шаңғышыларды Медеу мұз айдынынан (1691 м) шыңға (3200 м) 12 минутта жеткізеді. Шыңда — 'Бүркіт ұясы' — Іле Алатауының 360 градустық панорамасын ұсынатын шыны мен ағаштан жасалған тамаша апре-ски ауылы.\n\nБірақ нағыз революция — қолжетімділікте. Шымбұлаққа енді Алматы орталығынан жаңа тау метросымен бар-жоғы 25 минут жүру керек. Ски-пастар $35/күннен басталады. Жыл сайынғы қар жауу орташа 4 метр және маусым қарашадан мамырға дейін созылатындықтан, Шымбұлақ солтүстік жарты шардағы ең ұзақ шаңғы маусымдарының бірін ұсынады."
                },
                image: {
                    url: "https://images.unsplash.com/photo-1655848137492-400ac53d6db9",
                    caption: { en: "The snow-capped peaks of Zailiysky Alatau above Almaty", ru: "Заснеженные вершины Заилийского Алатау над Алматы", kz: "Алматы үстіндегі Іле Алатауының қарлы шыңдары" }
                },
                stats: [
                    { label: { en: "Total Runs", ru: "Всего трасс", kz: "Жалпы трассалар" }, value: "40" },
                    { label: { en: "Summit", ru: "Вершина", kz: "Шың" }, value: "3,200m" },
                    { label: { en: "Lift Pass", ru: "Ски-пасс", kz: "Ски-пас" }, value: "$35/day" },
                    { label: { en: "Season", ru: "Сезон", kz: "Маусым" }, value: "Nov–May" }
                ],
                quote: {
                    text: {
                        en: "Where else in the world can you have breakfast in a cosmopolitan city of 2 million, ski world-class slopes by 10am, and be back for dinner at one of Central Asia's best restaurants? That's the Almaty advantage.",
                        ru: "Где ещё в мире можно позавтракать в космополитичном 2-миллионном городе, кататься на трассах мирового класса к 10 утра и вернуться к ужину в один из лучших ресторанов Центральной Азии? Это преимущество Алматы.",
                        kz: "Әлемде тағы қайда 2 миллион адамы бар космополиттік қалада таңғы ас ішіп, таңғы 10-ға қарай әлемдік деңгейдегі трассаларда шаңғы тебіп, Орталық Азияның ең үздік мейрамханаларында кешкі асқа қайта оралуға болады?"
                    },
                    author: "Almaty Tourism Board"
                }
            }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1768672278671-324071c0b3ec",
            "https://images.unsplash.com/photo-1655848137492-400ac53d6db9"
        ]
    },
    {
        id: "news-007",
        category: { en: "Space", ru: "Космос", kz: "Ғарыш" },
        date: "Jan 14, 2026",
        title: {
            en: "Baikonur Cosmodrome Opens First-Ever Space Tourism Terminal",
            ru: "Космодром Байконур открывает первый в истории терминал космического туризма",
            kz: "Байқоңыр ғарыш айлағы тарихтағы алғашқы ғарыштық туризм терминалын ашты"
        },
        summary: {
            en: "The world's oldest and most legendary spaceport — the place where humanity first reached the stars — is now welcoming civilian visitors with a $90M experience center, launch viewing platforms, and zero-gravity simulation flights.",
            ru: "Старейший и легендарнейший космодром мира — место, откуда человечество впервые достигло звёзд — теперь принимает гражданских посетителей с центром опыта за $90 млн.",
            kz: "Әлемдегі ең көне және аңызға айналған ғарыш айлағы — адамзат алғаш жұлдыздарға жеткен орын — енді $90 млн тәжірибе орталығымен азаматтық келушілерді қабылдауда."
        },
        content: { en: "", ru: "", kz: "" },
        image: "https://images.unsplash.com/photo-1614642240262-a452c2c11724",
        featured: false,
        author: { name: "Arman Seitov", role: { en: "Space & Technology Editor", ru: "Редактор космоса и технологий", kz: "Ғарыш және технология редакторы" }, avatar: "" },
        location: { en: "Baikonur, Kyzylorda Region", ru: "Байконур, Кызылординская обл.", kz: "Байқоңыр, Қызылорда облысы" },
        readTime: 9,
        sections: [
            {
                heading: { en: "The Birthplace of Space Exploration, Reimagined", ru: "Колыбель космических исследований — переосмысление", kz: "Ғарыш зерттеулерінің бесігі — қайта ойластыру" },
                body: {
                    en: "From this patch of sun-baked Kazakh steppe, Yuri Gagarin became the first human in space on April 12, 1961. Every crewed mission to the International Space Station still launches from the same Gagarin's Start pad. And now, for the first time in its 71-year history, Baikonur is opening its doors to the public.\n\nThe new Baikonur Experience Terminal is a 15,000 square meter facility designed to make space exploration tangible for everyone. Visitors enter through a recreation of the original launch bunker, walking the same corridors Gagarin walked on that historic morning. The centerpiece is a full-scale Soyuz capsule simulator where groups of six can experience a simulated launch sequence — complete with authentic 3.5G forces, mission control audio, and a breathtaking transition from blue sky to the blackness of space.\n\nBut the real draw is the live launch viewing. The terminal includes a climate-controlled observation deck just 6 kilometers from the active launch pads. When a Soyuz or the new Baiterek rocket lifts off, visitors feel the ground shake beneath their feet as 20 million horsepower of thrust tears through the atmosphere. Premium 'Cosmonaut Experience' packages ($15,000) include a private dinner with active cosmonauts, access to the rocket assembly facility, and a guided tour of Gagarin's personal cottage — preserved exactly as he left it in 1961.",
                    ru: "С этого клочка выжженной солнцем казахской степи Юрий Гагарин стал первым человеком в космосе 12 апреля 1961 года. Каждая пилотируемая миссия на МКС до сих пор стартует с той же площадки «Гагаринский старт». И впервые за 71-летнюю историю Байконур открывает двери для публики.\n\nНовый терминал Baikonur Experience — объект площадью 15 000 квадратных метров, созданный, чтобы сделать исследование космоса осязаемым для каждого. Посетители входят через воссозданный стартовый бункер, проходя по тем же коридорам, что и Гагарин в то историческое утро. Центральный элемент — полномасштабный симулятор капсулы «Союз», где группы из 6 человек могут испытать имитацию старта — с подлинными перегрузками 3,5G и переходом от голубого неба к черноте космоса.\n\nНо главная достопримечательность — наблюдение за реальными запусками. Терминал включает климатизированную смотровую площадку в 6 км от активных стартовых площадок. Премиум-пакеты «Опыт космонавта» ($15 000) включают ужин с космонавтами и экскурсию по домику Гагарина — сохранённому точно таким, каким он оставил его в 1961 году.",
                    kz: "Осы күйген қазақ даласынан 1961 жылы 12 сәуірде Юрий Гагарин ғарышқа ұшқан алғашқы адам болды. ХҒС-ге әрбір экипажды миссия әлі де сол «Гагарин старты» алаңынан ұшады. Және 71 жылдық тарихында алғаш рет Байқоңыр есіктерін жұртшылыққа ашуда.\n\nЖаңа Baikonur Experience терминалы — ғарыш зерттеулерін әркім үшін сезінуге мүмкіндік беретін 15 000 шаршы метрлік нысан. Келушілер түпнұсқа ұшыру бункерінің көшірмесінен кіреді, Гагарин сол тарихи таңда жүрген дәліздермен жүреді. Орталық элемент — 6 адамдық топтар 3,5G перегрузкаларымен ұшыру сезімін бастан кешіретін толық масштабты «Союз» капсуласы симуляторы.\n\nБірақ басты тартымдылық — нақты ұшыруларды бақылау. Терминал белсенді ұшыру алаңдарынан бар-жоғы 6 км қашықтықтағы смотровой алаңды қамтиды. Премиум «Ғарышкер тәжірибесі» пакеттері ($15 000) космонавттармен кешкі ас пен Гагариннің 1961 жылы қалдырған күйінде сақталған жеке үйіне экскурсияны қамтиды."
                },
                image: {
                    url: "https://images.unsplash.com/photo-1614642240262-a452c2c11724",
                    caption: { en: "A rocket launch from the historic Baikonur Cosmodrome", ru: "Запуск ракеты с исторического космодрома Байконур", kz: "Тарихи Байқоңыр ғарыш айлағынан зымыран ұшыру" }
                },
                stats: [
                    { label: { en: "Founded", ru: "Основан", kz: "Құрылған" }, value: "1955" },
                    { label: { en: "Total Launches", ru: "Всего запусков", kz: "Жалпы ұшырулар" }, value: "5,000+" },
                    { label: { en: "Terminal Size", ru: "Площадь терминала", kz: "Терминал ауданы" }, value: "15K m²" },
                    { label: { en: "VIP Package", ru: "VIP-пакет", kz: "VIP-пакет" }, value: "$15,000" }
                ]
            }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1614642240262-a452c2c11724"
        ]
    },
    {
        id: "news-008",
        category: { en: "Gastronomy", ru: "Гастрономия", kz: "Гастрономия" },
        date: "Jan 10, 2026",
        title: {
            en: "Nomad Table: Kazakhstan's Culinary Renaissance Puts Steppe Cuisine on the World Map",
            ru: "Стол номада: Кулинарный ренессанс Казахстана выводит степную кухню на мировую карту",
            kz: "Көшпенді дастарханы: Қазақстанның аспаздық ренессансы дала тағамдарын әлем картасына шығаруда"
        },
        summary: {
            en: "From Michelin-worthy restaurants in Almaty to fermented-milk tasting trails in the Altai, Kazakhstan's food scene is experiencing an explosive renaissance that's drawing culinary tourists from around the globe.",
            ru: "От ресторанов уровня Мишлен в Алматы до маршрутов дегустации кисломолочных продуктов на Алтае — гастрономическая сцена Казахстана переживает взрывной ренессанс.",
            kz: "Алматыдағы Мишлен деңгейіндегі мейрамханалардан Алтайдағы сүт тағамдарын дегустациялау маршруттарына дейін — Қазақстанның аспаздық сахнасы жарылыс ренессансты бастан кешіруде."
        },
        content: { en: "", ru: "", kz: "" },
        image: "https://images.unsplash.com/photo-1703820775340-b923e5929371",
        featured: false,
        author: { name: "Kamila Abdullina", role: { en: "Food & Culture Writer", ru: "Автор о еде и культуре", kz: "Тағам және мәдениет жазушысы" }, avatar: "" },
        location: { en: "Almaty & National", ru: "Алматы и по стране", kz: "Алматы және ел бойынша" },
        readTime: 8,
        sections: [
            {
                heading: { en: "Beshbarmak Goes Gourmet: The New Kazakh Kitchen", ru: "Бешбармак становится гурмэ: Новая казахская кухня", kz: "Бешбармақ гурмэ болды: Жаңа қазақ ас үйі" },
                body: {
                    en: "At Tumar — Almaty's most reservations-impossible restaurant — chef Yerbol Zhumadilov is doing something revolutionary with beshbarmak, Kazakhstan's national dish. Traditional boiled horse meat and flat noodles are reimagined as paper-thin carpaccio of 72-hour sous-vide horse tenderloin, served on a nest of saffron-infused hand-pulled noodles, topped with a quail egg and wild thyme foam. The dish costs $45. There's a three-month wait.\n\n\"We are not modernizing for the sake of modernizing,\" Zhumadilov explains. \"Every dish on our menu begins with a conversation with my grandmother. She tells me how things tasted on the steppe 60 years ago. Then I find a way to make people taste that memory.\"\n\nTumar is just one star in a constellation of 40+ new Kazakh fine-dining establishments that have opened across the country since 2024. The movement has a name — 'Steppe Cuisine' — and its core philosophy is the celebration of ingredients that nomadic peoples have relied on for millennia: fermented mare's milk (kumis), dried horse meat (kazy), wild herbs from the Tien Shan, and grains from the northern steppe. International food critics have taken notice. The Financial Times named Almaty one of its top 10 'Emerging Culinary Capitals' for 2026.",
                    ru: "В Tumar — самом труднодоступном для бронирования ресторане Алматы — шеф-повар Ербол Жумадилов совершает революцию с бешбармаком, национальным блюдом Казахстана. Традиционная отварная конина с лапшой переосмыслена как тончайшее карпаччо из 72-часовой конской вырезки су-вид, поданное на гнезде из шафрановой лапши ручной работы с перепелиным яйцом и пеной из дикого тимьяна. Блюдо стоит $45. Ожидание — три месяца.\n\n«Мы модернизируем не ради модернизации,» — объясняет Жумадилов. «Каждое блюдо начинается с разговора с моей бабушкой. Она рассказывает, как еда вкусила в степи 60 лет назад. А я нахожу способ, чтобы люди почувствовали это воспоминание.»\n\nTumar — лишь одна звезда в созвездии из 40+ новых заведений высокой казахской кухни. Движение называется «Степная кухня». Financial Times назвала Алматы одной из 10 «Emerging Culinary Capitals» 2026 года.",
                    kz: "Tumar — Алматының ең брондау мүмкін емес мейрамханасында — аспазшы Ербол Жұмаділов Қазақстанның ұлттық тағамы бешбармақпен революция жасауда. Дәстүрлі пісірілген ет пен жалпақ кеспе 72 сағаттық су-вид ат еті карпаччосы ретінде қайта ойластырылды. Тағамның бағасы $45. Үш ай күту.\n\n«Біз жаңарту үшін жаңартпаймыз,» — деп түсіндіреді Жұмаділов. «Менюдегі әрбір тағам әжеммен әңгімеден басталады. Ол маған 60 жыл бұрын далада тағамның қандай дәмді болғанын айтады. Ал мен адамдарға сол естелікті сезінуге жол табамын.»\n\nTumar — 2024 жылдан бері ел бойынша ашылған 40+ жаңа қазақ жоғары аспаздық мекемелерінің бір ғана жұлдызы. Қозғалыстың аты — «Дала тағамдары». Financial Times Алматыны 2026 жылғы 10 «Emerging Culinary Capitals» тізіміне кіргізді."
                },
                image: {
                    url: "https://images.unsplash.com/photo-1703820775340-b923e5929371",
                    caption: { en: "Traditional Kazakh cuisine reimagined for the modern palate", ru: "Традиционная казахская кухня в современном прочтении", kz: "Заманауи талғамға сай қайта ойластырылған дәстүрлі қазақ тағамдары" }
                },
                stats: [
                    { label: { en: "New Restaurants", ru: "Новых ресторанов", kz: "Жаңа мейрамханалар" }, value: "40+" },
                    { label: { en: "Food Tourism Growth", ru: "Рост гастротуризма", kz: "Гастротуризм өсімі" }, value: "+280%" },
                    { label: { en: "Avg Fine Dining", ru: "Средний счёт", kz: "Орташа чек" }, value: "$45–80" },
                    { label: { en: "FT Ranking", ru: "Рейтинг FT", kz: "FT рейтингі" }, value: "Top 10" }
                ],
                quote: {
                    text: {
                        en: "Every dish on our menu begins with a conversation with my grandmother. She tells me how things tasted on the steppe 60 years ago. Then I find a way to make people taste that memory.",
                        ru: "Каждое блюдо нашего меню начинается с разговора с моей бабушкой. Она рассказывает, как еда имела вкус в степи 60 лет назад. А я нахожу способ передать это воспоминание.",
                        kz: "Менюдегі әрбір тағам әжеммен әңгімеден басталады. Ол маған 60 жыл бұрын далада тағамның қандай дәмді болғанын айтады. Ал мен адамдарға сол естелікті сезінуге жол табамын."
                    },
                    author: "Chef Yerbol Zhumadilov, Tumar"
                }
            }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1703820775340-b923e5929371"
        ]
    },
    {
        id: "news-009",
        category: { en: "Futurism", ru: "Футуризм", kz: "Футуризм" },
        date: "Jan 6, 2026",
        title: {
            en: "Astana 2026: Inside the World's Most Futuristic Capital You've Never Visited",
            ru: "Астана 2026: Внутри самой футуристической столицы мира, которую вы ещё не посещали",
            kz: "Астана 2026: Сіз ешқашан бармаған әлемдегі ең футуристік астана ішінде"
        },
        summary: {
            en: "With its soaring glass towers, the world's largest tent, and a new AI-guided tourism district, Kazakhstan's capital is quietly becoming one of the most architecturally extraordinary cities on Earth.",
            ru: "С устремлёнными ввысь стеклянными башнями, крупнейшим в мире шатром и новым AI-туристическим кварталом столица Казахстана тихо становится одним из самых архитектурно необычных городов Земли.",
            kz: "Аспанға созылған шыны мұнаралары, әлемдегі ең үлкен шатыры және жаңа AI-туристік ауданымен Қазақстан астанасы жер бетіндегі ең архитектуралық ерекше қалалардың біріне тыныш айналуда."
        },
        content: { en: "", ru: "", kz: "" },
        image: "https://images.unsplash.com/photo-1759167631426-a1242a61da7a",
        featured: false,
        author: { name: "Eldar Kairbekov", role: { en: "Architecture & Design Editor", ru: "Редактор архитектуры и дизайна", kz: "Сәулет және дизайн редакторы" }, avatar: "" },
        location: { en: "Astana", ru: "Астана", kz: "Астана" },
        readTime: 10,
        sections: [
            {
                heading: { en: "A City Built from Nothing — Now Rivaling Dubai", ru: "Город, построенный из ничего — теперь конкурирующий с Дубаем", kz: "Жоқтан салынған қала — қазір Дубаймен бәсекелесуде" },
                body: {
                    en: "Thirty years ago, this was frozen steppe. Today, Astana's skyline is a fever dream of architectural ambition — a collection of structures so bold, so unapologetically futuristic, that first-time visitors often spend their first hour simply staring upward with their mouths open.\n\nConsider: the Khan Shatyr Entertainment Center, designed by Norman Foster, is the world's largest tent-like structure — a 150-meter translucent cone containing an indoor beach resort with sand imported from the Maldives. The Bayterek Tower, the city's symbol, is a 97-meter observation platform inspired by a mythological tree of life. And the newly opened EXPO Future Hub has transformed the 2017 World Exposition site into a permanent interactive museum of sustainable technology that Lonely Planet recently called 'the most impressive science museum built this century.'\n\nBut Astana's latest move is its most ambitious: the 'Smart Quarter,' a 200-hectare district where every building, street, and public space is embedded with AI-driven tourism assistance. Multilingual holographic guides appear at intersections. Restaurants adjust their menus in real-time based on visitor preferences learned from opt-in data. Even the park benches are heated in winter and cooled in summer, adjusting automatically based on ambient temperature.\n\nVisitor numbers have crossed 1.5 million international tourists in 2025 — up from just 400,000 in 2019 — and the government is targeting 4 million by 2030.",
                    ru: "Тридцать лет назад здесь была замёрзшая степь. Сегодня горизонт Астаны — горячечный сон архитектурных амбиций. Хан Шатыр — крупнейшая в мире шатровая структура, 150-метровый конус с пляжным курортом и песком с Мальдив. Байтерек — 97-метровая смотровая площадка. А новый EXPO Future Hub превратил площадку Всемирной выставки 2017 года в постоянный интерактивный музей устойчивых технологий.\n\nНо последний ход Астаны — самый амбициозный: «Умный квартал» площадью 200 гектаров, где каждое здание и улица оснащены ИИ-помощниками для туристов. Голографические гиды появляются на перекрёстках. Рестораны адаптируют меню в реальном времени. Даже парковые скамейки обогреваются зимой и охлаждаются летом.\n\nЧисло международных туристов в 2025 году превысило 1,5 млн — с 400 000 в 2019 году.",
                    kz: "Отыз жыл бұрын мұнда тоңған дала болатын. Бүгінде Астананың көкжиегі архитектуралық амбицияның қызу түсі — алғаш келген келушілер алғашқы сағатын жай ғана жоғары қарап ауыз ашып тұрып өткізеді.\n\nНорман Фостер жобалаған Хан Шатыр — әлемдегі ең үлкен шатыр тәрізді құрылым — Мальдивтен әкелінген құммен жабық пляж курорты бар 150 метрлік мөлдір конус. Бәйтерек — 97 метрлік бақылау алаңы. Ал жаңадан ашылған EXPO Future Hub 2017 Дүниежүзілік көрме алаңын тұрақты интерактивті музейге айналдырды.\n\nБірақ Астананың соңғы қадамы — ең өршілі: 200 гектарлық «Ақылды квартал», мұнда әрбір ғимарат пен көше ЖИ туристік көмекшілерімен жабдықталған. Голографиялық гидтер қиылыстарда пайда болады. 2025 жылы халықаралық туристер саны 1,5 миллионнан асты."
                },
                image: {
                    url: "https://images.unsplash.com/photo-1759167631426-a1242a61da7a",
                    caption: { en: "The futuristic skyline of Astana at twilight", ru: "Футуристический горизонт Астаны в сумерках", kz: "Ымырт кезіндегі Астананың футуристік көкжиегі" }
                },
                stats: [
                    { label: { en: "City Age", ru: "Возраст столицы", kz: "Астана жасы" }, value: "28 years" },
                    { label: { en: "Tourists 2025", ru: "Туристы 2025", kz: "2025 туристер" }, value: "1.5M" },
                    { label: { en: "Smart Quarter", ru: "Умный квартал", kz: "Ақылды квартал" }, value: "200 ha" },
                    { label: { en: "Target 2030", ru: "Цель 2030", kz: "2030 мақсат" }, value: "4M" }
                ]
            }
        ],
        gallery: [
            "https://images.unsplash.com/photo-1759167631426-a1242a61da7a"
        ]
    }
];

export const ALL_NEWS = NEWS_DATABASE;
