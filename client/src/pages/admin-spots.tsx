import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CoffeeSpot } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
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

interface SpotForm {
  name: string;
  city: string;
  instagram: string;
  website: string;
  tags: string;
}

const emptyForm: SpotForm = { name: "", city: "", instagram: "", website: "", tags: "" };

export default function AdminSpotsPage() {
  const { t, lang } = useI18n();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SpotForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: spots, isLoading } = useQuery<CoffeeSpot[]>({
    queryKey: ["/api/coffee-spots"],
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        name: form.name,
        city: form.city,
        instagram: form.instagram || null,
        website: form.website || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        approved: true,
      };
      if (editingId) {
        await apiRequest("PATCH", `/api/coffee-spots/${editingId}`, data);
      } else {
        await apiRequest("POST", "/api/coffee-spots", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coffee-spots"] });
      toast({ title: lang === "fr" ? "Enregistré" : "Salvo" });
      closeForm();
    },
    onError: () => {
      toast({ title: t("common.error"), variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/coffee-spots/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coffee-spots"] });
      toast({ title: lang === "fr" ? "Supprimé" : "Excluído" });
      setDeleteId(null);
    },
  });

  const openEdit = (spot: CoffeeSpot) => {
    setEditingId(spot.id);
    setForm({
      name: spot.name,
      city: spot.city,
      instagram: spot.instagram || "",
      website: spot.website || "",
      tags: spot.tags?.join(", ") || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-full pb-20 px-4">
        <Card className="p-8 text-center max-w-sm w-full">
          <p className="text-muted-foreground mb-4">{t("library.locked")}</p>
          <Button asChild><a href="/api/login">{t("nav.login")}</a></Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-20">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
        <h1 className="font-serif text-xl font-bold" data-testid="text-admin-title">{t("admin.title")}</h1>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} data-testid="button-add-spot">
            <Plus className="h-4 w-4 mr-1.5" />
            {t("admin.addSpot")}
          </Button>
        )}
      </div>

      <div className="flex-1 px-4 space-y-3 pb-4">
        {showForm && (
          <Card className="p-4 space-y-3" data-testid="card-spot-form">
            <h3 className="font-semibold text-sm">{editingId ? t("admin.editSpot") : t("admin.addSpot")}</h3>
            <div className="space-y-2">
              <Label>{t("admin.name")} *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-testid="input-spot-name"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("admin.city")} *</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                data-testid="input-spot-city"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("admin.instagram")}</Label>
              <Input
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="@exemple"
                data-testid="input-spot-instagram"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("admin.website")}</Label>
              <Input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://..."
                data-testid="input-spot-website"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("admin.tags")}</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder={lang === "fr" ? "torréfacteur, brunch, wifi" : "torrefação, brunch, wifi"}
                data-testid="input-spot-tags"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={!form.name.trim() || !form.city.trim() || saveMutation.isPending}
                data-testid="button-save-spot"
              >
                <Save className="h-4 w-4 mr-1.5" />
                {t("admin.save")}
              </Button>
              <Button variant="outline" onClick={closeForm} data-testid="button-cancel-spot">
                <X className="h-4 w-4 mr-1.5" />
                {t("admin.cancel")}
              </Button>
            </div>
          </Card>
        )}

        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4"><Skeleton className="h-5 w-40" /></Card>
          ))
        ) : (
          spots?.map((spot) => (
            <Card key={spot.id} className="p-3 flex items-center justify-between gap-2" data-testid={`card-admin-spot-${spot.id}`}>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{spot.name}</p>
                <p className="text-xs text-muted-foreground">{spot.city}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(spot)} data-testid={`button-edit-spot-${spot.id}`}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(spot.id)} data-testid={`button-delete-spot-${spot.id}`}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.delete")}</AlertDialogTitle>
            <AlertDialogDescription>{lang === "fr" ? "Cette action est irréversible." : "Esta ação é irreversível."}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>{t("admin.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
