import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { Q_COFFEE_GO_URL, AROMA_TAGS } from "@/lib/constants";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { TastingEntry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, ExternalLink, Trash2, Coffee, Droplets, Flame, Candy } from "lucide-react";
import { TastingWizard } from "@/components/tasting-wizard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function JournalPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showWizard, setShowWizard] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: entries, isLoading } = useQuery<TastingEntry[]>({
    queryKey: ["/api/tastings"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tastings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tastings"] });
      toast({ title: lang === "fr" ? "Supprimé" : "Excluído" });
      setDeleteId(null);
    },
  });

  const getAromaLabel = (id: string) => {
    const tag = AROMA_TAGS.find((a) => a.id === id);
    return tag ? tag[lang] : id;
  };

  const drinkAgainLabel = (val: string | null) => {
    if (val === "yes") return t("journal.yes");
    if (val === "no") return t("journal.no");
    return t("journal.maybe");
  };

  if (showWizard) {
    return <TastingWizard onClose={() => setShowWizard(false)} />;
  }

  return (
    <div className="flex flex-col min-h-full pb-20">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
        <h1 className="font-serif text-xl font-bold" data-testid="text-journal-title">{t("journal.title")}</h1>
        <Button onClick={() => setShowWizard(true)} data-testid="button-new-tasting">
          <Plus className="h-4 w-4 mr-1.5" />
          {t("journal.add")}
        </Button>
      </div>

      <div className="px-4 pb-2">
        <Button variant="outline" size="sm" asChild data-testid="button-qcoffee-global">
          <a href={Q_COFFEE_GO_URL} target="_blank" rel="noopener noreferrer">
            {t("journal.evaluate")} <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </a>
        </Button>
      </div>

      <div className="flex-1 px-4 space-y-3 pb-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </Card>
          ))
        ) : !entries?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Coffee className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{t("journal.empty")}</p>
          </div>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="p-4" data-testid={`card-tasting-${entry.id}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-sm" data-testid={`text-coffee-name-${entry.id}`}>{entry.coffeeName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {entry.method}{entry.methodOther ? ` — ${entry.methodOther}` : ""}
                    {entry.origin ? ` · ${entry.origin}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground"
                    onClick={() => setDeleteId(entry.id)}
                    data-testid={`button-delete-${entry.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Droplets className="h-3 w-3" /> {entry.acidity}/5</span>
                <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {entry.bitterness}/5</span>
                <span className="flex items-center gap-1"><Candy className="h-3 w-3" /> {entry.sweetness}/5</span>
              </div>

              {entry.aromaTags && entry.aromaTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {entry.aromaTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{getAromaLabel(tag)}</Badge>
                  ))}
                </div>
              )}

              {entry.notes && (
                <p className="text-xs text-muted-foreground italic mb-2 line-clamp-2">{entry.notes}</p>
              )}

              <div className="flex items-center justify-between gap-2 pt-1 border-t">
                <span className="text-xs text-muted-foreground">
                  {t("journal.drinkAgain")} <span className="font-medium text-foreground">{drinkAgainLabel(entry.wouldDrinkAgain)}</span>
                </span>
                <Button variant="ghost" size="sm" asChild className="h-7 text-xs" data-testid={`button-qcoffee-${entry.id}`}>
                  <a href={Q_COFFEE_GO_URL} target="_blank" rel="noopener noreferrer">
                    Q Coffee Go <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>

              <div className="text-[10px] text-muted-foreground mt-1">
                {entry.createdAt && new Date(entry.createdAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "pt-BR")}
              </div>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("journal.delete")}</AlertDialogTitle>
            <AlertDialogDescription>{t("journal.deleteConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              {t("journal.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
