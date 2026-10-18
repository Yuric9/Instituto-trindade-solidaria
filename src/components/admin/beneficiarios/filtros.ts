// Regras de busca, filtro e contagem da tela de beneficiários.
// Funções puras (sem React): recebem dados e devolvem resultado, por isso têm testes em test/unit/.
import type { Beneficiary, BeneficiaryStatus, ProjectCard } from '../../../types';
import { cleanDigits } from '../../../utils/validation';

export type TipoBusca = 'todos' | 'nome' | 'cpf';

export interface Filtros {
  busca: string;
  tipoBusca: TipoBusca;
  /** 'todos' ou um BeneficiaryStatus */
  status: string;
  /** 'todos', um dos atalhos (esporte, cestas, moradia, cidadania) ou o título de um projeto */
  projeto: string;
}

export const FILTROS_VAZIOS: Filtros = { busca: '', tipoBusca: 'todos', status: 'todos', projeto: 'todos' };

/** Atalhos de projeto que aparecem como botões de filtro rápido. */
export const ATALHOS_PROJETO = ['esporte', 'cestas', 'moradia', 'cidadania'] as const;
export type AtalhoProjeto = (typeof ATALHOS_PROJETO)[number];

export const STATUS_BENEFICIARIO: BeneficiaryStatus[] = [
  'Pendente',
  'Em análise',
  'Aprovado',
  'Atendido/Entregue',
  'Recusado',
];

/** Minúsculas, sem acentos e sem espaços nas pontas (busca insensível a acentos). */
export const normalize = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/** O projeto do beneficiário corresponde ao filtro? Aceita atalhos ('futebol') e nomes parciais. */
export function isProjectMatch(beneficiaryProject: string, filterVal: string): boolean {
  if (!filterVal || filterVal === 'todos') return true;
  if (beneficiaryProject === filterVal) return true;

  const bLower = normalize(beneficiaryProject);
  const fLower = normalize(filterVal);

  const contem = (...trechos: string[]) => trechos.some((t) => bLower.includes(t));
  if (fLower === 'esporte' || fLower === 'apenas esporte') {
    return contem('esport', 'futebol', 'futsal');
  }
  if (fLower === 'cestas' || fLower === 'apenas cestas') {
    return contem('cesta', 'aliment', 'primeira necessidade');
  }
  if (fLower === 'moradia' || fLower === 'apenas moradia') {
    return contem('moradia', 'reforma', 'habita', 'constru');
  }
  if (fLower === 'cidadania' || fLower === 'apenas cidadania') {
    return contem('cidadania', 'educa', 'reforco', 'oficina');
  }

  return bLower.includes(fLower);
}

/** Atalho correspondente a um projeto (para o clique no nome do projeto); senão, o próprio nome. */
export function filtroDoProjeto(projeto: string): string {
  return ATALHOS_PROJETO.find((atalho) => isProjectMatch(projeto, atalho)) ?? projeto;
}

/** Quantos beneficiários há em cada atalho de projeto (e no total). */
export function contarPorProjeto(beneficiaries: Beneficiary[]) {
  const counts = { todos: beneficiaries.length, esporte: 0, cestas: 0, moradia: 0, cidadania: 0 };
  beneficiaries.forEach((b) => {
    for (const atalho of ATALHOS_PROJETO) {
      if (isProjectMatch(b.projeto, atalho)) counts[atalho]++;
    }
  });
  return counts;
}

/** O CPF do beneficiário contém o texto buscado (com ou sem pontuação)? */
export function cpfCorresponde(cpf: string, busca: string): boolean {
  const trimmed = busca.trim();
  const buscaDigitos = cleanDigits(trimmed);
  return (buscaDigitos.length > 0 && cleanDigits(cpf).includes(buscaDigitos)) || cpf.includes(trimmed);
}

/** Aplica busca (nome, CPF ou telefone), status e projeto. */
export function filtrarBeneficiarios(beneficiaries: Beneficiary[], filtros: Filtros): Beneficiary[] {
  return beneficiaries.filter((b) => {
    const trimmed = filtros.busca.trim();
    let matchesSearch = true;

    if (trimmed) {
      const nameMatch = normalize(b.nome).includes(normalize(trimmed));
      const cpfMatch = cpfCorresponde(b.cpf, trimmed);

      if (filtros.tipoBusca === 'nome') {
        matchesSearch = nameMatch;
      } else if (filtros.tipoBusca === 'cpf') {
        matchesSearch = cpfMatch;
      } else {
        const digitos = cleanDigits(trimmed);
        const phoneMatch = digitos.length >= 3 && cleanDigits(b.telefone).includes(digitos);
        matchesSearch = nameMatch || cpfMatch || phoneMatch;
      }
    }

    const matchesStatus = filtros.status === 'todos' || b.status === filtros.status;
    const matchesProject = isProjectMatch(b.projeto, filtros.projeto);

    return matchesSearch && matchesStatus && matchesProject;
  });
}

export function temFiltrosAtivos(filtros: Filtros): boolean {
  return Boolean(filtros.busca.trim()) || filtros.status !== 'todos' || filtros.projeto !== 'todos';
}

/** Contagem por status da seleção atual e quanto ela representa do total. */
export function contarPorStatus(filtrados: Beneficiary[], totalGeral: number) {
  let aprovados = 0;
  let pendentes = 0;
  let emAnalise = 0;
  let atendidos = 0;
  let recusados = 0;

  filtrados.forEach((b) => {
    if (b.status === 'Aprovado') aprovados++;
    else if (b.status === 'Pendente') pendentes++;
    else if (b.status === 'Em análise') emAnalise++;
    else if (b.status === 'Atendido/Entregue') atendidos++;
    else if (b.status === 'Recusado') recusados++;
  });

  const percentOfTotal = totalGeral > 0 ? Math.round((filtrados.length / totalGeral) * 100) : 0;
  return { aprovados, pendentes, emAnalise, atendidos, recusados, percentOfTotal };
}

/** Nome do arquivo CSV conforme o projeto filtrado (undefined = nome padrão do exportador). */
export function nomeArquivoCsv(projeto: string, data: string): string | undefined {
  const atalho = ATALHOS_PROJETO.find((a) => projeto === a || isProjectMatch(projeto, a));
  if (atalho) return `inscritos_apenas_${atalho}_${data}.csv`;
  if (projeto !== 'todos') return `inscritos_${projeto.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${data}.csv`;
  return undefined;
}

/** Data de hoje no formato AAAA-MM-DD. */
export const hoje = () => new Date().toISOString().split('T')[0];

/** Nomes das 4 áreas de atuação (sempre aparecem como opção de projeto, mesmo antes de virem do banco). */
export const PROJETOS_LEGADOS = [
  'Centro de Iniciação Esportiva',
  'Cestas Básicas e Primeira Necessidade',
  'Moradia Digna',
  'Educação e Cidadania',
];

/**
 * Opções do campo "Projeto" ao cadastrar ou editar um beneficiário no painel:
 * as 4 áreas de atuação + todo projeto do banco que não seja uma delas (ex.: "Oficina de Capoeira")
 * + o projeto atual da pessoa, se não estiver na lista (assim salvar nunca troca o projeto sem querer).
 */
export function opcoesDeProjeto(projects: ProjectCard[] = [], atual?: string): string[] {
  const novos = projects
    .map((p) => p.titulo)
    .filter((titulo) => !ATALHOS_PROJETO.some((atalho) => isProjectMatch(titulo, atalho)));
  const opcoes = [...PROJETOS_LEGADOS, ...novos];
  if (atual && !opcoes.includes(atual)) opcoes.push(atual);
  return [...new Set(opcoes)];
}
