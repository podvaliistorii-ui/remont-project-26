import { Injectable, signal, computed } from '@angular/core';

export interface RenovationType {
  id: string;
  titleKey: string;
  descriptionKey: string;
  taglineKey: string;
  image: string;
  gridClass: string;
}

export interface Specialist {
  id: string;
  nameKey: string;
  roleKey: string;
  experience: number;
  specializationKey: string;
  previewImage: string;
}

export interface Material {
  id: string;
  nameKey: string;
  brand: string;
  category: 'surface' | 'base' | 'finish';
  image: string;
  specs: { label: string; value: string }[];
  priceMod: number;
}

export interface Review {
  id: string;
  clientName: string;
  projectId: string;
  textKey: string;
  rating: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private readonly types = signal<RenovationType[]>([
    {
      id: 'capital',
      titleKey: 'SERVICES.CAPITAL',
      taglineKey: 'SERVICES.CAPITAL_TAGLINE',
      descriptionKey: 'SERVICES.CAPITAL_DESC',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
      gridClass: 'bento-capital'
    },
    {
      id: 'designer',
      titleKey: 'SERVICES.DESIGNER',
      taglineKey: 'SERVICES.DESIGN_TAGLINE',
      descriptionKey: 'SERVICES.DESIGN_DESC',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      gridClass: 'bento-designer'
    },
    {
      id: 'cosmetic',
      titleKey: 'SERVICES.COSMETIC',
      taglineKey: 'SERVICES.COSMETIC_TAGLINE',
      descriptionKey: 'SERVICES.COSMETIC_DESC',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      gridClass: 'bento-cosmetic'
    },
    {
      id: 'turnkey',
      titleKey: 'SERVICES.TURNKEY',
      taglineKey: 'SERVICES.TURNKEY_TAGLINE',
      descriptionKey: 'SERVICES.TURNKEY_DESC',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      gridClass: 'bento-turnkey'
    }
  ]);

  private readonly specialistsList = signal<Specialist[]>([
    {
      id: 'sp-1',
      nameKey: 'SPECIALISTS.N1_NAME',
      roleKey: 'SERVICES.PLUMBER',
      experience: 12,
      specializationKey: 'SPECIALISTS.N1_SPEC',
      previewImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'sp-2',
      nameKey: 'SPECIALISTS.N2_NAME',
      roleKey: 'SERVICES.ELECTRICIAN',
      experience: 15,
      specializationKey: 'SPECIALISTS.N2_SPEC',
      previewImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'sp-3',
      nameKey: 'SPECIALISTS.N3_NAME',
      roleKey: 'SERVICES.TILER',
      experience: 10,
      specializationKey: 'SPECIALISTS.N3_SPEC',
      previewImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'sp-4',
      nameKey: 'SPECIALISTS.N4_NAME',
      roleKey: 'SERVICES.MASTER',
      experience: 8,
      specializationKey: 'SPECIALISTS.N4_SPEC',
      previewImage: 'https://images.unsplash.com/photo-1581578731522-745d0514223e?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  private readonly materialsList = signal<Material[]>([
    {
      id: 'mat-1',
      nameKey: 'MATERIALS.MARBLE_CARRARA',
      brand: 'Antolini Italy',
      category: 'surface',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      priceMod: 450,
      specs: [{ label: 'HARDNESS', value: '3.5 MOHS' }, { label: 'POROSITY', value: '< 0.1%' }]
    },
    {
      id: 'mat-2',
      nameKey: 'MATERIALS.OAK_PARQUET',
      brand: 'Bauwerk',
      category: 'surface',
      image: 'https://images.unsplash.com/photo-1581578731522-745d0514223e?auto=format&fit=crop&w=800&q=80',
      priceMod: 220,
      specs: [{ label: 'WEAR_LAYER', value: '4MM' }, { label: 'FINISH', value: 'MATTE_LACQUER' }]
    },
    {
      id: 'mat-3',
      nameKey: 'MATERIALS.ECO_PAINT',
      brand: 'Caparol',
      category: 'finish',
      image: 'https://images.unsplash.com/photo-1562624382-82b821431bd0?auto=format&fit=crop&w=800&q=80',
      priceMod: 85,
      specs: [{ label: 'WASHABILITY', value: 'CLASS_1' }, { label: 'VOC_LEVEL', value: '< 1G/L' }]
    }
  ]);

  private readonly reviewsList = signal<Review[]>([
    {
      id: 'rev-1',
      clientName: 'Nodar T.',
      projectId: 'vake-residence',
      textKey: 'REVIEWS.REV1_TEXT',
      rating: 5,
      date: 'MAR 2024'
    },
    {
      id: 'rev-2',
      clientName: 'Elena G.',
      projectId: 'mtatsminda-heritage',
      textKey: 'REVIEWS.REV2_TEXT',
      rating: 5,
      date: 'DEC 2023'
    }
  ]);

  readonly renovationTypes = computed(() => this.types());
  readonly specialists = computed(() => this.specialistsList());
  readonly materials = computed(() => this.materialsList());
  readonly reviews = computed(() => this.reviewsList());

  readonly methodology = signal([
    { id: '01', title: 'METHOD.STEP1_TITLE', desc: 'METHOD.STEP1_DESC' },
    { id: '02', title: 'METHOD.STEP2_TITLE', desc: 'METHOD.STEP2_DESC' },
    { id: '03', title: 'METHOD.STEP3_TITLE', desc: 'METHOD.STEP3_DESC' },
    { id: '04', title: 'METHOD.STEP4_TITLE', desc: 'METHOD.STEP4_DESC' }
  ]);
}
