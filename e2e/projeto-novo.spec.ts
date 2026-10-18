// Um projeto novo criado pelo painel (ex.: "Aulas de Dança") tem que aparecer em todo lugar:
// categoria de fotos da galeria, filtro da galeria no site, formulário de inscrição e
// edição de inscrições (sem trocar o projeto da pessoa ao salvar).
import { expect, test } from '@playwright/test';
import { SESSAO, abrirAba, abrirPainel, cpfAleatorio, nomeUnico } from './ajuda';

test.use({ storageState: SESSAO });

test('projeto novo aparece na galeria, no site e nas inscrições', async ({ page, request, isMobile }) => {
  // No celular, o mesmo fluxo roda com outro nome de projeto (os testes compartilham o banco)
  const projeto = isMobile ? 'Aulas de Capoeira' : 'Aulas de Dança';

  // Conexão lenta: a lista de projetos pedida ao abrir o painel só chega DEPOIS que o projeto novo
  // foi salvo (aconteceu no GitHub Actions). A resposta atrasada não pode apagar o projeto da tela.
  let liberarLista: () => void = () => {};
  let avisarEntregue: () => void = () => {};
  const projetoSalvo = new Promise<void>((r) => (liberarLista = r));
  const listaAntigaEntregue = new Promise<void>((r) => (avisarEntregue = r));
  let primeiraLista = true;
  await page.route('**/api/projects', async (route) => {
    if (route.request().method() === 'PUT') {
      await route.continue();
      liberarLista(); // a lista antiga chega logo depois de salvar
      return;
    }
    if (!primeiraLista) return route.continue();
    primeiraLista = false;
    const resposta = await route.fetch(); // lida do banco agora, ainda sem o projeto novo
    await projetoSalvo;
    await route.fulfill({ response: resposta });
    avisarEntregue();
  });

  // 1. Cria o projeto pelo painel
  await abrirPainel(page);
  await abrirAba(page, /^Projetos/);
  await page.getByRole('button', { name: 'Novo Projeto Social' }).click();
  const formProjeto = page.getByRole('dialog');
  await formProjeto.getByLabel(/Título do Projeto/).fill(projeto);
  await formProjeto.getByLabel(/Descrição Curta/).fill(`${projeto} para crianças e adolescentes.`);
  // (o projeto novo já vem com uma foto padrão, que pode ser trocada depois)
  await formProjeto.getByRole('button', { name: 'Salvar Projeto' }).click();
  await expect(formProjeto).toBeHidden();
  await listaAntigaEntregue;

  // 2. A galeria do painel oferece o projeto como categoria; adiciona uma foto nele
  await abrirAba(page, /^Galeria/);
  await page.getByRole('button', { name: 'Adicionar Foto' }).click();
  const formFoto = page.getByRole('dialog', { name: /Adicionar Nova Foto/ });
  await formFoto.getByLabel('Link da foto').fill('/fotos/area-esporte.svg');
  await formFoto.getByLabel(/Legenda/).fill(`Primeira turma de ${projeto}`);
  await formFoto.getByLabel('Categoria').selectOption({ label: projeto });
  await formFoto.getByRole('button', { name: 'Adicionar Foto' }).click();
  await expect(formFoto).toBeHidden();
  await expect(page.getByText(new RegExp(`· ${projeto}`)).first()).toBeVisible();

  // 3. No site: filtro da galeria e opção no formulário de inscrição
  await page.goto('/#galeria');
  await page.getByRole('tab', { name: projeto }).click();
  await expect(page.getByRole('button', { name: new RegExp(`Primeira turma de ${projeto}`) }).or(page.getByAltText(`Primeira turma de ${projeto}`)).first()).toBeVisible();
  await page.goto('/#cadastro');
  await expect(page.getByLabel(/Em qual ação/).locator('option', { hasText: projeto })).toHaveCount(1);

  // 4. Uma inscrição nesse projeto: editar e salvar não troca o projeto
  const nome = nomeUnico('Aluna Nova');
  const res = await request.post('/api/beneficiaries', {
    data: {
      nome, cpf: cpfAleatorio(), nascimento: '2014-02-02', telefone: '(62) 98888-1111', email: '',
      endereco: 'Rua A, 1 - Trindade - GO', projeto, consentimento_lgpd: true, hp_security_check: '',
    },
  });
  expect(res.ok()).toBe(true);
  await abrirPainel(page);
  await abrirAba(page, /^Beneficiários/);
  const linha = page.locator('.divide-y > div').filter({ hasText: nome });
  await linha.getByTitle('Editar cadastro').click();
  const edicao = page.getByRole('dialog', { name: /Editar Cadastro/ });
  await expect(edicao.getByLabel('Projeto')).toHaveValue(projeto);
  await edicao.getByRole('button', { name: 'Salvar Alterações' }).click();
  await page.reload();
  await abrirAba(page, /^Beneficiários/);
  await expect(page.locator('.divide-y > div').filter({ hasText: nome })).toContainText(projeto);
});
