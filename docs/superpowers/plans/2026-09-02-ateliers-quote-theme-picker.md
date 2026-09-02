# Devis Theme Picker na página /ateliers — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um seletor de atelier na seção "Prochains ateliers" de `/ateliers` que abre o formulário de devis (`QuoteRequestDialog`) do tema escolhido, sempre visível.

**Architecture:** Componente local novo em `client/src/pages/ateliers.tsx` que renderiza um `<Select>` com os 5 temas de `ATELIER_THEMES`. Ao selecionar, chama `setQuoteTheme(id)` — estado já existente que monta o `QuoteRequestDialog` (linha ~980). Nenhuma mudança de backend; `POST /api/quote-requests` e o dialog já existem.

**Tech Stack:** React 18 + TypeScript, Wouter, Shadcn/Radix `Select`, sistema i18n custom FR/PT-BR (`client/src/lib/i18n.tsx`).

## Global Constraints

- Toda string nova precisa das duas línguas (fr + pt) em `client/src/lib/i18n.tsx`. Idioma padrão: francês.
- Não há ambiente de teste de componente no projeto (vitest roda `environment: "node"`, sem jsdom). Testes automatizados só para lógica pura em arquivos `*.test.ts`. Verificação de UI é manual + `npm run check`.
- Cor primária azul `#1E39B0`; seguir os componentes shadcn já usados no arquivo (não estilizar manualmente).
- Commits frequentes, mensagens terminando com `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
- Trabalhar na branch `main` (deploy Railway no push; NÃO fazer push sem o usuário pedir).

---

### Task 1: Chaves i18n do picker

**Files:**
- Modify: `client/src/lib/i18n.tsx` (inserir após a linha `"ateliers.quote.error": ...`, hoje linha 293)

**Interfaces:**
- Consumes: nada.
- Produces: chaves i18n `ateliers.quote.pickPrompt` e `ateliers.quote.pickPlaceholder`, usadas na Task 2 via `t("ateliers.quote.pickPrompt")` / `t("ateliers.quote.pickPlaceholder")`.

- [ ] **Step 1: Adicionar as duas chaves**

Em `client/src/lib/i18n.tsx`, logo depois da linha:

```ts
  "ateliers.quote.error": { fr: "Une erreur est survenue, réessayez.", pt: "Ocorreu um erro, tente novamente." },
```

inserir:

```ts
  "ateliers.quote.pickPrompt": { fr: "Pas de date qui vous convient ? Demandez un devis pour l'atelier de votre choix.", pt: "Nenhuma data disponível? Peça um orçamento para o atelier que quiser." },
  "ateliers.quote.pickPlaceholder": { fr: "Choisissez un atelier", pt: "Escolha um atelier" },
```

- [ ] **Step 2: Verificar tipos**

Run: `npm run check`
Expected: PASS (sem erros novos). As chaves entram no union type de tradução automaticamente.

- [ ] **Step 3: Commit**

```bash
git add client/src/lib/i18n.tsx
git commit -m "feat(ateliers): chaves i18n do devis theme picker

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Componente `QuoteThemePicker` e montagem na página

**Files:**
- Modify: `client/src/pages/ateliers.tsx`

**Interfaces:**
- Consumes: chaves i18n da Task 1; `ATELIER_THEMES` (já importado de `@/lib/constants` na linha 6); `themeLabel(theme: string, lang: "fr" | "pt")` (função já definida no arquivo); componentes `Select, SelectContent, SelectItem, SelectTrigger, SelectValue` (já importados); `useI18n()` retornando `{ t, lang }`; estado `quoteTheme` / setter `setQuoteTheme` de `AteliersPage` (linha ~839).
- Produces: nada para tasks posteriores (é a última task).

- [ ] **Step 1: Adicionar o componente `QuoteThemePicker`**

Em `client/src/pages/ateliers.tsx`, inserir esta função logo **antes** de `function QuoteRequestDialog(` (hoje linha 564):

```tsx
function QuoteThemePicker({ onPick }: { onPick: (theme: string) => void }) {
  const { t, lang } = useI18n();
  const [value, setValue] = useState("");

  return (
    <div className="pt-2 space-y-2" data-testid="quote-theme-picker">
      <p className="text-sm text-muted-foreground">{t("ateliers.quote.pickPrompt")}</p>
      <Select
        value={value}
        onValueChange={(v) => {
          onPick(v);
          // O dialog aberto é controlado pelo estado `quoteTheme` da página;
          // reseta o Select pro placeholder logo em seguida.
          setValue("");
        }}
      >
        <SelectTrigger data-testid="select-quote-theme-picker">
          <SelectValue placeholder={t("ateliers.quote.pickPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {ATELIER_THEMES.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              {themeLabel(theme.id, lang)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

- [ ] **Step 2: Montar o picker na seção "upcoming"**

Em `AteliersPage`, na `<section>` de "upcoming" (hoje linhas 933-951), adicionar `<QuoteThemePicker .../>` **fora** do ternário `upcoming.length === 0 ? ... : ...`, logo depois dele. Resultado:

```tsx
            <section className="space-y-3 pt-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t("ateliers.upcoming")}</h2>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">{t("ateliers.empty.upcoming")}</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((a) => (
                    <AtelierCard
                      key={a.id}
                      atelier={a}
                      testimonials={[]}
                      isPast={false}
                      onReview={() => {}}
                      onReserve={() => handleReserve(a)}
                    />
                  ))}
                </div>
              )}
              <QuoteThemePicker onPick={setQuoteTheme} />
            </section>
```

Nada muda na linha `{quoteTheme && <QuoteRequestDialog theme={quoteTheme} onClose={() => setQuoteTheme(null)} />}` (hoje linha 980) — o `onClose` já zera o estado.

- [ ] **Step 3: Verificar tipos**

Run: `npm run check`
Expected: PASS sem erros novos.

- [ ] **Step 4: Verificação manual**

Run: `npm run dev` e abrir `http://localhost:3001/ateliers`

Verificar:
- O texto "Pas de date qui vous convient ?..." e o Select aparecem na seção "Prochains ateliers", tanto com ateliers listados quanto sem (estado vazio mantém a frase "Aucun atelier programmé pour le moment" acima do picker).
- Selecionar cada um dos 5 temas abre o dialog "Demander un devis" com o nome do tema correto no texto de introdução (`ateliers.quote.intro` com `{theme}` substituído).
- Fechar o dialog (X / Annuler / após enviar) faz o Select voltar ao placeholder "Choisissez un atelier".
- Trocar o idioma para PT (toggle no header) troca prompt, placeholder e labels dos temas.

- [ ] **Step 5: Commit**

```bash
git add client/src/pages/ateliers.tsx
git commit -m "feat(ateliers): devis theme picker sempre visivel em Prochains ateliers

Seletor com os 5 temas de atelier na secao Prochains ateliers; escolher
um tema abre o QuoteRequestDialog correspondente. Reusa o estado quoteTheme
e o endpoint /api/quote-requests existentes.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Botão/afford. de devis quando não há ateliers → Task 2, picker sempre visível (inclui estado vazio). ✓
- Dropdown escolhe o atelier primeiro, depois abre o form correspondente → Task 2, `onValueChange` → `setQuoteTheme`. ✓
- Opções = 5 temas de `ATELIER_THEMES` → Task 2 Step 1. ✓
- i18n fr/pt → Task 1. ✓
- Sem backend → confirmado, nenhuma task toca `server/`. ✓
- Verificação (`npm run check` + manual, sem teste de componente) → Tasks 1 e 2. ✓

**Placeholder scan:** nenhum TODO/TBD; todo código está escrito por extenso.

**Type consistency:** `QuoteThemePicker` recebe `onPick: (theme: string) => void`; `setQuoteTheme` é `Dispatch<SetStateAction<string | null>>` — compatível com `(v: string) => void` na chamada `onPick(v)`. `themeLabel(theme.id, lang)` — assinatura confere com a definição no arquivo. `ATELIER_THEMES[].id` é `string`, usado como `value` do `SelectItem` e como arg de `setQuoteTheme`. ✓
