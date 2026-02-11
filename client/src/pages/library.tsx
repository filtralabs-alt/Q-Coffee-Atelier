import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen, Lock, ChevronRight, Coffee, Beaker, MapPin, Scale, Wrench,
  ExternalLink, MessageCircle,
} from "lucide-react";
import type { LibraryModule } from "@shared/schema";

const iconMap: Record<string, any> = {
  "book-open": BookOpen,
  "coffee": Coffee,
  "beaker": Beaker,
  "map-pin": MapPin,
  "scale": Scale,
  "wrench": Wrench,
  "message-circle": MessageCircle,
};

export default function LibraryPage() {
  const { t, lang } = useI18n();
  const { isAuthenticated } = useAuth();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const { data: modules, isLoading } = useQuery<LibraryModule[]>({
    queryKey: ["/api/library-modules"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="px-5 pt-5 pb-4">
          <h1 className="font-serif text-xl font-semibold">{t("library.title")}</h1>
        </div>
        <div className="flex-1 flex items-center justify-center px-5">
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

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="px-5 pt-5 pb-4">
          <h1 className="font-serif text-xl font-semibold" data-testid="text-library-title">{t("library.title")}</h1>
        </div>
        <div className="flex-1 px-5 space-y-3 pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-5 pb-4">
        <h1 className="font-serif text-xl font-semibold" data-testid="text-library-title">{t("library.title")}</h1>
      </div>
      <div className="flex-1 px-5 space-y-3 pb-4">
        {modules?.map((mod) => {
          const IconComp = iconMap[mod.icon] || BookOpen;
          const title = lang === "pt" ? mod.titlePt : mod.titleFr;
          const desc = lang === "pt" ? mod.descPt : mod.descFr;
          const content = lang === "pt" ? mod.contentPt : mod.contentFr;

          if (mod.externalUrl) {
            return (
              <a
                key={mod.id}
                href={mod.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                data-testid={`link-module-${mod.key}`}
              >
                <Card className="p-5 hover-elevate bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <IconComp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{title}</h3>
                      <p className="text-xs text-muted-foreground truncate">{desc}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                </Card>
              </a>
            );
          }

          return (
            <div key={mod.id}>
              <Card
                className="p-5 hover-elevate cursor-pointer"
                onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                data-testid={`card-module-${mod.key}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{desc}</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${expandedModule === mod.id ? "rotate-90" : ""}`} />
                </div>
              </Card>
              {expandedModule === mod.id && content && (
                <Card className="p-5 mt-2 ml-5" data-testid={`content-module-${mod.key}`}>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line">
                    {content}
                  </div>
                </Card>
              )}
            </div>
          );
        })}

        {modules?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Aucun contenu disponible</p>
        )}
      </div>
    </div>
  );
}
