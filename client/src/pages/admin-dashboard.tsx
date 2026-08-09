import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CoffeeSpot, TastingEntry, LibraryModule, Atelier, AtelierTestimonial, AtelierReservation } from "@shared/schema";
import { ATELIER_THEMES, COFFEE_KNOWLEDGE_LEVELS, HOME_BREW_METHODS, EVENT_GOALS } from "@/lib/constants";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Users, Coffee, MapPin, Award, LogOut, Eye, EyeOff,
  Plus, Pencil, Trash2, Save, X, BookOpen, Calendar, Star, Check, Mail,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import logoIcon from "@assets/baristech-icon.png";
import logoIconWhite from "@assets/baristech-icon-white.png";

interface AdminStats {
  totalUsers: number;
  totalTastings: number;
  totalSpots: number;
  totalQuizzes: number;
}

interface UserInfo {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string | null;
}

interface SpotForm {
  name: string;
  city: string;
  instagram: string;
  website: string;
  tags: string;
  featured: boolean;
  featuredLinkUrl: string;
  featuredImageUrl: string;
}

const emptyForm: SpotForm = {
  name: "", city: "", instagram: "", website: "", tags: "",
  featured: false, featuredLinkUrl: "", featuredImageUrl: "",
};

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("Email ou mot de passe incorrect");
        return;
      }
      onLogin();
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-background px-4">
      <Card className="w-full max-w-sm p-6 space-y-6">
        <div className="text-center space-y-2">
          <img src={logoIcon} alt="O Baristech" className="h-12 w-12 mx-auto block dark:hidden" />
          <img src={logoIconWhite} alt="O Baristech" className="h-12 w-12 mx-auto hidden dark:block" />
          <h1 className="font-serif text-xl font-semibold" data-testid="text-admin-login-title">Administration</h1>
          <p className="text-sm text-muted-foreground">Panneau de gestion Baristech</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-admin-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
                data-testid="input-admin-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive" data-testid="text-login-error">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading} data-testid="button-admin-login">
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function StatsCards({ stats }: { stats: AdminStats }) {
  const items = [
    { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "text-blue-600 dark:text-blue-400" },
    { label: "Dégustations", value: stats.totalTastings, icon: Coffee, color: "text-amber-600 dark:text-amber-400" },
    { label: "Coffee Spots", value: stats.totalSpots, icon: MapPin, color: "text-green-600 dark:text-green-400" },
    { label: "Quiz complétés", value: stats.totalQuizzes, icon: Award, color: "text-purple-600 dark:text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <Card key={item.label} className="p-4" data-testid={`card-stat-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
          <div className="flex items-center gap-3">
            <div className={`${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function UsersTab() {
  const { data: users, isLoading } = useQuery<UserInfo[]>({ queryKey: ["/api/admin/users"] });

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;

  return (
    <div className="space-y-2">
      {users?.map((user) => (
        <Card key={user.id} className="p-3 flex items-center justify-between gap-2" data-testid={`card-user-${user.id}`}>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {user.firstName || ""} {user.lastName || ""}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email || "—"}</p>
          </div>
          <p className="text-xs text-muted-foreground shrink-0">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR") : "—"}
          </p>
        </Card>
      ))}
      {users?.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aucun utilisateur</p>}
    </div>
  );
}

function TastingsTab() {
  const { data: tastings, isLoading } = useQuery<TastingEntry[]>({ queryKey: ["/api/admin/tastings"] });

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;

  return (
    <div className="space-y-2">
      {tastings?.map((t) => (
        <Card key={t.id} className="p-3" data-testid={`card-tasting-${t.id}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{t.coffeeName}</p>
              <p className="text-xs text-muted-foreground">{t.method} {t.origin ? `· ${t.origin}` : ""}</p>
            </div>
            <p className="text-xs text-muted-foreground shrink-0">
              {t.createdAt ? new Date(t.createdAt).toLocaleDateString("fr-FR") : "—"}
            </p>
          </div>
        </Card>
      ))}
      {tastings?.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aucune dégustation</p>}
    </div>
  );
}

function SpotsTab() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SpotForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: spots, isLoading } = useQuery<CoffeeSpot[]>({ queryKey: ["/api/admin/coffee-spots"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        name: form.name,
        city: form.city,
        instagram: form.instagram || null,
        website: form.website || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        approved: true,
        featured: form.featured,
        featuredLinkUrl: form.featured ? form.featuredLinkUrl || null : null,
        featuredImageUrl: form.featured ? form.featuredImageUrl || null : null,
      };
      if (editingId) {
        await apiRequest("PATCH", `/api/admin/coffee-spots/${editingId}`, data);
      } else {
        await apiRequest("POST", "/api/admin/coffee-spots", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coffee-spots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/coffee-spots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Enregistré" });
      closeForm();
    },
    onError: () => {
      toast({ title: "Erreur", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/coffee-spots/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coffee-spots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/coffee-spots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Supprimé" });
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
      featured: spot.featured,
      featuredLinkUrl: spot.featuredLinkUrl || "",
      featuredImageUrl: spot.featuredImageUrl || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;

  return (
    <div className="space-y-3">
      {!showForm && (
        <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} data-testid="button-admin-add-spot">
          <Plus className="h-4 w-4 mr-1.5" />
          Ajouter un spot
        </Button>
      )}

      {showForm && (
        <Card className="p-4 space-y-3" data-testid="card-admin-spot-form">
          <h3 className="font-semibold text-sm">{editingId ? "Modifier" : "Nouveau spot"}</h3>
          <div className="space-y-2">
            <Label>Nom *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-admin-spot-name" />
          </div>
          <div className="space-y-2">
            <Label>Ville *</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} data-testid="input-admin-spot-city" />
          </div>
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@exemple" data-testid="input-admin-spot-instagram" />
          </div>
          <div className="space-y-2">
            <Label>Site web</Label>
            <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." data-testid="input-admin-spot-website" />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="torréfacteur, brunch, wifi" data-testid="input-admin-spot-tags" />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label>Loja online (carrossel)</Label>
              <p className="text-xs text-muted-foreground">Aparece no carrossel de destaques da página Spots</p>
            </div>
            <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} data-testid="switch-admin-spot-featured" />
          </div>
          {form.featured && (
            <>
              <div className="space-y-2">
                <Label>Link de destino (checkout, produto...)</Label>
                <Input
                  value={form.featuredLinkUrl}
                  onChange={(e) => setForm({ ...form, featuredLinkUrl: e.target.value })}
                  placeholder="https://exemple.com/produit"
                  data-testid="input-admin-spot-featured-link"
                />
              </div>
              <div className="space-y-2">
                <Label>Image du banner (URL)</Label>
                <Input
                  value={form.featuredImageUrl}
                  onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })}
                  placeholder="https://exemple.com/image.jpg"
                  data-testid="input-admin-spot-featured-image"
                />
              </div>
            </>
          )}
          <div className="flex items-center gap-2 pt-1">
            <Button onClick={() => saveMutation.mutate()} disabled={!form.name.trim() || !form.city.trim() || saveMutation.isPending} data-testid="button-admin-save-spot">
              <Save className="h-4 w-4 mr-1.5" />
              Enregistrer
            </Button>
            <Button variant="outline" onClick={closeForm} data-testid="button-admin-cancel-spot">
              <X className="h-4 w-4 mr-1.5" />
              Annuler
            </Button>
          </div>
        </Card>
      )}

      {spots?.map((spot) => (
        <Card key={spot.id} className="p-3 flex items-center justify-between gap-2" data-testid={`card-admin-spot-${spot.id}`}>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate flex items-center gap-1.5">
              {spot.name}
              {spot.featured && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Loja online</span>}
            </p>
            <p className="text-xs text-muted-foreground">
              {spot.city}
              {spot.featured && ` · ${spot.clickCount} clique(s)`}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => openEdit(spot)} data-testid={`button-admin-edit-spot-${spot.id}`}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(spot.id)} data-testid={`button-admin-delete-spot-${spot.id}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce spot ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ModuleForm {
  key: string;
  titleFr: string;
  titlePt: string;
  descFr: string;
  descPt: string;
  contentFr: string;
  contentPt: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  externalUrl: string;
}

const emptyModuleForm: ModuleForm = {
  key: "", titleFr: "", titlePt: "", descFr: "", descPt: "",
  contentFr: "", contentPt: "", icon: "book-open", sortOrder: 0,
  isActive: true, externalUrl: "",
};

function LibraryTab() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ModuleForm>(emptyModuleForm);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: modules, isLoading } = useQuery<LibraryModule[]>({ queryKey: ["/api/admin/library-modules"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        key: form.key,
        titleFr: form.titleFr,
        titlePt: form.titlePt,
        descFr: form.descFr,
        descPt: form.descPt,
        contentFr: form.contentFr,
        contentPt: form.contentPt,
        icon: form.icon,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
        externalUrl: form.externalUrl || null,
      };
      if (editingId) {
        await apiRequest("PATCH", `/api/admin/library-modules/${editingId}`, data);
      } else {
        await apiRequest("POST", "/api/admin/library-modules", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/library-modules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/library-modules"] });
      toast({ title: "Enregistré" });
      closeForm();
    },
    onError: () => {
      toast({ title: "Erreur", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/library-modules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/library-modules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/library-modules"] });
      toast({ title: "Supprimé" });
      setDeleteId(null);
    },
  });

  const openEdit = (mod: LibraryModule) => {
    setEditingId(mod.id);
    setForm({
      key: mod.key,
      titleFr: mod.titleFr,
      titlePt: mod.titlePt,
      descFr: mod.descFr,
      descPt: mod.descPt,
      contentFr: mod.contentFr,
      contentPt: mod.contentPt,
      icon: mod.icon,
      sortOrder: mod.sortOrder,
      isActive: mod.isActive,
      externalUrl: mod.externalUrl || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyModuleForm);
  };

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;

  return (
    <div className="space-y-3">
      {!showForm && (
        <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyModuleForm); }} data-testid="button-admin-add-module">
          <Plus className="h-4 w-4 mr-1.5" />
          Ajouter un module
        </Button>
      )}

      {showForm && (
        <Card className="p-4 space-y-3" data-testid="card-admin-module-form">
          <h3 className="font-semibold text-sm">{editingId ? "Modifier le module" : "Nouveau module"}</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Clé unique *</Label>
              <Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="mon-module" disabled={!!editingId} data-testid="input-module-key" />
            </div>
            <div className="space-y-1.5">
              <Label>Icône</Label>
              <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="book-open" data-testid="input-module-icon" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Titre FR *</Label>
              <Input value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} data-testid="input-module-title-fr" />
            </div>
            <div className="space-y-1.5">
              <Label>Titre PT *</Label>
              <Input value={form.titlePt} onChange={(e) => setForm({ ...form, titlePt: e.target.value })} data-testid="input-module-title-pt" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Description FR *</Label>
              <Input value={form.descFr} onChange={(e) => setForm({ ...form, descFr: e.target.value })} data-testid="input-module-desc-fr" />
            </div>
            <div className="space-y-1.5">
              <Label>Description PT *</Label>
              <Input value={form.descPt} onChange={(e) => setForm({ ...form, descPt: e.target.value })} data-testid="input-module-desc-pt" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Contenu FR</Label>
            <Textarea value={form.contentFr} onChange={(e) => setForm({ ...form, contentFr: e.target.value })} className="min-h-[120px] text-sm" data-testid="input-module-content-fr" />
          </div>

          <div className="space-y-1.5">
            <Label>Contenu PT</Label>
            <Textarea value={form.contentPt} onChange={(e) => setForm({ ...form, contentPt: e.target.value })} className="min-h-[120px] text-sm" data-testid="input-module-content-pt" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>URL externe (optionnel)</Label>
              <Input value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} placeholder="https://..." data-testid="input-module-url" />
            </div>
            <div className="space-y-1.5">
              <Label>Ordre</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} data-testid="input-module-order" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} data-testid="switch-module-active" />
            <Label>Actif</Label>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button onClick={() => saveMutation.mutate()} disabled={!form.key.trim() || !form.titleFr.trim() || !form.titlePt.trim() || !form.descFr.trim() || !form.descPt.trim() || saveMutation.isPending} data-testid="button-admin-save-module">
              <Save className="h-4 w-4 mr-1.5" />
              Enregistrer
            </Button>
            <Button variant="outline" onClick={closeForm} data-testid="button-admin-cancel-module">
              <X className="h-4 w-4 mr-1.5" />
              Annuler
            </Button>
          </div>
        </Card>
      )}

      {modules?.map((mod) => (
        <Card key={mod.id} className={`p-3 flex items-center justify-between gap-2 ${!mod.isActive ? "opacity-50" : ""}`} data-testid={`card-admin-module-${mod.id}`}>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{mod.titleFr}</p>
            <p className="text-xs text-muted-foreground">{mod.key} · ordre {mod.sortOrder}{mod.externalUrl ? " · lien externe" : ""}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => openEdit(mod)} data-testid={`button-admin-edit-module-${mod.id}`}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(mod.id)} data-testid={`button-admin-delete-module-${mod.id}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce module ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface AtelierForm {
  theme: string;
  descriptionFr: string;
  descriptionPt: string;
  coffees: string;
  dateTime: string;
  location: string;
  price: string;
  totalSeats: string;
  seatsAvailable: string;
}

const emptyAtelierForm: AtelierForm = {
  theme: ATELIER_THEMES[0].id,
  descriptionFr: "",
  descriptionPt: "",
  coffees: "",
  dateTime: "",
  location: "",
  price: "",
  totalSeats: "",
  seatsAvailable: "",
};

function toDateTimeLocal(iso: string | Date) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function AtelierReservationsDialog({ atelier, onClose }: { atelier: Atelier; onClose: () => void }) {
  const { toast } = useToast();
  const { data: reservations, isLoading } = useQuery<AtelierReservation[]>({
    queryKey: [`/api/admin/ateliers/${atelier.id}/reservations`],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/reservations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/ateliers/${atelier.id}/reservations`] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ateliers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ateliers"] });
      toast({ title: "Réservation annulée" });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/reservations/${id}/confirm`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/ateliers/${atelier.id}/reservations`] });
      toast({ title: "Confirmation envoyée par e-mail" });
    },
    onError: () => {
      toast({ title: "Échec de l'envoi de la confirmation", variant: "destructive" });
    },
  });

  const totalSeats = reservations?.reduce((sum, r) => sum + r.seats, 0) ?? 0;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent data-testid="dialog-admin-reservations">
        <DialogHeader>
          <DialogTitle>
            Réservations · {ATELIER_THEMES.find((t) => t.id === atelier.theme)?.fr || atelier.theme}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : reservations?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucune réservation pour le moment</p>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            <p className="text-xs text-muted-foreground">{totalSeats} personne(s) inscrite(s)</p>
            {reservations?.map((r) => (
              <Card key={r.id} className="p-3 space-y-1" data-testid={`card-admin-reservation-${r.id}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{r.name} · {r.seats} pers.</p>
                    <p className="text-xs text-muted-foreground truncate">{r.email}{r.phone ? ` · ${r.phone}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {r.status === "confirmed" ? (
                      <span className="text-[10px] text-primary flex items-center gap-1 whitespace-nowrap">
                        <Check className="h-3 w-3" /> Autorisé
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmMutation.mutate(r.id)}
                        disabled={confirmMutation.isPending}
                        data-testid={`button-admin-confirm-reservation-${r.id}`}
                        title="Autoriser et envoyer la confirmation par e-mail"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(r.id)}
                      data-testid={`button-admin-cancel-reservation-${r.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {(r.coffeeKnowledge || r.homeBrewMethod || r.companyName || r.eventGoal || (r.childAges && r.childAges.length > 0) || r.parentAccompanying != null) && (
                  <div className="flex flex-wrap gap-1">
                    {r.coffeeKnowledge && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                        {COFFEE_KNOWLEDGE_LEVELS.find((l) => l.id === r.coffeeKnowledge)?.fr || r.coffeeKnowledge}
                      </span>
                    )}
                    {r.homeBrewMethod && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                        {HOME_BREW_METHODS.find((m) => m.id === r.homeBrewMethod)?.fr || r.homeBrewMethod}
                      </span>
                    )}
                    {r.companyName && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{r.companyName}</span>
                    )}
                    {r.eventGoal && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                        {EVENT_GOALS.find((g) => g.id === r.eventGoal)?.fr || r.eventGoal}
                      </span>
                    )}
                    {r.childAges && r.childAges.length > 0 && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{r.childAges.join(", ")} ans</span>
                    )}
                    {r.parentAccompanying != null && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                        {r.parentAccompanying ? "Avec parent" : "Sans parent"}
                      </span>
                    )}
                  </div>
                )}
                {r.learningGoal && (
                  <p className="text-xs text-muted-foreground"><span className="font-medium">Souhait :</span> {r.learningGoal}</p>
                )}
                {r.message && <p className="text-xs text-muted-foreground italic">"{r.message}"</p>}
                <p className={`text-[10px] flex items-center gap-1 ${r.policyAccepted ? "text-muted-foreground" : "text-destructive"}`}>
                  {r.policyAccepted ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {r.policyAccepted ? "Politique de paiement/annulation acceptée" : "Politique non acceptée"}
                </p>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AteliersTab() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AtelierForm>(emptyAtelierForm);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [reservationsAtelier, setReservationsAtelier] = useState<Atelier | null>(null);

  const { data: items, isLoading } = useQuery<Atelier[]>({ queryKey: ["/api/admin/ateliers"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        theme: form.theme,
        descriptionFr: form.descriptionFr || null,
        descriptionPt: form.descriptionPt || null,
        coffees: form.coffees ? form.coffees.split(",").map((c) => c.trim()).filter(Boolean) : [],
        dateTime: new Date(form.dateTime).toISOString(),
        location: form.location,
        price: form.price || null,
        totalSeats: form.totalSeats ? parseInt(form.totalSeats) : null,
        seatsAvailable: form.seatsAvailable ? parseInt(form.seatsAvailable) : null,
      };
      if (editingId) {
        await apiRequest("PATCH", `/api/admin/ateliers/${editingId}`, data);
      } else {
        await apiRequest("POST", "/api/admin/ateliers", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ateliers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ateliers"] });
      toast({ title: "Enregistré" });
      closeForm();
    },
    onError: () => {
      toast({ title: "Erreur", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/ateliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ateliers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ateliers"] });
      toast({ title: "Supprimé" });
      setDeleteId(null);
    },
  });

  const openEdit = (item: Atelier) => {
    setEditingId(item.id);
    setForm({
      theme: item.theme,
      descriptionFr: item.descriptionFr || "",
      descriptionPt: item.descriptionPt || "",
      coffees: item.coffees?.join(", ") || "",
      dateTime: toDateTimeLocal(item.dateTime),
      location: item.location,
      price: item.price || "",
      totalSeats: item.totalSeats?.toString() || "",
      seatsAvailable: item.seatsAvailable?.toString() || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyAtelierForm);
  };

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;

  return (
    <div className="space-y-3">
      {!showForm && (
        <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyAtelierForm); }} data-testid="button-admin-add-atelier">
          <Plus className="h-4 w-4 mr-1.5" />
          Ajouter un atelier
        </Button>
      )}

      {showForm && (
        <Card className="p-4 space-y-3" data-testid="card-admin-atelier-form">
          <h3 className="font-semibold text-sm">{editingId ? "Modifier l'atelier" : "Nouvel atelier"}</h3>

          <div className="space-y-1.5">
            <Label>Thème *</Label>
            <Select value={form.theme} onValueChange={(v) => setForm({ ...form, theme: v })}>
              <SelectTrigger data-testid="select-admin-atelier-theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ATELIER_THEMES.map((th) => (
                  <SelectItem key={th.id} value={th.id}>{th.fr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Description FR</Label>
              <Textarea value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} className="text-sm" data-testid="input-admin-atelier-desc-fr" />
            </div>
            <div className="space-y-1.5">
              <Label>Description PT</Label>
              <Textarea value={form.descriptionPt} onChange={(e) => setForm({ ...form, descriptionPt: e.target.value })} className="text-sm" data-testid="input-admin-atelier-desc-pt" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Cafés / origines (séparés par des virgules)</Label>
            <Input value={form.coffees} onChange={(e) => setForm({ ...form, coffees: e.target.value })} placeholder="Éthiopie Sidamo, Brésil Cerrado" data-testid="input-admin-atelier-coffees" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date et heure *</Label>
              <Input type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} data-testid="input-admin-atelier-datetime" />
            </div>
            <div className="space-y-1.5">
              <Label>Lieu *</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} data-testid="input-admin-atelier-location" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Prix</Label>
              <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="35€" data-testid="input-admin-atelier-price" />
            </div>
            <div className="space-y-1.5">
              <Label>Places totales</Label>
              <Input type="number" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} data-testid="input-admin-atelier-total-seats" />
            </div>
            <div className="space-y-1.5">
              <Label>Places disponibles</Label>
              <Input type="number" value={form.seatsAvailable} onChange={(e) => setForm({ ...form, seatsAvailable: e.target.value })} data-testid="input-admin-atelier-seats-available" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button onClick={() => saveMutation.mutate()} disabled={!form.theme || !form.location.trim() || !form.dateTime || saveMutation.isPending} data-testid="button-admin-save-atelier">
              <Save className="h-4 w-4 mr-1.5" />
              Enregistrer
            </Button>
            <Button variant="outline" onClick={closeForm} data-testid="button-admin-cancel-atelier">
              <X className="h-4 w-4 mr-1.5" />
              Annuler
            </Button>
          </div>
        </Card>
      )}

      {items?.map((item) => (
        <Card key={item.id} className="p-3 flex items-center justify-between gap-2" data-testid={`card-admin-atelier-${item.id}`}>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{ATELIER_THEMES.find((t) => t.id === item.theme)?.fr || item.theme}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(item.dateTime).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })} · {item.location}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => setReservationsAtelier(item)} data-testid={`button-admin-reservations-atelier-${item.id}`}>
              <Users className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openEdit(item)} data-testid={`button-admin-edit-atelier-${item.id}`}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(item.id)} data-testid={`button-admin-delete-atelier-${item.id}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}
      {items?.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aucun atelier</p>}

      {reservationsAtelier && (
        <AtelierReservationsDialog atelier={reservationsAtelier} onClose={() => setReservationsAtelier(null)} />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet atelier ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TestimonialsTab() {
  const { toast } = useToast();
  const [rejectId, setRejectId] = useState<string | null>(null);

  const { data: items, isLoading } = useQuery<AtelierTestimonial[]>({ queryKey: ["/api/admin/testimonials"] });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      await apiRequest("PATCH", `/api/admin/testimonials/${id}`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Mis à jour" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Supprimé" });
      setRejectId(null);
    },
  });

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>;

  const pending = items?.filter((i) => !i.approved) ?? [];
  const approved = items?.filter((i) => i.approved) ?? [];

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">En attente ({pending.length})</h3>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">Aucun avis en attente</p>
        ) : (
          <div className="space-y-2">
            {pending.map((rev) => (
              <Card key={rev.id} className="p-3 space-y-2" data-testid={`card-admin-testimonial-${rev.id}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{rev.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{rev.email}</p>
                  </div>
                  {rev.rating != null && (
                    <span className="flex shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < (rev.rating ?? 0) ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
                      ))}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground italic">"{rev.comment}"</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => approveMutation.mutate({ id: rev.id, approved: true })} data-testid={`button-approve-testimonial-${rev.id}`}>
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Approuver
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => setRejectId(rev.id)} data-testid={`button-reject-testimonial-${rev.id}`}>
                    <X className="h-3.5 w-3.5 mr-1.5" />
                    Rejeter
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Publiés ({approved.length})</h3>
        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">Aucun avis publié</p>
        ) : (
          <div className="space-y-2">
            {approved.map((rev) => (
              <Card key={rev.id} className="p-3 flex items-center justify-between gap-2" data-testid={`card-admin-approved-testimonial-${rev.id}`}>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{rev.name}</p>
                  <p className="text-xs text-muted-foreground italic truncate">"{rev.comment}"</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => approveMutation.mutate({ id: rev.id, approved: false })} data-testid={`button-unpublish-testimonial-${rev.id}`}>
                  <EyeOff className="h-3.5 w-3.5" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeter cet avis ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible et supprimera l'avis.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => rejectId && deleteMutation.mutate(rejectId)}>Rejeter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { toast } = useToast();

  const { isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/admin/session"],
    queryFn: async () => {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setIsLoggedIn(data.isAdmin);
      return data;
    },
  });

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isLoggedIn === true,
  });

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsLoggedIn(false);
    queryClient.clear();
    toast({ title: "Déconnecté" });
  };

  if (sessionLoading || isLoggedIn === null) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-background">
        <div className="animate-pulse text-center space-y-3">
          <img src={logoIcon} alt="O Baristech" className="h-12 w-12 mx-auto block dark:hidden" />
          <img src={logoIconWhite} alt="O Baristech" className="h-12 w-12 mx-auto hidden dark:block" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <header className="flex items-center justify-between gap-2 px-5 py-3 border-b border-border/50 bg-background/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5">
          <img src={logoIcon} alt="" className="h-7 w-7 block dark:hidden" />
          <img src={logoIconWhite} alt="" className="h-7 w-7 hidden dark:block" />
          <h1 className="font-serif text-lg font-semibold" data-testid="text-admin-dashboard-title">Administration</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-admin-logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-2xl mx-auto px-5 py-5 space-y-5">
          {stats && <StatsCards stats={stats} />}

          <Tabs defaultValue="spots" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="spots" className="flex-1" data-testid="tab-admin-spots">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                Spots
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1" data-testid="tab-admin-users">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="tastings" className="flex-1" data-testid="tab-admin-tastings">
                <Coffee className="h-3.5 w-3.5 mr-1.5" />
                Dégust.
              </TabsTrigger>
              <TabsTrigger value="library" className="flex-1" data-testid="tab-admin-library">
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                Biblio.
              </TabsTrigger>
              <TabsTrigger value="ateliers" className="flex-1" data-testid="tab-admin-ateliers">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Ateliers
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex-1" data-testid="tab-admin-testimonials">
                <Star className="h-3.5 w-3.5 mr-1.5" />
                Avis
              </TabsTrigger>
            </TabsList>
            <TabsContent value="spots" className="mt-3">
              <SpotsTab />
            </TabsContent>
            <TabsContent value="users" className="mt-3">
              <UsersTab />
            </TabsContent>
            <TabsContent value="tastings" className="mt-3">
              <TastingsTab />
            </TabsContent>
            <TabsContent value="library" className="mt-3">
              <LibraryTab />
            </TabsContent>
            <TabsContent value="ateliers" className="mt-3">
              <AteliersTab />
            </TabsContent>
            <TabsContent value="testimonials" className="mt-3">
              <TestimonialsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
