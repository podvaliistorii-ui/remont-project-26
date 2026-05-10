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

  readonly renovationTypes = computed(() => this.types());
  readonly specialists = computed(() => this.specialistsList());
}
