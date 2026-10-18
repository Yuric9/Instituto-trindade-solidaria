import { env } from 'cloudflare:workers';
import { describe, expect, it } from 'vitest';
import { api, beneficiaryForm, login, newIp } from './helpers';

async function countBeneficiaries() {
  const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM beneficiaries').first<{ n: number }>();
  return row?.n ?? 0;
}

/** Cria um usuário com o papel pedido (pelo admin) e devolve o cookie de sessão dele. */
async function loginAs(role: 'voluntario' | 'equipe' | 'coordenador') {
  const admin = await login();
  const email = `${role}-${crypto.randomUUID()}@exemplo.com`;
  const created = await api('/auth/users', {
    method: 'POST',
    cookie: admin.cookie,
    body: { nome: `Teste ${role}`, email, password: 'senha-de-teste-1', role },
  });
  expect(created.status).toBe(201);
  return (await login(email, 'senha-de-teste-1')).cookie;
}

describe('formulário público de inscrição', () => {
  it('aceita uma inscrição válida e grava como Pendente', async () => {
    const res = await api('/beneficiaries', { method: 'POST', body: beneficiaryForm() });
    expect(res.status).toBe(201);
    const { id } = await res.json<{ id: string }>();

    const row = await env.DB.prepare('SELECT status FROM beneficiaries WHERE id = ?').bind(id).first<{ status: string }>();
    expect(row?.status).toBe('Pendente');
  });

  it('visitante não consegue se cadastrar já como Aprovado', async () => {
    const res = await api('/beneficiaries', { method: 'POST', body: beneficiaryForm({ status: 'Aprovado' }) });
    const { id } = await res.json<{ id: string }>();
    const row = await env.DB.prepare('SELECT status FROM beneficiaries WHERE id = ?').bind(id).first<{ status: string }>();
    expect(row?.status).toBe('Pendente');
  });

  it.each([
    ['sem consentimento LGPD', { consentimento_lgpd: false }],
    ['CPF com dígito errado', { cpf: '529.982.247-26' }],
    ['CPF com todos os dígitos iguais', { cpf: '111.111.111-11' }],
    ['telefone curto demais', { telefone: '9999-000' }],
    ['e-mail malformado', { email: 'maria@' }],
    ['nome curto demais', { nome: 'Al' }],
  ])('recusa inscrição %s', async (_caso, overrides) => {
    const before = await countBeneficiaries();
    const res = await api('/beneficiaries', { method: 'POST', body: beneficiaryForm(overrides) });
    expect(res.status).toBe(400);
    expect(await countBeneficiaries()).toBe(before);
  });

  it('recusa CPF já cadastrado', async () => {
    const form = beneficiaryForm();
    expect((await api('/beneficiaries', { method: 'POST', body: form })).status).toBe(201);
    const again = await api('/beneficiaries', { method: 'POST', body: { ...form, nome: 'Outra Pessoa' } });
    expect(again.status).toBe(400);
  });

  it('robô que preenche o campo armadilha recebe "sucesso", mas nada é gravado', async () => {
    const before = await countBeneficiaries();
    const res = await api('/beneficiaries', {
      method: 'POST',
      body: beneficiaryForm({ hp_security_check: 'http://spam.example' }),
    });
    expect(res.status).toBe(200);
    expect(await countBeneficiaries()).toBe(before);
  });

  it('limita a 6 inscrições por IP a cada 10 minutos', async () => {
    const ip = newIp();
    for (let i = 0; i < 6; i++) {
      expect((await api('/beneficiaries', { method: 'POST', ip, body: beneficiaryForm() })).status).toBe(201);
    }
    expect((await api('/beneficiaries', { method: 'POST', ip, body: beneficiaryForm() })).status).toBe(429);
  });
});

describe('ficha da iniciação esportiva', () => {
  const ficha = beneficiaryForm().ficha;

  it.each([
    ['sem ficha', { ficha: undefined }],
    ['sem categoria', { ficha: { ...ficha, categoria: '' } }],
    ['categoria que não existe', { ficha: { ...ficha, categoria: 'Sub-99' } }],
    ['menino na categoria feminina', { ficha: { ...ficha, sexo: 'Masculino', categoria: 'Feminino Livre' } }],
    ['menor sem responsável', { ficha: { ...ficha, responsavel: undefined } }],
    ['responsável com CPF inválido', { ficha: { ...ficha, responsavel: { ...ficha.responsavel, cpf: '111.111.111-11' } } }],
    ['sem aceitar os termos', { ficha: { ...ficha, termos_aceitos: false } }],
  ])('recusa inscrição no esporte %s', async (_caso, overrides) => {
    const before = await countBeneficiaries();
    const res = await api('/beneficiaries', { method: 'POST', body: beneficiaryForm(overrides) });
    expect(res.status).toBe(400);
    expect(await countBeneficiaries()).toBe(before);
  });

  it('adulto no esporte não precisa de responsável', async () => {
    const res = await api('/beneficiaries', {
      method: 'POST',
      body: beneficiaryForm({ nascimento: '2000-01-01', ficha: { ...ficha, categoria: 'Feminino Livre', responsavel: undefined } }),
    });
    expect(res.status).toBe(201);
  });

  it('outras áreas não pedem ficha e gravam a coluna vazia', async () => {
    const res = await api('/beneficiaries', {
      method: 'POST',
      body: beneficiaryForm({ projeto: 'Cestas Básicas e Primeira Necessidade', ficha: undefined }),
    });
    expect(res.status).toBe(201);
    const { id } = await res.json<{ id: string }>();
    const row = await env.DB.prepare('SELECT ficha_json FROM beneficiaries WHERE id = ?').bind(id).first<{ ficha_json: string | null }>();
    expect(row?.ficha_json).toBeNull();
  });

  it('grava só os campos conhecidos e devolve a ficha para a coordenação', async () => {
    const form = beneficiaryForm({ ficha: { ...ficha, campo_estranho: 'x' } });
    const { id } = await (await api('/beneficiaries', { method: 'POST', body: form })).json<{ id: string }>();
    const admin = await login();
    const lista = await (await api('/beneficiaries', { cookie: admin.cookie })).json<any[]>();
    const salvo = lista.find((b) => b.id === id);
    expect(salvo.ficha).toMatchObject({ categoria: 'Sub-11', sexo: 'Feminino', rg: '1234567', termos_aceitos: true });
    expect(salvo.ficha.responsavel.cpf).toBe('529.982.247-25');
    expect(salvo.ficha.termos_versao).toBeTruthy();
    expect(salvo.ficha).not.toHaveProperty('campo_estranho');
    expect(salvo).not.toHaveProperty('ficha_json');
  });

  it('voluntário vê a categoria, mas não os documentos do atleta e do responsável', async () => {
    const form = beneficiaryForm();
    const { id } = await (await api('/beneficiaries', { method: 'POST', body: form })).json<{ id: string }>();
    const cookie = await loginAs('voluntario');
    const lista = await (await api('/beneficiaries', { cookie })).json<any[]>();
    const visto = lista.find((b) => b.id === id);
    expect(visto.ficha.categoria).toBe('Sub-11');
    expect(visto.ficha.rg).toBe('Protegido (LGPD)');
    expect(visto.ficha.responsavel.cpf).not.toContain('529.982');
    expect(visto.ficha.responsavel.telefone).not.toContain('8888-1111');
  });
});

describe('LGPD: quem vê os dados dos beneficiários', () => {
  it('visitante sem login não vê nada', async () => {
    expect((await api('/beneficiaries')).status).toBe(401);
  });

  it('equipe vê os dados completos', async () => {
    const form = beneficiaryForm();
    await api('/beneficiaries', { method: 'POST', body: form });

    const cookie = await loginAs('equipe');
    const rows = await (await api('/beneficiaries', { cookie })).json<any[]>();
    const mine = rows.find((b: any) => b.cpf === form.cpf);
    expect(mine).toBeDefined();
    expect(mine.endereco).toBe(form.endereco);
    expect(mine.telefone).toBe(form.telefone);
  });

  it('voluntário recebe CPF, endereço e telefone mascarados', async () => {
    const form = beneficiaryForm({ nome: `Mascara ${crypto.randomUUID()}` });
    await api('/beneficiaries', { method: 'POST', body: form });

    const cookie = await loginAs('voluntario');
    const res = await api('/beneficiaries', { cookie });
    expect(res.status).toBe(200);
    const rows = await res.json<any[]>();
    const mine = rows.find((b: any) => b.nome === form.nome);
    expect(mine).toBeDefined();

    const digits = form.cpf.replace(/\D/g, '');
    expect(mine.cpf).toBe(`***.***.${digits.slice(6, 9)}-**`);
    expect(mine.endereco).not.toContain('Rua de Teste');
    expect(mine.telefone).toBe('(62) ****-****');

    // Nenhum CPF completo pode aparecer na resposta inteira para um voluntário
    expect(JSON.stringify(rows)).not.toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
  });

  it('voluntário não pode alterar nem excluir beneficiários', async () => {
    const created = await api('/beneficiaries', { method: 'POST', body: beneficiaryForm() });
    const { id } = await created.json<{ id: string }>();
    const cookie = await loginAs('voluntario');

    expect((await api(`/beneficiaries/${id}`, { method: 'PATCH', cookie, body: { status: 'Aprovado' } })).status).toBe(403);
    expect((await api(`/beneficiaries/${id}`, { method: 'DELETE', cookie })).status).toBe(403);
  });
});
