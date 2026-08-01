export interface QuizQuestion {
  question: { fr: string; pt: string };
  options: { fr: string; pt: string }[];
  correctIndex: number;
  explanation: { fr: string; pt: string };
}

export const quizQuestions: Record<string, QuizQuestion[]> = {
  basic: [
    {
      question: { fr: "D'où vient le mot 'café' ?", pt: "De onde vem a palavra 'café'?" },
      options: [
        { fr: "De la région de Kaffa, en Éthiopie", pt: "Da região de Kaffa, na Etiópia" },
        { fr: "D'un mot français ancien", pt: "De uma palavra francesa antiga" },
        { fr: "Du nom d'un roi brésilien", pt: "Do nome de um rei brasileiro" },
        { fr: "D'une marque du XIXe siècle", pt: "De uma marca do século XIX" }
      ],
      correctIndex: 0,
      explanation: { fr: "Le mot vient de 'Kahwa' puis 'Kaffa', la région d'Éthiopie où le café aurait été découvert.", pt: "A palavra vem de 'Kahwa' e depois 'Kaffa', a região da Etiópia onde o café teria sido descoberto." }
    },
    {
      question: { fr: "Quelle légende raconte la découverte du café ?", pt: "Qual lenda conta a descoberta do café?" },
      options: [
        { fr: "Un marin perdu en mer", pt: "Um marinheiro perdido no mar" },
        { fr: "Le berger Kaldi et ses chèvres trop excitées", pt: "O pastor Kaldi e suas cabras agitadas demais" },
        { fr: "Un moine qui rêvait de grains rouges", pt: "Um monge que sonhava com grãos vermelhos" },
        { fr: "Un empereur chinois", pt: "Um imperador chinês" }
      ],
      correctIndex: 1,
      explanation: { fr: "Selon la légende, vers 850, le berger Kaldi remarqua que ses chèvres devenaient très excitées après avoir mangé des baies de caféier.", pt: "Segundo a lenda, por volta de 850, o pastor Kaldi notou que suas cabras ficavam muito agitadas depois de comer bagas de cafeeiro." }
    },
    {
      question: { fr: "Quel pays est le plus grand producteur de café au monde ?", pt: "Qual país é o maior produtor de café do mundo?" },
      options: [
        { fr: "Colombie", pt: "Colômbia" },
        { fr: "Brésil", pt: "Brasil" },
        { fr: "Éthiopie", pt: "Etiópia" },
        { fr: "Vietnam", pt: "Vietnã" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le Brésil est le plus grand producteur de café, représentant environ 39% de la production mondiale.", pt: "O Brasil é o maior produtor de café, representando cerca de 39% da produção mundial." }
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
      explanation: { fr: "Sur 128 espèces identifiées, l'Arabica et le Robusta dominent largement la production mondiale de café.", pt: "Das 128 espécies identificadas, o Arábica e o Robusta dominam amplamente a produção mundial de café." }
    },
    {
      question: { fr: "Qu'est-ce que la 'ceinture du café' ?", pt: "O que é o 'cinturão do café'?" },
      options: [
        { fr: "Un accessoire de barista", pt: "Um acessório de barista" },
        { fr: "La zone tropicale où pousse le café", pt: "A zona tropical onde cresce o café" },
        { fr: "Une marque de café", pt: "Uma marca de café" },
        { fr: "Un type de torréfaction", pt: "Um tipo de torra" }
      ],
      correctIndex: 1,
      explanation: { fr: "La ceinture du café se situe dans la zone intertropicale et équatoriale, entre les tropiques du Cancer et du Capricorne.", pt: "O cinturão do café fica na zona intertropical e equatorial, entre os trópicos de Câncer e Capricórnio." }
    },
    {
      question: { fr: "Combien de temps faut-il à un caféier pour donner sa première récolte ?", pt: "Quanto tempo um cafeeiro leva para dar sua primeira colheita?" },
      options: [
        { fr: "Quelques semaines", pt: "Algumas semanas" },
        { fr: "Environ 1 an", pt: "Cerca de 1 ano" },
        { fr: "Environ 3 ans", pt: "Cerca de 3 anos" },
        { fr: "Plus de 10 ans", pt: "Mais de 10 anos" }
      ],
      correctIndex: 2,
      explanation: { fr: "Après la nurserie, il faut environ 3 ans avant la première production, puis 5 ans pour atteindre la pleine production.", pt: "Depois da muda, leva cerca de 3 anos até a primeira produção, e mais 5 anos para atingir a produção plena." }
    },
    {
      question: { fr: "Que signifie 'café de spécialité' ?", pt: "O que significa 'café especial'?" },
      options: [
        { fr: "Un café très cher", pt: "Um café muito caro" },
        { fr: "Un café noté 80+ à la dégustation", pt: "Um café com nota 80+ na degustação" },
        { fr: "Un café bio", pt: "Um café orgânico" },
        { fr: "Un café en capsules", pt: "Um café em cápsulas" }
      ],
      correctIndex: 1,
      explanation: { fr: "Un café de spécialité ne contient pas de défauts primaires, au maximum 5 défauts secondaires, et obtient au moins 80/100 à la dégustation.", pt: "Um café especial não tem defeitos primários, no máximo 5 defeitos secundários, e obtém pelo menos 80/100 na degustação." }
    },
    {
      question: { fr: "Quelles sont les saveurs primaires que la langue perçoit ?", pt: "Quais são os sabores primários que a língua percebe?" },
      options: [
        { fr: "Sucré, amer, acide, salé, umami", pt: "Doce, amargo, ácido, salgado, umami" },
        { fr: "Sucré et amer uniquement", pt: "Apenas doce e amargo" },
        { fr: "Fruité, floral, épicé", pt: "Frutado, floral, condimentado" },
        { fr: "Chaud et froid", pt: "Quente e frio" }
      ],
      correctIndex: 0,
      explanation: { fr: "Les 5 saveurs primaires (sucré, amer, acide, salé, umami) forment la base de tout équilibre gustatif, y compris dans le café.", pt: "Os 5 sabores primários (doce, amargo, ácido, salgado, umami) formam a base de todo equilíbrio de sabor, inclusive no café." }
    },
    {
      question: { fr: "Quelle est la principale différence entre un café filtre et un espresso ?", pt: "Qual é a principal diferença entre um café filtrado e um espresso?" },
      options: [
        { fr: "Le filtre utilise plus de café que l'espresso", pt: "O filtrado usa mais café que o espresso" },
        { fr: "L'espresso est extrait par pression, le filtre par gravité", pt: "O espresso é extraído por pressão, o filtrado por gravidade" },
        { fr: "Il n'y a aucune différence", pt: "Não há nenhuma diferença" },
        { fr: "Le filtre est toujours plus fort", pt: "O filtrado é sempre mais forte" }
      ],
      correctIndex: 1,
      explanation: { fr: "L'espresso utilise la pression de la machine pour extraire rapidement, alors que les méthodes douces laissent l'eau traverser la mouture par gravité ou immersion.", pt: "O espresso usa a pressão da máquina para extrair rapidamente, enquanto os métodos suaves deixam a água passar pela moagem por gravidade ou imersão." }
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
      explanation: { fr: "Le cupping est la méthode standardisée de dégustation utilisée par les professionnels pour évaluer et noter un café.", pt: "O cupping é o método padronizado de degustação usado por profissionais para avaliar e pontuar um café." }
    }
  ],
  intermediate: [
    {
      question: { fr: "Que signifie un café 'naturel' ?", pt: "O que significa um café 'natural'?" },
      options: [
        { fr: "Sans pesticides", pt: "Sem pesticidas" },
        { fr: "Séché avec la cerise entière", pt: "Seco com a cereja inteira" },
        { fr: "Non torréfié", pt: "Não torrado" },
        { fr: "Cultivé en forêt", pt: "Cultivado na floresta" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le procédé naturel consiste à sécher le grain avec la cerise entière, développant des saveurs fruitées et sucrées.", pt: "O processo natural consiste em secar o grão com a cereja inteira, desenvolvendo sabores frutados e adocicados." }
    },
    {
      question: { fr: "En quoi consiste le procédé 'lavé' ?", pt: "Em que consiste o processo 'lavado'?" },
      options: [
        { fr: "On rince simplement les grains à l'eau claire", pt: "Apenas enxaguar os grãos em água limpa" },
        { fr: "On dépulpe puis on fermente le grain dans l'eau avant séchage", pt: "Despolpar e depois fermentar o grão na água antes da secagem" },
        { fr: "On fait bouillir la cerise entière", pt: "Ferver a cereja inteira" },
        { fr: "On laisse sécher la cerise sans la toucher", pt: "Deixar a cereja secar sem tocar" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le procédé lavé dépulpe le grain puis le fait fermenter dans des bacs d'eau pour retirer le mucilage avant le séchage, donnant une tasse plus propre et acidulée.", pt: "O processo lavado despolpa o grão e depois o fermenta em tanques de água para remover a mucilagem antes da secagem, resultando em uma xícara mais limpa e ácida." }
    },
    {
      question: { fr: "Qu'est-ce que le 'honey process' ?", pt: "O que é o 'honey process'?" },
      options: [
        { fr: "On ajoute du miel au café pendant le séchage", pt: "Adiciona-se mel ao café durante a secagem" },
        { fr: "On sèche le grain avec une partie du mucilage encore présente", pt: "Seca-se o grão com parte da mucilagem ainda presente" },
        { fr: "Une méthode réservée au décaféiné", pt: "Um método reservado para o descafeinado" },
        { fr: "Un procédé de torréfaction lente", pt: "Um processo de torra lenta" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le honey process dépulpe le grain mais laisse une partie du mucilage collant (le 'miel') pendant le séchage, entre le lavé et le naturel en termes de profil.", pt: "O honey process despolpa o grão mas deixa parte da mucilagem grudenta (o 'mel') durante a secagem, ficando entre o lavado e o natural em termos de perfil." }
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
      explanation: { fr: "La réaction de Maillard est responsable du brunissement et du développement de centaines d'arômes pendant la torréfaction.", pt: "A reação de Maillard é responsável pelo escurecimento e pelo desenvolvimento de centenas de aromas durante a torra." }
    },
    {
      question: { fr: "Que mesure la 'dureté totale' (total hardness) de l'eau ?", pt: "O que mede a 'dureza total' (total hardness) da água?" },
      options: [
        { fr: "Le pH uniquement", pt: "Apenas o pH" },
        { fr: "La teneur en calcium et magnésium", pt: "O teor de cálcio e magnésio" },
        { fr: "La température de l'eau", pt: "A temperatura da água" },
        { fr: "La quantité de chlore", pt: "A quantidade de cloro" }
      ],
      correctIndex: 1,
      explanation: { fr: "La dureté totale mesure la concentration de calcium (Ca) et magnésium (Mg), des minéraux qui influencent directement l'extraction.", pt: "A dureza total mede a concentração de cálcio (Ca) e magnésio (Mg), minerais que influenciam diretamente a extração." }
    },
    {
      question: { fr: "Quel est le point commun entre toutes les méthodes d'immersion (French press, Clever) ?", pt: "Qual é o ponto em comum entre todos os métodos de imersão (French press, Clever)?" },
      options: [
        { fr: "Elles nécessitent une mouture très fine", pt: "Elas necessitam de uma moagem muito fina" },
        { fr: "Elles forment une croûte en surface pendant l'infusion", pt: "Elas formam uma crosta na superfície durante a infusão" },
        { fr: "Elles n'utilisent jamais de filtre", pt: "Elas nunca usam filtro" },
        { fr: "Elles sont plus précises que la filtration", pt: "Elas são mais precisas que a filtração" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le principe de base de l'immersion est la saturation de la mouture en eau (osmose), ce qui forme systématiquement une croûte en surface.", pt: "O princípio básico da imersão é a saturação da moagem em água (osmose), o que forma sistematicamente uma crosta na superfície." }
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
      explanation: { fr: "Le ratio standard se situe autour de 1g de café pour 15 à 17g d'eau. En dessous, on sur-extrait ; au-dessus, on sous-extrait.", pt: "A proporção padrão fica em torno de 1g de café para 15 a 17g de água. Abaixo disso, sobre-extrai-se; acima, sub-extrai-se." }
    },
    {
      question: { fr: "Quelle est la différence entre l'arôme et la flaveur ?", pt: "Qual é a diferença entre aroma e flaveur?" },
      options: [
        { fr: "Ce sont des synonymes", pt: "São sinônimos" },
        { fr: "L'arôme est une olfaction directe par le nez, la flaveur une rétro-olfaction en bouche", pt: "O aroma é uma olfação direta pelo nariz, a flaveur uma retro-olfação na boca" },
        { fr: "L'arôme concerne uniquement le lait", pt: "O aroma diz respeito apenas ao leite" },
        { fr: "La flaveur ne concerne que le sucre", pt: "A flaveur diz respeito apenas ao açúcar" }
      ],
      correctIndex: 1,
      explanation: { fr: "L'arôme correspond à une olfaction directe (le nez sent la tasse), tandis que la flaveur est une rétro-olfaction indirecte perçue en bouche lors de la dégustation.", pt: "O aroma corresponde a uma olfação direta (o nariz sente a xícara), enquanto a flaveur é uma retro-olfação indireta percebida na boca durante a degustação." }
    },
    {
      question: { fr: "Quels sont les 3 choix de matière grasse possibles pour le lait ?", pt: "Quais são as 3 opções de teor de gordura possíveis para o leite?" },
      options: [
        { fr: "Entier, demi-écrémé, écrémé", pt: "Integral, semidesnatado, desnatado" },
        { fr: "Bio, UHT, cru", pt: "Orgânico, UHT, cru" },
        { fr: "Chaud, froid, tiède", pt: "Quente, frio, morno" },
        { fr: "Végétal, animal, mixte", pt: "Vegetal, animal, misto" }
      ],
      correctIndex: 0,
      explanation: { fr: "Le lait entier (3,6% de matière grasse), demi-écrémé (1,8%) et écrémé (0%) offrent chacun une texture et une douceur différentes en latte art.", pt: "O leite integral (3,6% de gordura), semidesnatado (1,8%) e desnatado (0%) oferecem cada um uma textura e doçura diferentes no latte art." }
    },
    {
      question: { fr: "Quelle est la température maximale recommandée pour texturer le lait ?", pt: "Qual é a temperatura máxima recomendada para texturizar o leite?" },
      options: [
        { fr: "45°C", pt: "45°C" },
        { fr: "53°C", pt: "53°C" },
        { fr: "63°C", pt: "63°C" },
        { fr: "80°C", pt: "80°C" }
      ],
      correctIndex: 2,
      explanation: { fr: "Au-delà de 63°C, les protéines du lait commencent à se dénaturer et le lait perd en douceur, avec un risque de goût brûlé.", pt: "Acima de 63°C, as proteínas do leite começam a se desnaturar e o leite perde doçura, com risco de gosto queimado." }
    }
  ],
  advanced: [
    {
      question: { fr: "Quelle est la différence entre une machine à mono chaudière et une machine à double chaudière ?", pt: "Qual é a diferença entre uma máquina de caldeira única e uma de dupla caldeira?" },
      options: [
        { fr: "Aucune, c'est un argument marketing", pt: "Nenhuma, é apenas argumento de marketing" },
        { fr: "La double chaudière gère indépendamment température d'extraction et vapeur", pt: "A dupla caldeira gerencia de forma independente a temperatura de extração e o vapor" },
        { fr: "La mono chaudière est toujours plus rapide", pt: "A caldeira única é sempre mais rápida" },
        { fr: "La double chaudière ne fait pas de vapeur", pt: "A dupla caldeira não faz vapor" }
      ],
      correctIndex: 1,
      explanation: { fr: "Sur une mono chaudière (thermosyphon ou échangeur type E61), extraction et vapeur partagent la même source de chaleur ; la double chaudière permet un contrôle indépendant et plus stable des deux.", pt: "Numa caldeira única (thermosyphon ou trocador tipo E61), extração e vapor compartilham a mesma fonte de calor; a dupla caldeira permite um controle independente e mais estável dos dois." }
    },
    {
      question: { fr: "Quel est l'avantage d'un contrôle de température par PID plutôt que par thermostat ?", pt: "Qual é a vantagem de um controle de temperatura por PID em vez de termostato?" },
      options: [
        { fr: "Le PID est moins cher à produire", pt: "O PID é mais barato de produzir" },
        { fr: "Le PID maintient une température stable, le thermostat oscille en dents de scie", pt: "O PID mantém uma temperatura estável, o termostato oscila em dente de serra" },
        { fr: "Le thermostat chauffe plus vite", pt: "O termostato aquece mais rápido" },
        { fr: "Il n'y a pas de différence pratique", pt: "Não há diferença prática" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le thermostat fonctionne en tout ou rien, créant des oscillations de température ; le PID ajuste la puissance en continu pour une température stable dans le temps.", pt: "O termostato funciona no modo liga/desliga, criando oscilações de temperatura; o PID ajusta a potência continuamente para manter a temperatura estável ao longo do tempo." }
    },
    {
      question: { fr: "Dans le ratio d'un espresso, qu'est-ce qu'un 'ristretto' ?", pt: "Na proporção de um espresso, o que é um 'ristretto'?" },
      options: [
        { fr: "Un espresso avec plus d'eau", pt: "Um espresso com mais água" },
        { fr: "Un espresso au ratio plus court, plus concentré", pt: "Um espresso com proporção mais curta, mais concentrado" },
        { fr: "Un espresso servi glacé", pt: "Um espresso servido gelado" },
        { fr: "Un espresso décaféiné", pt: "Um espresso descafeinado" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le ristretto utilise un ratio plus serré (moins d'eau pour la même dose de café), donnant plus de corps mais un risque de sous-extraction s'il est mal calibré.", pt: "O ristretto usa uma proporção mais curta (menos água para a mesma dose de café), dando mais corpo mas com risco de sub-extração se mal calibrado." }
    },
    {
      question: { fr: "Que représente une courbe de distribution des particules resserrée (courbe de Gauss) après la mouture ?", pt: "O que representa uma curva de distribuição de partículas estreita (curva de Gauss) após a moagem?" },
      options: [
        { fr: "Une mouture peu homogène", pt: "Uma moagem pouco homogênea" },
        { fr: "Une majorité de particules de taille similaire, gage d'extraction homogène", pt: "Uma maioria de partículas de tamanho semelhante, garantia de extração homogênea" },
        { fr: "Un moulin mal aligné", pt: "Um moedor mal alinhado" },
        { fr: "Un défaut de torréfaction", pt: "Um defeito de torra" }
      ],
      correctIndex: 1,
      explanation: { fr: "Une courbe resserrée signifie que la majorité des particules ont une taille proche, ce qui limite les 'fines' et les 'boulders' responsables d'extractions inégales.", pt: "Uma curva estreita significa que a maioria das partículas tem tamanho próximo, o que limita as 'finas' e os 'boulders' responsáveis por extrações desiguais." }
    },
    {
      question: { fr: "Comment calcule-t-on le pourcentage d'extraction d'un café ?", pt: "Como se calcula a porcentagem de extração de um café?" },
      options: [
        { fr: "TDS × Dose in / Dose out", pt: "TDS × Dose in / Dose out" },
        { fr: "TDS × Dose out / Dose in", pt: "TDS × Dose out / Dose in" },
        { fr: "Dose out / Température", pt: "Dose out / Temperatura" },
        { fr: "Temps d'extraction × TDS", pt: "Tempo de extração × TDS" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le pourcentage d'extraction = TDS × Dose out (poids liquide obtenu) ÷ Dose in (poids de café sec utilisé).", pt: "A porcentagem de extração = TDS × Dose out (peso líquido obtido) ÷ Dose in (peso de café seco utilizado)." }
    },
    {
      question: { fr: "Un espresso qui coule trop vite et reste très clair indique généralement quoi ?", pt: "Um espresso que escorre rápido demais e fica muito claro geralmente indica o quê?" },
      options: [
        { fr: "Une mouture trop fine", pt: "Uma moagem fina demais" },
        { fr: "Une mouture trop grosse ou pas assez de café", pt: "Uma moagem grossa demais ou pouco café" },
        { fr: "Une température trop basse uniquement", pt: "Apenas uma temperatura baixa demais" },
        { fr: "Un tassage trop fort", pt: "Uma compactação forte demais" }
      ],
      correctIndex: 1,
      explanation: { fr: "Un écoulement trop rapide et clair signale généralement une mouture trop grosse ou une dose insuffisante, deux des 4 cas classiques de réglage moulin.", pt: "Um escoamento rápido demais e claro geralmente indica uma moagem grossa demais ou uma dose insuficiente, dois dos 4 casos clássicos de ajuste do moedor." }
    },
    {
      question: { fr: "Quelles sont les 3 méthodes principales de décaféination ?", pt: "Quais são os 3 principais métodos de descafeinização?" },
      options: [
        { fr: "Filtration, centrifugation, distillation", pt: "Filtração, centrifugação, destilação" },
        { fr: "Solvants, eau, CO2 supercritique", pt: "Solventes, água, CO2 supercrítico" },
        { fr: "Torréfaction longue, courte, moyenne", pt: "Torra longa, curta, média" },
        { fr: "Lavage, séchage, fermentation", pt: "Lavagem, secagem, fermentação" }
      ],
      correctIndex: 1,
      explanation: { fr: "Après immersion du café vert dans l'eau chaude, la caféine est retirée soit par solvants, soit par l'eau seule, soit par CO2 supercritique.", pt: "Após a imersão do café verde em água quente, a cafeína é removida por solventes, apenas por água, ou por CO2 supercrítico." }
    },
    {
      question: { fr: "Quel est le rôle du panier aveugle dans le nettoyage de la machine espresso ?", pt: "Qual é o papel do cesto cego na limpeza da máquina de espresso?" },
      options: [
        { fr: "Il sert à doser le café", pt: "Serve para dosar o café" },
        { fr: "Il bloque l'eau pour la faire recirculer avec le détergent dans le groupe", pt: "Ele bloqueia a água para fazê-la recircular com o detergente no grupo" },
        { fr: "Il mesure la pression", pt: "Ele mede a pressão" },
        { fr: "Il remplace le porte-filtre pour l'espresso", pt: "Ele substitui o porta-filtro para o espresso" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le panier aveugle (sans trou), garni de détergent type Cafetto, force l'eau à recirculer dans le groupe pour nettoyer en profondeur (backflush).", pt: "O cesto cego (sem furo), com detergente tipo Cafetto, força a água a recircular no grupo para uma limpeza profunda (backflush)." }
    },
    {
      question: { fr: "Pourquoi vise-t-on une micro-mousse plutôt qu'une mousse épaisse pour le latte art ?", pt: "Por que se busca uma micro-espuma em vez de uma espuma grossa para o latte art?" },
      options: [
        { fr: "La micro-mousse est plus rapide à produire", pt: "A micro-espuma é mais rápida de produzir" },
        { fr: "Des bulles fines et homogènes donnent une texture soyeuse et un meilleur contraste", pt: "Bolhas finas e homogêneas dão uma textura sedosa e melhor contraste" },
        { fr: "La mousse épaisse contient plus de caféine", pt: "A espuma grossa contém mais cafeína" },
        { fr: "Cela n'a aucun impact sur le résultat", pt: "Isso não tem impacto no resultado" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le lactosérum agit comme tensio-actif et permet, avec une bonne technique, d'obtenir de petites bulles homogènes (micro-mousse) plutôt que de grosses bulles irrégulières.", pt: "O lactossoro age como tensioativo e, com boa técnica, permite obter bolhas pequenas e homogêneas (micro-espuma) em vez de bolhas grandes e irregulares." }
    },
    {
      question: { fr: "Pour un café en torréfaction foncée, la température d'extraction recommandée est généralement :", pt: "Para um café de torra escura, a temperatura de extração recomendada geralmente é:" },
      options: [
        { fr: "Plus élevée que pour une torréfaction claire", pt: "Mais alta que para uma torra clara" },
        { fr: "Plus basse que pour une torréfaction claire", pt: "Mais baixa que para uma torra clara" },
        { fr: "Toujours identique quelle que soit la torréfaction", pt: "Sempre igual, independente da torra" },
        { fr: "Sans lien avec le niveau de torréfaction", pt: "Sem relação com o nível de torra" }
      ],
      correctIndex: 1,
      explanation: { fr: "Plus la torréfaction est foncée, plus le café est soluble : une température plus basse évite la sur-extraction et l'amertume excessive.", pt: "Quanto mais escura a torra, mais solúvel é o café: uma temperatura mais baixa evita a sobre-extração e o amargor excessivo." }
    }
  ]
};
