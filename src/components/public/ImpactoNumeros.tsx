import React from 'react';
import { SiteContent } from '../../types';

interface ImpactoNumerosProps {
  content: SiteContent;
}

// Números de impacto editados pelo painel. Só aparecem os maiores que zero; sem nenhum, a faixa some
// (assim o site nunca mostra número inventado).
export const ImpactoNumeros: React.FC<ImpactoNumerosProps> = ({ content }) => {
  const stats = [
    { value: content.impacto_criancas, label: 'pessoas atendidas' },
    { value: content.impacto_voluntarios, label: 'voluntários ativos' },
    { value: content.impacto_eventos, label: 'ações comunitárias' },
  ].filter((s) => Number(s.value) > 0);

  if (stats.length === 0) return null;

  return (
    <section className="-skew-y-2 bg-lima py-2" aria-label="Nossos números">
      <dl className="container-site flex skew-y-2 flex-wrap justify-around gap-6 py-8 lg:py-10">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse items-center gap-1 text-center">
            <dt className="text-sm font-bold uppercase tracking-wide text-brand-dark/80">{stat.label}</dt>
            <dd className="text-5xl font-black leading-none text-brand-dark lg:text-6xl">{stat.value}+</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
