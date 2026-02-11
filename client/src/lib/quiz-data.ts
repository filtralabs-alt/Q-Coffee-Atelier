export interface QuizQuestion {
  question: { fr: string; pt: string };
  options: { fr: string; pt: string }[];
  correctIndex: number;
  explanation: { fr: string; pt: string };
}

export const quizQuestions: Record<string, QuizQuestion[]> = {
  basic: [
    {
      question: { fr: "Quel pays est le plus grand producteur de café au monde ?", pt: "Qual país é o maior produtor de café do mundo?" },
      options: [
        { fr: "Colombie", pt: "Colômbia" },
        { fr: "Brésil", pt: "Brasil" },
        { fr: "Éthiopie", pt: "Etiópia" },
        { fr: "Vietnam", pt: "Vietnã" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le Brésil est le plus grand producteur de café, représentant environ 35% de la production mondiale.", pt: "O Brasil é o maior produtor de café, representando cerca de 35% da produção mundial." }
    },
    {
      question: { fr: "Quelles sont les deux espèces de café les plus cultivées ?", pt: "Quais são as duas espécies de café mais cultivadas?" },
      options: [
        { fr: "Arabica et Robusta", pt: "Arábica e Robusta" },
        { fr: "Arabica et Liberica", pt: "Arábica e Libérica" },
        { fr: "Robusta et Excelsa", pt: "Robusta e Excelsa" },
        { fr: "Liberica et Excelsa", pt: "Libérica e Excelsa" }
      ],
      correctIndex: 0,
      explanation: { fr: "L'Arabica (60-70%) et le Robusta (30-40%) dominent la production mondiale de café.", pt: "O Arábica (60-70%) e o Robusta (30-40%) dominam a produção mundial de café." }
    },
    {
      question: { fr: "Quelle est la température idéale de l'eau pour un café filtre ?", pt: "Qual é a temperatura ideal da água para um café filtrado?" },
      options: [
        { fr: "70-80°C", pt: "70-80°C" },
        { fr: "85-90°C", pt: "85-90°C" },
        { fr: "90-96°C", pt: "90-96°C" },
        { fr: "100°C", pt: "100°C" }
      ],
      correctIndex: 2,
      explanation: { fr: "La température idéale se situe entre 90 et 96°C pour extraire les arômes sans brûler le café.", pt: "A temperatura ideal fica entre 90 e 96°C para extrair os aromas sem queimar o café." }
    },
    {
      question: { fr: "Que signifie 'café de spécialité' ?", pt: "O que significa 'café especial'?" },
      options: [
        { fr: "Un café très cher", pt: "Um café muito caro" },
        { fr: "Un café noté 80+ par un Q Grader", pt: "Um café com nota 80+ por um Q Grader" },
        { fr: "Un café bio", pt: "Um café orgânico" },
        { fr: "Un café en capsules", pt: "Um café em cápsulas" }
      ],
      correctIndex: 1,
      explanation: { fr: "Un café de spécialité est évalué à 80 points ou plus sur 100 par un dégustateur certifié (Q Grader).", pt: "Um café especial é avaliado com 80 pontos ou mais em 100 por um degustador certificado (Q Grader)." }
    },
    {
      question: { fr: "Quelle est la 'ceinture du café' ?", pt: "O que é o 'cinturão do café'?" },
      options: [
        { fr: "Un accessoire de barista", pt: "Um acessório de barista" },
        { fr: "La zone tropicale où pousse le café", pt: "A zona tropical onde cresce o café" },
        { fr: "Une marque de café", pt: "Uma marca de café" },
        { fr: "Un type de torréfaction", pt: "Um tipo de torra" }
      ],
      correctIndex: 1,
      explanation: { fr: "La ceinture du café se situe entre les tropiques du Cancer et du Capricorne, où les conditions sont idéales.", pt: "O cinturão do café fica entre os trópicos de Câncer e Capricórnio, onde as condições são ideais." }
    },
    {
      question: { fr: "Que contient un grain de café vert ?", pt: "O que contém um grão de café verde?" },
      options: [
        { fr: "De la caféine uniquement", pt: "Apenas cafeína" },
        { fr: "Plus de 1000 composés aromatiques", pt: "Mais de 1000 compostos aromáticos" },
        { fr: "Seulement de l'eau", pt: "Apenas água" },
        { fr: "Du sucre pur", pt: "Açúcar puro" }
      ],
      correctIndex: 1,
      explanation: { fr: "Un grain de café contient plus de 1000 composés qui se développent pendant la torréfaction.", pt: "Um grão de café contém mais de 1000 compostos que se desenvolvem durante a torra." }
    },
    {
      question: { fr: "Quel est le ratio café/eau standard pour un filtre ?", pt: "Qual é a proporção café/água padrão para um filtrado?" },
      options: [
        { fr: "1:5", pt: "1:5" },
        { fr: "1:10", pt: "1:10" },
        { fr: "1:15 à 1:17", pt: "1:15 a 1:17" },
        { fr: "1:25", pt: "1:25" }
      ],
      correctIndex: 2,
      explanation: { fr: "Le ratio standard est de 1g de café pour 15 à 17g d'eau, soit environ 60g/L.", pt: "A proporção padrão é de 1g de café para 15 a 17g de água, ou seja, cerca de 60g/L." }
    },
    {
      question: { fr: "Que signifie un café 'naturel' ?", pt: "O que significa um café 'natural'?" },
      options: [
        { fr: "Sans pesticides", pt: "Sem pesticidas" },
        { fr: "Séché avec la cerise entière", pt: "Seco com a cereja inteira" },
        { fr: "Non torréfié", pt: "Não torrado" },
        { fr: "Cultivé en forêt", pt: "Cultivado na floresta" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le procédé naturel (ou sec) consiste à sécher le grain avec la cerise entière, développant des saveurs fruitées.", pt: "O processo natural (ou seco) consiste em secar o grão com a cereja inteira, desenvolvendo sabores frutados." }
    },
    {
      question: { fr: "Combien de temps se conserve un café torréfié en grains ?", pt: "Quanto tempo se conserva um café torrado em grãos?" },
      options: [
        { fr: "1 semaine", pt: "1 semana" },
        { fr: "2 à 4 semaines (optimal)", pt: "2 a 4 semanas (ideal)" },
        { fr: "6 mois", pt: "6 meses" },
        { fr: "1 an", pt: "1 ano" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le café torréfié est à son meilleur entre 2 et 4 semaines après la torréfaction.", pt: "O café torrado está no seu melhor entre 2 e 4 semanas após a torra." }
    },
    {
      question: { fr: "Qu'est-ce qu'un 'cupping' ?", pt: "O que é um 'cupping'?" },
      options: [
        { fr: "Une méthode de torréfaction", pt: "Um método de torra" },
        { fr: "Un protocole de dégustation professionnelle", pt: "Um protocolo de degustação profissional" },
        { fr: "Un type de moulin", pt: "Um tipo de moedor" },
        { fr: "Une tasse spéciale", pt: "Uma xícara especial" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le cupping est la méthode standardisée de dégustation utilisée par les professionnels du café.", pt: "O cupping é o método padronizado de degustação usado por profissionais do café." }
    }
  ],
  intermediate: [
    {
      question: { fr: "Quelle est la différence principale entre Arabica et Robusta en caféine ?", pt: "Qual é a diferença principal entre Arábica e Robusta em cafeína?" },
      options: [
        { fr: "L'Arabica a plus de caféine", pt: "O Arábica tem mais cafeína" },
        { fr: "Le Robusta a environ 2x plus de caféine", pt: "O Robusta tem cerca de 2x mais cafeína" },
        { fr: "Ils ont la même quantité", pt: "Eles têm a mesma quantidade" },
        { fr: "Le Robusta n'a pas de caféine", pt: "O Robusta não tem cafeína" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le Robusta contient environ 2,7% de caféine contre 1,5% pour l'Arabica.", pt: "O Robusta contém cerca de 2,7% de cafeína contra 1,5% do Arábica." }
    },
    {
      question: { fr: "Qu'est-ce que la réaction de Maillard dans le café ?", pt: "O que é a reação de Maillard no café?" },
      options: [
        { fr: "La fermentation des grains", pt: "A fermentação dos grãos" },
        { fr: "Le brunissement lors de la torréfaction", pt: "O escurecimento durante a torra" },
        { fr: "L'oxydation du café moulu", pt: "A oxidação do café moído" },
        { fr: "La cristallisation du sucre", pt: "A cristalização do açúcar" }
      ],
      correctIndex: 1,
      explanation: { fr: "La réaction de Maillard est responsable du brunissement et du développement de centaines d'arômes pendant la torréfaction.", pt: "A reação de Maillard é responsável pelo escurecimento e desenvolvimento de centenas de aromas durante a torra." }
    },
    {
      question: { fr: "Quelle mouture est recommandée pour une V60 ?", pt: "Qual moagem é recomendada para uma V60?" },
      options: [
        { fr: "Très fine (type espresso)", pt: "Muito fina (tipo espresso)" },
        { fr: "Moyenne-fine (type sable)", pt: "Média-fina (tipo areia)" },
        { fr: "Grosse (type sel de mer)", pt: "Grossa (tipo sal marinho)" },
        { fr: "En grains entiers", pt: "Em grãos inteiros" }
      ],
      correctIndex: 1,
      explanation: { fr: "La V60 nécessite une mouture moyenne-fine, similaire à la texture du sable, pour un temps d'extraction d'environ 2:30-3:30.", pt: "A V60 necessita de uma moagem média-fina, similar à textura da areia, para um tempo de extração de cerca de 2:30-3:30." }
    },
    {
      question: { fr: "Qu'est-ce que le 'first crack' pendant la torréfaction ?", pt: "O que é o 'first crack' durante a torra?" },
      options: [
        { fr: "Le moment où le grain se casse", pt: "O momento em que o grão se quebra" },
        { fr: "Le craquement dû à l'expansion des grains par la chaleur", pt: "O estalo devido à expansão dos grãos pelo calor" },
        { fr: "Un défaut de torréfaction", pt: "Um defeito de torra" },
        { fr: "Le premier grain qui tombe du torréfacteur", pt: "O primeiro grão que cai do torrador" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le first crack se produit vers 196°C quand l'eau dans le grain se transforme en vapeur et provoque un craquement audible.", pt: "O first crack ocorre por volta de 196°C quando a água no grão se transforma em vapor e provoca um estalo audível." }
    },
    {
      question: { fr: "Le Minas Gerais au Brésil est connu pour quel type de café ?", pt: "Minas Gerais no Brasil é conhecido por qual tipo de café?" },
      options: [
        { fr: "Robusta intense", pt: "Robusta intenso" },
        { fr: "Arabica doux et chocolaté", pt: "Arábica suave e achocolatado" },
        { fr: "Café décaféiné", pt: "Café descafeinado" },
        { fr: "Café instantané", pt: "Café instantâneo" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le Minas Gerais produit principalement de l'Arabica aux notes de chocolat, noix et caramel.", pt: "Minas Gerais produz principalmente Arábica com notas de chocolate, nozes e caramelo." }
    },
    {
      question: { fr: "Quelle est la fonction du 'bloom' dans l'extraction ?", pt: "Qual é a função do 'bloom' na extração?" },
      options: [
        { fr: "Refroidir le café", pt: "Resfriar o café" },
        { fr: "Libérer le CO2 du café frais", pt: "Liberar o CO2 do café fresco" },
        { fr: "Ajouter de la saveur", pt: "Adicionar sabor" },
        { fr: "Nettoyer le filtre", pt: "Limpar o filtro" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le bloom permet de libérer le CO2 emprisonné dans le café fraîchement torréfié pour une extraction plus uniforme.", pt: "O bloom permite liberar o CO2 preso no café recém-torrado para uma extração mais uniforme." }
    },
    {
      question: { fr: "Qu'est-ce que le TDS (Total Dissolved Solids) ?", pt: "O que é TDS (Total Dissolved Solids)?" },
      options: [
        { fr: "La température de service", pt: "A temperatura de serviço" },
        { fr: "La concentration de solubles extraits dans la tasse", pt: "A concentração de solúveis extraídos na xícara" },
        { fr: "Le poids du café", pt: "O peso do café" },
        { fr: "Le type de moulin", pt: "O tipo de moedor" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le TDS mesure la concentration de café dissous dans l'eau. Un filtre idéal se situe entre 1,15% et 1,45%.", pt: "O TDS mede a concentração de café dissolvido na água. Um filtrado ideal fica entre 1,15% e 1,45%." }
    },
    {
      question: { fr: "Pourquoi le papier filtre Chemex est-il plus épais ?", pt: "Por que o filtro de papel Chemex é mais grosso?" },
      options: [
        { fr: "Pour supporter plus de poids", pt: "Para suportar mais peso" },
        { fr: "Pour retenir plus d'huiles et donner une tasse plus propre", pt: "Para reter mais óleos e dar uma xícara mais limpa" },
        { fr: "C'est moins cher à produire", pt: "É mais barato de produzir" },
        { fr: "Pour accélérer l'extraction", pt: "Para acelerar a extração" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le filtre épais de la Chemex retient davantage d'huiles et de fines particules, produisant un café plus clair et propre.", pt: "O filtro grosso da Chemex retém mais óleos e partículas finas, produzindo um café mais claro e limpo." }
    },
    {
      question: { fr: "Qu'est-ce qu'un 'Q Grader' ?", pt: "O que é um 'Q Grader'?" },
      options: [
        { fr: "Un type de moulin", pt: "Um tipo de moedor" },
        { fr: "Un dégustateur certifié par le CQI", pt: "Um degustador certificado pelo CQI" },
        { fr: "Un grade de café vert", pt: "Um grau de café verde" },
        { fr: "Un torréfacteur professionnel", pt: "Um torrador profissional" }
      ],
      correctIndex: 1,
      explanation: { fr: "Un Q Grader est un dégustateur certifié par le Coffee Quality Institute, habilité à noter les cafés selon un protocole standardisé.", pt: "Um Q Grader é um degustador certificado pelo Coffee Quality Institute, habilitado a avaliar cafés segundo um protocolo padronizado." }
    },
    {
      question: { fr: "Quelle altitude favorise un café Arabica de qualité ?", pt: "Qual altitude favorece um café Arábica de qualidade?" },
      options: [
        { fr: "0 à 200m", pt: "0 a 200m" },
        { fr: "200 à 500m", pt: "200 a 500m" },
        { fr: "800 à 2000m", pt: "800 a 2000m" },
        { fr: "Plus de 3000m", pt: "Mais de 3000m" }
      ],
      correctIndex: 2,
      explanation: { fr: "L'altitude idéale pour l'Arabica se situe entre 800 et 2000m. L'altitude ralentit la maturation et concentre les sucres.", pt: "A altitude ideal para o Arábica fica entre 800 e 2000m. A altitude retarda a maturação e concentra os açúcares." }
    }
  ],
  advanced: [
    {
      question: { fr: "Quel composé est responsable de l'amertume principale du café ?", pt: "Qual composto é responsável pelo amargor principal do café?" },
      options: [
        { fr: "La caféine uniquement", pt: "Apenas a cafeína" },
        { fr: "Les acides chlorogéniques et leurs dérivés", pt: "Os ácidos clorogênicos e seus derivados" },
        { fr: "Le sucre caramélisé", pt: "O açúcar caramelizado" },
        { fr: "Les protéines", pt: "As proteínas" }
      ],
      correctIndex: 1,
      explanation: { fr: "Les acides chlorogéniques et leurs produits de dégradation (quinides) sont les principaux responsables de l'amertume, plus que la caféine.", pt: "Os ácidos clorogênicos e seus produtos de degradação (quinídeos) são os principais responsáveis pelo amargor, mais que a cafeína." }
    },
    {
      question: { fr: "Qu'est-ce que le procédé 'anaérobique' en traitement du café ?", pt: "O que é o processo 'anaeróbico' no tratamento do café?" },
      options: [
        { fr: "Séchage au soleil", pt: "Secagem ao sol" },
        { fr: "Fermentation en environnement sans oxygène", pt: "Fermentação em ambiente sem oxigênio" },
        { fr: "Lavage à l'eau froide", pt: "Lavagem com água fria" },
        { fr: "Torréfaction lente", pt: "Torra lenta" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le procédé anaérobique implique une fermentation contrôlée en l'absence d'oxygène, créant des profils aromatiques complexes et uniques.", pt: "O processo anaeróbico envolve uma fermentação controlada na ausência de oxigênio, criando perfis aromáticos complexos e únicos." }
    },
    {
      question: { fr: "Quel est le rôle du 'degassing' après la torréfaction ?", pt: "Qual é o papel do 'degassing' após a torra?" },
      options: [
        { fr: "Refroidir les grains", pt: "Resfriar os grãos" },
        { fr: "Permettre au CO2 de s'échapper pour une extraction équilibrée", pt: "Permitir que o CO2 escape para uma extração equilibrada" },
        { fr: "Augmenter la caféine", pt: "Aumentar a cafeína" },
        { fr: "Durcir les grains", pt: "Endurecer os grãos" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le degassing (12-72h minimum) permet au CO2 de s'échapper, évitant une extraction turbulente et irrégulière.", pt: "O degassing (12-72h mínimo) permite que o CO2 escape, evitando uma extração turbulenta e irregular." }
    },
    {
      question: { fr: "Dans la roue des saveurs SCA, quelle catégorie n'existe pas ?", pt: "Na roda de sabores SCA, qual categoria não existe?" },
      options: [
        { fr: "Fruité", pt: "Frutado" },
        { fr: "Floral", pt: "Floral" },
        { fr: "Umami", pt: "Umami" },
        { fr: "Épicé", pt: "Condimentado" }
      ],
      correctIndex: 2,
      explanation: { fr: "La roue des saveurs SCA inclut fruité, floral, sucré, épicé, végétal, torréfié, etc., mais pas 'umami' comme catégorie.", pt: "A roda de sabores SCA inclui frutado, floral, doce, condimentado, vegetal, torrado, etc., mas não 'umami' como categoria." }
    },
    {
      question: { fr: "Qu'est-ce que le 'channeling' dans l'extraction espresso ?", pt: "O que é o 'channeling' na extração espresso?" },
      options: [
        { fr: "Le flux idéal de l'eau", pt: "O fluxo ideal da água" },
        { fr: "Des passages d'eau préférentiels à travers le puck", pt: "Passagens preferenciais de água através do puck" },
        { fr: "Le nettoyage de la machine", pt: "A limpeza da máquina" },
        { fr: "Le chauffage de la tasse", pt: "O aquecimento da xícara" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le channeling crée des chemins d'eau inégaux dans le puck de café, causant une extraction non-uniforme (zones sur et sous-extraites).", pt: "O channeling cria caminhos desiguais de água no puck de café, causando uma extração não-uniforme (zonas sobre e sub-extraídas)." }
    },
    {
      question: { fr: "Quelle variété de café est connue pour sa résistance à la rouille ?", pt: "Qual variedade de café é conhecida por sua resistência à ferrugem?" },
      options: [
        { fr: "Bourbon", pt: "Bourbon" },
        { fr: "Typica", pt: "Typica" },
        { fr: "Catimor", pt: "Catimor" },
        { fr: "Gesha", pt: "Gesha" }
      ],
      correctIndex: 2,
      explanation: { fr: "Le Catimor, croisement entre Caturra et Timor Hybrid, a été développé pour sa résistance à Hemileia vastatrix (rouille du café).", pt: "O Catimor, cruzamento entre Caturra e Timor Hybrid, foi desenvolvido por sua resistência à Hemileia vastatrix (ferrugem do café)." }
    },
    {
      question: { fr: "Que mesure le 'rendement d'extraction' idéal ?", pt: "O que mede o 'rendimento de extração' ideal?" },
      options: [
        { fr: "5-10% des solubles", pt: "5-10% dos solúveis" },
        { fr: "18-22% des solubles", pt: "18-22% dos solúveis" },
        { fr: "30-35% des solubles", pt: "30-35% dos solúveis" },
        { fr: "50% des solubles", pt: "50% dos solúveis" }
      ],
      correctIndex: 1,
      explanation: { fr: "L'extraction idéale selon la SCA se situe entre 18 et 22%. En dessous : sous-extraction (acide), au-dessus : sur-extraction (amer).", pt: "A extração ideal segundo a SCA fica entre 18 e 22%. Abaixo: sub-extração (ácido), acima: sobre-extração (amargo)." }
    },
    {
      question: { fr: "Qu'est-ce que la variété 'Gesha/Geisha' et pourquoi est-elle spéciale ?", pt: "O que é a variedade 'Gesha/Geisha' e por que ela é especial?" },
      options: [
        { fr: "Un Robusta rare du Japon", pt: "Um Robusta raro do Japão" },
        { fr: "Un Arabica éthiopien aux arômes floraux et prix élevés", pt: "Um Arábica etíope com aromas florais e preços elevados" },
        { fr: "Un hybride synthétique", pt: "Um híbrido sintético" },
        { fr: "Un café décaféiné naturellement", pt: "Um café descafeinado naturalmente" }
      ],
      correctIndex: 1,
      explanation: { fr: "La Gesha, originaire d'Éthiopie, est célèbre pour ses notes florales intenses (jasmin, bergamote) et atteint des prix records aux enchères.", pt: "A Gesha, originária da Etiópia, é famosa por suas notas florais intensas (jasmim, bergamota) e atinge preços recordes em leilões." }
    },
    {
      question: { fr: "Comment l'altitude affecte-t-elle la densité du grain ?", pt: "Como a altitude afeta a densidade do grão?" },
      options: [
        { fr: "Aucun effet", pt: "Nenhum efeito" },
        { fr: "Plus d'altitude = grains plus denses et plus complexes", pt: "Mais altitude = grãos mais densos e mais complexos" },
        { fr: "Plus d'altitude = grains plus légers", pt: "Mais altitude = grãos mais leves" },
        { fr: "L'altitude réduit la caféine", pt: "A altitude reduz a cafeína" }
      ],
      correctIndex: 1,
      explanation: { fr: "L'altitude élevée ralentit la maturation, permettant aux sucres de se concentrer et au grain de devenir plus dense et complexe.", pt: "A altitude elevada retarda a maturação, permitindo que os açúcares se concentrem e o grão se torne mais denso e complexo." }
    },
    {
      question: { fr: "Quel est le 'Protocole SCA' de cupping ?", pt: "Qual é o 'Protocolo SCA' de cupping?" },
      options: [
        { fr: "Déguster en ajoutant du lait", pt: "Degustar adicionando leite" },
        { fr: "8,25g café / 150ml eau à 93°C, infusion 4 min", pt: "8,25g café / 150ml água a 93°C, infusão 4 min" },
        { fr: "Espresso double avec mousse", pt: "Espresso duplo com espuma" },
        { fr: "Cold brew pendant 12h", pt: "Cold brew durante 12h" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le protocole SCA standardisé utilise 8,25g de café moulu grossier pour 150ml d'eau à 93°C, infusé pendant 4 minutes.", pt: "O protocolo SCA padronizado usa 8,25g de café moído grosso para 150ml de água a 93°C, infundido por 4 minutos." }
    }
  ]
};
