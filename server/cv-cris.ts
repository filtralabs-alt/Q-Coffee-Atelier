export const cvCrisHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CV — Cristiano Duarte · Barista Café de Spécialité</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --espresso:   #1a0f08;
    --roast:      #2e1a0e;
    --caramel:    #c17f3a;
    --cream:      #f5ede0;
    --milk:       #faf6f0;
    --light-roast:#e8d5b7;
    --accent:     #3650e1; /* aligné sur le bleu Baristech #3650E1 */
    --text:       #2a1a0e;
    --muted:      #7a6558;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body { background: #e8ddd2; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #e8ddd2;
    background-image:
      radial-gradient(ellipse at 20% 20%, rgba(193,127,58,0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 80%, rgba(54,80,225,0.08) 0%, transparent 60%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5rem 1.5rem;
    color: var(--text);
  }

  .print-btn {
    margin-bottom: 1.5rem;
    padding: 0.6rem 1.6rem;
    background: var(--espresso);
    color: var(--cream);
    border: none;
    border-radius: 2px;
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
  }
  .print-btn:hover { background: var(--caramel); }

  /* ── PAGE (format A4 fixe) ── */
  .page {
    width: 210mm;
    min-height: 297mm;
    background: var(--milk);
    border-radius: 3px;
    box-shadow:
      0 2px 4px rgba(26,15,8,0.06),
      0 12px 40px rgba(26,15,8,0.14),
      0 0 0 1px rgba(193,127,58,0.18);
    position: relative;
    margin-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
  }
  .page:last-of-type { margin-bottom: 0; }
  .page > * { flex-shrink: 0; }

  /* ── HEADER ── */
  .header {
    background: var(--espresso);
    padding: 1.1rem 3rem 1rem;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
    align-items: end;
  }

  .header::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 110% 120%, rgba(193,127,58,0.22) 0%, transparent 55%),
      radial-gradient(ellipse at -10% -20%, rgba(54,80,225,0.12) 0%, transparent 50%);
    pointer-events: none;
  }

  .header-left { position: relative; z-index: 1; }

  .kicker {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--caramel);
    margin-bottom: 0.7rem;
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: 1.95rem;
    line-height: 1;
    color: var(--cream);
    letter-spacing: -0.02em;
  }

  .title-role {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-weight: 400;
    font-size: 1rem;
    color: var(--caramel);
    margin-top: 0.4rem;
    letter-spacing: 0.01em;
  }

  .header-meta {
    display: flex;
    flex-direction: column;
    gap: 0.26rem;
    margin-top: 0.6rem;
  }

  .meta-item {
    font-size: 0.76rem;
    color: #ffffff;
    font-weight: 300;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .meta-item span.dot {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--caramel);
    flex-shrink: 0;
  }

  .meta-item a { color: #ffffff; text-decoration: none; }
  .meta-item a:hover { color: var(--caramel); }

  .header-right {
    position: absolute;
    top: -50px; right: -50px;
    z-index: 0;
  }

  .header-logo {
    width: 320px;
    height: 320px;
    opacity: 0.16;
    filter:
      drop-shadow(1px 1px 1px rgba(0,0,0,0.55))
      drop-shadow(-1px -1px 1px rgba(255,255,255,0.08));
  }

  .tagline-box {
    border: 1px solid rgba(193,127,58,0.35);
    border-radius: 2px;
    padding: 0.7rem 1rem;
    text-align: right;
    width: 180px;
  }

  .tagline-box p {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 0.8rem;
    line-height: 1.55;
    color: rgba(245,237,224,0.7);
  }

  .tagline-box strong {
    display: block;
    font-family: 'DM Mono', monospace;
    font-style: normal;
    font-weight: 500;
    font-size: 0.63rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--caramel);
    margin-top: 0.6rem;
  }

  /* ── GOLDEN STRIP ── */
  .strip {
    background: var(--caramel);
    padding: 0.3rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
  }

  .strip-item {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--espresso);
    font-weight: 500;
    opacity: 0.85;
  }

  .strip-sep {
    display: none;
  }

  /* ── BODY ── */
  .body { display: grid; grid-template-columns: 1fr 2fr; flex: 1; }
  .body-full { padding: 1.9rem 3.2rem 2.2rem; flex: 1; display: flex; flex-direction: column; gap: 1.45rem; }

  .sidebar {
    background: var(--cream);
    border-right: 1px solid var(--light-roast);
    padding: 0.95rem 1.7rem;
    display: flex;
    flex-direction: column;
    gap: 0.62rem;
  }

  .main { padding: 0.95rem 2.4rem 0.05rem 2rem; display: flex; flex-direction: column; gap: 0.45rem; }

  /* ── SECTION HEADINGS ── */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--caramel);
    margin-bottom: 0.45rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--light-roast);
  }

  /* ── COMPETENCES ── */
  .skill-group { margin-bottom: 0.6rem; }

  .skill-group-title {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.45rem;
  }

  .skill-tag {
    display: inline-block;
    background: white;
    border: 1px solid var(--light-roast);
    border-radius: 2px;
    padding: 0.18rem 0.48rem;
    font-size: 0.7rem;
    color: var(--text);
    margin: 0.16rem 0.16rem 0.16rem 0;
    line-height: 1.4;
  }

  .skill-tag.highlight {
    background: var(--espresso);
    color: var(--cream);
    border-color: var(--espresso);
  }

  /* ── LANGUAGES ── */
  .lang-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
  .lang-name { font-size: 0.76rem; font-weight: 500; color: var(--text); }
  .lang-level { font-family: 'DM Mono', monospace; font-size: 0.58rem; color: var(--muted); letter-spacing: 0.08em; }
  .lang-bar { width: 100%; height: 3px; background: var(--light-roast); border-radius: 2px; margin-top: 0.22rem; margin-bottom: 0.5rem; overflow: hidden; }
  .lang-fill { height: 100%; background: var(--caramel); border-radius: 2px; }

  /* ── QUOTE SIDEBAR ── */
  .sidebar-quote { border-left: 3px solid var(--caramel); padding: 0.55rem 0.75rem; background: rgba(193,127,58,0.06); }
  .sidebar-quote p { font-family: 'Playfair Display', serif; font-style: italic; font-size: 0.78rem; line-height: 1.5; color: var(--muted); }
  .sidebar-quote cite { display: block; font-style: normal; font-family: 'DM Mono', monospace; font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--caramel); margin-top: 0.45rem; }

  /* ── PROFILE ── */
  .profile-text { font-size: 0.84rem; line-height: 1.44; color: var(--text); }
  .profile-text strong { color: var(--espresso); font-weight: 500; }

  /* ── EXPERIENCE ── */
  .exp-item { display: grid; grid-template-columns: 82px 1fr; gap: 0 1.1rem; margin-bottom: 0.3rem; position: relative; }
  .exp-item:not(:last-child)::after {
    content: ''; position: absolute; left: 82px; bottom: -0.15rem;
    width: calc(100% - 82px); height: 1px; background: var(--light-roast); opacity: 0.6;
  }
  .exp-date { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--muted); letter-spacing: 0.06em; padding-top: 0.2rem; line-height: 1.35; text-align: right; }
  .exp-role { font-family: 'Playfair Display', serif; font-size: 0.94rem; font-weight: 700; color: var(--espresso); line-height: 1.2; }
  .exp-company { font-size: 0.71rem; font-weight: 500; color: var(--caramel); letter-spacing: 0.04em; margin: 0.18rem 0; }
  .exp-desc { font-size: 0.71rem; line-height: 1.3; color: var(--muted); margin-top: 0.22rem; }
  .exp-desc li { list-style: none; padding-left: 1em; position: relative; margin-bottom: 0.18rem; }
  .exp-desc li::before { content: '→'; position: absolute; left: 0; color: var(--caramel); font-size: 0.68rem; }

  /* ── ACHIEVEMENTS ── */
  .ach-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem; }
  .ach-card { background: var(--cream); border: 1px solid var(--light-roast); border-radius: 2px; padding: 0.48rem 0.65rem; position: relative; overflow: hidden; }
  .ach-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--caramel); }
  .ach-card.blue::before { background: var(--accent); }
  .ach-num { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 900; color: var(--espresso); line-height: 1; }
  .ach-desc { font-size: 0.65rem; color: var(--muted); margin-top: 0.18rem; line-height: 1.32; }

  /* ── REFERENCE BOX ── */
  .ref-box { background: var(--espresso); border-radius: 2px; padding: 0.65rem 1.1rem; position: relative; overflow: hidden; }
  .ref-box::after {
    content: '"'; position: absolute; right: 1rem; top: -0.5rem;
    font-family: 'Playfair Display', serif; font-size: 5rem; color: rgba(193,127,58,0.15); line-height: 1; pointer-events: none;
  }
  .ref-text { font-family: 'Playfair Display', serif; font-style: italic; font-size: 0.78rem; line-height: 1.48; color: rgba(245,237,224,0.85); position: relative; z-index: 1; }
  .ref-author { font-family: 'DM Mono', monospace; font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--caramel); margin-top: 0.5rem; position: relative; z-index: 1; }

  /* ── OFFER CARDS (page 2) ── */
  .lead-text { font-size: 0.88rem; line-height: 1.7; color: var(--text); max-width: 640px; }
  .offer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
  .offer-card { background: var(--cream); border: 1px solid var(--light-roast); border-radius: 2px; padding: 1.1rem 1.3rem; position: relative; overflow: hidden; }
  .offer-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--caramel); }
  .offer-card h3 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.02rem; color: var(--espresso); margin-bottom: 0.4rem; }
  .offer-card p { font-size: 0.79rem; color: var(--muted); line-height: 1.55; }

  .offer-meta {
    display: flex; flex-wrap: wrap; gap: 1.8rem;
    font-family: 'DM Mono', monospace; font-size: 0.66rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted);
    border-top: 1px solid var(--light-roast); border-bottom: 1px solid var(--light-roast);
    padding: 0.9rem 0;
  }
  .offer-meta strong { color: var(--espresso); }

  .cta-row { display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
  .cta-btn {
    display: inline-block; background: var(--espresso); color: var(--cream);
    font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.7rem 1.4rem; border-radius: 2px; text-decoration: none;
  }
  .cta-btn:hover { background: var(--caramel); color: var(--espresso); }
  .cta-link { font-family: 'DM Mono', monospace; font-size: 0.68rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); text-decoration: none; }
  .cta-link:hover { color: var(--caramel); }

  .testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
  .testi-card { background: var(--cream); border-left: 3px solid var(--caramel); padding: 1rem 1.2rem; }
  .testi-card p { font-family: 'Playfair Display', serif; font-style: italic; font-size: 0.82rem; line-height: 1.58; color: var(--text); }
  .testi-card cite { display: block; margin-top: 0.6rem; font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--caramel); font-style: normal; }

  /* ── FOOTER ── */
  .footer {
    background: var(--light-roast);
    padding: 0.6rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }
  .footer p { font-family: 'DM Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .footer .bean { font-size: 0.95rem; opacity: 0.5; }

  /* ── PRINT (declared last so it always wins the cascade) ── */
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body {
      background: #fff !important;
      padding: 0 !important;
      margin: 0 !important;
      display: block !important;
    }
    .no-print { display: none !important; }
    .page {
      box-shadow: none !important;
      border-radius: 0 !important;
      margin: 0 !important;
      page-break-after: always !important;
      break-after: page !important;
    }
    .page:last-of-type {
      page-break-after: auto !important;
      break-after: auto !important;
    }
  }

</style>
</head>
<body>

<button class="print-btn no-print" onclick="window.print()">⬇ Télécharger / Imprimer (2 pages A4)</button>

<!-- ══════════════ PAGE 1 — CV ══════════════ -->
<div class="page">

  <div class="header">
    <div class="header-left">
      <p class="kicker">Barista Café de Spécialité</p>
      <h1>Cris<br>Duarte</h1>
      <p class="title-role">Médiateur culturel du café brésilien</p>
      <div class="header-meta">
        <p class="meta-item"><span class="dot"></span>Chamalières (63400) · Clermont-Ferrand</p>
        <p class="meta-item"><span class="dot"></span><a href="mailto:cris@obaristech.com">cris@obaristech.com</a></p>
        <p class="meta-item"><span class="dot"></span>Directeur artistique — 2005–2018</p>
        <p class="meta-item"><span class="dot"></span>Auto-entrepreneur — 2012–2026</p>
        <p class="meta-item"><span class="dot"></span>Charpentier · Siegrist SAS — Juin–Août 2026</p>
      </div>
    </div>
    <div class="header-right">
      <img class="header-logo" src="data:image/png;base64,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" alt="O Baristech">
    </div>
  </div>

  <div class="strip">
    <span class="strip-item">Chemex · V60 · Espresso</span>
    <span class="strip-sep"></span>
    <span class="strip-item">Cupping</span>
    <span class="strip-sep"></span>
    <span class="strip-item">Ateliers & Formation</span>
    <span class="strip-sep"></span>
    <span class="strip-item">World of Coffee 2024 · 2025</span>
    <span class="strip-sep"></span>
    <span class="strip-item">Clermont Coffee Week</span>
  </div>

  <div class="body">

    <div class="sidebar">

      <div>
        <p class="section-label">Compétences Café</p>
        <div class="skill-group">
          <p class="skill-group-title">Filtre</p>
          <span class="skill-tag">V60</span>
          <span class="skill-tag">Chemex</span>
          <span class="skill-tag">Aeropress</span>
        </div>
        <div class="skill-group">
          <p class="skill-group-title">Espresso</p>
          <span class="skill-tag">Cappuccino</span>
          <span class="skill-tag">Latte art</span>
        </div>
        <div class="skill-group">
          <p class="skill-group-title">Connaissance Produit</p>
          <span class="skill-tag">Origines Brésil</span>
          <span class="skill-tag">Torréfaction</span>
          <span class="skill-tag">Profils sensoriels</span>
        </div>
        <div class="skill-group">
          <p class="skill-group-title">Service & Transmission</p>
          <span class="skill-tag">Animation d'ateliers</span>
          <span class="skill-tag">Cupping</span>
          <span class="skill-tag">Pédagogie</span>
          <span class="skill-tag">Dégustation guidée</span>
        </div>
      </div>

      <div>
        <p class="section-label">Langues</p>
        <div class="lang-row"><span class="lang-name">Portugais</span><span class="lang-level">Natif</span></div>
        <div class="lang-bar"><div class="lang-fill" style="width:100%"></div></div>
        <div class="lang-row"><span class="lang-name">Français</span><span class="lang-level">Courant</span></div>
        <div class="lang-bar"><div class="lang-fill" style="width:85%"></div></div>
        <div class="lang-row"><span class="lang-name">Espagnol</span><span class="lang-level">Courant</span></div>
        <div class="lang-bar"><div class="lang-fill" style="width:80%"></div></div>
        <div class="lang-row"><span class="lang-name">Anglais</span><span class="lang-level">Intermédiaire</span></div>
        <div class="lang-bar"><div class="lang-fill" style="width:55%"></div></div>
      </div>

      <div>
        <p class="section-label">Formation</p>
        <p style="font-size:0.76rem; font-weight:500; color:var(--text)">Techniques et analyses sensorielles du Barista</p>
        <p style="font-size:0.68rem; color:var(--muted); margin-bottom:0.75rem;">Polygone — Paris · juillet 2026</p>
        <p style="font-size:0.76rem; font-weight:500; color:var(--text)">Direction Artistique</p>
        <p style="font-size:0.68rem; color:var(--muted);">Agences de publicité — São Paulo (15 ans)</p>
      </div>

      <div class="sidebar-quote">
        <p>« Un grand merci à Cristiano, pour ses explications passionnantes et sa bonne humeur. »</p>
        <cite>Larissa Bertolo — Clermont-Ferrand</cite>
      </div>

    </div>

    <div class="main">

      <div>
        <p class="section-label">Profil</p>
        <p class="profile-text">
          Originaire de <strong>São Paulo, Brésil</strong>, installé à <strong>Clermont-Ferrand depuis janvier 2025</strong>. Après quinze ans de direction artistique dans des agences de publicité, je me consacre depuis 2019 au café de spécialité : ateliers de dégustation, méthodes douces (Chemex, V60), formation chez <strong>Polygone</strong>, école cofondée par Brice Robin, triple champion de France Barista.
          <br><br>
          Je préside l'association <strong>Clermont Coffee Week</strong> et anime, via <strong>O Baristech</strong>, des ateliers pour particuliers, entreprises et enfants — la technologie en support de l'expérience, jamais en substitut au geste du barista.
        </p>
      </div>

      <div>
        <p class="section-label">Expérience</p>

        <div class="exp-item">
          <div class="exp-date">2025<br>→ Présent</div>
          <div class="exp-content">
            <p class="exp-role">Président de l'association</p>
            <p class="exp-company">Clermont Coffee Week · Clermont-Ferrand</p>
            <ul class="exp-desc">
              <li>Organisation du premier festival dédié au café de spécialité à Clermont-Ferrand</li>
              <li>Programmation, partenariats locaux, coordination des intervenants</li>
              <li>Initiative portée dès l'arrivée à Clermont, au vu du potentiel de la scène café locale</li>
              <li>Collaboration avec Aurélien (Clinton Hill) et Cartel Cycle & Café</li>
            </ul>
          </div>
        </div>

        <div class="exp-item">
          <div class="exp-date">2026<br>→ Présent</div>
          <div class="exp-content">
            <p class="exp-role">Fondateur</p>
            <p class="exp-company">O Baristech · obaristech.com</p>
            <ul class="exp-desc">
              <li>Plateforme reliant producteurs brésiliens et consommateurs européens</li>
              <li>Ateliers de dégustation pour particuliers, entreprises et enfants</li>
            </ul>
          </div>
        </div>

      </div>

      <div>
        <p class="section-label">En chiffres</p>
        <div class="ach-grid">
          <div class="ach-card">
            <p class="ach-num">+7 ans</p>
            <p class="ach-desc">d'engagement dans le café de spécialité, depuis 2019</p>
          </div>
          <div class="ach-card blue">
            <p class="ach-num">2</p>
            <p class="ach-desc">World of Coffee (Copenhague 2024, Genève 2025)</p>
          </div>
          <div class="ach-card blue">
            <p class="ach-num">4</p>
            <p class="ach-desc">pays d'expérience café (Brésil, France, Danemark, Suisse)</p>
          </div>
          <div class="ach-card">
            <p class="ach-num">5</p>
            <p class="ach-desc">témoignages publics d'ateliers et dégustations</p>
          </div>
        </div>
      </div>

      <div>
        <p class="section-label">Référence client</p>
        <div class="ref-box">
          <p class="ref-text">« Déguster un café avec Cris est toujours un vrai plaisir. Passionné et généreux, il sait faire parler le café avec justesse et simplicité — l'un des plus équilibrés et élégants que j'aie dégustés. »</p>
          <p class="ref-author">Alexis Solovieff — Paris</p>
        </div>
      </div>

    </div>
  </div>

  <div class="footer">
    <p>Cristiano Chal Duarte · cris@obaristech.com · obaristech.com</p>
    <span class="bean">☕</span>
    <p>CV — Page 1 / 2</p>
  </div>

</div>

<!-- ══════════════ PAGE 2 — ATELIERS PRIVÉS ══════════════ -->
<div class="page">

  <div class="header">
    <div class="header-left">
      <p class="kicker">O Baristech · Ateliers Privés</p>
      <h1>Ateliers<br>Café</h1>
      <p class="title-role">Dégustation sur mesure · à domicile, en entreprise, en coffee shops</p>
      <div class="header-meta">
        <p class="meta-item"><span class="dot"></span>Clermont-Ferrand & région Auvergne-Rhône-Alpes</p>
        <p class="meta-item"><span class="dot"></span><a href="mailto:cris@obaristech.com">cris@obaristech.com</a></p>
        <p class="meta-item"><span class="dot"></span><a href="https://obaristech.com" target="_blank">obaristech.com</a></p>
      </div>
    </div>
    <div class="header-right">
      <div class="tagline-box">
        <p>« Le café est infiniment complexe. Bien préparé, il révèle une expérience surprenante dans la tasse. »</p>
        <strong>O Baristech</strong>
      </div>
    </div>
  </div>

  <div class="strip">
    <span class="strip-item">À domicile</span>
    <span class="strip-sep"></span>
    <span class="strip-item">En entreprise</span>
    <span class="strip-sep"></span>
    <span class="strip-item">En coffee shops</span>
    <span class="strip-sep"></span>
    <span class="strip-item">Atelier enfant</span>
    <span class="strip-sep"></span>
    <span class="strip-item">Chemex · V60 · 1h15</span>
  </div>

  <div class="body-full">

    <div>
      <p class="section-label">Un atelier, votre cadre</p>
      <p class="lead-text">Dégustation guidée, méthodes douces, matériel fourni. Formats identiques à ceux proposés sur O Baristech, adaptables au contexte professionnel ou personnel — sans jamais remplacer le geste du barista par la technologie.</p>
    </div>

    <div>
      <p class="section-label">Formats</p>
      <div class="offer-grid">
        <div class="offer-card">
          <h3>À domicile</h3>
          <p>Un moment privé, chez vous, pour vous et vos proches. Tout le matériel est apporté.</p>
        </div>
        <div class="offer-card">
          <h3>En entreprise</h3>
          <p>Format team building ou pause dégustation, adapté au nombre de participants.</p>
        </div>
        <div class="offer-card">
          <h3>En coffee shops</h3>
          <p>Café de spécialité dans un cadre choisi et sur mesure, hors les murs.</p>
        </div>
        <div class="offer-card">
          <h3>Atelier enfant</h3>
          <p>Approche sensorielle et créative — peinture au café, en famille.</p>
        </div>
      </div>

      <div class="offer-meta" style="margin-top:0.9rem;">
        <span><strong>Méthodes</strong> — Chemex / V60</span>
        <span><strong>Durée</strong> — 1h15</span>
        <span><strong>Groupe</strong> — 2 à 4 pers. (25 €/pers.) · au-delà, sur devis</span>
      </div>
    </div>

    <div class="cta-row">
      <a class="cta-btn" href="mailto:cris@obaristech.com">Demander une disponibilité</a>
      <a class="cta-link" href="https://app.obaristech.com/ateliers" target="_blank">app Baristech</a>
    </div>

    <div>
      <p class="section-label">Ils en parlent</p>
      <div class="testi-grid">
        <div class="testi-card">
          <p>« L'atelier café a été au-delà de mes attentes. J'y ai beaucoup appris sur les types de café, la torréfaction et les méthodes de préparation. »</p>
          <cite>Larissa Bertolo — Clermont-Ferrand</cite>
        </div>
        <div class="testi-card">
          <p>« Un atelier très convivial, accessible à tous. On repart avec de vraies connaissances et l'envie immédiate d'améliorer son café au quotidien. »</p>
          <cite>Frédéric Pelser — Paris</cite>
        </div>
      </div>
    </div>

  </div>

  <div class="footer">
    <p>Cristiano Chal Duarte · cris@obaristech.com · obaristech.com</p>
    <span class="bean">☕</span>
    <p>Ateliers — Page 2 / 2</p>
  </div>

</div>

</body>
</html>
`;
