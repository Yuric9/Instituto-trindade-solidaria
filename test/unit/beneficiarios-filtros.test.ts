import { describe, expect, it } from 'vitest';
import type { Beneficiary, ProjectCard } from '../../src/types';
import {
  FILTROS_VAZIOS,
  contarPorProjeto,
  contarPorStatus,
  filtrarBeneficiarios,
  filtroDoProjeto,
  isProjectMatch,
  nomeArquivoCsv,
  normalize,
  temFiltrosAtivos,
  type Filtros,
  opcoesDeProjeto,
} from '../../src/components/admin/beneficiarios/filtros';

function ben(over: Partial<Beneficiary>): Beneficiary {
  return {
    id: over.id ?? crypto.randomUUID(),
    nome: 'Fulano',
    cpf: '000.000.000-00',
    nascimento: '2015-01-01',
    telefone: '(62) 90000-0000',
    email: '',
    endereco: 'Trindade - GO',
    projeto: 'Centro de Iniciação Esportiva',
    status: 'Pendente',
    observacoes: '',
    criado_em: '2026-01-01',
    atualizado_em: '2026-01-01',
    ...over,
  } as Beneficiary;
}

const BASE = [
  ben({ id: '1', nome: 'Ana Clara Peixoto', cpf: '012.345.678-90', telefone: '(62) 99124-5533', projeto: 'Moradia Digna', status: 'Aprovado' }),
  ben({ id: '2', nome: 'João Pedro', cpf: '529.982.247-25', telefone: '(62) 98888-1111', projeto: 'Centro de Iniciação Esportiva', status: 'Pendente' }),
  ben({ id: '3', nome: 'Mariana Souza', cpf: '111.444.777-35', projeto: 'Cestas Básicas e Primeira Necessidade', status: 'Em análise' }),
  ben({ id: '4', nome: 'Família Souza', projeto: 'Educação e Cidadania', status: 'Atendido/Entregue' }),
  ben({ id: '5', nome: 'Luana Capoeira', projeto: 'Aulas de Capoeira', status: 'Recusado' }),
];

const filtrar = (f: Partial<Filtros>) => filtrarBeneficiarios(BASE, { ...FILTROS_VAZIOS, ...f }).map((b) => b.id);

describe('normalize e isProjectMatch', () => {
  it('ignora acentos, maiúsculas e espaços nas pontas', () => {
    expect(normalize('  JOÃO Dança ')).toBe('joao danca');
  });

  it.each([
    ['Centro de Iniciação Esportiva', 'esporte', true],
    ['Futsal de Sábado', 'esporte', true],
    ['Cestas Básicas e Primeira Necessidade', 'cestas', true],
    ['Distribuição de Alimentos', 'cestas', true],
    ['Moradia Digna', 'moradia', true],
    ['Reforma de Casas', 'moradia', true],
    ['Educação e Cidadania', 'cidadania', true],
    ['Reforço Escolar', 'cidadania', true], // sem acento também casa ("reforco")
    ['Aulas de Capoeira', 'esporte', false], // capoeira é um projeto próprio
    ['Aulas de Capoeira', 'Aulas de Capoeira', true],
    ['Moradia Digna', 'esporte', false],
    ['Qualquer projeto', 'todos', true],
    ['Centro de Iniciação Esportiva', 'iniciação', true], // trecho do nome
  ])('isProjectMatch(%s, %s) = %s', (projeto, filtro, esperado) => {
    expect(isProjectMatch(projeto, filtro)).toBe(esperado);
  });

  it('filtroDoProjeto troca o nome pelo atalho quando existe um', () => {
    expect(filtroDoProjeto('Centro de Iniciação Esportiva')).toBe('esporte');
    expect(filtroDoProjeto('Moradia Digna')).toBe('moradia');
    expect(filtroDoProjeto('Horta Comunitária')).toBe('Horta Comunitária');
  });
});

describe('filtrarBeneficiarios', () => {
  it('sem filtros devolve todos', () => {
    expect(filtrar({})).toEqual(['1', '2', '3', '4', '5']);
  });

  it('busca por nome sem acento e sem diferenciar maiúsculas', () => {
    expect(filtrar({ busca: 'JOAO' })).toEqual(['2']);
    expect(filtrar({ busca: 'ana', tipoBusca: 'nome' })).toEqual(['1', '3', '5']); // Ana, Mariana e Luana
  });

  it('busca por CPF com ou sem pontuação', () => {
    expect(filtrar({ busca: '52998224725', tipoBusca: 'cpf' })).toEqual(['2']);
    expect(filtrar({ busca: '529.982', tipoBusca: 'cpf' })).toEqual(['2']);
  });

  it('no modo "Nome ou CPF" também encontra pelo telefone (3+ dígitos)', () => {
    expect(filtrar({ busca: '99124' })).toEqual(['1']);
    expect(filtrar({ busca: '99124', tipoBusca: 'nome' })).toEqual([]);
  });

  it('modo "Apenas Nome" não encontra por CPF', () => {
    expect(filtrar({ busca: '529', tipoBusca: 'nome' })).toEqual([]);
  });

  it('combina status e projeto', () => {
    expect(filtrar({ projeto: 'esporte' })).toEqual(['2']); // a capoeira não entra no atalho do esporte
    expect(filtrar({ projeto: 'Aulas de Capoeira' })).toEqual(['5']);
    expect(filtrar({ projeto: 'moradia', status: 'Aprovado' })).toEqual(['1']);
    expect(filtrar({ status: 'Pendente', busca: 'ana' })).toEqual([]);
  });

  it('temFiltrosAtivos ignora busca só com espaços', () => {
    expect(temFiltrosAtivos(FILTROS_VAZIOS)).toBe(false);
    expect(temFiltrosAtivos({ ...FILTROS_VAZIOS, busca: '   ' })).toBe(false);
    expect(temFiltrosAtivos({ ...FILTROS_VAZIOS, status: 'Aprovado' })).toBe(true);
  });
});

describe('contagens', () => {
  it('conta por área (projetos de fora das 4 áreas só entram no total)', () => {
    expect(contarPorProjeto(BASE)).toEqual({ todos: 5, esporte: 1, cestas: 1, moradia: 1, cidadania: 1 });
  });

  it('conta por status e calcula a porcentagem do total', () => {
    expect(contarPorStatus(BASE, 5)).toEqual({
      aprovados: 1,
      pendentes: 1,
      emAnalise: 1,
      atendidos: 1,
      recusados: 1,
      percentOfTotal: 100,
    });
    expect(contarPorStatus(BASE.slice(0, 1), 3).percentOfTotal).toBe(33);
    expect(contarPorStatus([], 0).percentOfTotal).toBe(0);
  });
});

describe('opcoesDeProjeto (campo Projeto no cadastro/edição)', () => {
  const projetos = [
    { id: 'proj-esporte', titulo: 'Iniciação Esportiva — Setor Solange' },
    { id: 'proj-1', titulo: 'Aulas de Capoeira' },
  ] as ProjectCard[];

  it('inclui as 4 áreas e os projetos novos do banco', () => {
    const opcoes = opcoesDeProjeto(projetos);
    expect(opcoes).toContain('Centro de Iniciação Esportiva');
    expect(opcoes).toContain('Aulas de Capoeira');
    expect(opcoes).not.toContain('Iniciação Esportiva — Setor Solange'); // já coberto por "Centro de Iniciação Esportiva"
  });

  it('mantém o projeto atual da pessoa, mesmo que não esteja na lista (salvar não troca sem querer)', () => {
    expect(opcoesDeProjeto(projetos, 'Iniciação Esportiva — Setor Solange')).toContain('Iniciação Esportiva — Setor Solange');
    expect(opcoesDeProjeto([], 'Projeto que foi apagado')).toContain('Projeto que foi apagado');
  });
});

describe('nomeArquivoCsv', () => {
  it.each([
    ['todos', undefined],
    ['esporte', 'inscritos_apenas_esporte_2026-10-13.csv'],
    ['Cestas Básicas e Primeira Necessidade', 'inscritos_apenas_cestas_2026-10-13.csv'],
    ['moradia', 'inscritos_apenas_moradia_2026-10-13.csv'],
    ['cidadania', 'inscritos_apenas_cidadania_2026-10-13.csv'],
    ['Horta Comunitária', 'inscritos_horta_comunit_ria_2026-10-13.csv'],
  ])('projeto "%s" → %s', (projeto, esperado) => {
    expect(nomeArquivoCsv(projeto, '2026-10-13')).toBe(esperado);
  });
});
