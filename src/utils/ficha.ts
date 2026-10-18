// Ficha de inscrição do Centro de Iniciação Esportiva (versão digital da ficha em papel do Instituto).
// Funções puras, usadas pelo formulário do site E pelo servidor (worker/routes/beneficiarios.ts),
// para que as duas pontas sigam exatamente as mesmas regras. Testes: test/unit/ficha.test.ts.
import { validateCPF, cleanDigits } from './validation';

/** Telefone com DDD: 10 ou 11 dígitos (mesma regra do servidor). */
const telefoneValido = (v: string) => /^\d{10,11}$/.test(cleanDigits(v || ''));

export const CATEGORIAS = ['Sub-09', 'Sub-11', 'Sub-13', 'Sub-15', 'Sub-17', 'Feminino Sub-17', 'Feminino Livre'] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const SEXOS = ['Masculino', 'Feminino'] as const;
export type Sexo = (typeof SEXOS)[number];

/** As 6 declarações da ficha em papel. O responsável aceita todas de uma vez. */
export const TERMOS = [
  {
    titulo: 'Autorização',
    texto:
      'Autorizo a participação do(a) menor nas atividades de iniciação esportiva promovidas pelo Instituto Trindade Solidária, realizadas nos setores Solange e Nova Canaã, no município de Trindade/GO.',
  },
  {
    titulo: 'Ciência dos riscos',
    texto:
      'Estou ciente de que a prática de atividades esportivas pode envolver riscos, tais como quedas, lesões leves, contusões, torções e, em casos raros, fraturas.',
  },
  {
    titulo: 'Condições de saúde',
    texto:
      'Declaro que o(a) menor encontra-se em condições adequadas de saúde para participar das atividades físicas, responsabilizando-me por informar previamente qualquer restrição médica, alergia ou condição especial.',
  },
  {
    titulo: 'Responsabilidade',
    texto:
      'Reconheço que o Instituto Trindade Solidária atua de forma voluntária e social, comprometido com a segurança e o bem-estar das crianças, adotando medidas preventivas durante as atividades. Estou ciente de que não há como eliminar totalmente os riscos inerentes à prática esportiva.',
  },
  {
    titulo: 'Atendimento emergencial',
    texto: 'Autorizo, em caso de necessidade, que o Instituto busque atendimento médico emergencial para o(a) menor.',
  },
  {
    titulo: 'Uso de imagem',
    texto:
      'Autorizo o uso da imagem do(a) menor em fotos e vídeos para divulgação das atividades do Instituto em redes sociais e materiais institucionais.',
  },
] as const;

/** Muda quando o texto dos termos mudar, para saber qual versão cada responsável aceitou. */
export const VERSAO_TERMOS = '2026-10';

export const AVISO_CAMISETA = 'É proibido o uso de qualquer camiseta de times de futebol.';

export interface Responsavel {
  nome: string;
  rg: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

export interface FichaEsportiva {
  rg: string;
  sexo: Sexo | '';
  categoria: Categoria | '';
  /** Só para atletas menores de idade. */
  responsavel?: Responsavel;
  termos_aceitos: boolean;
  termos_versao?: string;
}

export const FICHA_VAZIA: FichaEsportiva = { rg: '', sexo: '', categoria: '', termos_aceitos: false };
export const RESPONSAVEL_VAZIO: Responsavel = { nome: '', rg: '', cpf: '', telefone: '', endereco: '' };

/** A inscrição é para a iniciação esportiva (a área que usa a ficha)? */
export function ehIniciacaoEsportiva(projeto: string): boolean {
  const p = (projeto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return p.includes('esport') || p.includes('futebol');
}

/** Idade completa em anos numa data de referência (padrão: hoje). null se a data for inválida. */
export function idadeEm(nascimento: string, hoje: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(nascimento || '');
  if (!m) return null;
  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  let idade = hoje.getFullYear() - ano;
  if (hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)) idade--;
  return idade;
}

export const ehMenorDeIdade = (nascimento: string, hoje?: Date) => {
  const idade = idadeEm(nascimento, hoje);
  return idade !== null && idade < 18;
};

/**
 * Confere a ficha do atleta. Devolve a mensagem de erro (em português, para mostrar à pessoa)
 * ou null quando está tudo certo.
 */
export function validarFicha(ficha: Partial<FichaEsportiva> | undefined, nascimento: string, hoje?: Date): string | null {
  if (!ficha) return 'Preencha os dados da ficha de inscrição do atleta.';
  if (!ficha.sexo || !SEXOS.includes(ficha.sexo as Sexo)) return 'Informe o sexo do(a) atleta.';
  if (!ficha.categoria || !CATEGORIAS.includes(ficha.categoria as Categoria)) return 'Escolha a categoria do(a) atleta.';
  if (ficha.categoria.startsWith('Feminino') && ficha.sexo !== 'Feminino') {
    return 'As categorias femininas são só para atletas do sexo feminino.';
  }

  if (ehMenorDeIdade(nascimento, hoje)) {
    const r = ficha.responsavel;
    if (!r || !r.nome || r.nome.trim().length < 3) return 'Para atleta menor de idade, informe o nome completo do responsável.';
    if (!r.cpf || !validateCPF(r.cpf)) return 'O CPF do responsável é inválido.';
    if (!telefoneValido(r.telefone)) return 'Informe um telefone válido do responsável, com DDD.';
  }

  if (ficha.termos_aceitos !== true) return 'É preciso ler e aceitar os termos da ficha de inscrição.';
  return null;
}

/** Versão da ficha sem documentos do atleta e do responsável (para o perfil voluntário, LGPD). */
export function mascararFicha(ficha: FichaEsportiva): FichaEsportiva {
  const { responsavel, ...resto } = ficha;
  return {
    ...resto,
    rg: ficha.rg ? 'Protegido (LGPD)' : '',
    ...(responsavel && {
      responsavel: {
        nome: responsavel.nome,
        rg: responsavel.rg ? 'Protegido (LGPD)' : '',
        cpf: responsavel.cpf ? `***.***.${cleanDigits(responsavel.cpf).slice(6, 9) || '000'}-**` : '',
        telefone: responsavel.telefone ? responsavel.telefone.slice(0, 5) + '****-****' : '',
        endereco: responsavel.endereco ? 'Sigilo de Residência (Visível apenas para Coordenação/Admin)' : '',
      },
    }),
  };
}
