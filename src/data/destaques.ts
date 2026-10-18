/**
 * Destaques da página inicial ("Acontece no instituto").
 * O primeiro item aparece grande; os dois seguintes, em cards menores.
 * `data` é opcional: só aparece no site quando estiver preenchida (confirme as datas antes de publicar).
 * `cor`: 'sol' (verde-limão claro), 'marca' (azul) ou 'destaque' (verde-limão forte, para o item principal).
 */
export interface Destaque {
  id: string;
  categoria: string;
  titulo: string;
  foto_url: string;
  alt: string;
  posicao?: string;
  data?: string;
  cor: 'sol' | 'marca' | 'destaque';
  link?: string;
}

// Vazio até chegarem as primeiras notícias com foto (a seção some do site enquanto estiver vazia).
// Exemplo:
// { id: 'entrega-cestas', categoria: 'Cestas', titulo: 'Entrega de cestas no Setor Solange',
//   foto_url: '/fotos/entrega-cestas.jpg', alt: 'Voluntários entregando cestas', cor: 'destaque' },
export const DESTAQUES: Destaque[] = [];
