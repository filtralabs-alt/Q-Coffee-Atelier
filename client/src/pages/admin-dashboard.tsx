import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CoffeeSpot, TastingEntry } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Coffee, MapPin, Award, LogOut, Eye, EyeOff,
  Plus, Pencil, Trash2, Save, X,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoIcon from "@assets/cris-du-cafe-icon.png";

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
}

const emptyForm: SpotForm = { name: "", city: "", instagram: "", website: "", tags: "" };

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
          <img src={logoIcon} alt="Cris Du Café" className="h-12 w-12 mx-auto" />
          <h1 className="font-serif text-xl font-bold" data-testid="text-admin-login-title">Administration</h1>
          <p className="text-sm text-muted-foreground">Panneau de gestion Cris Du Café</p>
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
            <p className="font-medium text-sm truncate">{spot.name}</p>
            <p className="text-xs text-muted-foreground">{spot.city}</p>
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
          <img src={logoIcon} alt="Cris Du Café" className="h-12 w-12 mx-auto" />
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
      <header className="flex items-center justify-between gap-2 px-4 py-3 border-b bg-card/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="" className="h-7 w-7" />
          <h1 className="font-serif text-lg font-bold" data-testid="text-admin-dashboard-title">Administration</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-admin-logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
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
                Dégustations
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
          </Tabs>
        </div>
      </main>
    </div>
  );
}
