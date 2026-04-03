// ─────────────────────────────────────────────────────────
// KENDALA — History Page multilingual era data
// Languages: en | ru | kz
// ─────────────────────────────────────────────────────────

export interface EraStat { label: string; value: string; }
export interface SubEra { title: string; period: string; content: string; }
export interface EraDetail {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  stats: EraStat[];
  chapters: { title: string; content: string }[];
  subEras: SubEra[];
  keyFigures: { name: string; role: string; desc: string }[];
  gallery: string[];
}

const ERAS_EN: EraDetail[] = [
  {
    id: 'ancient',
    year: '800 BC — 300 BC',
    title: 'The Saka Era',
    subtitle: 'Golden Warriors of the Steppe',
    description: 'The Saka (Scythian) tribes ruled vast Eurasian steppes as masters of mounted warfare and goldsmithing.',
    longDescription: 'Long before the Silk Road connected civilizations, the Saka — known to the Greeks as Scythians — had already forged a continental empire. They were the first great horse warriors, their composite bows outranging any infantry. Their artisans created the "Animal Style" — fierce predators cast in pure gold that told stories of cosmic struggle. The discovery of the Issyk Kurgan in 1969, containing a warrior prince in armor of 4,000 gold plates, rewrote Kazakhstan\'s ancient history. The "Golden Man" became the nation\'s most powerful symbol, proving the steppe produced civilizations as refined as any in the ancient world.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/golden_man.jpg',
    stats: [
      { label: 'Key Artifact', value: 'The Golden Man (Issyk Kurgan)' },
      { label: 'Territory', value: 'Zhetysu to Black Sea' },
      { label: 'Military Innovation', value: 'Composite Bow & Mounted Archery' },
      { label: 'Artistic Legacy', value: 'Animal Style Goldwork' },
    ],
    chapters: [
      { title: 'The Animal Style', content: 'Saka art is defined by dynamic, intertwined animal figures — snow leopards attacking deer, eagles with spread wings, griffins locked in combat — all cast in pure gold. This was more than decoration; it was a spiritual cosmology. Every golden curve told a story of predator and prey, of the eternal cycle connecting earth, sky, and the underworld. Archaeologists have found thousands of these pieces across the steppe, from Altai to the Danube.' },
      { title: 'Masters of the Horse', content: 'The Saka were among the first peoples in history to master mounted archery, creating a military revolution that would echo for millennia. Their composite bow — built from layers of wood, horn, and sinew — could launch arrows with devastating accuracy at full gallop. This gave them absolute supremacy over infantry-based empires. Persian King Darius I launched a massive campaign against them in 519 BC and failed utterly; the Saka simply retreated into the endless steppe, burning grasslands behind them.' },
      { title: 'The Issyk Kurgan Discovery', content: 'In 1969, archaeologist Kemal Akishev made the discovery of a lifetime near Almaty. Inside a burial mound, he found a warrior prince clad in a suit of 4,000 interlocking gold plates, a 70-centimeter tall golden headdress depicting mountains, horses, and the Tree of Life. The "Golden Man" was approximately 18 years old at death. The intricacy of the armor — each plate individually crafted — pointed to a society of extraordinary wealth and technological sophistication.' },
      { title: 'The Steppe Highway', content: 'Centuries before the Silk Road was formalized, the Saka controlled the proto-trade routes connecting China to the Mediterranean. They traded gold, horses, and furs for Chinese silk and jade. Their mobility made them unconquerable; entire cities packed into wagons could relocate in days. Greek historian Herodotus called them "the most just of all men," noting their complex legal traditions and hospitality codes that would endure in Kazakh culture for millennia.' },
    ],
    subEras: [
      { title: 'Andronovo Culture', period: '2000 BC — 900 BC', content: 'Pre-Saka Bronze Age civilization. Built permanent settlements, domesticated horses, invented the war chariot. Their petroglyphs at Tamgaly (UNESCO site) show some of the oldest astronomical observations in Central Asia.' },
      { title: 'Royal Saka (Saka Tigraxauda)', period: '800 BC — 500 BC', content: 'The "Pointed-Hat Saka" described by Persians. Dominated Zhetysu (Seven Rivers region). Built the largest kurgans and produced the finest goldwork.' },
      { title: 'Wusun Period', period: '200 BC — 400 AD', content: 'Successors to the Saka in southeastern Kazakhstan. Allied with China\'s Han Dynasty against the Xiongnu. Their capital Chigu on Lake Issyk-Kul hosted Chinese ambassadors.' },
    ],
    keyFigures: [
      { name: 'Queen Tomyris', role: 'Massagetae Warrior Queen', desc: 'Defeated and killed Persian Emperor Cyrus the Great in 530 BC. One of the most famous warriors in ancient history.' },
      { name: 'The Golden Man', role: 'Saka Prince (c. 400 BC)', desc: 'Unknown prince found in Issyk Kurgan wearing 4,000 gold plates. Now the national symbol of Kazakhstan.' },
      { name: 'Kemal Akishev', role: 'Archaeologist', desc: 'Discovered the Golden Man in 1969, transforming understanding of Central Asian civilization.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/lake_balkhash.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/summer.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/autumn.jpg',
    ],
  },
  {
    id: 'turkic',
    year: '552 AD — 744 AD',
    title: 'Turkic Khaganates',
    subtitle: 'Empire from China to Byzantium',
    description: 'The Turkic peoples built one of the largest empires in history, stretching from Korea to the gates of Constantinople.',
    longDescription: 'In 552 AD, Bumin Qaghan overthrew the Rouran Khaganate and established the First Turkic Khaganate — an empire that within decades stretched from Manchuria to the Crimea. It was the first steppe empire where we know the rulers by name from their own inscriptions. The Orkhon inscriptions, carved in the 8th century, are the oldest known Turkic writing — a script that would evolve into the modern Kazakh alphabet. The Turkic period introduced the word "Khan" to the world, created a postal system that predated the Mongols, and established the religious tradition of Tengrism.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/tomyris.jpg',
    stats: [
      { label: 'Extent', value: 'Korea to Black Sea' },
      { label: 'Writing', value: 'Old Turkic Script (Orkhon)' },
      { label: 'Religion', value: 'Tengrism (Sky God)' },
      { label: 'Innovation', value: 'Postal Relay System' },
    ],
    chapters: [
      { title: 'Rise of the Blue Turks', content: 'The Ashina clan rose from blacksmiths in the Altai Mountains to masters of half the known world. Their origin myth says they descended from a she-wolf — a symbol that appears throughout Turkic heraldry. Bumin and Istemi Qaghans divided the empire: Bumin ruled the east from Mongolia, Istemi the west from Kazakhstan. Within a generation, Turkic ambassadors were received in both the Chinese Tang court and the Byzantine court in Constantinople.' },
      { title: 'The Orkhon Inscriptions', content: 'Carved into stone monuments along Mongolia\'s Orkhon River in the 8th century, these are the oldest surviving texts in any Turkic language. They tell the story of Bilge Qaghan and Kul Tigin with startling literary power: "I was not born for a nation that had food, I was born for a hungry, naked nation." These inscriptions are now recognized as among the most important historical documents in Central Asian history.' },
      { title: 'Tengrism — The Eternal Blue Sky', content: 'Before Islam reached the steppe, the Turks worshipped Tengri — the Eternal Blue Sky. This was not polytheism but a sophisticated monotheistic system: Tengri was the supreme force, the sky was his body, and every mountain, river, and animal carried divine essence. Shamans communicated between worlds. Many Tengrist concepts — sacred mountains, revered ancestors, respect for nature — survived in Kazakh culture even after Islam arrived, creating a unique spiritual blend.' },
      { title: 'Western Turkic Khaganate', content: 'The western half of the empire, centered in Kazakhstan\'s Zhetysu region, controlled the Silk Road\'s most lucrative stretches. Cities like Suyab (near modern Tokmok) became cosmopolitan centers where Buddhism, Christianity, Zoroastrianism, and Manichaeism coexisted. The Chinese monk Xuanzang passed through in 630 AD and described prosperous cities with "people of many races and languages."' },
    ],
    subEras: [
      { title: 'First Turkic Khaganate', period: '552 — 603 AD', content: 'United empire from China to Persia. Split into Eastern and Western Khaganates after civil war.' },
      { title: 'Western Turkic Khaganate', period: '603 — 658 AD', content: 'Controlled Silk Road through Kazakhstan. Capital at Suyab. Fell to Tang Dynasty expansion.' },
      { title: 'Turgesh Khaganate', period: '699 — 766 AD', content: 'Successor state in Kazakhstan. Minted their own coins. Defended against Arab expansion from the south.' },
    ],
    keyFigures: [
      { name: 'Bumin Qaghan', role: 'Founder', desc: 'Overthrew the Rouran in 552 AD and established the Turkic Khaganate, one of history\'s largest empires.' },
      { name: 'Bilge Qaghan', role: 'Ruler & Lawgiver', desc: 'Commissioned the Orkhon inscriptions. His reign is considered the golden age of Turkic civilization.' },
      { name: 'Istemi Yabgu', role: 'Western Khaganate Ruler', desc: 'Sent ambassadors to Constantinople and controlled the western Silk Road.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abylai_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kenesary_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bogenbay_batyr.webp',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/tomyris.jpg',
    ],
  },
  {
    id: 'silkroad',
    year: '600 AD — 1200 AD',
    title: 'The Silk Road',
    subtitle: 'Crossroads of Civilizations',
    description: 'The Great Silk Road was a web of trade routes. Cities like Otrar, Taraz, and Turkestan became hubs of commerce, science, and faith.',
    longDescription: 'The Silk Road was never a single road. It was a vast network — thousands of branching paths across deserts, mountain passes, and river valleys. Kazakhstan sat at its heart, where the northern and southern routes merged. Cities arose along the rivers: Otrar on the Syr Darya (population 200,000 at its peak), Taraz, Turkestan, Sauran. These were cosmopolitan centers where Chinese merchants, Persian scholars, Indian monks, and Arab traders all did business. Al-Farabi, born in Otrar, became known as the "Second Teacher" after Aristotle. The Mausoleum of Khoja Ahmed Yasawi in Turkestan, commissioned by Timur himself, stands as the era\'s greatest architectural achievement.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/turkestan.jpg',
    stats: [
      { label: 'Major Hubs', value: 'Otrar, Taraz, Turkestan, Sauran' },
      { label: 'Trade Goods', value: 'Silk, Spices, Paper, Horses' },
      { label: 'Religion', value: 'Islam, Tengrism, Buddhism' },
      { label: 'Great Mind', value: 'Al-Farabi (870-950)' },
    ],
    chapters: [
      { title: 'Urban Flourishing', content: 'While nomads roamed the open plains, sophisticated cities rose along the riverbanks. Otrar had running water channeled through ceramic pipes, public baths, and libraries holding thousands of manuscripts. Archaeological evidence shows glass workshops, iron smelters, and cotton mills. The city minted its own coins. At its peak, Otrar was one of the largest cities in Central Asia — a fact that made it a target for Genghis Khan in 1219.' },
      { title: 'Al-Farabi — The Second Teacher', content: 'Abu Nasr al-Farabi (870-950 AD), born in Otrar, became one of the greatest philosophers in human history. Known as the "Second Teacher" (after Aristotle), his works on logic, music theory, political philosophy, and metaphysics influenced thinkers from Ibn Sina to Thomas Aquinas. His concept of the "Virtuous City" — a utopia governed by reason and justice — was centuries ahead of its time.' },
      { title: 'Architecture of Faith', content: 'The Mausoleum of Khoja Ahmed Yasawi in Turkestan is the era\'s masterpiece. Commissioned by Timur (Tamerlane) in 1389, it features the largest existing brick dome in Central Asia (18.2 meters). The turquoise tiles, geometric patterns, and massive scale demonstrate engineering and artistic skill that amazed even Timur\'s court architects. UNESCO designated it a World Heritage Site in 2003.' },
      { title: 'The Caravan Life', content: 'A single caravan could stretch for miles — hundreds of camels loaded with silk, jade, lapis lazuli, paper, and spices. Caravanserais (roadside inns) spaced a day\'s travel apart provided water, food, and protection. These weren\'t just rest stops; they were cultural exchanges where stories, religions, and technologies spread. Buddhism entered China via these routes; Islam spread east through them; papermaking traveled west.' },
    ],
    subEras: [
      { title: 'Karakhanid Period', period: '840 — 1212 AD', content: 'First Turkic dynasty to convert to Islam. Patronized scholars and built monumental architecture. Mahmud Kashgari wrote the first Turkic dictionary during this period.' },
      { title: 'Khwarezmian Empire', period: '1077 — 1231 AD', content: 'Controlled trade from the Caspian to China. Their governor\'s killing of Mongol envoys at Otrar triggered Genghis Khan\'s devastating invasion.' },
    ],
    keyFigures: [
      { name: 'Al-Farabi', role: 'Philosopher (870-950)', desc: 'Born in Otrar. The "Second Teacher" after Aristotle. Revolutionized logic, music, and political philosophy.' },
      { name: 'Khoja Ahmed Yasawi', role: 'Sufi Poet (1093-1166)', desc: 'The most influential Sufi mystic in Central Asia. His poetry spread Islam through the Turkic world.' },
      { name: 'Mahmud Kashgari', role: 'Linguist (1005-1102)', desc: 'Created the first comprehensive Turkic dictionary and a famous map of the Turkic world.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/aisha_bibi.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/al_farabi.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/turkestan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kozy_korpesh.jpg',
    ],
  },
  {
    id: 'khanate',
    year: '1465 AD — 1847 AD',
    title: 'Kazakh Khanate',
    subtitle: 'The Unification of the Clans',
    description: 'Khans Kerei and Janibek led their people to the Chu Valley, founding the first Kazakh state and forging national identity.',
    longDescription: 'The Kazakh Khanate was born from defiance. In the crumbling wake of the Golden Horde, two sultans — Kerei and Janibek — refused submission to the Uzbek khan Abu\'l-Khayr. Around 1465, they led 200,000 followers to the fertile valleys of Zhetysu, declaring themselves "Kazakh" — "Free Warriors." This was the genesis of the Kazakh people as a nation. Over the next four centuries, the Khanate developed a unique legal system (Zheti Zhargy), a three-part tribal confederation (the Zhuzes), and produced legendary warriors who defended against Dzungar genocide. The era ended with Russian colonial absorption, but the identity it forged would ultimately produce an independent nation.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abylai_khan.jpg',
    stats: [
      { label: 'Founded', value: '1465 AD by Kerei & Janibek' },
      { label: 'Legal Code', value: 'Zheti Zhargy (Seven Codes)' },
      { label: 'Structure', value: 'Three Zhuzes (Junior/Middle/Senior)' },
      { label: 'Peak Territory', value: '2.5 million km²' },
    ],
    chapters: [
      { title: 'Birth of the Kazakh Nation', content: 'The word "Kazakh" first appears in historical records around 1456. It means "free," "wanderer," or "adventurer" — fitting for a people who chose freedom over submission. Kerei and Janibek\'s migration to the Chu Valley was not a retreat but a declaration: that the Kazakh people would rather build a new world than submit to a declining one. Within decades, hundreds of thousands joined them.' },
      { title: 'Zheti Zhargy — The Seven Codes', content: 'Khan Tauke (1680-1718) unified the three Zhuzes and codified Kazakh customary law into the Zheti Zhargy — the Seven Codes. This was one of the most sophisticated legal systems in nomadic history, covering everything from murder to marriage to property disputes. Disputes were settled by biys (judges) who memorized the entire legal tradition. The most famous biy, Tole Bi, could recite legal precedents going back centuries in poetic form.' },
      { title: 'The Dzungar Wars', content: 'The 18th century brought catastrophe: the Dzungar Khaganate launched genocidal campaigns against the Kazakhs between 1723 and 1727, a period remembered as "Aktaban Shubryndy" — "The Great Retreat." Hundreds of thousands died. The catastrophe forged the three Zhuzes into a unified fighting force. The legendary batyr (warrior) Bogenbai Khan organized the resistance, and by 1730 the tide had turned. By 1756, the Dzungar Khaganate was itself destroyed by the Qing Dynasty.' },
      { title: 'Abylai Khan — The Last Great Khan', content: 'Abylai Khan (1771-1781) was the last ruler to unite all three Zhuzes under a single leadership. A brilliant diplomat who played Russia, China, and the Dzungars against each other, he maintained Kazakh independence through political genius rather than military power alone. His death marked the beginning of the end — Russian expansion would soon absorb the steppe, piece by piece.' },
    ],
    subEras: [
      { title: 'Early Khanate', period: '1465 — 1600', content: 'Consolidation of Kazakh identity. Expansion across the steppe. Development of the Zhuz system. Conflicts with the Uzbek Khanate and Siberian Khanate.' },
      { title: 'Golden Age', period: '1600 — 1720', content: 'Unification under Khan Tauke. Codification of Zheti Zhargy. Peak of Kazakh cultural and military power. Alliance of three Zhuzes.' },
      { title: 'Russian Encroachment', period: '1720 — 1847', content: 'Dzungar wars, Russian protectorate, gradual absorption. Last Khan Kuchum. Resistance movements led by Kenesary Khan.' },
    ],
    keyFigures: [
      { name: 'Khan Kerei', role: 'Co-Founder (c. 1465)', desc: 'With Janibek, led the founding migration of the Kazakh Khanate. Established the first independent Kazakh state.' },
      { name: 'Abylai Khan', role: 'Great Khan (1771-1781)', desc: 'United all three Zhuzes. Master diplomat who preserved Kazakh independence against Russia, China, and the Dzungars.' },
      { name: 'Kenesary Khan', role: 'Last Khan (1802-1847)', desc: 'Led the last major uprising against Russian colonization. Died in battle. Recognized as a national hero.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abylai_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kenesary_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bogenbay_batyr.webp',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
    ],
  },
  {
    id: 'independence',
    year: '1991 — Present',
    title: 'Independent Kazakhstan',
    subtitle: 'A New Nation Rising',
    description: 'December 16, 1991: a new era. Kazakhstan became sovereign, built a futuristic capital, and became a bridge between East and West.',
    longDescription: 'Kazakhstan declared independence on December 16, 1991, becoming the last Soviet republic to do so. It inherited the world\'s 4th largest nuclear arsenal — and voluntarily gave it up, becoming history\'s most dramatic example of nuclear disarmament. The decision to move the capital from Almaty to Astana (now Nur-Sultan, then renamed back to Astana) was audacious: building a futuristic city from scratch on the frozen steppe. Architects like Norman Foster, Kisho Kurokawa, and Santiago Calatrava created a skyline unlike anything in Central Asia. Today Kazakhstan is the region\'s economic powerhouse, a critical energy supplier, and an emerging tech hub.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bayterek.jpg',
    stats: [
      { label: 'Independence', value: 'December 16, 1991' },
      { label: 'Capital', value: 'Astana (moved 1997)' },
      { label: 'Nuclear Disarmament', value: '1,410 warheads surrendered' },
      { label: 'Economy', value: 'Largest in Central Asia' },
    ],
    chapters: [
      { title: 'Nuclear Disarmament', content: 'In 1991, Kazakhstan inherited 1,410 nuclear warheads — the 4th largest arsenal on Earth. Under intense international pressure and internal debate, the decision was made to give them all up. Every last warhead was transferred to Russia or dismantled. The Semipalatinsk test site was permanently closed. This act of historic renunciation earned Kazakhstan global respect and became the foundation of its identity as a peace broker.' },
      { title: 'Astana — City of Future', content: 'In 1997, the capital was moved from the leafy, mountainous Almaty to a windswept town on the northern steppe. The gamble seemed insane. But within two decades, Astana became a showcase of 21st-century architecture: Norman Foster\'s Khan Shatyr (the world\'s largest tent), the Baiterek tower, the Palace of Peace and Reconciliation. The city is a manifesto in glass and steel — a declaration that a nomadic people could build the future.' },
      { title: 'Economic Transformation', content: 'Oil wealth from the Caspian region\'s Kashagan and Tengiz fields transformed Kazakhstan into Central Asia\'s economic engine. GDP per capita increased 10x from 1991 to 2023. The Astana International Financial Centre operates under English common law. The country attracted over $370 billion in foreign direct investment since independence — more than all other Central Asian countries combined.' },
      { title: 'Cultural Renaissance', content: 'A new generation of Kazakh artists, musicians, and filmmakers is reinterpreting nomadic identity for the digital age. The dombra (traditional two-stringed instrument) is being fused with electronic beats. Films like "The Nomad" and "Tomiris" brought Kazakh history to global audiences. The Qazaq language is experiencing a revival, including a historic shift from Cyrillic to Latin script begun in 2017.' },
    ],
    subEras: [
      { title: 'Transition Period', period: '1991 — 1997', content: 'Economic collapse, hyperinflation, nuclear disarmament. Introduction of the tenge currency. Decision to move the capital.' },
      { title: 'Oil Boom', period: '1997 — 2014', content: 'Massive foreign investment in oil sector. Astana built from scratch. GDP growth averaging 8% annually. Hosting EXPO-2017.' },
      { title: 'Diversification Era', period: '2015 — Present', content: 'Push beyond oil dependency. Digital transformation, fintech growth, renewable energy targets. Latin alphabet transition.' },
    ],
    keyFigures: [
      { name: 'Nursultan Nazarbayev', role: 'First President (1991-2019)', desc: 'Led Kazakhstan through independence and economic transformation. Moved the capital. Oversaw nuclear disarmament.' },
      { name: 'Kassym-Jomart Tokayev', role: 'President (2019-present)', desc: 'Diplomat and polyglot. Pursuing political and economic reforms. Renamed capital back to Astana.' },
      { name: 'Dimash Kudaibergen', role: 'Singer', desc: 'Global vocal phenomenon with a 6-octave range. Made Kazakh culture known worldwide through music.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/spring.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bayterek.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/lake_balkhash.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
    ],
  },
];

// ─── RUSSIAN ─────────────────────────────────────────────
const ERAS_RU: EraDetail[] = [
  {
    id: 'ancient',
    year: '800 до н.э. — 300 до н.э.',
    title: 'Эпоха Саков',
    subtitle: 'Золотые воины степи',
    description: 'Племена саков (скифов) правили обширными евразийскими степями как непревзойдённые мастера конной войны и ювелирного искусства.',
    longDescription: 'Задолго до того, как Шёлковый путь связал цивилизации, саки — известные грекам как скифы — уже создали континентальную империю. Они были первыми великими конными воинами, чьи составные луки превосходили любую пехоту. Их мастера создали «Звериный стиль» — грозных хищников из чистого золота, рассказывавших о космической борьбе. Обнаружение Иссыкского кургана в 1969 году, содержавшего воина-принца в доспехах из 4000 золотых пластин, переписало древнюю историю Казахстана. «Золотой человек» стал самым мощным символом нации, доказав, что степь породила цивилизации не менее утончённые, чем любые другие в древнем мире.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/golden_man.jpg',
    stats: [
      { label: 'Ключевой артефакт', value: 'Золотой человек (Иссыкский курган)' },
      { label: 'Территория', value: 'От Жетысу до Чёрного моря' },
      { label: 'Военные инновации', value: 'Составной лук и конная стрельба' },
      { label: 'Художественное наследие', value: 'Золото «Звериного стиля»' },
    ],
    chapters: [
      { title: 'Звериный стиль', content: 'Искусство саков определяется динамичными, переплетёнными образами животных — снежные барсы, нападающие на оленей, орлы с распростёртыми крыльями, грифоны в поединке — всё отлито из чистого золота. Это было не просто украшение, а духовная космология. Каждый золотой изгиб рассказывал историю хищника и жертвы, вечного цикла, связующего землю, небо и подземный мир. Archaeologists have found thousands of these pieces across the steppe, from Altai to the Danube.' },
      { title: 'Властелины коня', content: 'Саки были одними из первых в истории, кто освоил конную стрельбу из лука, совершив военную революцию, отголоски которой ощущались тысячелетиями. Составной лук — из слоёв дерева, рога и жил — мог посылать стрелы с разрушительной точностью на полном скаку. Это дало им абсолютное превосходство над пехотными армиями. Персидский царь Дарий I предпринял масштабный поход против них в 519 году до н.э. и потерпел полное поражение: саки просто отступили в бескрайнюю степь, выжигая за собой травостой.' },
      { title: 'Открытие Иссыкского кургана', content: 'В 1969 году археолог Кемаль Акишев совершил открытие всей своей жизни близ Алматы. Внутри погребального кургана он обнаружил воина-принца, облачённого в доспехи из 4000 золотых пластин и 70-сантиметровый золотой головной убор с изображением гор, коней и Мирового дерева. «Золотому человеку» было около 18 лет в момент смерти. Сложность доспехов — каждая пластина изготовлена индивидуально — свидетельствовала об обществе с исключительным богатством и технологическим совершенством.' },
      { title: 'Степная магистраль', content: 'За столетия до формализации Шёлкового пути саки контролировали прото-торговые маршруты, связывавшие Китай со Средиземноморьем. Они торговали золотом, лошадьми и мехами в обмен на китайский шёлк и нефрит. Их мобильность делала их непобедимыми; целые городища, собранные в повозки, могли переместиться за несколько дней. Греческий историк Геродот называл их «наисправедливейшими из людей», отмечая их сложные правовые традиции и кодексы гостеприимства, которые сохранятся в казахской культуре на тысячелетия.' },
    ],
    subEras: [
      { title: 'Культура Андронова', period: '2000 до н.э. — 900 до н.э.', content: 'Доскифская цивилизация бронзового века. Строили постоянные поселения, одомашнили лошадей, изобрели боевую колесницу. Их петроглифы в Тамгалы (объект ЮНЕСКО) содержат одни из древнейших астрономических наблюдений в Центральной Азии.' },
      { title: 'Царские саки (Тиграхауда)', period: '800 до н.э. — 500 до н.э.', content: 'Саки «в остроконечных шапках» по описанию персов. Господствовали в Жетысу (область Семиречья). Строили крупнейшие курганы и создавали лучшие золотые изделия.' },
      { title: 'Период усуней', period: '200 до н.э. — 400 н.э.', content: 'Преемники саков в юго-восточном Казахстане. Союзники китайской династии Хань против сюнну. Их столица Чигу на берегу озера Иссык-Куль принимала китайских послов.' },
    ],
    keyFigures: [
      { name: 'Царица Томирис', role: 'Воинствующая царица массагетов', desc: 'Победила и убила персидского императора Кира Великого в 530 году до н.э. Одна из самых известных воительниц в истории древнего мира.' },
      { name: 'Золотой человек', role: 'Принц саков (ок. 400 до н.э.)', desc: 'Неизвестный принц, найденный в Иссыкском кургане в доспехах из 4000 золотых пластин. Ныне — национальный символ Казахстана.' },
      { name: 'Кемаль Акишев', role: 'Археолог', desc: 'Открыл Золотого человека в 1969 году, что коренным образом изменило понимание центральноазиатской цивилизации.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/lake_balkhash.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/summer.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/autumn.jpg',
    ],
  },
  {
    id: 'turkic',
    year: '552 — 744 н.э.',
    title: 'Тюркские каганаты',
    subtitle: 'Империя от Китая до Византии',
    description: 'Тюркские народы создали одну из крупнейших империй в истории, простиравшуюся от Кореи до врат Константинополя.',
    longDescription: 'В 552 году н.э. Бумын-каган сверг Жужанский каганат и основал Первый Тюркский каганат — империю, которая за несколько десятилетий протянулась от Маньчжурии до Крыма. Это была первая степная империя, правители которой известны нам по именам из собственных надписей. Орхонские надписи, высеченные в VIII веке, являются древнейшими известными тюркскими текстами — письмо, которое со временем эволюционирует в современный казахский алфавит. Тюркский период подарил миру слово «хан», создал почтовую систему, предшествовавшую монгольской, и утвердил религиозную традицию тенгрианства.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/tomyris.jpg',
    stats: [
      { label: 'Протяжённость', value: 'От Кореи до Чёрного моря' },
      { label: 'Письменность', value: 'Древнетюркское письмо (Орхон)' },
      { label: 'Религия', value: 'Тенгрианство (Небесный бог)' },
      { label: 'Инновации', value: 'Ямская почтовая система' },
    ],
    chapters: [
      { title: 'Возвышение голубых тюрков', content: 'Клан Ашина поднялся от кузнецов в горах Алтая до властителей половины известного мира. Их миф о происхождении гласит, что они произошли от волчицы — символа, присутствующего в тюркской геральдике повсюду. Бумын и Истеми-каганы разделили империю: Бумын правил востоком из Монголии, Истеми — западом из Казахстана. Уже через поколение тюркских послов принимали как при китайском дворе Тан, так и в Константинополе.' },
      { title: 'Орхонские надписи', content: 'Высеченные на каменных монументах вдоль монгольской реки Орхон в VIII веке, эти тексты являются старейшими из сохранившихся на любом тюркском языке. Они рассказывают историю Бильге-кагана и Кюль-тегина с поразительной литературной силой: «Я родился не для сытого народа, я родился для голодного, нагого народа». Эти надписи признаны одними из важнейших исторических документов Центральной Азии.' },
      { title: 'Тенгрианство — Вечное синее небо', content: 'До прихода ислама в степь тюрки поклонялись Тенгри — Вечному синему небу. Это была не политеистическая, а изощрённая монотеистическая система: Тенгри был высшей силой, небо — его телом, а каждая гора, река и животное несли в себе божественную сущность. Шаманы общались между мирами. Многие тенгрианские представления — священные горы, почитаемые предки, уважение к природе — сохранились в казахской культуре даже после прихода ислама, создав уникальный духовный синтез.' },
      { title: 'Западный тюркский каганат', content: 'Западная половина империи, сосредоточенная в жетысуском регионе Казахстана, контролировала наиболее прибыльные участки Шёлкового пути. Такие города, как Суяб (близ современного Токмока), превратились в космополитические центры, где буддизм, христианство, зороастризм и манихейство мирно сосуществовали. Китайский монах Сюаньцзан проходил здесь в 630 году н.э. и описывал процветающие города с «людьми многих рас и языков».' },
    ],
    subEras: [
      { title: 'Первый тюркский каганат', period: '552 — 603 н.э.', content: 'Единая империя от Китая до Персии. После гражданской войны распалась на Восточный и Западный каганаты.' },
      { title: 'Западный тюркский каганат', period: '603 — 658 н.э.', content: 'Контролировал Шёлковый путь через Казахстан. Столица в Суябе. Пал под натиском экспансии dinastii Тан.' },
      { title: 'Тюргешский каганат', period: '699 — 766 н.э.', content: 'Государство-преемник в Казахстане. Чеканило собственные монеты. Отражало арабскую экспансию с юга.' },
    ],
    keyFigures: [
      { name: 'Бумын-каган', role: 'Основатель', desc: 'Сверг жужаней в 552 году н.э. и основал Тюркский каганат — одну из крупнейших империй в истории.' },
      { name: 'Бильге-каган', role: 'Правитель и законодатель', desc: 'Заказал создание Орхонских надписей. Его правление считается золотым веком тюркской цивилизации.' },
      { name: 'Истеми-ябгу', role: 'Правитель Западного каганата', desc: 'Отправлял послов в Константинополь и контролировал западный Шёлковый путь.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abylai_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kenesary_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bogenbay_batyr.webp',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/tomyris.jpg',
    ],
  },
  {
    id: 'silkroad',
    year: '600 — 1200 н.э.',
    title: 'Великий шёлковый путь',
    subtitle: 'Перекрёсток цивилизаций',
    description: 'Великий Шёлковый путь представлял собой сеть торговых маршрутов. Города Отрар, Тараз и Туркестан стали центрами торговли, науки и веры.',
    longDescription: 'Шёлковый путь никогда не был единой дорогой. Это была грандиозная сеть — тысячи ответвлений через пустыни, горные перевалы и речные долины. Казахстан находился в самом её сердце, где сходились северный и южный маршруты. Вдоль рек выросли города: Отрар на Сырдарье (население 200 000 человек на пике расцвета), Тараз, Туркестан, Сауран. Это были космополитические центры, где китайские купцы, персидские учёные, индийские монахи и арабские торговцы вели дела бок о бок. Аль-Фараби, уроженец Отрара, вошёл в историю как «Второй учитель» после Аристотеля.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/turkestan.jpg',
    stats: [
      { label: 'Главные узлы', value: 'Отрар, Тараз, Туркестан, Сауран' },
      { label: 'Товары', value: 'Шёлк, специи, бумага, лошади' },
      { label: 'Религии', value: 'Ислам, тенгрианство, буддизм' },
      { label: 'Великий ум', value: 'Аль-Фараби (870–950)' },
    ],
    chapters: [
      { title: 'Расцвет городов', content: 'Пока кочевники странствовали по открытым равнинам, вдоль речных берегов вырастали изощрённые города. В Отраре была проточная вода, подведённая через керамические трубы, общественные бани и библиотеки с тысячами рукописей. Археологические данные свидетельствуют о стекольных мастерских, кузнях и хлопчатобумажных мельницах. Город чеканил собственные монеты. На пике расцвета Отрар был одним из крупнейших городов Центральной Азии — что сделало его целью Чингисхана в 1219 году.' },
      { title: 'Аль-Фараби — Второй учитель', content: 'Абу Наср аль-Фараби (870–950 н.э.), уроженец Отрара, стал одним из величайших философов в истории человечества. Известный как «Второй учитель» (после Аристотеля), его труды по логике, теории музыки, политической философии и метафизике повлияли на мыслителей от Ибн Сины до Фомы Аквинского. Его концепция «Добродетельного города» — утопии, управляемой разумом и справедливостью — опередила своё время на столетия.' },
      { title: 'Архитектура веры', content: 'Мавзолей Ходжи Ахмеда Ясави в Туркестане — шедевр эпохи. Возведённый по заказу Тимура (Тамерлана) в 1389 году, он обладает крупнейшим сохранившимся кирпичным куполом в Центральной Азии (18,2 метра). Бирюзовые изразцы, геометрические узоры и грандиозный масштаб демонстрируют инженерное и художественное мастерство, поразившее даже придворных архитекторов Тимура. В 2003 году ЮНЕСКО включило его в Список Всемирного наследия.' },
      { title: 'Жизнь каравана', content: 'Один только обоз мог растянуться на километры — сотни верблюдов, гружённых шёлком, нефритом, лазуритом, бумагой и пряностями. Каравансараи (придорожные постоялые дворы) на расстоянии дневного перехода обеспечивали водой, едой и защитой. Это были не просто места отдыха — здесь происходил культурный обмен, через который распространялись истории, религии и технологии. Буддизм проник в Китай по этим путям; по ним же на восток распространялся ислам; а производство бумаги перебралось на запад.' },
    ],
    subEras: [
      { title: 'Период Карахандов', period: '840 — 1212 н.э.', content: 'Первая тюркская династия, принявшая ислам. Покровительствовала учёным и возводила монументальные постройки. В этот период Махмуд Кашгари написал первый тюркский словарь.' },
      { title: 'Хорезмшахи', period: '1077 — 1231 н.э.', content: 'Контролировали торговлю от Каспия до Китая. Убийство монгольских послов их наместником в Отраре спровоцировало опустошительное нашествие Чингисхана.' },
    ],
    keyFigures: [
      { name: 'Аль-Фараби', role: 'Философ (870–950)', desc: 'Уроженец Отрара. «Второй учитель» после Аристотеля. Перевернул логику, музыку и политическую философию.' },
      { name: 'Ходжа Ахмед Ясави', role: 'Суфийский поэт (1093–1166)', desc: 'Наиболее влиятельный суфийский мистик Центральной Азии. Его поэзия распространила ислам по тюркскому миру.' },
      { name: 'Махмуд Кашгари', role: 'Лингвист (1005–1102)', desc: 'Создал первый полный тюркский словарь и знаменитую карту тюркского мира.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/aisha_bibi.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/al_farabi.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/turkestan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kozy_korpesh.jpg',
    ],
  },
  {
    id: 'khanate',
    year: '1465 — 1847 н.э.',
    title: 'Казахское ханство',
    subtitle: 'Объединение родов',
    description: 'Ханы Керей и Жанибек повели свой народ в долину Чу, основав первое казахское государство и создав национальную идентичность.',
    longDescription: 'Казахское ханство родилось из непокорности. В эпоху крушения Золотой Орды два султана — Керей и Жанибек — отказались подчиниться узбекскому хану Абулхаиру. Около 1465 года они увели 200 000 последователей в плодородные долины Жетысу, объявив себя «казахами» — «вольными воинами». Это стало началом казахского народа как нации. На протяжении последующих четырёх веков ханство выработало уникальную правовую систему (Жеті Жарғы), трёхчастный племенной союз (жузы) и дало миру легендарных воинов, отстоявших народ от джунгарского геноцида. Эпоха завершилась поглощением русскими колонизаторами, однако выкованная тогда идентичность в конечном счёте породила независимое государство.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abylai_khan.jpg',
    stats: [
      { label: 'Основано', value: '1465 н.э., Керей и Жанибек' },
      { label: 'Правовой кодекс', value: 'Жеті Жарғы (Семь установлений)' },
      { label: 'Структура', value: 'Три жуза (Младший/Средний/Старший)' },
      { label: 'Пик территории', value: '2,5 млн км²' },
    ],
    chapters: [
      { title: 'Рождение казахской нации', content: 'Слово «казах» впервые появляется в исторических источниках около 1456 года. Оно означает «свободный», «странник» или «искатель приключений» — что в точности характеризует народ, выбравший свободу вместо покорности. Уход Керея и Жанибека в долину Чу был не отступлением, а декларацией: казахский народ предпочтёт строить новый мир, нежели подчиниться угасающему. В течение десятилетий к ним примкнули сотни тысяч человек.' },
      { title: 'Жеті Жарғы — Семь установлений', content: 'Хан Тауке (1680–1718) объединил три жуза и кодифицировал обычное право казахов в Жеті Жарғы — Семь установлений. Это была одна из наиболее изощрённых правовых систем в истории кочевых народов, охватывавшая всё — от убийства до брака и имущественных споров. Споры разрешались биями (судьями), которые хранили в памяти всю правовую традицию. Наиболее прославленный бий Толе Би мог в стихотворной форме цитировать прецеденты, уходившие в глубь веков.' },
      { title: 'Джунгарские войны', content: 'XVIII век принёс катастрофу: Джунгарское ханство предпринимало геноцидные походы против казахов в 1723–1727 годах — период, вошедший в историю как «Ақтабан шұбырынды» («Великое отступление»). Погибли сотни тысяч людей. Катастрофа сплавила три жуза в единую боевую силу. Прославленный батыр Бегенбай-хан организовал сопротивление, и к 1730 году ситуация изменилась в корне. К 1756 году само Джунгарское ханство было уничтожено маньчжурской династией Цин.' },
      { title: 'Абылай-хан — последний великий хан', content: 'Абылай-хан (1771–1781) был последним правителем, объединившим под единым началом все три жуза. Блестящий дипломат, умело игравший Россией, Китаем и джунгарами в противовес друг другу, он сохранял казахскую независимость скорее политическим гением, нежели только военной силой. Его смерть ознаменовала начало конца — вскоре российская экспансия начала поглощать степь по частям.' },
    ],
    subEras: [
      { title: 'Раннее ханство', period: '1465 — 1600', content: 'Консолидация казахской идентичности. Расширение по степи. Формирование системы жузов. Конфликты с Узбекским и Сибирским ханствами.' },
      { title: 'Золотой век', period: '1600 — 1720', content: 'Объединение при хане Тауке. Кодификация Жеті Жарғы. Пик казахской культурной и военной мощи. Союз трёх жузов.' },
      { title: 'Российская экспансия', period: '1720 — 1847', content: 'Джунгарские войны, российский протекторат, постепенное поглощение. Последний хан Кучум. Освободительное движение Кенесары-хана.' },
    ],
    keyFigures: [
      { name: 'Хан Керей', role: 'Сооснователь (ок. 1465)', desc: 'Вместе с Жанибеком возглавил основавшую Казахское ханство миграцию. Создал первое независимое казахское государство.' },
      { name: 'Абылай-хан', role: 'Великий хан (1771–1781)', desc: 'Объединил все три жуза. Искусный дипломат, сохранивший казахскую независимость от России, Китая и джунгар.' },
      { name: 'Кенесары-хан', role: 'Последний хан (1802–1847)', desc: 'Возглавил последнее крупное восстание против российской колонизации. Погиб в бою. Признан национальным героем.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abylai_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kenesary_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bogenbay_batyr.webp',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
    ],
  },
  {
    id: 'independence',
    year: '1991 — наст. время',
    title: 'Независимый Казахстан',
    subtitle: 'Рождение новой нации',
    description: '16 декабря 1991 года началась новая эра. Казахстан обрёл суверенитет, возвёл футуристическую столицу и стал мостом между Востоком и Западом.',
    longDescription: 'Казахстан провозгласил независимость 16 декабря 1991 года, став последней советской республикой, сделавшей это. Он унаследовал 4-й по величине ядерный арсенал в мире — и добровольно отказался от него, войдя в историю как самый впечатляющий пример ядерного разоружения. Решение перенести столицу из Алматы в Астану (ныне Нур-Султан, затем переименованную обратно в Астану) было дерзким: построить с нуля футуристический город посреди замёрзшей степи. Архитекторы Норман Фостер, Кисё Курокава и Сантьяго Калатрава создали горизонт, не похожий ни на что в Центральной Азии. Сегодня Казахстан — экономическая держава региона, ключевой поставщик энергоресурсов и формирующийся технологический хаб.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bayterek.jpg',
    stats: [
      { label: 'Независимость', value: '16 декабря 1991 года' },
      { label: 'Столица', value: 'Астана (перенесена в 1997)' },
      { label: 'Ядерное разоружение', value: '1410 боеголовок переданы' },
      { label: 'Экономика', value: 'Крупнейшая в Центральной Азии' },
    ],
    chapters: [
      { title: 'Ядерное разоружение', content: 'В 1991 году Казахстан унаследовал 1410 ядерных боеголовок — 4-й по величине арсенал на Земле. Под интенсивным международным давлением и в ходе внутренних дебатов было принято решение отказаться от всего. Каждая боеголовка была либо передана России, либо уничтожена. Семипалатинский испытательный полигон закрыли навсегда. Этот исторический акт отречения принёс Казахстану мировое уважение и заложил основу его репутации миротворца.' },
      { title: 'Астана — город будущего', content: 'В 1997 году столица была перенесена из зелёной горной Алматы в продуваемый ветрами городок на севере степи. Замысел казался безумным. Но в течение двух десятилетий Астана превратилась в витрину архитектуры XXI века: Хан-Шатыр Нормана Фостера (крупнейший шатёр в мире), башня Байтерек, Дворец мира и согласия. Город стал манифестом из стекла и стали — декларацией того, что кочевой народ способен строить будущее столь же блестяще, как странствовал в прошлом.' },
      { title: 'Экономическое преображение', content: 'Нефтяные богатства с месторождений Кашаган и Тенгиз в Каспийском регионе превратили Казахстан в экономический двигатель Центральной Азии. ВВП на душу населения вырос в 10 раз с 1991 по 2023 год. Международный финансовый центр «Астана» работает по нормам английского общего права. Страна привлекла более 370 миллиардов долларов прямых иностранных инвестиций с момента обретения независимости — больше, чем все остальные страны Центральной Азии вместе взятые.' },
      { title: 'Культурный ренессанс', content: 'Новое поколение казахских художников, музыкантов и кинематографистов переосмысляет кочевую идентичность в цифровую эпоху. Домбра (традиционный двухструнный инструмент) сочетается с электронными ритмами. Фильмы «Кочевник» и «Томирис» вывели казахскую историю на мировую аудиторию. Казахский язык переживает возрождение, включая исторический переход с кириллицы на латиницу, начавшийся в 2017 году.' },
    ],
    subEras: [
      { title: 'Переходный период', period: '1991 — 1997', content: 'Экономический коллапс, гиперинфляция, ядерное разоружение. Введение тенге. Решение о переносе столицы.' },
      { title: 'Нефтяной бум', period: '1997 — 2014', content: 'Масштабные иностранные инвестиции в нефтяной сектор. Строительство Астаны с нуля. ВВП рос в среднем на 8% в год. Проведение ЭКСПО-2017.' },
      { title: 'Эра диверсификации', period: '2015 — наст. время', content: 'Курс на преодоление нефтяной зависимости. Цифровая трансформация, рост финтеха, цели в области возобновляемой энергии. Переход на латиницу.' },
    ],
    keyFigures: [
      { name: 'Нурсултан Назарбаев', role: 'Первый президент (1991–2019)', desc: 'Провёл Казахстан через обретение независимости и экономическое преображение. Перенёс столицу. Осуществил ядерное разоружение.' },
      { name: 'Касым-Жомарт Токаев', role: 'Президент (2019 — наст. время)', desc: 'Дипломат и полиглот. Проводит политические и экономические реформы. Переименовал столицу обратно в Астану.' },
      { name: 'Димаш Кудайберген', role: 'Певец', desc: 'Глобальный феномен с диапазоном в 6 октав. Сделал казахскую культуру известной во всём мире через музыку.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/spring.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bayterek.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/lake_balkhash.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
    ],
  },
];

// ─── KAZAKH ──────────────────────────────────────────────
const ERAS_KZ: EraDetail[] = [
  {
    id: 'ancient',
    year: 'б.з.д. 800 — б.з.д. 300',
    title: 'Сақ дәуірі',
    subtitle: 'Даланың алтын жауынгерлері',
    description: 'Сақ (скиф) тайпалары атты соғыс пен зергерлік шеберліктің шыңында тұрып, ұлан-байтақ еуразиялық далаларды биледі.',
    longDescription: 'Жібек жолы өркениеттерді жалғастырудан бұрын, гректерге скифтер ретінде белгілі сақтар континенттік империя құрды. Олар — кешенді садақтары кез келген жаяу жауынгерді жеңе алатын ең алғашқы ұлы атты жауынгерлер. Олардың шеберлері «Аңдар стилін» жасады — күресті ғарыштық тартыстарды баяндайтын таза алтыннан жасалған зілді жыртқыштарды. 1969 жылы ашылған, 4000 алтын қабыршықтан жасалған сауыттағы жауынгер-ханзада бейітін қамтыған Есік қорғаны Қазақстанның ежелгі тарихын қайта жазды. «Алтын адам» ұлттың ең мықты рәмізіне айналды және даланың ерте дүниедегі кез келген өркениеттен кем соқпас нәзік мәдениет тудырғанын дәлелдеді.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/golden_man.jpg',
    stats: [
      { label: 'Басты жәдігер', value: 'Алтын Адам (Есік қорғаны)' },
      { label: 'Аймағы', value: 'Жетісудан Қара теңізге дейін' },
      { label: 'Әскери жаңалық', value: 'Кешенді садақ және атты садақшылық' },
      { label: 'Өнер мұрасы', value: 'Алтынды «Аңдар стилі»' },
    ],
    chapters: [
      { title: 'Аңдар стилі', content: 'Сақ өнері серпінді, бір-біріне өрілген жануарлар бейнелерімен сипатталады — буғыларға тиісіп жатқан қар барыстары, қанаттарын жайған бүркіттер, айқасқан грифондар — барлығы таза алтыннан. Бұл тек безендіру ғана емес, рухани ғарыштану болды. Алтынның әр иіні жыртқыш пен олжаның, жер, аспан және жер асты дүниесін жалғаған мәңгілік циклдің тарихын баяндады. Археологтар Алтайдан Дунайға дейін далада осындай мыңдаған заттарды тапты.' },
      { title: 'Аттың қожайындары', content: 'Сақтар тарихта алғашқылардың бірі болып атты садақшылықты меңгерді, бұл жарым мыңжылдыққа резонанс береді деген әскери революцияны жасады. Ағаш, мүйіз және сіңірден жасалған кешенді садақ толық шабысқа шыққан кезде тиімді дәлдікпен жебелер атуға мүмкіндік берді. Бұл оларға жаяу жасақ армияларынан толық басымдылық берді. Парсы патшасы Дарий I б.з.д. 519 жылы оларға қарсы үлкен жорық ұйымдастырды, бірақ толығымен жеңілді: сақтар жасыл алқаптарды өртей отырып, шексіз далаға шегіне берді.' },
      { title: 'Есік қорғанының ашылуы', content: '1969 жылы археолог Кемал Ақышев Алматы маңында өмірінің ашылуын жасады. Обаның ішінде ол 4000 алтын тоғыспалы қабыршықтан жасалған сауытта, таулар, жылқылар мен Өмір ағашын бейнелейтін 70 сантиметрлік алтын бас киімде жауынгер-ханзаданы тапты. «Алтын адам» өлімінде шамамен 18 жаста болды. Сауыттың күрделілігі — әр қабыршақ жеке жасалған — осы ерекше байлық пен технологиялық жетілдіру деңгейіндегі қоғамды нұсқады.' },
      { title: 'Дала тас жолы', content: 'Жібек жолы ресімделгенге дейін ғасырлар бұрын сақтар Қытайды Жерорта теңізімен жалғастыратын прото-сауда маршруттарын бақылап отырды. Олар алтын, жылқы және теріні қытайлық жібек пен нефритке айырбастады. Олардың мобильділігі оларды жеңілмес етті; арбаларға топтастырылған тұтас лагерлер бірнеше күнде жерін ауыстыра алады. Грек тарихшысы Геродот оларды «адамдардың ең шынайысы» деп атады, мыңжылдықтарға дейін қазақ мәдениетінде өмір сүретін олардың күрделі заң дәстүрлері мен қонақжайлылық кодекстерін атап өтті.' },
    ],
    subEras: [
      { title: 'Андронов мәдениеті', period: 'б.з.д. 2000 — б.з.д. 900', content: 'Сақтарға дейінгі қола дәуірінің өркениеті. Тұрақты елді мекендер салды, жылқыларды қолға үйретті, соғыс арбасын ойлап тапты. Тамғалыдағы (ЮНЕСКО нысаны) петроглифтері Орталық Азиядағы ең ежелгі астрономиялық бақылаулардың бірін қамтиды.' },
      { title: 'Патшалық сақтар (Тиграхауда)', period: 'б.з.д. 800 — б.з.д. 500', content: 'Парсылардың «шошақ бөріктілер» деп сипаттаған сақтары. Жетісуда (Жеті өзен аймағы) үстемдік етті. Ең үлкен қорғандарды салып, ең жоғары деңгейдегі алтын бұйымдар жасады.' },
      { title: 'Үйсін кезеңі', period: 'б.з.д. 200 — б.з.д. 400', content: 'Оңтүстік-шығыс Қазақстандағы сақтардың мирасқорлары. Сюнну қарсы Қытай Хань әулетімен одақтасты. Ыстықкөл жанындағы Чигу астанасы қытайлық елшілерді қабылдады.' },
    ],
    keyFigures: [
      { name: 'Томирис патшайым', role: 'Массагеттердің жауынгер патшайымы', desc: 'Б.з.д. 530 жылы парсы императоры Кир Ұлыны жеңіп, өлтірді. Ежелгі тарихтағы ең атақты жауынгерлердің бірі.' },
      { name: 'Алтын Адам', role: 'Сақ ханзадасы (б.з.д. шамамен 400)', desc: 'Есік қорғанынан 4000 алтын қабыршықпен табылған белгісіз ханзада. Қазір — Қазақстанның ұлттық рәмізі.' },
      { name: 'Кемал Ақышев', role: 'Археолог', desc: '1969 жылы Алтын Адамды тауып, Орталық Азия өркениеті туралы түсінікті өзгертті.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/lake_balkhash.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/summer.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/autumn.jpg',
    ],
  },
  {
    id: 'turkic',
    year: '552 — 744 ж.ж.',
    title: 'Түрік қағанаттары',
    subtitle: 'Қытайдан Византияға дейінгі империя',
    description: 'Түркі халықтары Кореядан Константинополь қақпасына дейін созылған тарихтағы ең ірі империялардың бірін құрды.',
    longDescription: '552 жылы Бумын қаған Жужань қағанатын жеңіп, Бірінші Түрік қағанатын — онжылдықтарда Манжуриядан Қырымға дейін созылған империяны — орнатты. Бұл жеке жазбаларынан атын білетін алғашқы дала империясы болды. VIII ғасырда тасқа ойылған Орхон жазбалары ең ерте белгілі түрік жазуы болып табылады — қазіргі қазақ алфавитіне дейін дамыған жазу. Түрік дәуірі «хан» сөзін әлемге берді, моңғолдарға дейінгі пошта жүйесін жасады және тенгрианство дін дәстүрін орнықтырды.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/tomyris.jpg',
    stats: [
      { label: 'Өлшемі', value: 'Кореядан Қара теңізге дейін' },
      { label: 'Жазуы', value: 'Ежелгі түрік жазуы (Орхон)' },
      { label: 'Діні', value: 'Тенгрианство (Аспан Тәңірі)' },
      { label: 'Жаңалықтар', value: 'Пошта-ат беру жүйесі' },
    ],
    chapters: [
      { title: 'Кок-түріктердің өрлеуі', content: 'Ашина руы Алтай тауларындағы ұсталардан белгілі дүниенің жартысының иелеріне айналды. Олардың шығу мифі олардың бөрідан жаралғандығын айтады — түрік геральдикасы бойына тарасқан символ. Бумын және Істемі қағандар империяны бөлді: Бумын Монғолиядан шығысты, Ыстемі Қазақстаннан батысты басқарды. Бір ұрпақ ішінде түрік елшілері Қытай Тан сарайында да, Константинопольдегі Византия сарайында да қабылданды.' },
      { title: 'Орхон жазбалары', content: 'VIII ғасырда Монғолияның Орхон өзенінің бойындағы тас монументтерге ойылған бұл жазбалар кез келген түрік тілінде тіршілік еткен ең ежелгі мәтіндер болып табылады. Олар Білге қаған мен Күл-тегін тарихын таңданарлық әдеби күшпен баяндайды: «Мен тоқ халыққа туылмадым, аш-жалаңаш халыққа туылдым». Бұл жазбалар Орталық Азиядағы ең маңызды тарихи құжаттардың бірі ретінде мойындалды.' },
      { title: 'Тенгрианство — Мәңгілік Көк аспан', content: 'Ислам далаға жетпес бұрын, түріктер Тәңірге — Мәңгілік Көк аспанға табынды. Бұл политеизм емес, күрделі монотеистік жүйе болды: Тәңір жоғары күш, аспан оның денесі, ал әр тау, өзен және жануар қасиетті мәнді алып жүрді. Бақсылар дүниелер арасында байланысты. Тенгрианстықтың көптеген ұғымдары — қасиетті таулар, сыйластырылатын ата-бабалар, табиғатты сыйлау — ислам келгеннен кейін де қазақ мәдениетінде сақталды, ерекше рухани синтез жасады.' },
      { title: 'Батыс Түрік қағанаты', content: 'Қазақстанның Жетісу аймағында орталықтанған империяның батыс жартысы Жібек жолының ең пайдалы бөліктерін бақылады. Суяб (заманауи Тоқмоқ маңында) сияқты қалалар буддизм, христиандық, зороастризм және манихеизм бейбіт тіршілескен космополиттік орталықтарға айналды. Қытайлық монах Сюаньцзан 630 жылы мұнан өтті және «әртүрлі нәсіл мен тілдегі адамдары» бар гүлденген қалаларды сипаттады.' },
    ],
    subEras: [
      { title: 'Бірінші Түрік қағанаты', period: '552 — 603 ж.', content: 'Қытайдан Парсыға дейінгі бірыңғай империя. Азамат соғысынан кейін Шығыс және Батыс қағанаттарға бөлінді.' },
      { title: 'Батыс Түрік қағанаты', period: '603 — 658 ж.', content: 'Қазақстан арқылы Жібек жолын бақылады. Суябтағы астана. Тан әулетінің кеңеюіне байланысты құлады.' },
      { title: 'Түргеш қағанаты', period: '699 — 766 ж.', content: 'Қазақстандағы мирасқор мемлекет. Өз монеталарын соқты. Оңтүстіктен арабтардың кеңеюіне қарсы тұрды.' },
    ],
    keyFigures: [
      { name: 'Бумын қаған', role: 'Негізін қалаушы', desc: '552 жылы жужаньдарды жеңіп, тарихтағы ең ірі империялардың бірі — Түрік қағанатын орнатты.' },
      { name: 'Білге қаған', role: 'Билеуші және заңгер', desc: 'Орхон жазбаларын жазуды тапсырды. Оның билеу кезеңі түрік өркениетінің алтын ғасыры деп саналады.' },
      { name: 'Ыстемі жабғу', role: 'Батыс қағанатының билеушісі', desc: 'Константинопольге елшілер жіберіп, батыс Жібек жолын бақылады.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abylai_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kenesary_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bogenbay_batyr.webp',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/tomyris.jpg',
    ],
  },
  {
    id: 'silkroad',
    year: '600 — 1200 ж.ж.',
    title: 'Ұлы Жібек жолы',
    subtitle: 'Өркениеттердің айқасар жері',
    description: 'Ұлы Жібек жолы сауда маршруттарының торабы болды. Отырар, Тараз және Түркістан сияқты қалалар сауда, ғылым және діннің орталықтарына айналды.',
    longDescription: 'Жібек жолы ешқашан жалғыз жол болмады. Ол — шөлдер, тау асулары мен өзен аңғарлары арқылы өтетін мыңдаған тармақты жолдардан тұратын ғаламат тор. Солтүстік және оңтүстік маршруттар тоғысатын Қазақстан оның жүрегінде орналасты. Өзендер бойында қалалар өсті: Сырдарья бойындағы Отырар (өзінің шарықтау шегінде халқы 200 000 адам), Тараз, Түркістан, Сауран. Бұлар қытайлық саудагерлер, парсы ғалымдары, үнді монахтары мен арабтар жолығатын космополиттік орталықтар болды. Отырарда дүниеге келген Әл-Фараби Аристотельден кейінгі «Екінші ұстаз» атанды.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/turkestan.jpg',
    stats: [
      { label: 'Басты торап қалалар', value: 'Отырар, Тараз, Түркістан, Сауран' },
      { label: 'Сауда тауарлары', value: 'Жібек, дәмдеуіш, қағаз, жылқы' },
      { label: 'Діндер', value: 'Ислам, тенгрианство, буддизм' },
      { label: 'Ұлы ақыл', value: 'Әл-Фараби (870–950)' },
    ],
    chapters: [
      { title: 'Қалалардың гүлденуі', content: 'Көшпенділер ашық жазықтарда кезіп жүрген кезде, өзен жағаларында күрделі қалалар өсті. Отырарда керамикалық құбырлармен беріліп жатқан ағынды су, халық моншалары мен мыңдаған қолжазба сақтаған кітапханалар болды. Археологиялық деректер шыны шеберханаларын, темір балқыту орындарын және мақта диірмендерін растайды. Қала өз монетасын соқты. Өзінің шарықтау шегінде Отырар Орталық Азиядағы ең ірі қалалардың бірі болды — бұл оны 1219 жылы Шыңғысханның нысанасына айналдырды.' },
      { title: 'Әл-Фараби — Екінші ұстаз', content: 'Отырарда туылған Әбу Насыр Мухаммед Әл-Фараби (870–950 ж.) адамзат тарихындағы ең ұлы философтардың бірі болды. «Екінші ұстаз» (Аристотельден кейін) ретінде белгілі болған оның логика, музыка теориясы, саяси философия мен метафизика бойынша еңбектері Ибн Синадан Фома Аквинскийге дейінгі ойшылдарға әсер етті. Оның «Тамаша қала» концепциясы — ақыл мен әділдікпен басқарылатын утопия — ғасырлар бұрын өз уақытынан озған болатын.' },
      { title: 'Діннің архитектурасы', content: 'Түркістандағы Қожа Ахмет Яссауи кесенесі — дәуірдің шедеврі. Тимур (Тамерлан) тапсырысымен 1389 жылы салынған ол Орталық Азиядағы ең ірі кірпіш күмбезді (18,2 метр) иеленеді. Фирюзаранг кәшандалар, геометриялық өрнектер және алып масштаб тіпті Тимурдың сарай сәулетшілерін таңдандырған инженерлік және көркемдік шеберлікті демонстрациялайды. ЮНЕСКО 2003 жылы оны Дүниежүзілік мұраға енгізді.' },
      { title: 'Керуен өмірі', content: 'Бір керуен шақырымдарға созылуы мүмкін — жүздеген түйелер жібек, нефрит, лазурит, қағаз және дәмдеуіштерді тасып жатты. Бір күндік жолдағы арақашықтықта орналасқан керуенсарайлар (жолдағы мейманханалар) су, тамақ және қорғаныс берді. Бұлар тек демалу орындары ғана емес — тарихтар, діндер мен технологиялар таралатын мәдени алмасу орындары болды. Буддизм осы жолдар арқылы Қытайға кіруде; ислам осылар арқылы шығысқа таралды; қағаз өндіру батысқа көшті.' },
    ],
    subEras: [
      { title: 'Қарахандар кезеңі', period: '840 — 1212 ж.', content: 'Исламды қабылдаған алғашқы түрік әулеті. Ғалымдарды қолдап, монументалдық архитектура тұрғызды. Осы кезеңде Махмут Қашқари алғашқы түрік сөздігін жазды.' },
      { title: 'Хорезмшахтар', period: '1077 — 1231 ж.', content: 'Каспий теңізінен Қытайға дейінгі сауданы бақылады. Отырарда моңғол елшілерін өлтіргені Шыңғысханның зымыранды шабуылын туғызды.' },
    ],
    keyFigures: [
      { name: 'Әл-Фараби', role: 'Философ (870–950)', desc: 'Отырарда туылды. Аристотельден кейінгі «Екінші ұстаз». Логика, музыка және саяси философияны өзгертті.' },
      { name: 'Қожа Ахмет Яссауи', role: 'Суфи ақыны (1093–1166)', desc: 'Орталық Азиядағы ең ықпалды суфи мистик. Оның өлеңдері исламды түрік дүниесіне жайды.' },
      { name: 'Махмут Қашқари', role: 'Тілші (1005–1102)', desc: 'Алғашқы жан-жақты түрік сөздігін және түрік дүниесінің атақты картасын жасады.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/aisha_bibi.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/al_farabi.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/turkestan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kozy_korpesh.jpg',
    ],
  },
  {
    id: 'khanate',
    year: '1465 — 1847 ж.ж.',
    title: 'Қазақ хандығы',
    subtitle: 'Рулардың бірігуі',
    description: 'Керей мен Жәнібек хандар халқын Шу аңғарына бастап, алғашқы қазақ мемлекетін негіздеп, ұлттық бірегейлікті қалыптастырды.',
    longDescription: 'Қазақ хандығы бағынбаушылықтан туды. Алтын Ордасының ыдырауы кезінде екі сұлтан — Керей мен Жәнібек — Әбілқайырдың өзбек ханына бағынудан бас тартты. Шамамен 1465 жылы олар 200 000 ізбасарын Жетісудың құнарлы аңғарларына бастады, өздерін «қазақ» — «еркін жауынгерлер» деп жариялады. Бұл ұлт ретінде қазақ халқының бастауы болды. Келесі төрт ғасыр бойы хандық ерекше заң жүйесін (Жеті Жарғы), үш бөлікті рулық конфедерацияны (жүздер) дамытып, жоңғар геноцидінен қорғаған аңызға айналған батырлар тудырды.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abylai_khan.jpg',
    stats: [
      { label: 'Негізделді', value: '1465 ж., Керей мен Жәнібек' },
      { label: 'Заң кодексі', value: 'Жеті Жарғы (Жеті заң)' },
      { label: 'Құрылымы', value: 'Үш жүз (Кіші/Орта/Ұлы)' },
      { label: 'Ең кең аймағы', value: '2,5 млн км²' },
    ],
    chapters: [
      { title: 'Қазақ ұлтының тууы', content: '«Қазақ» сөзі тарихи жазбаларда алғаш рет 1456 жылы кездеседі. Ол «еркін», «кезбе» немесе «батыл» дегенді білдіреді — бағынуға қарсы еркіндікті таңдаған халыққа өте лайық. Керей мен Жәнібектің Шу аңғарына ауысуы шегіну емес, декларация болды: қазақ халқы ыдырауға ұшыраған дүниеге бағынудан гөрі жаңа дүние салуды таңдайды. Бірнеше онжылдықта жүздеген мыңдаған адам оларға қосылды.' },
      { title: 'Жеті Жарғы — Жеті заң', content: 'Хан Тәуке (1680–1718) үш жүзді біріктіріп, қазақ дәстүрлі заңын Жеті Жарғыға — Жеті заңға кодификациялады. Бұл бүкіл заң дәстүрін жатқа білетін билер (судьялар) арқылы шешілген кісі өлтіруден некеге және мүлік дауына дейін барлығын қамтыған дала тарихындағы ең күрделі заң жүйелерінің бірі болды. Ең атақты би Төле би ғасырлар тереңіне кеткен заңдық прецеденттерді поэзия тілінде баяндай алды.' },
      { title: 'Жоңғар соғыстары', content: 'XVIII ғасыр апат алып келді: Жоңғар хандығы 1723–1727 жылдары қазақтарға қарсы геноцидтік жорықтар жасады, бұл «Ақтабан шұбырынды» деп аталатын кезең болды. Жүздеген мың адам қаза тапты. Апат үш жүзді бір тұтас соғыс күшіне айналдырды. Аңызға айналған батыр Бөгенбай хан қарсыласуды ұйымдастырды, 1730 жылға қарай ағыс өзгерді. 1756 жылға қарай Жоңғар хандығының өзі Цин әулетімен жойылды.' },
      { title: 'Абылай хан — соңғы ұлы хан', content: 'Абылай хан (1771–1781) — үш жүзді бір басшылыққа біріктірген соңғы билеуші. Ресей, Қытай мен жоңғарларды бір-бірімен ойнатқан керемет дипломат, ол тек әскери күш емес, саяси даналықпен Қазақстан тәуелсіздігін сақтап қалды. Оның өлімі соңның басын белгіледі — ресей экспансиясы жақын арада далаларды бірте-бірте жұтып кету болды.' },
    ],
    subEras: [
      { title: 'Ерте хандық', period: '1465 — 1600', content: 'Қазақ бірегейлігінің шоғырлануы. Дала бойынша кеңею. Жүз жүйесінің дамуы. Өзбек хандығымен және Сібір хандығымен қақтығыстар.' },
      { title: 'Алтын ғасыр', period: '1600 — 1720', content: 'Тәуке хан кезіндегі бірлік. Жеті Жарғының кодификациясы. Қазақ мәдени және әскери күшінің шарықтауы. Үш жүздің одағы.' },
      { title: 'Ресейдің отарлауы', period: '1720 — 1847', content: 'Жоңғар соғыстары, ресей протекторатасы, бірте-бірте сіңу. Соңғы хан Кішікей. Кенесары хан бастаған қарсылық қозғалысы.' },
    ],
    keyFigures: [
      { name: 'Керей хан', role: 'Сонегіздеуші (шамамен 1465 ж.)', desc: 'Жәнібекпен бірге Қазақ хандығын негіздеген қоныс аударуды бастады. Алғашқы тәуелсіз қазақ мемлекетін орнатты.' },
      { name: 'Абылай хан', role: 'Ұлы хан (1771–1781)', desc: 'Үш жүздің барлығын біріктірді. Ресей, Қытай мен жоңғарлардан қазақ тәуелсіздігін сақтаған шебер дипломат.' },
      { name: 'Кенесары хан', role: 'Соңғы хан (1802–1847)', desc: 'Ресей отарлауына қарсы соңғы ірі көтерілісті бастады. Шайқаста қаза тапты. Ұлттық қаһарман ретінде мойындалды.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abylai_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kenesary_khan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bogenbay_batyr.webp',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
    ],
  },
  {
    id: 'independence',
    year: '1991 — қазіргі күн',
    title: 'Тәуелсіз Қазақстан',
    subtitle: 'Жаңа мемлекеттің туылуы',
    description: '1991 жылдың 16 желтоқсанында жаңа дәуір басталды. Қазақстан егемендікке ие болды, болашақтың астанасын салды және Шығыс пен Батыс арасындағы көпірге айналды.',
    longDescription: 'Қазақстан 1991 жылдың 16 желтоқсанында тәуелсіздігін жариялады — бұл сондай жасаған соңғы кеңес республикасы болды. Ол әлемдегі 4-ші ядролық арсеналды мұраға алды — және оны ерікті түрде берді, тарихтың ең айбарлы ядролық қарусыздану үлгісіне айналды. Астананы Алматыдан Астанаға (кейін Нұр-Сұлтан, қайтадан Астана болып аталған) ауыстыру шешімі батыл болды: қатып қалған далаға нөлден болашақтың қаласын тұрғызу. Норман Фостер, Кисё Курокава мен Сантьяго Калатрава сияқты сәулетшілер Орталық Азияда бірегей желдің жасаушылары болды. Бүгінгі Қазақстан — аймақтың экономикалық қозғаушы күші, маңызды энергия жеткізушісі және дамып келе жатқан технологиялық хаб.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bayterek.jpg',
    stats: [
      { label: 'Тәуелсіздік', value: '1991 жылдың 16 желтоқсаны' },
      { label: 'Астана', value: 'Астана (1997 жылы ауыстырылды)' },
      { label: 'Ядролық қарусыздану', value: '1410 боеголовка берілді' },
      { label: 'Экономика', value: 'Орталық Азиядағы ең ірі' },
    ],
    chapters: [
      { title: 'Ядролық қарусыздану', content: '1991 жылы Қазақстан Жердегі 4-ші ірі арсенал — 1410 ядролық боеголовканы мұраға алды. Қарқынды халықаралық қысым мен ішкі пікірталас астында барлығынан бас тарту туралы шешім қабылданды. Әрбір боеголовка Ресейге беріліп немесе жойылды. Семей сынақ полигоны біржола жабылды. Бұл тарихи бас тарту акті Қазақстанға дүниежүзілік сыйластықты қамтамасыз етті.' },
      { title: 'Астана — болашақтың қаласы', content: '1997 жылы астана жасыл тауы Алматыдан солтүстік даланың жел соқтырған қалашығына ауыстырылды. Бұл жоспар ессіз болып көрінді. Бірақ екі онжылдық ішінде Астана XXI ғасыр сәулетінің витринасына айналды: Норман Фостердің Хан Шатыры (әлемдегі ең ірі шатыр), Бәйтерек мұнарасы, Бейбітшілік пен татулық сарайы. Қала — шыны мен болаттан жасалған манифест, далалық халықтың болашақты сондай бастыра ала алатынының декларациясы.' },
      { title: 'Экономикалық өзгеріс', content: 'Каспий теңізіндегі Қашаған мен Теңіз кен орындарынан мұнай байлығы Қазақстанды Орталық Азияның экономикалық қозғаушы күшіне айналдырды. ЖІӨ 1991 жылдан 2023 жылға дейін жан басына шаққанда 10 есе өсті. Астана халықаралық қаржы орталығы ағылшын жалпы құқығы бойынша жұмыс істейді. Ел тәуелсіздікке ие болғаннан бері 370 миллиард доллардан астам тікелей шетел инвестициясын тартты — Орталық Азияның барлық басқа елдерін қосқаннан да артық.' },
      { title: 'Мәдени ренессанс', content: 'Қазақ суретшілер, музыканттар мен кинематографшылардың жаңа буыны цифрлық дәуірде дала бірегейлігін қайта түсіндіруде. Домбыра (дәстүрлі екі ішекті аспап) электронды ритмдермен кіріктірілуде. «Көшпенділер» мен «Томирис» сияқты фильмдер қазақ тарихын дүниежүзілік аудиторияға жеткізді. Қазақ тілі жаңғыруды бастан кешіп, 2017 жылы кирилл жазуынан латынға тарихи ауысуды бастады.' },
    ],
    subEras: [
      { title: 'Өтпелі кезең', period: '1991 — 1997', content: 'Экономикалық күйреу, гиперинфляция, ядролық қарусыздану. Теңгенің енгізілуі. Астананы ауыстыру туралы шешім.' },
      { title: 'Мұнай бумы', period: '1997 — 2014', content: 'Мұнай секторына ірі шетел инвестициялары. Астананың нөлден салынуы. ЖІӨ орта есеппен жылына 8% өсімі. ЭКСПО-2017 өткізілуі.' },
      { title: 'Диверсификация дәуірі', period: '2015 — қазіргі күн', content: 'Мұнайға тәуелділіктен арылу. Цифрлық трансформация, финтех өсімі, жаңартылатын энергия мақсаттары. Латын алфавитіне ауысу.' },
    ],
    keyFigures: [
      { name: 'Нұрсұлтан Назарбаев', role: 'Бірінші Президент (1991–2019)', desc: 'Қазақстанды тәуелсіздік пен экономикалық өзгеріс арқылы бастап өтті. Астананы ауыстырды. Ядролық қарусызданды жүргізді.' },
      { name: 'Қасым-Жомарт Тоқаев', role: 'Президент (2019 — қазіргі күн)', desc: 'Дипломат және полиглот. Саяси және экономикалық реформаларды жүргізуде. Астананың атауын қайтарды.' },
      { name: 'Димаш Құдайберген', role: 'Әнші', desc: '6 октавалы диапазоны бар жаһандық дауыс феномені. Музыка арқылы қазақ мәдениетін дүние жүзіне танытты.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/spring.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/bayterek.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/lake_balkhash.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
    ],
  },
];

// ─── Export ───────────────────────────────────────────────
export const HISTORY_ERAS: Record<'en' | 'ru' | 'kz', EraDetail[]> = {
  en: ERAS_EN,
  ru: ERAS_RU,
  kz: ERAS_KZ,
};
