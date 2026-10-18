import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ProjectCard } from '../../types';
import { Foto } from './Foto';

interface ProjetosSectionProps {
  projects: ProjectCard[];
  onOpenCadastro: (projectName: string) => void;
}

/** Ícone de cada área, escolhido pelo nome (traço fino). */
const ICONES: { chave: RegExp; d: string }[] = [
  { chave: /esport|futebol|bola/i, d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5l3.8 2.8-1.4 4.4H9.6l-1.4-4.4zM12 3v4.5M20.3 9.6l-4.5.7M17.3 19.3l-2.9-4.6M6.7 19.3l2.9-4.6M3.7 9.6l4.5.7' },
  { chave: /cesta|aliment|necessidade/i, d: 'M3 10h18l-2 10H5zM7 10l4-6M17 10l-4-6M9 14v3M12 14v3M15 14v3' },
  { chave: /moradia|reforma|casa|constru/i, d: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6' },
  { chave: /educa|cidadania|escola|oficina/i, d: 'M2 6h6a4 4 0 0 1 4 4v10a3 3 0 0 0-3-3H2zM22 6h-6a4 4 0 0 0-4 4v10a3 3 0 0 1 3-3h7z' },
];
const CORACAO = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';

const ProjetoIcone: React.FC<{ titulo: string }> = ({ titulo }) => {
  const d = ICONES.find((i) => i.chave.test(titulo))?.d ?? CORACAO;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
};

// As áreas alternam o verde-limão e o azul-claro do logo.
const CORES = [
  { faixa: 'bg-lima', icone: 'bg-lima text-brand-dark' },
  { faixa: 'bg-ceu', icone: 'bg-ceu text-white' },
];

export const ProjetosSection: React.FC<ProjetosSectionProps> = ({ projects, onOpenCadastro }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(null);
  const activeProjects = projects.filter((p) => p.ativo).sort((a, b) => a.ordem - b.ordem);

  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedProject(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject]);

  return (
    <section id="projetos" className="bg-paper">
      <div className="container-site flex flex-col gap-8 py-14 sm:gap-12 sm:py-24">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="flex max-w-2xl flex-col gap-3">
            <span className="kicker">Áreas de atuação</span>
            <h2 className="section-title">Como transformamos realidades</h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-body">
            Ações de proteção social básica, sempre gratuitas, em articulação com a rede socioassistencial de Trindade.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activeProjects.map((project, i) => {
            const cor = CORES[i % CORES.length];
            return (
              <article key={project.id} className="group relative flex flex-col overflow-hidden rounded-md bg-white shadow-[0_10px_30px_rgba(1,48,60,0.08)]">
                <div className={`h-2 ${cor.faixa}`} />
                <div className="relative">
                  <Foto
                    src={project.foto_url}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    alt=""
                    loading="lazy"
                    className="block aspect-[8/5] w-full bg-brand-dark object-cover"
                  />
                  <span className="absolute left-4 top-3 text-5xl font-black leading-none text-white/90 drop-shadow">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5 lg:p-6">
                  <div className={`-mt-11 flex h-12 w-12 -skew-x-[10deg] items-center justify-center shadow-md ${cor.icone}`}>
                    <span className="skew-x-[10deg]"><ProjetoIcone titulo={project.titulo} /></span>
                  </div>
                  <h3 className="text-lg font-black uppercase leading-tight text-brand-dark">{project.titulo}</h3>
                  <p className="flex-1 text-[15px] leading-relaxed text-body">{project.descricao}</p>
                  {(project.idade_publico || project.horario) && (
                    <div className="flex flex-wrap gap-2">
                      {project.idade_publico && <span className="chip bg-lima-soft text-lima-ink">{project.idade_publico}</span>}
                      {project.horario && <span className="chip bg-brand-soft text-brand-ink">{project.horario}</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-5 border-t border-line pt-3">
                    <button onClick={() => setSelectedProject(project)} className="link-arrow uppercase tracking-wide">
                      Saiba mais →
                    </button>
                    <button onClick={() => onOpenCadastro(project.titulo)} className="alvo-toque text-[14px] font-semibold text-muted hover:text-ink">
                      Inscrever-se
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="projeto-titulo"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-lg bg-white sm:rounded-lg"
          >
            <div className="relative">
              <Foto src={selectedProject.foto_url} sizes="(min-width: 640px) 576px, 100vw" alt="" className="aspect-[16/9] w-full object-cover" />
              <button onClick={() => setSelectedProject(null)} className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-md bg-white text-ink" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <h3 id="projeto-titulo" className="text-2xl font-black uppercase text-brand-dark">{selectedProject.titulo}</h3>
              <p className="text-[15px] leading-relaxed text-body">{selectedProject.descricao}</p>
              {selectedProject.detalhes && <p className="rounded-md bg-sand p-4 text-[15px] leading-relaxed text-body">{selectedProject.detalhes}</p>}
              <dl className="grid grid-cols-[110px_1fr] gap-y-2 border-t border-line pt-5 text-sm">
                {selectedProject.idade_publico && <><dt className="text-muted">Público</dt><dd className="text-ink">{selectedProject.idade_publico}</dd></>}
                {selectedProject.horario && <><dt className="text-muted">Horário</dt><dd className="text-ink">{selectedProject.horario}</dd></>}
                {selectedProject.coordenador && <><dt className="text-muted">Coordenação</dt><dd className="text-ink">{selectedProject.coordenador}</dd></>}
              </dl>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button onClick={() => setSelectedProject(null)} className="btn-secondary">Voltar</button>
                <button onClick={() => { const title = selectedProject.titulo; setSelectedProject(null); onOpenCadastro(title); }} className="btn-primary">
                  Quero participar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
