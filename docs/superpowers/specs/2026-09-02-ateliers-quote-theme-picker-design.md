# Devis picker na página /ateliers — Design

Data: 2026-09-02

## Problema

Na página `/ateliers` (app.obaristech.com/ateliers), a seção "Prochains ateliers"
mostra apenas "Aucun atelier programmé pour le moment" quando não há ateliers
futuros. O visitante não tem como manifestar interesse. O formulário de devis
(`QuoteRequestDialog`) já existe, mas hoje só é aberto por deep-link
(`/ateliers?reservar=<tema>`) vindo das páginas de marketing, ou quando uma
reserva não encontra data disponível.

## Objetivo

Dar ao visitante, direto na página `/ateliers`, uma forma de pedir um devis para
o atelier que quiser: um seletor de atelier que abre o formulário de devis
correspondente ao tema escolhido.

## Decisões

- **Opções do dropdown**: os 5 temas de `ATELIER_THEMES`
  (`domicile`, `team-building`, `espace-prive`, `peinture-enfants`, `cafe-tech`),
  rotulados pelo idioma atual via `themeLabel()`.
- **Visibilidade**: sempre visível na seção "Prochains ateliers" — tanto com
  ateliers listados quanto no estado vazio. No estado vazio a frase
  "Aucun atelier programmé pour le moment" continua aparecendo, com o picker
  logo abaixo.
- Sem alteração de backend: reutiliza `POST /api/quote-requests` e o
  `QuoteRequestDialog` existente.

## Implementação

Arquivo: `client/src/pages/ateliers.tsx`

1. Novo componente local `QuoteThemePicker({ onPick }: { onPick: (theme: string) => void })`:
   - Texto de chamada: `t("ateliers.quote.pickPrompt")`.
   - `<Select>` (Radix, mesmo componente já usado no arquivo) com
     `value` controlado por estado local, placeholder
     `t("ateliers.quote.pickPlaceholder")`, e um `<SelectItem>` por tema de
     `ATELIER_THEMES` com label `themeLabel(theme.id, lang)`.
   - `onValueChange`: chama `onPick(id)` e **reseta o valor local** para `""`
     em seguida (o Select volta ao placeholder; a fonte de verdade para o
     dialog aberto é o estado `quoteTheme` da página).
   - Marcação de teste: `data-testid="select-quote-theme-picker"`.

2. Em `AteliersPage`, dentro da `<section>` de "upcoming", renderizar
   `<QuoteThemePicker onPick={setQuoteTheme} />` **depois** do bloco
   `upcoming.length === 0 ? ... : ...` (fora do ternário, sempre).

3. O `QuoteRequestDialog` já está montado no fim do componente
   (`{quoteTheme && <QuoteRequestDialog theme={quoteTheme} .../>}`) — nada a
   mudar ali. Fechar o dialog (`onClose`) já faz `setQuoteTheme(null)`.

Arquivo: `client/src/lib/i18n.tsx` — adicionar duas chaves junto às
`ateliers.quote.*`:

- `ateliers.quote.pickPrompt`
  - fr: "Pas de date qui vous convient ? Demandez un devis pour l'atelier de votre choix."
  - pt: "Nenhuma data disponível? Peça um orçamento para o atelier que quiser."
- `ateliers.quote.pickPlaceholder`
  - fr: "Choisissez un atelier"
  - pt: "Escolha um atelier"

## Fora de escopo

- Listar ateliers futuros individuais no dropdown (o devis é por tema, não por sessão).
- Alterações no fluxo de deep-link `?reservar=`.

## Verificação

- `npm run check` (tsc) sem erros novos.
- Manual em `npm run dev`: na `/ateliers`, o picker aparece na seção
  "Prochains ateliers"; escolher cada um dos 5 temas abre o
  "Demander un devis" com o `{theme}` correto no texto de introdução;
  fechar/enviar volta ao estado inicial e o Select volta ao placeholder.
- O projeto não tem ambiente de teste de componente (vitest roda em `node`,
  sem jsdom), então não há teste automatizado de UI; a verificação da UI é manual.
