// Botões de filtro rápido por projeto (ícone, nome e cores de cada atalho).
import { BookOpen, Home, Layers, ShoppingBasket, Trophy, type LucideIcon } from 'lucide-react';
import { isProjectMatch, type contarPorProjeto } from './filtros';

export interface ProjetoPreset {
  id: 'todos' | 'esporte' | 'cestas' | 'moradia' | 'cidadania';
  label: string;
  shortLabel: string;
  /** Nome completo do projeto (usado como padrão ao cadastrar e no banner) */
  projectName?: string;
  icon: LucideIcon;
  activeBtnClass: string;
  inactiveBtnClass: string;
  count: number;
}

export function montarPresets(counts: ReturnType<typeof contarPorProjeto>): ProjetoPreset[] {
  return [
    {
      id: 'todos',
      label: 'Todos os Projetos',
      shortLabel: 'Todos',
      icon: Layers,
      activeBtnClass: 'bg-brand-dark text-white border-slate-900 shadow-xs ring-2 ring-slate-400/30',
      inactiveBtnClass: 'bg-white text-body hover:bg-sand border-line',
      count: counts.todos,
    },
    {
      id: 'esporte',
      label: 'Apenas Esporte',
      shortLabel: 'Esporte',
      projectName: 'Centro de Iniciação Esportiva',
      icon: Trophy,
      activeBtnClass: 'bg-lime-700 text-white border-lime-700 shadow-xs ring-2 ring-lime-300 font-bold',
      inactiveBtnClass: 'bg-white text-lime-800 hover:bg-lime-50 border-lime-200',
      count: counts.esporte,
    },
    {
      id: 'cestas',
      label: 'Apenas Cestas',
      shortLabel: 'Cestas',
      projectName: 'Cestas Básicas e Primeira Necessidade',
      icon: ShoppingBasket,
      activeBtnClass: 'bg-sky-700 text-white border-sky-700 shadow-xs ring-2 ring-sky-300 font-bold',
      inactiveBtnClass: 'bg-white text-sky-800 hover:bg-sky-50 border-sky-200',
      count: counts.cestas,
    },
    {
      id: 'moradia',
      label: 'Apenas Moradia',
      shortLabel: 'Moradia',
      projectName: 'Moradia Digna',
      icon: Home,
      activeBtnClass: 'bg-orange-700 text-white border-orange-700 shadow-xs ring-2 ring-orange-300 font-bold',
      inactiveBtnClass: 'bg-white text-orange-800 hover:bg-orange-50 border-orange-200',
      count: counts.moradia,
    },
    {
      id: 'cidadania',
      label: 'Apenas Cidadania',
      shortLabel: 'Cidadania',
      projectName: 'Educação e Cidadania',
      icon: BookOpen,
      activeBtnClass: 'bg-violet-700 text-white border-violet-700 shadow-xs ring-2 ring-violet-300 font-bold',
      inactiveBtnClass: 'bg-white text-violet-800 hover:bg-violet-50 border-violet-200',
      count: counts.cidadania,
    },
  ];
}

/** O atalho está selecionado no filtro de projeto atual? */
export function presetSelecionado(preset: ProjetoPreset, projetoFiltrado: string): boolean {
  return (
    projetoFiltrado === preset.id || Boolean(preset.projectName && isProjectMatch(preset.projectName, projetoFiltrado))
  );
}

