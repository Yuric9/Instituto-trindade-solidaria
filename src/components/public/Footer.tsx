import React from 'react';
import { SiteContent } from '../../types';
import { Logo } from '../brand/Logo';
import { INSTITUTO } from '../../data/instituto';

interface FooterProps {
  content: SiteContent;
  onOpenAdmin: () => void;
  onOpenCadastro: () => void;
  onOpenPrivacidade?: () => void;
}

const onlyDigits = (v: string) => (v || '').replace(/\D/g, '');

const Icon: React.FC<{ d: string }> = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
    <path d={d} />
  </svg>
);

const PHONE = 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2';
const CHAT = 'M21 12a9 9 0 0 1-13.5 7.8L3 21l1.2-4.5A9 9 0 1 1 21 12z';
const MAIL = 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm-1 2 9 6 9-6';
const PIN = 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z';
const INSTA = 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01';

export const Footer: React.FC<FooterProps> = ({ content, onOpenAdmin, onOpenCadastro, onOpenPrivacidade }) => {
  const tel = onlyDigits(content.contato_telefone);
  const wa = onlyDigits(content.contato_whatsapp);
  const mesmoNumero = tel && tel === wa;

  const linkCls = 'text-left text-brand-light hover:text-white py-2.5 lg:py-0';
  const tituloCls = 'text-[13px] font-extrabold uppercase tracking-[0.12em] text-lima';

  return (
    <footer id="contato" className="bg-footer relative overflow-hidden text-[15px] text-brand-light">
      {/* Faixas da marca no canto, como na ficha de inscrição */}
      <div aria-hidden="true" className="absolute -top-px left-0 flex h-2 w-full">
        <span className="w-1/2 bg-lima" />
        <span className="w-1/2 bg-ceu" />
      </div>

      <div className="container-site grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 sm:py-16 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-4">
          <Logo fundo="escuro" className="h-20 self-start" />
          <p className="max-w-sm leading-relaxed">{INSTITUTO.natureza}, fundada em {INSTITUTO.fundacao}.</p>
        </div>

        <div className="hidden flex-col gap-2.5 lg:col-span-2 lg:col-start-6 lg:flex">
          <span className={tituloCls}>Atuação</span>
          <a href="#projetos" className={linkCls}>Iniciação esportiva</a>
          <a href="#projetos" className={linkCls}>Cestas básicas</a>
          <a href="#projetos" className={linkCls}>Moradia digna</a>
          <a href="#projetos" className={linkCls}>Educação e cidadania</a>
        </div>

        <div className="flex flex-col gap-2.5 lg:col-span-2 lg:col-start-8">
          <span className={tituloCls}>Institucional</span>
          <a href="#sobre" className={linkCls}>Quem somos</a>
          <a href="#transparencia" className={linkCls}>Transparência</a>
          <a href="#como-ajudar" className={linkCls}>Como ajudar</a>
          <button onClick={onOpenCadastro} className={linkCls}>
            Fazer inscrição
          </button>
          {onOpenPrivacidade && (
            <button onClick={onOpenPrivacidade} className={linkCls}>
              Política de privacidade
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2.5 lg:col-span-3 lg:col-start-10">
          <span className={tituloCls}>Contato</span>
          {wa && (
            <a href={`https://wa.me/55${wa}`} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 py-2.5 font-bold text-white hover:opacity-80 lg:py-0">
              <Icon d={CHAT} />
              {mesmoNumero ? 'Telefone e WhatsApp' : 'WhatsApp'} {content.contato_whatsapp}
            </a>
          )}
          {tel && !mesmoNumero && (
            <a href={`tel:+55${tel}`} className={`flex items-center gap-2.5 ${linkCls}`}>
              <Icon d={PHONE} />
              {content.contato_telefone}
            </a>
          )}
          {content.contato_email && (
            <a href={`mailto:${content.contato_email}`} className={`flex items-center gap-2.5 break-all ${linkCls}`}>
              <Icon d={MAIL} />
              {content.contato_email}
            </a>
          )}
          <a href={content.instagram_url} target="_blank" rel="noreferrer" className={`flex items-center gap-2.5 ${linkCls}`}>
            <Icon d={INSTA} />
            {INSTITUTO.instagram}
          </a>
          <p className="flex items-start gap-2.5 py-2.5 leading-relaxed lg:py-0">
            <Icon d={PIN} />
            <span>{content.contato_endereco}</span>
          </p>
        </div>
      </div>

      <div className="container-site">
        <div className="flex flex-col gap-3 border-t border-brand-line pt-6 pb-24 text-[13px] text-brand-muted sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <span>
            © {new Date().getFullYear()} {INSTITUTO.nome} · CNPJ {content.contato_cnpj}
          </span>
          <div className="flex items-center gap-5">
            <span>Desenvolvido por YC Soluções e Tecnologias</span>
            <button onClick={onOpenAdmin} className="min-h-11 hover:text-white">
              Área da equipe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
