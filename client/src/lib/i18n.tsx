import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Lang = "fr" | "pt";

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  "app.name": { fr: "Baristech", pt: "Baristech" },
  "app.tagline": { fr: "Votre journal de dégustation café", pt: "Seu diário de degustação de café" },
  "app.hero.title": { fr: "Explorez l'univers du café de spécialité", pt: "Explore o universo do café especial" },
  "app.hero.subtitle": { fr: "Participez à nos ateliers de dégustation, notez vos impressions et découvrez votre profil café unique.", pt: "Participe dos nossos workshops de degustação, anote suas impressões e descubra seu perfil de café único." },
  "app.hero.cta": { fr: "Commencer", pt: "Começar" },
  "app.hero.feature1.title": { fr: "Journal de Dégustation", pt: "Diário de Degustação" },
  "app.hero.feature1.desc": { fr: "Notez chaque café que vous goûtez avec des notes aromatiques détaillées", pt: "Anote cada café que você prova com notas aromáticas detalhadas" },
  "app.hero.feature2.title": { fr: "Profil Personnalisé", pt: "Perfil Personalizado" },
  "app.hero.feature2.desc": { fr: "Découvrez vos préférences et recevez des recommandations sur mesure", pt: "Descubra suas preferências e receba recomendações sob medida" },
  "app.hero.feature3.title": { fr: "Quiz & Apprentissage", pt: "Quiz & Aprendizado" },
  "app.hero.feature3.desc": { fr: "Testez vos connaissances et montez en niveau dans l'art du café", pt: "Teste seus conhecimentos e suba de nível na arte do café" },

  "nav.journal": { fr: "Journal", pt: "Diário" },
  "nav.summary": { fr: "Mon Résumé", pt: "Meu Resumo" },
  "nav.spots": { fr: "Coffee Spots", pt: "Coffee Spots" },
  "nav.quiz": { fr: "Quiz", pt: "Quiz" },
  "nav.library": { fr: "Bibliothèque", pt: "Biblioteca" },
  "nav.ateliers": { fr: "Ateliers", pt: "Workshops" },
  "nav.dashboard": { fr: "Tableau de bord", pt: "Painel" },
  "nav.admin": { fr: "Admin Spots", pt: "Admin Spots" },
  "nav.profile": { fr: "Mon Profil", pt: "Meu Perfil" },
  "nav.logout": { fr: "Déconnexion", pt: "Sair" },
  "nav.login": { fr: "Connexion", pt: "Entrar" },
  "profile.title": { fr: "Mon Profil", pt: "Meu Perfil" },
  "profile.firstName": { fr: "Prénom", pt: "Nome" },
  "profile.lastName": { fr: "Nom", pt: "Sobrenome" },
  "profile.email": { fr: "E-mail", pt: "E-mail" },
  "profile.save": { fr: "Enregistrer", pt: "Salvar" },
  "profile.saved": { fr: "Profil mis à jour !", pt: "Perfil atualizado!" },
  "profile.emailNote": { fr: "L'e-mail ne peut pas être modifié", pt: "O e-mail não pode ser alterado" },
  "app.login.secure": { fr: "Connexion sécurisée via Replit", pt: "Login seguro via Replit" },
  "app.login.redirect": { fr: "Vous serez redirigé vers une page de connexion sécurisée", pt: "Você será redirecionado para uma página de login segura" },
  "app.welcome.title": { fr: "Bienvenue !", pt: "Bem-vindo(a)!" },
  "app.welcome.subtitle": { fr: "Votre espace café est prêt", pt: "Seu espaço café está pronto" },

  "journal.title": { fr: "Mon Journal de Dégustation", pt: "Meu Diário de Degustação" },
  "journal.empty": { fr: "Aucune dégustation enregistrée. Ajoutez votre première !", pt: "Nenhuma degustação registrada. Adicione a primeira!" },
  "journal.add": { fr: "Nouvelle Dégustation", pt: "Nova Degustação" },
"journal.drinkAgain": { fr: "Boire à nouveau ?", pt: "Beber de novo?" },
  "journal.yes": { fr: "Oui", pt: "Sim" },
  "journal.no": { fr: "Non", pt: "Não" },
  "journal.maybe": { fr: "Peut-être", pt: "Talvez" },
  "journal.delete": { fr: "Supprimer", pt: "Excluir" },
  "journal.deleteConfirm": { fr: "Êtes-vous sûr de vouloir supprimer cette dégustation ?", pt: "Tem certeza que deseja excluir esta degustação?" },

  "wizard.title": { fr: "Nouvelle Dégustation", pt: "Nova Degustação" },
  "wizard.step1": { fr: "Infos Café", pt: "Info do Café" },
  "wizard.step2": { fr: "Méthode", pt: "Método" },
  "wizard.step3": { fr: "Notes Sensorielles", pt: "Notas Sensoriais" },
  "wizard.coffeeName": { fr: "Nom du café *", pt: "Nome do café *" },
  "wizard.origin": { fr: "Origine / Région", pt: "Origem / Região" },
  "wizard.variety": { fr: "Variété", pt: "Variedade" },
  "wizard.process": { fr: "Procédé", pt: "Processo" },
  "wizard.process.natural": { fr: "Naturel", pt: "Natural" },
  "wizard.process.washed": { fr: "Lavé", pt: "Lavado" },
  "wizard.process.honey": { fr: "Honey", pt: "Honey" },
  "wizard.process.pulped": { fr: "Pulped Natural", pt: "Cereja Descascado" },
  "wizard.process.other": { fr: "Autre", pt: "Outro" },
  "wizard.roastDate": { fr: "Date de torréfaction", pt: "Data de torra" },
  "wizard.method": { fr: "Méthode d'extraction", pt: "Método de extração" },
  "wizard.methodOther": { fr: "Précisez la méthode", pt: "Especifique o método" },
  "wizard.aromas": { fr: "Arômes (multi-sélection)", pt: "Aromas (multi-seleção)" },
  "wizard.acidity": { fr: "Acidité", pt: "Acidez" },
  "wizard.bitterness": { fr: "Amertume", pt: "Amargor" },
  "wizard.sweetness": { fr: "Douceur", pt: "Doçura" },
  "wizard.spot": { fr: "Où avez-vous dégusté ?", pt: "Onde você degustou?" },
  "wizard.spotNone": { fr: "Aucun lieu / À domicile", pt: "Nenhum local / Em casa" },
  "wizard.serviceNotes": { fr: "Avis sur le service", pt: "Anotações sobre o atendimento" },
  "journal.visitCount": { fr: "visite(s) ici", pt: "visita(s) aqui" },
  "wizard.notes": { fr: "Notes libres", pt: "Notas livres" },
  "wizard.favoriteMethod": { fr: "Méthode préférée ?", pt: "Método favorito?" },
  "wizard.wouldDrinkAgain": { fr: "Boire à nouveau ?", pt: "Beber de novo?" },
  "wizard.next": { fr: "Suivant", pt: "Próximo" },
  "wizard.previous": { fr: "Précédent", pt: "Anterior" },
  "wizard.save": { fr: "Enregistrer", pt: "Salvar" },
  "wizard.saving": { fr: "Enregistrement...", pt: "Salvando..." },

  "summary.title": { fr: "Résumé de votre Expérience", pt: "Resumo da sua Experiência" },
  "summary.favoriteMethod": { fr: "Méthode préférée", pt: "Método favorito" },
  "summary.commonAromas": { fr: "Arômes fréquents", pt: "Aromas frequentes" },
  "summary.avgAcidity": { fr: "Acidité moyenne", pt: "Acidez média" },
  "summary.avgBitterness": { fr: "Amertume moyenne", pt: "Amargor médio" },
  "summary.avgSweetness": { fr: "Douceur moyenne", pt: "Doçura média" },
  "summary.tip": { fr: "Conseil personnalisé", pt: "Dica personalizada" },
  "summary.noData": { fr: "Ajoutez des dégustations pour voir votre résumé", pt: "Adicione degustações para ver seu resumo" },
  "summary.tastings": { fr: "dégustations", pt: "degustações" },
  "summary.sensorProfile": { fr: "Profil Sensoriel", pt: "Perfil Sensorial" },

  "spots.title": { fr: "Coffee Spots", pt: "Coffee Spots" },
  "spots.subtitle": { fr: "Clermont-Ferrand & région", pt: "Clermont-Ferrand & região" },
  "spots.search": { fr: "Rechercher un spot...", pt: "Buscar um spot..." },
  "spots.noResults": { fr: "Aucun spot trouvé", pt: "Nenhum spot encontrado" },
  "spots.suggest": { fr: "Suggérer un spot", pt: "Sugerir um spot" },
  "spots.featured.title": { fr: "En vedette", pt: "Em destaque" },
  "spots.featured.cta": { fr: "Voir l'offre →", pt: "Ver a oferta →" },

  "quiz.title": { fr: "Quiz Café", pt: "Quiz Café" },
  "quiz.subtitle": { fr: "Testez vos connaissances !", pt: "Teste seus conhecimentos!" },
  "quiz.basic": { fr: "Basique", pt: "Básico" },
  "quiz.intermediate": { fr: "Intermédiaire", pt: "Intermediário" },
  "quiz.advanced": { fr: "Avancé", pt: "Avançado" },
  "quiz.questions": { fr: "questions", pt: "perguntas" },
  "quiz.start": { fr: "Commencer", pt: "Começar" },
  "quiz.question": { fr: "Question", pt: "Pergunta" },
  "quiz.of": { fr: "de", pt: "de" },
  "quiz.correct": { fr: "Correct !", pt: "Correto!" },
  "quiz.incorrect": { fr: "Incorrect", pt: "Incorreto" },
  "quiz.next": { fr: "Suivant", pt: "Próxima" },
  "quiz.finish": { fr: "Terminer", pt: "Finalizar" },
  "quiz.score": { fr: "Score", pt: "Pontuação" },
  "quiz.retry": { fr: "Réessayer", pt: "Tentar novamente" },
  "quiz.back": { fr: "Retour", pt: "Voltar" },
  "quiz.badge.novice": { fr: "Novice du Café", pt: "Novato do Café" },
  "quiz.badge.amateur": { fr: "Amateur Éclairé", pt: "Amador Esclarecido" },
  "quiz.badge.expert": { fr: "Expert Barista", pt: "Barista Expert" },
  "quiz.badge.master": { fr: "Maître du Café", pt: "Mestre do Café" },
  "quiz.bonus.label": { fr: "Bonus", pt: "Bônus" },
  "quiz.bonus.title": { fr: "Le saviez-vous ?", pt: "Você sabia?" },
  "quiz.bonus.basic": {
    fr: "Le marché des coffee shops est en pleine explosion en France : +61% d'établissements entre 2024 et 2025, l'un des segments les plus dynamiques de la restauration organisée du pays.",
    pt: "O mercado de coffee shops está em plena explosão na França: +61% de estabelecimentos entre 2024 e 2025, um dos segmentos mais dinâmicos da restauração organizada do país.",
  },
  "quiz.bonus.intermediate": {
    fr: "Cette croissance est portée par les grandes villes : Bordeaux (+36%), Lyon et Montpellier (+150% chacune !) ou encore Lille (+75%) voient leur nombre de coffee shops grimper en flèche depuis 2024.",
    pt: "Esse crescimento é puxado pelas grandes cidades: Bordeaux (+36%), Lyon e Montpellier (+150% cada!) e também Lille (+75%) viram seu número de coffee shops disparar desde 2024.",
  },
  "quiz.bonus.advanced": {
    fr: "Avec seulement 0,8 coffee shop pour 100 000 habitants au niveau national, la France reste bien en retard sur les marchés anglo-saxons — un immense potentiel, porté par des concepts hybrides mêlant café de spécialité, restauration légère et coworking.",
    pt: "Com apenas 0,8 coffee shop para cada 100 mil habitantes no país, a França ainda está bem atrás dos mercados anglo-saxões — um potencial enorme, impulsionado por conceitos híbridos que unem café especial, refeições leves e coworking.",
  },
  "quiz.bonus.source": { fr: "Source : snacking.fr", pt: "Fonte: snacking.fr" },
  "quiz.bonus2.label": { fr: "Focus SCA", pt: "Foco SCA" },
  "quiz.bonus2.title": { fr: "Qui fixe les règles du café de spécialité ?", pt: "Quem define as regras do café especial?" },
  "quiz.bonus2.basic": {
    fr: "La SCA (Specialty Coffee Association) est l'organisation de référence mondiale du café de spécialité, née en 2017 de la fusion de l'américaine SCAA (fondée en 1982) et de l'européenne SCAE. Elle est aujourd'hui présente dans plus de 70 pays.",
    pt: "A SCA (Specialty Coffee Association) é a organização de referência mundial do café especial, nascida em 2017 da fusão entre a americana SCAA (fundada em 1982) e a europeia SCAE. Hoje está presente em mais de 70 países.",
  },
  "quiz.bonus2.intermediate": {
    fr: "C'est la SCA qui fixe la barre à 80 points sur 100 au-delà de laquelle un café est reconnu 'de spécialité' — une évaluation réalisée selon des protocoles standardisés par des Q-Graders certifiés.",
    pt: "É a SCA que fixa a marca de 80 pontos em 100 acima da qual um café é reconhecido como 'especial' — uma avaliação feita segundo protocolos padronizados por Q-Graders certificados.",
  },
  "quiz.bonus2.advanced": {
    fr: "En France, SCA France a été fondée en 2005. C'est elle qui organise chaque année les championnats nationaux (Barista, Latte Art, Coffee in Good Spirits...) — les mêmes qui envoient des Français comme Brice Robin représenter le pays sur la scène mondiale.",
    pt: "Na França, a SCA France foi fundada em 2005. É ela quem organiza todo ano os campeonatos nacionais (Barista, Latte Art, Coffee in Good Spirits...) — os mesmos que levam franceses como Brice Robin a representar o país no cenário mundial.",
  },
  "quiz.bonus2.source": { fr: "Source : coffee-spirit.maxicoffee.com", pt: "Fonte: coffee-spirit.maxicoffee.com" },

  "library.title": { fr: "Bibliothèque de l'Atelier", pt: "Biblioteca do Workshop" },
  "library.locked": { fr: "Contenu réservé aux membres", pt: "Conteúdo exclusivo para membros" },
  "library.chemex": { fr: "Guide Chemex", pt: "Guia Chemex" },
  "library.chemex.desc": { fr: "Maîtrisez l'art de la Chemex, du ratio à la température", pt: "Domine a arte da Chemex, do ratio à temperatura" },
  "library.v60": { fr: "Guide V60", pt: "Guia V60" },
  "library.v60.desc": { fr: "Techniques pour un pour-over V60 parfait", pt: "Técnicas para um pour-over V60 perfeito" },
  "library.origins": { fr: "Origines Brésiliennes", pt: "Origens Brasileiras" },
  "library.origins.desc": { fr: "Terroirs et variétés du café brésilien", pt: "Terroirs e variedades do café brasileiro" },
  "library.specialty": { fr: "Spécialité vs Supermarché", pt: "Especial vs Supermercado" },
  "library.specialty.desc": { fr: "Comprendre la différence entre cafés de spécialité et industriels", pt: "Entenda a diferença entre cafés especiais e industriais" },
  "library.equipment": { fr: "Équipement de Base", pt: "Equipamento Básico" },
  "library.equipment.desc": { fr: "Tout ce dont vous avez besoin pour commencer à la maison", pt: "Tudo que você precisa para começar em casa" },
  "library.grandmaitre": { fr: "Grand Maître du Café", pt: "Grand Maître du Café" },
  "library.grandmaitre.desc": { fr: "Posez vos questions à notre maître Yoda du café", pt: "Tire suas dúvidas com nosso mestre Yoda do café" },
  "library.grandmaitre.cta": { fr: "Poser une question", pt: "Fazer uma pergunta" },

  "ateliers.title": { fr: "Ateliers", pt: "Workshops" },
  "ateliers.subtitle": { fr: "Nos ateliers de dégustation, à venir et passés", pt: "Nossos workshops de degustação, próximos e passados" },
  "ateliers.upcoming": { fr: "Prochains ateliers", pt: "Próximos workshops" },
  "ateliers.past": { fr: "Ateliers passés", pt: "Workshops passados" },
  "ateliers.empty.upcoming": { fr: "Aucun atelier programmé pour le moment", pt: "Nenhum workshop programado no momento" },
  "ateliers.empty.past": { fr: "Aucun atelier passé pour le moment", pt: "Nenhum workshop passado no momento" },
  "ateliers.coffees": { fr: "Cafés dégustés", pt: "Cafés degustados" },
  "ateliers.location": { fr: "Lieu", pt: "Local" },
  "ateliers.price": { fr: "Prix", pt: "Valor" },
  "ateliers.seats": { fr: "places disponibles", pt: "vagas disponíveis" },
  "ateliers.seatsFull": { fr: "Complet", pt: "Esgotado" },
  "ateliers.leaveReview": { fr: "Laisser un avis", pt: "Deixar um depoimento" },
  "ateliers.reviews": { fr: "Avis", pt: "Depoimentos" },
  "ateliers.noReviews": { fr: "Aucun avis pour le moment. Soyez le premier !", pt: "Nenhum depoimento ainda. Seja o primeiro!" },
  "ateliers.review.name": { fr: "Votre nom *", pt: "Seu nome *" },
  "ateliers.review.email": { fr: "Votre e-mail *", pt: "Seu e-mail *" },
  "ateliers.review.emailNote": { fr: "Ne sera jamais affiché publiquement", pt: "Nunca será exibido publicamente" },
  "ateliers.review.rating": { fr: "Votre note", pt: "Sua nota" },
  "ateliers.review.comment": { fr: "Votre avis *", pt: "Seu depoimento *" },
  "ateliers.review.submit": { fr: "Envoyer", pt: "Enviar" },
  "ateliers.review.submitting": { fr: "Envoi...", pt: "Enviando..." },
  "ateliers.review.success": { fr: "Merci ! Votre avis sera publié après validation.", pt: "Obrigado! Seu depoimento será publicado após aprovação." },
  "ateliers.review.cancel": { fr: "Annuler", pt: "Cancelar" },

  "ateliers.about.title": { fr: "Qui anime l'atelier", pt: "Quem conduz o atelier" },
  "ateliers.about.bio": {
    fr: "Brésilien de São Paulo, installé en France depuis 2018 et à Clermont-Ferrand depuis 2025, Cris Duarte s'est reconverti au café de spécialité en 2019, après quinze ans de direction artistique en agence de publicité. Formé aux techniques et à l'analyse sensorielle du café chez Polygone (Paris), l'école cofondée par Brice Robin, triple champion de France Barista, il fonde la marque Co-Roasting, expose au Paris Coffee Show et préside aujourd'hui la Clermont Coffee Week. Il s'est rendu au World of Coffee (Copenhague 2024, Genève 2025) en tant qu'entrepreneur, pour tisser des liens et approfondir sa connaissance du secteur. Sa conviction : la technologie soutient l'expérience, elle ne remplace jamais le geste du barista.",
    pt: "Brasileiro de São Paulo, vivendo na França desde 2018 e em Clermont-Ferrand desde 2025, Cris Duarte se reconverteu para o café especial em 2019, depois de quinze anos como diretor de arte em agências de publicidade. Formado em técnicas e análise sensorial do café pela Polygone (Paris), escola cofundada por Brice Robin, tricampeão francês de barismo, fundou a marca Co-Roasting, expôs no Paris Coffee Show e hoje preside a Clermont Coffee Week. Participou do World of Coffee (Copenhague 2024, Genebra 2025) como empreendedor, para se conectar com o setor e ampliar seu conhecimento. Sua convicção: a tecnologia apoia a experiência, mas nunca substitui o gesto do barista.",
  },
  "ateliers.about.polygone": { fr: "Formé chez Polygone, école de Brice Robin, triple champion de France Barista", pt: "Formado pela Polygone, escola de Brice Robin, tricampeão francês de barismo" },
  "ateliers.about.worldOfCoffee": { fr: "World of Coffee — Copenhague 2024 · Genève 2025", pt: "World of Coffee — Copenhague 2024 · Genebra 2025" },
  "ateliers.about.clermontWeek": { fr: "Président de la Clermont Coffee Week", pt: "Presidente da Clermont Coffee Week" },

  "ateliers.reserve": { fr: "Réserver ma place", pt: "Reservar minha vaga" },
  "ateliers.reservation.title": { fr: "Réserver votre place", pt: "Reserve sua vaga" },
  "ateliers.reservation.name": { fr: "Votre nom *", pt: "Seu nome *" },
  "ateliers.reservation.email": { fr: "Votre e-mail *", pt: "Seu e-mail *" },
  "ateliers.reservation.phone": { fr: "Téléphone (optionnel)", pt: "Telefone (opcional)" },
  "ateliers.reservation.seats": { fr: "Nombre de personnes", pt: "Número de pessoas" },
  "ateliers.reservation.coffeeKnowledge": { fr: "Quel est votre niveau de connaissance sur le café ?", pt: "Qual o seu conhecimento sobre o café?" },
  "ateliers.reservation.homeBrewMethod": { fr: "Quelle méthode d'extraction avez-vous chez vous ou au travail ?", pt: "Qual método de extração você possui em casa ou no trabalho?" },
  "ateliers.reservation.learningGoal": { fr: "Qu'aimeriez-vous apprendre ou découvrir lors de cet atelier café ?", pt: "O que você gostaria de saber ou aprender neste atelier café?" },
  "ateliers.reservation.selectPlaceholder": { fr: "Choisissez une option", pt: "Escolha uma opção" },
  "ateliers.reservation.companyName": { fr: "Nom de l'entreprise", pt: "Nome da empresa" },
  "ateliers.reservation.eventGoal": { fr: "Objectif de l'événement", pt: "Objetivo do evento" },
  "ateliers.reservation.childAge": { fr: "Âge de l'enfant", pt: "Idade da criança" },
  "ateliers.reservation.parentAccompanying": { fr: "L'enfant sera-t-il accompagné d'un parent ?", pt: "A criança virá acompanhada de um adulto?" },
  "ateliers.reservation.yes": { fr: "Oui", pt: "Sim" },
  "ateliers.reservation.no": { fr: "Non", pt: "Não" },
  "ateliers.reservation.message": { fr: "Message (optionnel)", pt: "Mensagem (opcional)" },
  "ateliers.reservation.policy": {
    fr: "Le paiement se fait sur place, à la fin de l'atelier. En cochant cette case, je m'engage à honorer ma réservation. Annulation gratuite jusqu'à 48h avant l'atelier. En cas d'annulation sans explication ni proposition de nouvelle date, le montant total reste dû.",
    pt: "O pagamento é feito no local, ao final do atelier. Ao marcar esta caixa, concordo em honrar meu compromisso. Cancelamento gratuito até 48h antes do atelier. Em caso de cancelamento sem explicação ou sugestão de nova data, o valor total permanece devido.",
  },
  "ateliers.reservation.submit": { fr: "Confirmer la réservation", pt: "Confirmar reserva" },
  "ateliers.reservation.submitting": { fr: "Envoi...", pt: "Enviando..." },
  "ateliers.reservation.cancel": { fr: "Annuler", pt: "Cancelar" },
  "ateliers.reservation.success": { fr: "Réservation confirmée ! Vous recevrez les détails par e-mail.", pt: "Reserva confirmada! Você receberá os detalhes por e-mail." },
  "ateliers.reservation.error": { fr: "Impossible de réserver, veuillez réessayer.", pt: "Não foi possível reservar, tente novamente." },
  "ateliers.reservation.full": { fr: "Plus assez de places disponibles pour ce nombre de personnes.", pt: "Não há vagas suficientes para esse número de pessoas." },

  "admin.title": { fr: "Administration des Coffee Spots", pt: "Administração dos Coffee Spots" },
  "admin.addSpot": { fr: "Ajouter un Spot", pt: "Adicionar um Spot" },
  "admin.editSpot": { fr: "Modifier le Spot", pt: "Editar o Spot" },
  "admin.name": { fr: "Nom", pt: "Nome" },
  "admin.city": { fr: "Ville", pt: "Cidade" },
  "admin.instagram": { fr: "Instagram", pt: "Instagram" },
  "admin.website": { fr: "Site Web", pt: "Site" },
  "admin.tags": { fr: "Tags (séparés par des virgules)", pt: "Tags (separadas por vírgulas)" },
  "admin.save": { fr: "Enregistrer", pt: "Salvar" },
  "admin.cancel": { fr: "Annuler", pt: "Cancelar" },
  "admin.delete": { fr: "Supprimer", pt: "Excluir" },

  "privacy.link": { fr: "Politique de confidentialité", pt: "Política de privacidade" },
  "privacy.banner": { fr: "Nous utilisons vos données uniquement pour faire fonctionner l'app. En continuant, vous acceptez notre", pt: "Usamos seus dados apenas para o funcionamento do app. Ao continuar, você aceita nossa" },
  "privacy.accept": { fr: "J'accepte", pt: "Aceitar" },
  "privacy.title": { fr: "Politique de Confidentialité", pt: "Política de Privacidade" },
  "privacy.updated": { fr: "Dernière mise à jour : avril 2026", pt: "Última atualização: abril de 2026" },
  "privacy.s1.title": { fr: "Données collectées", pt: "Dados coletados" },
  "privacy.s1.body": { fr: "Nous collectons votre adresse e-mail pour créer votre compte, ainsi que les données que vous saisissez volontairement : notes de dégustation, résultats de quiz et préférences de langue.", pt: "Coletamos seu endereço de e-mail para criar sua conta, além dos dados que você insere voluntariamente: notas de degustação, resultados de quiz e preferências de idioma." },
  "privacy.s2.title": { fr: "Utilisation des données", pt: "Uso dos dados" },
  "privacy.s2.body": { fr: "Vos données sont utilisées exclusivement pour faire fonctionner l'application et personnaliser votre expérience. Elles ne sont jamais vendues ni partagées avec des tiers.", pt: "Seus dados são usados exclusivamente para o funcionamento do aplicativo e personalização da sua experiência. Eles nunca são vendidos nem compartilhados com terceiros." },
  "privacy.s3.title": { fr: "Hébergement", pt: "Hospedagem" },
  "privacy.s3.body": { fr: "Les données sont hébergées sur des serveurs sécurisés (Supabase / Railway) situés en Europe.", pt: "Os dados são hospedados em servidores seguros (Supabase / Railway) localizados na Europa." },
  "privacy.s4.title": { fr: "Vos droits (RGPD)", pt: "Seus direitos (LGPD/RGPD)" },
  "privacy.s4.body": { fr: "Vous pouvez accéder, modifier ou supprimer vos données à tout moment en nous contactant à filtralabs@gmail.com.", pt: "Você pode acessar, modificar ou excluir seus dados a qualquer momento entrando em contato pelo e-mail filtralabs@gmail.com." },
  "privacy.s5.title": { fr: "Cookies", pt: "Cookies" },
  "privacy.s5.body": { fr: "L'application utilise uniquement des cookies techniques nécessaires au fonctionnement (session, préférences de langue et de thème).", pt: "O aplicativo usa apenas cookies técnicos necessários ao funcionamento (sessão, preferências de idioma e tema)." },

  "common.loading": { fr: "Chargement...", pt: "Carregando..." },
  "common.error": { fr: "Une erreur est survenue", pt: "Ocorreu um erro" },
  "common.welcome": { fr: "Bienvenue", pt: "Bem-vindo(a)" },
  "common.save": { fr: "Enregistrer", pt: "Salvar" },
  "common.cancel": { fr: "Annuler", pt: "Cancelar" },
};

const I18nContext = createContext<I18nContextType>({
  lang: "fr",
  setLang: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("baristech-lang");
    return (stored === "pt" || stored === "fr") ? stored : "fr";
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("baristech-lang", newLang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] ?? key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
