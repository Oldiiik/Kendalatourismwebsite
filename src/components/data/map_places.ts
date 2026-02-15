
export interface Place {
  id: string;
  name: { kz: string; ru: string; en: string };
  type: 'sacred' | 'nature' | 'history';
  lat: number;
  lng: number;
  streetViewLat?: number;
  streetViewLng?: number;
  desc: { kz: string; ru: string; en: string };
  image: string;
}

export const PLACES: Place[] = [
  { 
    id: '1', 
    name: { kz: 'Қожа Ахмет Ясауи', ru: 'Мавзолей Ясауи', en: 'Yasawi Mausoleum' },
    type: 'sacred', 
    lat: 43.2974, lng: 68.2707, streetViewLat: 43.2977, streetViewLng: 68.2711, 
    desc: { 
      kz: 'Ортағасырлық сәулет өнерінің жауһары және басты зиярат ету орны.', 
      ru: 'Шедевр средневековой архитектуры и главное место паломничества.', 
      en: 'Masterpiece of medieval architecture and a main pilgrimage site.' 
    }, 
    image: 'https://images.unsplash.com/photo-1579983496340-5e918a9a6b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '2', 
    name: { kz: 'Бекет Ата (Оғланды)', ru: 'Бекет Ата (Огланды)', en: 'Beket Ata (Oglandy)' }, 
    type: 'sacred', 
    lat: 43.5964, lng: 54.0700, streetViewLat: 43.5964, streetViewLng: 54.0700, 
    desc: { 
      kz: 'Маңғыстаудың борлы жартастарына қашалған жерасты мешіті.', 
      ru: 'Подземная мечеть, вырубленная в меловых скалах Мангистау.', 
      en: 'Underground mosque carved into the chalk cliffs of Mangystau.' 
    }, 
    image: 'https://images.unsplash.com/photo-1559795032-282bed91c2db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '3', 
    name: { kz: 'Хазрет Сұлтан', ru: 'Хазрет Султан', en: 'Hazrat Sultan' }, 
    type: 'sacred', 
    lat: 51.1257, lng: 71.4722, streetViewLat: 51.1260, streetViewLng: 71.4725, 
    desc: { 
      kz: 'Орталық Азиядағы ең ірі мешіттердің бірі.', 
      ru: 'Одна из крупнейших мечетей в Центральной Азии.', 
      en: 'One of the largest mosques in Central Asia.' 
    }, 
    image: 'https://images.unsplash.com/photo-1657598329547-edced4a15056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '4', 
    name: { kz: 'Нұр-Астана', ru: 'Нур-Астана', en: 'Nur-Astana' }, 
    type: 'sacred', 
    lat: 51.1275, lng: 71.4178, streetViewLat: 51.1275, streetViewLng: 71.4178, 
    desc: { 
      kz: 'Елорданың заманауи сәулетімен үйлескен мешіт.', 
      ru: 'Мечеть, гармонирующая с современной архитектурой столицы.', 
      en: 'A mosque that harmonizes with the modern architecture of the capital.' 
    }, 
    image: 'https://images.unsplash.com/photo-1704693004804-acf74b339e5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '5', 
    name: { kz: 'Арыстан Баб', ru: 'Арыстан Баб', en: 'Arystan Bab' }, 
    type: 'sacred', 
    lat: 42.8517, lng: 68.2678, streetViewLat: 42.8517, streetViewLng: 68.2678, 
    desc: { 
      kz: 'Қожа Ахмет Ясауидің ұстазына арналған кесене.', 
      ru: 'Мавзолей, посвященный учителю Ходжа Ахмета Ясауи.', 
      en: 'Mausoleum dedicated to the teacher of Khoja Ahmed Yasawi.' 
    }, 
    image: 'https://images.unsplash.com/photo-1579983291208-99ab7827fd5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '6', 
    name: { kz: 'Айша Бибі', ru: 'Айша Биби', en: 'Aisha Bibi' }, 
    type: 'sacred', 
    lat: 42.8336, lng: 71.2069, streetViewLat: 42.8336, streetViewLng: 71.2069, 
    desc: { 
      kz: 'Махаббат пен адалдықтың символы, ежелгі сәулет ескерткіші.', 
      ru: 'Символ любви и верности, памятник древнй архитектуры.', 
      en: 'A symbol of love and loyalty, an ancient architectural monument.' 
    }, 
    image: 'https://images.unsplash.com/photo-1680777015090-134cea6d04f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '7', 
    name: { kz: 'Шақпақ Ата', ru: 'Шакпак Ата', en: 'Shakpak Ata' }, 
    type: 'sacred', 
    lat: 44.4267, lng: 51.1283, streetViewLat: 44.4267, streetViewLng: 51.1283, 
    desc: { 
      kz: 'Жартасқа қашалған ерекше жерасты мешіті.', 
      ru: 'Уникальная подземная мечеть, высеченная в скале.', 
      en: 'Unique underground mosque carved into the rock.' 
    }, 
    image: 'https://images.unsplash.com/photo-1719237555344-edb77093ead4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '8', 
    name: { kz: 'Сұлтан Епе', ru: 'Султан Епе', en: 'Sultan Epe' }, 
    type: 'sacred', 
    lat: 44.4750, lng: 51.0069, streetViewLat: 44.4750, streetViewLng: 51.0069, 
    desc: { 
      kz: 'Теңізшілердің пірі саналатын әулиенің жерасты мешіті.', 
      ru: 'Подземная мечеть святого, считающегося покровителем моряков.', 
      en: 'Underground mosque of the saint considered the patron of sailors.' 
    }, 
    image: 'https://images.unsplash.com/photo-1635182161361-4268855299ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '9', 
    name: { kz: 'Шопан Ата', ru: 'Шопан Ата', en: 'Shopan Ata' }, 
    type: 'sacred', 
    lat: 43.5358, lng: 53.3931, streetViewLat: 43.5358, streetViewLng: 53.3931, 
    desc: { 
      kz: 'Маңғыстаудың ең көне қорымдарының бірі.', 
      ru: 'Один из старейших некрополей Мангистау.', 
      en: 'One of the oldest necropolises in Mangystau.' 
    }, 
    image: 'https://images.unsplash.com/photo-1695453892614-c9471ed6479a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '10', 
    name: { kz: 'Мәшһүр Жүсіп', ru: 'Машхур Жусуп', en: 'Mashkhur Zhusup' }, 
    type: 'sacred', 
    lat: 52.2856, lng: 76.9458, streetViewLat: 52.2856, streetViewLng: 76.9458, 
    desc: { 
      kz: 'Павлодар қаласының інжу-маржаны.', 
      ru: 'Жемчужина города Павлодар.', 
      en: 'The pearl of Pavlodar city.' 
    }, 
    image: 'https://images.unsplash.com/photo-1649583049642-07b18bff4346?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },

  { 
    id: '11', 
    name: { kz: 'Шарын каньоны', ru: 'Чарынский каньон', en: 'Charyn Canyon' }, 
    type: 'nature', 
    lat: 43.3533, lng: 79.0782, streetViewLat: 43.3533, streetViewLng: 79.0782, 
    desc: { 
      kz: 'Қамалдар аңғары — Үлкен каньонмен салыстыруға болатын геологиялық ғажайып.', 
      ru: 'Долина Замков — геологическое чудо, сравнимое с Гранд-Каньоном.', 
      en: 'Valley of Castles — a geological wonder comparable to the Grand Canyon.' 
    }, 
    image: 'https://images.unsplash.com/photo-1677475191981-653bcfcc3cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '12', 
    name: { kz: 'Үлкен Алматы көлі', ru: 'Большое Алматинское озеро', en: 'Big Almaty Lake' }, 
    type: 'nature', 
    lat: 43.0506, lng: 76.9850, streetViewLat: 43.0506, streetViewLng: 76.9850, 
    desc: { 
      kz: 'Іле Алатауы тауларында орналасқан көгілдір альпілік көл.', 
      ru: 'Бирюзовое высокогорное озеро в горах Заилийского Алатау.', 
      en: 'Turquoise alpine lake located in the Trans-Ili Alatau mountains.' 
    }, 
    image: 'https://images.unsplash.com/photo-1543166987-85e4689dfe82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '13', 
    name: { kz: 'Бурабай (Оқжетпес)', ru: 'Боровое (Окжетпес)', en: 'Burabay (Okzhetpes)' }, 
    type: 'nature', 
    lat: 53.0877, lng: 70.3082, streetViewLat: 53.0877, streetViewLng: 70.3082, 
    desc: { 
      kz: 'Қазақстанның Швейцариясы атанған қарағайлы орманды курорт.', 
      ru: 'Курорт с сосновыми лесами, известный как Казахстанская Швейцария.', 
      en: 'Pine forest resort known as the Switzerland of Kazakhstan.' 
    }, 
    image: 'https://images.unsplash.com/photo-1567870648828-7bfe8073c061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '14', 
    name: { kz: 'Көлсай көлдері', ru: 'Кольсайские озера', en: 'Kolsay Lakes' }, 
    type: 'nature', 
    lat: 42.9906, lng: 78.3236, streetViewLat: 42.9906, streetViewLng: 78.3236, 
    desc: { 
      kz: 'Тянь-Шань маржандары деп аталатын тау көлдері.', 
      ru: 'Горные озера, называемые жемчужинами Тянь-Шаня.', 
      en: 'Mountain lakes known as the pearls of the Tian Shan.' 
    }, 
    image: 'https://images.unsplash.com/photo-1751384902322-2a04bbf1e01e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '15', 
    name: { kz: 'Қайыңды көлі', ru: 'Озеро Каинды', en: 'Kaindy Lake' }, 
    type: 'nature', 
    lat: 42.9842, lng: 78.4650, streetViewLat: 42.9842, streetViewLng: 78.4650, 
    desc: { 
      kz: 'Су астындағы орман — ерекше табиғи құбылыс.', 
      ru: 'Затонувший лес — уникальное природное явление.', 
      en: 'Sunken forest — a unique natural phenomenon.' 
    }, 
    image: 'https://images.unsplash.com/photo-1688357166424-9f70f6c661c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '16', 
    name: { kz: 'Бозжыра шатқалы', ru: 'Урочище Бозжыра', en: 'Bozzhyra Tract' }, 
    type: 'nature', 
    lat: 43.4355, lng: 54.0732, streetViewLat: 43.4355, streetViewLng: 54.0732, 
    desc: { 
      kz: 'Марс пейзаждарын еске түсіретін Үстірттің ғажайып жері.', 
      ru: 'Удивительное место на Устюрте, напоминающее марсианские пейзажи.', 
      en: 'Amazing place on the Ustyurt Plateau, resembling Martian landscapes.' 
    }, 
    image: 'https://images.unsplash.com/photo-1632670691242-6c1fa44fb98b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '17', 
    name: { kz: 'Әнші құм', ru: 'Поющий бархан', en: 'Singing Dune' }, 
    type: 'nature', 
    lat: 43.8732, lng: 78.5630, streetViewLat: 43.8732, streetViewLng: 78.5630, 
    desc: { 
      kz: 'Жел соққанда ерекше дыбыс шығаратын құмды төбе.', 
      ru: 'Песчаная дюна, издающая особый звук при ветре.', 
      en: 'Sand dune that produces a distinctive sound when the wind blows.' 
    }, 
    image: 'https://images.unsplash.com/photo-1568615857217-b2be483bfda8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '18', 
    name: { kz: 'Шымбұлақ', ru: 'Шымбулак', en: 'Shymbulak' }, 
    type: 'nature', 
    lat: 43.1287, lng: 77.0805, streetViewLat: 43.1287, streetViewLng: 77.0805, 
    desc: { 
      kz: 'Іле Алатауының бөктеріндегі тау шаңғы курорты.', 
      ru: 'Горнолыжный курорт в предгорьях Заилийского Алатау.', 
      en: 'Ski resort in the foothills of the Trans-Ili Alatau.' 
    }, 
    image: 'https://images.unsplash.com/photo-1636581563864-16c4d8fe34b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '19', 
    name: { kz: 'Ақтау таулары (Алтын-Емел)', ru: 'Горы Актау (Алтын-Эмель)', en: 'Aktau Mountains (Altyn-Emel)' }, 
    type: 'nature', 
    lat: 43.9984, lng: 79.2312, streetViewLat: 43.9984, streetViewLng: 79.2312, 
    desc: { 
      kz: 'Түрлі түсті шөгінді жыныстардан құралған таулар.', 
      ru: 'Горы, образованные из разноцветных осадочных пород.', 
      en: 'Mountains formed from colorful sedimentary rocks.' 
    }, 
    image: 'https://images.unsplash.com/photo-1689994273003-6f5b8faee77e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '20', 
    name: { kz: 'Марқакөл', ru: 'Маркаколь', en: 'Markakol' }, 
    type: 'nature', 
    lat: 48.7466, lng: 85.7483, streetViewLat: 48.7466, streetViewLng: 85.7483, 
    desc: { 
      kz: 'Алтай тауларының інжу-маржаны.', 
      ru: 'Жемчужина Алтайских гор.', 
      en: 'The pearl of the Altai Mountains.' 
    }, 
    image: 'https://images.unsplash.com/photo-1752583649371-8e8c3bfa38ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },

  { 
    id: '21', 
    name: { kz: 'Таңбалы Тас', ru: 'Тамгалы-Тас', en: 'Tamgaly Tas' }, 
    type: 'history', 
    lat: 44.0625, lng: 76.9944, streetViewLat: 44.0625, streetViewLng: 76.9944, 
    desc: { 
      kz: 'Іле өзені бойындағы ежелгі жартас суреттері мен буддалық өнер.', 
      ru: 'Древние наскальные рисунки и буддийское искусство на реке Или.', 
      en: 'Ancient petroglyphs and Buddhist art along the Ili River.' 
    }, 
    image: 'https://images.unsplash.com/photo-1655454666894-a7d16c8f8d04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '22', 
    name: { kz: 'Отырар қалашығы', ru: 'Городище Отырар', en: 'Otrar Settlement' }, 
    type: 'history', 
    lat: 42.8530, lng: 68.3006, streetViewLat: 42.8530, streetViewLng: 68.3006, 
    desc: { 
      kz: 'Ұлы Жібек жолының маңызды сауда орталығы болған ежелгі қала.', 
      ru: 'Древний город, бывший важным торговым центром Шелкового пути.', 
      en: 'Ancient city that was an important trade center of the Silk Road.' 
    }, 
    image: 'https://images.unsplash.com/photo-1601235498531-c503fb66566b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '23', 
    name: { kz: 'Сауран', ru: 'Сауран', en: 'Sauran' }, 
    type: 'history', 
    lat: 43.5133, lng: 67.7700, streetViewLat: 43.5133, streetViewLng: 67.7700, 
    desc: { 
      kz: 'Кірпіштен қаланған қабырғалары жақсы сақталған ортағасырлық қала.', 
      ru: 'Средневековый город с хорошо сохранившимися кирпичными стенами.', 
      en: 'Medieval city with well-preserved brick walls.' 
    }, 
    image: 'https://images.unsplash.com/photo-1690269788681-c8c47fae6753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '24', 
    name: { kz: 'Ақыртас', ru: 'Акыртас', en: 'Akyrtas' }, 
    type: 'history', 
    lat: 42.9619, lng: 71.8028, streetViewLat: 42.9619, streetViewLng: 71.8028, 
    desc: { 
      kz: 'Жұмбақ тас сарай кешені.', 
      ru: 'Загадочный каменный дворцовый комплекс.', 
      en: 'Mysterious stone palace complex.' 
    }, 
    image: 'https://images.unsplash.com/photo-1642030443214-f4dc3dea133f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '25', 
    name: { kz: 'Есік қорғаны', ru: 'Иссыкский курган', en: 'Issyk Kurgan' }, 
    type: 'history', 
    lat: 43.3556, lng: 77.3872, streetViewLat: 43.3556, streetViewLng: 77.3872, 
    desc: { 
      kz: 'Алтын адам табылған әйгілі сақ қорғаны.', 
      ru: 'Знаменитый сакский курган, где был найден Золотой человек.', 
      en: 'Famous Saka mound where the Golden Man was found.' 
    }, 
    image: 'https://images.unsplash.com/photo-1759492755813-357d42023d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '26', 
    name: { kz: 'Жаркент мешіті', ru: 'Жаркентская мечеть', en: 'Zharkent Mosque' }, 
    type: 'history', 
    lat: 44.1628, lng: 79.9983, streetViewLat: 44.1628, streetViewLng: 79.9983, 
    desc: { 
      kz: 'Қытай сәулет өнерінің элементтері бар бірегей ағаш мешіт.', 
      ru: 'Уникальная деревянная мечеть с элементами китайской архитектуры.', 
      en: 'Unique wooden mosque with elements of Chinese architecture.' 
    }, 
    image: 'https://images.unsplash.com/photo-1722931373342-8595b2724855?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '27', 
    name: { kz: 'Сарайшық', ru: 'Сарайшык', en: 'Saraishyk' }, 
    type: 'history', 
    lat: 47.1683, lng: 51.9056, streetViewLat: 47.1683, streetViewLng: 51.9056, 
    desc: { 
      kz: 'Алтын Орданың ежелгі астанасы.', 
      ru: 'Древняя столица Золотой Орды.', 
      en: 'Ancient capital of the Golden Horde.' 
    }, 
    image: 'https://images.unsplash.com/photo-1624807701373-1caecc855614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '28', 
    name: { kz: 'Ботай', ru: 'Ботай', en: 'Botai' }, 
    type: 'history', 
    lat: 53.2000, lng: 67.6000, streetViewLat: 53.2000, streetViewLng: 67.6000, 
    desc: { 
      kz: 'Жылқыны алғаш қолға үйреткен қоныс.', 
      ru: 'Поселение, где впервые была одомашнена лошадь.', 
      en: 'Settlement where the horse was first domesticated.' 
    }, 
    image: 'https://images.unsplash.com/photo-1742201514326-2ba0abea612a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '29', 
    name: { kz: 'Берел қорғандары', ru: 'Берельские курганы', en: 'Berel Mounds' }, 
    type: 'history', 
    lat: 49.2500, lng: 86.4167, streetViewLat: 49.2500, streetViewLng: 86.4167, 
    desc: { 
      kz: 'Сақ патшаларының алтыны табылған алқап.', 
      ru: 'Долина, где найдено золото сакских царей.', 
      en: 'Valley where the gold of Saka kings was found.' 
    }, 
    image: 'https://images.unsplash.com/photo-1695479065605-930003c31abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '30', 
    name: { kz: 'Қызылөзен', ru: 'Кызылозен', en: 'Kyzyl-Ozen' }, 
    type: 'history', 
    lat: 44.1500, lng: 52.1500, streetViewLat: 44.1500, streetViewLng: 52.1500, 
    desc: { 
      kz: 'Маңғыстаудағы ежелгі қалашық орны.', 
      ru: 'Место древнего городища в Мангистау.', 
      en: 'Site of an ancient settlement in Mangystau.' 
    }, 
    image: 'https://images.unsplash.com/photo-1635182161361-4268855299ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },

  { 
    id: '31', 
    name: { kz: 'Алтын-Емел (Қатутау)', ru: 'Алтын-Эмель (Катутау)', en: 'Altyn-Emel (Katutau)' }, 
    type: 'nature', 
    lat: 44.0200, lng: 79.2000, streetViewLat: 44.0200, streetViewLng: 79.2000, 
    desc: { 
      kz: 'Ерекше геологиялық формалары бар ұлттық парк.', 
      ru: 'Национальный парк с уникальными геологическими формами.', 
      en: 'National park with unique geological forms.' 
    }, 
    image: 'https://images.unsplash.com/photo-1602593046951-15df47929b58?q=80&w=1080' 
  },
  { 
    id: '32', 
    name: { kz: 'Түрген сарқырамасы', ru: 'Тургенский водопад', en: 'Turgen Waterfall' }, 
    type: 'nature', 
    lat: 43.3400, lng: 77.5900, streetViewLat: 43.3400, streetViewLng: 77.5900, 
    desc: { 
      kz: 'Іле Алатауының көркем шатқалындағы сарқырама.', 
      ru: 'Водопад в живописном ущелье Заилийского Алатау.', 
      en: 'Waterfall in a picturesque gorge of the Trans-Ili Alatau.' 
    }, 
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1080' 
  },
  { 
    id: '33', 
    name: { kz: 'Бартоғай', ru: 'Бартогай', en: 'Bartogay' }, 
    type: 'nature', 
    lat: 43.3700, lng: 78.5000, streetViewLat: 43.3700, streetViewLng: 78.5000, 
    desc: { 
      kz: 'Шелек өзеніндегі үлкен су қоймасы.', 
      ru: 'Большое водохранилище на реке Чилик.', 
      en: 'Large reservoir on the Chilik River.' 
    }, 
    image: 'https://images.unsplash.com/photo-1666453413944-8fa3fd2ee1ac?q=80&w=1080' 
  },
  { 
    id: '34', 
    name: { kz: 'Асы үстірті', ru: 'Плато Ассы', en: 'Assy Plateau' }, 
    type: 'nature', 
    lat: 43.2200, lng: 77.8500, streetViewLat: 43.2200, streetViewLng: 77.8500, 
    desc: { 
      kz: 'Жайлау мен обсерватория орналасқан үстірт.', 
      ru: 'Плато с пастбищами и обсерваторией.', 
      en: 'Plateau with pastures and an observatory.' 
    }, 
    image: 'https://images.unsplash.com/photo-1699320020146-a8fdfb1702f0?q=80&w=1080' 
  },
  { 
    id: '35', 
    name: { kz: 'Қарақия ойысы', ru: 'Впадина Карагие', en: 'Karagiye Depression' }, 
    type: 'nature', 
    lat: 43.4000, lng: 51.8000, streetViewLat: 43.4000, streetViewLng: 51.8000, 
    desc: { 
      kz: 'Әлемдегі ең терең құрғақ ойыстардың бірі.', 
      ru: 'Одна из самых глубоких сухих впадин в мире.', 
      en: 'One of the deepest dry depressions in the world.' 
    }, 
    image: 'https://images.unsplash.com/photo-1663079969828-843365aba7fd?q=80&w=1080' 
  },
  { 
    id: '36', 
    name: { kz: 'Тұзбайыр', ru: 'Тузбаир', en: 'Tuzbair' }, 
    type: 'nature', 
    lat: 44.0250, lng: 53.2120, streetViewLat: 44.0250, streetViewLng: 53.2120, 
    desc: { 
      kz: 'Аппақ тұзды сор мен борлы жартастар.', 
      ru: 'Белоснежный солончак и меловые скалы.', 
      en: 'White salt marsh and chalk cliffs.' 
    }, 
    image: 'https://images.unsplash.com/photo-1632667322118-78829689568e?q=80&w=1080' 
  },
  { 
    id: '37', 
    name: { kz: 'Қиын-Керіш', ru: 'Киин-Кериш', en: 'Kiin-Kerish' }, 
    type: 'nature', 
    lat: 48.1400, lng: 85.0700, streetViewLat: 48.1400, streetViewLng: 85.0700, 
    desc: { 
      kz: 'Марс пейзажына ұқсайтын сазды шатқал.', 
      ru: 'Глиняный каньон, напоминающий марсианский пейзаж.', 
      en: 'Clay canyon resembling a Martian landscape.' 
    }, 
    image: 'https://images.unsplash.com/photo-1713470089337-24dbedbc00c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '38', 
    name: { kz: 'Сібі көлдері', ru: 'Сибинские озера', en: 'Sibiny Lakes' }, 
    type: 'nature', 
    lat: 49.6000, lng: 82.6000, streetViewLat: 49.6000, streetViewLng: 82.6000, 
    desc: { 
      kz: 'Гранитті таулар арасындағы бес көл.', 
      ru: 'Пять озер среди гранитных гор.', 
      en: 'Five lakes among granite mountains.' 
    }, 
    image: 'https://images.unsplash.com/photo-1596711684348-73238612185d?q=80&w=1080' 
  },
  { 
    id: '39', 
    name: { kz: 'Имантау', ru: 'Имантау', en: 'Imantau' }, 
    type: 'nature', 
    lat: 52.8800, lng: 68.2500, streetViewLat: 52.8800, streetViewLng: 68.2500, 
    desc: { 
      kz: 'Көкшетау қыратындағы әдемі көл.', 
      ru: 'Красивое озеро на Кокшетауской возвышенности.', 
      en: 'Beautiful lake on the Kokshetau Upland.' 
    }, 
    image: 'https://images.unsplash.com/photo-1761829717820-98dff45b8d9f?q=80&w=1080' 
  },
  { 
    id: '40', 
    name: { kz: 'Зеренді', ru: 'Зеренда', en: 'Zerenda' }, 
    type: 'nature', 
    lat: 52.9000, lng: 69.1000, streetViewLat: 52.9000, streetViewLng: 69.1000, 
    desc: { 
      kz: 'Орманмен көмкерілген курорттық аймақ.', 
      ru: 'Курортная зона, окруженная лесом.', 
      en: 'Resort area surrounded by forest.' 
    }, 
    image: 'https://images.unsplash.com/photo-1559678158-dfb59abfe9b8?q=80&w=1080' 
  },
  { 
    id: '41', 
    name: { kz: 'Жошы хан', ru: 'Мавзолей Джучи-хана', en: 'Jochi Khan Mausoleum' }, 
    type: 'history', 
    lat: 48.1610, lng: 67.8180, streetViewLat: 48.1610, streetViewLng: 67.8180, 
    desc: { 
      kz: 'Алтын Орда билеушісінің кесенесі.', 
      ru: 'Мавзолей правителя Золотой Орды.', 
      en: 'Mausoleum of the ruler of the Golden Horde.' 
    }, 
    image: 'https://images.unsplash.com/photo-1695479065605-930003c31abf?q=80&w=1080' 
  },
  { 
    id: '42', 
    name: { kz: 'Алаша хан', ru: 'Мавзолей Алаша-хана', en: 'Alasha Khan Mausoleum' }, 
    type: 'history', 
    lat: 48.1965, lng: 67.8436, streetViewLat: 48.1965, streetViewLng: 67.8436, 
    desc: { 
      kz: 'Қазақ хандарының атасы саналатын тұлға кесенесі.', 
      ru: 'Мавзолей личности, считающейся предком казахских ханов.', 
      en: 'Mausoleum of the figure considered the ancestor of Kazakh khans.' 
    }, 
    image: 'https://images.unsplash.com/photo-1667402945756-4c0991dcf128?q=80&w=1080' 
  },
  { 
    id: '43', 
    name: { kz: 'Домбауыл', ru: 'Домбауыл', en: 'Dombauyl' }, 
    type: 'history', 
    lat: 48.1947, lng: 67.8344, streetViewLat: 48.1947, streetViewLng: 67.8344, 
    desc: { 
      kz: 'Ең көне тас ғимараттардың бірі.', 
      ru: 'Одно из старейих каменных сооружений.', 
      en: 'One of the oldest stone structures.' 
    }, 
    image: 'https://images.unsplash.com/photo-1690269788681-c8c47fae6753?q=80&w=1080' 
  },
  { 
    id: '44', 
    name: { kz: 'Ақмешіт үңгірі', ru: 'Пещера Акмешит', en: 'Akmeshit Cave' }, 
    type: 'sacred', 
    lat: 43.0456, lng: 69.6738, streetViewLat: 43.0456, streetViewLng: 69.6738, 
    desc: { 
      kz: 'Үлкен күмбезді үңгір мешіт.', 
      ru: 'Большая купольная пещерная мечеть.', 
      en: 'Large domed cave mosque.' 
    }, 
    image: 'https://images.unsplash.com/photo-1585814956350-d162515f7169?q=80&w=1080' 
  },
  { 
    id: '45', 
    name: { kz: 'Меркі', ru: 'Мерке', en: 'Merke' }, 
    type: 'history', 
    lat: 42.8700, lng: 73.1800, streetViewLat: 42.8700, streetViewLng: 73.1800, 
    desc: { 
      kz: 'Түркі дәуірінің тас мүсіндері.', 
      ru: 'Каменные изваяния тюркской эпохи.', 
      en: 'Stone statues of the Turkic era.' 
    }, 
    image: 'https://images.unsplash.com/photo-1688583021381-478d092a2b2d?q=80&w=1080' 
  },
  { 
    id: '46', 
    name: { kz: 'Қарқаралы', ru: 'Каркаралы', en: 'Karkaraly' }, 
    type: 'nature', 
    lat: 49.4000, lng: 75.4800, streetViewLat: 49.4000, streetViewLng: 75.4800, 
    desc: { 
      kz: 'Таулар мен қарағайлы ормандар оазисі.', 
      ru: 'Оазис гор и сосновых лесов.', 
      en: 'Oasis of mountains and pine forests.' 
    }, 
    image: 'https://images.unsplash.com/photo-1531258459463-780d6b677a29?q=80&w=1080' 
  },
  { 
    id: '47', 
    name: { kz: 'Ұлытау', ru: 'Улытау', en: 'Ulytau' }, 
    type: 'history', 
    lat: 48.6500, lng: 66.9300, streetViewLat: 48.6500, streetViewLng: 66.9300, 
    desc: { 
      kz: 'Қазақ халқының тарихи орталығы.', 
      ru: 'Исторический центр казахского народа.', 
      en: 'Historical center of the Kazakh people.' 
    }, 
    image: 'https://images.unsplash.com/photo-1637842729600-d256c8960194?q=80&w=1080' 
  },
  { 
    id: '48', 
    name: { kz: 'Байқоңыр', ru: 'Байконур', en: 'Baikonur' }, 
    type: 'history', 
    lat: 45.6200, lng: 63.3100, streetViewLat: 45.6200, streetViewLng: 63.3100, 
    desc: { 
      kz: 'Тұңғыш ғарыш айлағы.', 
      ru: 'Первый космодром.', 
      en: 'The first spaceport.' 
    }, 
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1080' 
  },
  { 
    id: '49', 
    name: { kz: 'Қызыларай', ru: 'Кызыларай', en: 'Kyzylarai' }, 
    type: 'nature', 
    lat: 48.4500, lng: 75.0500, streetViewLat: 48.4500, streetViewLng: 75.0500, 
    desc: { 
      kz: 'Сарыарқаның ең биік нүктесі Ақсораң орналасқан жер.', 
      ru: 'Место, где находится высшая точка Сарыарки - Аксоран.', 
      en: 'Location of the highest point of Saryarka - Aksoran.' 
    }, 
    image: 'https://images.unsplash.com/photo-1568615857217-b2be483bfda8?q=80&w=1080' 
  },
  { 
    id: '50', 
    name: { kz: 'Оқжетпес', ru: 'Окжетпес', en: 'Okzhetpes' }, 
    type: 'nature', 
    lat: 53.0900, lng: 70.2700, streetViewLat: 53.0900, streetViewLng: 70.2700, 
    desc: { 
      kz: 'Бурабайдағы аңызға айналған жартас.', 
      ru: 'Легендарная скала в Боровом.', 
      en: 'Legendary rock in Burabay.' 
    }, 
    image: 'https://images.unsplash.com/photo-1698656627581-6453000dfd07?q=80&w=1080' 
  },
  { 
    id: '51', 
    name: { kz: 'Үкаша ата', ru: 'Укаша Ата', en: 'Ukasha Ata' }, 
    type: 'sacred', 
    lat: 43.6064, lng: 68.3244, streetViewLat: 43.6064, streetViewLng: 68.3244, 
    desc: { 
      kz: 'Тау басындағы қасиетті құдық.', 
      ru: 'Священный колодец на вершине горы.', 
      en: 'Sacred well on the mountain top.' 
    }, 
    image: 'https://images.unsplash.com/photo-1649959468011-82a682132ad6?q=80&w=1080' 
  },
  { 
    id: '52', 
    name: { kz: 'Домалақ ана', ru: 'Домалак Ана', en: 'Domalak Ana' }, 
    type: 'sacred', 
    lat: 42.8797, lng: 69.6644, streetViewLat: 42.8797, streetViewLng: 69.6644, 
    desc: { 
      kz: 'Қасиетті аналардың біріне арналған кесене.', 
      ru: 'Мавзолей, посвященный одной из святых матерей.', 
      en: 'Mausoleum dedicated to one of the holy mothers.' 
    }, 
    image: 'https://images.unsplash.com/photo-1605634563897-4252e1e0734e?q=80&w=1080' 
  },
  { 
    id: '53', 
    name: { kz: 'Қарахан', ru: 'Мавзолей Карахана', en: 'Karakhan Mausoleum' }, 
    type: 'history', 
    lat: 42.8931, lng: 71.3931, streetViewLat: 42.8931, streetViewLng: 71.3931, 
    desc: { 
      kz: 'Қараханидтер дәуірінің ескерткіші.', 
      ru: 'Памятник эпохи Караханидов.', 
      en: 'Monument of the Karakhanid era.' 
    }, 
    image: 'https://images.unsplash.com/photo-1697966986028-8d94de5be69d?q=80&w=1080' 
  },
  { 
    id: '54', 
    name: { kz: 'Тектұрмас', ru: 'Тектурмас', en: 'Tekturmas' }, 
    type: 'sacred', 
    lat: 42.8808, lng: 71.4253, streetViewLat: 42.8808, streetViewLng: 71.4253, 
    desc: { 
      kz: 'Тараз қаласының қамқоршысы саналатын әулие кесенесі.', 
      ru: 'Мавзолей святого, считающегося покровителем города Тараз.', 
      en: 'Mausoleum of the saint considered the patron of Taraz city.' 
    }, 
    image: 'https://images.unsplash.com/photo-1548588627-f978862b85e1?q=80&w=1080' 
  },
  { 
    id: '55', 
    name: { kz: 'Есік көлі', ru: 'Озеро Иссык', en: 'Issyk Lake' }, 
    type: 'nature', 
    lat: 43.2522, lng: 77.4856, streetViewLat: 43.2522, streetViewLng: 77.4856, 
    desc: { 
      kz: 'Тау құшағындағы ақық көз. Тарих пен табиғат үндестігі.', 
      ru: 'Бирюзовое озеро в объятиях гор. Гармония истории и природы.', 
      en: 'Turquoise lake in the embrace of mountains. Harmony of history and nature.' 
    }, 
    image: 'https://images.unsplash.com/photo-1695354271286-cf90d995cee8?q=80&w=1080' 
  },
  { 
    id: '56', 
    name: { kz: 'Хан Тәңірі', ru: 'Хан-Тенгри', en: 'Khan Tengri' }, 
    type: 'nature', 
    lat: 42.2111, lng: 80.1744, streetViewLat: 42.2111, streetViewLng: 80.1744, 
    desc: { 
      kz: 'Тәңірлер мекені. Қазақстанның ең биік нүктесі.', 
      ru: 'Обитель богов. Высочайшая точка Казахстана.', 
      en: 'Abode of gods. The highest point of Kazakhstan.' 
    }, 
    image: 'https://images.unsplash.com/photo-1716835018054-5b13e5ef53b0?q=80&w=1080' 
  },
  { 
    id: '57', 
    name: { kz: 'Баянауыл', ru: 'Баянаул', en: 'Bayanaul' }, 
    type: 'nature', 
    lat: 50.8122, lng: 75.6961, streetViewLat: 50.8122, streetViewLng: 75.6961, 
    desc: { 
      kz: 'Сарыарқаның жасыл аралы. Аңыздар елі.', 
      ru: 'Зеленый остров Сарыарки. Страна легенд.', 
      en: 'Green island of Saryarka. Land of legends.' 
    }, 
    image: 'https://images.unsplash.com/photo-1682017489597-7c4e73cef222?q=80&w=1080' 
  },
  { 
    id: '58', 
    name: { kz: 'Кемпіртас', ru: 'Кемпиртас (Баба-Яга)', en: 'Kempirtas' }, 
    type: 'nature', 
    lat: 50.8461, lng: 75.6894, streetViewLat: 50.8461, streetViewLng: 75.6894, 
    desc: { 
      kz: 'Тасқа айналған ертегі кейіпкері.', 
      ru: 'Сказочный персонаж, превращенный в камень.', 
      en: 'Fairytale character turned into stone.' 
    }, 
    image: 'https://images.unsplash.com/photo-1763307786383-8c1df4489e5c?q=80&w=1080' 
  },
  { 
    id: '59', 
    name: { kz: 'Шайтанкөл', ru: 'Шайтанколь', en: 'Shaitankol' }, 
    type: 'nature', 
    lat: 49.3972, lng: 75.4700, streetViewLat: 49.3972, streetViewLng: 75.4700, 
    desc: { 
      kz: 'Жұмбаққа толы тау көлі.', 
      ru: 'Горное озеро, полное тайн.', 
      en: 'Mountain lake full of mysteries.' 
    }, 
    image: 'https://images.unsplash.com/photo-1568751614142-57ee0d8edc3d?q=80&w=1080' 
  },
  { 
    id: '60', 
    name: { kz: 'Бектау-Ата', ru: 'Бектау-Ата', en: 'Bektau-Ata' }, 
    type: 'nature', 
    lat: 47.4561, lng: 74.7972, streetViewLat: 47.4561, streetViewLng: 74.7972, 
    desc: { 
      kz: 'Жанартаудың сөнбеген ізі.', 
      ru: 'След потухшего вулкана.', 
      en: 'Trace of an extinct volcano.' 
    }, 
    image: 'https://images.unsplash.com/photo-1644033563481-6f23338d7ed1?q=80&w=1080' 
  },
  { 
    id: '61', 
    name: { kz: 'Балқаш көлі', ru: 'Озеро Балхаш', en: 'Lake Balkhash' }, 
    type: 'nature', 
    lat: 46.8450, lng: 74.9800, streetViewLat: 46.8450, streetViewLng: 74.9800, 
    desc: { 
      kz: 'Тұзды және тұщы судың кездесуі.', 
      ru: 'Встреча соленой и пресной воды.', 
      en: 'Meeting of salty and fresh water.' 
    }, 
    image: 'https://images.unsplash.com/photo-1756618686108-90ad289ffed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '62', 
    name: { kz: 'Алакөл', ru: 'Алаколь', en: 'Alakol' }, 
    type: 'nature', 
    lat: 45.8300, lng: 81.5600, streetViewLat: 45.8300, streetViewLng: 81.5600, 
    desc: { 
      kz: 'Емдік суы мен қара малта тасы.', 
      ru: 'Целебная вода и черная галька.', 
      en: 'Healing water and black pebbles.' 
    }, 
    image: 'https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d?q=80&w=1080' 
  },
  { 
    id: '63', 
    name: { kz: 'Рахманов қайнарлары', ru: 'Рахмановские ключи', en: 'Rachmanov Springs' }, 
    type: 'nature', 
    lat: 49.5317, lng: 86.4939, streetViewLat: 49.5317, streetViewLng: 86.4939, 
    desc: { 
      kz: 'Мұзтау етегіндегі шипалы су.', 
      ru: 'Целебная вода у подножия Белухи.', 
      en: 'Healing water at the foot of Belukha.' 
    }, 
    image: 'https://images.unsplash.com/photo-1631741777775-81363741dc73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '64', 
    name: { kz: 'Үстірт қорығы', ru: 'Устюртский заповедник', en: 'Ustyurt Reserve' }, 
    type: 'nature', 
    lat: 43.6167, lng: 54.9167, streetViewLat: 43.6167, streetViewLng: 54.9167, 
    desc: { 
      kz: 'Шөл даланың қатал сұлулығы.', 
      ru: 'Суровая красота пустыни.', 
      en: 'Harsh beauty of the desert.' 
    }, 
    image: 'https://images.unsplash.com/photo-1546887659-08ef60ebcd79?q=80&w=1080' 
  },
  { 
    id: '65', 
    name: { kz: 'Шерқала', ru: 'Шеркала', en: 'Sherkala' }, 
    type: 'nature', 
    lat: 44.2544, lng: 52.0075, streetViewLat: 44.2544, streetViewLng: 52.0075, 
    desc: { 
      kz: 'Даланың күзетшісі. Арыстан тау.', 
      ru: 'Страж степи. Гора-лев.', 
      en: 'Guardian of the steppe. Lion mountain.' 
    }, 
    image: 'https://images.unsplash.com/photo-1707818211919-b6e198a94635?q=80&w=1080' 
  },
  { 
    id: '66', 
    name: { kz: 'Торыш (Шар тастар)', ru: 'Торыш (Долина шаров)', en: 'Torish (Valley of Balls)' }, 
    type: 'nature', 
    lat: 44.3228, lng: 51.5889, streetViewLat: 44.3228, streetViewLng: 51.5889, 
    desc: { 
      kz: 'Торыш алқабының жұмбақ тастары.', 
      ru: 'Загадочные камни долины Торыш.', 
      en: 'Mysterious stones of Torish valley.' 
    }, 
    image: 'https://images.unsplash.com/photo-1752418720187-0374c2c23dcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '67', 
    name: { kz: 'Ақсу-Жабағылы', ru: 'Аксу-Жабаглы', en: 'Aksu-Zhabagly' }, 
    type: 'nature', 
    lat: 42.3300, lng: 70.4400, streetViewLat: 42.3300, streetViewLng: 70.4400, 
    desc: { 
      kz: 'Орталық Азияның ең көне қорығы.', 
      ru: 'Старейший заповедник Центральной Азии.', 
      en: 'The oldest nature reserve in Central Asia.' 
    }, 
    image: 'https://images.unsplash.com/photo-1713043210677-0280f6be5e3c?q=80&w=1080' 
  },
  { 
    id: '68', 
    name: { kz: 'Сайрам-Өгем', ru: 'Сайрам-Угам', en: 'Sairam-Ugam' }, 
    type: 'nature', 
    lat: 42.1100, lng: 70.0600, streetViewLat: 42.1100, streetViewLng: 70.0600, 
    desc: { 
      kz: 'Мың бұлақ өлкесі.', 
      ru: 'Край тысячи родников.', 
      en: 'Land of a thousand springs.' 
    }, 
    image: 'https://images.unsplash.com/photo-1614532175382-334089eedbec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  },
  { 
    id: '69', 
    name: { kz: 'Қатон-Қарағай', ru: 'Катон-Карагай', en: 'Katon-Karagai' }, 
    type: 'nature', 
    lat: 49.1700, lng: 85.6100, streetViewLat: 49.1700, streetViewLng: 85.6100, 
    desc: { 
      kz: 'Алтайдың қасиетті жері.', 
      ru: 'Священная земля Алтая.', 
      en: 'Sacred land of Altai.' 
    }, 
    image: 'https://images.unsplash.com/photo-1644366618473-cbdd2d487715?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' 
  }
];
