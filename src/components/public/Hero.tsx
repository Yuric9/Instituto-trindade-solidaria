import React from 'react';
import { SiteContent } from '../../types';
import { Simbolo } from '../brand/Logo';
import { BAIRROS_ATENDIDOS, INSTITUTO } from '../../data/instituto';

interface HeroProps {
  content: SiteContent;
  onOpenCadastro: () => void;
}

// Topo no estilo do banner "Centro de Iniciação Esportiva": azul petróleo com textura de pontos,
// título grande em caixa alta e, à direita, um painel cortado na diagonal com as faixas da marca.
export const Hero: React.FC<HeroProps> = ({ content, onOpenCadastro }) => {
  const anos = new Date().getFullYear() - INSTITUTO.anoFundacao;
  const fatos = [
    { valor: `Desde ${INSTITUTO.anoFundacao}`, rotulo: anos > 0 ? `${anos} ${anos === 1 ? 'ano' : 'anos'} de atuação` : 'em atuação' },
    { valor: `${content.impacto_projetos || 4} áreas`, rotulo: 'de atuação social' },
    { valor: `${BAIRROS_ATENDIDOS.length - 1}+ bairros`, rotulo: 'atendidos em Trindade' },
  ];

  return (
    <section id="inicio" aria-label="Apresentação do instituto" className="bg-pontos corte-base relative overflow-hidden text-white">
      {/* Painel diagonal (computador) */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[44%] lg:block">
        <div className="absolute inset-0 bg-white [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]" />
        <div className="absolute inset-y-0 left-[3%] w-10 -skew-x-[12deg] bg-lima" />
        <div className="absolute inset-y-0 left-[9%] w-10 -skew-x-[12deg] bg-ceu" />
        <div className="absolute inset-0 flex items-center justify-center pl-[18%]">
          <Simbolo decorativo className="h-[300px] xl:h-[340px]" />
        </div>
      </div>

      <div className="container-site relative flex min-h-[560px] flex-col justify-center gap-10 pb-[calc(4vw+56px)] pt-14 lg:min-h-[640px] lg:pt-20">
        <div className="flex max-w-[640px] flex-col gap-5 lg:max-w-[52%]">
          <span className="self-start -skew-x-[12deg] bg-lima px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-brand-dark sm:text-[13px]">
            <span className="inline-block skew-x-[12deg]">{content.hero_tagline}</span>
          </span>
          <h1 className="text-[40px] font-black uppercase leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-[68px]">
            {content.hero_title}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-brand-light sm:text-lg">{content.hero_subtitle}</p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button onClick={onOpenCadastro} className="btn-lima min-h-[52px] px-7 text-base">
              Fazer inscrição
            </button>
            <a href="#como-ajudar" className="btn-outline-light min-h-[52px] px-7 text-base uppercase tracking-wide">
              Quero ajudar
            </a>
          </div>
        </div>

        <dl className="grid max-w-[640px] grid-cols-3 gap-3 border-t border-white/15 pt-6 lg:max-w-[52%]">
          {fatos.map((f) => (
            <div key={f.rotulo} className="flex flex-col-reverse gap-1">
              <dt className="text-xs leading-snug text-brand-light sm:text-sm">{f.rotulo}</dt>
              <dd className="text-lg font-black uppercase leading-none text-lima sm:text-2xl">{f.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
