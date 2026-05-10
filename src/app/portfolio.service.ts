import { Injectable, signal } from '@angular/core';

export interface Project {
  id: string;
  titleKey: string;
  taskKey: string;
  solutionKey: string;
  districtKey: string;
  area: string;
  year: string;
  mainMedia: {
    type: 'image' | 'video';
    url: string;
    poster?: string;
    altKey?: string;
  };
  galleryImages: { url: string; altKey: string }[]; // Updated to include altKey
  finalVideoUrl: string;
  technicalPassport: {
    typeKey: string;
    acousticRating: string;
    wiringStandard: string;
    hvacConfiguration: string;
    materialOrigin: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  readonly projects = signal<Project[]>([
    {
      id: 'vake-residence',
      titleKey: 'PROJECTS.VAKE_TITLE',
      taskKey: 'PROJECTS.VAKE_TASK',
      solutionKey: 'PROJECTS.VAKE_SOLUTION',
      districtKey: 'CALCULATOR.DISTRICTS.vake',
      area: '240',
      year: '2024',
      mainMedia: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80',
        altKey: 'PROJECTS.ALTS.VAKE_MAIN'
      },
      galleryImages: [
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.VAKE_G1' },
        { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.VAKE_G2' },
        { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.VAKE_G3' },
        { url: 'https://images.unsplash.com/photo-1600570994443-d7a12f1f355b?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.VAKE_G4' }
      ],
      finalVideoUrl: 'assets/hero-bg.mp4',
      technicalPassport: {
        typeKey: 'PROJECTS.TYPE_NEW_BUILD',
        acousticRating: 'Rw 58 dB envelope',
        wiringStandard: 'IEC 60364 concealed bus',
        hvacConfiguration: 'VRF with fresh-air recovery',
        materialOrigin: 'Georgia stone, Italy glass'
      }
    },
    {
      id: 'mtatsminda-heritage',
      titleKey: 'PROJECTS.MTATSMINDA_TITLE',
      taskKey: 'PROJECTS.MTATSMINDA_TASK',
      solutionKey: 'PROJECTS.MTATSMINDA_SOLUTION',
      districtKey: 'CALCULATOR.DISTRICTS.mtatsminda',
      area: '110',
      year: '2023',
      mainMedia: {
        type: 'video',
        url: 'assets/hero-bg.mp4',
        poster: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
        altKey: 'PROJECTS.ALTS.MTATSMINDA_MAIN'
      },
      galleryImages: [
        { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.MTATSMINDA_G1' },
        { url: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.MTATSMINDA_G2' },
        { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.MTATSMINDA_G3' },
        { url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.MTATSMINDA_G4' }
      ],
      finalVideoUrl: 'assets/hero-bg.mp4',
      technicalPassport: {
        typeKey: 'PROJECTS.TYPE_HERITAGE',
        acousticRating: 'Rw 52 dB partition set',
        wiringStandard: 'DIN rail smart-home spine',
        hvacConfiguration: 'Ducted split with silent returns',
        materialOrigin: 'Local concrete, Caucasus oak'
      }
    },
    {
      id: 'saburtalo-modern',
      titleKey: 'PROJECTS.SABURTALO_TITLE',
      taskKey: 'PROJECTS.SABURTALO_TASK',
      solutionKey: 'PROJECTS.SABURTALO_SOLUTION',
      districtKey: 'CALCULATOR.DISTRICTS.saburtalo',
      area: '150',
      year: '2024',
      mainMedia: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
        altKey: 'PROJECTS.ALTS.SABURTALO_MAIN'
      },
      galleryImages: [
        { url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.SABURTALO_G1' },
        { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6f3ea?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.SABURTALO_G2' },
        { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.SABURTALO_G3' },
        { url: 'https://images.unsplash.com/photo-1600566752231-01f654b00f72?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.SABURTALO_G4' }
      ],
      finalVideoUrl: 'assets/hero-bg.mp4',
      technicalPassport: {
        typeKey: 'PROJECTS.TYPE_NEW_BUILD',
        acousticRating: 'Rw 55 dB floor build-up',
        wiringStandard: 'KNX-ready radial circuits',
        hvacConfiguration: 'Ceiling cassette zoning',
        materialOrigin: 'EU steel, Georgian terrazzo'
      }
    },
    {
      id: 'vera-stalinka',
      titleKey: 'PROJECTS.VERA_TITLE',
      taskKey: 'PROJECTS.VERA_TASK',
      solutionKey: 'PROJECTS.VERA_SOLUTION',
      districtKey: 'CALCULATOR.DISTRICTS.vera',
      area: '85',
      year: '2022',
      mainMedia: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600607687644-ac4f0afb611c?auto=format&fit=crop&w=1600&q=80',
        altKey: 'PROJECTS.ALTS.VERA_MAIN'
      },
      galleryImages: [
        { url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.VERA_G1' },
        { url: 'https://images.unsplash.com/photo-1600607686527-0243e1e449c4?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.VERA_G2' },
        { url: 'https://images.unsplash.com/photo-1600585154526-990dcea42e49?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.VERA_G3' },
        { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', altKey: 'PROJECTS.ALTS.VERA_G4' }
      ],
      finalVideoUrl: 'assets/hero-bg.mp4',
      technicalPassport: {
        typeKey: 'PROJECTS.TYPE_STALINKA',
        acousticRating: 'Rw 49 dB heritage shell',
        wiringStandard: 'Low-impact surface conduits',
        hvacConfiguration: 'Compact hydronic radiators',
        materialOrigin: 'Recovered brick, aged brass'
      }
    }
  ]);

  getProjectById(id: string): Project | undefined {
    return this.projects().find(p => p.id === id);
  }
}
