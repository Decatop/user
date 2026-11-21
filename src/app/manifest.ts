import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Deca Top Global Roofing System',
    short_name: 'Deca Top',
    description:
      'Imported stone-coated tiles, aluminium roofing, alu-zinc sheets and roofing accessories.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3f6fa',
    theme_color: '#2F5D8C',
    icons: [],
  };
}
