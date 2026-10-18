import React from 'react';
import { OBJETIVOS } from '../../data/instituto';

// Objetivos específicos do Instituto (resumo do plano de ação), em grade numerada.
export const Objetivos: React.FC = () => (
  <section id="objetivos" className="bg-paper">
    <div className="container-site flex flex-col gap-10 py-14 sm:py-24">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex max-w-2xl flex-col gap-3">
          <span className="kicker">Objetivos específicos</span>
          <h2 className="section-title">Nossas metas para a comunidade</h2>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-body">
          Alinhados à Tipificação Nacional dos Serviços Socioassistenciais (PAIF e Serviço de Convivência e Fortalecimento de Vínculos).
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {OBJETIVOS.map((o, i) => (
          <li key={o.titulo} className="flex flex-col gap-2 bg-white p-6">
            <span className={`text-sm font-black ${i % 2 ? 'text-ceu' : 'text-lima-dark'}`}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className="text-base font-extrabold uppercase leading-snug text-brand-dark">{o.titulo}</h3>
            <p className="text-[15px] leading-relaxed text-body">{o.texto}</p>
          </li>
        ))}
        <li className="flex flex-col justify-center gap-3 bg-brand-dark p-6 text-white">
          <span className="text-lg font-black uppercase leading-tight">Quer construir isso com a gente?</span>
          <a href="#como-ajudar" className="link-arrow text-lima hover:text-white">Veja como ajudar →</a>
        </li>
      </ol>
    </div>
  </section>
);
