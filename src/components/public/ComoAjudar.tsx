import React, { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { SiteContent } from '../../types';
import { generatePixPayload, generateQrCodeDataUrl } from '../../utils/pix';
import { DoacaoModal } from './DoacaoModal';
import { INSTITUTO } from '../../data/instituto';

interface ComoAjudarProps {
  content: SiteContent;
  onOpenVoluntarioModal: () => void;
  onOpenParceiroModal: () => void;
  onOpenDoacaoModal?: () => void;
}

export const ComoAjudar: React.FC<ComoAjudarProps> = ({ content, onOpenVoluntarioModal, onOpenParceiroModal }) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isDoacaoModalOpen, setIsDoacaoModalOpen] = useState(false);

  useEffect(() => {
    if (!content.contato_pix_chave) return;
    const payload = generatePixPayload({
      key: content.contato_pix_chave,
      name: INSTITUTO.nomePix,
      city: 'TRINDADE',
    });
    generateQrCodeDataUrl(payload)
      .then(setQrCodeUrl)
      .catch(() => generateQrCodeDataUrl(content.contato_pix_chave).then(setQrCodeUrl));
  }, [content.contato_pix_chave]);

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(content.contato_pix_chave);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    } catch {
      // Navegador sem acesso à área de transferência: a chave continua visível para copiar à mão.
    }
  };

const PEOPLE = 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M17 11a3 3 0 1 0 0-6M22 21v-1a5 5 0 0 0-4-4.9';
const BRIEFCASE = 'M3 8h18v12H3zM8 8V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M3 13h18';

const Icone: React.FC<{ d: string }> = ({ d }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

  return (
    <section id="como-ajudar" className="bg-white">
      {/* Faixa do PIX em verde-limão, cortada na diagonal */}
      <div id="doar" className="relative overflow-hidden bg-lima">
        <div aria-hidden="true" className="absolute inset-y-0 -right-20 hidden w-[42%] -skew-x-[14deg] bg-brand-dark lg:block" />
        <div className="container-site relative grid grid-cols-1 items-center gap-8 py-12 sm:py-16 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-6">
            <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-dark">Como ajudar</span>
            <h2 className="text-[34px] font-black uppercase leading-[1] tracking-[-0.02em] text-brand-dark sm:text-5xl">
              Doe pelo PIX
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-brand-dark/85">
              Sua doação vira cesta básica, material esportivo, reforma de casa e oportunidade. Qualquer valor ajuda.
            </p>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold uppercase text-brand-dark/80">Chave PIX ({content.contato_pix_tipo || 'CNPJ'})</span>
              <span className="select-all text-3xl font-black tracking-wide text-brand-dark sm:text-4xl">{content.contato_pix_chave}</span>
              <span className="text-sm font-semibold text-brand-dark/80">{INSTITUTO.nome}</span>
            </div>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button onClick={handleCopyPix} className="btn-dark min-h-[52px] bg-brand-dark px-6 uppercase tracking-wide" aria-live="polite">
                {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedKey ? 'Chave copiada' : 'Copiar chave PIX'}
              </button>
              <button onClick={() => setIsDoacaoModalOpen(true)} className="btn-secondary min-h-[52px] border-brand-dark text-brand-dark hover:bg-brand-dark">
                Avisar sobre minha doação
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 lg:col-span-5 lg:col-start-8">
            <div className="rounded-md bg-white p-4 shadow-xl">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt={`QR Code PIX do ${INSTITUTO.nome}`} className="h-52 w-52" />
              ) : (
                <div className="flex h-52 w-52 items-center justify-center text-sm text-muted">Gerando…</div>
              )}
            </div>
            <span className="text-sm font-semibold text-brand-dark lg:text-white">Escaneie no app do seu banco</span>
          </div>
        </div>
      </div>

      {/* Outras formas de ajudar */}
      <div className="container-site grid grid-cols-1 gap-5 py-12 sm:grid-cols-2 sm:py-16">
        <div className="flex flex-col gap-4 border-l-8 border-ceu bg-paper p-6 sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center bg-ceu text-white"><Icone d={PEOPLE} /></span>
          <h3 className="text-xl font-black uppercase text-brand-dark">Seja voluntário</h3>
          <p className="flex-1 text-[15px] leading-relaxed text-body">
            Treinadores, educadores, assistentes sociais, pedreiros, motoristas e quem puder ajudar na montagem e entrega
            das cestas. Você escolhe a área e a disponibilidade.
          </p>
          <button onClick={onOpenVoluntarioModal} className="btn-primary min-h-[50px] self-start">
            Quero ser voluntário
          </button>
        </div>

        <div className="flex flex-col gap-4 border-l-8 border-lima bg-paper p-6 sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center bg-lima text-brand-dark"><Icone d={BRIEFCASE} /></span>
          <h3 className="text-xl font-black uppercase text-brand-dark">Seja parceiro</h3>
          <p className="flex-1 text-[15px] leading-relaxed text-body">
            Empresas, órgãos públicos e entidades podem apoiar com alimentos, material de construção, material esportivo,
            serviços ou patrocínio contínuo.
          </p>
          <button onClick={onOpenParceiroModal} className="btn-primary min-h-[50px] self-start">
            Quero ser parceiro
          </button>
        </div>
      </div>

      <DoacaoModal isOpen={isDoacaoModalOpen} onClose={() => setIsDoacaoModalOpen(false)} content={content} />
    </section>
  );
};
