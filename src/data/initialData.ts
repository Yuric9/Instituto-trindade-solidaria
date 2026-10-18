import { Beneficiary, ProjectCard, GalleryPhoto, SiteContent, AdminUser, Volunteer } from '../types';

// Conteúdo inicial do site. Depois de publicado, os textos são editados pelo painel (aba Conteúdo)
// e ficam no banco; estes valores só são usados na primeira vez que o banco é criado.
export const INITIAL_SITE_CONTENT: SiteContent = {
  hero_tagline: 'Organização da Sociedade Civil · Trindade - GO',
  hero_title: 'Amor e compaixão ao próximo.',
  hero_subtitle:
    'Esporte, assistência social, moradia digna e cidadania para as famílias dos setores Solange Park, Nova Canaã, Residencial Santa Fé, Jardins e outras áreas de Trindade.',
  sobre_historia:
    'O Instituto Trindade Solidária é uma Organização da Sociedade Civil (OSC), sem fins lucrativos, fundada em 20 de outubro de 2021 em Trindade-GO. Atuamos pelos princípios e diretrizes do Sistema Único de Assistência Social (SUAS), integrando a rede socioassistencial privada do município, com foco na proteção social básica: prevenir situações de risco, promover o acesso a direitos e melhorar as condições de vida de famílias em situação de pobreza e extrema pobreza.',
  sobre_missao:
    'Contribuir para a prevenção de riscos e do agravamento de vulnerabilidades sociais, promovendo o acesso a direitos, a autonomia e a melhoria das condições de vida das famílias de Trindade.',
  sobre_visao:
    'Ser parceira estratégica do poder público e da comunidade na construção de uma sociedade mais justa, igualitária e solidária, fortalecendo vínculos familiares e comunitários.',
  sobre_valores:
    'Universalidade, integralidade, intersetorialidade, participação e controle social, com justiça social, igualdade e solidariedade.',
  // Números de impacto: 0 = não aparece no site. Preencha pelo painel quando tiver os valores reais.
  impacto_criancas: 0,
  impacto_voluntarios: 0,
  impacto_eventos: 0,
  impacto_projetos: 4,
  contato_cidade: 'Trindade',
  contato_estado: 'Goiás',
  contato_endereco: 'Rua Ana Alves, A.P.M. 02, Setor Solange (Praça do Setor Solange), Trindade - GO, CEP 75.392-269',
  contato_telefone: '(62) 99880-8600',
  contato_whatsapp: '(62) 99880-8600',
  contato_whatsapp_mensagem:
    'Olá! Vim pelo site do Instituto Trindade Solidária e gostaria de mais informações sobre as ações e como ajudar.',
  contato_email: '',
  contato_cnpj: '45.698.518/0001-89',
  contato_pix_chave: '45.698.518/0001-89',
  contato_pix_tipo: 'CNPJ do Instituto',
  instagram_url: 'https://www.instagram.com/institutotrindadesolidaria/',
};

// As 4 áreas de atuação. Até chegarem fotos reais, cada uma usa uma arte da marca (public/fotos/*.svg);
// pelo painel (aba Projetos) dá para trocar por uma foto.
export const INITIAL_PROJECTS: ProjectCard[] = [
  {
    id: 'proj-esporte',
    titulo: 'Centro de Iniciação Esportiva',
    descricao:
      'Futebol para crianças e adolescentes dos setores Solange e Nova Canaã: esporte, disciplina e convivência como estratégia de inclusão social.',
    foto_url: '/fotos/area-esporte.svg',
    ativo: true,
    ordem: 1,
    detalhes:
      'Categorias Sub-09, Sub-11, Sub-13, Sub-15 e Sub-17, além do Feminino Sub-17 e Feminino Livre. A inscrição de menores de idade precisa dos dados e da autorização do responsável. Atenção: é proibido treinar com camiseta de time de futebol.',
    idade_publico: 'Sub-09 ao Sub-17 e feminino',
    horario: '',
    coordenador: '',
  },
  {
    id: 'proj-cestas',
    titulo: 'Cestas Básicas e Primeira Necessidade',
    descricao:
      'Distribuição de cestas básicas, roupas, calçados, roupas de cama, móveis usados e outros itens de primeira necessidade, de forma complementar à proteção social pública.',
    foto_url: '/fotos/area-cestas.svg',
    ativo: true,
    ordem: 2,
    detalhes:
      'Os benefícios eventuais seguem os critérios de elegibilidade da política de assistência social, em articulação com a rede socioassistencial de Trindade (CRAS, CREAS e demais serviços).',
    idade_publico: 'Famílias em vulnerabilidade',
    horario: '',
    coordenador: '',
  },
  {
    id: 'proj-moradia',
    titulo: 'Moradia Digna',
    descricao:
      'Apoio à reforma, construção e adequação de moradias de famílias em vulnerabilidade, com prioridade para pessoas com deficiência ou mobilidade reduzida.',
    foto_url: '/fotos/area-moradia.svg',
    ativo: true,
    ordem: 3,
    detalhes:
      'Obras de reforma, acessibilidade (rampas, banheiros adaptados), cobertura, vedação, pisos, acesso à água e saneamento, viabilizadas por parcerias com empresas, órgãos públicos, entidades e a comunidade.',
    idade_publico: 'Famílias em moradia precária',
    horario: '',
    coordenador: '',
  },
  {
    id: 'proj-cidadania',
    titulo: 'Educação e Cidadania',
    descricao:
      'Reforço escolar, oficinas sobre direitos, diversidade e cultura de paz, capacitação profissional e iniciativas de geração de renda para crianças, jovens e famílias.',
    foto_url: '/fotos/area-cidadania.svg',
    ativo: true,
    ordem: 4,
    detalhes:
      'Ações de educação não formal, cultura e cidadania que fortalecem a autonomia e o protagonismo das famílias, além de campanhas de saúde preventiva, educação ambiental e mutirões comunitários.',
    idade_publico: 'Crianças, jovens e famílias',
    horario: '',
    coordenador: '',
  },
];

// Galeria começa vazia (a seção some do site até a primeira foto ser enviada pelo painel).
export const INITIAL_GALLERY: GalleryPhoto[] = [];

// Dados FICTÍCIOS de demonstração (só entram no banco com SEED_DEMO_DATA = "true", ex.: prévias e testes).
// CPFs de exemplo matematicamente válidos.
export const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'ben-01',
    nome: 'Ana Clara Peixoto',
    cpf: '012.345.678-90',
    nascimento: '2014-05-14',
    telefone: '(62) 99124-5533',
    email: 'familia.peixoto@gmail.com',
    endereco: 'Rua 12, Qd. 04, Lt. 15 - Setor Solange, Trindade - GO',
    projeto: 'Centro de Iniciação Esportiva',
    status: 'Aprovado',
    observacoes: 'Categoria Feminino Sub-17. Autorização do responsável assinada.',
    criado_em: '2026-08-10',
    atualizado_em: '2026-08-15',
  },
  {
    id: 'ben-02',
    nome: 'Kauã Henrique Alves',
    cpf: '123.456.789-09',
    nascimento: '2015-09-22',
    telefone: '(62) 98844-1290',
    email: 'k.alves@outlook.com',
    endereco: 'Av. Goiânia, Qd. 22 - Nova Canaã, Trindade - GO',
    projeto: 'Centro de Iniciação Esportiva',
    status: 'Atendido/Entregue',
    observacoes: 'Categoria Sub-11. Frequência exemplar nos treinos.',
    criado_em: '2026-07-02',
    atualizado_em: '2026-08-20',
  },
  {
    id: 'ben-03',
    nome: 'Jéssica Fernanda de Morais',
    cpf: '234.567.890-12',
    nascimento: '1990-11-03',
    telefone: '(62) 99233-7711',
    email: 'jessica.morais@gmail.com',
    endereco: 'Rua das Flores, Qd. 09 - Residencial Santa Fé, Trindade - GO',
    projeto: 'Cestas Básicas e Primeira Necessidade',
    status: 'Em análise',
    observacoes: 'Família de 5 pessoas. Encaminhada pelo CRAS, aguardando visita.',
    criado_em: '2026-09-12',
  },
  {
    id: 'ben-04',
    nome: 'Lucas Gabriel Silveira',
    cpf: '345.678.901-23',
    nascimento: '1975-02-18',
    telefone: '(62) 99455-8822',
    email: 'silveira.trindade@gmail.com',
    endereco: 'Rua 7, Setor Jardins, Trindade - GO',
    projeto: 'Moradia Digna',
    status: 'Pendente',
    observacoes: 'Pedido de rampa de acesso e adaptação do banheiro (cadeirante).',
    criado_em: '2026-09-21',
  },
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    email: 'coordenacao@institutotrindadesolidaria.org.br',
    nome: 'Coordenação Trindade Solidária',
    criado_em: '2026-01-01',
  },
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol-01',
    nome: 'Marcos Aurélio Silveira (Prof. Marcão)',
    telefone: '(62) 98455-7812',
    email: 'marcao.esporte@gmail.com',
    area: 'Treinos Esportivos',
    disponibilidade: 'Dias de Semana (Tarde)',
    ativo: true,
    data_inicio: '2023-08-15',
    habilidades: 'Educação física, futebol de base, arbitragem',
    observacoes: 'Coordena os treinos das categorias Sub-09 a Sub-13.',
  },
  {
    id: 'vol-02',
    nome: 'Tiago Fagundes de Oliveira',
    telefone: '(62) 99422-5501',
    email: 'tiago.futebol@gmail.com',
    area: 'Treinos Esportivos',
    disponibilidade: 'Finais de Semana (Geral)',
    ativo: true,
    data_inicio: '2024-02-20',
    habilidades: 'Preparação física, goleiros',
    observacoes: 'Auxilia nos treinos e organiza coletes e bolas.',
  },
  {
    id: 'vol-03',
    nome: 'Dona Cleusa Aparecida Ferreira',
    telefone: '(62) 99233-8877',
    email: 'cleusa.ferreira@gmail.com',
    area: 'Arrecadação e Entrega de Cestas',
    disponibilidade: 'Dias de Semana (Manhã)',
    ativo: true,
    data_inicio: '2023-01-20',
    habilidades: 'Montagem de cestas, controle de estoque',
    observacoes: 'Organiza a separação e a entrega das cestas básicas.',
  },
  {
    id: 'vol-04',
    nome: 'Carlos Eduardo Nogueira (Kadu)',
    telefone: '(62) 99288-9900',
    email: 'kadu.obras@gmail.com',
    area: 'Reformas e Construção',
    disponibilidade: 'Finais de Semana (Geral)',
    ativo: true,
    data_inicio: '2023-05-15',
    habilidades: 'Pedreiro, instalações hidráulicas, acessibilidade',
    observacoes: 'Coordena os mutirões de reforma.',
  },
  {
    id: 'vol-05',
    nome: 'Luciana Maria da Silva',
    telefone: '(62) 98877-6622',
    email: 'prof.luciana.pedagoga@gmail.com',
    area: 'Apoio Pedagógico & Escolar',
    disponibilidade: 'Dias de Semana (Tarde)',
    ativo: true,
    data_inicio: '2024-03-12',
    habilidades: 'Pedagogia, reforço escolar, alfabetização',
    observacoes: 'Acompanha boletim e frequência escolar dos atletas.',
  },
  {
    id: 'vol-06',
    nome: 'Renata Silveira de Castro',
    telefone: '(62) 99199-3388',
    email: 'renata.castro@gmail.com',
    area: 'Oficinas e Cidadania',
    disponibilidade: 'Sábados (Manhã)',
    ativo: true,
    data_inicio: '2023-09-01',
    habilidades: 'Assistência social, rodas de conversa, direitos da criança',
    observacoes: 'Conduz as oficinas de cidadania com as famílias.',
  },
];
