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
      question: { fr: "Quelle est la principale différence entre une torréfaction claire et une torréfaction foncée dans la tasse ?", pt: "Qual é a principal diferença entre uma torra clara e uma torra escura na xícara?" },
      options: [
        { fr: "La claire garde plus les saveurs d'origine, la foncée plus d'amertume et de corps", pt: "A clara preserva mais os sabores de origem, a escura traz mais amargor e corpo" },
        { fr: "Il n'y a aucune différence de goût", pt: "Não há diferença nenhuma de sabor" },
        { fr: "La foncée contient toujours plus de caféine", pt: "A escura sempre tem mais cafeína" },
        { fr: "La claire est réservée à l'espresso", pt: "A clara é reservada ao espresso" }
      ],
      correctIndex: 0,
      explanation: { fr: "Une torréfaction claire préserve les notes fruitées et acidulées propres à l'origine, tandis qu'une torréfaction foncée développe plus de corps et d'amertume au détriment de ces nuances.", pt: "Uma torra clara preserva as notas frutadas e ácidas próprias da origem, enquanto uma torra escura desenvolve mais corpo e amargor em detrimento dessas nuances." }
    },
    {
      question: { fr: "Pourquoi la taille de la mouture change-t-elle autant le goût du café ?", pt: "Por que o tamanho da moagem muda tanto o sabor do café?" },
      options: [
        { fr: "Elle n'a aucun impact réel", pt: "Ela não tem impacto real nenhum" },
        { fr: "Une mouture trop fine pour la méthode sur-extrait (amer), trop grosse sous-extrait (fade)", pt: "Uma moagem fina demais para o método sobre-extrai (amargo), grossa demais sub-extrai (fraco)" },
        { fr: "Elle change uniquement la couleur du café", pt: "Ela só muda a cor do café" },
        { fr: "Elle affecte seulement la quantité de caféine", pt: "Ela só afeta a quantidade de cafeína" }
      ],
      correctIndex: 1,
      explanation: { fr: "Chaque méthode (V60, Chemex, cafetière...) a une mouture idéale : trop fine, l'eau reste trop longtemps au contact et sur-extrait ; trop grosse, elle passe trop vite et sous-extrait.", pt: "Cada método (V60, Chemex, cafeteira...) tem uma moagem ideal: fina demais, a água fica tempo demais em contato e sobre-extrai; grossa demais, ela passa rápido demais e sub-extrai." }
    },
    {
      question: { fr: "Que signifie 'café en grains de spécialité, single origin' sur un paquet ?", pt: "O que significa 'café em grãos de especialidade, single origin' num pacote?" },
      options: [
        { fr: "Un café produit dans une seule et même ferme ou région, sans mélange", pt: "Um café produzido numa única fazenda ou região, sem mistura" },
        { fr: "Un café qui ne pousse qu'une fois par an", pt: "Um café que só cresce uma vez por ano" },
        { fr: "Un café vendu uniquement en ligne", pt: "Um café vendido só online" },
        { fr: "Un café décaféiné", pt: "Um café descafeinado" }
      ],
      correctIndex: 0,
      explanation: { fr: "À l'inverse d'un blend (mélange de plusieurs origines), un single origin provient d'une ferme, coopérative ou région unique, ce qui permet de mieux tracer et reconnaître son profil de goût.", pt: "Ao contrário de um blend (mistura de várias origens), um single origin vem de uma única fazenda, cooperativa ou região, o que permite rastrear melhor e reconhecer seu perfil de sabor." }
    },
    {
      question: { fr: "Quelle est la meilleure façon de conserver son café à la maison ?", pt: "Qual é a melhor forma de conservar o café em casa?" },
      options: [
        { fr: "Dans un contenant hermétique, à l'abri de la lumière, de la chaleur et de l'humidité", pt: "Num recipiente hermético, longe de luz, calor e umidade" },
        { fr: "Dans le paquet ouvert, sur le plan de travail", pt: "No pacote aberto, em cima da bancada" },
        { fr: "Toujours au congélateur", pt: "Sempre no congelador" },
        { fr: "Près de la cafetière pour plus de praticité", pt: "Perto da cafeteira, por praticidade" }
      ],
      correctIndex: 0,
      explanation: { fr: "L'air, la lumière, la chaleur et l'humidité accélèrent la perte d'arômes. Un contenant hermétique opaque, à température ambiante, préserve la fraîcheur bien plus longtemps.", pt: "Ar, luz, calor e umidade aceleram a perda de aromas. Um recipiente hermético e opaco, em temperatura ambiente, preserva o frescor por muito mais tempo." }
    },
    {
      question: { fr: "Pourquoi la date de torréfaction est-elle plus importante que la date de péremption ?", pt: "Por que a data de torra é mais importante que a data de validade?" },
      options: [
        { fr: "Elle ne l'est pas, seule la péremption compte", pt: "Não é, só a validade importa" },
        { fr: "Un café est à son meilleur dans les semaines suivant la torréfaction, puis perd en arôme", pt: "Um café está no seu melhor nas semanas seguintes à torra, depois perde aroma" },
        { fr: "La date de torréfaction indique la caféine restante", pt: "A data de torra indica a cafeína restante" },
        { fr: "Elle sert uniquement à fixer le prix", pt: "Ela só serve para fixar o preço" }
      ],
      correctIndex: 1,
      explanation: { fr: "Contrairement à un produit qui se 'périme', le café frais dégaze et perd progressivement ses arômes après la torréfaction : il est généralement à son sommet entre 1 et 4 semaines après.", pt: "Diferente de um produto que 'vence', o café fresco libera gás e perde aroma progressivamente após a torra: costuma estar no auge entre 1 e 4 semanas depois." }
    },
    {
      question: { fr: "Quelle est la vraie différence entre un latte, un cappuccino et un flat white ?", pt: "Qual é a diferença real entre um latte, um cappuccino e um flat white?" },
      options: [
        { fr: "Ce sont trois noms pour la même boisson", pt: "São três nomes para a mesma bebida" },
        { fr: "Principalement la proportion d'espresso, de lait et de mousse", pt: "Principalmente a proporção de espresso, leite e espuma" },
        { fr: "Uniquement la taille de la tasse", pt: "Só o tamanho da xícara" },
        { fr: "Le type de grain utilisé", pt: "O tipo de grão utilizado" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le cappuccino a plus de mousse épaisse, le latte plus de lait texturé et peu de mousse, le flat white est plus court avec une micro-mousse fine : même base, équilibres différents.", pt: "O cappuccino tem mais espuma grossa, o latte tem mais leite texturizado e pouca espuma, o flat white é mais curto com micro-espuma fina: mesma base, equilíbrios diferentes." }
    },
    {
      question: { fr: "Qu'est-ce que le café de spécialité de 'troisième vague' (third wave) ?", pt: "O que é o café especial da 'terceira onda' (third wave)?" },
      options: [
        { fr: "Un mouvement centré sur la traçabilité, la qualité et l'histoire derrière chaque café", pt: "Um movimento focado em rastreabilidade, qualidade e a história por trás de cada café" },
        { fr: "Une nouvelle machine à café automatique", pt: "Uma nova máquina de café automática" },
        { fr: "Un style de café glacé uniquement", pt: "Um estilo de café gelado apenas" },
        { fr: "Une marque de capsules", pt: "Uma marca de cápsulas" }
      ],
      correctIndex: 0,
      explanation: { fr: "Après le café comme simple commodité (1ère vague) et la démocratisation de l'espresso (2ème vague), la 3ème vague traite le café comme un produit artisanal, avec origine, torréfacteur et méthode mis en avant.", pt: "Depois do café como simples commodity (1ª onda) e da popularização do espresso (2ª onda), a 3ª onda trata o café como um produto artesanal, com origem, torrefador e método em destaque." }
    },
    {
      question: { fr: "Pourquoi l'eau utilisée pour infuser change-t-elle le goût du café ?", pt: "Por que a água usada para preparar muda o sabor do café?" },
      options: [
        { fr: "Elle ne change rien", pt: "Ela não muda nada" },
        { fr: "Le chlore et l'excès de minéraux peuvent masquer ou déséquilibrer les arômes", pt: "O cloro e o excesso de minerais podem mascarar ou desequilibrar os aromas" },
        { fr: "Seule la température de l'eau compte, jamais sa composition", pt: "Só a temperatura da água importa, nunca sua composição" },
        { fr: "L'eau du robinet est toujours meilleure que l'eau filtrée", pt: "Água da torneira é sempre melhor que água filtrada" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le café est à plus de 98% de l'eau : le chlore et un excès de minéraux peuvent introduire des goûts parasites, d'où l'intérêt d'une eau filtrée pour un résultat plus net.", pt: "O café é mais de 98% água: cloro e excesso de minerais podem trazer sabores estranhos, por isso vale usar água filtrada para um resultado mais limpo." }
    },
    {
      question: { fr: "En dégustation, à quoi correspondent des notes comme 'chocolat', 'agrumes' ou 'floral' ?", pt: "Na degustação, a que correspondem notas como 'chocolate', 'cítrico' ou 'floral'?" },
      options: [
        { fr: "Des ingrédients ajoutés au café", pt: "Ingredientes adicionados ao café" },
        { fr: "Des arômes naturellement présents dans le grain selon son origine et sa transformation", pt: "Aromas naturalmente presentes no grão de acordo com sua origem e processamento" },
        { fr: "Un classement de qualité officiel", pt: "Uma classificação oficial de qualidade" },
        { fr: "Le nom donné à la torréfaction", pt: "O nome dado à torra" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le café ne contient aucun additif : ces notes décrivent des arômes réellement présents, développés par l'origine, le procédé (lavé, naturel...) et la torréfaction.", pt: "O café não tem nenhum aditivo: essas notas descrevem aromas realmente presentes, desenvolvidos pela origem, o processo (lavado, natural...) e a torra." }
    },
    {
      question: { fr: "Quelle tendance a le plus marqué la consommation de café ces dernières années ?", pt: "Qual tendência mais marcou o consumo de café nos últimos anos?" },
      options: [
        { fr: "La baisse du café glacé et cold brew", pt: "A queda do café gelado e do cold brew" },
        { fr: "La croissance du café de spécialité, du cold brew et des laits végétaux", pt: "O crescimento do café especial, do cold brew e dos leites vegetais" },
        { fr: "La disparition totale des cafés filtres", pt: "O desaparecimento total dos cafés filtrados" },
        { fr: "Le retour exclusif du café soluble", pt: "O retorno exclusivo do café solúvel" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le café de spécialité, le cold brew et les alternatives végétales au lait (avoine, amande...) ont connu une forte croissance portée par une demande de qualité et de personnalisation.", pt: "O café especial, o cold brew e as alternativas vegetais ao leite (aveia, amêndoa...) cresceram fortemente, impulsionados pela busca por qualidade e personalização." }
    },
    {
      question: { fr: "Qui est devenu, à Athènes en 2023, le premier champion brésilien de l'histoire du Championnat du Monde de Barista ?", pt: "Quem se tornou, em Atenas em 2023, o primeiro campeão brasileiro da história do Campeonato Mundial de Barista?" },
      options: [
        { fr: "Daniele Ricci", pt: "Daniele Ricci" },
        { fr: "Boram Um", pt: "Boram Um" },
        { fr: "Jack Simpson", pt: "Jack Simpson" },
        { fr: "Mikael Jasin", pt: "Mikael Jasin" }
      ],
      correctIndex: 1,
      explanation: { fr: "Boram Um a remporté le titre mondial en juin 2023 à Athènes lors du World of Coffee, devenant le premier Brésilien sacré Champion du Monde de Barista, et le 23e champion mondial de l'histoire.", pt: "Boram Um conquistou o título mundial em junho de 2023 em Atenas, no World of Coffee, tornando-se o primeiro brasileiro a ser coroado Campeão Mundial de Barista, e o 23º campeão mundial da história." }
    },
    {
      question: { fr: "Quel barista français a été sacré Champion de France de Barista à trois reprises (2023, 2024 et 2026) ?", pt: "Qual barista francês foi coroado Campeão da França de Barista três vezes (2023, 2024 e 2026)?" },
      options: [
        { fr: "Kévin David", pt: "Kévin David" },
        { fr: "Victor Delpierre", pt: "Victor Delpierre" },
        { fr: "Brice Robin", pt: "Brice Robin" },
        { fr: "Um Paul", pt: "Um Paul" }
      ],
      correctIndex: 2,
      explanation: { fr: "Brice Robin, co-fondateur de Polygone Formations à Paris, a été sacré Champion de France de Barista en 2023, 2024 et 2026, et a représenté la France au Championnat du Monde 2023 à Athènes.", pt: "Brice Robin, cofundador da Polygone Formations em Paris, foi coroado Campeão da França de Barista em 2023, 2024 e 2026, representando a França no Campeonato Mundial de 2023 em Atenas." }
    }
  ],
  advanced: [
    {
      question: { fr: "Qu'entend-on par 'terroir' appliqué au café ?", pt: "O que se entende por 'terroir' aplicado ao café?" },
      options: [
        { fr: "Le sol, l'altitude et le climat qui façonnent le profil aromatique d'un café", pt: "O solo, a altitude e o clima que moldam o perfil aromático de um café" },
        { fr: "Le nom du pays producteur uniquement", pt: "Apenas o nome do país produtor" },
        { fr: "La marque du torréfacteur", pt: "A marca do torrefador" },
        { fr: "Le type d'emballage utilisé", pt: "O tipo de embalagem utilizada" }
      ],
      correctIndex: 0,
      explanation: { fr: "Comme pour le vin, le terroir désigne l'ensemble sol, climat, altitude et savoir-faire local qui donne à un café ses caractéristiques uniques, même au sein d'un même pays.", pt: "Como no vinho, o terroir designa o conjunto solo, clima, altitude e saber-fazer local que dá ao café suas características únicas, mesmo dentro de um mesmo país." }
    },
    {
      question: { fr: "De façon générale, comment l'altitude influence-t-elle le café ?", pt: "De forma geral, como a altitude influencia o café?" },
      options: [
        { fr: "Elle n'a aucun effet mesurable", pt: "Não tem efeito nenhum mensurável" },
        { fr: "Plus l'altitude est élevée, plus le grain mûrit lentement et développe souvent plus de complexité et d'acidité", pt: "Quanto maior a altitude, mais lentamente o grão amadurece e geralmente desenvolve mais complexidade e acidez" },
        { fr: "Elle détermine uniquement la couleur du grain vert", pt: "Ela só determina a cor do grão verde" },
        { fr: "Elle réduit toujours la teneur en caféine", pt: "Ela sempre reduz o teor de cafeína" }
      ],
      correctIndex: 1,
      explanation: { fr: "En altitude, les cerises mûrissent plus lentement grâce aux températures plus fraîches, ce qui favorise généralement des grains plus denses et des tasses plus complexes et acidulées.", pt: "Em altitude, as cerejas amadurecem mais devagar por causa das temperaturas mais amenas, o que geralmente favorece grãos mais densos e xícaras mais complexas e ácidas." }
    },
    {
      question: { fr: "Quelle est la différence entre 'commerce équitable' (fair trade) et 'commerce direct' (direct trade) ?", pt: "Qual é a diferença entre 'comércio justo' (fair trade) e 'comércio direto' (direct trade)?" },
      options: [
        { fr: "Ce sont exactement la même chose", pt: "São exatamente a mesma coisa" },
        { fr: "Le fair trade est une certification à prix plancher via coopératives, le direct trade est une relation directe torréfacteur-producteur", pt: "O fair trade é uma certificação com preço mínimo via cooperativas, o direct trade é uma relação direta entre torrefador e produtor" },
        { fr: "Le direct trade concerne uniquement le café instantané", pt: "O direct trade diz respeito apenas ao café solúvel" },
        { fr: "Le fair trade n'existe que pour le thé", pt: "O fair trade só existe para o chá" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le fair trade est une certification garantissant un prix minimum via des coopératives ; le direct trade repose sur une relation commerciale directe entre torréfacteur et producteur, souvent à un prix plus élevé.", pt: "O fair trade é uma certificação que garante um preço mínimo via cooperativas; o direct trade se baseia numa relação comercial direta entre torrefador e produtor, muitas vezes a um preço mais alto." }
    },
    {
      question: { fr: "À quoi sert la 'roue des arômes' (flavor wheel) utilisée en dégustation ?", pt: "Para que serve a 'roda de sabores' (flavor wheel) usada na degustação?" },
      options: [
        { fr: "À régler la machine à café", pt: "Para regular a máquina de café" },
        { fr: "À aider à identifier et nommer les arômes perçus dans la tasse", pt: "Para ajudar a identificar e nomear os aromas percebidos na xícara" },
        { fr: "À calculer le prix du café", pt: "Para calcular o preço do café" },
        { fr: "À mesurer la teneur en caféine", pt: "Para medir o teor de cafeína" }
      ],
      correctIndex: 1,
      explanation: { fr: "Créée notamment par la Specialty Coffee Association, cette roue organise des centaines de descripteurs (fruité, floral, épicé...) pour aider à mettre des mots précis sur une dégustation.", pt: "Criada principalmente pela Specialty Coffee Association, essa roda organiza centenas de descritores (frutado, floral, especiado...) para ajudar a colocar em palavras precisas uma degustação." }
    },
    {
      question: { fr: "Dans la tasse, quelle est la différence générale entre Arabica et Robusta ?", pt: "Na xícara, qual é a diferença geral entre Arábica e Robusta?" },
      options: [
        { fr: "L'Arabica est plus doux et aromatique, le Robusta plus amer, corsé et riche en caféine", pt: "O Arábica é mais suave e aromático, o Robusta mais amargo, encorpado e rico em cafeína" },
        { fr: "Ils ont exactement le même goût", pt: "Eles têm exatamente o mesmo sabor" },
        { fr: "Le Robusta est toujours plus cher", pt: "O Robusta é sempre mais caro" },
        { fr: "L'Arabica ne pousse qu'en Asie", pt: "O Arábica só cresce na Ásia" }
      ],
      correctIndex: 0,
      explanation: { fr: "L'Arabica développe généralement plus de nuances aromatiques et d'acidité, tandis que le Robusta, plus riche en caféine, apporte du corps et de l'amertume, souvent utile dans les blends espresso pour la crema.", pt: "O Arábica geralmente desenvolve mais nuances aromáticas e acidez, enquanto o Robusta, mais rico em cafeína, traz corpo e amargor, muitas vezes útil em blends de espresso pela crema." }
    },
    {
      question: { fr: "Pourquoi l'acidité est-elle recherchée dans un café de spécialité plutôt que considérée comme un défaut ?", pt: "Por que a acidez é buscada num café especial em vez de ser vista como um defeito?" },
      options: [
        { fr: "Elle ne l'est jamais, c'est toujours un défaut", pt: "Nunca é buscada, é sempre um defeito" },
        { fr: "Une bonne acidité apporte de la vivacité et de la fraîcheur, comme dans un agrume ou un fruit mûr", pt: "Uma boa acidez traz vivacidade e frescor, como num cítrico ou fruta madura" },
        { fr: "Elle indique uniquement que le café est périmé", pt: "Ela só indica que o café está vencido" },
        { fr: "Elle n'a aucun lien avec le goût perçu", pt: "Ela não tem relação nenhuma com o sabor percebido" }
      ],
      correctIndex: 1,
      explanation: { fr: "À ne pas confondre avec un goût 'acide' désagréable : une acidité bien équilibrée apporte de la vivacité et de la complexité, très recherchée dans les cafés lavés d'altitude par exemple.", pt: "Não confundir com um gosto 'azedo' desagradável: uma acidez bem equilibrada traz vivacidade e complexidade, muito buscada por exemplo em cafés lavados de altitude." }
    },
    {
      question: { fr: "Que veut dire une 'tasse propre' (clean cup) en dégustation ?", pt: "O que significa uma 'xícara limpa' (clean cup) na degustação?" },
      options: [
        { fr: "Une tasse littéralement bien lavée", pt: "Uma xícara literalmente bem lavada" },
        { fr: "Une tasse sans défaut ni goût parasite, où les arômes sont perçus clairement", pt: "Uma xícara sem defeito ou sabor estranho, onde os aromas são percebidos claramente" },
        { fr: "Un café toujours servi sans lait", pt: "Um café sempre servido sem leite" },
        { fr: "Un café décaféiné", pt: "Um café descafeinado" }
      ],
      correctIndex: 1,
      explanation: { fr: "Une tasse 'propre' n'a pas de goûts indésirables (moisi, fermenté, terreux non voulu) : c'est l'un des critères de base pour qu'un café soit considéré comme 'de spécialité'.", pt: "Uma xícara 'limpa' não tem sabores indesejados (mofo, fermentado, terroso indesejado): é um dos critérios básicos para um café ser considerado 'especial'." }
    },
    {
      question: { fr: "Quel est le lien entre le procédé de traitement (lavé, naturel, honey) et le résultat perçu par le consommateur ?", pt: "Qual é a relação entre o processo de tratamento (lavado, natural, honey) e o resultado percebido pelo consumidor?" },
      options: [
        { fr: "Aucun, seule la torréfaction compte", pt: "Nenhuma, só a torra importa" },
        { fr: "Le lavé donne une tasse plus nette et acidulée, le naturel plus fruité et sucré, le honey entre les deux", pt: "O lavado dá uma xícara mais limpa e ácida, o natural mais frutado e doce, o honey fica entre os dois" },
        { fr: "Ils donnent tous exactement le même goût", pt: "Todos dão exatamente o mesmo sabor" },
        { fr: "Le procédé ne concerne que le café décaféiné", pt: "O processo só diz respeito ao café descafeinado" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le procédé de post-récolte est l'un des plus grands leviers de goût : lavé (propre, acidulé), naturel (fruité, sucré, plus de corps) et honey (profil intermédiaire) donnent des tasses très différentes pour une même origine.", pt: "O processo de pós-colheita é uma das maiores alavancas de sabor: lavado (limpo, ácido), natural (frutado, doce, mais corpo) e honey (perfil intermediário) resultam em xícaras bem diferentes para a mesma origem." }
    },
    {
      question: { fr: "Que recherchent principalement les certifications comme Rainforest Alliance ou Bio sur un paquet de café ?", pt: "O que buscam principalmente certificações como Rainforest Alliance ou Orgânico num pacote de café?" },
      options: [
        { fr: "Garantir des pratiques agricoles et sociales plus responsables", pt: "Garantir práticas agrícolas e sociais mais responsáveis" },
        { fr: "Garantir que le café est plus fort en caféine", pt: "Garantir que o café tem mais cafeína" },
        { fr: "Garantir une torréfaction plus foncée", pt: "Garantir uma torra mais escura" },
        { fr: "Garantir un prix plus bas", pt: "Garantir um preço mais baixo" }
      ],
      correctIndex: 0,
      explanation: { fr: "Ces labels attestent d'engagements sur l'environnement (biodiversité, usage de pesticides), les conditions de travail ou la rémunération des producteurs, sans garantir en soi une meilleure qualité gustative.", pt: "Esses selos atestam compromissos com o meio ambiente (biodiversidade, uso de agrotóxicos), condições de trabalho ou remuneração dos produtores, sem garantir por si só uma qualidade sensorial melhor." }
    },
    {
      question: { fr: "Pourquoi deux paquets de la même origine peuvent-ils avoir un goût très différent d'un torréfacteur à l'autre ?", pt: "Por que dois pacotes da mesma origem podem ter um sabor bem diferente de um torrefador para outro?" },
      options: [
        { fr: "Ce n'est jamais le cas, l'origine seule détermine le goût", pt: "Isso nunca acontece, só a origem determina o sabor" },
        { fr: "Le choix de torréfaction (courbe, niveau) et la fraîcheur influencent fortement le résultat final", pt: "A escolha da torra (curva, nível) e o frescor influenciam fortemente o resultado final" },
        { fr: "Seule la couleur du paquet change", pt: "Só a cor do pacote muda" },
        { fr: "Cela dépend uniquement du prix payé", pt: "Isso depende só do preço pago" }
      ],
      correctIndex: 1,
      explanation: { fr: "Le grain vert n'est qu'un point de départ : chaque torréfacteur fait des choix (courbe de torréfaction, niveau, fraîcheur de torréfaction) qui influencent fortement le profil final en tasse.", pt: "O grão verde é só um ponto de partida: cada torrefador faz escolhas (curva de torra, nível, frescor da torra) que influenciam fortemente o perfil final na xícara." }
    },
    {
      question: { fr: "Qui a offert à la France son premier titre mondial de Coffee in Good Spirits, en 2013 à Nice ?", pt: "Quem deu à França seu primeiro título mundial de Coffee in Good Spirits, em 2013 em Nice?" },
      options: [
        { fr: "Brice Robin", pt: "Brice Robin" },
        { fr: "Hakim Ben Hammouda", pt: "Hakim Ben Hammouda" },
        { fr: "Victor Delpierre", pt: "Victor Delpierre" },
        { fr: "Kévin David", pt: "Kévin David" }
      ],
      correctIndex: 2,
      explanation: { fr: "Victor Delpierre, d'abord sacré champion de France, a remporté le titre mondial de Coffee in Good Spirits 2013 à domicile, à Nice, une première pour la France dans cette discipline.", pt: "Victor Delpierre, primeiro coroado campeão da França, conquistou o título mundial de Coffee in Good Spirits 2013 em casa, em Nice, uma primeira vez para a França nessa modalidade." }
    },
    {
      question: { fr: "Qui a remporté le Championnat de France de Latte Art 2025 à Lyon, avant de représenter la France au Championnat du Monde à Genève ?", pt: "Quem venceu o Campeonato da França de Latte Art 2025 em Lyon, antes de representar a França no Campeonato Mundial em Genebra?" },
      options: [
        { fr: "Manuela Fensore", pt: "Manuela Fensore" },
        { fr: "Yi-Chen Xie", pt: "Yi-Chen Xie" },
        { fr: "Inger Wieringa", pt: "Inger Wieringa" },
        { fr: "Boram Um", pt: "Boram Um" }
      ],
      correctIndex: 2,
      explanation: { fr: "Inger Wieringa, déjà vice-championne en 2023, a remporté le titre de Championne de France de Latte Art 2025 au Sirha de Lyon, aux côtés d'Um Paul, sept fois champion du monde.", pt: "Inger Wieringa, já vice-campeã em 2023, conquistou o título de Campeã da França de Latte Art 2025 no Sirha de Lyon, ao lado de Um Paul, sete vezes campeão mundial." }
    }
  ]
};
