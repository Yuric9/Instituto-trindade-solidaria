// Parte do formulário que só aparece na inscrição do Centro de Iniciação Esportiva:
// é a ficha de inscrição em papel do Instituto, em versão digital.
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  AVISO_CAMISETA,
  CATEGORIAS,
  RESPONSAVEL_VAZIO,
  SEXOS,
  TERMOS,
  ehMenorDeIdade,
  type FichaEsportiva,
  type Responsavel,
} from '../../utils/ficha';
import { formatCPF, formatPhone } from '../../utils/validation';

interface FichaAtletaProps {
  ficha: FichaEsportiva;
  onChange: (ficha: FichaEsportiva) => void;
  /** Data de nascimento do atleta (AAAA-MM-DD), para saber se precisa do responsável. */
  nascimento: string;
}

const campoCls =
  'w-full rounded-md border border-line-strong bg-white px-4 py-2.5 text-sm text-ink shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand';
const rotuloCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-brand-dark';

export const FichaAtleta: React.FC<FichaAtletaProps> = ({ ficha, onChange, nascimento }) => {
  const menor = ehMenorDeIdade(nascimento);
  const responsavel = ficha.responsavel ?? RESPONSAVEL_VAZIO;
  const mudar = (parte: Partial<FichaEsportiva>) => onChange({ ...ficha, ...parte });
  const mudarResponsavel = (parte: Partial<Responsavel>) => mudar({ responsavel: { ...responsavel, ...parte } });

  return (
    <fieldset className="flex flex-col gap-5 border-l-4 border-lima bg-white p-5 sm:p-6">
      <legend className="sr-only">Ficha de inscrição do atleta</legend>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand">Ficha de inscrição</span>
        <h3 className="text-lg font-black uppercase text-brand-dark">Dados do(a) atleta</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ficha-rg" className={rotuloCls}>RG do(a) atleta (opcional)</label>
          <input id="ficha-rg" type="text" maxLength={20} value={ficha.rg} onChange={(e) => mudar({ rg: e.target.value })} className={campoCls} />
        </div>
        <div>
          <span id="ficha-sexo-rotulo" className={rotuloCls}>Sexo *</span>
          <div role="radiogroup" aria-labelledby="ficha-sexo-rotulo" className="flex gap-2">
            {SEXOS.map((s) => (
              <label
                key={s}
                className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md border-2 text-sm font-bold ${
                  ficha.sexo === s ? 'border-brand-dark bg-brand-dark text-white' : 'border-line-strong bg-white text-brand-dark'
                }`}
              >
                <input type="radio" name="ficha-sexo" value={s} checked={ficha.sexo === s} onChange={() => mudar({ sexo: s })} className="sr-only" />
                {s}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <span id="ficha-categoria-rotulo" className={rotuloCls}>Categoria *</span>
        <div role="radiogroup" aria-labelledby="ficha-categoria-rotulo" className="flex flex-wrap gap-2">
          {CATEGORIAS.map((c) => (
            <label
              key={c}
              className={`flex min-h-11 cursor-pointer items-center -skew-x-[8deg] border-2 px-4 text-sm font-extrabold uppercase ${
                ficha.categoria === c ? 'border-lima bg-lima text-brand-dark' : 'border-line-strong bg-white text-brand-dark hover:border-lima'
              }`}
            >
              <input type="radio" name="ficha-categoria" value={c} checked={ficha.categoria === c} onChange={() => mudar({ categoria: c })} className="sr-only" />
              <span className="skew-x-[8deg]">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {menor && (
        <div className="flex flex-col gap-4 border-t border-line pt-5">
          <div className="flex flex-col gap-1">
            <h4 className="text-base font-black uppercase text-brand-dark">Dados do responsável</h4>
            <p className="text-sm text-body">Obrigatório para atletas menores de idade.</p>
          </div>
          <div>
            <label htmlFor="ficha-resp-nome" className={rotuloCls}>Nome completo do responsável *</label>
            <input id="ficha-resp-nome" type="text" value={responsavel.nome} onChange={(e) => mudarResponsavel({ nome: e.target.value })} className={campoCls} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="ficha-resp-cpf" className={rotuloCls}>CPF do responsável *</label>
              <input
                id="ficha-resp-cpf"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                maxLength={14}
                value={responsavel.cpf}
                onChange={(e) => mudarResponsavel({ cpf: formatCPF(e.target.value) })}
                className={campoCls}
              />
            </div>
            <div>
              <label htmlFor="ficha-resp-rg" className={rotuloCls}>RG do responsável</label>
              <input id="ficha-resp-rg" type="text" maxLength={20} value={responsavel.rg} onChange={(e) => mudarResponsavel({ rg: e.target.value })} className={campoCls} />
            </div>
            <div>
              <label htmlFor="ficha-resp-telefone" className={rotuloCls}>Contato do responsável *</label>
              <input
                id="ficha-resp-telefone"
                type="tel"
                placeholder="(62) 99999-9999"
                maxLength={15}
                value={responsavel.telefone}
                onChange={(e) => mudarResponsavel({ telefone: formatPhone(e.target.value) })}
                className={campoCls}
              />
            </div>
          </div>
          <div>
            <label htmlFor="ficha-resp-endereco" className={rotuloCls}>Endereço do responsável (se for diferente do atleta)</label>
            <input id="ficha-resp-endereco" type="text" value={responsavel.endereco} onChange={(e) => mudarResponsavel({ endereco: e.target.value })} className={campoCls} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-line pt-5">
        <h4 className="text-base font-black uppercase text-brand-dark">{menor ? 'Declaração do responsável' : 'Declaração'}</h4>
        <ol className="flex max-h-64 flex-col gap-3 overflow-y-auto rounded-md bg-paper p-4 text-[13px] leading-relaxed text-body">
          {TERMOS.map((t, i) => (
            <li key={t.titulo}>
              <strong className="uppercase text-brand-dark">{i + 1}. {t.titulo}.</strong> {t.texto}
            </li>
          ))}
        </ol>
        <label className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-brand-dark">
          <input
            type="checkbox"
            checked={ficha.termos_aceitos}
            onChange={(e) => mudar({ termos_aceitos: e.target.checked })}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-brand)]"
          />
          <span>Li e concordo com as 6 declarações acima. *</span>
        </label>
      </div>

      <p className="flex items-center gap-2.5 rounded-md bg-brand-dark px-4 py-3 text-sm font-extrabold uppercase text-white">
        <AlertTriangle className="h-5 w-5 shrink-0 text-lima" aria-hidden="true" />
        {AVISO_CAMISETA}
      </p>
    </fieldset>
  );
};
