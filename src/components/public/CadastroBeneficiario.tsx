import React, { useEffect, useState } from 'react';
import {
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Phone,
  MapPin,
  Sparkles,
  MessageCircle,
  HeartHandshake,
  ShieldCheck,
  Search,
  Loader2,
  Building2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { Beneficiary, ProjectCard } from '../../types';
import {
  validateCPF,
  formatCPF,
  formatPhone,
  formatCEP,
  cleanDigits,
} from '../../utils/validation';
import { FICHA_VAZIA, ehIniciacaoEsportiva, ehMenorDeIdade, validarFicha, type FichaEsportiva } from '../../utils/ficha';
import { FichaAtleta } from './FichaAtleta';

interface CadastroBeneficiarioProps {
  projects: ProjectCard[];
  beneficiaries: Beneficiary[];
  onAddBeneficiary: (beneficiary: Beneficiary) => void;
  defaultProject?: string;
  onOpenPrivacidade?: () => void;
  /** WhatsApp do Instituto (vem do conteúdo do site), para quem já tem cadastro pedir atualização. */
  whatsapp: string;
}

export const CadastroBeneficiario: React.FC<CadastroBeneficiarioProps> = ({
  projects,
  beneficiaries,
  onAddBeneficiary,
  defaultProject,
  onOpenPrivacidade,
  whatsapp,
}) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Estados de Endereço com Integração ViaCEP
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('Trindade');
  const [uf, setUf] = useState('GO');
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [cepSuccess, setCepSuccess] = useState(false);
  const [manualAddressMode, setManualAddressMode] = useState(false);
  const [manualEndereco, setManualEndereco] = useState('');

  const [projeto, setProjeto] = useState(defaultProject || 'Centro de Iniciação Esportiva');
  const [observacoes, setObservacoes] = useState('');
  const [ficha, setFicha] = useState<FichaEsportiva>(FICHA_VAZIA);
  const esporte = ehIniciacaoEsportiva(projeto);

  // "Inscrever-se" num card de área já deixa a área escolhida aqui
  useEffect(() => {
    if (defaultProject) setProjeto(defaultProject);
  }, [defaultProject]);

  // Estados de Segurança e LGPD
  const [consentimentoLgpd, setConsentimentoLgpd] = useState(true);
  const [hpSecurityCheck, setHpSecurityCheck] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Estados de feedback
  const [existingBeneficiary, setExistingBeneficiary] = useState<Beneficiary | null>(null);
  const [submittedBeneficiary, setSubmittedBeneficiary] = useState<Beneficiary | null>(null);

  const activeProjects = projects.filter((p) => p.ativo);

  // Consulta automática à API do ViaCEP
  const fetchAddressByCep = async (cepValue: string) => {
    const raw = cleanDigits(cepValue);
    if (raw.length !== 8) return;

    setIsCepLoading(true);
    setCepError('');
    setCepSuccess(false);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      if (!res.ok) throw new Error('Erro ao consultar ViaCEP');

      const data = await res.json();

      if (data.erro) {
        setCepError('CEP não localizado. Preencha os campos abaixo manualmente.');
        setCepSuccess(false);
        return;
      }

      // Preenchimento automático com os dados oficiais do ViaCEP
      if (data.logradouro) setLogradouro(data.logradouro);
      if (data.bairro) setBairro(data.bairro);
      if (data.localidade) setCidade(data.localidade);
      if (data.uf) setUf(data.uf);

      setCepSuccess(true);
      setCepError('');

      // Foca automaticamente no campo do número / lote
      setTimeout(() => {
        document.getElementById('cadastro-numero')?.focus();
      }, 120);
    } catch (err) {
      console.error('Falha na requisição ViaCEP:', err);
      setCepError('Serviço de CEP indisponível no momento. Preencha manualmente.');
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setCep(formatted);
    setCepError('');
    setCepSuccess(false);

    const digits = cleanDigits(formatted);
    if (digits.length === 8) {
      fetchAddressByCep(digits);
    }
  };

  // Preencher atalho com o CEP do Instituto (Setor Solange)
  const handleQuickFillSedeCep = () => {
    const sedeCep = '75392-269';
    setCep(sedeCep);
    fetchAddressByCep(sedeCep);
  };

  // Gerar string unificada do endereço
  const getFormattedAddress = () => {
    if (manualAddressMode && manualEndereco.trim()) {
      return manualEndereco.trim();
    }

    const parts = [
      logradouro.trim() && `${logradouro.trim()}${numero.trim() ? `, nº ${numero.trim()}` : ''}`,
      complemento.trim(),
      bairro.trim() && (bairro.toLowerCase().startsWith('setor') || bairro.toLowerCase().startsWith('vila') ? bairro.trim() : `Setor ${bairro.trim()}`),
      `${cidade.trim() || 'Trindade'} - ${uf.trim() || 'GO'}`,
      cep.trim() && `CEP: ${cep.trim()}`,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : '';
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    setCpfError('');
    setExistingBeneficiary(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCpfError('');
    setSubmitError('');
    setExistingBeneficiary(null);

    // 1. Validação de Consentimento LGPD Obrigatório
    if (!consentimentoLgpd) {
      setSubmitError('É obrigatório concordar com o tratamento de dados (LGPD) para prosseguir com o cadastro.');
      return;
    }

    // 2. Validação Matemática Real de CPF (Módulo 11)
    if (!validateCPF(cpf)) {
      setCpfError('CPF inválido. Por favor, verifique os dígitos verificadores informados.');
      return;
    }

    // Ficha do atleta (mesmas regras que o servidor confere)
    if (esporte) {
      const erroFicha = validarFicha(ficha, nascimento);
      if (erroFicha) {
        setSubmitError(erroFicha);
        return;
      }
    }

    // 3. Controle de Duplicidade Real por CPF limpo
    const rawCpf = cleanDigits(cpf);
    const foundExisting = beneficiaries.find(
      (b) => cleanDigits(b.cpf) === rawCpf
    );

    if (foundExisting) {
      setExistingBeneficiary(foundExisting);
      return;
    }

    // 4. Montar endereço completo
    const finalEndereco = getFormattedAddress() || 'Trindade - GO';

    // 5. Criação no Banco de Dados Real no Servidor
    setIsSubmitting(true);
    try {
      const res = await api.createBeneficiary({
        nome: nome.trim(),
        cpf: formatCPF(cpf),
        nascimento,
        telefone: telefone.trim(),
        email: email.trim() || 'Não informado',
        endereco: finalEndereco,
        projeto,
        status: 'Pendente',
        observacoes: observacoes.trim(),
        consentimento_lgpd: true,
        hp_security_check: hpSecurityCheck,
        ...(esporte && {
          ficha: { ...ficha, responsavel: ehMenorDeIdade(nascimento) ? ficha.responsavel : undefined },
        }),
      });

      const newBeneficiary: Beneficiary = {
        id: res.id || `ben-${Date.now()}`,
        nome: nome.trim(),
        cpf: formatCPF(cpf),
        nascimento,
        telefone: telefone.trim(),
        email: email.trim() || 'Não informado',
        endereco: finalEndereco,
        projeto,
        status: 'Pendente',
        observacoes: observacoes.trim(),
        criado_em: new Date().toISOString().split('T')[0],
      };

      onAddBeneficiary(newBeneficiary);
      setSubmittedBeneficiary(newBeneficiary);

      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignorar se falhar animação
      }

      // Limpar formulário
      setNome('');
      setCpf('');
      setNascimento('');
      setTelefone('');
      setEmail('');
      setCep('');
      setLogradouro('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('Trindade');
      setUf('GO');
      setCepSuccess(false);
      setCepError('');
      setManualEndereco('');
      setObservacoes('');
      setFicha(FICHA_VAZIA);
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao enviar cadastro ao servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="cadastro" className="border-t border-line bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-10 flex flex-col gap-3">
          <span className="kicker">Inscrição gratuita</span>
          <h2 className="section-title">Faça sua inscrição</h2>
          <p className="max-w-2xl text-base leading-relaxed text-body">
            Inscreva seu filho(a) no Centro de Iniciação Esportiva ou cadastre sua família para as ações do Instituto.
            Tudo é 100% gratuito e a equipe entra em contato pelo WhatsApp.
          </p>
        </div>

        {/* Feedback: CPF Já Cadastrado (Controle de Duplicidade Inteligente) */}
        {existingBeneficiary && (
          <div className="mb-8 p-6 bg-sand border-2 border-line rounded-lg shadow-sm animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-6 h-6 text-brand" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Este CPF já possui cadastro registrado!
                  </h3>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${ existingBeneficiary.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : existingBeneficiary.status === 'Em análise' ? 'bg-brand-soft text-brand border border-line' : existingBeneficiary.status === 'Atendido/Entregue' ? 'bg-brand-soft text-brand border border-line' : existingBeneficiary.status === 'Recusado' ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-slate-100 text-slate-800 border border-slate-300' }`}
                  >
                    Status Atual: {existingBeneficiary.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 mt-2">
                  Encontramos o cadastro em nome de <strong>{existingBeneficiary.nome}</strong>, inscrito no projeto{' '}
                  <strong>{existingBeneficiary.projeto}</strong> em {existingBeneficiary.criado_em}.
                </p>

                {existingBeneficiary.observacoes && (
                  <p className="text-xs text-slate-600 mt-1 italic bg-white/70 p-2.5 rounded-md border border-line">
                    <strong>Anotação da equipe:</strong> {existingBeneficiary.observacoes}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/55${cleanDigits(whatsapp)}?text=${encodeURIComponent('Olá! Gostaria de consultar ou atualizar meu cadastro no Instituto Trindade Solidária.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Falar no WhatsApp para Atualizar Dados</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setExistingBeneficiary(null)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-brand-soft rounded-md transition-colors"
                  >
                    Tentar outro CPF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback: Sucesso no Novo Cadastro */}
        {submittedBeneficiary && (
          <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-300 rounded-lg shadow-sm animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-emerald-700" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-emerald-800">
                  Cadastro Enviado com Sucesso!
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Bem-vindo(a) ao Instituto Trindade Solidária!
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-2">
                  Recebemos a inscrição de <strong>{submittedBeneficiary.nome}</strong> para o projeto{' '}
                  <strong>{submittedBeneficiary.projeto}</strong>. O cadastro foi registrado com status{' '}
                  <strong className="text-brand">Pendente</strong> e está na fila de aprovação da nossa coordenação.
                </p>
                <div className="mt-3 text-xs text-slate-600 bg-white/80 p-3 rounded-md border border-emerald-200">
                  Nossa equipe entrará em contato via WhatsApp no número <strong>{submittedBeneficiary.telefone}</strong> para confirmar a categoria, os horários ou a entrega dos benefícios.
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmittedBeneficiary(null)}
                    className="px-4 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors cursor-pointer"
                  >
                    Fazer Outro Cadastro
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulário Principal de Cadastro */}
        <div className="rounded-md border-t-8 border-brand-dark bg-sand p-6 shadow-xs sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Área de interesse (primeiro: decide se a ficha do atleta aparece) */}
            <div>
              <label htmlFor="cadastro-projeto-social-desejado" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-brand-dark">
                Em qual ação você quer se inscrever? *
              </label>
              <select
                id="cadastro-projeto-social-desejado"
                value={projeto}
                onChange={(e) => setProjeto(e.target.value)}
                className="w-full rounded-md border-2 border-brand-dark bg-white px-4 py-3 text-sm font-bold text-brand-dark shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {activeProjects.map((p) => (
                  <option key={p.id} value={p.titulo}>
                    {p.titulo}
                  </option>
                ))}
              </select>
            </div>

            {/* Nome Completo e CPF */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cadastro-nome-completo" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {esporte ? 'Nome completo do(a) atleta *' : 'Nome Completo *'}
                </label>
                <input
                  id="cadastro-nome-completo"
                  type="text"
                  required
                  placeholder={esporte ? "Nome do(a) atleta" : "Nome do(a) participante ou responsável"}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs"
                />
              </div>

              <div>
                <label htmlFor="cadastro-cpf-validacao-real" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{esporte ? 'CPF do(a) atleta *' : 'CPF *'}</span>
                  <span className="text-[10px] text-slate-600 font-normal">Apenas números</span>
                </label>
                <input
                  id="cadastro-cpf-validacao-real"
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  maxLength={14}
                  value={cpf}
                  onChange={handleCpfChange}
                  className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-white border rounded-md focus:outline-none focus:ring-2 shadow-2xs ${ cpfError ? 'border-red-400 focus:ring-red-500 bg-red-50/20' : 'border-slate-200 focus:ring-amber-500' }`}
                />
                {cpfError && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{cpfError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Data de Nascimento e Telefone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cadastro-data-nascimento" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Data de Nascimento *
                </label>
                <input
                  id="cadastro-data-nascimento"
                  type="date"
                  required
                  value={nascimento}
                  onChange={(e) => setNascimento(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs text-slate-800"
                />
              </div>

              <div>
                <label htmlFor="cadastro-telefone-whatsapp" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Telefone / WhatsApp *
                </label>
                <input
                  id="cadastro-telefone-whatsapp"
                  type="tel"
                  required
                  placeholder="(62) 99999-9999"
                  maxLength={15}
                  value={telefone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs"
                />
              </div>
            </div>

            {/* E-mail de Contato */}
            <div>
              <label htmlFor="cadastro-mail-contato" className="block text-xs font-bold text-slate-700 mb-1.5">
                E-mail de Contato (Opcional)
              </label>
              <input
                id="cadastro-mail-contato"
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs"
              />
            </div>

            {/* SEÇÃO DE ENDEREÇO COM INTEGRAÇÃO VIACEP */}
            <div className="bg-white p-5 sm:p-6 rounded-lg border border-line shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-soft flex items-center justify-center text-brand">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Endereço de Residência
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Digite o CEP para preencher a rua, bairro e cidade automaticamente
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleQuickFillSedeCep}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:text-brand bg-sand hover:bg-brand-soft border border-line px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Preencher com o CEP do Setor Solange"
                  >
                    <Sparkles className="w-3 h-3 text-brand" />
                    <span>CEP Setor Solange (75392-269)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualAddressMode(!manualAddressMode)}
                    className="alvo-toque text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    {manualAddressMode ? 'Usar busca por CEP' : 'Digitar em campo único'}
                  </button>
                </div>
              </div>

              {manualAddressMode ? (
                <div>
                  <label htmlFor="cadastro-endereco-completo-manual" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Endereço Completo Manual *
                  </label>
                  <input
                    id="cadastro-endereco-completo-manual"
                    type="text"
                    required
                    placeholder="Ex: Rua 14, Qd. 05, Lt. 12, Setor Maysa II, Trindade - GO"
                    value={manualEndereco}
                    onChange={(e) => setManualEndereco(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs"
                  />
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Campo de CEP com indicador de busca ViaCEP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-1">
                      <label htmlFor="cadastro-cep" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>CEP *</span>
                        {isCepLoading && (
                          <span className="text-[10px] text-brand flex items-center gap-1 font-normal">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Buscando...
                          </span>
                        )}
                        {cepSuccess && !isCepLoading && (
                          <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-bold">
                            <Check className="w-3 h-3" />
                            Localizado!
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          id="cadastro-cep"
                          type="text"
                          required
                          placeholder="00000-000"
                          maxLength={9}
                          value={cep}
                          onChange={handleCepChange}
                          className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-white border rounded-md focus:outline-none focus:ring-2 font-mono shadow-2xs ${ cepError ? 'border-line focus:ring-brand bg-sand' : cepSuccess ? 'border-emerald-300 focus:ring-emerald-500' : 'border-slate-200 focus:ring-amber-500' }`}
                        />
                        <button
                          type="button"
                          onClick={() => fetchAddressByCep(cep)}
                          disabled={cleanDigits(cep).length !== 8 || isCepLoading}
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 rounded-lg text-slate-500 hover:text-brand disabled:opacity-30 transition-colors cursor-pointer"
                          title="Buscar CEP na API ViaCEP"
                        >
                          {isCepLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-brand" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {cepError && (
                        <p className="text-[11px] text-brand font-medium mt-1">
                          {cepError}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="cadastro-rua-avenida-alameda" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Rua / Avenida / Alameda *
                      </label>
                      <input
                        id="cadastro-rua-avenida-alameda"
                        type="text"
                        required
                        placeholder="Ex: Rua Ana Alves, Rua 12, etc."
                        value={logradouro}
                        onChange={(e) => setLogradouro(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Número e Complemento / Quadra e Lote */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label htmlFor="cadastro-numero" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Número / Lote *
                      </label>
                      <input
                        id="cadastro-numero"
                        type="text"
                        required
                        placeholder="Ex: 16, S/N, Lt. 04"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="cadastro-complemento-quadra" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Complemento / Quadra (Opcional)
                      </label>
                      <input
                        id="cadastro-complemento-quadra"
                        type="text"
                        placeholder="Ex: Qd. 14, Chácara 26/27, Casa 2, Fundos"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Bairro, Cidade e UF */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
                    <div className="sm:col-span-2">
                      <label htmlFor="cadastro-bairro-setor" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Bairro / Setor *
                      </label>
                      <input
                        id="cadastro-bairro-setor"
                        type="text"
                        required
                        placeholder="Ex: Setor Solange"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="cadastro-cidade" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Cidade *
                      </label>
                      <input
                        id="cadastro-cidade"
                        type="text"
                        required
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs"
                      />
                    </div>

                    <div>
                      <label htmlFor="cadastro-estado-uf" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Estado (UF) *
                      </label>
                      <input
                        id="cadastro-estado-uf"
                        type="text"
                        required
                        maxLength={2}
                        value={uf}
                        onChange={(e) => setUf(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs text-center font-bold"
                      />
                    </div>
                  </div>

                  {/* Prévia do Endereço Formatado */}
                  {getFormattedAddress() && (
                    <div className="mt-2 p-2.5 bg-sand rounded-md border border-line text-xs text-brand flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[10px] text-brand block">
                          Prévia do Endereço que será Cadastrado:
                        </span>
                        <span className="font-medium">{getFormattedAddress()}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {esporte && <FichaAtleta ficha={ficha} onChange={setFicha} nascimento={nascimento} />}

            {/* Observações */}
            <div>
              <label htmlFor="cadastro-observacoes-informacoes-importantes" className="block text-xs font-bold text-slate-700 mb-1.5">
                Observações / Informações Importantes (Opcional)
              </label>
              <textarea
                id="cadastro-observacoes-informacoes-importantes"
                rows={3}
                placeholder="Ex: categoria do atleta (Sub-09 a Sub-17, Feminino); restrições médicas ou alergias; número de pessoas na família; necessidade de acessibilidade na moradia..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand shadow-2xs text-slate-800"
              />
            </div>

            {/* Proteção Anti-Spam (Honeypot para robôs) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="cadastro-nao-preencha-este">Não preencha este campo de segurança</label>
              <input
                id="cadastro-nao-preencha-este"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={hpSecurityCheck}
                onChange={(e) => setHpSecurityCheck(e.target.value)}
              />
            </div>

            {/* Aviso de Privacidade e Consentimento Obrigatório LGPD */}
            <div className="p-4 bg-sand border border-line rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 select-none">
                <input
                  type="checkbox"
                  required
                  checked={consentimentoLgpd}
                  onChange={(e) => setConsentimentoLgpd(e.target.checked)}
                  className="mt-0.5 w-6 h-6 sm:w-4 sm:h-4 shrink-0 rounded text-brand focus:ring-brand border-slate-300 cursor-pointer"
                />
                <span className="leading-relaxed">
                  Autorizo e concordo com o tratamento dos dados pessoais e cadastrais informados acima pelo <strong>Instituto Trindade Solidária</strong> (CNPJ 45.698.518/0001-89) para fins exclusivos de inscrição, organização das atividades e prestação de contas das ações sociais, em integral conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
                  {onOpenPrivacidade && (
                    <button
                      type="button"
                      onClick={onOpenPrivacidade}
                      className="alvo-toque text-brand underline font-bold ml-1.5 hover:text-brand cursor-pointer"
                    >
                      Ler Política de Privacidade
                    </button>
                  )}
                </span>
              </label>
            </div>

            {submitError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Botão de Envio */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-lima min-h-[56px] w-full text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Enviando dados com segurança...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Enviar inscrição</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-600 text-center mt-2">
                Ao enviar, seu cadastro entrará na fila de análise do Instituto Trindade Solidária. Seus dados estão seguros e protegidos.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
