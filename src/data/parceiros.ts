/**
 * Empresas e entidades que apoiam as ações do Instituto.
 * Só aparecem no site as marcadas com `autorizado: true` — marque depois que cada parceiro autorizar
 * o uso do nome. Exemplo: { nome: 'Mercado Exemplo', autorizado: true }
 */
export interface Parceiro {
  nome: string;
  autorizado: boolean;
}

export const PARCEIROS: Parceiro[] = [];
