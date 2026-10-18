import { describe, expect, it } from 'vitest';
import type { ProjectCard } from '../../src/types';
import { categoriasDaGaleria } from '../../src/utils/categoriasGaleria';

const projeto = (id: string, titulo: string, ordem: number) => ({ id, titulo, ordem }) as ProjectCard;

describe('categorias da galeria', () => {
  it('sem projetos, não há categorias', () => {
    expect(categoriasDaGaleria([])).toEqual([]);
  });

  it('cada projeto vira uma categoria (pelo id), na ordem do site', () => {
    const cats = categoriasDaGaleria([
      projeto('proj-moradia', 'Moradia Digna', 3),
      projeto('proj-esporte', 'Centro de Iniciação Esportiva', 1),
      projeto('proj-1', 'Aulas de Capoeira', 5),
    ]);
    expect(cats.map((c) => c.id)).toEqual(['proj-esporte', 'proj-moradia', 'proj-1']);
    expect(cats.find((c) => c.id === 'proj-1')?.rotulo).toBe('Aulas de Capoeira');
  });
});
