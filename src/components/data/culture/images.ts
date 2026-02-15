// --- Assets ---
// Unified Source Strategy:
// All assets are served exclusively from Supabase Storage (make-1a93d248-public-assets).
// Naming convention follows: snake_case.jpg (or .webp where specified).
// Verified against user-provided file list and corrections.

const PROJECT_ID = 'wrxtnfwckeqhwfjsaifh';
const BUCKET_NAME = 'make-1a93d248-public-assets';
const SUPABASE_BASE = `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/`;

export const ASSETS = {
    sybyzgy: `${SUPABASE_BASE}sybyzgy.jpg`, 
};

export const IMAGES = {
    felt: `${SUPABASE_BASE}felt_making.jpg`,
    embroidery: `${SUPABASE_BASE}embroidery.jpg`,
    jewelry: `${SUPABASE_BASE}jewelry.jpg`,
    leather: `${SUPABASE_BASE}leatherwork.jpg`,
    carpet: `${SUPABASE_BASE}syrmak.jpg`,
    pottery: `${SUPABASE_BASE}pottery.jpg`,
    bone: `${SUPABASE_BASE}bone_carving.jpg`,
    metal: `${SUPABASE_BASE}blacksmith.jpg`,
    wood: `${SUPABASE_BASE}wood_carving.jpg`,
    
    goldenman: `${SUPABASE_BASE}golden_man.jpg`,
    turkestan: `${SUPABASE_BASE}turkestan.jpg`,
    korkyt: `${SUPABASE_BASE}korkyt_ata.jpg`,
    bayterek: `${SUPABASE_BASE}bayterek.jpg`,
    aisha: `${SUPABASE_BASE}aisha_bibi.jpg`,
    balkhash: `${SUPABASE_BASE}lake_balkhash.jpg`,
    kazygurt: `${SUPABASE_BASE}kazygurt.jpg`,
    kozy: `${SUPABASE_BASE}kozy_korpesh.jpg`,
    dombraLegend: `${SUPABASE_BASE}aksak_kulan.jpg`,
    
    beshbarmak: `${SUPABASE_BASE}beshbarmak.jpg`,
    kymyz: `${SUPABASE_BASE}kymyz.jpg`,
    baursak: `${SUPABASE_BASE}baursak.jpg`,
    kurt: `${SUPABASE_BASE}kurt.jpg`,
    kazy: `${SUPABASE_BASE}kazy.jpg`,
    irimshik: `${SUPABASE_BASE}irimshik.jpg`,
    zhent: `${SUPABASE_BASE}zhent.jpg`,
    shelpek: `${SUPABASE_BASE}shelpek.jpg`,
    shubat: `${SUPABASE_BASE}shubat.jpg`,

    abay: `${SUPABASE_BASE}abay_qunanbayuli.jpg`,
    alfarabi: `${SUPABASE_BASE}al_farabi.jpg`,
    tomyris: `${SUPABASE_BASE}tomyris.jpg`,
    abylai: `${SUPABASE_BASE}abylai_khan.jpg`,
    shokan: `${SUPABASE_BASE}shokan_walikhanov.jpg`,
    kurmangazy: `${SUPABASE_BASE}kurmangazy.jpg`,
    dina: `${SUPABASE_BASE}dina_nurpeisova.jpg`,
    bogenbay: `${SUPABASE_BASE}bogenbay_batyr.webp`,
    kenesary: `${SUPABASE_BASE}kenesary_khan.jpg`,

    saukele: `${SUPABASE_BASE}saukele.jpg`,
    chapan: `${SUPABASE_BASE}chapan.jpg`,
    kimeshek: `${SUPABASE_BASE}kimeshek.jpg`,
    takiya: `${SUPABASE_BASE}takiya.jpg`,
    tymak: `${SUPABASE_BASE}tymak.jpg`,
    masi: `${SUPABASE_BASE}masi.webp`,
    beldik: `${SUPABASE_BASE}beldik.jpg`,
    kamzol: `${SUPABASE_BASE}kamzol.webp`,
    shekpan: `${SUPABASE_BASE}shekpan.jpg`
};

export const UNSPLASH = IMAGES;