import React from 'react';

// Logo oficial do Instituto Trindade Solidária. Os SVGs em public/marca/ foram extraídos
// do arquivo original do logo (Illustrator), então as formas e cores são as mesmas.
//   logo-claro.svg  → para fundos claros (texto azul petróleo)
//   logo-escuro.svg → para fundos escuros (texto branco, como no original)
//   simbolo.svg     → só o coração com as mãos, para espaços pequenos

interface LogoProps {
  /** "claro" = logo para fundo claro; "escuro" = logo para fundo escuro. */
  fundo?: 'claro' | 'escuro';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ fundo = 'claro', className = 'h-12' }) => (
  <img
    src={fundo === 'escuro' ? '/marca/logo-escuro.svg' : '/marca/logo-claro.svg'}
    alt="Instituto Trindade Solidária — Amor e compaixão ao próximo"
    width={340}
    height={136}
    className={`w-auto ${className}`}
  />
);

export const Simbolo: React.FC<{ className?: string; decorativo?: boolean }> = ({
  className = 'h-10',
  decorativo = false,
}) => (
  <img
    src="/marca/simbolo.svg"
    alt={decorativo ? '' : 'Símbolo do Instituto Trindade Solidária'}
    aria-hidden={decorativo || undefined}
    width={148}
    height={113}
    className={`w-auto ${className}`}
  />
);

export default Logo;
