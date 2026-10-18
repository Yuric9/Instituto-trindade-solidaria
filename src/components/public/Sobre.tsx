import React from 'react';
import { MapPin } from 'lucide-react';
import { SiteContent } from '../../types';
import { BAIRROS_ATENDIDOS, FINALIDADES, INSTITUTO, PRINCIPIOS } from '../../data/instituto';

interface SobreProps {
  content: SiteContent;
}

export const Sobre: React.FC<SobreProps> = ({ content }) => {
  const pilares = [
    { titulo: 'Missão', texto: content.sobre_missao },
    { titulo: 'Visão', texto: content.sobre_visao },
    { titulo: 'Valores', texto: content.sobre_valores },
  ];

  return (
    <section id="sobre" className="bg-white">
      <div className="container-site flex flex-col gap-14 py-14 sm:py-24">
        {/* História + linha do tempo */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <span className="kicker">Quem somos</span>
            <h2 className="section-title">Solidariedade que fortalece famílias</h2>
            <ol className="mt-4 flex flex-col border-l-4 border-lima pl-6">
              <li className="relative pb-6">
                <span aria-hidden="true" className="absolute -left-[34px] top-1 h-4 w-4 rotate-45 bg-brand-dark" />
                <span className="text-sm font-black uppercase tracking-wide text-brand">{INSTITUTO.fundacao}</span>
                <p className="text-[15px] text-body">Fundação do Instituto em Trindade-GO.</p>
              </li>
              <li className="relative pb-6">
                <span aria-hidden="true" className="absolute -left-[34px] top-1 h-4 w-4 rotate-45 bg-ceu" />
                <span className="text-sm font-black uppercase tracking-wide text-brand">Rede SUAS</span>
                <p className="text-[15px] text-body">Integra a rede socioassistencial privada do município, com foco na proteção social básica.</p>
              </li>
              <li className="relative">
                <span aria-hidden="true" className="absolute -left-[34px] top-1 h-4 w-4 rotate-45 bg-lima" />
                <span className="text-sm font-black uppercase tracking-wide text-brand">Hoje</span>
                <p className="text-[15px] text-body">Esporte, benefícios eventuais, moradia digna e cidadania nos bairros mais vulneráveis.</p>
              </li>
            </ol>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-7">
            <p className="text-lg leading-relaxed text-body">{content.sobre_historia}</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {pilares.map((p, i) => (
                <div key={p.titulo} className={`flex flex-col gap-2 border-t-4 bg-paper p-5 ${i === 1 ? 'border-ceu' : 'border-lima'}`}>
                  <h3 className="text-base font-black uppercase tracking-wide text-brand-dark">{p.titulo}</h3>
                  <p className="text-[15px] leading-relaxed text-body">{p.texto}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-black uppercase tracking-wide text-brand-dark">Bairros atendidos</span>
              <ul className="flex flex-wrap gap-2">
                {BAIRROS_ATENDIDOS.map((b) => (
                  <li key={b} className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-sm font-semibold text-brand-dark">
                    <MapPin className="h-3.5 w-3.5 text-lima-dark" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Finalidades estatutárias */}
        <div className="bg-pontos relative overflow-hidden rounded-md p-6 text-white sm:p-10">
          <div aria-hidden="true" className="faixas-marca absolute -right-40 inset-y-0 w-[520px] opacity-80" />
          <div className="relative flex flex-col gap-8">
            <div className="flex max-w-2xl flex-col gap-2">
              <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-lima">Finalidades estatutárias</span>
              <h3 className="text-2xl font-black uppercase leading-tight sm:text-3xl">O que nos move</h3>
            </div>
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FINALIDADES.map((f, i) => (
                <li key={f.titulo} className="flex flex-col gap-2">
                  <span className="text-4xl font-black leading-none text-lima">{String(i + 1).padStart(2, '0')}</span>
                  <h4 className="text-base font-extrabold uppercase leading-snug">{f.titulo}</h4>
                  <p className="text-[15px] leading-relaxed text-brand-light">{f.texto}</p>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap items-center gap-2 border-t border-white/15 pt-6">
              <span className="mr-1 text-xs font-bold uppercase tracking-wide text-brand-muted">Princípios:</span>
              {PRINCIPIOS.map((p) => (
                <span key={p} className="rounded-sm bg-white/10 px-2.5 py-1 text-[13px] font-semibold">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
