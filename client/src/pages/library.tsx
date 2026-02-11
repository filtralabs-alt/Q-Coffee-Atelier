import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lock, ChevronRight, Coffee, Beaker, MapPin, Scale, Wrench } from "lucide-react";

export default function LibraryPage() {
  const { t, lang } = useI18n();
  const { isAuthenticated } = useAuth();

  const modules = [
    { key: "chemex", icon: Beaker, titleKey: "library.chemex", descKey: "library.chemex.desc" },
    { key: "v60", icon: Coffee, titleKey: "library.v60", descKey: "library.v60.desc" },
    { key: "origins", icon: MapPin, titleKey: "library.origins", descKey: "library.origins.desc" },
    { key: "specialty", icon: Scale, titleKey: "library.specialty", descKey: "library.specialty.desc" },
    { key: "equipment", icon: Wrench, titleKey: "library.equipment", descKey: "library.equipment.desc" },
  ];

  const chemexContent = {
    fr: `La Chemex a été inventée en 1941 par Peter Schlumbohm. Son filtre épais en papier produit un café remarquablement propre et clair.\n\n**Ratio recommandé:** 1:15 (ex: 30g café pour 450ml d'eau)\n**Mouture:** Moyenne-grosse (comme du sel de mer)\n**Température:** 93-96°C\n**Temps total:** 4-5 minutes\n\n**Étapes:**\n1. Rincer le filtre avec de l'eau chaude\n2. Ajouter le café moulu\n3. Bloom: verser 60ml, attendre 30-45 secondes\n4. Verser en cercles concentriques par paliers\n5. Laisser filtrer complètement`,
    pt: `A Chemex foi inventada em 1941 por Peter Schlumbohm. Seu filtro de papel espesso produz um café notavelmente limpo e claro.\n\n**Proporção recomendada:** 1:15 (ex: 30g café para 450ml de água)\n**Moagem:** Média-grossa (como sal marinho)\n**Temperatura:** 93-96°C\n**Tempo total:** 4-5 minutos\n\n**Etapas:**\n1. Enxaguar o filtro com água quente\n2. Adicionar o café moído\n3. Bloom: despejar 60ml, esperar 30-45 segundos\n4. Despejar em círculos concêntricos em etapas\n5. Deixar filtrar completamente`,
  };

  const v60Content = {
    fr: `Le V60 de Hario tire son nom de son angle à 60 degrés. Les rainures en spirale favorisent un flux d'air et d'eau optimal.\n\n**Ratio recommandé:** 1:16 (ex: 15g café pour 240ml d'eau)\n**Mouture:** Moyenne-fine (comme du sable)\n**Température:** 90-94°C\n**Temps total:** 2:30-3:30 minutes\n\n**Technique de Tetsu Kasuya (4:6):**\n1. Diviser l'eau totale en 5 versements\n2. Les 2 premiers (40%) contrôlent le goût\n3. Les 3 derniers (60%) contrôlent la force`,
    pt: `O V60 da Hario leva o nome do seu ângulo de 60 graus. As ranhuras em espiral favorecem um fluxo de ar e água ideal.\n\n**Proporção recomendada:** 1:16 (ex: 15g café para 240ml de água)\n**Moagem:** Média-fina (como areia)\n**Temperatura:** 90-94°C\n**Tempo total:** 2:30-3:30 minutos\n\n**Técnica de Tetsu Kasuya (4:6):**\n1. Dividir a água total em 5 despejos\n2. Os 2 primeiros (40%) controlam o sabor\n3. Os 3 últimos (60%) controlam a força`,
  };

  const originsContent = {
    fr: `Le Brésil compte plus de 300 000 producteurs de café répartis en 6 grandes régions.\n\n**Principales régions:**\n- **Minas Gerais (Cerrado, Sul de Minas, Chapada):** Notes de chocolat, noix, caramel\n- **São Paulo (Mogiana):** Corps rond, doux, sucré\n- **Bahia:** Fruité, acidité vive\n- **Espírito Santo:** Principalement Robusta/Conilon\n- **Paraná:** Cerises mûres, corps moyen\n\n**Variétés brésiliennes populaires:**\nBourbon Amarelo, Catuaí, Mundo Novo, Acaiá`,
    pt: `O Brasil conta com mais de 300.000 produtores de café distribuídos em 6 grandes regiões.\n\n**Principais regiões:**\n- **Minas Gerais (Cerrado, Sul de Minas, Chapada):** Notas de chocolate, nozes, caramelo\n- **São Paulo (Mogiana):** Corpo redondo, suave, doce\n- **Bahia:** Frutado, acidez viva\n- **Espírito Santo:** Principalmente Robusta/Conilon\n- **Paraná:** Cerejas maduras, corpo médio\n\n**Variedades brasileiras populares:**\nBourbon Amarelo, Catuaí, Mundo Novo, Acaiá`,
  };

  const specialtyContent = {
    fr: `**Café de spécialité (score ≥ 80/100):**\n- Traçabilité complète (ferme, lot, variété)\n- Torréfaction artisanale récente\n- Profil aromatique complexe et distinct\n- Prix plus élevé, mais qualité supérieure\n\n**Café de supermarché:**\n- Mélange de origines souvent non tracées\n- Torréfaction industrielle (souvent foncée)\n- Profil standardisé\n- Prix bas, goût uniforme\n\nLa différence réside dans la qualité du grain vert, la torréfaction soignée et la fraîcheur.`,
    pt: `**Café especial (nota ≥ 80/100):**\n- Rastreabilidade completa (fazenda, lote, variedade)\n- Torra artesanal recente\n- Perfil aromático complexo e distinto\n- Preço mais alto, mas qualidade superior\n\n**Café de supermercado:**\n- Blend de origens frequentemente não rastreadas\n- Torra industrial (frequentemente escura)\n- Perfil padronizado\n- Preço baixo, sabor uniforme\n\nA diferença está na qualidade do grão verde, na torra cuidadosa e na frescura.`,
  };

  const equipmentContent = {
    fr: `**Équipement essentiel pour commencer:**\n\n1. **Moulin à meules** — Le plus important ! Un Timemore C2/C3 ou Comandante\n2. **Balance de précision** — 0,1g de précision (ex: Timemore Black Mirror)\n3. **Bouilloire col de cygne** — Contrôle du débit (ex: Fellow Stagg)\n4. **Dripper** — V60 ou Chemex pour commencer\n5. **Filtres** — Adaptés à votre dripper\n6. **Thermomètre** — Si votre bouilloire n'en a pas\n\n**Budget débutant:** ~100-150€\n**Budget intermédiaire:** ~250-400€`,
    pt: `**Equipamento essencial para começar:**\n\n1. **Moedor de rebarbas** — O mais importante! Um Timemore C2/C3 ou Comandante\n2. **Balança de precisão** — 0,1g de precisão (ex: Timemore Black Mirror)\n3. **Chaleira bico de ganso** — Controle de fluxo (ex: Fellow Stagg)\n4. **Dripper** — V60 ou Chemex para começar\n5. **Filtros** — Adequados ao seu dripper\n6. **Termômetro** — Se sua chaleira não tiver\n\n**Orçamento iniciante:** ~R$500-750\n**Orçamento intermediário:** ~R$1200-2000`,
  };

  const contentMap: Record<string, Record<string, string>> = {
    chemex: chemexContent,
    v60: v60Content,
    origins: originsContent,
    specialty: specialtyContent,
    equipment: equipmentContent,
  };

  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-full pb-20">
        <div className="px-4 pt-4 pb-2">
          <h1 className="font-serif text-xl font-bold">{t("library.title")}</h1>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="p-8 text-center max-w-sm mx-auto w-full">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-4">{t("library.locked")}</p>
            <Button asChild data-testid="button-library-login">
              <a href="/api/login">{t("nav.login")}</a>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-20">
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-serif text-xl font-bold" data-testid="text-library-title">{t("library.title")}</h1>
      </div>
      <div className="flex-1 px-4 space-y-3 pb-4">
        {modules.map((mod) => (
          <div key={mod.key}>
            <Card
              className="p-4 hover-elevate cursor-pointer"
              onClick={() => setExpandedModule(expandedModule === mod.key ? null : mod.key)}
              data-testid={`card-module-${mod.key}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <mod.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{t(mod.titleKey)}</h3>
                  <p className="text-xs text-muted-foreground truncate">{t(mod.descKey)}</p>
                </div>
                <ChevronRight className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${expandedModule === mod.key ? "rotate-90" : ""}`} />
              </div>
            </Card>
            {expandedModule === mod.key && (
              <Card className="p-4 mt-1 ml-2 border-l-2 border-l-primary" data-testid={`content-module-${mod.key}`}>
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line">
                  {contentMap[mod.key]?.[lang] || ""}
                </div>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
