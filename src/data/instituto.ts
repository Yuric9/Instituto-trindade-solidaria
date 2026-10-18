// Dados institucionais do Instituto Trindade Solidária que não mudam com frequência
// (vêm do texto institucional / estatuto). Textos editáveis pelo painel ficam em initialData.ts.

export const INSTITUTO = {
  nome: 'Instituto Trindade Solidária',
  sigla: 'ITS',
  lema: 'Amor e compaixão ao próximo',
  natureza: 'Organização da Sociedade Civil (OSC) sem fins lucrativos',
  fundacao: '20 de outubro de 2021',
  anoFundacao: 2021,
  instagram: '@institutotrindadesolidaria',
  /** Nome usado no código PIX (máx. 25 caracteres, sem acentos, como pede o Banco Central). */
  nomePix: 'INST TRINDADE SOLIDARIA',
};

/** Territórios atendidos prioritariamente (maiores índices de vulnerabilidade social). */
export const BAIRROS_ATENDIDOS = ['Solange Park', 'Nova Canaã', 'Residencial Santa Fé', 'Jardins', 'Outras áreas periféricas'];

/** Finalidades estatutárias, em consonância com os objetivos da assistência social. */
export const FINALIDADES = [
  {
    titulo: 'Promoção da Assistência Social',
    texto:
      'Ações de proteção social básica que previnem riscos sociais e fortalecem a convivência familiar e comunitária.',
  },
  {
    titulo: 'Defesa e Garantia de Direitos',
    texto:
      'Promoção e defesa dos direitos socioassistenciais, com equidade, combate a toda forma de discriminação e mais acesso a políticas públicas.',
  },
  {
    titulo: 'Desenvolvimento Comunitário e Territorial',
    texto:
      'Participação da comunidade na identificação e no enfrentamento das vulnerabilidades locais, em articulação com a rede do SUAS.',
  },
  {
    titulo: 'Educação, Cultura e Esporte para a Inclusão',
    texto:
      'Educação não formal, cultura e esporte para desenvolver habilidades, fortalecer identidades e ampliar oportunidades.',
  },
];

/** Objetivos específicos (resumo do plano de ação). */
export const OBJETIVOS = [
  {
    titulo: 'Acesso e permanência na escola',
    texto: 'Reforço escolar, apoio com material e uniforme e acompanhamento para prevenir evasão e reprovação.',
  },
  {
    titulo: 'Cidadania, ética e direitos humanos',
    texto: 'Oficinas, debates e campanhas sobre diversidade, cultura de paz e prevenção à violência.',
  },
  {
    titulo: 'Autonomia e protagonismo',
    texto: 'Capacitação pessoal e profissional, participação das famílias nas decisões e geração de renda.',
  },
  {
    titulo: 'Rede socioassistencial integrada',
    texto: 'Articulação com CRAS, CREAS, saúde, educação, habitação e conselhos municipais.',
  },
  {
    titulo: 'Moradia digna e segura',
    texto: 'Reformas, acessibilidade, saneamento e participação dos moradores no planejamento das obras.',
  },
  {
    titulo: 'Equipe capacitada e valorizada',
    texto: 'Formação continuada no SUAS, supervisão, reconhecimento e cuidado com o bem-estar da equipe.',
  },
  {
    titulo: 'Ações preventivas e comunitárias',
    texto: 'Campanhas de saúde, educação ambiental, materiais educativos e mutirões nos bairros.',
  },
];

/** Princípios que orientam a atuação (PNAS / NOB-SUAS). */
export const PRINCIPIOS = ['Universalidade', 'Integralidade', 'Intersetorialidade', 'Participação social', 'Controle social'];
