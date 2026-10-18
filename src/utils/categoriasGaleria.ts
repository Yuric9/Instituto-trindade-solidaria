// Categorias das fotos da galeria = os projetos do Instituto (lidos do banco), na ordem do site.
// A foto guarda o id do projeto (ex.: "proj-esporte"); "geral" é a categoria "Geral / Sede".
import type { ProjectCard } from '../types';

export interface CategoriaGaleria {
  id: string;
  rotulo: string;
}

export const CATEGORIA_GERAL: CategoriaGaleria = { id: 'geral', rotulo: 'Geral / Sede' };

/** Uma categoria por projeto, na ordem do site. */
export function categoriasDaGaleria(projects: ProjectCard[] = []): CategoriaGaleria[] {
  return [...projects]
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((p) => ({ id: p.id, rotulo: p.titulo }));
}
