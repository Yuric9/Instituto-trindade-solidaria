import React, { useState } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { SiteContent } from '../../types';
import { Logo } from '../brand/Logo';
import { INSTITUTO } from '../../data/instituto';
import { usePwa } from '../../pwa/usePwa';

interface NavbarProps {
  content: SiteContent;
  onOpenCadastro: (projetoPredefinido?: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

const links = [
  { label: 'Quem somos', href: '#sobre' },
  { label: 'Atuação', href: '#projetos' },
  { label: 'Inscrição', href: '#cadastro' },
  { label: 'Transparência', href: '#transparencia' },
  { label: 'Contato', href: '#contato' },
];

const onlyDigits = (v: string) => (v || '').replace(/\D/g, '');

export const Navbar: React.FC<NavbarProps> = ({ content, onOpenCadastro, onOpenAdmin, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePwa();
  const canInstall = !isInstalled && (isInstallable || isIOS);
  const close = () => setMobileMenuOpen(false);
  const wa = onlyDigits(content.contato_whatsapp);

  return (
    <>
      {/* Faixa superior (só no computador): contatos sobre o azul petróleo, com o corte verde-limão */}
      <aside aria-label="Contatos do instituto" className="relative hidden overflow-hidden bg-brand-dark text-[13px] text-brand-light lg:block">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-56 -skew-x-[25deg] translate-x-16 bg-lima" />
        <div className="container-site relative flex h-10 items-center justify-between">
          <span>
            CNPJ {content.contato_cnpj} · Setor Solange, {content.contato_cidade} — GO
          </span>
          <div className="flex gap-6 pr-36">
            {wa && (
              <a href={`https://wa.me/55${wa}`} target="_blank" rel="noreferrer" className="font-semibold text-white hover:opacity-80">
                WhatsApp {content.contato_whatsapp}
              </a>
            )}
            <a href={content.instagram_url} target="_blank" rel="noreferrer" className="font-semibold text-white hover:opacity-80">
              Instagram {INSTITUTO.instagram}
            </a>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b-4 border-lima bg-white/95 backdrop-blur">
        <div className="container-site flex h-[72px] items-center justify-between gap-6 lg:h-[88px]">
          <a href="#inicio" className="rounded-md" aria-label={`${INSTITUTO.nome} — início`}>
            <Logo className="h-12 lg:h-[62px]" />
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Menu principal">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-bold uppercase tracking-wide text-brand-dark hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAdminLoggedIn && (
              <button onClick={onOpenAdmin} className="text-[15px] font-medium text-muted hover:text-ink">
                Painel
              </button>
            )}
            <a href="#como-ajudar" className="btn-lima px-6">
              Doar
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a href="#como-ajudar" onClick={close} className="btn-lima px-4 text-sm">
              Doar
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-dark text-white"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-line bg-white lg:hidden">
            <nav className="container-site flex flex-col py-3" aria-label="Menu principal">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="border-b border-line py-3 text-base font-bold uppercase tracking-wide text-brand-dark last:border-b-0"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="container-site flex flex-col gap-3 pb-5">
              <button
                onClick={() => {
                  close();
                  onOpenCadastro();
                }}
                className="btn-primary w-full"
              >
                Fazer inscrição
              </button>
              {canInstall && (
                <button
                  onClick={() => {
                    close();
                    promptInstall();
                  }}
                  className="inline-flex min-h-11 items-center justify-center gap-2 text-[15px] font-medium text-muted"
                >
                  <Download className="h-4 w-4" />
                  Instalar o app no celular
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
