import { 
    Music, Book, Sparkles, Heart, User, Layers 
} from '../../ui/icons';
import { IMAGES, ASSETS, UNSPLASH } from './images'; 
import dombraImg from 'figma:asset/2a1a999b8dd927b5e4403bc5a228394d597ffe73.png';
import kobyzImg from 'figma:asset/7f87844e544184dd0fb72fd13610100980ea82e3.png';
import zhetigenImg from 'figma:asset/80d9e2a6cdf51e612abec873620d5e03d4b62b5f.png';
import sherterImg from 'figma:asset/44c0d112942298f0c828352cf7b2cc2862d69e6b.png';
import sazsyrnayImg from 'figma:asset/1c189c500fb7b696d9890eae2ac31da3e3e23387.png';
import shankobyzImg from 'figma:asset/a9659c7629338bfa7bce2f51da9e89e9456265c2.png';
import dauylpazImg from 'figma:asset/cf5748dbae1f2a03dabe15b2ca75ca5db5d7e95c.png';
import adyrnaImg from 'figma:asset/e395541ff2719ddb07c2e2ab138344d95aa10b41.png';

export const en = {
    title: 'STEPPE HERITAGE',
    subtitle: 'Artifacts of the nomadic civilization',
    archiveLabel: 'Cultural Heritage',
    artifactLabel: 'Artifact',
    culturalArtifact: 'Cultural Artifact',
    specifications: 'Specifications',
    historyTitle: 'In-Depth Exploration',
    viewDetails: 'View Details',
    sections: [
      { id: 'music', title: 'Musical Instruments', icon: Music, label: 'ARTIFACT_01' },
      { id: 'lore', title: 'Ancient Lore', icon: Book, label: 'ARTIFACT_02' },
      { id: 'crafts', title: 'Craftsmanship', icon: Sparkles, label: 'ARTIFACT_03' },
      { id: 'cuisine', title: 'National Cuisine', icon: Heart, label: 'TASTE_04' },
      { id: 'people', title: 'Great Figures', icon: User, label: 'PERSON_05' },
      { id: 'clothing', title: 'National Clothing', icon: Layers, label: 'WEAR_06' }
    ],
    items: {
      music: [
        {
          id: 'm1', name: 'Dombra', desc: 'The soul of the Kazakh people.',
          details: [
            { title: 'The Legend of Aksak Kulan', content: 'The Dombra is not merely an instrument but a chronicler of history. Its origin is enshrined in the tragic legend of "Aksak Kulan" (The Lame Onager). When Jochi Khan, the eldest son of Genghis Khan, perished during a hunt for wild donkeys, no subject dared deliver the news to the Great Khan, who had threatened to pour molten lead down the throat of the bearer of bad tidings. The great bard Ketbuqa volunteered. He did not speak a word but played a "kui" (instrumental epic) on his dombra. The music mimicked the thundering hooves of the hunt, the whiz of arrows, the scream of the wounded animal, and the silence of death. Genghis Khan understood the message instantly. True to his word, he punished the "messenger"—the dombra itself—by ordering molten lead to be poured into its sound hole. This act burned a small opening into the instrument, giving the dombra its modern form and unique resonance.' },
            { title: 'Organology & Craftsmanship', content: 'The Dombra is a long-necked, two-stringed lute with a pear-shaped body. Traditionally, it is carved from a single piece of hardwood, typically pine for the soundboard to ensure brightness, and maple or birch for the body to provide durability and warmth. The neck is fitted with frets made of gut (now often nylon), which can be adjusted to tune the instrument to a variety of scales. There are two primary tuning systems: "Ozhau" (quart) and "Sadak" (quint), which dictate the tension and tonal color. Modern dombras often use fishing line or specialized nylon strings, but historically, sheep or goat gut was used, producing a softer, more organic timbre.' },
            { title: 'Regional Schools: Tokpe vs. Shertpe', content: 'The vast geography of Kazakhstan birthed two distinct playing styles. The Western school ("Tokpe") relies on vigorous, full-hand strumming techniques that produce a loud, percussive, and driving sound, reflecting the militant spirit of the western clans; the legendary Kurmangazy is the icon of this style. In contrast, the Eastern and Southern school ("Shertpe") employs delicate finger-picking techniques, where individual strings are plucked to create lyrical, melodic, and philosophical compositions. This style, championed by Tattimbet, is contemplative, mimicking the gentle flow of rivers and the singing of birds.' },
            { title: 'Cultural Significance', content: 'The Dombra is the centerpiece of the "Aitys", a musical duel of wit and improvisation between poets (akyns). These contests served as the primary media of the steppe, where news was shared, and social grievances were aired before rulers. A dombra hangs in the place of honor (tor) in every traditional Kazakh home, believed to hold the spirits of the ancestors. To step over a dombra or place it on the ground is considered a grave sin.' }
          ],
          image: dombraImg, specs: { strings: '2 (Nylon)', body: 'Pine/Birch', range: '2 Octaves', length: '100-120 cm' }
        },
        {
          id: 'm2', name: 'Kyl-kobyz', desc: 'Mystical bridge to the spirit world.',
          details: [
            { title: 'The First Shaman', content: 'The Kyl-kobyz is inextricably linked to Korkyt Ata, the mythical father of Turkic music and the first "Baksy" (shaman). Tormented by the realization of inevitable death, Korkyt sought immortality. He retreated to the banks of the Syr Darya river, sacrificed his camel, and constructed the first kobyz from its skin and wood. As he played, nature suspended its laws: birds stopped flying, the wind ceased blowing, and death itself could not approach him. Thus, the kobyz was born not as entertainment, but as a weapon against mortality and a vessel for eternal life.' },
            { title: 'Acoustic Mysticism', content: 'The kobyz is one of the most ancient bowed instruments in existence, a direct ancestor of the violin. It has no top soundboard; instead, its body is an open wooden bowl, half-covered with camel skin. This open chamber acts as a powerful resonator. The two strings are made of unspun horsehair, each bundle containing 60 to 80 individual hairs. This loose bundle allows for the production of rich upper harmonics and overtones. When played, the friction creates a "hissing" or "wheezing" undertone that is prized for its resemblance to the sounds of the steppe wind, the howl of wolves, and the cry of swans.' },
            { title: 'Ritual Use', content: 'For centuries, the kobyz was the exclusive tool of the Baksy. It was believed that the spirits (aruaks) were attracted to its sound. Shamans used the instrument to enter trance states, heal the sick, and divine the future. The neck of a shaman\'s kobyz was often adorned with metal ringlets and owl feathers, which rattled and hissed during play, adding a percussive layer to the drone. Even today, listening to the kobyz is considered a form of sonic therapy ("Kuy-therapy"), believed to cleanse the aura and realign the listener\'s biological rhythms.' },
            { title: 'Modern Revival', content: 'During the Soviet era, the kobyz was suppressed due to its association with shamanism and religion. It was nearly extinct by the mid-20th century. However, a modified "Prima-Kobyz" was developed for orchestras, resembling a violin. Since independence, there has been a massive resurgence of the authentic "Kyl-kobyz" (hair-kobyz), with young musicians relearning the ancient guttural playing techniques and reclaiming the instrument\'s spiritual heritage.' }
          ],
          image: kobyzImg, specs: { strings: '2 (Horsehair)', body: 'Carved wood', skin: 'Camel', origin: 'Before 8th century' }
        },
        {
          id: 'm3', name: 'Sherter', desc: 'Ancient ancestor of the Dombra.',
          details: [
            { title: 'Historical Context', content: 'The Sherter is a small, ancient plucked instrument that predates the Dombra, serving as a primitive prototype for many Central Asian lutes. It was historically the instrument of shepherds and herdsmen, used to pass the time during long, solitary days in the vast pastures. Unlike the courtly instruments of the khans, the Sherter was the voice of the common nomad, accompanying simple folk songs, legends, and mimicry of animal sounds.' },
            { title: 'Construction Differences', content: 'While similar in silhouette to the Dombra, the Sherter is significantly smaller and has a distinct construction. Its body was traditionally carved from a single block of wood and covered with raw hide (leather) rather than a wooden soundboard, similar to the Kobyz. This leather membrane gives it a distinct, punchy, and percussive sound. It typically had two or three strings made of twisted horsehair or gut, and unlike the fretted Dombra, the Sherter often had a fretless neck, allowing for microtonal slides.' },
            { title: 'The Sound of the Pastures', content: 'The timbre of the Sherter is described as "piercing" and "strong," capable of carrying over the open steppe wind better than the softer Dombra. Its repertoire is deeply connected to nature; melodies often imitate the call of the cuckoo, the trot of a horse, or the bleating of sheep. It was an essential tool for "Kui-legend" storytelling, where short musical interludes were interspersed with spoken word narratives.' },
            { title: 'Revival from Obscurity', content: 'By the 19th and early 20th centuries, the Sherter had largely fallen out of use, replaced by the more versatile Dombra. It survived only in remote museum collections and ethnographic descriptions. In the 1980s, master luthier Orazai Beysembayev reconstructed the instrument based on ancient descriptions. Today, it has found a new life in folk-ethnographic ensembles like Otrar Sazy and Turan, providing an archaic, gritty texture that grounds modern compositions in deep history.' }
          ],
          image: sherterImg, specs: { strings: '3 (Gut)', body: 'Leather/Wood', type: 'Plucked', role: 'Storytelling' }
        },
        {
          id: 'm4', name: 'Zhetigen', desc: 'The ancient harp of the steppe.',
          details: [
             { title: 'The Legend of Seven Sons', content: 'The origin of the Zhetigen is wrapped in profound tragedy. Legend tells of an old man in a remote village who lost his seven sons to a devastating famine/plague one by one. For each son who died, the grieving father stretched a string across a hollow log and composed a mourning melody (kui). The first string sang for the eldest, the last for the youngest. The instrument thus became known as "Zhety-gan" (Seven Songs or Seven Souls). It is an instrument born of grief, designed to express the deepest sorrows of the human heart.' },
             { title: 'Structural Design', content: 'The Zhetigen is a plucked box zither, functionally the horizontal harp of the Kazakhs. It consists of a rectangular wooden soundbox, typically 1 to 1.5 meters long. Seven strings (traditionally horsehair, now steel or nylon) are stretched across the body. What makes the Zhetigen unique is its tuning mechanism: beneath each string lies a movable bridge made of an "Asyk" (sheep ankle bone). By sliding these bones left or right, the musician changes the tension and pitch of the string. This primitive yet ingenious design allows for infinite micro-tuning possibilities.' },
             { title: 'Silk Road Connections', content: 'The Zhetigen belongs to a family of long zithers found across the Silk Road, including the Chinese Guzheng, the Japanese Koto, and the Turkish Kanun. This demonstrates the deep cultural exchange between the Turkic nomads and the civilizations of East Asia. Unlike the complex polyphony of the Guzheng, the Zhetigen style preserves the pentatonic purity and the rhythmic "gallop" characteristic of steppe music.' },
             { title: 'Playing Technique', content: 'The instrument is placed on the knees or a low table. The musician plucks the strings with the right hand while the left hand can press the strings behind the bridges to bend the pitch, creating a "crying" or "wavering" effect (vibrato) that mimics the human voice. The sound is water-like, resonant, and meditative. Modern Zhetigens have been expanded to 21 strings or more to accommodate complex orchestral works, but the 7-string version remains the spiritual standard.' }
          ],
          image: zhetigenImg, specs: { strings: '7 (Horsehair)', body: 'Wooden box', bridges: 'Asyk (Bone)', type: 'Plucked' }
        },
        {
          id: 'm5', name: 'Sybyzgy', desc: 'Shepherd\'s wind instrument.',
          details: [
             { title: 'The Shepherd\'s Companion', content: 'The Sybyzgy is perhaps the most democratic and ubiquitous instrument of the ancient steppe. It required no luthier to build; a shepherd could cut a hollow reed (kurai) growing by the riverbank, bore three or four holes with a heated knife, and have an instrument ready in minutes. It was the constant companion of men who spent weeks alone in the mountains and valleys. Through the Sybyzgy, they communicated not with people, but with the environment—mimicking the rushing of mountain streams, the cry of eagles, and the whisper of the grass.' },
             { title: 'Throat-Singing Hybrid', content: 'The simplicity of the Sybyzgy\'s construction belies the immense difficulty of its technique. It is an end-blown flute with no mouthpiece (like a Ney). To produce a sound, the musician must shape their embouchure perfectly against the sharp rim. Crucially, the traditional technique involves "humming" a drone note with the vocal cords while simultaneously blowing into the flute. This creates a two-part polyphony: the low, guttural drone of the throat and the high, whistling melody of the flute. This technique is closely related to the throat singing (kai/zhyrau) traditions of the Altai.' },
             { title: 'Regional Variations', content: 'There are two main types of Sybyzgy. The Eastern (Altai/Mongolian) style uses a shorter, wider instrument made of wood (larch or apricot) or soft stone, producing a loud, trumpet-like sound suitable for open mountains. The Western and Southern style uses a longer, thinner reed instrument, producing a softer, breathier, and more intimate sound. Due to the fragility of the reed, few ancient Sybyzgy have survived; they were ephemeral instruments, returning to the earth when they broke.' },
             { title: 'Repertoire', content: 'Sybyzgy music is almost entirely programmatic. Kuis have titles like "The Lame Crane," "The Howling Wolf," or "The Rushing River." They tell stories without words. In the past, hunters used the Sybyzgy to lure male deer during mating season or to calm frightened horses during a storm. It represents the absolute integration of the nomad into the natural soundscape.' }
          ],
          image: ASSETS.sybyzgy, specs: { holes: '3-4', material: 'Reed/Wood', type: 'Wind', length: '60-65 cm' }
        },
        {
          id: 'm6', name: 'Adyrna', desc: 'Ancient bow-shaped harp.',
          details: [
              { title: 'Weapon of War and Peace', content: 'The Adyrna is one of the most visually striking examples of organology mimicking utility. Its shape is directly derived from the nomadic hunting bow (adyrna). Originally, it was likely just a bow with extra strings attached, played to pass time before a hunt. Over centuries, it evolved into a dedicated instrument, with the wooden frame stylized to resemble the horns of a ram, a deer, or a camel. It bridges the gap between the tools of survival (hunting) and the tools of culture (music).' },
              { title: 'Construction & Play', content: 'The Adyrna acts as a frame harp. The body is hollowed out of wood and covered with tanned leather to serve as a resonator. Strings made of camel wool or gut are stretched vertically across the frame. The musician plays it sitting down, holding the instrument on their lap or knees, plucking the strings with the fingers of both hands. The sound is soft, rustling, and percussive, often providing the rhythmic texture in ancient ensembles.' },
              { title: 'Totemic Function', content: 'In the pre-Islamic Tengriist worldview, the Adyrna had a sacred function. It was played before military campaigns and major hunts to appease the spirits of the animals and ensure success. The zoomorphic shape (often looking like a running deer) was not merely decorative but totemic, serving as a vessel for the spirit of the prey. The vibration of the strings was believed to mimic the tension of the bowstring released in battle.' },
              { title: 'Revival', content: 'Like many ancient instruments, the Adyrna disappeared from daily life by the 19th century. It was reconstructed in the late 20th century based on archaeological finds and petroglyphs. Today, it is a staple of ethno-folk groups like "Turan" and "Hassak," where it is used to evoke the archaic atmosphere of the Scythian and Hunnic eras.' }
          ],
          image: adyrnaImg, specs: { strings: 'Multiple (Gut)', body: 'Hollow wood', shape: 'Bow/Deer', type: 'Plucked' }
        },
        {
          id: 'm7', name: 'Sazsyrnay', desc: 'Clay ocarina.',
          details: [
              { title: 'Resurrection from Ruins', content: 'The Sazsyrnay is a testament to the durability of culture. For centuries, this instrument was forgotten, buried under the sands of time. It was only in the 1970s, during archaeological excavations of the medieval city of Otrar (destroyed by Mongols in 1219), that intact clay whistles were found. Scientists and musicians worked together to analyze the finger holes and reconstruct the tuning system, bringing the "voice of Otrar" back to life after 800 years of silence.' },
              { title: 'Simplicity and Sophistication', content: 'The name translates simply to "Clay Flute" (Saz = clay, Syrnay = flute). It is a vessel flute or ocarina, typically shaped like a goose egg or a stylized bird. It usually has 3 to 6 finger holes. Despite its primitive appearance, a master player can extract a full diatonic scale and chromatic inflections from it. The clay material gives it a distinctive timbre: duller and warmer than wood, with a "hissing" quality that sounds like the wind blowing through the ruins of an ancient city.' },
              { title: 'Child\'s Toy to Masterpiece', content: 'Originally, the Sazsyrnay was likely a toy for children or a simple instrument for commoners who could not afford expensive crafted lutes. It was used to imitate bird calls. However, in the hands of modern virtuosos, it has become a solo instrument capable of expressing deep melancholy ("mung"). It is particularly effective in slow, lyrical pieces that evoke the vast, empty distances of the steppe and the feeling of nostalgia for a lost golden age.' },
              { title: 'The Elements', content: 'The Sazsyrnay represents the union of the four elements: Earth (clay), Water (to mold it), Fire (to bake it), and Air (to play it). This elemental nature gives it a grounding presence in musical ensembles, often used to introduce a piece with a haunting, atmospheric melody.' }
          ],
          image: sazsyrnayImg, specs: { holes: '4-6', material: 'Clay (Ceramic)', type: 'Ocarina', sound: 'Soft/Warm' }
        },
        {
          id: 'm8', name: 'Shankobyz', desc: 'Kazakh jaw harp.',
          details: [
              { title: 'The Internal Orchestra', content: 'The Shankobyz (Jew\'s harp or Jaw harp) is a lamellophone made of silver or steel. It is unique because the instrument itself produces very little sound; the true "instrument" is the player\'s own body. By placing the frame against the teeth and plucking the metal tongue, the player uses their oral cavity, throat, and diaphragm as a variable resonator. By changing the shape of the mouth, moving the tongue, and altering breathing, the player isolates specific overtones, creating a melody from a single fundamental pitch.' },
              { title: 'Feminine Tradition', content: 'While played by men in some cultures, in the Kazakh steppe, the Shankobyz was traditionally a woman\'s instrument. It was small, easy to hide, and its quiet volume made it suitable for the domestic sphere—inside the yurt. Mothers used it to lull babies to sleep or to entertain children with "musical stories." It was also a discreet way for young lovers to communicate signals or sentiments without words.' },
              { title: 'Shamanic Roots', content: 'Like the Kobyz, the Shankobyz has shamanic associations. Its buzzing, continuous drone can induce trance states. Baksys used it to "spin" a web of sound to trap evil spirits. The vibration of the metal against the skull is intense for the player, creating a psycho-acoustic effect of detachment from reality.' },
              { title: 'Techno of the Steppe', content: 'In modern times, the Shankobyz has been revealed as a powerhouse of rhythm. Virtuosos can execute rapid-fire rhythms, breathing techniques, and glottal stops that mimic the galloping of horses or even modern electronic techno beats. It serves as the rhythmic engine in many ethno-rock fusions.' }
          ],
          image: shankobyzImg, specs: { material: 'Steel/Silver', type: 'Lamellophone', technique: 'Breathing', size: 'Small' }
        },
        {
          id: 'm9', name: 'Dauylpaz', desc: 'Military kettle drum.',
          details: [
              { title: 'Voice of the Horde', content: 'The Dauylpaz is the martial voice of the Kazakh people. It is a cauldron-shaped drum (kettle drum) historically used to direct the movement of armies. The Khan or his generals would have the Dauylpaz attached to the saddle of their warhorse. Different rhythmic patterns signaled commands: "Attack," "Retreat," "Gather," or "Camp." Its booming voice cut through the noise of battle and the dust of the march.' },
              { title: 'Construction', content: 'The body was originally carved from wood, but later versions used metal helmets or cauldrons covered with stretched raw camel or bull hide. It was played with a "tokpak"—a wooden beater often shaped like a hook or wrapped in leather. The sound is low, resonant, and thunderous. Unlike the intricate rhythms of the Dombra, the Dauylpaz plays primal, driving pulses.' },
              { title: 'Hunting Aid', content: 'Beyond war, the Dauylpaz was a tool for falconry and hunting. Beating the drum would flush game birds out of the reeds or scare wolves and foxes into the open where eagles and dogs could catch them. It was also used to signal the location of the hunting party in the vastness of the steppe.' },
              { title: 'Orchestral Evolution', content: 'In the 20th century, the Dauylpaz was incorporated into the Kazakh folk orchestra as the primary percussion section, fulfilling the role of the timpani. While it has lost its military function, it remains a symbol of the "Sarbaz" (warrior) spirit, providing the heartbeat for epic compositions like "Adai" or "Saryarka."' }
          ],
          image: dauylpazImg, specs: { body: 'Wood/Metal', skin: 'Leather', type: 'Percussion', use: 'Military/Signal' }
        }
      ],
      lore: [
        { 
          id: 'l1', name: 'Golden Man', desc: 'Symbol of independence.', 
          details: [
              { title: 'The Discovery of the Century', content: 'In 1969, near the town of Issyk (50km from Almaty), archaeologists led by K. Akishev uncovered a burial mound that changed history. Inside was the intact skeleton of a young Saka prince (aged 17-18) from the 4th-3rd century BC. He was buried in a suit made of over 4,000 gold plates, arranged like armor. This discovery is often compared to the finding of Tutankhamun\'s tomb in terms of its wealth and significance for national identity.' },
              { title: 'The Animal Style', content: 'The gold ornaments are crafted in the famous Scythian "Animal Style." The headdress alone is a cosmological map: it features gold arrows pointing to the sky (divine connection), snow leopards guarding mountain peaks, winged horses (Tulpars), and birds. This iconography suggests the ruler was viewed as the axis mundi—the center of the world, uniting the underground, terrestrial, and celestial realms. The artistry displays a level of sophistication that rivals Greek or Persian goldsmithing of the same era.' },
              { title: 'The Silver Bowl & Literacy', content: 'Perhaps more valuable than the gold was a small silver bowl found by the prince\'s head. It bears an inscription of 26 characters in an unknown runic script. This single artifact shattered the Eurocentric myth that the nomadic tribes of Central Asia were illiterate barbarians. It proved they had a writing system and a complex culture centuries before the arrival of current dominant scripts. The decipherment of these runes is still debated, but they stand as a testament to intellectual advancement.' },
              { title: 'Modern Symbolism', content: 'The Golden Man (Altyn Adam) has become the primary heraldic symbol of independent Kazakhstan. He stands atop the Independence Monument in Almaty, riding a winged leopard. His image is on banknotes and statues across the country. He represents the deep roots of Kazakh statehood, connecting the modern republic directly to the ancient empires of the Sakas and Huns.' }
          ],
          image: UNSPLASH.goldenman, specs: { era: 'V-IV BC', site: 'Issyk Kurgan', material: 'Gold' } 
        },
        { 
          id: 'l2', name: 'Turkestan', desc: 'Spiritual capital.', 
          details: [
              { title: 'The Grandeur of Timur', content: 'The Mausoleum of Khoja Ahmed Yasawi is a colossus of medieval architecture. It was commissioned in 1389 by the ruthless conqueror Timur (Tamerlane) to replace a smaller 12th-century mausoleum of the famous Sufi teacher. Timur brought the best architects, mosaicists, and engineers from Persia and the Middle East to build it. The structure is massive—39 meters high—with the largest brick dome in Central Asia (18.2m diameter). However, Timur died in 1405, and construction halted. The facade remains unfinished, with scaffolding holes still visible, freezing a moment in history for 600 years.' },
              { title: 'The Taiqazan', content: 'At the center of the main hall (Kazandyk) sits the Taiqazan, a two-ton bronze cauldron cast in 1399. It is a masterpiece of metallurgy, decorated with floral reliefs and Arabic calligraphy. It was used to hold sweetened water for pilgrims. The cauldron was taken to the Hermitage in St. Petersburg in the Soviet era but was returned to Kazakhstan in 1989, an event seen as a harbinger of independence. Its return symbolized the restoration of the nation\'s spiritual vessel.' },
              { title: 'Pantheon of Kings', content: 'For centuries, Turkestan was the political and spiritual capital of the Kazakh Khanate. To be buried near the saint Yasawi was the highest honor. The mausoleum complex contains the graves of the greatest Kazakh Khans (Abylai, Esim, Tauke) and Batyrs (Bogenbay, Kabanbay). It is effectively the Westminster Abbey of the Kazakh steppes. Pilgrims believe that three visits to Turkestan differ little in spiritual merit from one Hajj to Mecca.' },
              { title: 'Sufi Legacy', content: 'Khoja Ahmed Yasawi was the founder of the Yasawiyya order. He played a crucial role in the Islamization of the Turks by adapting Islamic teachings to Tengriist traditions and preaching in the local Turkic language rather than Arabic. His poetry, "Diwani Hikmet" (Book of Wisdom), is still recited today. He spent the last years of his life in an underground cell (hilvet), mourning the Prophet Muhammad\'s death and refusing to see the sun after reaching the age of 63 (the age the Prophet died).' }
          ],
          image: UNSPLASH.turkestan, specs: { built: 'XIV-XV c', architecture: 'Timurid', height: '39 meters' } 
        },
        { 
          id: 'l3', name: 'Korkyt Ata', desc: 'The First Shaman.', 
          details: [
              { title: 'The Chase Against Death', content: 'The legend of Korkyt is one of the foundational myths of the Turkic world. Korkyt was a sage who attained knowledge of the world\'s transience. Terrified by the realization of mortality, he mounted his camel, Jelmaya, and fled. He went East, but saw gravediggers digging a grave. He asked, "Who is this for?" They replied, "For Korkyt." He fled West, North, and South, but everywhere he encountered the same scene: death waiting for him. This allegorical journey signifies the inescapability of fate.' },
              { title: 'Birth of Music', content: 'Exhausted, Korkyt returned to the center of the world—the banks of the Syr Darya river. He sacrificed his camel, stretched its skin over a carved wooden frame, and strung it with horsehair, creating the first Kobyz. He began to play. The music was so beautiful and profound that Time itself stopped. As long as he played, death could not touch him. He poured his soul into the melodies (kuis), finding immortality not in the body, but in the vibrations of art.' },
              { title: 'Patron of the Baksy', content: 'Korkyt is revered as the first Baksy (shaman). He taught the people how to communicate with the spirits of nature and ancestors through music. His legacy establishes the special status of musicians in Kazakh society: they are mediators between worlds. Even today, traditional musicians invoke his name before performing.' },
              { title: 'The Monument', content: 'A modern memorial to Korkyt stands on the banks of the Syr Darya in the Kyzylorda region. It consists of four vertical steles shaped like cobyz necks, facing the four cardinal directions. When the wind blows through the structure, it creates a haunting, organ-like sound, ensuring that Korkyt\'s music continues to play eternally, keeping death at bay.' }
          ],
          image: UNSPLASH.korkyt, specs: { era: 'IX-X c', legacy: 'Kui', instrument: 'Kobyz' } 
        },
        { 
          id: 'l4', name: 'Bayterek', desc: 'Tree of Life.', 
          details: [
              { title: 'Cosmic Geography', content: 'The Bayterek tower in Astana is a physical manifestation of the ancient nomadic worldview. According to legend, the universe consists of three worlds: the Underground (roots), the Terrestrial (trunk), and the Celestial (crown). At the center stands the World Poplar Tree, Bayterek, growing on the banks of the World River. It is the axis that holds the universe together.' },
              { title: 'Samruk and Aydahar', content: 'Every year, the sacred bird Samruk flies to the crown of the tree and lays a golden egg—the Sun. This represents the source of life and hope. However, living at the roots is the dragon Aydahar, who crawls up to swallow the egg. This eternal struggle symbolizes the cycle of day and night, summer and winter, good and evil. It is not a battle to be won, but a cycle to be maintained.' },
              { title: 'The Hand of Peace', content: 'The monument, designed by Norman Foster, is 97 meters high (symbolizing the year 1997 when the capital moved). Inside the "golden egg" at the top is a panoramic hall featuring a handprint of the first President in a gold triangle. Visitors place their hand in the imprint, and as they do, the national anthem plays. It symbolizes the unity of the people with the leader and the state\'s aspiration toward the sun.' },
              { title: 'Axis of the New Capital', content: 'Bayterek is the literal and figurative center of Astana\'s master plan. The main axis of the city runs through it, aligning the Presidential Palace with the Khan Shatyr entertainment center. It represents the young nation\'s ambition to be a bridge between East and West, rooted in tradition but reaching for the future.' }
          ],
          image: IMAGES.bayterek, specs: { symbol: 'Life/Peace', height: '97 m', location: 'Astana' } 
        },
        { 
          id: 'l5', name: 'Aisha Bibi', desc: 'Monument of eternal love.', 
          details: [
              { title: 'Romeo and Juliet of the Steppe', content: 'The 12th-century mausoleum near Taraz is shrouded in romantic legend. Aisha was the daughter of a wealthy scholar who refused to let her marry the ruler Karakhan (one of the Karakhanid dynasty kings). Defying her father, she fled at night to meet her beloved. Just a few kilometers from Taraz, as she put on her headdress (saukele) to prepare for the meeting, a viper hidden inside bit her. Karakhan arrived only to find her dying. He married her on the spot, so she would die as his wife, and then built this masterpiece over her grave.' },
              { title: 'Terracotta Lace', content: 'Architecturally, the mausoleum is unique in all of Central Asia. It is completely covered—inside and out—with carved terracotta tiles. There are over 60 different geometric and floral patterns used. The precision is such that the building looks like it is wrapped in weightless lace rather than heavy brick. It demonstrates the peak of Karakhanid architectural prowess before the Mongol invasion.' },
              { title: 'Babaja Khatun', content: 'Next to Aisha Bibi stands another, simpler mausoleum: Babaja Khatun. Legend says she was Aisha\'s devoted nurse/servant who accompanied her on the fatal journey. After Aisha\'s death, Babaja refused to leave the grave, living there as a keeper until she died. Karakhan built her tomb next to his wife\'s, honoring loyalty and friendship alongside romantic love.' },
              { title: 'Pilgrimage for Brides', content: 'Today, the site is a popular destination for newlyweds. Brides in their wedding dresses come to bow before Aisha Bibi\'s spirit, asking for blessings for a happy marriage and healthy children. The wind often whistles through the open lattice of the mausoleum, which locals say is the whisper of the lovers eternally conversing.' }
          ],
          image: IMAGES.aisha, specs: { century: 'XI-XII c', location: 'Taraz', style: 'Terracotta' } 
        },
        { 
          id: 'l6', name: 'Lake Balkhash', desc: 'The divided waters.', 
          details: [
              { title: 'The Legend of Three', content: 'The lake\'s peculiar geography is explained by a tragic myth. A rich wizard named Balkhash had a beautiful daughter, Ili. He held a contest for her hand, promising her to the strongest and wealthiest. However, Ili loved the poor shepherd Karatal. The two lovers fled together. The furious father used his magic to turn them into two rivers. To ensure they never united, he threw himself between them, transforming into the vast lake. Today, the Ili River flows into the west, and the Karatal River flows into the east, but they are forever separated by the body of the father.' },
              { title: 'Hydrological Wonder', content: 'Balkhash is the 15th largest lake in the world and exhibits a rare phenomenon: it is half fresh and half saline. The western part, fed by the glacier-melt waters of the Ili, is fresh and muddy. The eastern part is salty and clear blue. They are connected by a narrow strait called "Uzynaral" (Long Neck), which prevents the waters from mixing freely. This duality supports a diverse ecosystem.' },
              { title: 'Ecological Importance', content: 'The lake is a crucial stopover for migratory birds and the home of endemic species like the Balkhash perch. However, like the Aral Sea, it faces threats from water diversion and evaporation. The health of the lake is seen as a barometer for the environmental health of the entire Balkhash-Alakol basin.' },
              { title: 'Cultural Boundary', content: 'Historically, the region around Balkhash (Zhetysu - Seven Rivers) was a cradle of civilizations, from the Sakas to the Karluks. The reed forests (tugay) along its shores were once the home of the Caspian tiger (now extinct, but reintroduction is planned). The lake represents the untamable, mysterious nature of the Kazakh landscape.' }
          ],
          image: IMAGES.balkhash, specs: { type: 'Semi-saline', location: 'Zhetysu', phenomenon: 'Uniqueness' } 
        },
        { 
          id: 'l7', name: 'Kazygurt', desc: 'The Ark\'s resting place.', 
          details: [
              { title: 'The Central Asian Ararat', content: 'While Biblical tradition places Noah\'s Ark on Mount Ararat, local Islamic and pre-Islamic legends insist it landed on Mount Kazygurt in the Tian Shan foothills (near Shymkent). The local proverb says: "Kazygurt is higher than all mountains, for the Ark of the Prophet Noah stopped there." It is believed that the floodwaters covered even the highest peaks, but Kazygurt remained or the Ark grounded there as waters receded.' },
              { title: 'The Stone Ship', content: 'The mountain\'s summit has a peculiar formation that resembles the hull of a giant ship. A modern wooden replica of the Ark has been built there as a viewing platform. Locals point to other rock formations representing the animals that disembarked: the camel, the dog, the elephant. It is a place where the reboot of humanity is believed to have started.' },
              { title: 'The Forty Angels', content: 'Nearby lies the "Gayyp Eeren Kyryk Shilten"—a sacred site dedicated to invisible saints. It features strange rock formations, including a narrow passage between two rocks called "Adam Ata and Zher Ana" (Father Adam and Mother Earth). Only those who are pure of heart can squeeze through the gap; sinners get stuck. It is a site of active pilgrimage and Sufi meditation.' },
              { title: 'Fertility and Healing', content: 'The region is famed for its healing springs and energy. Childless couples come to Kazygurt to pray for offspring, believing the mountain holds the generative power of the post-flood world. It represents hope, survival, and divine favor.' }
          ],
          image: IMAGES.kazygurt, specs: { location: 'South KZ', legend: 'Noah\'s Ark', height: '1768 m' } 
        },
        { 
          id: 'l8', name: 'Kozy Korpesh', desc: 'Epic of tragic love.', 
          details: [
              { title: 'The Plot', content: 'The epic "Kozy Korpesh and Bayan Sulu" dates back to the 13th century. Two friends, Sarybai and Karabai, betroth their unborn children to each other. Sarybai dies during a hunt. As the children grow, they fall in love, but the girl\'s father, Karabai, changes his mind and promises Bayan to a powerful local warrior, Kodar, to save his herds during a drought. The story follows Kozy\'s quest to claim his bride and Kodar\'s treachery.' },
              { title: 'The Climax', content: 'Kodar kills Kozy in his sleep or through a trap. Bayan Sulu, feigning submission, agrees to marry Kodar only if he digs a deep well for her. As he works at the bottom, she holds his hair (or a rope), then cuts it, burying him under stones. She then visits Kozy\'s grave and stabs herself with a dagger to be united with him in death. It is a story of absolute loyalty surpassing death.' },
              { title: 'The Mausoleum', content: 'The tomb of the lovers stands in the East Kazakhstan region. It is a unique stone mazar shaped like a yurt/cone, dating to the 10th or 11th century (predating the written version of the epic). It suggests the story is based on real historical figures. The site is considered the "Mecca of Love" in Kazakhstan.' },
              { title: 'Cultural Impact', content: 'This epic has been retold by every great bard. It emphasizes the sanctity of the word/oath (betrothal) and the autonomy of women\'s feelings against patriarchal avarice. It is the quintessential Kazakh tragedy.' }
          ],
          image: IMAGES.kozy, specs: { genre: 'Lyric Epic', theme: 'Love', heroes: 'Kozy/Bayan' } 
        },
        { 
          id: 'l9', name: 'Aksak Kulan', desc: 'Power of music.', 
          details: [
              { title: 'The Wrath of Genghis Khan', content: 'This legend explains the origin of the Dombra\'s design but also carries a deeper political message. When Jochi, the Khan\'s son, died hunting the wild donkeys (Kulan), the court was paralyzed by fear. Genghis Khan had decreed that anyone bringing bad news would have molten lead poured down their throat. This created a crisis of communication between the ruler and reality.' },
              { title: 'The Bard\'s Wisdom', content: 'Ketbuqa, the great Zhyrau (bard), solved the impossible. He did not speak. He played the "Aksak Kulan" kui. The music was so descriptive—the galloping, the clash, the silence—that the Khan wept. When the Khan asked, "Is my son dead?", Ketbuqa replied, "You have said it yourself, O Khan. My mouth was silent; the Dombra spoke."' },
              { title: 'The Punishment of the Wood', content: 'Bound by his own decree but unable to kill the bard who had not spoken, Genghis Khan ordered the Dombra to be punished. Molten lead was poured onto the instrument, burning the sound hole. This legend elevates the musician to a status above the ruler—the musician is the only one who can speak truth to power and survive, using the metaphorical language of art.' },
              { title: 'Historical Basis', content: 'Jochi Khan indeed died in the Kazakh steppes (near Ulytau) under mysterious circumstances in 1227, shortly before his father. His mausoleum still stands there. The legend serves as a cultural memory of that dynastic transition and the role of the steppe bards as the conscience of the nation.' }
          ],
          image: IMAGES.dombraLegend, specs: { kui: 'Aksak Kulan', history: 'Genghis Khan', instrument: 'Dombra' } 
        }
      ],
      crafts: [
        { 
          id: 'c1', name: 'Felt-making', desc: 'Fabric of nomadic life.', 
          details: [
              { title: 'The Universal Material', content: 'Felt (Kiiz) was the plastic of the nomadic world. It provided the walls and roof of the yurt (tuyrlyk, uzuk), the flooring (tekemet), the bedding, the clothes, and the saddle pads. Its properties are miraculous for the continental climate: it is a superb insulator against minus 40°C winters and repels the scorching heat of summer. It is waterproof yet breathable.' },
              { title: 'The Process: A Community Ritual', content: 'Making felt was a collective event called "Kiiz basu," involving all the women of the aul. Autumn wool (kuzem zhun) was preferred for its density. The wool was beaten with willow sticks to fluff it, dyed, laid out in patterns on a reed mat, scalded with boiling water, rolled up, and then kicked or dragged by a horse for hours to compact the fibers. The rhythmic work was accompanied by specific songs and laughter, strengthening social bonds.' },
              { title: 'Tekemet vs. Syrmak', content: 'There are two main artistic forms. "Tekemet" is made by pressing colored wool into the base layer before rolling, creating a soft, blurred, watercolor-like pattern. It is cheaper and used for everyday flooring. "Syrmak" is a mosaic technique where finished felt sheets of contrasting colors are cut and stitched together. Syrmaks are incredibly durable, often lasting over 50 years, and are considered family heirlooms.' },
              { title: 'Magical Protection', content: 'Felt was believed to be pure and spirit-repelling. Scorpions and tarantulas cannot move across felt because the fibers trap their legs. Patterns on felt were never random; the "ram\'s horn" brought wealth, the "amulet" protected from the evil eye. A white felt carpet was used to lift a newly elected Khan, symbolizing his elevation by the people.' }
          ],
          image: IMAGES.felt, specs: { material: 'Sheep wool', technique: 'Traditional', use: 'Yurt' } 
        },
        { 
          id: 'c2', name: 'Embroidery', desc: 'Language of symbols.', 
          details: [
              { title: 'Painting with Thread', content: 'Kazakh embroidery (Keste) is vibrant and dense. The most distinct technique is "Biz Keste" (awl embroidery), done with a crochet-like hook on a stretched frame. It creates a chain stitch that looks like a knitted loop on the surface. This technique allows for continuous, flowing lines perfect for the curvilinear "animal style" ornaments.' },
              { title: 'Tuskiiz: The Wall Garden', content: 'The masterpiece of embroidery is the "Tuskiiz"—a large wall carpet hung above the bed. It represents a view of a blooming garden or paradise. Interestingly, Tuskiiz were always left slightly unfinished (a small corner unstitched) to signify that human work is imperfect compared to God\'s, and to leave a "pathway" for the evil eye to escape without staying in the house.' },
              { title: 'Color Symbolism', content: 'Colors were strictly codified. Red represented fire, sun, and vitality; Blue was the sky (Tengri); Green was youth and spring; Yellow was wisdom; White was truth and joy; Black was earth. A skilled embroiderer could convey a message or a wish through the combination of colors and patterns, effectively writing a letter in thread.' },
              { title: 'Gold Embroidery', content: 'The elite art of "Zerley" used gold and silver threads. It adorned the Chapans of Khans and the Saukele of brides. This was often done by men (Zergers) or specialized guild craftsmen, whereas wool and silk embroidery was a domestic art practiced by every woman.' }
          ],
          image: IMAGES.embroidery, specs: { types: 'Chapan/Saukele', ornament: 'Geometric pattern', material: 'Fabric/Embroidery' } 
        },
        { 
          id: 'c3', name: 'Jewelry', desc: 'Silver protection.', 
          details: [
              { title: 'The Metal of Purity', content: 'Kazakh jewelers (Zergers) worked almost exclusively with silver. Gold was rare and considered ostentatious, whereas silver was believed to have purifying and protective magic. It was thought that "water is not clean unless a silver ring touches it." Women wore silver rings while cooking to "purify" the food.' },
              { title: 'The Walking Orchestra', content: 'A woman\'s jewelry set was massive. It included "Sholpy" (heavy hair pendants), "Onirzhiek" (breastplates), "Bilezik" (cuff bracelets), and "Syrga" (earrings). A full wedding set could weigh 3-5 kg. The jingling sound of the Sholpy served a pedagogical purpose: it taught a girl to walk gracefully and rhythmically. It also warned of her approach, preventing men from being caught in inappropriate situations.' },
              { title: 'Techniques and Stones', content: 'Zergers used granulation (grain), filigree (wire), Niello (blackening), and stamping. The most common stone was Carnelian (Aqiq), a reddish stone believed to bring health, stop bleeding, and ensure happiness. Turquoise and Coral were also used. The stones were set in high bezels, emphasizing their color against the silver.' },
              { title: 'The Zerger\'s Anvil', content: 'The jeweler\'s tools were sacred. The anvil was often passed down for generations. The Zerger was a mysterious figure, a master of fire and metal, respected and feared. They often worked alone and did not share their secrets outside the family lineage.' }
          ],
          image: IMAGES.jewelry, specs: { metal: 'Silver/Gold', method: 'Hand-forged', technique: 'Carving' } 
        },
        { 
          id: 'c4', name: 'Leatherwork', desc: 'Gear of the rider.', 
          details: [
              { title: 'The Horseman\'s Life', content: 'In a civilization built on the horse, leatherworking was a strategic industry. The "Er-Turman" (saddle set) was a complex engineering feat. The Kazakh saddle is distinctive for its high pommel and cantle, designed to keep the rider secure during high-speed maneuvers and battle. It allowed the rider to stand in the stirrups to shoot arrows.' },
              { title: 'Processing the Hide', content: 'Hides were soaked in fermented milk (airam) and salt to soften them, then scraped and smoked over a fire of specific plants (like meadowsweet) to make them waterproof and rot-resistant. This gave Kazakh leather a distinctive, smoky aroma that travelers often noted. Horse hide, bull hide, and camel skin were used for different purposes.' },
              { title: 'The Saba and Torsyk', content: 'Leather was also used for cookware. The "Saba" was a large pyramidal bag for fermenting Kumis (up to 100 liters). The "Torsyk" was a curved, rigid leather flask carried on the saddle. Its shape prevented it from bouncing against the horse\'s flank. Interestingly, these vessels were often embossed with patterns using heated iron stamps.' },
              { title: 'Green Leather', content: 'A unique luxury product was "Kok Saury"—leather dyed green using copper oxide. It was used for high-end boots and saddles, often decorated with silver studs. This became a marker of the aristocracy.' }
          ],
          image: IMAGES.leather, specs: { item: 'Saddle', material: 'Leather', use: 'Horse gear' } 
        },
        { 
          id: 'c5', name: 'Syrmak', desc: 'Mosaic felt carpet.', 
          details: [
              { title: 'The Mosaic Technique', content: 'Syrmak is the most durable of Kazakh carpets. Its creation involves a unique positive-negative cutting technique. Two layers of felt of contrasting colors (e.g., black and white) are stacked, and a pattern is cut through both simultaneously. This produces two identical mirror-image patterns: black on white, and white on black. Nothing is wasted. These pieces are then fit together like a puzzle.' },
              { title: 'The Double Cord', content: 'The seams where the pieces join are covered and stitched over with a twisted two-color wool cord. This not only hides the seam but reinforces the structure, making the carpet incredibly tough. A well-made Syrmak can withstand decades of heavy foot traffic in a yurt.' },
              { title: 'Ornamental Language', content: 'The dominant motif is the "Koshkar Myuiz" (Ram\'s Horn), representing wealth and the vitality of the herd. Other motifs include "Tabak" (platter/hospitality) and "Su" (water/life). The borders often feature "It kuyryq" (dog\'s tail) to ward off enemies. Reading a Syrmak is like reading a prayer for the household\'s prosperity.' },
              { title: 'Regional Styles', content: 'East Kazakhstan is famous for intricate, floral-influenced Syrmaks. The South prefers bold, large geometric shapes. The Semirechye region often uses bright reds and greens. Despite these differences, the fundamental technique remains a unifying national art form.' }
          ],
          image: IMAGES.carpet, specs: { type: 'Carpet', technique: 'Stitching', pattern: 'Ram horn' } 
        },
        { 
          id: 'c6', name: 'Pottery', desc: 'Urban legacy.', 
          details: [
              { title: 'The Settled Facet', content: 'While nomads favored unbreakable wood and leather, the Silk Road cities of Southern Kazakhstan (Otrar, Turkestan, Taraz) were major ceramic centers. They produced glazed pottery that rivaled Persia and China. This tradition represents the symbiotic relationship between the "Steppe" (nomads) and the "Sown" (city dwellers).' },
              { title: 'Technology', content: 'Archaeologists have found sophisticated kilns and irrigation pipes (kubyrs). The ceramics were often glazed with alkaline glazes in turquoise, deep blue, and yellow. The "Otrar style" is characterized by free-hand floral painting under the glaze. They produced everything from massive storage jars (Khums) for grain and water to delicate oil lamps (Chirag).' },
              { title: 'The Kese', content: 'The most iconic item is the "Kese" (tea bowl). It has no handles, encouraging the drinker to cup it with both hands for warmth. The wideness of the rim cools the tea quickly. Offering a Kese of tea is the first act of Kazakh hospitality; a refusal is an insult.' },
              { title: 'Revival', content: 'The Mongol invasion destroyed many kilns, but the craft survived in pockets. Today, artisans are reviving the ancient glazes and patterns of Otrar, creating modern tableware that carries the DNA of the Silk Road.' }
          ],
          image: IMAGES.pottery, specs: { material: 'Clay', center: 'Otrar', item: 'Bowl/Jug' } 
        },
        { 
          id: 'c7', name: 'Bone Carving', desc: 'Natural inlay.', 
          details: [
              { title: 'Waste Not, Want Not', content: 'In the resource-scarce steppe, animal bones were a precious material. The shin bones of cows, camels, and horses were boiled, bleached in the sun, and polished to an ivory-like finish. This "poor man\'s ivory" was used to create incredibly delicate art.' },
              { title: 'Inlay Work', content: 'Bone was rarely used to make whole objects (except spoons or toggles). Its primary use was inlay. Craftsmen would carve geometric shapes or animal figures from bone and embed them into the dark wood of dombras, saddles, and chests (sandyk). The contrast between the white bone and the dark wood is the signature aesthetic of Kazakh furniture.' },
              { title: 'Incised Patterns', content: 'The bone plates themselves were often engraved with fine lines using a sharp knife ("Is"). These lines were then filled with black wax or ash to make the pattern pop. This technique, called Scrimshaw in the West, was mastered by nomadic shepherds centuries ago.' },
              { title: 'Amuletic Power', content: 'Bones were believed to retain the life force of the animal. A "Kobeje" (food chest) decorated with bone was thought to keep food fresh longer and protect it from spirits. Wolf teeth and eagle claws were often set in silver and used as powerful talismans for children.' }
          ],
          image: IMAGES.bone, specs: { material: 'Bone', use: 'Decor', style: 'Zoomorphic' } 
        },
        { 
          id: 'c8', name: 'Blacksmithing', desc: 'Masters of fire.', 
          details: [
              { title: 'The Darhan', content: 'The blacksmith (Ustaz or Darhan) was a liminal figure, equal to the Shaman. While the Shaman mastered the spirits, the Blacksmith mastered the elements. It was believed that evil spirits feared the sound of iron and the smell of the forge. Blacksmiths were immune to the evil eye.' },
              { title: 'Weapons of the Batyrs', content: 'Kazakh smiths forged the "Bes Karu" (Five Weapons): the bow, the spear, the battle-axe, the saber, and the mace. They mastered the technique of pattern welding (Damascus steel) to create blades that were flexible yet razor-sharp. Chainmail (Sauyt) was meticulously riveted from thousands of rings.' },
              { title: 'Domestic Iron', content: 'Beyond war, they created the "Oshak" (hearth stand)—the sacred center of the yurt. They forged the nails and hinges for the wooden frame. The "Otmylyq" (flint striker) was an essential tool for every man, often decorated with gold inlay.' },
              { title: 'The Sacred Forge', content: 'The smithy was a sanctuary. Oaths were sworn on the anvil. If a person was sick, the blacksmith might "forge" them by lightly tapping a hammer near their body to drive out the sickness. The water used to quench the steel was considered medicinal.' }
          ],
          image: IMAGES.metal, specs: { product: 'Weapons', material: 'Iron/Steel', meaning: 'Military' } 
        },
        { 
          id: 'c9', name: 'Wood Carving', desc: 'Skeleton of the home.', 
          details: [
              { title: 'Engineering the Yurt', content: 'The woodcarver (Agash Sheberi) was the architect of the steppe. Creating the yurt frame required mathematical precision. The "Kerege" (walls) had to expand and collapse like an accordion. The "Uyk" (roof poles) had to curve at the exact angle to create the dome. The "Shanyraq" (crown) was the heaviest and most complex piece, steam-bent from massive birch or willow poles.' },
              { title: 'Carving Styles', content: 'Kazakh woodcarving is deep and relief-based. The patterns are not just surface scratches but 3D sculptures. The "Agash ayak" (wooden bowl) and "Ozhau" (ladle) were carved from burls (hard knots of wood) to prevent cracking. These ladles were often double-headed, symbolizing duality.' },
              { title: 'The Door', content: 'The "Sykym" (door) of the yurt was the canvas for the carver\'s greatest skill. While the rest of the yurt was felt, the door was wood. It was deeply carved with protective symbols to filter who/what entered the home. A beautiful door was the status symbol of the family.' },
              { title: 'Tools and Materials', content: 'They used adzes, chisels, and knives. Since large timber was scarce, they mastered the art of joinery and steam bending. Birch, black willow, and saksaul (ironwood) were the primary materials.' }
          ],
          image: IMAGES.wood, specs: { material: 'Wood', item: 'Chest/Door', technique: 'Carving' } 
        }
      ],
      cuisine: [
        { 
          id: 'f1', name: 'Beshbarmak', desc: 'The King of Cuisine.', 
          details: [
              { title: 'Etymology and Essence', content: 'Beshbarmak (Five Fingers) is not just a dish; it is the central institution of Kazakh hospitality. The name refers to the nomadic tradition of eating with hands, which connects the eater directly to the food. It is a massive communal platter symbolizing the unity of the tribe. To decline Beshbarmak is to reject the host\'s friendship.' },
              { title: 'The Composition', content: 'The dish has three pillars: Meat, Dough, and Sorpa (broth). The meat (horse, lamb, or beef) is boiled for hours in its own juices until tender. The dough (kespe) is rolled into paper-thin sheets and boiled in the meat broth, absorbing the rich fat. The whole dish is topped with "Tuzdyk"—a sauce of onions blanched in scalding fatty broth with black pepper. It is simple, yet the quality of ingredients makes it gourmet.' },
              { title: 'The Ritual of Parts', content: 'Serving Beshbarmak is a strict diplomatic protocol. The "Bas Tabak" (Head Platter) is presented to the most honored guest. It contains the sheep\'s head (boiled and singed). The guest slices pieces of the head and distributes them: ears to young men (to listen and learn), eyes to judges (to see clearly), the palate to girls (to be eloquent). The brisket (tos) goes to the son-in-law, the cervical vertebra (moin) to the unmarried. Every bone tells a story of social rank.' },
              { title: 'Regional Varieties', content: 'In the West (Caspian), Beshbarmak is often made with fish (sturgeon) instead of meat. In the South, rice is sometimes used. In the North, the dough is cut into large squares ("kulgasy"), while in other regions it might be thinner noodles. But the communal spirit remains unchanged.' }
          ],
          image: IMAGES.beshbarmak, specs: { ingredient: 'Meat/Dough', meaning: 'Hospitality', type: 'Main Course' } 
        },
        { 
          id: 'f2', name: 'Kymyz', desc: 'Drink of the Steppe.', 
          details: [
              { title: 'White Wine of the Nomad', content: 'Kymyz (Kumis) is fermented mare\'s milk. It is the lifeblood of the steppe culture. Fresh mare\'s milk (saumal) is rich in sugar (lactose). When fermented with a specific starter (kor), it becomes carbonated, slightly alcoholic (1-3%), and pleasantly sour. It was the primary source of Vitamin C for nomads who lacked fruit, preventing scurvy.' },
              { title: 'The Art of Churning', content: 'The secret to good Kymyz is churning. It is made in a "Saba" (smoked horse skin bag) or "Kubi" (wooden churn). It must be beaten with a "Pispek" (pestle) for hours—thousands of strokes. This aerates the milk and breaks down the protein curds. The more it is churned, the lighter and smoother it becomes. Guests were expected to give the churn a few strokes upon entering the yurt as a sign of respect.' },
              { title: 'Varieties', content: 'A connoisseur distinguishes 40 types. "Saumal" is fresh and mild (laxative). "Tunemel" is aged 24 hours. "Asau" (Violent) is aged 3-5 days, strong and potent. "Ball Kymyz" includes honey and spices. It is a seasonal drink, available primarily in late spring and summer during the foaling season ("Kymyzmuryndyk" festival).' },
              { title: 'Therapeutic Power', content: 'Kymyz is a powerful probiotic and antibiotic. It was historically used to treat tuberculosis, anemia, and gastritis. In the 19th century, Russian aristocrats and writers (including Tolstoy and Chekhov) traveled to the Kazakh steppes for "Kumis Cures." It invigorates the body and lifts the mood ("Kymyz spirit").' }
          ],
          image: IMAGES.kymyz, specs: { base: 'Mare\'s Milk', taste: 'Sour', property: 'Healing' } 
        },
        { 
          id: 'f3', name: 'Baursak', desc: 'Solar Bread.', 
          details: [
              { title: 'Sacred Geometry', content: 'Baursaks are pieces of yeast dough fried in oil. Their round or square golden shape represents the Sun. But their significance goes beyond food. In Tengriism, the smell of frying oil and fat is believed to be the only thing that can feed the spirits of the ancestors (Aruaks). When the aroma rises to the sky, the ancestors are satisfied and bless the living.' },
              { title: 'Ubiquity', content: 'No Kazakh table (Dastarkhan) is complete without Baursaks. They are served at weddings, funerals, births, and casual teas. They serve as edible spoons, bread, and dessert all in one. To leave a guest without offering Baursaks is to wish them an empty life.' },
              { title: 'Preparation', content: 'Ingredients are simple: flour, water/milk, yeast, salt, and sometimes sugar/butter. However, the technique is key. The oil must be hot enough so they puff up instantly (hollow inside) but don\'t burn. "Shii Baursak" are tiny, crispy balls kept for months. "Tushpara Baursak" are soft and pillow-like.' },
              { title: 'Record Breakers', content: 'Baursaks are often made in massive quantities for city festivals. Kazakhstan holds world records for the largest amount of Baursaks cooked (tons) and the tallest Baursak tower. It is a symbol of abundance and sunshine.' }
          ],
          image: IMAGES.baursak, specs: { type: 'Bread', cooking: 'Fried in Oil', symbolism: 'Sun/Abundance' } 
        },
        { 
          id: 'f4', name: 'Kurt', desc: 'Nomad\'s Energy Bar.', 
          details: [
              { title: 'Survival Technology', content: 'Kurt is a marvel of primitive food science. It allows highly perishable milk protein to be stored for years without refrigeration. Sour milk is boiled to make curds (suzbe), salted heavily, rolled into balls, and dried in the scorching sun until they are as hard as rocks. This dehydrated concentrate contains immense energy and calcium.' },
              { title: 'The Stone of Life', content: 'A famous story from the ALZHIR labor camp (for wives of "traitors") tells of Kazakh locals throwing white stones at the starving prisoners. The guards laughed. Later, the prisoners realized the "stones" were edible Kurt. This act of risky compassion saved many lives. Kurt represents the hardness of the steppe life and the softness of the steppe heart.' },
              { title: 'Culinary Use', content: 'Kurt can be sucked on for hours to quell hunger and thirst (the salt retains water). It can be dissolved in water to make a soup base or drink (Chalap). It is the perfect accompaniment to beer or sweet tea, providing a savory counterpoint.' },
              { title: 'Modern Variations', content: 'Today, Kurt is evolving. You can find smoked Kurt, Kurt with pepper, basil, or mint. It is sold in vacuum packs as a premium snack. However, the traditional, rock-hard, sun-dried Kurt remains the standard of authenticity.' }
          ],
          image: IMAGES.kurt, specs: { base: 'Curd/Salt', shelf_life: 'Long', benefit: 'Calcium' } 
        },
        { 
          id: 'f5', name: 'Kazy', desc: 'Horse meat delicacy.', 
          details: [
              { title: 'The Champagne of Meats', content: 'Kazy is the most prestigious meat product in Kazakh cuisine. It is not a ground sausage; it is the entire rib meat of the horse, with the fat still attached, stuffed intact into the horse\'s washed intestine. This preservation of the meat structure creates a unique texture. It is seasoned simply with garlic, black pepper, and salt.' },
              { title: 'Horse Fat Paradox', content: 'Unlike beef or mutton fat, horse fat (chul) has a low melting point. It melts on the tongue like butter and is rich in unsaturated fatty acids (similar to vegetable oils). It does not congeal in the stomach. Nomads believed it generated immense internal heat, making it the ideal winter food to survive the cold.' },
              { title: 'Preparation', content: 'Kazy is usually dried or smoked for preservation, then boiled for 2-3 hours before serving. It is sliced into medallions, showcasing the beautiful contrast between the dark red meat and the white/yellow fat. It is served cold as an appetizer or hot atop Beshbarmak.' },
              { title: 'Cultural Status', content: 'You cannot buy "real" Kazy in a supermarket; it must be homemade or bought from a trusted butcher. A host\'s generosity is measured by the thickness of the fat in the Kazy served. Offering Kazy to a guest is a sign of high esteem.' }
          ],
          image: IMAGES.kazy, specs: { meat: 'Horse', type: 'Sausage', taste: 'Traditional' } 
        },
        { 
          id: 'f6', name: 'Shubat', desc: 'Camel milk nectar.', 
          details: [
              { title: 'Desert Gold', content: 'While Kymyz is the drink of the grassy north, Shubat is the drink of the arid south and west, where camels thrive. It is fermented camel milk. Compared to Kymyz, it is much richer (up to 8% fat), thicker, and whiter ("Ag" - white). It has a creamy, velvety texture and a milder sourness.' },
              { title: 'The Fermentation', content: 'Unlike Kymyz which needs violent churning, Shubat is fermented calmly. The starter is added, and it sits in a skin or ceramic vessel. It separates naturally, so it must be stirred gently before serving. It is known as "Agaran" in Turkmenistan, but the Kazakh Shubat is distinct for its specific fermentation culture.' },
              { title: 'Medical Properties', content: 'Shubat is a heavy, filling drink—a "meal in a bowl." It is renowned for healing digestive ulcers, treating diabetes (it contains insulin-like proteins), and boosting immunity. It is often prescribed for patients recovering from surgery.' },
              { title: 'The Mood', content: 'If Kymyz makes you excited and active, Shubat makes you calm and sleepy. It is the drink of the slow, hot afternoon in the desert. It is famously incompatible with other foods—drinking Shubat after eating fruit or unrelated meats can cause stomach upset, demanding respect for its potency.' }
          ],
          image: IMAGES.shubat, specs: { base: 'Camel milk', property: 'Fatty/Thick', region: 'West/South' } 
        },
        { 
          id: 'f7', name: 'Irimshik', desc: 'Red Cheese.', 
          details: [
              { title: 'Caramelized Curd', content: 'Irimshik is a unique dairy sweet that bridges the gap between cheese and candy. It is made by boiling fresh milk with rennet. Unlike other cheeses where whey is drained, here the whey is boiled down with the curds for hours. The lactose sugars caramelize, turning the mixture a deep golden-red color (Kyzyl Irimshik) and imparting a natural sweet, toffee-like flavor.' },
              { title: 'Sun on the Table', content: 'It is considered a delicacy, often called the "chocolate of the steppe." It is rich, crumbly, and fatty. Mothers give it to children as a treat. Because of the long boiling time, it has a long shelf life. "Ak Irimshik" is a white, softer version removed before caramelization, often mixed with sour cream.' },
              { title: 'Modern Desserts', content: 'Today, chefs are rediscovering Irimshik, using it in cheesecakes, tarts, and chocolate truffles. Its unique nutty, milky profile offers a distinctly Kazakh flavor palette that is impossible to replicate with cow cheese.' },
              { title: 'Nutritional Value', content: 'It is essentially a protein and fat concentrate. A small handful provides enough energy for a half-day ride. It was a vital part of the warrior\'s ration alongside Kurt.' }
          ],
          image: IMAGES.irimshik, specs: { type: 'Sweet', base: 'Milk', color: 'Red-yellow' } 
        },
        { 
          id: 'f8', name: 'Zhent', desc: 'Millet treat.', 
          details: [
              { title: 'The Ancient Energy Bar', content: 'Zhent is a dessert made from "Tary" (roasted millet). The millet is ground into a coarse flour, then mixed with generous amounts of butter, sugar (or honey originally), and crushed Irimshik curds. The mixture is pressed into blocks and sliced cold. It resembles a dense, grainy halva.' },
              { title: 'Winter Preparation', content: 'Historically, Zhent was a way to preserve butter and grain for the winter. The butter sealed the grain from air, keeping it fresh. It was prepared in the autumn and eaten during the harsh winter months with hot tea.' },
              { title: 'The Taste of Tradition', content: 'Zhent has a unique texture—the crunch of the roasted millet against the smoothness of the butter. It is very rich and filling. It is often served to guests when they first arrive, to restore their strength after a journey.' },
              { title: 'Evolution', content: 'Modern Zhent is often coated in Belgian chocolate or mixed with walnuts and dried fruits. It is becoming a popular souvenir sweet, representing the "taste of Kazakhstan" to tourists.' }
          ],
          image: IMAGES.zhent, specs: { composition: 'Millet/Butter', type: 'Dessert', taste: 'Sweet' } 
        },
        { 
          id: 'f9', name: 'Shelpek', desc: 'Sacred flatbread.', 
          details: [
              { title: 'Friday Bread', content: 'Shelpek is a simple flatbread fried in oil, but its role is almost entirely ritualistic. Every Friday (Juma), households fry 7 or 9 shelpeks. They are stacked and a prayer is read. They are then distributed to neighbors or eaten by the family. It is believed that the smell of the frying oil is the "food" for the spirits of the ancestors.' },
              { title: 'Solar Origins', content: 'Like Baursaks, the round shape represents the sun. This tradition likely predates Islam, rooting in Zoroastrian or Tengriist sun worship. The number 7 represents the 7 layers of the sky or the 7 generations of ancestors (Zhety Ata) one must know.' },
              { title: 'Varieties', content: 'While usually soft and thin, some regions make "Katyrma"—a crispy, cracker-like shelpek. Others use yeast dough, making them thicker. But the cooking method—deep frying in a kazan—is universal.' },
              { title: 'Charity', content: 'Shelpek is the bread of charity. It is made during funerals and memorials. Distributing shelpek is a way of asking the community to remember the deceased and share in the family\'s grief or joy.' }
          ],
          image: IMAGES.shelpek, specs: { shape: 'Round', meaning: 'Sacred', cooking: 'Frying' } 
        }
      ],
      people: [
        { 
          id: 'p1', name: 'Abay Qunanbayuli', desc: 'The Moral Compass.', 
          details: [
              { title: 'The Philosopher King', content: 'Abay (1845–1904) is the towering intellect of Kazakh history. Son of a feudal lord, he was groomed for power but chose poetry. He realized that his people were trapped in backwardness due to ignorance and tribal strife. He dedicated his life to being a bridge between the nomadic world and global culture, translating Pushkin, Goethe, and Byron into Kazakh.' },
              { title: 'The Book of Words', content: 'His magnum opus, "Kara Sozder" (Words of Edification), is a collection of 45 philosophical treatises. It is a brutal, honest critique of the flaws of Kazakh society—laziness, boasting, sycophancy—and a passionate plea for education, labor, and moral integrity. It remains the moral constitution of the nation.' },
              { title: 'Musical Legacy', content: 'Abay was also a gifted composer. His songs "Kozimnin Karasy" (Apple of my Eye) and "Jelsiz Tunde Zharyk Ai" (Moon in a Windless Night) are the most famous folk songs in the country. He introduced new melodic structures, blending Kazakh folk motifs with Russian romance styles.' },
              { title: 'The Tragedy', content: 'Abay died broken-hearted, seeing his children die and his people slow to change. However, the Alash Orda movement and modern Kazakhstan were built on his ideals. Every city has an Abay street; students memorize his poems. He is the "Hakim" (Sage) of the steppe.' }
          ],
          image: IMAGES.abay, specs: { lived: '1845-1904', role: 'Poet/Thinker', legacy: 'Words of Edification' } 
        },
        { 
          id: 'p2', name: 'Al-Farabi', desc: 'The Second Teacher.', 
          details: [
              { title: 'The Universal Genius', content: 'Abu Nasr Al-Farabi (872–950) was born in Otrar (Farab). He spent his life in Baghdad, Damascus, and Cairo, becoming one of the preeminent philosophers of the Islamic Golden Age. He was called "The Second Teacher," implying that Aristotle was the first. He mastered logic, music, sociology, mathematics, and medicine.' },
              { title: 'Musical Theory', content: 'His "Kitab al-Musiqa al-Kabir" (Great Book of Music) is the foundational text of Middle Eastern music theory. He invented the "Qanun" instrument and used mathematics to explain musical intervals. He reportedly could play music that made people laugh, weep, or fall asleep at will.' },
              { title: 'Political Philosophy', content: 'His work "The Virtuous City" (Al-Madina al-Fadila) modeled an ideal society based on justice and reason, heavily influenced by Plato\'s Republic but adapted to Islamic monotheism. He argued that the leader must be a philosopher with a perfect body and mind.' },
              { title: 'Legacy', content: 'Al-Farabi preserved and expanded Greek philosophy when Europe was in the Dark Ages. His commentaries on Aristotle influenced Avicenna (Ibn Sina) and later, through translations, Thomas Aquinas and the European Renaissance. He is the intellectual ancestor of the modern Kazakh nation.' }
          ],
          image: IMAGES.alfarabi, specs: { period: '870-950', title: 'Second Teacher', field: 'Science/Philosophy' } 
        },
        { 
          id: 'p3', name: 'Tomyris', desc: 'Warrior Queen.', 
          details: [
              { title: 'The Iron Queen', content: 'Tomyris was the Khatun (Queen) of the Massagetae, an Eastern Scythian confederation, in the 6th century BC. She ruled a land of fierce horse-archers. When Cyrus the Great, founder of the Persian Empire and conqueror of Babylon, marched on her lands, he expected an easy victory. He underestimated her resolve.' },
              { title: 'The Trap and the Vow', content: 'Cyrus tricked the Massagetae army by leaving a camp filled with wine. The nomads, unused to alcohol, got drunk and were slaughtered. Tomyris\'s son, Spargapises, was captured and committed suicide in shame. Enraged, Tomyris sent a message to Cyrus: "You crave blood, and I shall give you your fill of it."' },
              { title: 'The Battle', content: 'Herodotus describes the ensuing battle as the fiercest in antiquity. The Massagetae destroyed the Persian army. Cyrus was killed. Tomyris found his corpse, cut off his head, and shoved it into a wineskin filled with human blood, fulfilling her vow. This act halted Persian expansion into the steppes for centuries.' },
              { title: 'Feminist Icon', content: 'Tomyris is a symbol of the high status of women in nomadic society, where women fought alongside men. She represents the defense of the motherland against imperial aggression. The name "Tomiris" is one of the most popular names for girls in Kazakhstan today.' }
          ],
          image: IMAGES.tomyris, specs: { era: 'VI c. BC', people: 'Massagetae', feat: 'Defeating Cyrus' } 
        },
        { 
          id: 'p4', name: 'Abylai Khan', desc: 'The Unifier.', 
          details: [
              { title: 'Survival of the Nation', content: 'Abylai (1711–1781) ruled during the "Aktaban Shubyrindy" (Years of Great Faint)—the apocalyptic invasion of the Dzungars. The Kazakh ethos was on the brink of extinction. Starting as a common warrior named "Sabalak" (disguised), he rose through sheer bravery to become the supreme Khan.' },
              { title: 'The Fox and the Lion', content: 'Abylai was a master of "Between-two-fires" diplomacy. Sandwiched between the expanding Russian Empire and the Qing Dynasty of China, he played them against each other, accepting suzerainty from both but obeying neither. This allowed him to maintain de facto independence and reclaim lost Kazakh territories.' },
              { title: 'Reforms', content: 'He centralized power, curbing the influence of the unruly biys (judges). He encouraged agriculture and trade, moving the nomads towards a semi-settled economy to strengthen the state. He united the three Juzes (Hordes) under one banner.' },
              { title: 'The Dreamer', content: 'Legend says he saw a dream of a future where his descendants would lose power, but the nation would survive. He is the archetype of the "Wise Ruler" in Kazakh folklore. His direct descendant, Kenesary, would lead the last great rebellion.' }
          ],
          image: IMAGES.abylai, specs: { reign: '1771-1781', achievement: 'Land Defense', policy: 'Diplomacy' } 
        },
        { 
          id: 'p5', name: 'Shokan Walikhanov', desc: 'The Shooting Star.', 
          details: [
              { title: 'The Blue Blood', content: 'Shokan (1835–1865) was a Chingisid (descendant of Genghis Khan) and great-grandson of Abylai Khan. Yet, he became an officer in the Russian Imperial Army and a member of the Royal Geographic Society. He embodied the tragic duality of the colonized elite: loving his people but serving the empire.' },
              { title: 'The Kashgar Mission', content: 'His fame rests on his spy mission to Kashgar (Xinjiang) in 1858. The region was closed to Europeans; any caught were executed. Shokan shaved his head, disguised himself as a merchant, and infiltrated the city for 5 months. His report, "On the Condition of Altysahr," was a scientific sensation in Europe.' },
              { title: 'The Scholar', content: 'He was the first to transcribe the Kyrgyz epic "Manas," bringing it to the world. He wrote on shamanism, judicial reform, and history. He was a close friend of Fyodor Dostoevsky, influencing the writer\'s views.' },
              { title: 'Untimely Death', content: 'Disillusioned by Russian colonial brutality and the backwardness of his own feudal kin, he retired to a remote aul and died of tuberculosis at 29. He remains the symbol of unfulfilled potential and the first modern Kazakh scientist.' }
          ],
          image: IMAGES.shokan, specs: { activity: 'Ethnographer', work: 'Kashgaria', lineage: 'Tore' } 
        },
        { 
          id: 'p6', name: 'Kurmangazy', desc: 'Spirit of Freedom.', 
          details: [
              { title: 'The Rebel Musician', content: 'Kurmangazy (1818–1896) is the Beethoven of the Dombra. He was born poor and spent his life in conflict with the rich (bais) and the colonial authorities. He was repeatedly imprisoned. His music is the soundtrack of rebellion—fast, aggressive, and technically demanding.' },
              { title: 'Saryarka', content: 'His masterpiece "Saryarka" (The Golden Steppe) is the most famous piece of Kazakh music. It captures the sound of the wind, the galloping herd, and the vast, free horizon. It is an explosion of energy that accelerates to a frenzy. It is played at every major national celebration.' },
              { title: 'Kishkentay', content: 'His first kui, "Kishkentay" (The Small One), was dedicated to the leader of a peasant uprising, Isatay Taymanuly. This cemented the tradition of the "Kui" as a political statement. Kurmangazy proved that instrumental music could be subversive.' },
              { title: 'The School', content: 'He established the "Tokpe" style of Western Kazakhstan. His grave in the Astrakhan region is a pilgrimage site for musicians. His image is synonymous with the uncrushable spirit of the nomad.' }
          ],
          image: IMAGES.kurmangazy, specs: { genre: 'Kui', instrument: 'Dombra', work: 'Saryarka' } 
        },
        { 
          id: 'p7', name: 'Dina Nurpeisova', desc: 'The Matriarch of Kui.', 
          details: [
              { title: 'The Girl Prodigy', content: 'Dina (1861–1955) met the legendary Kurmangazy when she was a child. He recognized her genius and mentored her for 9 years, calling her "my daughter." She was one of the few women to break into the male-dominated world of professional dombra performance.' },
              { title: 'Surviving History', content: 'Her life spanned three eras: the feudal Khanate, the Tsarist colonization, and the Soviet Union. She survived the horrific famine of the 1930s, losing her husband and children, yet her music never lost its optimism and power. She carried the "old style" of playing into the age of radio.' },
              { title: 'Technique', content: 'Dina was known for her "male" style of playing—powerful strokes and incredible speed. However, she added a psychological depth and lyrical complexity ("Bulbul" - Nightingale) that was unique. At age 75, she won the first All-Union music contest in Moscow, stunning the jury.' },
              { title: 'The Bridge', content: 'She is the link between the semi-mythical bards of the 19th century and the academic musicians of the 20th. Without her, the authentic tradition of the Western dombra school might have been lost.' }
          ],
          image: IMAGES.dina, specs: { teacher: 'Kurmangazy', style: 'Tokpe kui', title: 'People\'s Artist' } 
        },
        { 
          id: 'p8', name: 'Bogenbay Batyr', desc: 'The Shield.', 
          details: [
              { title: 'The General', content: 'Bogenbay (1680–1778) was the commander-in-chief (Sardar) of the Kazakh armies under Abylai Khan. For 60 years, he did not leave the saddle, fighting over 100 battles against the Dzungars. He is the personification of military duty.' },
              { title: 'Battle of Anrakay', content: 'His tactical genius was crucial in the Battle of Anrakay (1729), the turning point where the united Kazakh forces finally broke the Dzungar occupation. He was known for his personal bravery, often challenging enemy commanders to single combat (Jekpe-jek) and winning.' },
              { title: 'Diplomat', content: 'Bogenbay was not just a brute; he was a refined diplomat. He led the first Kazakh embassy to China in 1756, negotiating a peace treaty with the Qing Emperor. He understood that peace was as hard to win as war.' },
              { title: 'National Mourning', content: 'When he died, the great bard Bukhar Zhyrau sang the "Death of Bogenbay" to Khan Abylai, causing the Khan to weep openly. He was buried in the Mausoleum of Yasawi, earning his place in the holy pantheon.' }
          ],
          image: IMAGES.bogenbay, specs: { clan: 'Kanjygaly', feat: 'Dzungar War', role: 'Sardar' } 
        },
        { 
          id: 'p9', name: 'Kenesary Khan', desc: 'The Last Monarch.', 
          details: [
              { title: 'The Last Stand', content: 'Kenesary (1802–1847) was the grandson of Abylai Khan and the last legitimate Khan recognized by all three Juzes. He led a massive 10-year war (1837–1847) against Russian colonization. Unlike previous localized revolts, his was a war for national independence and the restoration of statehood.' },
              { title: 'State Builder', content: 'Kenesary was not a bandit; he was a monarch. He set up a functioning state with tax collectors, sharia courts, a diplomatic corps, and a regular army. He tried to modernize the khanate to resist the empire. He was a brutal but charismatic leader.' },
              { title: 'Tragic End', content: 'Forced south by superior Russian artillery, he sought alliance with the Kyrgyz manaps. They betrayed him. In his final battle, outnumbered, he refused to flee, choosing to die with his warriors. He was captured and executed. His head was cut off and sent to the Tsar.' },
              { title: 'The Lost Head', content: 'The skull of Kenesary Khan remains a sensitive political issue. It was lost in Russian museums (rumored to be in the Kunstkamera). Its return is seen by many as a necessary spiritual condition for the full restoration of Kazakhstan\'s sovereignty. He is the "Braveheart" of Kazakh history.' }
          ],
          image: IMAGES.kenesary, specs: { status: 'Khan', goal: 'Independence', fate: 'Fighter' } 
        }
      ],
      clothing: [
        { 
          id: 'cl1', name: 'Saukele', desc: 'Crown of the Bride.', 
          details: [
              { title: 'The High Cone', content: 'The Saukele is the most iconic and complex piece of Kazakh clothing. It is a high, conical hat (up to 70cm) worn by a bride. Its shape mimics the sacred mountain peaks or the cypress tree (Tree of Life). It represents the bride\'s elevation to a higher spiritual status as she creates a new life.' },
              { title: 'A Fortune on the Head', content: 'A Saukele could cost a herd of horses. It was made of velvet, reinforced with a felt liner, and covered in silver plates, coral, turquoise, and pearls. The temporal pendants (Zhyry) framed the face. A sheer white veil (Jelek) was attached to the back, covering the bride\'s figure but not her face. It was the centerpiece of the dowry.' },
              { title: 'Rite of Passage', content: 'The bride wore the Saukele during the wedding procession and for the first year of marriage (on holidays). After the birth of the first child, it was replaced by the "Kimeshek" of a matron. The Saukele was then kept as a family heirloom or dismantled to make jewelry for the daughter.' },
              { title: 'Magical Defense', content: 'The top was often decorated with owl feathers (Uki) to ward off the evil eye, which was believed to be particularly dangerous to beautiful brides. The silver plates acted as armor against spirits.' }
          ],
          image: IMAGES.saukele, specs: { type: 'Headdress', wearer: 'Bride', decor: 'Silver/Coral' } 
        },
        { 
          id: 'cl2', name: 'Chapan', desc: 'Robe of Honor.', 
          details: [
              { title: 'The Universal Robe', content: 'The Chapan is a long, open-fronted coat worn by men and women. It is cut spaciously to allow for easy riding and sitting cross-legged on the floor. It is worn over inner clothes (shirt/pants). In winter, it is padded with camel wool; in summer, it is a light silk shell.' },
              { title: 'Shapan Jabu', content: 'The custom of "Shapan Jabu" (throwing a chapan) is the highest form of Kazakh gift-giving. If an honored guest, a poet, or a hero visits, the host must place a chapan on their shoulders. To refuse is an insult. The quality of the chapan reflects the respect accorded. Khans gave gold-embroidered chapans to batyrs.' },
              { title: 'Ornamentation', content: 'Every region has its style. The South prefers intricate floral embroidery. The West prefers stark, geometric lines. The collar and hem are always reinforced with embroidery to prevent wear and "close" the garment spiritually against demons.' },
              { title: 'Modern Use', content: 'Today, the Chapan has been reinvented. Modern designers create stylish, fitted chapans that are worn as evening coats or cardigans. It remains the standard gift at jubilees and official state visits.' }
          ],
          image: IMAGES.chapan, specs: { material: 'Velvet/Silk', pattern: 'Gold Thread', tradition: 'Gift of Respect' } 
        },
        { 
          id: 'cl3', name: 'Kimeshek', desc: 'Mother\'s Dignity.', 
          details: [
              { title: 'The White Crown', content: 'The Kimeshek is a head-covering for married women, specifically adopted after the first child is born. It is made of white calico or silk, symbolizing purity and milk. It covers the hair, neck, shoulders, and chest, leaving a cutout for the face. Unlike a hijab, it is not a veil; the face is open.' },
              { title: 'Design for Life', content: 'The design is intensely practical. The chest flap protects the woman\'s clothes from breast milk and allows for discreet nursing. The loose structure is comfortable for daily work. Yet, it is dignified, framing the face like a portrait.' },
              { title: 'Evolution of Decor', content: 'A young woman\'s Kimeshek is heavily embroidered with red and green patterns on the hood and chest. As she ages, the embroidery becomes simpler and darker. An elderly matriarch wears a pure white Kimeshek, signifying her proximity to the spiritual world. It commands instant respect from men.' },
              { title: 'Regional Shapes', content: 'The shape of the hood varies wildly. In the South, it is wrapped like a turban. In the East and North, it has a stiff, high board-like front. In the West (Mangystau), it is draped loosely. Ethnographers can identify a woman\'s clan by her Kimeshek.' }
          ],
          image: IMAGES.kimeshek, specs: { color: 'White', wearer: 'Mothers', meaning: 'Purity' } 
        },
        { 
          id: 'cl4', name: 'Takiya', desc: 'Everyday Cap.', 
          details: [
              { title: 'The Base Layer', content: 'The Takiya is a round, light skullcap. Nomads rarely went bareheaded (it was considered bad luck or a sign of mourning). The Takiya was worn indoors and outdoors, often serving as a liner under the heavy fur Tymak or the felt Kalpak.' },
              { title: 'Gender Differences', content: 'Men\'s Takiyas are usually made of velvet or cotton, embroidered with restrained geometric patterns ("Muiz"). Girls\' Takiyas are works of art—made of bright velvet (red, purple), embroidered with gold, and decorated with beads and pearls. The most crucial element for a girl is the "Uki"—a tuft of owl feathers on top.' },
              { title: 'The Owl Feather', content: 'The Uki is a powerful amulet. Owls are sacred birds that see in the dark (spirits). The feathers protect the wearer. A girl wearing a Takiya with feathers was signaling her unmarried, free status. Once she married, the feathers were removed or she switched headdress.' },
              { title: 'Identity', content: 'Today, the Takiya is the most common symbol of Kazakh identity worn by youth. Modern versions with minimalist designs are popular streetwear.' }
          ],
          image: IMAGES.takiya, specs: { type: 'Light', decor: 'Pattern/Feathers', season: 'Summer' } 
        },
        { 
          id: 'cl5', name: 'Tymak', desc: 'Winter Shield.', 
          details: [
              { title: 'Fortress Against Frost', content: 'The Tymak is the ultimate winter hat, engineered for the harsh steppe, where temperatures drop to -40°C with howling winds. It consists of four large flaps (ears): two for the ears, one wide one for the back of the neck/shoulders, and a visor. It completely seals the head.' },
              { title: 'Materials', content: 'It is made of felt covered with fabric (velvet/cloth) and lined with fur. The type of fur indicated status. Fox (Tulki) was common. Wolf (Bori) was for warriors. Otter or sable was for the rich. A good Tymak was valued as much as a camel.' },
              { title: 'Male Honor', content: 'The Tymak was sacred to a man. You could not exchange it, throw it, or step on it. In a dispute, if a man threw his Tymak on the ground, it meant he was staking his life on his word. To knock a Tymak off someone\'s head was a declaration of war.' },
              { title: 'The Incubator', content: 'A fascinating folk usage: if a baby was born prematurely, it was placed inside a large, warm, old fox-fur Tymak suspended from the yurt roof. The warmth and gentle rocking served as a primitive incubator, saving thousands of infants.' }
          ],
          image: IMAGES.tymak, specs: { material: 'Fur', season: 'Winter', protection: 'Cold' } 
        },
        { 
          id: 'cl6', name: 'Masi', desc: 'Inner Boot.', 
          details: [
              { title: 'The Double Shoe System', content: 'Nomadic life required a shoe system that worked both in the saddle (mud/snow) and on the carpets of the yurt (clean). The solution was the Masi-Kebis combination. Masi are soft, sole-less boots made of fine goat leather (itchigi). Over them, one wore "Kebis" (heavy leather galoshes) or riding boots.' },
              { title: 'Etiquette', content: 'Upon entering a yurt, the rider would kick off the Kebis at the door, stepping onto the carpets in clean Masi. This kept the living space sanitary while keeping the feet warm. Masi were never taken off in public.' },
              { title: 'Decoration', content: 'Men\'s Masi are usually plain black or brown. Women\'s Masi are often decorated with appliquéd leather patterns in contrasting colors. They are incredibly comfortable, acting like a second skin.' },
              { title: 'Religious Utility', content: 'For Muslims, Masi are practical for "Wudu" (ablution). Instead of washing bare feet in freezing water five times a day, one can simply wipe wet hands over the leather Masi (Masah), making them popular among the pious and the elderly.' }
          ],
          image: IMAGES.masi, specs: { material: 'Leather', feature: 'Soft', wearing: 'With galoshes' } 
        },
        { 
          id: 'cl7', name: 'Beldik', desc: 'Warrior\'s Belt.', 
          details: [
              { title: 'The Backbone of the Man', content: 'A belt (Beldik) was more than an accessory; it was the container of a man\'s life. It held his knife (Pyhsak), flint, bullet pouch, and sword. A man without a belt was considered "loose" or undisciplined. "Bel" (waist) is linguistically linked to strength and lineage in Kazakh.' },
              { title: 'Kise Beldik', content: 'The warrior\'s belt, "Kise," was wide and made of thick leather. It was decorated with hanging straps and heavy silver plates. The shape and pattern of the silver plates often indicated the warrior\'s clan (Tamga) and rank. A rich belt could protect the kidneys from a sword slash.' },
              { title: 'Brotherhood', content: 'Exchanging belts was a sacred rite of adoption or truce. If two batyrs exchanged belts, they became "Dos" (blood friends). In wrestling (Kazakhsha Kures), the belt is the primary point of leverage.' },
              { title: 'Aesthetic', content: 'The leather was often embossed or stamped. The silver was blackened (Niello) to prevent glare in the sun. The sound of the heavy belt creaking was the sound of authority.' }
          ],
          image: IMAGES.beldik, specs: { material: 'Silver/Leather', symbol: 'Courage', decor: 'Engraving' } 
        },
        { 
          id: 'cl8', name: 'Kamzol', desc: 'Feminine Silhouette.', 
          details: [
              { title: 'The Hourglass', content: 'The Kamzol is a sleeveless vest or jacket worn by women over the dress (Koyle). It is fitted tightly at the waist and flares out at the hips, creating a feminine silhouette. It provides warmth for the core while leaving the arms free for work (dough, embroidery, cradle).' },
              { title: 'Fabrics of the Silk Road', content: 'Kamzols were made from the finest imported fabrics: velvet (Barqyt), plush, silk, or brocade. They came in deep, rich colors: royal blue, emerald green, burgundy, or cherry. The lining was often made of warm cotton or wool.' },
              { title: 'Jewelry on Fabric', content: 'The closure of the Kamzol was a focal point. It was fastened with "Kapsyrma"—large, decorative silver clasps, often shaped like double eagles, butterflies, or leaves. The neckline and edges were embroidered with gold or silver thread. A girl received her first adult Kamzol at age 12-13.' },
              { title: 'Versatility', content: 'There are long Kamzols (below the knee) for older women and short ones for girls. It is a garment that has survived modernization; many Kazakh women today wear stylized Kamzols in offices or at parties.' }
          ],
          image: IMAGES.kamzol, specs: { type: 'Sleeveless', fabric: 'Velvet', decor: 'Buttons' } 
        },
        { 
          id: 'cl9', name: 'Shekpan', desc: 'Nomad\'s Coat.', 
          details: [
              { title: 'Camel Wool Coat', content: 'Shekpan is a coat woven from undyed camel hair. It is the color of the desert—beige or light brown. Camel wool is hollow, making it an incredible thermostat: it keeps you cool in the sun and warm in the wind. It is also naturally water-repellent (oily) and very durable.' },
              { title: 'The Traveler\'s Home', content: 'For a traveler or shepherd, the Shekpan was a tent. He could wrap himself in it and sleep on the snow. It was said that a scorpion would not crawl onto a Shekpan because of the smell of the camel.' },
              { title: 'Social Signifier', content: 'While Chapans were often silk/velvet for the rich, the Shekpan was the democratic wear of the people. However, a fine, thin Shekpan woven from baby camel wool was a luxury item. Elders preferred it for its lightness.' },
              { title: 'Weaving', content: 'Unlike felt (which is matted), Shekpan fabric is woven on a loom. The strips of cloth are narrow (due to the loom width) and then sewn together. The seam lines are often decorated with simple piping.' }
          ],
          image: IMAGES.shekpan, specs: { material: 'Camel wool', property: 'Warm', color: 'Natural' } 
        }
      ]
    }
};
