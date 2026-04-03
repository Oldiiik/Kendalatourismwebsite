import React, { useState, useRef, useEffect } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { PageTransition } from '../ui/PageTransition';
import { ArrowRight, ChevronLeft } from '../ui/icons';

const EASE = [0.16, 1, 0.3, 1] as const;
const AMBER = '#D4AF37';

interface EraStat { label: string; value: string; }
interface SubEra { title: string; period: string; content: string; }
interface EraDetail {
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

/* ─── Reveal helper ─── */
const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   HISTORY DATA — EN only for brevity, with proper images
   ═══════════════════════════════════════════ */
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
      { title: 'Al-Farabi — The Second Teacher', content: 'Abu Nasr al-Farabi (870-950 AD), born in Otrar, became one of the greatest philosophers in human history. Known as the "Second Teacher" (after Aristotle), his works on logic, music theory, political philosophy, and metaphysics influenced thinkers from Ibn Sina to Thomas Aquinas. His concept of the "Virtuous City" — a utopia governed by reason and justice — was centuries ahead of its time. He also wrote the first comprehensive treatise on music theory in the Islamic world.' },
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
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/wood_carving.jpg',
    stats: [
      { label: 'Founders', value: 'Kerei & Janibek Khan' },
      { label: 'Legal Code', value: 'Zheti Zhargy (Seven Charters)' },
      { label: 'Structure', value: 'Three Zhuzes (Elder, Middle, Junior)' },
      { label: 'Greatest Threat', value: 'Dzungar Invasion (1723)' },
    ],
    chapters: [
      { title: 'The Great Migration', content: 'Seeking freedom from the Uzbek Khanate under Abu\'l-Khayr Khan, approximately 200,000 nomads undertook an epic migration to the valleys of Zhetysu (Seven Rivers). This was not a retreat but a declaration of independence. The name they chose — "Kazakh," meaning "free warrior" or "wanderer" — became the foundation of a new national identity. It was a conscious choice of liberty over submission, self-governance over servitude.' },
      { title: 'Steppe Democracy — Zheti Zhargy', content: 'Under Tauke Khan (ruled 1680-1718), the Kazakhs codified their customary law into the "Zheti Zhargy" — Seven Charters. This was a sophisticated legal system that governed everything from property disputes to murder trials. Justice was dispensed by Biys (judges) chosen for wisdom, not birth. Disputes were resolved through arbitration and compensation rather than punishment. Women had significant property rights. It was, in many ways, more progressive than contemporary European law.' },
      { title: 'The Aqtaban Shubryndy — Years of Great Disaster', content: 'In 1723, the Dzungar Khanate launched a genocidal invasion that killed an estimated third of all Kazakhs. Known as "Aqtaban Shubryndy" (Barefoot Flight), survivors fled in all directions, many dying of starvation and exposure. This catastrophe became the defining trauma of Kazakh history. But from the ashes rose an unprecedented unity: the three Zhuzes elected a supreme commander, Abylay Khan, and launched a coordinated counter-offensive that would ultimately destroy the Dzungar threat.' },
      { title: 'Kenesary — The Last Khan', content: 'Kenesary Kasymov (1802-1847) was the last Khan of the Kazakh Khanate. For nearly a decade, he led a guerrilla war against Russian Imperial expansion, using classic nomadic tactics — mobility, hit-and-run raids, and superior knowledge of terrain. He unified all three Zhuzes under his banner for the final time. His execution in 1847 marked the official end of the Khanate, but his resistance became a foundational myth of Kazakh national consciousness.' },
    ],
    subEras: [
      { title: 'Formation Period', period: '1465 — 1550', content: 'Founding of the Khanate. Rapid expansion under Qasym Khan, who increased the population to 1 million. First references to the "Kazakh" people in written sources.' },
      { title: 'Golden Age under Tauke Khan', period: '1680 — 1718', content: 'Legal codification, diplomatic achievements, and cultural flowering. United all three Zhuzes. Maintained peace with both Russia and China.' },
      { title: 'Dzungar Wars & Recovery', period: '1718 — 1771', content: 'Existential struggle against Dzungar invasion. Aqtaban Shubryndy disaster. Recovery under Abylay Khan. Dzungar Khanate finally destroyed by China in 1758.' },
      { title: 'Colonial Absorption', period: '1731 — 1847', content: 'Gradual Russian expansion. Junior Zhuz accepted Russian "protection" in 1731. Kenesary Khan\'s last resistance. End of traditional governance.' },
    ],
    keyFigures: [
      { name: 'Kerei Khan', role: 'Co-Founder (1465)', desc: 'Led the initial migration from the Uzbek Khanate and became the first Khan of the Kazakh people.' },
      { name: 'Abylay Khan', role: 'Supreme Khan (1711-1781)', desc: 'United all three Zhuzes against the Dzungars. Master diplomat who maintained independence between Russia and China.' },
      { name: 'Kenesary Khan', role: 'Last Khan (1802-1847)', desc: 'Led the final armed resistance against Russian colonization. National hero of Kazakhstan.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/chapan.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/embroidery.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/wood_carving.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/felt_making.jpg',
    ],
  },
  {
    id: 'soviet',
    year: '1920 — 1991',
    title: 'The Soviet Era',
    subtitle: 'Industry, Iron, and Space',
    description: 'A time of radical transformation. The steppe was industrialized, cities rose, and humanity reached the stars from Kazakh soil.',
    longDescription: 'The Soviet period was Kazakhstan\'s most traumatic and transformative era. Forced collectivization in the 1930s killed an estimated 1.5 million Kazakhs — roughly 40% of the population — in an artificial famine. Yet the same period saw massive industrialization, the creation of modern cities, and arguably humanity\'s greatest achievement: the first spaceflight, launched from the Baikonur Cosmodrome on Kazakh soil. The nuclear testing program at Semipalatinsk detonated 456 nuclear devices over 40 years, leaving a legacy of radiation illness. This era of extremes — genocide alongside space exploration, cultural suppression alongside modernization — shaped the contradictions of modern Kazakhstan.',
    image: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abay_qunanbayuli.jpg',
    stats: [
      { label: 'Space', value: 'Baikonur Cosmodrome (1955)' },
      { label: 'Tragedy', value: 'Asharshylyk Famine (1.5M dead)' },
      { label: 'Nuclear Tests', value: '456 at Semipalatinsk' },
      { label: 'Resistance', value: 'Jeltoqsan (Dec 1986)' },
    ],
    chapters: [
      { title: 'Asharshylyk — The Great Famine', content: 'Between 1931-1933, Soviet forced collectivization destroyed nomadic life. Livestock herds — the foundation of Kazakh existence for millennia — were confiscated. An estimated 1.5 million Kazakhs died of starvation, and another million fled to China, Mongolia, and Turkey. The Kazakh population dropped from 3.6 million to 2.2 million. This was the deadliest peacetime catastrophe in Kazakhstan\'s history, comparable in scale to the Ukrainian Holodomor. For decades, speaking about it was forbidden.' },
      { title: 'Gateway to the Stars — Baikonur', content: 'On October 4, 1957, from the flat steppe of southern Kazakhstan, Sputnik became the first human-made object in orbit. On April 12, 1961, Yuri Gagarin launched from the same pad, becoming the first human in space. For decades, Baikonur was the world\'s primary launchpad — every Soviet and Russian crewed mission launched from Kazakh soil. Today it remains the world\'s first and largest operational space launch facility.' },
      { title: 'The Nuclear Polygon', content: 'From 1949 to 1989, the Soviet Union detonated 456 nuclear devices at the Semipalatinsk Test Site — an area the size of Belgium. Local populations were not evacuated. Generations suffered from cancer, birth defects, and radiation illness. In 1989, Kazakh poet and activist Olzhas Suleimenov launched the Nevada-Semipalatinsk anti-nuclear movement, one of the largest grassroots campaigns in Soviet history. The test site closed on August 29, 1991.' },
      { title: 'Jeltoqsan — The December Uprising', content: 'On December 16, 1986, when Moscow replaced the Kazakh Communist Party leader with a Russian, thousands of young Kazakhs took to the streets of Almaty. It was the first mass protest against Soviet national policy. The uprising was crushed with force — dozens killed, hundreds imprisoned. But it became a catalyst: December 16 is now Kazakhstan\'s Independence Day.' },
    ],
    subEras: [
      { title: 'Collectivization & Famine', period: '1929 — 1934', content: 'Forced sedentarization. Livestock confiscation. Asharshylyk famine kills 40% of Kazakh population. Mass flight to neighboring countries.' },
      { title: 'Industrialization & Virgin Lands', period: '1940 — 1965', content: 'WWII evacuations brought 500+ factories to Kazakhstan. Khrushchev\'s Virgin Lands campaign (1954) plowed 25 million hectares of steppe.' },
      { title: 'Space Age', period: '1955 — 1991', content: 'Baikonur Cosmodrome built. Sputnik, Gagarin, Buran shuttle. Kazakhstan became the world\'s launchpad.' },
    ],
    keyFigures: [
      { name: 'Olzhas Suleimenov', role: 'Poet & Activist', desc: 'Founded Nevada-Semipalatinsk movement. His anti-nuclear campaign helped close the test site and influenced global disarmament.' },
      { name: 'Dinmukhamed Kunayev', role: 'Party Leader (1960-1986)', desc: 'Led Kazakh SSR for 25 years. His removal triggered the Jeltoqsan uprising.' },
      { name: 'Tokhtar Aubakirov', role: 'Cosmonaut', desc: 'First ethnic Kazakh in space (1991). Fighter pilot who tested the Buran shuttle.' },
    ],
    gallery: [
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/shokan_walikhanov.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kurmangazy.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/dina_nurpeisova.jpg',
      'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abay_qunanbayuli.jpg',
    ],
  },
  {
    id: 'modern',
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
      { title: 'Nuclear Disarmament', content: 'In 1991, Kazakhstan inherited 1,410 nuclear warheads — the 4th largest arsenal on Earth. Under intense international pressure and internal debate, the decision was made to give them all up. Every last warhead was transferred to Russia or dismantled. The Semipalatinsk test site was permanently closed. This act of historic renunciation earned Kazakhstan global respect and became the foundation of its identity as a peace broker. The country is now a leading voice in the Treaty on the Non-Proliferation of Nuclear Weapons.' },
      { title: 'Astana — City of Future', content: 'In 1997, the capital was moved from the leafy, mountainous Almaty to a windswept town on the northern steppe. The gamble seemed insane. But within two decades, Astana became a showcase of 21st-century architecture: Norman Foster\'s Khan Shatyr (the world\'s largest tent), the Baiterek tower, the Palace of Peace and Reconciliation. The city is a manifesto in glass and steel — a declaration that a nomadic people could build the future as brilliantly as they had roamed the past.' },
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

/* ═══════════════════════════════════════════
   ERA TIMELINE CARD
   ═══════════════════════════════════════════ */
const EraCard = ({ era, index, onOpen, t }: { era: EraDetail; index: number; onOpen: (e: EraDetail) => void; t: (key: string) => string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.2, 1, 1, 0]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className="relative min-h-[85vh] flex items-center justify-center py-16 md:py-20">
      <div onClick={() => onOpen(era)} className="relative w-full max-w-6xl aspect-[16/9] md:aspect-[21/9] cursor-pointer group">
        <div className="absolute inset-0 overflow-hidden border border-white/10 group-hover:border-amber-500/40 transition-colors duration-700 bg-black">
          <motion.div style={{ scale: 1.1, y: parallaxY }} className="w-full h-full">
            <ResponsiveImage src={era.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>

        <div className="absolute top-0 bottom-0 left-0 max-w-2xl p-8 md:p-16 flex flex-col justify-center z-20 pointer-events-none">
          <span className="block text-xs font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3" style={{ color: AMBER }}>
            <span className="w-8 h-[2px]" style={{ backgroundColor: AMBER }} />
            {era.year}
          </span>
          <h2 className="text-4xl md:text-8xl font-black uppercase leading-[0.85] text-white mb-4 drop-shadow-2xl">
            {era.title}
          </h2>
          <p className="text-base md:text-lg text-white/60 mb-6 max-w-lg">{era.subtitle}</p>
          <p className="text-xs text-white/35 mb-8 max-w-md leading-relaxed hidden md:block">{era.description}</p>

          <div className="pointer-events-auto">
            <button className="group/btn flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              <span className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="opacity-50 group-hover/btn:opacity-100 transition-opacity">{t('history_enter_era') || 'Enter This Era'}</span>
            </button>
          </div>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[12rem] md:text-[22rem] font-black text-white/[0.03] leading-none select-none pointer-events-none">
          0{index + 1}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   FULL ERA DETAIL VIEW
   ═══════════════════════════════════════════ */
const EraDetailView = ({ era, onClose }: { era: EraDetail; onClose: () => void }) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (containerRef.current) containerRef.current.scrollTop = 0;
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
      transition={{ duration: 0.6, ease: EASE }} className="fixed inset-0 z-[100] bg-[#0a0a0a] text-[#F5F1EC] flex flex-col overflow-hidden"
      style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Header */}
      <div className="flex-none h-16 border-b border-white/10 flex items-center justify-between px-6 pr-16 md:px-10 bg-[#0a0a0a]/90 backdrop-blur-md z-50 relative">
        <button onClick={onClose} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:text-amber-500 transition-colors cursor-pointer">
          <div className="w-8 h-8 border border-white/20 flex items-center justify-center group-hover:border-amber-500 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="hidden md:inline">{t('back_to_timeline') || 'Back'}</span>
        </button>
        <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] opacity-30">{era.title} — {era.year}</span>
        <motion.div className="absolute bottom-0 left-0 h-[2px]" style={{ width: progressWidth, backgroundColor: AMBER }} />
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto">
        {/* Hero */}
        <div className="relative h-[70vh] md:h-[80vh] w-full">
          <ResponsiveImage src={era.image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="block text-5xl md:text-[8rem] font-black text-white/[0.06] leading-none mb-[-1vw] select-none">
              {era.year.split(' ')[0]}
            </motion.span>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px]" style={{ backgroundColor: AMBER }} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: AMBER }}>{era.year}</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-4xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-4 max-w-5xl">
              {era.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.5 }}
              className="text-sm md:text-base max-w-2xl">{era.subtitle}</motion.p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
          {/* Stats + Description */}
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 pb-16 border-b border-white/5">
              <div className="lg:col-span-8">
                <p className="text-lg md:text-2xl leading-relaxed opacity-70 mb-10">{era.longDescription}</p>
                <div className="flex flex-wrap gap-3">
                  {era.stats.map((stat, i) => (
                    <div key={i} className="bg-white/[0.03] px-5 py-3 border border-white/5">
                      <span className="block text-[8px] uppercase tracking-widest opacity-35 mb-1">{stat.label}</span>
                      <span className="block text-sm font-black" style={{ color: AMBER }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4 border-l border-white/5 pl-8 hidden lg:block">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6">{t('history_toc') || 'Contents'}</span>
                <ul className="space-y-3">
                  {era.chapters.map((c, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs opacity-50">
                      <span style={{ color: AMBER }}>0{i + 1}</span> {c.title}
                    </li>
                  ))}
                </ul>
                {era.subEras.length > 0 && (
                  <>
                    <span className="block text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-4 mt-8">Sub-Eras</span>
                    <ul className="space-y-2">
                      {era.subEras.map((s, i) => (
                        <li key={i} className="text-[10px] opacity-35">{s.period} — {s.title}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </Reveal>

          {/* Chapters */}
          <div className="space-y-24 md:space-y-32">
            {era.chapters.map((chapter, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-20 items-start`}>
                  <div className="w-full lg:w-5/12 relative group">
                    <div className="aspect-[4/5] overflow-hidden relative z-10">
                      <ResponsiveImage src={era.gallery[i] || era.gallery[0]}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0" />
                      <div className="absolute inset-0 bg-[#0a0a0a]/10 mix-blend-multiply" />
                    </div>
                    <div className={`absolute top-6 ${i % 2 === 0 ? '-right-6' : '-left-6'} w-full h-full border border-white/5 z-0 hidden lg:block`} />
                  </div>
                  <div className="w-full lg:w-7/12">
                    <span className="text-[8rem] md:text-[10rem] font-black text-white/[0.03] block leading-none mb-[-2rem] select-none">0{i + 1}</span>
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-6 relative inline-block">
                      {chapter.title}
                      <span className="absolute -bottom-2 left-0 w-1/3 h-[2px]" style={{ backgroundColor: AMBER }} />
                    </h3>
                    <p className="text-sm md:text-base text-white/60 leading-[1.9] text-justify first-letter:text-4xl first-letter:font-black first-letter:mr-2 first-letter:float-left" style={{ color: `${AMBER}` }}>
                      <span style={{ color: 'rgba(245,241,236,0.6)' }}>{chapter.content}</span>
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Sub-Eras Timeline */}
          {era.subEras.length > 0 && (
            <Reveal className="mt-28 pt-16 border-t border-white/5">
              <h3 className="text-center text-[10px] font-black uppercase tracking-[0.5em] mb-12 opacity-40">
                {t('history_sub_eras') || 'Sub-Eras & Periods'}
              </h3>
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
                <div className="space-y-12">
                  {era.subEras.map((sub, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? '' : 'md:flex-row-reverse'} items-start gap-8 md:gap-0`}>
                      <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-10 md:pl-0`}>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] block mb-2" style={{ color: AMBER }}>{sub.period}</span>
                        <h4 className="text-lg md:text-xl font-black uppercase tracking-tight mb-3">{sub.title}</h4>
                        <p className="text-xs text-white/40 leading-relaxed">{sub.content}</p>
                      </div>
                      <div className="absolute left-4 md:left-1/2 top-1 w-3 h-3 border-2 -translate-x-1/2 bg-[#0a0a0a]" style={{ borderColor: AMBER }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Key Figures */}
          {era.keyFigures.length > 0 && (
            <Reveal className="mt-28 pt-16 border-t border-white/5">
              <h3 className="text-center text-[10px] font-black uppercase tracking-[0.5em] mb-12 opacity-40">
                {t('history_key_figures') || 'Key Figures'}
              </h3>
              <div className="grid md:grid-cols-3 gap-[1px]" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                {era.keyFigures.map((fig, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="bg-[#0a0a0a] p-8">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] block mb-2" style={{ color: AMBER }}>{fig.role}</span>
                    <h4 className="text-lg font-black uppercase tracking-tight mb-4">{fig.name}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{fig.desc}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Gallery */}
          <Reveal className="mt-28 pt-16 border-t border-white/5">
            <h3 className="text-center text-[10px] font-black uppercase tracking-[0.5em] mb-12 opacity-40">
              {t('history_visual_archive') || 'Visual Archive'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] h-[50vh]">
              {era.gallery.map((img, i) => (
                <div key={i} className={`relative overflow-hidden group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                  <ResponsiveImage src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[40%] group-hover:grayscale-0" />
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-24 text-center opacity-20 pb-24">
            <p className="text-[9px] uppercase tracking-widest">{t('history_end_record') || 'End of Record'} — {era.title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export const HistoryPage = () => {
  const { theme } = useSeason();
  const { language, t } = useLanguage();
  const [activeEra, setActiveEra] = useState<EraDetail | null>(null);

  // For now, EN-only data (RU/KZ would need full translation of the expanded content)
  const content = ERAS_EN;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a] text-[#F5F1EC] relative overflow-x-hidden" style={{ fontFamily: 'Montserrat, sans-serif' }}>

        {/* Hero */}
        <div className="h-[80vh] flex flex-col items-center justify-center relative z-10 px-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] border border-white/[0.03]" style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] border border-white/[0.03]" style={{ transform: 'translate(-50%, -50%) rotate(22.5deg)' }} />

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-[1px]" style={{ backgroundColor: AMBER }} />
              <span className="text-[9px] font-black uppercase tracking-[0.6em]" style={{ color: AMBER }}>
                {t('history_archives') || 'The Archives'}
              </span>
              <div className="w-12 h-[1px]" style={{ backgroundColor: AMBER }} />
            </div>
            <h1 className="text-5xl md:text-[7rem] font-black uppercase leading-[0.8] tracking-tighter text-center mb-6">
              {t('timelines_title') || 'Timelines'}
            </h1>
            <p className="text-xs md:text-sm text-center opacity-30 max-w-lg mx-auto leading-relaxed uppercase tracking-widest">
              {language === 'ru' ? '3000 лет истории — от золотых воинов до космической эры'
                : language === 'kz' ? '3000 жыл тарих — алтын сарбаздардан ғарыш дәуіріне дейін'
                : '3,000 years of history — from golden warriors to the space age'}
            </p>
          </motion.div>

          <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-40">
            <div className="w-px h-14" style={{ background: `linear-gradient(to bottom, ${AMBER}, transparent)` }} />
            <span className="text-[8px] uppercase tracking-[0.3em]">{t('history_scroll_drive') || 'Scroll to explore'}</span>
          </div>
        </div>

        {/* Era count strip */}
        <div className="flex justify-center gap-8 py-8 border-y border-white/5 mb-8">
          {content.map((era, i) => (
            <button key={era.id} onClick={() => setActiveEra(era)}
              className="flex flex-col items-center gap-2 opacity-30 hover:opacity-70 transition-opacity cursor-pointer">
              <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: AMBER }}>0{i + 1}</span>
              <span className="text-[7px] font-black uppercase tracking-wider hidden md:block">{era.title}</span>
            </button>
          ))}
        </div>

        {/* Era Cards */}
        <div className="relative z-10 pb-32">
          {content.map((era, i) => (
            <EraCard key={era.id} era={era} index={i} onOpen={setActiveEra} t={t} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeEra && <EraDetailView era={activeEra} onClose={() => setActiveEra(null)} />}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};