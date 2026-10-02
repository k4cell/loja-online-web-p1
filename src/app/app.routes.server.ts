import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'busca', renderMode: RenderMode.Client },
  { path: 'cesta', renderMode: RenderMode.Client },
  { path: 'detalhe/:codigo', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
