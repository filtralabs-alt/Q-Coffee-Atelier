import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen, ChevronRight, Coffee, Beaker, MapPin, Scale, Wrench,
  ExternalLink, MessageCircle, Flame, LogIn,
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

const easeOut = [0.16, 1, 0.3, 1] as const;

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
};

export default function LibraryPage() {
  const { t, lang } = useI18n();
  const { isAuthenticated } = useAuth();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const { data: modules, isLoading } = useQuery<LibraryModule[]>({
    queryKey: ["/api/library-modules"],
  });

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
      {!isAuthenticated && (
        <div className="px-5 pb-2">
          <Card className="flex items-center justify-between gap-3 p-4 bg-primary/5 border-primary/20">
            <p className="text-xs text-muted-foreground">{t("library.loginPrompt")}</p>
            <Button asChild size="sm" className="shrink-0" data-testid="button-library-login">
              <Link href="/">
                <LogIn className="h-3.5 w-3.5 mr-1.5" />
                {t("nav.login")}
              </Link>
            </Button>
          </Card>
        </div>
      )}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-5 space-y-3 pb-4"
      >
        <motion.div variants={itemVariants}>
          <Link href="/library/torrefaction" className="block" data-testid="link-module-torrefaction">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }}>
              <Card className="relative overflow-hidden p-5 border-primary/20 bg-primary/5">
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-primary/5"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Flame className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{lang === "pt" ? "O grão e a torrefação" : "Le grain et la torréfaction"}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {lang === "pt" ? "Do grão verde ao 2º crack, animado" : "De la fève verte au 2e crack, animé"}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
              </Card>
            </motion.div>
          </Link>
        </motion.div>

        {modules?.map((mod) => {
          const IconComp = iconMap[mod.icon] || BookOpen;
          const title = lang === "pt" ? mod.titlePt : mod.titleFr;
          const desc = lang === "pt" ? mod.descPt : mod.descFr;
          const content = lang === "pt" ? mod.contentPt : mod.contentFr;

          if (mod.key === "v60" || mod.key === "chemex") {
            const href = mod.key === "v60" ? "/library/v60" : "/library/chemex";
            return (
              <motion.div key={mod.id} variants={itemVariants}>
                <Link href={href} className="block" data-testid={`link-module-${mod.key}`}>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }}>
                    <Card className="p-5 hover-elevate bg-primary/5 border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-primary/15 flex items-center justify-center flex-shrink-0">
                          <IconComp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            );
          }

          if (mod.externalUrl) {
            return (
              <motion.a
                key={mod.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985 }}
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
              </motion.a>
            );
          }

          const isExpanded = expandedModule === mod.id;

          return (
            <motion.div key={mod.id} variants={itemVariants}>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }}>
                <Card
                  className="p-5 hover-elevate cursor-pointer"
                  onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
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
                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.25, ease: easeOut }}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
              <AnimatePresence initial={false}>
                {isExpanded && content && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                    className="overflow-hidden"
                  >
                    <Card className="p-5 mt-2 ml-5" data-testid={`content-module-${mod.key}`}>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line">
                        {content}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {modules?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Aucun contenu disponible</p>
        )}
      </motion.div>
    </div>
  );
}
