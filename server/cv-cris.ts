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

  .header::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    border: 28px solid rgba(193,127,58,0.08);
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
    color: rgba(245,237,224,0.65);
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

  .meta-item a { color: rgba(245,237,224,0.65); text-decoration: none; }
  .meta-item a:hover { color: var(--caramel); }

  .header-right {
    position: relative;
    z-index: 1;
    align-self: center;
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
        <p class="meta-item"><span class="dot"></span><a href="https://obaristech.com" target="_blank">obaristech.com</a></p>
        <p class="meta-item"><span class="dot"></span>Brésilien · installé en France depuis 2018</p>
      </div>
    </div>
    <div class="header-right">
      <div class="tagline-box">
        <p>« Recréer le lien entre l'origine et la tasse. »</p>
        <strong>O Baristech</strong>
      </div>
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
      <a class="cta-link" href="https://obaristech.com" target="_blank">Voir tous les formats sur obaristech.com →</a>
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
