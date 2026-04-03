import { UNSPLASH as UNSPLASH_SOURCE } from './unsplash_images';
import { projectId } from '../../../utils/supabase/info';

const fileMap: Record<keyof typeof UNSPLASH_SOURCE | string, string> = {
    goldenman: 'golden_man.jpg',
    turkestan: 'turkestan.jpg',
    korkyt: 'korkyt_ata.jpg',
    bayterek: 'bayterek.jpg',
    aisha: 'aisha_bibi.jpg',
    balkhash: 'lake_balkhash.jpg',
    kazygurt: 'kazygurt.jpg',
    kozy: 'kozy_korpesh.jpg',
    dombraLegend: 'korkyt_ata.jpg',
    felt: 'felt_making.jpg',
    embroidery: 'embroidery.jpg',
    jewelry: 'jewelry.jpg',
    leather: 'leatherwork.jpg',
    carpet: 'syrmak.jpg',
    pottery: 'pottery.jpg',
    bone: 'bone_carving.jpg',
    metal: 'blacksmithing.jpg',
    wood: 'wood_carving.jpg',
    beshbarmak: 'beshbarmak.jpg',
    kymyz: 'kymyz.jpg',
    baursak: 'baursak.jpg',
    kurt: 'kurt.jpg',
    kazy: 'kazy.jpg',
    shubat: 'shubat.jpg',
    irimshik: 'irimshik.jpg',
    zhent: 'zhent.jpg',
    shelpek: 'shelpek.jpg',
    abay: 'abay_qunanbayuli.jpg',
    alfarabi: 'al_farabi.jpg',
    tomyris: 'tomyris.jpg',
    abylai: 'abylai_khan.jpg',
    shokan: 'shokan_walikhanov.jpg',
    kurmangazy: 'kurmangazy.jpg',
    dina: 'dina_nurpeisova.jpg',
    bogenbay: 'bogenbay_batyr.webp',
    kenesary: 'kenesary_khan.jpg',
    saukele: 'saukele.jpg',
    chapan: 'chapan.jpg',
    kimeshek: 'kimeshek.jpg',
    takiya: 'takiya.jpg',
    tymak: 'tymak.jpg',
    masi: 'masi.webp',
    beldik: 'beldik.jpg',
    kamzol: 'kamzol.webp',
    shekpan: 'shekpan.jpg',
    sybyzgy: 'sybyzgy.jpg'
};

export const IMAGES = Object.fromEntries(
  Object.entries(UNSPLASH_SOURCE).map(([key, _]) => {
    const filename = fileMap[key] || `${key}.jpg`;
    return [key, `https://${projectId}.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/${filename}`];
  })
) as typeof UNSPLASH_SOURCE;

export const ASSETS = {
    sybyzgy: `https://${projectId}.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/sybyzgy.jpg`,
};

export const UNSPLASH = IMAGES;
