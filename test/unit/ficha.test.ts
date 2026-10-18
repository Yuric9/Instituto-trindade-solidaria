import { describe, expect, it } from 'vitest';
import {
  FICHA_VAZIA,
  TERMOS,
  ehIniciacaoEsportiva,
  ehMenorDeIdade,
  idadeEm,
  mascararFicha,
  validarFicha,
  type FichaEsportiva,
} from '../../src/utils/ficha';

const HOJE = new Date(2026, 9, 18); // 18/10/2026

const fichaOk: FichaEsportiva = {
  rg: '1234567',
  sexo: 'Masculino',
  categoria: 'Sub-13',
  responsavel: { nome: 'Joana Silva', rg: '', cpf: '529.982.247-25', telefone: '(62) 98888-1111', endereco: '' },
  termos_aceitos: true,
};

describe('idade', () => {
  it('conta a idade completa, considerando se já fez aniversário no ano', () => {
    expect(idadeEm('2008-10-18', HOJE)).toBe(18); // faz 18 hoje
    expect(idadeEm('2008-10-19', HOJE)).toBe(17); // faz 18 amanhã
    expect(idadeEm('data ruim', HOJE)).toBeNull();
  });

  it('menor de idade = menos de 18 anos', () => {
    expect(ehMenorDeIdade('2015-01-01', HOJE)).toBe(true);
    expect(ehMenorDeIdade('2008-10-18', HOJE)).toBe(false);
    expect(ehMenorDeIdade('', HOJE)).toBe(false);
  });
});

describe('validarFicha', () => {
  it('ficha completa de menor passa', () => {
    expect(validarFicha(fichaOk, '2013-05-01', HOJE)).toBeNull();
  });

  it.each([
    ['sem ficha', undefined],
    ['ficha vazia', FICHA_VAZIA],
    ['sem sexo', { ...fichaOk, sexo: '' }],
    ['sem categoria', { ...fichaOk, categoria: '' }],
    ['menino em categoria feminina', { ...fichaOk, categoria: 'Feminino Sub-17' }],
    ['menor sem responsável', { ...fichaOk, responsavel: undefined }],
    ['responsável sem nome', { ...fichaOk, responsavel: { ...fichaOk.responsavel!, nome: 'Jo' } }],
    ['responsável com telefone curto', { ...fichaOk, responsavel: { ...fichaOk.responsavel!, telefone: '9999' } }],
    ['termos não aceitos', { ...fichaOk, termos_aceitos: false }],
  ] as [string, FichaEsportiva | undefined][])('recusa %s', (_caso, ficha) => {
    expect(validarFicha(ficha, '2013-05-01', HOJE)).toEqual(expect.any(String));
  });

  it('adulto não precisa de responsável', () => {
    expect(validarFicha({ ...fichaOk, responsavel: undefined }, '1999-01-01', HOJE)).toBeNull();
  });
});

describe('outras regras', () => {
  it('reconhece a iniciação esportiva pelo nome (com ou sem acento)', () => {
    expect(ehIniciacaoEsportiva('Centro de Iniciação Esportiva')).toBe(true);
    expect(ehIniciacaoEsportiva('ESCOLINHA DE FUTEBOL')).toBe(true);
    expect(ehIniciacaoEsportiva('Moradia Digna')).toBe(false);
  });

  it('a ficha tem as 6 declarações da ficha em papel', () => {
    expect(TERMOS.map((t) => t.titulo)).toEqual([
      'Autorização',
      'Ciência dos riscos',
      'Condições de saúde',
      'Responsabilidade',
      'Atendimento emergencial',
      'Uso de imagem',
    ]);
  });

  it('mascararFicha esconde documentos e mantém categoria e sexo', () => {
    const m = mascararFicha(fichaOk);
    expect(m.categoria).toBe('Sub-13');
    expect(m.sexo).toBe('Masculino');
    expect(m.rg).toBe('Protegido (LGPD)');
    expect(m.responsavel?.cpf).toBe('***.***.247-**');
    expect(m.responsavel?.telefone).toBe('(62) ****-****');
    expect(m.responsavel?.nome).toBe('Joana Silva');
  });
});
